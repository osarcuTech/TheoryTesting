---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos]
component: A2.1
related: [[01_Arquitectura_General]], [[wf_A2_AsignacionDeGastos]], [[A1_ImportarMovimientos_GS]], [[A1_ImportarMovimientos_WF(deprecado)]], [[C0_PunteoFacturas]], [[Metricas_Asignacion]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Transferencia manual de los datos de [[N€Caixa-Form_AsigCostes_Formulas]] para crear una base de datos permanente de patrones de movimiento, su significado, implicaciones y forma# de tratarlos.
---

## 📋 Descripción de las columnas

- **Fuente**: Movimientos nuevos en [[N€Caixa-Movimientos_cuenta_0087231]] (trigger desde celda A1)
- **GID Hoja**: 313952240

### **A
  - **Nombre**: Descripcion
  - **Contenido**: .
  - **Formula/s**: NULL
  - **Referencias**:
  - **Fuente**: [[N€Caixa-Form_AsigCostes_Formulas#A]], [[H0_ControlHumano]].
 
### **B
  - **Nombre**: Movimientos
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**:
  - **Fuente**: [[N€Caixa-Form_AsigCostes_Formulas#B]], [[H0_ControlHumano]].
 
### **C
  - **Nombre**: Más datos
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**:
  - **Fuente**: [[N€Caixa-Form_AsigCostes_Formulas#C]], [[H0_ControlHumano]].
 
### **D
  - **Nombre**: CF in/out
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**:
  - **Fuente**: [[N€Caixa-Form_AsigCostes_Formulas#D]], [[H0_ControlHumano]].
 
### **E
  - **Nombre**:  Patron_CF category
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**:
  - **Fuente**: [[N€Caixa-Form_AsigCostes_Formulas#E]], [[H0_ControlHumano]].
 
### **F
  - **Nombre**: Concepto
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**:
  - **Fuente**: [[N€Caixa-Form_AsigCostes_Formulas#F]], [[H0_ControlHumano]].
 
### **G
  - **Nombre**: RegexNombre
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**:
  - **Fuente**: [[N€Caixa-Form_AsigCostes_Formulas#G]], [[H0_ControlHumano]].
 
### **H
  - **Nombre**: 'Regex Fecha1A'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**:
  - **Fuente**: [[N€Caixa-Form_AsigCostes_Formulas#H]], [[H0_ControlHumano]].
 
### **I
  - **Nombre**: 'Regex Fecha1B'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**:
  - **Fuente**: [[N€Caixa-Form_AsigCostes_Formulas#I]], [[H0_ControlHumano]].
 
### **J
  - **Nombre**: 'Regex Fecha2A'
  - **Contenido**: .
  - **Formula/s**: NULL
  - **Referencias**:
  - **Fuente**: [[N€Caixa-Form_AsigCostes_Formulas#J]], [[H0_ControlHumano]].
 
### **K
  - **Nombre**: 'Regex Fecha2B'
  - **Contenido**: .
  - **Formula/s**: NULL
  - **Referencias**:
  - **Fuente**: [[N€Caixa-Form_AsigCostes_Formulas#K]], [[H0_ControlHumano]].
 
### **L
  - **Nombre**: 'Importe'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**:
  - **Fuente**: [[N€Caixa-Form_AsigCostes_Formulas#L]], [[H0_ControlHumano]].
  
### **M
  - **Nombre**: 'Observaciones'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**:
  - **Fuente**: [[N€Caixa-Form_AsigCostes_Formulas#M]], [[H0_ControlHumano]].
  
--

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
