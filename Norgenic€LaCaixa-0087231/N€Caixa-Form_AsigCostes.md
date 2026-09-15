---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos]
component: A2.0
related: [[01_Arquitectura_General]], [[wf_A2_AsignacionDeGastos]], [[A1_ImportarMovimientos_GS]], [[A1_ImportarMovimientos_WF(deprecado)]], [[C0_PunteoFacturas]], [[Metricas_Asignacion]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Clasificar automáticamente cada nuevo movimiento bancario usando reglas de matching basadas en patrones de texto del movimiento para añadirlo a `AsigCostes` y crear una query utilizable por `C0` para seleccionar las facturas coincidentes.

---

## 📋 Descripción de las columnas

- **Fuente**: Movimientos nuevos en `Movimientos_cuenta_0087231` (trigger desde A1)
- **GID Hoja**: 760684095
- **Columnas**:
  - **A: Descripcion**:
    - **Contenido**: Saca de `Movimientos_cuenta_0087231` columna J la descripción del movimiento. Hace lo mismo para la base de datos que contiene los patrones de movimientos `AsigCostes`. Identifica las descripciónes de `Movimientos_cuenta_0087231` que aún no se encuentran en `AsigCostes`.
    - **Formula/s**: [[Form_AsigCostes_Formulas]](Formula 1)
    - **Referencias**: Hojas : `Movimientos_cuenta_0087231`;`Rangos`;`AsigCostes`
  - **B: Movimientos**:
    - **Contenido**: Divide el descriptor en el texto de las dos columnas que lo formaron para poder formar patrones mas precisos con ellos. Esta columna se queda com "Movimientos"
    - **Formula/s**: [[Form_AsigCostes_Formulas]](Formula 2)
    - **Referencias**: `Form_AsigCostes`; `Rangos`
  - **C: Más datos**:
    - **Contenido**: Heredado de [[Form_AsigCostes_Formulas]](Formula 2). Contiene "Más datos".
    - **Formula/s**: NULL
    - **Referencias**: 
  - **D: CF in/out**:
    - **Contenido**: Clasifiica el tipo de gasto para el CashFlow.
    - **Formula/s**: [[Form_AsigCostes_Formulas]](Formula 3)
    - **Referencias**: `Rangos`; `Movimientos_cuenta_0087231`; `AsigCostes`; `PreCashFlow2`
  - **E : Patron_CF category**:
    - **Contenido**: Formula que intenta establecer el valor de "CF_Category" de forma automàtica para aquellos movimientos recurrentes que entran con diferencias en la escritura de su texto. Si la formula no es capaz de producirlo lo saca de lo introducido manualmente en la columna N 'M_Category'.
    - **Formula/s**: [[Form_AsigCostes_Formulas]](Formula 4)
    - **Referencias**: [[Form_AsigCostes|N: 'M_Category']]
  - **F: Concepto**:
    - **Contenido**: Heredado de [[Form_AsigCostes_Formulas]](Formula 4).
    - **Formula/s**: NULL
    - **Referencias**: [[Form_AsigCostes|O]]
  - **G: RegexNombre**:
    - **Contenido**: Heredado de [[Form_AsigCostes_Formulas]](Formula 4).
    - **Formula/s**: NULL
    - **Referencias**: [[Form_AsigCostes|O]]
  - **H: 'Regex Fecha1A'**:
    - **Contenido**: Heredado de [[Form_AsigCostes_Formulas]](Formula 4).
    - **Formula/s**: NULL
    - **Referencias**: [[Form_AsigCostes|P]]
  - **I: 'Regex Fecha1B'**:
    - **Contenido**: Heredado de [[Form_AsigCostes_Formulas]](Formula 4).
    - **Formula/s**: NULL
    - **Referencias**: [[Form_AsigCostes|Q]]
  - **J: 'Regex Fecha2A'**:
    - **Contenido**: Heredado de [[Form_AsigCostes_Formulas]](Formula 4).
    - **Formula/s**: NULL
    - **Referencias**: [[Form_AsigCostes|P]]
  - **K: 'Regex Fecha2B'**:
    - **Contenido**: Heredado de [[Form_AsigCostes_Formulas]](Formula 4).
    - **Formula/s**: NULL
    - **Referencias**: [[Form_AsigCostes|R]]
  - **L: 'Importe'**:
    - **Contenido**: Heredado de [[Form_AsigCostes_Formulas]](Formula 4).
    - **Formula/s**: NULL
    - **Referencias**: [[Form_AsigCostes|S]] 
  - **M: 'Observaciones'**:
    - **Contenido**: Heredado de [[Form_AsigCostes_Formulas]](Formula 4).
    - **Formula/s**: NULL
    - **Referencias**: [[Form_AsigCostes|T]] 
  - **N: 'M_Category'**:
    - **Contenido**: Categoria del gasto.
    - **Formula/s**:
    - **Referencias**: [[Form_AsigCostes_Formulas]](Formula 4)
  - **O: 'NombresFras/Conceptos'**:
    - **Contenido**: Nombre/Descripción del causante.
    - **Formula/s**: NULL
    - **Referencias**: [[Form_AsigCostes_Formulas]](Formula 4)
  - **P: 'Sincrona'**:
    - **Contenido**: Boolean que indica si el pago y la factura coinciden en fecha.
    - **Formula/s**: NULL
    - **Referencias**: [[Form_AsigCostes_Formulas]](Formula 4)
  - **Q: 'Min Date'**:
    - **Contenido**: Integer, dias de desvio permitido respecto a la fecha de la factura.
    - **Formula/s**: NULL
    - **Referencias**: [[Form_AsigCostes_Formulas]](Formula 4)
  - **R: 'Max Date'**:
    - **Contenido**: Integer, dias de desvio permitido respecto a la fecha de la factura.
    - **Formula/s**: NULL
    - **Referencias**: 
  - **S: 'Mismo Importe'**:
    - **Contenido**:Boolean que indica si el pago y la factura coinciden en importe.
    - **Formula/s**: NULL
    - **Referencias**: [[Form_AsigCostes_Formulas]](Formula 4)
  - **T: 'M_Observaciones'**:
    - **Contenido**: String con observaciónes sobre el movimiento.
    - **Formula/s**: NULL
    - **Referencias**: [[Form_AsigCostes_Formulas]](Formula 4)

---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
