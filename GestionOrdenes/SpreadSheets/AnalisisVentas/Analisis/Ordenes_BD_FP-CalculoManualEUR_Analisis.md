# Análisis del Data Mart de Conciliación Manual en Euros (`CalculoManual€`)

Este documento presenta el análisis exhaustivo de los datos contenidos en el archivo **`Ordenes_BD_FinancesPrecision - CalculoManual€_30-09-2026.csv`**, correspondiente a la hoja de cálculo de conciliación semanal en Euros (€) dentro del modelo inmutable **`Ordenes_BD_FinancesPrecision`** (ver [[Ordenes_BD_FP-Arquitectura]]).

---

## 1. Propósito y Función del Data Mart `CalculoManual€`

El Data Mart **`CalculoManual€`** tiene como objetivo auditar y cuadrar semanalmente las liquidaciones oficiales enviadas por el adquirente/proveedor **Checkout** en Euros (€) contra la base de datos inmutable **`SG_Finances`**, la cual se nutre de los reportes de entradas financieras (*Financial Entries*) de Solidgate (ver [[reportes_financieros_solidgate]]).

* **Ámbito del Proveedor**: Adquirente **Checkout** (`provider = 'Checkout'`).
* **Divisa Analizada**: Euro (`currency = 'EUR'`).
* **Cobertura Temporal**: 63 períodos semanales de liquidación, abarcando desde el **22/05/2025** hasta el **27/08/2026**.
* **Integridad del Modelo**: Refleja la alta precisión del modelo inmutable (ver [[Ordenes_BD's-DAFO]]), permitiendo detectar diferencias temporales de liquidación (*timing differences*) y cambios de entidad/divisa.

---

## 2. Resumen Métrico de la Serie (2025 - 2026)

A partir del análisis cuantitativo de los 63 registros semanales de liquidación, se obtienen las siguientes cifras consolidadas:

| Métrica Financiera | Total Settlement (Checkout) | Total Finances (`SG_Finances`) | Diferencia Acumulada Bruta | Desviación Ajustada Objetivo (Fila 0) |
| :--- | :---: | :---: | :---: | :---: |
| **Ventas (`Sales`)** | **1.023.441,10 €** | **1.021.410,14 €** | **+2.030,96 €** | **32,24 €** |
| **Reembolsos (`Refunds`)** | **188.914,55 €** | **-186.239,91 €** | **+2.674,64 €** | **42,45 €** |
| **Contracargos (`Chargebacks`)** | **9.371,30 €** | **-9.294,76 €** | **+76,54 €** | **1,21 €** |

### Interpretación de las Celdas de Control (Fila 0):
En la fila de control superior (Fila 0) del spreadsheet, se establecen las metas de **descuadre residual ajustado**:
* **`D_Ventas` = 32,24 €**: Representa una desviación neta menor al **0,003%** sobre un volumen bruto de ventas superior a 1,02 M€.
* **`D_Refunds` = 42,45 €**: Desviación neta menor al **0,022%** sobre el total de reembolsos.
* **`D_Chargebacks` = 1,21 €**: Desviación prácticamente nula sobre las disputas procesadas.

---

## 3. Identificación de Anomalías y Hallazgos Clave

El análisis detallado fila a fila pone de manifiesto varios eventos operativos y contables de gran relevancia:

### A. Transición de Entidad / Divisa UKPA (€ $\rightarrow$ £) en Abril 2026
En las semanas 50 y 51 se registran dos notas explícitas en la columna de observaciones (Columna 14):
* **Semana 50 (Settlement 23/04/2026)**: Nota: *"Fecha teorica de UKPA €-->£ segun finances"*.
  * Genera un descuadre temporal de **+2.757,68 €** en ventas y **+1.249,30 €** en reembolsos.
* **Semana 51 (Settlement 30/04/2026)**: Nota: *"Fecha teorica de UKPA €-->£ segun settlement"*.
  * Genera un descuadre de **+4.864,58 €** en ventas y **+1.101,71 €** en reembolsos.

**Causa Raíz**: Corresponde al cambio de configuración en la entidad operadora UKPA, donde transacciones en Euros comenzaron a liquidarse o trasladarse hacia cuentas en Libras Esterlinas (£). La asincronía entre la fecha de registro contable en Solidgate y la fecha de liquidación final en Checkout provocó que el corte de datos entre ambas fuentes no coincidiera en la misma semana.

### B. Ajuste Final de Ventana de Liquidación (Settlement 27/08/2026 - Fila 64)
En el último registro de la serie (27/08/2026), se observa una desviación negativa compensatoria de **-4.534,60 €** en ventas y **-619,95 €** en reembolsos.
* Este movimiento absorbe el exceso acumulado en las semanas precedentes de julio/agosto, demostrando que los descuadres semanales no son pérdidas reales sino **desfases de corte temporal (*cutoff dates*)**.

### C. Descalibres Puntuales de Liquidación
* **Semana 16/10/2025 (Fila 23)**: Descuadre atípico de **-3.260,22 €** en ventas, el cual fue progresivamente reequilibrado en las liquidaciones adyacentes de octubre y noviembre.

---

## 4. Especificación Técnica de las Fórmulas `QUERY` en Google Sheets

La extracción dinámica de los importes desde la pestaña maestra **`SG_Finances`** hacia la hoja **`CalculoManual€`** se realiza mediante fórmulas `QUERY` estructuradas en las filas 71-74:

### Fórmula Estándar para Cálculo de Reembolsos (`O_Refunds`):
```excel
=IFERROR(
  INDEX(
    QUERY(
      SG_Finances!$D$2:$H;
      "select sum(E) where F='EUR' and D<>'GBP' and G='REFUND' and H >= date '"&TEXT($F3;"yyyy-mm-dd")&"' and H<= date '"&TEXT($G3;"yyyy-mm-dd")&"'"
    );
    2
  );
  0
)
```

### Fórmula de Cálculo de Diferencia Neta (`D_Refunds`):
```excel
=D3-(I3*(-1))
```

### Parámetros de la Consulta `QUERY`:
* **Columna D**: `accounting_date` (Fecha contable de la transacción).
* **Columna E**: `amount` / `payout_amount` (Importe monetario).
* **Columna F**: Divisa (`F = 'EUR'`).
* **Columna G**: Tipo de registro (`record_type_key = 'SALE'`, `'REFUND'`, `'CHARGEBACK'`).
* **Columna H**: Proveedor adquirente (`H = 'Checkout'`).

---

## 5. Conexión con el Ecosistema del Proyecto (Obsidian Links)

* **[[Ordenes_BD_FP-Arquitectura]]**: Documentación técnica del spreadsheet maestro `Ordenes_BD_FinancesPrecision` del cual forma parte esta hoja.
* **[[Ordenes_BD's_Arquitectura]]**: Visión global de la arquitectura de datos en tres capas.
* **[[Ordenes_BD's_Arquitectura_Avertencias&Mejoras]]**: Advertencias operativas como la regla del desfase de 4 horas en `created_at` y límites de descarga.
* **[[Ordenes_BD's-DAFO]]**: Análisis DAFO justificando el uso de este Data Mart para cierres contables mensuales inmutables.
* **[[power_query_transformation.py]]**: Script en Python para automatizar la extracción de este Data Mart sin depender de Power Query o Google Sheets.
