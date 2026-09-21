---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos]
component: A2.0
related: [[A2_AsignacionDeGastos_Sheets_Arquitectura]], [[N_Caixa_€-Movimientos_cuenta_0087231#J]], [[N_Caixa_€-AsigCostes#A]], [[H0_ControlHumano]], [[N_Caixa_€-Form_AsigCostes_Formulas]].
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Clasificar automáticamente cada nuevo movimiento bancario usando reglas de matching basadas en patrones de texto del movimiento para añadirlo a [[N_Caixa_€-AsigCostes]] y crear una query utilizable por [[C0_PunteoFacturas|C0]] para seleccionar las facturas coincidentes.

---
## **Gid**
760684095

## 📋 Descripción de las columnas

- **Fuente**: Movimientos nuevos en [[N_Caixa_€-Movimientos_cuenta_0087231]] (trigger desde cleda A1)

### **A**
  - **Nombre**: Descripcion
  - **Contenido**: Identifica y saca las descripciónes de [[N_Caixa_€-Movimientos_cuenta_0087231#J]] que aún no se encuentran en [[N_Caixa_€-AsigCostes#A]].
  - **Formula/s**: [[N_Caixa_€-Form_AsigCostes_Formulas#F1]]
  - **Referencias**: [[N_Caixa_€-Rangos]]
  - **Fuentes**: [[N_Caixa_€-Movimientos_cuenta_0087231#J]],[[N_Caixa_€-AsigCostes#A]]

### **B**
  - **Nombre**: Movimientos
  - **Contenido**: Divide el descriptor en dos columnas. Se queda el equivalente de [[N_Caixa_€-Movimientos_cuenta_0087231#D|"Movimiento"]].
  - **Formula/s**: [[N_Caixa_€-Form_AsigCostes_Formulas#F2]]
  - **Referencias**:
  - **Fuentes**: 

### **C**
  - **Nombre**: Más datos
  - **Contenido**: Contiene el equivalente de [[N_Caixa_€-Movimientos_cuenta_0087231#E|"MásDatos"]].
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N_Caixa_€-Form_AsigCostes#B]], [[N_Caixa_€-Form_AsigCostes_Formulas#F2]]

### **D**
  - **Nombre**: CF in/out
  - **Contenido**: Clasifiica el tipo de gasto para el CashFlow.
  - **Formula/s**: [[N_Caixa_€-Form_AsigCostes_Formulas#F3]]
  - **Referencias**: 
  - **Fuentes**: 

### **E**
  - **Nombre** : Patron_CF category
  - **Contenido**: Intenta establecer el valor de "CF_Category" de forma automàtica para aquellos movimientos recurrentes que entran con diferencias en la escritura de su texto. Si la formula no es capaz de producirlo lo saca de lo introducido manualmente en la columna N 'M_Category'.
  - **Formula/s**: [[N_Caixa_€-Form_AsigCostes_Formulas#F4]]
  - **Referencias**: 
  - **Fuentes**: [[N_Caixa_€-Form_AsigCostes#N|'M_Category']]

### **F**
  - **Nombre**: Concepto
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N_Caixa_€-Form_AsigCostes_Formulas#F4]].
  - **Fuentes**: [[N_Caixa_€-Form_AsigCostes#E]], [[N_Caixa_€-Form_AsigCostes#O|'M_Concepto']]

### **G**
  - **Nombre**: RegexNombre
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N_Caixa_€-Form_AsigCostes_Formulas#F4]].
  - **Fuentes**: [[N_Caixa_€-Form_AsigCostes#E]], [[N_Caixa_€-Form_AsigCostes#O|'M_Concepto']]

### **H**
  - **Nombre**: 'Regex Fecha1A'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N_Caixa_€-Form_AsigCostes_Formulas#F4]].
  - **Fuentes**: [[N_Caixa_€-Form_AsigCostes#E]], [[N_Caixa_€-Form_AsigCostes#P]]

### **I**
  - **Nombre**: 'Regex Fecha1B'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N_Caixa_€-Form_AsigCostes_Formulas#F4]].
  - **Fuentes**: [[N_Caixa_€-Form_AsigCostes#E]], [[N_Caixa_€-Form_AsigCostes#Q]]

### **J**
  - **Nombre**: 'Regex Fecha2A'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N_Caixa_€-Form_AsigCostes_Formulas#F4]].
  - **Fuentes**: [[N_Caixa_€-Form_AsigCostes#E]], [[N_Caixa_€-Form_AsigCostes#P]]

### **K**
  - **Nombre**: 'Regex Fecha2B'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N_Caixa_€-Form_AsigCostes_Formulas#F4]].
  - **Fuentes**: [[N_Caixa_€-Form_AsigCostes#E]], [[N_Caixa_€-Form_AsigCostes#R]]

### **L**
  - **Nombre**: 'Importe'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N_Caixa_€-Form_AsigCostes_Formulas#F4]]. 
  - **Fuentes**: [[N_Caixa_€-Form_AsigCostes#E]], [[N_Caixa_€-Form_AsigCostes#S]]

### **M**
  - **Nombre**: 'Observaciones'
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: [[N_Caixa_€-Form_AsigCostes_Formulas#F4]].
  - **Fuentes**: [[N_Caixa_€-Form_AsigCostes#E]], [[N_Caixa_€-Form_AsigCostes#T]]

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
