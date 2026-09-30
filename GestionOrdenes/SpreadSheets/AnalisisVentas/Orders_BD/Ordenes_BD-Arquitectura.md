# Arquitectura Técnica del Spreadsheet `Ordenes_BD`

Este documento detalla la estructura, flujo de datos, fórmulas y data marts que componen el spreadsheet **`Ordenes_BD`**. Esta arquitectura está diseñada para la ingesta, enriquecimiento y conciliación semanal de transacciones financieras procedentes de Solidgate contra las liquidaciones de pago (*Settlements*) emitidas por las pasarelas (ej. Checkout).

---

## 1. Visión General de la Arquitectura

El sistema `Ordenes_BD` funciona como un pipeline en hoja de cálculo compuesto por tres bloques principales:

```
[ Exportación CSV Solidgate ] 
             │
             ▼ (Google Apps Script: UPSERT)
┌─────────────────────────────────────────────────────────┐
│              SG_Orders (Tabla Maestra)                  │
│  - Columnas Ingestadas (A-J)                            │
│  - Columnas Enriquecidas con Fórmulas (K-T)             │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼ (Consultas QUERY)
┌─────────────────────────────────────────────────────────┐
│               Data Marts de Conciliación                │
│  ├── CalculoManual$  (USD: ITIN, SRVITIN, UTF)          │
│  ├── CalculoManual£  (GBP: UKPA)                        │
│  └── CalculoManual€  (EUR: TFN [AUD], UKPA [GBP] / FX)  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Ingesta y Sincronización de Datos (`SolidgateOrdersUpsert`)

Para alimentar la tabla maestra `SG_Orders`, se utiliza un script automatizado en **Google Apps Script** que procesa archivos CSV exportados desde `https://hub.solidgate.com/payments/order`.

### Algoritmo de Sincronización (UPSERT):
1. **Extracción y Limpieza**: Lee las filas importadas, elimina filas vacías (`filter`) e invierte el orden del array (`reverse`) para procesar los registros de más antiguos a más recientes.
2. **Evaluación de UID y Fecha de Modificación**:
   * **`APPEND` (Nueva Orden)**: Si el `order_id` (columna A) no existe en la hoja, la fila se añade al final de las columnas A-J.
   * **`UPDATE` (Orden Modificada)**: Si el `order_id` existe pero la fecha `updated_at` (columna C) difiere de la almacenada, el script sobreescribe las columnas A-J con el nuevo estado.
   * **`IGNORE` (Sin Cambios)**: Si el `order_id` y `updated_at` coinciden, no se realiza ninguna acción.

---

## 3. Hoja Maestra de Datos (`SG_Orders`)

Es la base de datos central que almacena todas las órdenes acumuladas de Solidgate y las enriquece mediante fórmulas dinámicas.

### Estructura de Columnas:

#### A. Columnas Ingestadas (A-J):
* **`A` (`Order_id`)**: Identificador único de la orden en Solidgate.
* **`B` (`created_at`)**: Fecha y hora de creación original.
* **`C` (`updated_at`)**: Fecha y hora del último cambio registrado.
* **`D` (`Amount`)**: Monto en divisa original de la transacción.
* **`E` (`Currency`)**: Código de divisa de origen.
* **`F` (`Status`)**: Estado de la orden (`settled` para ventas / `refunded` para reembolsos).
* **`G` (`Descriptor`)**: Identificador de plataforma/pasarela.
* **`H` (`Channel`)**: Canal de adquisición.
* **`I` (`Card number`)**: Enmascaramiento de tarjeta del cliente.
* **`J` (`Email`)**: Correo electrónico del cliente.

#### B. Columnas Enriquecidas con Fórmulas (K-T):

* **`K` (`Connector`)**: Asigna la plataforma de pago procesadora.
  * **Fórmula (`F1`)**: `=BUSCARV(G2;MID!$B$2:$C;2)`
* **`L` (`Product`)**: Clasifica el código de producto según el prefijo del ID de orden.
  * **Fórmula (`F2`)**: `=SI(H2="Norgenic_sandbox"; "Test"; REGEXEXTRACT(A2; "^(?:ABN|ACA|ITIN|TFN|UKPA|UTF|SRVITIN|NZBC)"))`
* **`M` (`Amount`)**: Normaliza el formato numérico decimal convirtiendo puntos a comas.
  * **Fórmula (`F3`)**: `=--(REGEXREPLACE(D2; "."; ","))`
* **`P` (`F_created_at`)**: Convierte `created_at` a formato de fecha ejecutable en consultas SQL/QUERY.
  * **Fórmula (`F4`)**: `=FECHA(INDICE(ArrayFormula(SPLIT(SPLIT(B2;" ");"/"));3); INDICE(ArrayFormula(SPLIT(SPLIT(B2;" ");"/"));2); INDICE(ArrayFormula(SPLIT(SPLIT(B2;" ");"/"));1))`
* **`Q` (`F_updated_at`)**: Convierte `updated_at` a formato de fecha utilizable.
  * **Fórmula (`F5`)**: `=FECHA(INDICE(ArrayFormula(SPLIT(SPLIT(C2;" ");"/"));3); INDICE(ArrayFormula(SPLIT(SPLIT(C2;" ");"/"));2); INDICE(ArrayFormula(SPLIT(SPLIT(C2;" ");"/"));1))`
* **`R` (`alternUID`)**: Genera una clave sintética compuesta.
  * **Fórmula (`F6`)**: `=SUSTITUIR(SUSTITUIR(P2;"/";"-");"-";"/")&";"&I2&";"&J2`
* **`S` (`Sett_Pago_Revolut`)** / **`T` (`Sett_Refunded_Revolut`)**: Cruzan información con la hoja de banco Revolut para detectar coincidencias de cobros y devoluciones.
  * **Fórmulas (`F7`, `F8`)**:
    * `F7`: `=SI(K2="revolut"; QUERY(RevolutOrders!$A$2:$K; "select A where (K ='"&$R2&"' and A contains 'psp_')"; 0); "")`
    * `F8`: `=SI(Y($K2="revolut"; $F2="refunded"); (QUERY(RevolutOrders!$A$2:$K; "select F where A ='"&$S2&"'"; 0)); "")`

---

## 4. Data Marts de Conciliación Semanal (`CalculoManual`)

Cada una de estas hojas actúa como un Data Mart especializado para comparar el informe de pago semanal (*Settlement*) emitido por el proveedor frente a las sumas calculadas dinámicamente desde `SG_Orders`.

### A. `CalculoManual$` (Data Mart Dólares - USD)
* **Productos Incluidos**: ITIN, SRVITIN, UTF.
* **Características**: No requiere conversión de divisa (todas las transacciones están en USD).
* **Fórmulas Principales**:
  * **Rango Semanal (`E`, `F`)**: `=F3+1` y `=E4+6` (Generación automática de bloques de 7 días).
  * **Ventas Calculadas (`G` - `O_Ventas`)**:
    `=INDICE(QUERY(SG_Orders!$K$2:$P; "select sum(M) where K='Checkout' AND (L = 'ITIN' or L = 'SRVITIN' or L='UTF') and P >= date '"&TEXTO($E3;"yyyy-mm-dd")&"' and P<= date '"&TEXTO($F3;"yyyy-mm-dd")&"'"); 2)`
  * **Reembolsos Calculados (`H` - `O_Refunds`)**:
    `=SI.ERROR(INDICE(QUERY(SG_Orders!$F$2:$Q; "select sum(M) where K='Checkout' AND (L = 'ITIN' or L = 'SRVITIN' or L='UTF') and F= 'refunded' and Q >= date '"&TEXTO($E3;"yyyy-mm-dd")&"' and Q<= date '"&TEXTO($F3;"yyyy-mm-dd")&"'"); 2); 0)`
  * **Diferencias (`I`, `J`)**: `=B3-G3` (Diferencia en Ventas) y `=C3-H3` (Diferencia en Refunds).
  * **Control de Precisión (Fila 1)**: `=PROMEDIO(I3:I)` y `=PROMEDIO(J3:J)`. Miden la desviación promedio del modelo; cuanto más cercano a 0, mayor exactitud tiene el cuadre.

---

### B. `CalculoManual£` (Data Mart Libras - GBP)
* **Productos Incluidos**: UKPA.
* **Fórmulas Principales**:
  * **Ventas y Refunds Calculados (`G`, `H`)**: Idéntico a `CalculoManual$`, adaptando el filtro de producto a `L = 'UKPA'`.
  * **Diferencias y Precisión (`I`, `J`, Fila 1)**: Evalúan la desviación entre el PDF de Settlement en GBP y los registros de `SG_Orders`.

---

### C. `CalculoManual€` (Data Mart Euros - EUR y Laboratorio Multidivisa)
* **Complejidad**: Concilia transacciones procesadas en monedas secundarias (AUD para TFN/ACA y GBP para UKPA) que Checkout liquida consolidadas en EUR.
* **Lógica del Laboratorio FX (Tipos de Cambio)**:
  * Columnas `L`, `M`: Tipos de cambio del mismo día (`EUR/AUD`, `EUR/GBP`) extraídos del Banco de España.
  * Columnas `N`, `O`: Tipos de cambio del día anterior (`Dia-1`).
  * **Experimentos de Redondeo (Columnas `P` a `Y`)**:
    Se configuraron diferentes estrategias de conversión para encontrar el patrón de cálculo usado por Checkout en sus Settlements:
    1. `P`, `Q`: Redondeo del tipo de cambio a 1 decimal (Día actual / Día anterior).
    2. `R`, `S`: Redondeo a 2 decimales.
    3. `T`, `U`: Sin redondeo (Tipo de cambio original).
    4. `V`, `W`: **Redondeo al alza (`REDONDEAR.MAS`) a 1 decimal para Ventas**.
    5. `X`, `Y`: **Redondeo al alza (`REDONDEAR.MAS`) a 1 decimal para Reembolsos**.
* **Resultado del Laboratorio**: Las fórmulas de las columnas **`V` a `Y`** (redondeo al alza a 1 decimal) obtuvieron los promedios más cercanos a cero en la Fila 1, demostrando ser la combinación más precisa para anticipar la liquidación en EUR.

---

## 5. Integración con la Arquitectura Global de Datos

Tal como se documenta en **`Ordenes_BD's-DAFO.md`**, este spreadsheet representa la **capa operativa semanal**:

| Capa del Sistema | Origen de Datos | Frecuencia | Función Principal |
| :--- | :--- | :--- | :--- |
| **`Ordenes_BD`** *(este spreadsheet)* | `/payments/order` + GAS | **Semanal** | Previsiones de cobro (*Cash Flow*) y reconciliación ágil con Settlements. |
| **`Ordenes_BD_FinancesPrecision`** | *Financial Entries* (M/Python) | **Mensual** | Libro diario contable inmutable, auditoría exacta por `order_id` y cierre oficial. |
| **`Ordenes_BD_FinancesPrecision_Simp`** | *Financial Entries* (Agregado) | **Mensual / Analítica** | Dashboards ejecutivos de alto rendimiento sin sobrecarga de memoria. |

---

## 6. Conclusión

El spreadsheet `Ordenes_BD` no es un simple acumulado de datos, sino un **módulo analítico de conciliación activa**. Su diseño combina un pipeline de ingesta programada (`SolidgateOrdersUpsert`), un motor de enriquecimiento de reglas de negocio (`SG_Orders`) y una batería de data marts dinámicos (`CalculoManual $, £, €`) que permiten validar semana a semana la exactitud de los cobros recibidos frente al volumen operado.
