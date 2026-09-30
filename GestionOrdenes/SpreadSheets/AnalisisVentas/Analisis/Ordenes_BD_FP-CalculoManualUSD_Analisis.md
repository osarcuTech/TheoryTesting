# Análisis del Data Mart de Conciliación Manual en Dólares ($)

Este documento presenta el análisis técnico y financiero exhaustivo de los datos contenidos en el archivo ****, correspondiente a la hoja de conciliación semanal en Dólares estadounidenses ($) dentro del modelo inmutable **** (ver [[Ordenes_BD_FP-Arquitectura]]).

---

## 1. Propósito y Función del Data Mart

El Data Mart **** audita y cuadra las liquidaciones semanales emitidas por el adquirente **Checkout** en Dólares ($) frente a la base de datos inmutable ****, nutrida a partir de los reportes de entradas financieras (*Financial Entries*) de Solidgate (ver [[reportes_financieros_solidgate]]).

* **Ámbito del Proveedor**: Adquirente **Checkout** ().
* **Divisa Analizada**: Dólar estadounidense (**USD / *).
* **Entidad Legal Relevante**: **Stropper** (requiere conversión FX a Euros para consolidación corporativa).
* **Cobertura Temporal**: 67 períodos semanales de liquidación, desde el **22/05/2025** hasta el **27/08/2026**.
* **Integridad del Modelo**: Muestra la precisión del modelo inmutable (ver [[Ordenes_BD's-DAFO]]) y su capacidad para aislar diferencias de corte temporal (*timing differences*) y conversiones multidivisa.

---

## 2. Resumen Métrico de la Serie (2025 - 2026)

A partir del procesamiento de los 67 registros semanales, se obtienen los siguientes totales consolidados en Dólares ($):

| Métrica Financiera | Total Settlement (Checkout) | Total SG_Finances | Diferencia Acumulada Bruta | Desviación Ajustada Objetivo (Fila 0) |
| :--- | :---: | :---: | :---: | :---: |
| **Ventas ()** | **538.948,60 * | **541.422,20 * | **-2.473,60 * | **-36,92 * |
| **Reembolsos ()** | **66.742,60 * | **-66.840,20 * | **-97,60 * | **-1,46 * |
| **Contracargos ()** | **11.542,64 * | **-11.532,64 * | **+10,00 * | **+0,15 * |

### Interpretación de las Celdas de Control Objetivo (Fila 0):
La fila de control superior (Fila 0) del spreadsheet fija los objetivos de **descuadre residual aceptable**:
* ** = -36,92 *: Representa un margen de desviación menor al **0,007%** sobre un volumen bruto de ventas procesado superior a 538k $.
* ** = -1,46 * y ** = +0,15 *: Confirman un grado de concordancia prácticamente idéntico al 100% entre las liquidaciones de Checkout y el registro inmutable de Solidgate.

---

## 3. Módulo Especial de Conversión Multidivisa: Sub-tabla Stropper ($ ightarrow €)

Una característica exclusiva de este Data Mart respecto a las hojas en Euros ([[Ordenes_BD_FP-CalculoManualEUR_Analisis]]) y Libras ([[Ordenes_BD_FP-CalculoManualGBP_Analisis]]) es la inclusión de un bloque analítico de **conversión FX ($ ightarrow €)** de 7 columnas (, , , , , , ).

### Justificación Técnica:
Las transacciones operadas en Dólares bajo la entidad legal **Stropper** deben convertirse a Euros (€) para la contabilidad corporativa.
* **Tipo de Cambio Aplicado ()**: Varía dinámicamente entre **1,13** y **1,19** según el tipo de cambio oficial del día de liquidación.
* **Totales Convertidos a Euros (€)**:
  * **Ventas Stropper ()**: **466.753,67 €**
  * **Reembolsos Stropper ()**: **66.567,44 €**
  * **Contracargos Stropper ()**: **2.121,55 €**
* **Metas de Control Convertidas (Fila 0 en €)**:
  *  = **13.295,40 €**
  *  = **12.393,16 €**
  *  = **-8.614,42 €**

---

## 4. Análisis de Ventanas de Corte y Compensaciones Temporales (*Timing Differences*)

Al igual que en los análisis de EUR y GBP, los descuadres semanales temporales se compensan completamente entre semanas consecutivas:

1. **Compensación Semanas 60 y 61 (Junio / Julio 2026)**:
   * **Semana 60 (24/06/2026..30/06/2026)**: Sin informe de liquidación recibido (), mientras  registró 99,00 $ en ventas y -249,00 $ en reembolsos (, ).
   * **Semana 61 (01/07/2026..07/07/2026)**: Liquidación recibida por 755,00 $ frente a 656,00 $ en  (, ).
   * **Efecto Neto**: **0,00 * en ambas métricas.

2. **Compensación Semanas 64 y 65 (Julio / Agosto 2026)**:
   * **Semana 64**:  = **-109,00 *.
   * **Semana 65**:  = **+109,00 *.
   * **Efecto Neto**: **0,00 *.

3. **Evolución Temporal del Volumen USD**:
   * Se observa una **reducción progresiva del volumen en Dólares** a partir de mayo de 2026 (pasando de promedios de 10.000 $ - 15.000 $ semanales en 2025 a menos de 1.000 $ semanales en el verano de 2026). Esto coincide con el trasvase de operaciones hacia las entidades europeas y británicas (UKPA) analizadas en [[Ordenes_BD_FP-CalculoManualGBP_Analisis]].

---

## 5. Sintaxis de Consultas QUERY en Google Sheets

Para extraer las ventas, reembolsos y contracargos desde , la hoja emplea la sintaxis estructurada de :



---

## 6. Trazabilidad y Enlaces del Sistema (Estilo Obsidian)

Este documento se conecta con la red de conocimiento de la arquitectura financiera:

* **[[Ordenes_BD_FP-Arquitectura]]**: Especificación de la hoja maill y estructura inmutable .
* **[[Ordenes_BD_FP-CalculoManualEUR_Analisis]]**: Análisis del Data Mart de conciliación en Euros (€).
* **[[Ordenes_BD_FP-CalculoManualGBP_Analisis]]**: Análisis del Data Mart de conciliación en Libras Esterlinas (£).
* **[[reportes_financieros_solidgate]]**: Especificación oficial de los reportes *Financial Entries*.
* **[[Ordenes_BD's_Arquitectura_Avertencias&Mejoras]]**: Reglas de desfase horario e ingesta multi-canal.
* **[[Ordenes_BD's-DAFO]]**: Evaluación estratégica del modelo de tres capas.
* **[[power_query_transformation.py]]**: Script de automatización ETL en Python para procesar el reporte inmutable.
