---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos]
component: A2.2
related: [[01_Arquitectura_General]], [[wf_A2_AsignacionDeGastos]], [[A1_ImportarMovimientos_GS]], [[A1_ImportarMovimientos_WF(deprecado)]], [[C0_PunteoFacturas]], [[Metricas_Asignacion]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Transferencia manual de los datos de [[AsigCostes_Formulas]] para crear una base de datos permanente de patrones de movimiento, su significado, implicaciones y formas de tratarlos.
---

## 📋 Descripción de las columnas

- **Fuente**: Movimientos nuevos en `Movimientos_cuenta_0087231` (trigger desde A1)
- **GID Hoja**: 223389945
- **Columnas**:
  - **A: Descripcion**:
    - **Contenido**: [[AsigCostes_Formulas|A]].
    - **Formula/s**: =QUERY(INDIRECTO("AsigCostes!A1:M"& lr_AsigCostes); "select A,B,C,F,G,H,I,J,K,L,M where E = 'Proveedores' and (F<> 'Puntuales' and F<>'Anuales' and F<>'?' and F<>'Devo?' and F<>'Devoluciones')";1)
    - **Referencias**: 
  - **B: Movimientos**:
    - **Contenido**: [[AsigCostes_Formulas|B]].
    - **Formula/s**: NULL
    - **Referencias**: [[N€Caixa-PProveedores|A]]
  - **C: Más datos**:
    - **Contenido**: [[AsigCostes_Formulas|C]].
    - **Formula/s**: NULL
    - **Referencias**: [[N€Caixa-PProveedores|A]]
  - **D: Concepto**:
    - **Contenido**: [[AsigCostes_Formulas|F]].
    - **Formula/s**: NULL
    - **Referencias**: [[N€Caixa-PProveedores|A]]
  - **E: RegexNombre**:
    - **Contenido**: [[AsigCostes_Formulas|G]].
    - **Formula/s**: NULL
    - **Referencias**: [[N€Caixa-PProveedores|A]]
  - **F: 'Regex Fecha1A'**:
    - **Contenido**: [[AsigCostes_Formulas|H]].
    - **Formula/s**: NULL
    - **Referencias**: [[N€Caixa-PProveedores|A]]
  - **G: 'Regex Fecha1B'**:
    - **Contenido**: [[AsigCostes_Formulas|I]].
    - **Formula/s**: NULL
    - **Referencias**: [[N€Caixa-PProveedores|A]]
  - **H: 'Regex Fecha2A'**:
    - **Contenido**: [[AsigCostes_Formulas|J]].
    - **Formula/s**: NULL
    - **Referencias**: [[N€Caixa-PProveedores|A]]
  - **I: 'Regex Fecha2B'**:
    - **Contenido**: [[AsigCostes_Formulas|K]].
    - **Formula/s**: NULL
    - **Referencias**: [[N€Caixa-PProveedores|A]]
  - **J: 'Importe'**:
    - **Contenido**: [[AsigCostes_Formulas|L]].
    - **Formula/s**: NULL
    - **Referencias**:  [[N€Caixa-PProveedores|A]]
  - **K: 'Observaciones'**:
    - **Contenido**: [[AsigCostes_Formulas|M]].
    - **Formula/s**: NULL
    - **Referencias**:  [[N€Caixa-PProveedores|A]]

---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
