# Arquitectura del Spreadsheet `Ordenes_BD_FinancesPrecision`

Este documento detalla la arquitectura técnica, modelo de datos, fórmulas y estructura de Data Marts del spreadsheet **`Ordenes_BD_FinancesPrecision`**. Esta herramienta constituye la **fuente de verdad contable inmutable** (*Single Source of Truth*) para la conciliación mensual de ventas, reembolsos, disputas y comisiones con las liquidaciones oficiales (*Settlements*) de las pasarelas de pago.

---

## 1. Visión General de la Arquitectura

A diferencia de [[Ordenes_BD-Arquitectura]], que opera sobre un modelo de estado mutable por orden (`/payments/order`), **`Ordenes_BD_FinancesPrecision`** se alimenta del reporte **Financial Entries** de Solidgate ([Documentación de Reportes Financieros](https://hub.solidgate.com/reports-and-exports)).

### Principios Fundamentales:
1. **Inmutabilidad Contable**: Cada evento o transacción (`SALE`, `REFUND`, `CHARGEBACK`, `RDR`, `FEE`) genera una línea contable independiente.
2. **Precisión de FX (Tipo de Cambio)**: Se mantiene la fecha contable (`accounting_date` / `created_at_t`) y el tipo de cambio exacto aplicado en el momento de cada transacción individual, eliminando las distorsiones de sobreescritura de divisas en reembolsos.
3. **Data Marts por Divisa**: Capa analítica basada en consultas `QUERY` de Google Sheets para conciliar los datos con los extractos semanales en PDF (*Settlements*).

```
                       ┌────────────────────────────────────────┐
                       │  Solidgate Report: Financial Entries   │
                       └───────────────────┬────────────────────┘
                                           │ (Ingesta mensual)
                                           ▼
                       ┌────────────────────────────────────────┐
                       │       Hoja Maestra: SG_Finances        │
                       │   (Inmutable por evento / order_id)    │
                       └───────────────────┬────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
         ▼                                 ▼                                 ▼
┌─────────────────┐               ┌─────────────────┐               ┌─────────────────┐
│ Data Mart USD   │               │ Data Mart GBP   │               │ Data Mart EUR   │
│ CalculoManual$  │               │ CalculoManual£  │               │ CalculoManual€  │
└─────────────────┘               └─────────────────┘               └─────────────────┘
```

---

## 2. Hoja Maestra: `SG_Finances`

Consolida la ingesta del reporte financiero de entradas. Prepara y limpia los tipos de datos para permitir el filtrado y agrupamiento en los Data Marts.

### Estructura de Columnas (`SG_Finances`)

| Columna | Nombre Campo | Descripción y Tipo de Dato | Fórmula / Transformación |
| :--- | :--- | :--- | :--- |
| **A** | `Order_id` | Identificador único de la orden (`text`) | Dato crudo de exportación |
| **B** | `created_at` | Timestamp original del evento (`text`/`datetime`) | Dato crudo de exportación |
| **C** | `amount_in_major_units` | Importe en la divisa de origen (`number`) | Dato crudo de exportación |
| **D** | `Currency` | Moneda de origen de la transacción (`text`) | Dato crudo de exportación (ej: `EUR`, `USD`, `GBP`) |
| **E** | `payout_amount_in_major_units` | Importe en la moneda de cobro/liquidación (`number`) | Dato crudo de exportación |
| **F** | `payout_currency` | Divisa de liquidación/cobro (`text`) | Dato crudo de exportación (ej: `EUR`, `USD`, `GBP`) |
| **G** | `record_type_key` | Tipo de evento transaccional (`text`) | Eventos: `SALE`, `REFUND`, `CHARGEBACK`, `RDR`, `RDR_REVERSED`, `CHARGEBACK_REVERSED`, `FEE` |
| **H** | `created_at_t` | Fecha limpia parseada (`date`) | `=FECHA( INDICE(ArrayFormula(SPLIT(SPLIT(B2;" ");"/"));3); INDICE(ArrayFormula(SPLIT(SPLIT(B2;" ");"/"));2); INDICE(ArrayFormula(SPLIT(SPLIT(B2;" ");"/"));1) )` |

---

## 3. Data Marts de Conciliación por Divisa

Los Data Marts comparan los datos agregados por períodos semanales (`S_Inicio` a `S_Fin`) con las cifras reportadas en los PDFs de *Settlement* emitidos por la pasarela (`S_Sales`, `S_Refunds`, `S_Chargebacks`).

### A. Data Mart Dólares: `[[Orders_BD_FP-CalculoManual$]]`
* **Moneda objetivo**: Dólar estadounidense (`USD`).
* **Propósito**: Validar ventas y reembolsos procesados en USD contra los pagos de Checkout/Solidgate.
* **Fórmulas Clave (`[[Orders_BD_FP-CalculoManual$_Formulas]]`)**:
  * **Rango de Fechas**:
    * `S_Inicio` (E4): `=F3+1`
    * `S_Fin` (F4): `=E4+7`
  * **Ventas Calculadas (`O_Ventas`)**:
    ```excel
    =SI.ERROR(INDICE(QUERY(SG_Finances!$E$2:$H;"select sum(E) where F='USD' and G= 'SALE' and H >= date '"&TEXTO($E3;"yyyy-mm-dd")&"' and H<= date '"&TEXTO($F3;"yyyy-mm-dd")&"'");2);0)
    ```
  * **Reembolsos Calculados (`O_Refunds`)**:
    ```excel
    =SI.ERROR(INDICE(QUERY(SG_Finances!$E$2:$H;"select sum(E) where F='USD' and G= 'REFUND' and H >= date '"&TEXTO($E3;"yyyy-mm-dd")&"' and H<= date '"&TEXTO($F3;"yyyy-mm-dd")&"'");2);0)
    ```
  * **Métricas de Rendimiento y Desviación**:
    * Control de dispersión en Fila 1: `=PROMEDIO(J3:J)` (cuanto más cercano a 0, mayor precisión del cuadre).
    * Diferencia de Ventas (`D_Ventas`): `=B3-G3`
    * Diferencia de Reembolsos (`D_Refunds`): `=C3-(H3*(-1))`

---

### B. Data Mart Libras: `[[Orders_BD_FP-CalculoManual£]]`
* **Moneda objetivo**: Libra Esterlina (`GBP`).
* **Propósito**: Conciliación de transacciones nativas en GBP, incluyendo la captura de alertas de disputas y contracargos (`RDR` y `CHARGEBACK`).
* **Fórmulas Clave (`[[Orders_BD_FP-CalculoManual£_Formulas]]`)**:
  * **Rango de Fechas**:
    * `S_Inicio` (E5): `=F4+1`
    * `S_Fin` (F5): `=E5+6`
  * **Ventas Calculadas (`O_Ventas`)**:
    ```excel
    =SI.ERROR(INDICE(QUERY(SG_Finances!$C$2:$H;"select sum(C) where D='GBP' and G= 'SALE' and H >= date '"&TEXTO($E3;"yyyy-mm-dd")&"' and H<= date '"&TEXTO($F3;"yyyy-mm-dd")&"'");2);0)
    ```
  * **Reembolsos Calculados (`O_Refunds`)**:
    ```excel
    =SI.ERROR(INDICE(QUERY(SG_Finances!$C$2:$H;"select sum(C) where D='GBP' and G= 'REFUND' and H >= date '"&TEXTO($E3;"yyyy-mm-dd")&"' and H<= date '"&TEXTO($F3;"yyyy-mm-dd")&"'");2);0)
    ```
  * **Chargebacks y RDRs (`O_Chargebacks`)**:
    ```excel
    =SI.ERROR(INDICE(QUERY(SG_Finances!$C$2:$H;"select sum(C) where D='GBP' and (G= 'RDR' or G= 'RDR_REVERSED' or G= 'CHARGEBACK' or G= 'CHARGEBACK_REVERSED') and H >= date '"&TEXTO($E3;"yyyy-mm-dd")&"' and H<= date '"&TEXTO($F3;"yyyy-mm-dd")&"'");2);0)
    ```

---

### C. Data Mart Euros: `[[Orders_BD_FP-CalculoManual€]]`
* **Moneda objetivo**: Euro (`EUR`).
* **Propósito**: Laboratorio de experimentación y cuadre multidivisa para transacciones cobradas en Euros o liquidadas hacia cuentas en EUR.
* **Fórmulas Clave (`[[Orders_BD_FP-CalculoManual€_Formulas]]`)**:
  * **Parseo de Fechas del Settlement**:
    * `S_Payment` (B3): `=IZQUIERDA(A3;10)`
    * `S_Inicio` (F3): `=G3-6`
    * `S_Fin` (G3): `=REGEXREPLACE(B3;"/";"-")-1`
  * **Ventas en Euros (`O_Ventas`)**:
    ```excel
    =SI.ERROR(INDICE(QUERY(SG_Finances!$D$2:$H;"select sum(E) where F='EUR' and D<>'GBP' and G= 'SALE' and H >= date '"&TEXTO($F3;"yyyy-mm-dd")&"' and H<= date '"&TEXTO($G3;"yyyy-mm-dd")&"'");2);0)
    ```
  * **Reembolsos en Euros (`O_Refunds`)**:
    ```excel
    =SI.ERROR(INDICE(QUERY(SG_Finances!$D$2:$H;"select sum(E) where F='EUR' and D<>'GBP' and G= 'REFUND' and H >= date '"&TEXTO($F3;"yyyy-mm-dd")&"' and H<= date '"&TEXTO($G3;"yyyy-mm-dd")&"'");2);0)
    ```
  * **Disputas y Contracargos (`O_Chargebacks`)**:
    ```excel
    =SI.ERROR(INDICE(QUERY(SG_Finances!$D$2:$H;"select sum(E) where F='EUR' and D<>'GBP' and (G= 'RDR' or G= 'RDR_REVERSED' or G= 'CHARGEBACK' or G= 'CHARGEBACK_REVERSED') and H >= date '"&TEXTO($F3;"yyyy-mm-dd")&"' and H<= date '"&TEXTO($G3;"yyyy-mm-dd")&"'");2);0)
    ```

---

## 4. Trazabilidad y Relación con Otros Componentes de la Arquitectura

Este modelo no existe de forma aislada, sino que se interconecta con los demás componentes del sistema de información financiera:

* **[[Ordenes_BD's-DAFO]] / [[Ordenes_BD-DAFO_Completo]]**: Justifica el rol de `Ordenes_BD_FinancesPrecision` como la base de datos inmutable para cierres contables mensuales, contrastándola con la agilidad semanal de [[Ordenes_BD-Arquitectura]].
* **`Ordenes_BD_FinancesPrecision_Simp`**: Representa el fork optimizado que aplica agregación dimensional sobre `SG_Finances` (agrupando por Fecha / Producto / Proveedor) para reducir hasta un 95% el volumen de filas para Power BI.
* **[[power_query_transformation.py]]**: Script en Python que automatiza la ingesta de los archivos mensuales de `Financial Entries`, limpiando los separadores decimales y aplicando la lógica de auditoría sin necesidad de procesar fórmulas pesadas en Google Sheets o Power Query.
* **[[Ordenes_BD-Debilidades-v3]]**: Documento que analiza los trade-offs operativos entre la ingesta mensual de mayor coste de procesamiento frente al seguimiento semanal ligero.

---

## 5. Resumen de Flujo de Trabajo Operativo

1. **Extracción**: Descargar mensualmente el reporte `Finance` desde el Hub de Solidgate en formato CSV.
2. **Ingesta**: Cargar los datos crudos en la pestaña `SG_Finances` de Google Sheets o procesarlos directamente vía [[power_query_transformation.py]].
3. **Parseo**: La columna `created_at_t` convierte el timestamp a formato `YYYY-MM-DD`.
4. **Conciliación**: Los Data Marts (`CalculoManual$`, `CalculoManual£`, `CalculoManual€`) ejecutan las consultas `QUERY` para validar los totales frente a los PDFs de *Settlement*.
5. **Auditoría**: Inspeccionar las columnas de diferencia (`D_Ventas`, `D_Refunds`, `D_Chargebacks`) y verificar que las medias `=PROMEDIO(...)` se aproximen a cero.
