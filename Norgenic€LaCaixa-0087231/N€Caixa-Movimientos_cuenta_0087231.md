---
title: 
tags: 
component: 
related: [[01_Arquitectura_General]], [[A1_ImportarMovimientos_GS]], [[A1_ImportarMovimientos_WF(Deprecado)]], [[wf_A2_AsignacionDeGastos]], [[A2_AsignacionDeGastos]], [[C0_PunteoFacturas]], [[Metricas_Asignacion]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Clasificar automáticamente cada nuevo movimiento bancario usando reglas de matching basadas en patrones de texto del movimiento para añadirlo a `AsigCostes` y crear una query utilizable por `C0` para seleccionar las facturas coincidentes.

---

## 📋 Descripción de las columnas

- **Fuente**: `A1`
- **GID Hoja**: 1963712436
- **Columnas**:
  - **A: UID**:
    - **Contenido**: Heredado de `A1`. UID formado mediante la concatenación de las distintas columnas del movimiento.
    - **Formula/s**: NULL
    - **Referencias**: `A1`;`Rangos`
  - **B: 'Fecha'**:
    - **Contenido**: Heredado de `A1`.
    - **Formula/s**: NULL
    - **Referencias**: `A1` 
  - **C: 'Fecha valor'**:
    - **Contenido**: Heredado de `A1`.
    - **Formula/s**: NULL
    - **Referencias**: 
  - **D: 'Movimiento'**:
    - **Contenido**: Heredado de `A1`.
    - **Formula/s**: 
    - **Referencias**: 
  - **E : 'Más datos'**:
    - **Contenido**: Heredado de `A1`.
    - **Formula/s**: 
    - **Referencias**: [[Form_AsigCostes|N: 'M_Category']]
  - **F: 'Importe'**:
    - **Contenido**: Heredado de `A1`.
    - **Formula/s**: 
    - **Referencias**: 
  - **G: 'Saldo'**:
    - **Contenido**: Heredado de `A1`.
    - **Formula/s**: 
    - **Referencias**: 
  - **H: 'NombreFactura'**:
    - **Contenido**: C0.2. UID de las Facturas heredadas de `Autopunteo` (C0.1A) o `Fra.Manual1` (C0.1B) en función de `Validacion (CO)`. Si (C0.2)=true else (C0.1A) o false (C0.1B).
    - **Formula/s**: [[N€Caixa-Movimientos_cuenta_0087231_Formulas|Formula1]]
    - **Referencias**: `C0`
  - **I: 'PeriodoCobro'**:
    - **Contenido**: Mes y año de `Fecha`
    - **Formula/s**: [[N€Caixa-Movimientos_cuenta_0087231_Formulas|Formula2]]
    - **Referencias**: [[Form_AsigCostes|Q]]
  - **J: 'DescripccionMovimiento'**:
    - **Contenido**: Concatenación de `Movimiento` y `Más datos` para formar un descritpor único para asistir en varios objetivos. Es lo que inicia `A2.0`
    - **Formula/s**: [[N€Caixa-Movimientos_cuenta_0087231_Formulas|Formula3]]
    - **Referencias**: 
  - **K: 'CF in/out'**:
    - **Contenido**: Clasificación de los tipos de gasto. Se actualiza cada vez que se actualiza `A2.1`
    - **Formula/s**: [[N€Caixa-Movimientos_cuenta_0087231_Formulas|Formula4]] 
    - **Referencias**: [[AsigCostes]], [[Rangos]]
  - **L: 'CF category'**:
    - **Contenido**: Heredado de [[N€Caixa-Movimientos_cuenta_0087231_Formulas|Formula4]].
    - **Formula/s**: Null
    - **Referencias**:  
  - **M: 'PlataformaPago'**:
    - **Contenido**: Clasifica los distintos bancos para encontrar los que tenemos que realizarles un seguimiento especial.
    - **Formula/s**: [[N€Caixa-Movimientos_cuenta_0087231_Formulas|Formula5]]
    - **Referencias**:  
  - **N: 'Def_UID'**:
    - **Contenido**: Creación de una uid, a partir de la anterior, que contenga la infromación de la relación de cada movimiento con las facturas.
    - **Formula/s**: [[N€Caixa-Movimientos_cuenta_0087231_Formulas|Formula6]]
    - **Referencias**: 
  - **O: 'Autopunteo'**:
    - **Contenido**: C0.1 Sugerencia de coincidencias.
    - **Formula/s**: [[N€Caixa-Movimientos_cuenta_0087231_Formulas|Formula7]]
    - **Referencias**: 
  - **P: 'Validacion (CO)'**:
    - **Contenido**: C0.2 Booleano que indica la fuente de la verdad.
    - **Formula/s**: NULL
    - **Referencias**: 
  - **Q: 'Fra.Manual'**:
    - **Contenido**: Introducción manual del UID de la factura cuando C0.1A no acierte.
    - **Formula/s**: NULL
    - **Referencias**: 
  - **R: 'P.Conable'**:
    - **Contenido**: Mes y año en el que se contabiliza una factura en caso de haber una asociada.
    - **Formula/s**: 
    - **Referencias**: 
  - **S: 'Ubicación VT'**:
    - **Contenido**: Indica en que carpeta de Via Tribut se encuentra una factura.
    - **Formula/s**: 
    - **Referencias**: 
  - **T: 'ID_Enviada'**:
    - **Contenido**: Indica el ID de la factura enviada para su facil localización concantenado "https://drive.google.com/file/d/"& ID.
    - **Formula/s**: 
    - **Referencias**: 
  - **U: 'Carpeta'**:
    - **Contenido**: Indica el ID de la carpeta de Via Tributa en la que se encuentra la factura. Función similar a la columna anterior
    - **Formula/s**: 
    - **Referencias**: 
  - **V: 'BD'**:
    - **Contenido**: Booleano que indica si una fila esta lista para la su arxivado o no.
    - **Formula/s**: 
    - **Referencias**: 

---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
