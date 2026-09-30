# Arquitectura Global del Ecosistema de Datos Financieros: `Ordenes_BD's`

Este documento define la **arquitectura técnica global y la estrategia de flujo de datos** para la conciliación financiera, control de ventas, gestión de disputas y auditoría de pasarelas de pago (Solidgate y Checkout).

El ecosistema está diseñado bajo una **estrategia híbrida de tres capas**, combinando velocidad de ejecución operativa semanal con rigor y precisión contable mensual, apoyado en scripts de ingesta automatizada (`Google Apps Script` y `Python / Power Query`).

---

## 1. Visión General del Ecosistema de Datos

El proyecto se compone de tres hojas de cálculo principales (Spreadsheets) y una capa de automatización ETL:

```
                                  ┌─────────────────────────────────────────┐
                                  │   Fuentes de Datos de Solidgate (API)   │
                                  └────────────────────┬────────────────────┘
                                                       │
                          ┌────────────────────────────┴────────────────────────────┐
                          ▼                                                         ▼
         ┌─────────────────────────────────┐                       ┌─────────────────────────────────┐
         │     Hub de Órdenes (Mutable)    │                       │  Financial Entries (Inmutable)  │
         │   https://hub.solidgate/order   │                       │      Reporte /finances CSV      │
         └────────────────┬────────────────┘                       └────────────────┬────────────────┘
                          │                                                         │
                          │ (UPSERT semanal)                                        │ (Carga mensual)
                          ▼                                                         ▼
          ┌───────────────────────────────┐                         ┌───────────────────────────────┐
          │          Capa 1:              │                         │          Capa 2:              │
          │         Ordenes_BD            │                         │   Ordenes_BD_FinancesPrecision│
          │   (Previsión Cash Flow)       │                         │    (Contabilidad e Inmutabilidad)│
          └───────────────┬───────────────┘                         └───────────────┬───────────────┘
                          │                                                         │
                          │                                                         │ (Fork de agregación)
                          │                                                         ▼
                          │                                         ┌───────────────────────────────┐
                          │                                         │          Capa 3:              │
                          │                                         │ Ordenes_BD_FinancesPrecision_ │
                          │                                         │             Simp              │
                          │                                         │  (Dashboards Ejecutivos)      │
                          │                                         └───────────────┬───────────────┘
                          │                                                         │
                          └────────────────────────────┬────────────────────────────┘
                                                       ▼
                                     ┌───────────────────────────────────┐
                                     │     Pipeline ETL en Python /      │
                                     │      Power Query (Lenguaje M)     │
                                     └───────────────────────────────────┘
```

---

## 2. Detalle de las Tres Capas del Ecosistema

### Capa 1: Operativa Semanal (`Ordenes_BD`)
* **Documentación Técnica**: [[Ordenes_BD-Arquitectura]]
* **Fuente de Datos**: API / Exportación de Órdenes (`/payments/order`).
* **Frecuencia**: Semanal.
* **Mecanismo de Ingesta**: Google Apps Script con lógica de UPSERT. Ver [[SolidgateOrdersUpsert_Explicacion]].
* **Objetivo Principal**: Estimación rápida de flujo de caja (*Cash Flow*) a corto plazo (*"¿Cuánto vamos a cobrar en la liquidación de esta semana?"*).
* **Características**:
  * Utiliza la tabla maestra `SG_Orders`.
  * Filtra y concilia divisas mediante data marts específicos (`CalculoManual$`, `CalculoManual£`, `CalculoManual€`).
  * Incluye fórmulas para conversión de moneda y análisis de redondeos FX.

### Capa 2: Base Contable Inmutable (`Ordenes_BD_FinancesPrecision`)
* **Documentación Técnica**: [[Ordenes_BD_FP-Arquitectura]]
* **Fuente de Datos**: Reporte de Entradas Financieras (*Financial Entries*).
* **Frecuencia**: Mensual.
* **Objetivo Principal**: Cierre contable oficial, auditoría histórica y conciliación exacta de tipos de cambio por fecha contable (`accounting_date`).
* **Características**:
  * Ingesta inmutable a nivel de cada evento transaccional (`SALE`, `REFUND`, `CHARGEBACK`, `FEE`) en la tabla `SG_Finances`.
  * Preserva la historia sin necesidad de aplicar *upserts* o sobrescribir estados antiguos.
  * Alimenta las verificaciones de auditoría contra *Settlements* de Checkout.

### Capa 3: Analítica de Alto Rendimiento (`Ordenes_BD_FinancesPrecision_Simp`)
* **Documentación Técnica**: [[Ordenes_BD_FPS-Arquitectura]]
* **Fuente de Datos**: Fork agrupado de `Ordenes_BD_FinancesPrecision`.
* **Frecuencia**: Mensual / Actualización continua para reportes.
* **Objetivo Principal**: Alimentación de tableros ejecutivos y consultas analíticas masivas en Power BI o Google Looker Studio.
* **Características**:
  * Elimina el identificador único de orden (`order_id`) y agrupa los registros por dimensiones clave (`created_at`, `currency`, `payout_currency`, `record_type_key`, `provider`).
  * Reduce el volumen de datos entre un 90% y un 95%.
  * Mantiene una precisión matemática casi idéntica a la Capa 2, con variaciones insignificantes (< 0.01 €/$/£) derivadas del acumulado de redondeos flotantes.

---

## 3. Matriz de Evaluación DAFO del Sistema

El equilibrio entre agilidad y rigor contable se analiza en detalle en [[Ordenes_BD's-DAFO]]:

1. **Fortalezas**: Arquitectura de doble velocidad, inmutabilidad contable mensual y reducción masiva de volumen en la capa analítica.
2. **Debilidades**: Mutabilidad y distorsión de FX en `Ordenes_BD`, alta carga laboriosa en la descarga previa del reporte mensual y leves variaciones por redondeos en la capa simplificada.
3. **Oportunidades**: Migración total del procesamiento pesado a Python (`power_query_transformation.py`), eliminación de intervención manual y automatización en repositorios Git.
4. **Amenazas**: Uso inadecuado de datos semanales preliminares para cierres contables oficiales o saturación de memoria si no se utiliza la capa simplificada.

---

## 4. Pipeline de Automatización ETL y Transformación

Para superar los límites de rendimiento de Power Query en hojas de cálculo y automatizar las reglas de auditoría, se ha diseñado un pipeline portable traducido a **Python (Pandas)**:

* **Especificación M / Power Query**: Documentada en [[PQ_Finances-AppendDisputas_Code]] y adaptada a rutas relativas en [[power-query-portable-spec]].
* **Script Ejecutable de Python**: Implementado en [[power_query_transformation.py]], encargándose de:
  1. Parseo estricto de CSVs con codificación `Windows-1252` y normalización de comas/puntos decimales.
  2. Consolidación de carpetas mensuales (`BD`).
  3. Filtrado de comisiones `FEE` (`BD_Ordenes`).
  4. Agregación dimensional optimizada (`BD_simplified`).
  5. Auditoría automatizada de duplicados impares (`+ - + = +`), ventas negativas y reembolsos anómalos.

---

## 5. Mapa de Navegación del Proyecto (Wiki-Links de Obsidian)

* 📊 **Evaluación Estratégica**: [[Ordenes_BD's-DAFO]]
* 📑 **Arquitecturas por Spreadsheet**:
  * Capa 1: [[Ordenes_BD-Arquitectura]]
  * Capa 2: [[Ordenes_BD_FP-Arquitectura]]
  * Capa 3: [[Ordenes_BD_FPS-Arquitectura]]
* 🔄 **Mecanismos de Ingesta y Sincronización**:
  * Explicación del UPSERT: [[SolidgateOrdersUpsert_Explicacion]]
* 💻 **Código y Transformación ETL**:
  * Código M de Power Query: [[PQ_Finances-AppendDisputas_Code]]
  * Especificación Portable M: [[power-query-portable-spec]]
  * Script de Python (Pandas): [[power_query_transformation.py]]
