# Análisis de Debilidades de `Ordenes_BD` y Arquitectura de Modelos `FinancesPrecision`

Este documento detalla la evaluación técnica, comparativa y estratégica de los modelos de datos desarrollados para la gestión de ventas, reembolsos y conciliación financiera en Solidgate.

---

## 1. Contexto de la Evolución de Fuentes y Modelos

* **[[Orders_BD-SG_Orders|Orders_BD]]**: Basado en la API/reporte de órdenes (`https://hub.solidgate.com/payments/order`). Este reporte trabaja sobre un **estado mutable** acumulado por orden.
* **[[Orders_BD_FP-SG_Finances|Ordenes_BD_FinancesPrecision]]**: Basado en el reporte financiero de entradas (*Financial Entries*) [[reportes_financieros_solidgate]]. Funciona como un **libro diario contable inmutable**, donde cada evento (*SALE*, *REFUND*, *CHARGEBACK*, *FEE*) genera una línea contable independiente.
* **Fork Agregado [[Orders_BD_FPS-SG_Finances|Ordenes_BD_FinancesPrecision_Simp]]**: Variante optimizada que aplica agregación dimensional sobre la fuente inmutable, sacrificando el detalle por orden individual para conseguir una reducción masiva en el volumen de datos.

---

## 2. Análisis DAFO por Modelo de Datos

### A. `Ordenes_BD` (Fuente: `/payments/order` | Frecuencia: Semanal)

* **Propósito**: Estimación rápida de flujo de caja y seguimiento operativo a corto plazo.

| Categoria | Análisis Técnico y Operativo |
| :--- | :--- |
| **Debilidades (D)** | • **Sobreescritura de FX**: Al procesar un reembolso, el sistema sobreescribe los datos en la orden, impidiendo ver las diferencias entre el importe cobrado y el reembolsado ya que amos tienen Tipos de cambio potencialmente distintos (incluso si se han hecho el mismo dia).<br>• **Clasificación Errónea**: Clasifica los RDRs como ventas (`SALE`), inflando el volumen de facturación real.<br>• **Complejidad de Sync**: Exige lógicas complejas de *upsert* [[SolidgateOrdersUpsert]], al no registrarse los cambios en fechas distintas hemos de esportar por "Udated date" y hacer un upsert por "Order id" para registrar los cambios de la orden en `dispute_status`. |
| **Amenazas (A)** | • **Inconsistencias Acumuladas**: Acumulación de desviaciones si no se contrasta periódicamente con los reportes financieros mensuales.<br>• **Corrupción de Formatos**: Riesgo de alteración de comas/puntos decimales si los CSVs se editan manualmente en Excel sin pipeline estricto. |
| **Fortalezas (F)** | • **Agilidad y Ligereza**: Proceso de descarga e ingesta extremadamente rápido y con baja carga de procesamiento.<br>• **Cadencia Semanal**: Permite un ritmo constante de actualización sin saturar equipos ni infraestructura.<br>• **Simplicidad**: Estructura de datos directa centrada en el concepto tradicional de orden. |
| **Oportunidades (O)** | • **Previsiones de Cash Flow**: Herramienta idónea para responder a preguntas operativas inmediatas (*"¿cuánto cobraremos esta semana?"*).<br>• **Detección Precoz**: Permite identificar tendencias o problemas en pasarelas antes del cierre mensual oficial. |

---

### B. `Ordenes_BD_FinancesPrecision` (Fuente: *Financial Entries* | Frecuencia: Mensual)

* **Propósito**: Cierre contable, auditoría de anomalías y *Single Source of Truth*.

| Categoria | Análisis Técnico y Operativo |
| :--- | :--- |
| **Debilidades (D)** | • **Alta Carga Operativa**: El proceso de descarga, revisión manual y tratamiento previo exige dedicación y esfuerzo.<br>• **Volumen de Datos**: Elevado número de filas al registrar cada evento individualmente por `order_id`, saturando Power Query en equipos locales.<br>• **Baja Frecuencia**: Restringido a actualización mensual por su coste en tiempo y recursos. |
| **Amenazas (A)** | • **Saturación de Infraestructura**: El crecimiento del histórico transaccional puede provocar lentitud o errores de memoria en Power BI Desktop.<br>• **Dependencia de Procesos Manuales**: Riesgo de cuello de botella si depende de intervenciones humanas sin automatizar. |
| **Fortalezas (F)** | • **Inmutabilidad Contable**: Funciona como un libro diario inmutable donde cada evento (`SALE`, `REFUND`, `FEE`, `CHARGEBACK`) es independiente.<br>• **Precisión de FX**: Mantiene el tipo de cambio y monto exactos a la fecha de cada evento (`accounting_date`).<br>• **Capacidad de Auditoría**: Permite la ejecución de rutinas automáticas de control (recuentos impares `+ - + = +`, ventas negativas, etc.). |
| **Oportunidades (O)** | • **Automatización mediante Python**: La integración con scripts en Python (`power_query_transformation.py`) elimina la carga manual previa.<br>• **Conciliación de Settlements**: Facilita el cuadre exacto con las liquidaciones bancarias de las pasarelas.<br>• **Auditoría de Garantía**: Base sólida para auditorías financieras externas e inspecciones fiscales. |

---

### C. `Ordenes_BD_FinancesPrecision_Simp` (Fork Agregado | Frecuencia: Mensual / Analítica)

* **Propósito**: Dashboards ejecutivos de alto rendimiento sin pérdida de precisión.

| Categoria | Análisis Técnico y Operativo |
| :--- | :--- |
| **Debilidades (D)** | • **Pérdida de Granularidad**: Al eliminar el `order_id` y agrupar por dimensiones (Día / Producto / Proveedor / Divisa), no permite auditar transacciones individuales.<br>• **Desviaciones Centesimales**: Ligeras diferencias por el acumulado de redondeos numéricos (*floating-point*) tras sumar grandes volúmenes. |
| **Amenazas (A)** | • **Uso Inadecuado**: Intentar investigar incidencias puntuales de clientes en un modelo que carece de nivel de orden.<br>• **Desconfianza por Redondeos**: Malentendidos entre equipos si no se explicita que las variaciones de centavos se deben al redondeo de sumas agregadas. |
| **Fortalezas (F)** | • **Rendimiento Máximo**: Reducción drástica del tamaño del dataset (hasta un 90-95% menos de filas), permitiendo un renderizado instantáneo en Power BI.<br>• **Misma Fuente Inmutable**: Ofrece exactamente las mismas cifras consolidadas que la versión detallada sin alterar la realidad financiera.<br>• **Modelado Limpio**: Estructura optimizada directamente para análisis analítico dimensional. |
| **Oportunidades (O)** | • **Dashboards Ejecutivos**: Alimentar cuadros de mando de dirección de respuesta ultrarrápida.<br>• **Analítica Distribuida**: Compartir modelos analíticos ligeros entre distintos departamentos sin comprometer el rendimiento. |

---

## 3. Arquitectura Completa de Tres Capas y Casos de Uso

Cada uno de los tres modelos cumple un rol estratégico dentro de la operativa del negocio:

```
[ Fuente: /payments/order ] ────► Ordenes_BD (Semanal: Cash Flow y Proyecciones)
                                    
[ Fuente: Financial Entries ] ──┬─► Ordenes_BD_FinancesPrecision (Mensual: Auditoría por Orden)
                                │
                                └─► Ordenes_BD_FinancesPrecision_Simp (Fork Agregado: Performance)
```

### A. `Ordenes_BD` (Frecuencia: **Semanal**)
* **Ventajas Operativas**: Descarga rápida, menor volumen de procesamiento previo e ingesta ágil.
* **Caso de Uso**: **Previsiones a corto plazo y estimación de Cash Flow**. Es ideal para responder preguntas operativas rápidas como: *"En base a lo vendido esta semana, ¿cuánto vamos a cobrar en la liquidación próxima?"*.
* **Limitación**: Menor precisión contable histórica y necesidad de asumir ajustes posteriores.

### B. `Ordenes_BD_FinancesPrecision` (Frecuencia: **Mensual / Auditoría**)
* **Ventajas Operativas**: Precisión contable absoluta a nivel de cada orden individual (`order_id`), inmutabilidad de eventos y trazabilidad completa para el cuadre oficial con *Settlements*.
* **Caso de Uso**: **Cierre contable, auditoría profunda de anomalías y verificación de transacciones duplicadas o impares**.
* **Limitación**: **Alta carga de descarga de datos, procesamiento y consumo de memoria** debido a la granularidad fila a fila por cada orden.

### C. `Ordenes_BD_FinancesPrecision_Simp` (Fork Agregado / Rendimiento)
* **Concepto**: Es una simplificación y **fork de `Ordenes_BD_FinancesPrecision`** que agrupa y suma los datos por dimensiones clave (por ejemplo: `Día / Producto / Proveedor / Divisa / Tipo de Registro`).
* **Ventajas Operativas**: **Reducción masiva del volumen de datos**, lo que acelera los tiempos de respuesta, renderizado de tableros y cálculos analíticos en Power BI / Python.
* **Precisión y Comportamiento Observado**:
  * **Sin pérdida apreciable de precisión**: Al provenir exactamente de la misma fuente inmutable (*Financial Entries*), las cifras consolidadas coinciden de forma consistente con la versión no agregada.
  * **Diferencias sutiles por redondeo**: Las únicas variaciones detectadas entre ambos modelos son diferencias mínimas a nivel de centavos, explicables por el efecto acumulativo de redondeos numéricos (*floating-point rounding*) tras realizar operaciones de suma agregada sobre grandes volúmenes de transacciones.
* **Caso de Uso**: **Reportes ejecutivos, análisis de tendencias y cuadros de mando de alto nivel** donde se requiere la máxima precisión financiera pero sin la sobrecarga de procesar cada `order_id` individual.

---

## 4. Matriz Comparativa de los Tres Modelos

| Criterio | `Ordenes_BD` | `Ordenes_BD_FinancesPrecision` | `Ordenes_BD_FinancesPrecision_Simp` |
| :--- | :--- | :--- | :--- |
| **Origen de Datos** | `/payments/order` | `financial-entries` | `financial-entries` (Agregado) |
| **Granularidad** | Fila por Orden (Mutable) | Fila por Evento / Orden (Inmutable) | Agregado por Día / Producto / Proveedor |
| **Frecuencia** | Semanal | Mensual | Mensual / Analítica Continuada |
| **Carga de Datos / Peso** | Ligera | Muy Alta | Muy Baja / Extremadamente Rápida |
| **Precisión Financiera** | Aproximada (sujeta a sobreescritura) | Exacta / Absoluta | Prácticamente Identica (salvo redondeos) |
| **Propósito Principal** | Proyecciones semanales y Cash Flow | Auditoría contable y cierre oficial | Dashboards de performance y tendencias |

---
## 4. Recomendación Estratégica

El análisis DAFO confirma que **ningún modelo sustituye completamente a los otros**, sino que forman una cadena de valor:
1. **`Ordenes_BD`** detecta y estima el negocio en tiempo real semanal.
2. **`Ordenes_BD_FinancesPrecision`** fija y audita la contabilidad de forma mensual.
3. **`Ordenes_BD_FinancesPrecision_Simp`** expone los resultados auditados de forma ágil para la toma de decisiones ejecutivas.

## 5. Conclusión

La arquitectura actual queda perfectamente equilibrada:
1. **`Ordenes_BD`** brinda velocidad para la toma de decisiones semanales.
2. **`Ordenes_BD_FinancesPrecision`** garantiza el rigor y la trazabilidad contable fila a fila para el cierre mensual.
3. **`Ordenes_BD_FinancesPrecision_Simp`** ofrece la solución de rendimiento para explotar analíticamente los datos precisos de finanzas sin saturar la capacidad de cómputo.
