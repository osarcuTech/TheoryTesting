# Documentation & README: Power Query Financial Data Transformation & Reconciliation Pipeline

## 📋 Resumen Ejecutivo y Propósito del Sistema

Este sistema en **Power Query (Lenguaje M)** está diseñado para consolidar, procesar y auditar datos financieros mensuales (ventas, reembolsos y comisiones) procedentes de archivos CSV almacenados en estructuras de directorios organizadas por año y mes (`Finance/Año/MES/Data`).

El objetivo principal es transformar datos heterogéneos y volumétricos en un modelo optimizado para analítica de ventas y reconciliación contable, garantizando la integridad de los datos mediante comprobaciones automáticas de anomalías.

### Funciones Clave del Pipeline
1. **Consolidación ETL Automatizada**: Ingesta e integración iterativa de archivos de datos financieros mensuales.
2. **Modelado y Optimización de Almacenamiento**: Generación de vistas agrupadas y filtradas que reducen el impacto en memoria y aceleran el rendimiento de las consultas.
3. **Auditoría Contable y Control de Calidad**: Detección de duplicidades anómalas, secuencias impares de movimientos (`+ - + = +`), ventas con saldos negativos y reembolsos positivos mediante uniones de tablas relacionales (`LeftAnti` e `Inner Join`).

---

## 🏗️ Arquitectura del Sistema y Linaje de Datos

El flujo de procesamiento sigue una arquitectura jerárquica y modular en tres capas diferenciadas:

```
┌────────────────────────────────────────────────────────┐
│   Archivos CSV Mensuales (Finance/Año/MES/Data)        │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
           ┌──────────────────────────────────┐
           │   [BD] Tabla Maestra Consolidada │
           └────────────────┬─────────────────┘
                            │
          ┌─────────────────┴─────────────────┐
          ▼                                   ▼
  ┌───────────────┐                  ┌──────────────────┐
  │ [BD_Ordenes]  │                  │ [Comprobaciones] │
  └───────┬───────┘                  │ (Auditorías)     │
          │                          └──────────────────┘
          ▼
  ┌──────────────────┐
  │ [BD_simplified]  │
  └───────┬──────────┘
          │
          ▼
  ┌────────────────────────────┐
  │ [BD_simplified_Checkout]   │
  └────────────────────────────┘
```

---

## ⚙️ Detalle de Componentes y Capas de Procesamiento

### 1. Capa de Extracción y Transformación Auxiliar (ETL)

* **`Archivo de ejemplo`**: Extrae la estructura del primer archivo de la carpeta de origen mediante `Folder.Files("C:\Users\...\Finance\2025\05\Data")`.
* **`Parámetro1` / `Transformar archivo`**: Función de transformación personalizada encargada de parsear cada archivo CSV con las siguientes especificaciones:
  * Delimitador de campos: Coma `,`.
  * Total de columnas: 27.
  * Codificación de texto: `1252` (Windows-1252).
  * Promoción implícita de la primera fila como encabezados de columna.
* **`Data_MM-YYYY` (ej. `Data_05-2025`)**:
  * **Ruta de Ingesta**: Navega dinámicamente por la estructura de carpetas `Finance/Año/MES/Data`.
  * **Normalización Numérica**: Conversión de separadores decimales de punto (`.`) a coma (`,`) en campos de importes (`amount`, `amount_in_major_units`, `payout_amount`, `payout_amount_in_major_units`).
  * **Tipado Estricto de Datos**:
    * Fechas/Horas: `created_at`, `transaction_datetime_provider`, `transaction_datetime_utc` como `datetime`; `accounting_date` como `date`.
    * Métricas Financieras: Importes en unidades mayores como `number`.
    * Identificadores y Unidades Menores: `Int64` o `text`.

---

### 2. Capa de Modelo de Datos Base (`BD's`)

#### **`BD` (Base de Datos Maestra)**
* **Propósito**: Consolidar en un único conjunto de datos todos los períodos mensuales ingeridos (`Data_05-2025` hasta `Data_08-2026`).
* **Lógica M**: Combina dinámicamente las tablas mediante `Table.Combine` y aplica un ordenamiento cronológico por el campo `created_at`.

#### **`BD_Ordenes`**
* **Propósito**: Aislar los registros operativos directos (ventas y reembolsos) necesarios para la analítica comercial.
* **Lógica M**: Selección de columnas clave (`order_id`, `created_at`, `amount_in_major_units`, `currency`, `payout_amount_in_major_units`, `payout_currency`, `record_type_key`, `provider`) y exclusión explícita de comisiones (`not Text.Contains([record_type_key], "FEE")`).

#### **`BD_simplified`**
* **Propósito**: Reducir sustancialmente el volumen de filas mediante agregación dimensional.
* **Lógica M**:
  1. Elimina el identificador de orden (`order_id`) y trunca la marca de tiempo `created_at` a nivel de fecha (`date`).
  2. Crea la clave sintética **`Classificador`**:
     `Date.ToText([created_at]) & "-" & [currency] & "-" & [payout_currency] & "-" & [record_type_key] & "-" & [provider]`.
  3. Ejecuta `Table.Group` sobre la clave compuesta para calcular la suma de importes brutos y de liquidación (`payout`).
  4. Divide la clave en sus dimensiones constituyentes para restablecer la estructura relacional.

#### **`BD_simplified_Checkout`**
* **Propósito**: Subconjunto especializado para análisis enfocado en las operaciones procesadas por la pasarela **Checkout**.
* **Lógica M**: Filtrado directo sobre `BD_simplified` manteniendo filas donde `[provider] = "Checkout"`.

---

### 3. Capa de Auditoría y Control de Calidad (`Comprobaciones`)

Módulo de lógica relacional diseñado para detectar anomalías operativas y descalces de liquidación en Ventas y Reembolsos.

```
                     ┌─────────────────────────────────────────┐
                     │          RECONCILIACIÓN EN BD           │
                     └────────────────────┬────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
      [ AUDITORÍA DE VENTAS ]                        [ AUDITORÍA DE REFUNDS ]
  • V_Dup_Anomalas (Recuento = 2)            • RefundsDuplicados (Recuento = 3 o 5)
  • V_Anomalas (Filtro fecha > 02/05/2025)   • RefundsPositivosEjemplo (Refunds > 0)
  • VentasDuplicadas (Recuento = 3 o 5)      • R_Dup_SinPositivos (LeftAnti Join)
  • VentasNegativas (Sale con Payout < 0)   • R_Dup_Anomalos (Recuento = 2)
  • V_Dup_SinNegativos (LeftAnti Join)      • R_Anomalas (Inner Join con BD_Ordenes)
```

#### A. Auditoría de Ventas
1. **`V_Dup_Anomalas`**: Identifica registros de tipo `SALE` con exactamente **2 apariciones** por `order_id` (indicativo de solapamientos entre cierres mensuales).
2. **`V_Anomalas`**: Realiza una unión interna (`Inner Join`) entre `BD_Ordenes` y `V_Dup_Anomalas`, filtrando fechas posteriores al `02/05/2025`.
3. **`VentasDuplicadas`**: Detecta secuencias **impares** de duplicidad (`Recuento = 3` o `Recuento = 5`), esenciales para auditar patrones de anulación y reintento (`+ - + = +`).
4. **`VentasNegativas`**: Captura ventas cuyo importe neto de liquidación es negativo (`payout_amount_in_major_units < 0`).
5. **`V_Dup_SinNegativos`**: Cruza mediante `LeftAnti Join` las tablas `VentasDuplicadas` y `VentasNegativas` para aislar duplicados no compensados por un saldo negativo.

#### B. Auditoría de Reembolsos (Refunds)
1. **`RefundsDuplicados`**: Registros de reembolsos (`REFUND`) con recuentos impares (`Recuento = 3` o `Recuento = 5`).
2. **`RefundsPositivosEjemplo`**: Reembolsos que presentan un saldo de liquidación positivo (`payout_amount_in_major_units > 0`), lo cual representa una discrepancia contable.
3. **`R_Dup_SinPositivos`**: Ejecuta un `LeftAnti Join` entre `RefundsDuplicados` y `RefundsPositivosEjemplo`.
4. **`R_Dup_Anomalos`**: Reembolsos que se repiten exactamente **2 veces** por `order_id`.
5. **`R_Anomalas`**: Cruce relacional (`Inner Join`) entre `BD_Ordenes` y `R_Dup_Anomalos` para inspección detallada.

---

## 💡 Patrones Técnicos y Buenas Prácticas en Lenguaje M

1. **Agregación por Clave Compuesta Concatenada**:
   Uso del patrón `Concatenar Dimensiones → Agrupar → Separar Columnas` para agrupar múltiples atributos categóricos en Power Query sin necesidad de agrupaciones jerárquicas complejas.
2. **Aislamiento de Comisiones (`FEE`)**:
   Filtrado de registros mediante predicados de texto (`not Text.Contains([record_type_key], "FEE")`) para separar las comisiones operativas de los flujos de ventas y devoluciones.
3. **Cruzamiento Antidiferencial para Auditoría**:
   Uso intensivo de `JoinKind.LeftAnti` para la exclusión sistemática de casos normales y el aislamiento eficiente de registros anómalos.
