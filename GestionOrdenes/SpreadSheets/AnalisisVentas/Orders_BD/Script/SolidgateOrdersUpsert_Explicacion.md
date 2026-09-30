# Explicación Técnica y Funcional: Google Apps Script de UPSERT (`SolidgateOrdersUpsert.md`)

Este documento analiza en detalle el funcionamiento, la lógica de programación y el contexto estratégico del script de Google Apps Script contenido en **`SolidgateOrdersUpsert.md`**, así como su relación directa con el análisis DAFO de la arquitectura de datos de finanzas (**`Ordenes_BD's-DAFO.md`**).

---

## 1. Propósito y Contexto del Script

El archivo `SolidgateOrdersUpsert.md` contiene el código en **Google Apps Script (GAS)** diseñado para automatizar la sincronización de órdenes procedentes del reporte `/payments/order` de Solidgate desde una carpeta de Google Drive hacia una hoja de cálculo histórica acumulada.

Debido a que el reporte `/payments/order` opera sobre un **estado mutable** (donde una orden puede cambiar de estado o actualizarse en días o semanas posteriores), la ingesta no puede realizarse mediante un simple *append* (añadir al final), sino que requiere una operación de **UPSERT** (Update + Insert).

---

## 2. Arquitectura y Lógica del Algoritmo (UPSERT)

El script implementa tres funciones principales: `getOrdenesSolidgate()`, `upsertSolidgateOrders()` y `onOpen()`.

### A. Flujo de Ingesta (`getOrdenesSolidgate`)
1. **Acceso a Google Drive**: Busca y abre el primer archivo de hoja de cálculo en la carpeta configurada (`idCarpetaDriveOrdenesSolidgate`).
2. **Extracción de Datos útiles**: Lee la hoja a partir de la fila de inicio configurada (`filaInicioDatosImportadosSG = 2`) y extrae todo el rango con datos.
3. **Limpieza e Inversión**: Elimina filas sin datos e invierte el orden para dejarlo en orden cronológico ascendente.

### B. Lógica de Comparación y Sincronización (`upsertSolidgateOrders`)
El script procesa únicamente las **primeras 10 columnas (A-J)** para evitar sobreescribir columnas calculadas o personalizadas que existan a la derecha en la hoja histórica (`lastRelevantColumnSG = 10`).

Para cada fila importada, evalúa el identificador único `UID` (columna A / `order_id`):

| Escenario | Condición sobre el UID | Evaluación de `updated_at` (Columna C) | Acción Ejecutada |
| :--- | :--- | :--- | :--- |
| **I. Nueva Orden** | `UID` **NO existe** en el Histórico | N/A | **APPEND**: Añade la fila al final del histórico (columnas A-J). |
| **II. Orden Modificada** | `UID` **EXISTE** en el Histórico | `updated_at` importado **≠** `updated_at` histórico | **UPDATE**: Sobreescribe las columnas A-J de la fila existente en el histórico. |
| **III. Orden Sin Cambios** | `UID` **EXISTE** en el Histórico | `updated_at` importado **=** `updated_at` histórico | **IGNORE**: Ignora la fila (sin operaciones de escritura). |

---

## 3. Relación con `Ordenes_BD's-DAFO.md`

El script de `SolidgateOrdersUpsert.md` es la **pieza de software clave** que sostiene operativamente el modelo **`Ordenes_BD`** descrito en `Ordenes_BD's-DAFO.md`, y su comportamiento explica directamente varias de las debilidades y fortalezas mapeadas en la arquitectura.

### A. Explicación de las Debilidades de `Ordenes_BD`
En el análisis DAFO de `Ordenes_BD` (fuente `/payments/order`), se destacan tres debilidades directamente vinculadas a este script:

1. **Complejidad de Sincronización (Sync)**:
   * Al no registrarse los cambios de estado en fechas independientes, es obligatorio exportar por `updated_at` y ejecutar este script para actualizar el `dispute_status` u otros estados de la orden [1, 6].
   * Depende de la ejecución periódica de scripts externos en Google Apps Script, añadiendo un punto de fallo en la infraestructura de datos.
2. **Sobreescritura de Información**:
   * Como el script realiza un **UPDATE** en la fila existente cuando detecta un cambio en `updated_at`, se pierde la foto histórica original del momento de la venta si varían montos o tipos de cambio [1, 6].
3. **Rigidez de Estructura**:
   * La delimitación estricta a las columnas A-J impone restricciones en el diseño de las hojas históricas de Google Sheets [1].

### B. Rol en la Estrategia de Dos Velocidades (Semanal vs. Mensual)
En el DAFO de tres capas:
* **En `Ordenes_BD` (Frecuencia Semanal)**: Este script de UPSERT proporciona la agilidad necesaria para mantener al día el seguimiento operativo semanal y las previsiones de cobro (*Cash Flow*), procesando de forma rápida únicamente las órdenes nuevas o actualizadas [6, 10].
* **En `Ordenes_BD_FinancesPrecision` (Frecuencia Mensual)**: Este script resulta **completamente innecesario / obsolete**. Al basarse en el reporte *Financial Entries* (libro diario inmutable por `accounting_date`), cada evento (`SALE`, `REFUND`, `CHARGEBACK`) es una línea contable independiente. Por tanto, el modelo inmutable funciona por simple inserción (*append*) sin requerir lógica de UPSERT [5, 7].

---

## 4. Conclusión

El script `SolidgateOrdersUpsert.md` representa la solución técnica creada para mitigar la naturaleza **mutable** del reporte de órdenes tradicionales de Solidgate. Si bien otorga la agilidad requerida para la operativa semanal de `Ordenes_BD`, justifica a su vez la transición hacia el modelo inmutable `Ordenes_BD_FinancesPrecision` para los cierres y auditorías contables definitivas.
