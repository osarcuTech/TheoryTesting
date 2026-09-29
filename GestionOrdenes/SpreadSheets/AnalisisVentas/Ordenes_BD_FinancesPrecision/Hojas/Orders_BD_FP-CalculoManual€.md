---
title: 
tags: 
component: 
related:  
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Datamart que experimenta entre las columnas V y Y para encontrar la combinación que da un resultado mas parecido a lo reportado en los Settlements de Checkout. Por ahora las dos combinaciones que han dado un resultado prometedor són las de las columnas V a Y, el resto estàn deprecadas. Las columnas V a Y presentan dos formula, en la row = 1 la que mide la precisión total de la columna y en la row >= 3 la que trata de obtener el mismo resultado que el settlement de cada semana (1 row = 1 week).

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
    - Archivo De PDF's en Drive: https://drive.google.com/drive/folders/1DsyTa80etKoxKPebuz4P1ASnfrCOGa6Y
    - Fuente PDF's: https://hub.solidgate.com/finances/settlement

### **B**
- **Nombre**: 'S_Payment'
- **Contenido**: Fecha teorica en la que se recibe el cobro del Payout de Checkout en [[N_Caixa_€-BD_Banco]]
- **Formula/s**: [[Orders_BD_FP-CalculoManual€_Formulas#F1]]
- **Referencias**: 
- **Fuente**: 

### **C**
- **Nombre**: 'S_Sales'
- **Contenido**: Ventas segun Settlement de Solidgate.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: Manual

### **D**
- **Nombre**: 'S_Refunds'
- **Contenido**: Reembolsos segun Settlement de Solidgate.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: Manual

### **E**
- **Nombre** : 'S_Chargebacks'
- **Contenido**: Chargebacks segun Settlement de Solidgate.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: Manual

### **F**
- **Nombre**: 'S_Inicio'
- **Contenido**: Rango teorico en el que inician las ventas contenidas en este settlement.
- **Formula/s**: [[Orders_BD_FP-CalculoManual€_Formulas#F2]]
- **Referencias**: 
- **Fuente**: 

### **G**
- **Nombre**: 'S_Fin'
- **Contenido**: Rango teorico en el que terminan las ventas contenidas en este settlement.
- **Formula/s**: [[Orders_BD_FP-CalculoManual€_Formulas#F3]]
- **Referencias**: 
- **Fuente**: 

### **H**
- **Nombre**: 'O_Ventas'
- **Contenido**: Ventas en € segun datos exportados de Solidgate.
- **Formula/s**: [[Orders_BD_FP-CalculoManual€_Formulas#F4]]
- **Referencias**: 
- **Fuente**: 

### **I**
- **Nombre**: '	O_Refunds'.
- **Contenido**: Refunds en € segun datos exportados de Solidgate.
- **Formula/s**: [[Orders_BD_FP-CalculoManual€_Formulas#F5]]
- **Referencias**: 
- **Fuente**: 

### **J**
- **Nombre**: '	O_Chargebacks'.
- **Contenido**: Refunds en AUD segun datos exportados de Solidgate.
- **Formula/s**: [[Orders_BD_FP-CalculoManual€_Formulas#F6]]
- **Referencias**: 
- **Fuente**: 

### **K**
- **Nombre**: '	D_Ventas'
- **Contenido**: Diferencia entre las ventas declaradas por el Settlement de Soligate y las ventas encontradas.
- **Formula/s**: [[Orders_BD_FP-CalculoManual€_Formulas#F7]]
- **Referencias**: 
- **Fuente**: 

### **L**
- **Nombre**: '	D_Refunds'
- **Contenido**: Diferencia entre los refunds declaradas por el Settlement de Soligate y los refunds encontrada. 
- **Formula/s**:  [[Orders_BD_FP-CalculoManual€_Formulas#F8]].
- **Referencias**: 
- **Fuente**: 

### **M**
- **Nombre**: '	D_Chargebacks'
- **Contenido**: Diferencia entre los chargebacks declaradas por el Settlement de Soligate y los chargebacks encontrados.
- **Formula/s**: [[Orders_BD_FP-CalculoManual€_Formulas#F9]]
- **Referencias**:  
- **Fuente**: 


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
