"""
Pipeline de Transformación y Reconciliación Financiera en Python (Pandas)
========================================================================
Este módulo sustituye el pipeline original escrito en Power Query (Lenguaje M).
Replica la ingesta ETL, consolidación, agregación simplificada y reglas de auditoría
para la detección de anomalías en ventas y reembolsos.

Autor: Generado automáticamente
Fecha: 2026
"""

import os
import pathlib
import pandas as pd


# ==============================================================================
# 1. INGESTA Y LIMPIEZA AUXILIAR DE ARCHIVOS CSV (Equivalente a 'Parámetro1' y 'Data_MM-YYYY')
# ==============================================================================

def cargar_y_limpiar_csv(file_path: str) -> pd.DataFrame:
    """
    Carga un archivo CSV mensual individual y realiza la limpieza inicial:
    - Lectura con codificación Windows-1252 (cp1252) y separador de comas.
    - Conversión de formato numérico (remplaza comas decimales por puntos).
    - Asignación estricta de tipos de datos datetime, date y enteros.
    
    Equivale a las transformaciones realizadas en la función 'Transformar archivo'
    y las consultas 'Data_MM-YYYY' en Power Query.
    """
    # 1. Lectura inicial como texto para evitar pérdida de formato en números con comas/puntos
    df = pd.read_csv(
        file_path,
        sep=",",
        encoding="cp1252",
        dtype=str,
        quotechar='"'
    )
    
    # 2. Reemplazo de delimitadores decimales: Power Query cambiaba '.' por ',' para la configuración regional ES.
    # En Python/Pandas, los números de punto flotante requieren el punto '.' como separador decimal.
    cols_num = ["amount", "amount_in_major_units", "payout_amount", "payout_amount_in_major_units"]
    for col in cols_num:
        if col in df.columns:
            # Si el valor contiene comas decimales, se convierten a puntos para pd.to_numeric
            df[col] = (
                df[col]
                .astype(str)
                .str.replace(".", "", regex=False)   # Elimina separadores de miles si los hubiera
                .str.replace(",", ".", regex=False)   # Convierte coma decimal a punto
            )
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # 3. Conversión de campos de fecha y hora
    cols_datetime = ["created_at", "transaction_datetime_provider", "transaction_datetime_utc"]
    for col in cols_datetime:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors="coerce")
            
    if "accounting_date" in df.columns:
        df["accounting_date"] = pd.to_datetime(df["accounting_date"], errors="coerce").dt.date

    # 4. Conversión de campos enteros e identificadores
    cols_int = ["currency_minor_units", "payout_currency_minor_units", "chargeback_id"]
    for col in cols_int:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").astype("Int64")
            
    return df


# ==============================================================================
# 2. CAPA DE MODELADO Y CONSOLIDACIÓN (Equivalente a 'BD', 'BD_Ordenes', 'BD_simplified')
# ==============================================================================

def generar_bd(directorio_raiz: str) -> pd.DataFrame:
    """
    Busca recursivamente todos los archivos CSV dentro de la estructura de carpetas
    (ej. Finance/Año/MES/Data/*.csv), los consolida y los ordena cronológicamente.
    
    Equivale a la consulta 'BD' de Power Query (Table.Combine + Table.Sort).
    """
    path_raiz = pathlib.Path(directorio_raiz)
    archivos_csv = list(path_raiz.rglob("*.csv"))
    
    if not archivos_csv:
        print(f"No se encontraron archivos CSV en: {directorio_raiz}")
        return pd.DataFrame()
        
    dfs = [cargar_y_limpiar_csv(str(archivo)) for archivo in archivos_csv]
    bd_consolidada = pd.concat(dfs, ignore_index=True)
    
    # Ordenación cronológica por 'created_at'
    bd_consolidada = bd_consolidada.sort_values(by="created_at", ascending=True).reset_index(drop=True)
    return bd_consolidada


def generar_bd_ordenes(bd: pd.DataFrame) -> pd.DataFrame:
    """
    Selecciona las columnas operativas principales para el análisis de ventas y
    excluye registros de comisiones ('FEE').
    
    Equivale a la consulta 'BD_Ordenes' de Power Query.
    """
    columnas_deseadas = [
        "order_id", "created_at", "amount_in_major_units", "currency", 
        "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider"
    ]
    
    # Filtrar solo columnas existentes para prevenir errores
    cols_existentes = [c for c in columnas_deseadas if c in bd.columns]
    df_ordenes = bd[cols_existentes].copy()
    
    # Exclusión explícita de registros cuya clave contenga 'FEE'
    if "record_type_key" in df_ordenes.columns:
        filtro_sin_fee = ~df_ordenes["record_type_key"].astype(str).str.contains("FEE", na=False)
        df_ordenes = df_ordenes[filtro_sin_fee]
        
    return df_ordenes.reset_index(drop=True)


def generar_bd_simplified(bd_ordenes: pd.DataFrame) -> pd.DataFrame:
    """
    Agrupa transacciones por dimensiones clave (fecha, divisas, tipo de registro y proveedor)
    y calcula la suma de montos.
    
    Optimizacion vs Power Query:
    Power Query usaba una columna sintética concatenada ('Classificador') para luego dividirla.
    En Python/Pandas, agrupamos directamente por la lista de dimensiones mediante `groupby`,
    lo cual es significativamente más eficiente en memoria y CPU.
    
    Equivale a la consulta 'BD_simplified'.
    """
    df = bd_ordenes.copy()
    
    # Truncar fecha y hora a solo fecha
    df["created_at"] = pd.to_datetime(df["created_at"]).dt.date
    
    dimensiones_agrupacion = ["created_at", "currency", "payout_currency", "record_type_key", "provider"]
    
    # Agregación: suma de montos originales y pagados
    bd_simp = df.groupby(dimensiones_agrupacion, as_index=False).agg({
        "amount_in_major_units": "sum",
        "payout_amount_in_major_units": "sum"
    })
    
    # Reordenar columnas para mantener consistencia con la estructura de Power Query
    columnas_ordenadas = [
        "created_at", "amount_in_major_units", "currency", 
        "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider"
    ]
    return bd_simp[columnas_ordenadas]


def generar_bd_simplified_checkout(bd_simplified: pd.DataFrame) -> pd.DataFrame:
    """
    Filtra la tabla simplificada conservando únicamente el proveedor 'Checkout'.
    
    Equivale a la consulta 'BD_simplified_Checkout' de Power Query.
    """
    return bd_simplified[bd_simplified["provider"] == "Checkout"].copy().reset_index(drop=True)


# ==============================================================================
# 3. MÓDULO DE AUDITORÍA Y COMPROBACIONES (Equivalente al grupo 'Comprovaciones')
# ==============================================================================

def ejecutar_auditoria_finanzas(bd: pd.DataFrame, bd_ordenes: pd.DataFrame) -> dict:
    """
    Ejecuta el conjunto completo de reglas de validación y detección de anomalías
    para transacciones de Ventas ('SALE') y Reembolsos ('REFUND').
    
    Retorna un diccionario con DataFrames correspondientes a cada tabla de auditoría.
    """
    columnas_auditoria = [
        "id", "order_id", "created_at", "amount_in_major_units", "currency", 
        "payout_amount_in_major_units", "payout_currency", "record_type_key", 
        "provider", "chargeback_id"
    ]
    cols_existentes = [c for c in columnas_auditoria if c in bd.columns]
    
    # --------------------------------------------------------------------------
    # BLOQUE A: AUDITORÍA DE VENTAS (SALE)
    # --------------------------------------------------------------------------
    
    # Filtrar solo registros de tipo SALE
    bd_sales = bd[cols_existentes][bd["record_type_key"] == "SALE"].copy()
    
    # Conteo de frecuencia de order_id
    counts_sales = bd_sales.groupby("order_id").size().reset_index(name="Recuento")
    
    # 1. V_Dup_Anomalas: Ventas con recuento exactamente igual a 2 (posible traslape de mes)
    v_dup_anomalas = counts_sales[counts_sales["Recuento"] == 2]
    
    # 2. V_Anomalas: Inner Join entre BD_Ordenes y V_Dup_Anomalas (filtra created_at > 02/05/2025)
    v_anomalas = bd_ordenes.merge(v_dup_anomalas[["order_id"]], on="order_id", how="inner")
    v_anomalas = v_anomalas[v_anomalas["created_at"] > pd.Timestamp(2025, 5, 2)]
    
    # 3. VentasDuplicadas: Recuentos impares (3 o 5), correspondientes a la secuencia + - + = +
    ventas_duplicadas = counts_sales[counts_sales["Recuento"].isin([3, 5])]
    
    # 4. VentasNegativas: Registros SALE con importe de pago negativo (payout < 0)
    ventas_negativas = bd_sales[bd_sales["payout_amount_in_major_units"] < 0]
    
    # 5. V_Dup_SinNegativos: Left Anti Join entre VentasDuplicadas y VentasNegativas
    # Identifica ventas duplicadas que NO tienen una transacción negativa asociada
    v_dup_sin_negativos = ventas_duplicadas[
        ~ventas_duplicadas["order_id"].isin(ventas_negativas["order_id"])
    ]
    
    # --------------------------------------------------------------------------
    # BLOQUE B: AUDITORÍA DE REEMBOLSOS (REFUND)
    # --------------------------------------------------------------------------
    
    # Filtrar solo registros de tipo REFUND
    bd_refunds = bd[cols_existentes][bd["record_type_key"] == "REFUND"].copy()
    
    # Conteo de frecuencia de order_id para reembolsos
    counts_refunds = bd_refunds.groupby("order_id").size().reset_index(name="Recuento")
    
    # 1. RefundsDuplicados: Recuentos impares (3 o 5) para reembolsos
    refunds_duplicados = counts_refunds[counts_refunds["Recuento"].isin([3, 5])]
    
    # 2. RefundsPositivosEjemplo: Reembolsos sin 'FEE' que poseen pago positivo (> 0)
    ref_positivos = bd[cols_existentes][
        (~bd["record_type_key"].astype(str).str.contains("FEE", na=False)) &
        (bd["payout_amount_in_major_units"] > 0) &
        (bd["record_type_key"] == "REFUND")
    ]
    
    # 3. R_Dup_SinPositivos: Left Anti Join entre RefundsDuplicados y RefundsPositivosEjemplo
    r_dup_sin_positivos = refunds_duplicados[
        ~refunds_duplicados["order_id"].isin(ref_positivos["order_id"])
    ]
    
    # 4. R_Dup_Anomalos: Reembolsos con recuento exactamente igual a 2
    r_dup_anomalos = counts_refunds[counts_refunds["Recuento"] == 2]
    
    # 5. R_Anomalas: Inner Join entre BD_Ordenes y R_Dup_Anomalos
    r_anomalas = bd_ordenes.merge(r_dup_anomalos[["order_id"]], on="order_id", how="inner")
    
    return {
        "V_Dup_Anomalas": v_dup_anomalas,
        "V_Anomalas": v_anomalas,
        "VentasDuplicadas": ventas_duplicadas,
        "VentasNegativas": ventas_negativas,
        "V_Dup_SinNegativos": v_dup_sin_negativos,
        "RefundsDuplicados": refunds_duplicados,
        "RefundsPositivosEjemplo": ref_positivos,
        "R_Dup_SinPositivos": r_dup_sin_positivos,
        "R_Dup_Anomalos": r_dup_anomalos,
        "R_Anomalas": r_anomalas
    }


# ==============================================================================
# 4. EJECUCIÓN PRINCIPAL DE EJEMPLO
# ==============================================================================

if __name__ == "__main__":
    # Ruta de ejemplo para pruebas locales
    ruta_datos = "./Finance"
    
    print("Iniciando pipeline de reemplazo en Python...")
    
    if os.path.exists(ruta_datos):
        # 1. Carga y Consolidación
        bd = generar_bd(ruta_datos)
        print(f"Base de Datos Maestra cargada: {len(bd)} registros.")
        
        # 2. Generación de Tablas Filtradas y Simplificadas
        bd_ordenes = generar_bd_ordenes(bd)
        bd_simplified = generar_bd_simplified(bd_ordenes)
        bd_checkout = generar_bd_simplified_checkout(bd_simplified)
        
        print(f"BD Órdenes: {len(bd_ordenes)} filas.")
        print(f"BD Simplificada: {len(bd_simplified)} filas agregadas.")
        print(f"BD Checkout: {len(bd_checkout)} filas.")
        
        # 3. Auditoría de Datos
        resultados_auditoria = ejecutar_auditoria_finanzas(bd, bd_ordenes)
        print("\nResumen de Comprobaciones de Auditoría:")
        for nombre, df_res in resultados_auditoria.items():
            print(f" - {nombre}: {len(df_res)} registros anómalos detectados.")
    else_block = """
    Ruta de datos no encontrada. El script está preparado para ejecutarse definiendo
    la variable 'ruta_datos' hacia la carpeta principal que contiene las subcarpetas mensuales.
    """
    print(else_block)
