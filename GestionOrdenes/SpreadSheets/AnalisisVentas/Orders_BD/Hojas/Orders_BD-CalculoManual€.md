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
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F1]]
- **Referencias**: 
- **Fuente**: Manual

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
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F2]]
- **Referencias**: 
- **Fuente**: 

### **G**
- **Nombre**: 'S_Fin'
- **Contenido**: Rango teorico en el que terminan las ventas contenidas en este settlement.
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F3]]
- **Referencias**: 
- **Fuente**: 

### **H**
- **Nombre**: 'O_V_AUD'
- **Contenido**: Ventas en AUD segun datos exportados de Solidgate.
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F4]]
- **Referencias**: 
- **Fuente**: 

### **I**
- **Nombre**: 'O_Ref_AUD'.
- **Contenido**: Ventas en GBP segun datos exportados de Solidgate.
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F5]]
- **Referencias**: 
- **Fuente**: 

### **J**
- **Nombre**: 'O_Ref_GBP'.
- **Contenido**: Refunds en AUD segun datos exportados de Solidgate.
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F6]]
- **Referencias**: 
- **Fuente**: 

### **K**
- **Nombre**: 'O_Ref_GBP'[[Orders_BD-CalculoManual€_Formulas#F7]]
- **Contenido**: Refunds en GBP segun datos exportados de Solidgate.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: 

### **L**
- **Nombre**: '%Dia_EUR/AUD'
- **Contenido**: Tipo de cambio AUD-->EUR del dia [[Orders_BD-CalculoManual€#B]].
- **Formula/s**:  
- **Referencias**: 
- **Fuente**: https://www.bde.es/webbe/es/estadisticas/recursos/conversor-divisas.html#

### **M**
- **Nombre**: '%Dia_EUR/GPB'
- **Contenido**: Tipo de cambio GBP-->EUR del dia [[Orders_BD-CalculoManual€#B]].
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: https://www.bde.es/webbe/es/estadisticas/recursos/conversor-divisas.html#

### **N**
- **Nombre**: '%Dia-1_EUR/AUD'
- **Contenido**: Tipo de cambio AUD-->EUR del dia anterior a [[Orders_BD-CalculoManual€#B]].
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: https://www.bde.es/webbe/es/estadisticas/recursos/conversor-divisas.html#

### **O**
- **Nombre**: '%Dia-1_EUR/GPB'
- **Contenido**: Tipo de cambio GBP-->EUR del dia anterior a [[Orders_BD-CalculoManual€#B]].
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: https://www.bde.es/webbe/es/estadisticas/recursos/conversor-divisas.html#

### **P**
- **Nombre**: 'Redond1Dec_%Dia'
- **Contenido**: Prueba de obtención de coincidencias en Ventas con el tipo de cambio del mismo dia con redondeo a un decimal.
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F8]]
- **Referencias**: [[Orders_BD-CalculoManual€#L]], [[Orders_BD-CalculoManual€#M]]
- **Fuente**: 

### **Q**
- **Nombre**: 'Redond1Dec_Dia-1'
- **Contenido**: Prueba de obtención de coincidencias en Ventas con el tipo de cambio del dia anterior con redondeo a un decimal.
- **Referencias**: [[Orders_BD-CalculoManual€#N]], [[Orders_BD-CalculoManual€#O]]
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F9]]
- **Referencias**: 
- **Fuente**: 

### **R**
- **Nombre**: 'Redond2Dec_%Dia'
- **Contenido**: Prueba de obtención de coincidencias en Ventas con el tipo de cambio del mismo dia con redondeo a dos decimales.
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F10]]
- **Referencias**: [[Orders_BD-CalculoManual€#L]], [[Orders_BD-CalculoManual€#M]]
- **Fuente**: 

### **S**
- **Nombre**: 'Redond2Dec_Dia-1'
- **Contenido**: Prueba de obtención de coincidencias en Ventas con el tipo de cambio del dia anterior con redondeo a dos decimales.
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F11]]
- **Referencias**:  [[Orders_BD-CalculoManual€#N]], [[Orders_BD-CalculoManual€#O]]
- **Fuente**: 

### **T**
- **Nombre**: 'Original_%Dia'
- **Contenido**: Prueba de obtención de coincidencias en Ventas con el tipo de cambio del mismo dia sin alteraciones.
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F12]]
- **Referencias**:  [[Orders_BD-CalculoManual€#L]], [[Orders_BD-CalculoManual€#M]]
- **Fuente**: 

### **U**
- **Nombre**: 'Original_Dia-1'
- **Contenido**: Prueba de obtención de coincidencias en Ventas con el tipo de cambio del dia anterior sin alteraciones.
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F13]]
- **Referencias**:  [[Orders_BD-CalculoManual€#N]], [[Orders_BD-CalculoManual€#O]]
- **Fuente**: 

### **V**
- **Nombre**: 'V_%D_a'
- **Contenido**: Prueba de obtención de coincidencias en Ventas con el tipo de cambio del mismo dia con redondeo al alza a un decimal.
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F14]]
- **Referencias**:  [[Orders_BD-CalculoManual€#L]], [[Orders_BD-CalculoManual€#M]]
- **Fuente**: 

### **W**
- **Nombre**: 'V_%D-1_a'
- **Contenido**: Prueba de obtención de coincidencias en Ventas con el tipo de cambio del dia anterior con redondeo al alza a un decimal.
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F15]]
- **Referencias**:  [[Orders_BD-CalculoManual€#N]], [[Orders_BD-CalculoManual€#O]]
- **Fuente**: 

### **X**
- **Nombre**: 'R_%D_a'
- **Contenido**: Prueba de obtención de coincidencias en Reembolsos con el tipo de cambio del mismo dia con redondeo al alza a un decimal.
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F16]]
- **Referencias**:  [[Orders_BD-CalculoManual€#L]], [[Orders_BD-CalculoManual€#M]]
- **Fuente**: 

### **Y**
- **Nombre**: 'R_%D-1_a'
- **Contenido**: Prueba de obtención de coincidencias en Reembolsos con el tipo de cambio del dia anterior con redondeo al alza a un decimal.
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F17]]
- **Referencias**:  [[Orders_BD-CalculoManual€#N]], [[Orders_BD-CalculoManual€#O]]
- **Fuente**: 

### **Z**
- **Nombre**: 'OtheBancs'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: 

### **AA**
- **Nombre**: 'Diferencia'
- **Contenido**: 
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F18]]
- **Referencias**:  
- **Fuente**: 

### **AB**
- **Nombre**: 'D_Chargebacks'
- **Contenido**: 
- **Formula/s**: [[Orders_BD-CalculoManual€_Formulas#F19]]
- **Referencias**:  
- **Fuente**: 


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
