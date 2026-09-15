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
- **GID Hoja**: 1089991841
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
    - **Referencias**: [[N€Caixa-Movimientos_cuenta_0087231]]
  - **H: 'Archivado'**:
    - **Contenido**: Booleano marcado por el Script de Archivado cuando se a archivado con exito ese movimiento.
    - **Formula/s**: Null
    - **Referencias**: 
  - **I: 'Def_UID'**: Creación de una uid, a partir de la anterior, que contenga la infromación de la relación de cada movimiento con las facturas.
    - **Contenido**: 
    - **Formula/s**: 
    - **Referencias**: [[N€Caixa-Movimientos_cuenta_0087231]]
  - **J: 'PeriodoCobro'**: Mes y año de `Fecha`
    - **Contenido**: 
    - **Formula/s**: 
    - **Referencias**: [[N€Caixa-Movimientos_cuenta_0087231]]
  - **K: 'NombreFact'**:
    - **Contenido**: Concatenación de `Movimiento` y `Más datos` para formar un descritpor único para asistir en varios objetivos.
    - **Formula/s**: NULL
    - **Referencias**: [[N€Caixa-Movimientos_cuenta_0087231]]
  - **L: 'CF in/out'**:
    - **Contenido**: Clasificación de los tipos de gasto.
    - **Formula/s**: NULL 
    - **Referencias**: [[N€Caixa-Movimientos_cuenta_0087231]]
  - **M: 'CF category'**:
    - **Contenido**: Heredado de [[N€Caixa-Movimientos_cuenta_0087231_Formulas|Formula4]].
    - **Formula/s**: Null
    - **Referencias**:  [[N€Caixa-Movimientos_cuenta_0087231]]
  - **N: 'PlataformaPago'**:
    - **Contenido**: Clasifica los distintos bancos para encontrar los que tenemos que realizarles un seguimiento especial.
    - **Formula/s**: NULL
    - **Referencias**: [[N€Caixa-Movimientos_cuenta_0087231]] 
  - **O: 'Validacion (CO)'**:
    - **Contenido**: C0.2 Booleano que indica la fuente de la verdad.
    - **Formula/s**: NULL
    - **Referencias**: [[N€Caixa-Movimientos_cuenta_0087231]]
  - **P: 'P.Conable'**:
    - **Contenido**: Mes y año en el que se contabiliza una factura en caso de haber una asociada.
    - **Formula/s**: 
    - **Referencias**: [[N€Caixa-Movimientos_cuenta_0087231]]
  - **Q: 'Ubicación VT'**:
    - **Contenido**: Indica en que carpeta de Via Tribut se encuentra una factura.
    - **Formula/s**: 
    - **Referencias**: [[N€Caixa-Movimientos_cuenta_0087231]]
  - **R: 'ID_Enviada'**:
    - **Contenido**: Indica el ID de la factura enviada para su facil localización concantenado "https://drive.google.com/file/d/"& ID.
    - **Formula/s**: 
    - **Referencias**: [[N€Caixa-Movimientos_cuenta_0087231]]
  - **S: 'Carpeta'**:
    - **Contenido**: Indica el ID de la carpeta de Via Tributa en la que se encuentra la factura. Función similar a la columna anterior
    - **Formula/s**: 
    - **Referencias**:  [[N€Caixa-Movimientos_cuenta_0087231]]

---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
