# Análisis del Data Mart de Conciliación Manual en Libras Esterlinas (`CalculoManual£`)

Este documento presenta el análisis técnico y cuantitativo detallado del archivo **`Ordenes_BD_FinancesPrecision - CalculoManual£_30-09-2026.csv`**, correspondiente a la hoja de conciliación semanal en Libras Esterlinas (£/GBP) dentro del modelo inmutable **`Ordenes_BD_FinancesPrecision`** (ver [[Ordenes_BD_FP-Arquitectura]]).

---

## 1. Propósito y Ámbito Operativo

El Data Mart **`CalculoManual£`** realiza la auditoría y conciliación de las liquidaciones semanales enviadas por el adquirente **Checkout** en Libras Esterlinas (£) contra la base de datos inmutable **`SG_Finances`**, que se nutre del reporte *Financial Entries* de Solidgate (ver [[reportes_financieros_solidgate]]).

* **Adquirente / Proveedor**: Checkout (`provider = 'Checkout'`).
* **Divisa Analizada**: Libra Esterlina (`£ / GBP`).
* **Alcance Temporal**: Cobertura desde el **20/04/2026** hasta el **27/08/2026**, comprendiendo **18 reportes oficiales de Settlement** (del 30/04/2026 al 27/08/2026) más la ventana inicial pre-settlement (20/04/2026 al 28/04/2026).
* **Confirmación de Hito Operativo**: Esta serie confirma y valida la **transición de la entidad UKPA de EUR a GBP** a finales de abril de 2026 (identificada previamente en [[Ordenes_BD_FP-CalculoManualEUR_Analisis]]), momento en el que se inician las liquidaciones en esta divisa.

---

## 2. Resumen Métrico Consolidado

A partir del procesamiento de los 21 registros del archivo (Fila 0 de metas de control, Fila 1 de encabezados y 19 filas de períodos), se obtienen los siguientes totales acumulados:

| Métrica Financiera | Total Settlement (Checkout) | Total Solidgate (`SG_Finances`) | Diferencia Acumulada Bruta | Meta de Control Residual (Fila 0) |
| :--- | :---: | :---: | :---: | :---: |
| **Ventas (`Sales`)** | **116.198,00 £** | **123.204,00 £** | **-7.006,00 £** | **-2,33 £** |
| **Reembolsos (`Refunds`)** | **42.405,00 £** | **-44.405,00 £** | **-2.000,00 £** | **8,67 £** |
| **Contracargos (`Chargebacks`)** | **4.378,13 £** | **-3.982,91 £** | **+395,22 £** | **21,96 £** |

### Interpretación de las Metas de Control Residual (Fila 0):
La **Fila 0** establece los márgenes objetivo de ajuste tras descontar los períodos sin settlement directo y los desfases temporales de corte:
* **`D_Ventas` = -2,33 £**: Refleja una discrepancia residual prácticamente nula (**< 0,002%**) sobre un volumen bruto procesado superior a 116.000 £.
* **`D_Refunds` = 8,67 £**: Muestra una concordancia casi exacta en devoluciones.
* **`D_Chargebacks` = 21,96 £**: Ajuste menor tras conciliar las disputas de agosto de 2026.

---

## 3. Desglose de Anomalías y Desfases Operativos

### A. Período Pre-Settlement Inicial (Fila 2: 20/04/2026 – 28/04/2026)
* **Datos**: `O_Ventas` = 6.964,00 £, `O_Refunds` = -2.156,00 £, sin informe de Settlement de Checkout asociado en GBP (`S_Name = NaN`).
* **Impacto**: Genera una diferencia inicial de `D_Ventas` = -6.964,00 £ y `D_Refunds` = -2.156,00 £.
* **Causa**: Representa el volumen transaccionado en Solidgate durante los días de corte previos al primer informe oficial de liquidación en Libras enviado por Checkout tras la migración de UKPA.

### B. Primer Settlement Oficial en GBP (Fila 3: 30/04/2026)
* **Período**: 29/04/2026 al 29/04/2026 (1 día).
* **Métricas**: `S_Sales` = 936,00 £ vs `O_Ventas` = 780,00 £ (`D_Ventas` = **+156,00 £**); `S_Refunds` = 312,00 £ vs `O_Refunds` = -156,00 £ (`D_Refunds` = **+156,00 £**).
* **Significado**: Es el primer informe de liquidación oficial emitido en GBP por Checkout inmediatamente después de activar el canal.

### C. Compensación Exacta de Reembolsos por Desfase de Corte (*Timing Difference*) (Filas 13 y 14)
Un ejemplo perfecto de la precisión del modelo inmutable frente a los cortes semanales:
* **Semana 09/07/2026 (Fila 13)**: `S_Refunds` = 1.572,00 £ vs `O_Refunds` = -1.383,00 £ $\rightarrow$ **`D_Refunds` = +189,00 £**.
* **Semana 16/07/2026 (Fila 14)**: `S_Refunds` = 3.164,00 £ vs `O_Refunds` = -3.353,00 £ $\rightarrow$ **`D_Refunds` = -189,00 £**.
* **Efecto Neto**: **+189,00 £ - 189,00 £ = 0,00 £**. Demuestra que no existe pérdida contable, sino un simple desplazamiento del registro de reembolsos entre dos ventanas semanales consecutivas de Checkout.

### D. Ajuste de Contracargos en Cierre de Serie (Fila 20: 27/08/2026)
* **Datos**: `S_Chargebacks` = 594,22 £ vs `O_Chargebacks` = -199,00 £ $\rightarrow$ **`D_Chargebacks` = +395,22 £**.
* **Causa**: Discrepancia temporal por la fecha de notificación de disputas por parte de Checkout al cierre del mes de agosto de 2026.

---

## 4. Matriz Completa de Conciliación Semanal en Libras (£)

| Fila | Fecha Settlement | Período Inicio | Período Fin | Ventas Settlement (`S_Sales`) | Ventas Solidgate (`O_Ventas`) | Dif. Ventas (`D_Ventas`) | Reembolsos Settlement (`S_Refunds`) | Reembolsos Solidgate (`O_Refunds`) | Dif. Reembolsos (`D_Refunds`) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **2** | *Sin Settlement* | 20/04/2026 | 28/04/2026 | — | 6.964,00 £ | **-6.964,00 £** | — | -2.156,00 £ | **-2.156,00 £** |
| **3** | 30/04/2026 | 29/04/2026 | 29/04/2026 | 936,00 £ | 780,00 £ | **+156,00 £** | 312,00 £ | -156,00 £ | **+156,00 £** |
| **4** | 07/05/2026 | 30/04/2026 | 06/05/2026 | 9.009,00 £ | 9.009,00 £ | **0,00 £** | 2.366,00 £ | -2.366,00 £ | **0,00 £** |
| **5** | 14/05/2026 | 07/05/2026 | 13/05/2026 | 4.732,00 £ | 4.732,00 £ | **0,00 £** | 1.976,00 £ | -1.976,00 £ | **0,00 £** |
| **6** | 21/05/2026 | 14/05/2026 | 20/05/2026 | 5.698,00 £ | 5.698,00 £ | **0,00 £** | 1.409,00 £ | -1.409,00 £ | **0,00 £** |
| **7** | 28/05/2026 | 21/05/2026 | 27/05/2026 | 8.679,00 £ | 8.679,00 £ | **0,00 £** | 3.083,00 £ | -3.083,00 £ | **0,00 £** |
| **8** | 04/06/2026 | 28/05/2026 | 03/06/2026 | 9.072,00 £ | 9.072,00 £ | **0,00 £** | 2.815,00 £ | -2.815,00 £ | **0,00 £** |
| **9** | 11/06/2026 | 04/06/2026 | 10/06/2026 | 9.440,00 £ | 9.440,00 £ | **0,00 £** | 2.759,00 £ | -2.759,00 £ | **0,00 £** |
| **10** | 18/06/2026 | 11/06/2026 | 17/06/2026 | 5.859,00 £ | 5.859,00 £ | **0,00 £** | 3.561,00 £ | -3.561,00 £ | **0,00 £** |
| **11** | 25/06/2026 | 18/06/2026 | 24/06/2026 | 12.833,00 £ | 12.833,00 £ | **0,00 £** | 3.213,00 £ | -3.213,00 £ | **0,00 £** |
| **12** | 02/07/2026 | 25/06/2026 | 01/07/2026 | 8.348,00 £ | 8.348,00 £ | **0,00 £** | 4.295,00 £ | -4.295,00 £ | **0,00 £** |
| **13** | 09/07/2026 | 02/07/2026 | 08/07/2026 | 6.368,00 £ | 6.567,00 £ | **-199,00 £** | 1.572,00 £ | -1.383,00 £ | **+189,00 £** |
| **14** | 16/07/2026 | 09/07/2026 | 15/07/2026 | 6.567,00 £ | 6.567,00 £ | **0,00 £** | 3.164,00 £ | -3.353,00 £ | **-189,00 £** |
| **15** | 23/07/2026 | 16/07/2026 | 22/07/2026 | 3.582,00 £ | 3.582,00 £ | **0,00 £** | 2.159,00 £ | -2.159,00 £ | **0,00 £** |
| **16** | 30/07/2026 | 23/07/2026 | 29/07/2026 | 5.970,00 £ | 5.970,00 £ | **0,00 £** | 2.378,00 £ | -2.378,00 £ | **0,00 £** |
| **17** | 06/08/2026 | 30/07/2026 | 05/08/2026 | 6.369,00 £ | 6.368,00 £ | **+1,00 £** | 1.582,00 £ | -1.582,00 £ | **0,00 £** |
| **18** | 13/08/2026 | 06/08/2026 | 12/08/2026 | 5.373,00 £ | 5.373,00 £ | **0,00 £** | 2.189,00 £ | -2.189,00 £ | **0,00 £** |
| **19** | 20/08/2026 | 13/08/2026 | 19/08/2026 | 3.184,00 £ | 3.184,00 £ | **0,00 £** | 2.179,00 £ | -2.179,00 £ | **0,00 £** |
| **20** | 27/08/2026 | 20/08/2026 | 26/08/2026 | 4.179,00 £ | 4.179,00 £ | **0,00 £** | 1.393,00 £ | -1.393,00 £ | **0,00 £** |

---

## 5. Trazabilidad y Enlaces del Proyecto (Estilo Obsidian)

* **[[Ordenes_BD_FP-Arquitectura]]**: Arquitectura general del modelo `Ordenes_BD_FinancesPrecision`.
* **[[Ordenes_BD_FP-CalculoManualEUR_Analisis]]**: Análisis gemelo del Data Mart en Euros (€).
* **[[reportes_financieros_solidgate]]**: Documentación oficial del reporte *Financial Entries* de Solidgate.
* **[[Ordenes_BD's_Arquitectura_Avertencias&Mejoras]]**: Guía operativa sobre reglas de desfase de fecha y descargas por canal.
* **[[Ordenes_BD's-DAFO]]**: Evaluación estratégica DAFO de las tres capas de hojas de cálculo.
* **[[power_query_transformation.py]]**: Script de automatización ETL que procesa los archivos CSV de la carpeta `/Finance/`.
