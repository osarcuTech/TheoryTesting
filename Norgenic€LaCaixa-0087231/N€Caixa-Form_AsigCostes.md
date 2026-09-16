---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos]
component: A2.0
related: [[01_Arquitectura_General]], [[wf_A2_AsignacionDeGastos]], [[A1_ImportarMovimientos_GS]], [[A1_ImportarMovimientos_WF(deprecado)]], [[C0_PunteoFacturas]], [[Metricas_Asignacion]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Clasificar automáticamente cada nuevo movimiento bancario usando reglas de matching basadas en patrones de texto del movimiento para añadirlo a [[N€Caixa-AsigCostes]] y crear una query utilizable por [[C0_PunteoFacturas|C0]] para seleccionar las facturas coincidentes.

---

## 📋 Descripción de las columnas

- **Fuente**: Movimientos nuevos en [[N€Caixa-Movimientos_cuenta_0087231]] (trigger desde cleda A1)
- **GID Hoja**: 760684095
- **Columnas**:

### **A**
  - **Nombre**: Descripcion
  - **Contenido**: Identifica y saca las descripciónes de [[N€Caixa-Movimientos_cuenta_0087231#J]] que aún no se encuentran en [[N€Caixa-AsigCostes#A]].
  - **Formula/s**: [[N€Caixa-Form_AsigCostes_Formulas#F1]]
  - **Referencias**: [[N€Caixa-Rangos]]
  - **Fuentes**: [[N€Caixa-Movimientos_cuenta_0087231#J]],[[N€Caixa-AsigCostes#A]]

### **B**
  - **Nombre**: Movimientos
  - **Contenido**: Divide el descriptor en dos columnas. Se queda el equivalente de [[N€Caixa-Movimientos_cuenta_0087231#D|"Movimiento"]].
  - **Formula/s**: [[N€Caixa-Form_AsigCostes_Formulas#F2]]
  - **Referencias**:
  - **Fuentes**: 

### **C**
  - **Nombre**: Más datos
  - **Contenido**: Contiene el equivalente de [[N€Caixa-Movimientos_cuenta_0087231#E|"MásDatos"]].
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-Form_AsigCostes#B]], [[N€Caixa-Form_AsigCostes_Formulas#F2]]

### **D**
  - **Nombre**: CF in/out
  - **Contenido**: Clasifiica el tipo de gasto para el CashFlow.
  - **Formula/s**: [[N€Caixa-Form_AsigCostes_Formulas#F3]]
  - **Referencias**: 
  - **Fuentes**: 

### **E**
  - **Nombre** : Patron_CF category
  - **Contenido**: Intenta establecer el valor de "CF_Category" de forma automàtica para aquellos movimientos recurrentes que entran con diferencias en la escritura de su texto. Si la formula no es capaz de producirlo lo saca de lo introducido manualmente en la columna N 'M_Category'.
  - **Formula/s**: [[N€Caixa-Form_AsigCostes_Formulas#F4]]
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-Form_AsigCostes#N|'M_Category']]

### **F**
  - **Nombre**: Concepto
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N€Caixa-Form_AsigCostes_Formulas#F4]].
  - **Fuentes**: [[N€Caixa-Form_AsigCostes#E]], [[N€Caixa-Form_AsigCostes#O|'M_Concepto']]

### **G**
  - **Nombre**: RegexNombre
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N€Caixa-Form_AsigCostes_Formulas#F4]].
  - **Fuentes**: [[N€Caixa-Form_AsigCostes#E]], [[N€Caixa-Form_AsigCostes#O|'M_Concepto']]

### **H**
  - **Nombre**: 'Regex Fecha1A'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N€Caixa-Form_AsigCostes_Formulas#F4]].
  - **Fuentes**: [[N€Caixa-Form_AsigCostes#E]], [[N€Caixa-Form_AsigCostes#P]]

### **I**
  - **Nombre**: 'Regex Fecha1B'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N€Caixa-Form_AsigCostes_Formulas#F4]].
  - **Fuentes**: [[N€Caixa-Form_AsigCostes#E]], [[N€Caixa-Form_AsigCostes#Q]]

### **J**
  - **Nombre**: 'Regex Fecha2A'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N€Caixa-Form_AsigCostes_Formulas#F4]].
  - **Fuentes**: [[N€Caixa-Form_AsigCostes#E]], [[N€Caixa-Form_AsigCostes#P]]

### **K**
  - **Nombre**: 'Regex Fecha2B'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N€Caixa-Form_AsigCostes_Formulas#F4]].
  - **Fuentes**: [[N€Caixa-Form_AsigCostes#E]], [[N€Caixa-Form_AsigCostes#R]]

### **L**
  - **Nombre**: 'Importe'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N€Caixa-Form_AsigCostes_Formulas#F4]]. 
  - **Fuentes**: [[N€Caixa-Form_AsigCostes#E]], [[N€Caixa-Form_AsigCostes#S]]

### **M**
  - **Nombre**: 'Observaciones'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N€Caixa-Form_AsigCostes_Formulas#F4]].
  - **Fuentes**: [[N€Caixa-Form_AsigCostes#E]], [[N€Caixa-Form_AsigCostes#T]]

### **N**
  - **Nombre**: 'M_Category'
  - **Contenido**: Categoria del gasto.
  - **Formula/s**:
  - **Referencias**: 
  - **Fuentes**: [[H0_ControlHumano]]

### **O**
  - **Nombre**: 'NombresFras/Conceptos'
  - **Contenido**: Nombre/Descripción del causante.
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[H0_ControlHumano]]

### **P**
  - **Nombre**: 'Sincrona'
  - **Contenido**: Boolean que indica si el pago y la factura coinciden en fecha.
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[H0_ControlHumano]]

### **Q**
  - **Nombre**: 'Min Date'
  - **Contenido**: Integer, dias de desvio permitido respecto a la fecha de la factura.
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[H0_ControlHumano]]

### **R**
  - **Nombre**: 'Max Date'
  - **Contenido**: Integer, dias de desvio permitido respecto a la fecha de la factura.
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[H0_ControlHumano]]

### **S**
  - **Nombre**: 'Mismo Importe'
  - **Contenido**:Boolean que indica si el pago y la factura coinciden en importe.
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[H0_ControlHumano]]

### **T**
  - **Nombre**: 'M_Observaciones'
  - **Contenido**: String con observaciónes sobre el movimiento.
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[H0_ControlHumano]]


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
