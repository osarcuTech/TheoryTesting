---
title: 
tags: 
component: 
related:  
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Datamart que como [[Orders_BD_FP-CalculoManual€]]  trata de encontrar la mayor coincidencia entre las ordenes de solidgate y los importes en su Settlement para encontrar el patrón y poder hacer previsiones u otras cosas. En esta hoja no hemos tenido que hacer tantas pruebla ya que no hay cambios de monedas. Todo esta en USD.
Las columnas I i J presentan dos formula, en la row = 1 la que mide la precisión total de la columna y en la row >= 3 la que trata de obtener el mismo resultado que el settlement de cada semana (1 row = 1 week).

---
## **Gid**
0

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'S_Name'
- **Contenido**: URL a PDF con la información del pago ('Settlement') semanal. Solo contiene el nombre del pdf.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: Manual
    - Archivo De PDF's en Drive: 
    - Fuente PDF's: https://hub.solidgate.com/finances/settlement

### **B**
- **Nombre**: 'S_Sales'
- **Contenido**: Ventas segun Settlement de Solidgate.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: Manual

### **C**
- **Nombre**: 'S_Refunds'
- **Contenido**: Reembolsos segun Settlement de Solidgate.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: Manual

### **D**
- **Nombre** : 'S_Chargebacks'
- **Contenido**: Chargebacks segun Settlement de Solidgate.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: Manual

### **E**
- **Nombre**: 'S_Inicio'
- **Contenido**: Rango teorico en el que inician las ventas contenidas en este settlement.
- **Formula/s**: [[Orders_BD_FP-CalculoManual$_Formulas#F1]]
- **Referencias**: 
- **Fuente**: 

### **F**
- **Nombre**: 'S_Fin'
- **Contenido**: Rango teorico en el que terminan las ventas contenidas en este settlement.
- **Formula/s**: [[Orders_BD_FP-CalculoManual$_Formulas#F2]]
- **Referencias**: 
- **Fuente**: 

### **G**
- **Nombre**: 'O_Ventas'
- **Contenido**: Ventas en AUD segun datos exportados de Solidgate.
- **Formula/s**: [[Orders_BD_FP-CalculoManual$_Formulas#F3]]
- **Referencias**: 
- **Fuente**: 

### **H**
- **Nombre**: 'O_Refunds'.
- **Contenido**: Ventas en GBP segun datos exportados de Solidgate.
- **Formula/s**: [[Orders_BD_FP-CalculoManual$_Formulas#F4]]
- **Referencias**: 
- **Fuente**: 

### **I**
- **Nombre**: 'O_Chargebacks'.
- **Contenido**: Ventas en GBP segun datos exportados de Solidgate.
- **Formula/s**: [[Orders_BD_FP-CalculoManual$_Formulas#F5]]
- **Referencias**: 
- **Fuente**: 

### **J**
- **Nombre**: 'D_Ventas'.
- **Contenido**: Refunds en AUD segun datos exportados de Solidgate.
- **Formula/s**: [[Orders_BD_FP-CalculoManual$_Formulas#F6]]
- **Referencias**: 
- **Fuente**: 

### **K**
- **Nombre**: 'D_Refunds'.
- **Contenido**: Refunds en AUD segun datos exportados de Solidgate.
- **Formula/s**: [[Orders_BD_FP-CalculoManual$_Formulas#F7]]
- **Referencias**: 
- **Fuente**: 

### **L**
- **Nombre**: 'D_Chargebacks'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: [[Orders_BD_FP-CalculoManual$_Formulas#F8]]
- **Fuente**: 


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
