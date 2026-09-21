---
title: 
tags: 
component: 
related: [[N_Caixa_€-Pipeline#A1]], [[N_Caixa_€-Movimientos_cuenta_0087231]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Base de datos que contiene todos los movimientos bancarios en estado puro y, al terminar el pipeline, tambien los datos de las facturas relacionadas con ellos, ...

---
## **Gid**
917996945

## 📋 Descripción de las columnas


### **A**
- **Nombre**: UID
- **Contenido**: UID formado mediante la concatenación de las distintas columnas del movimiento.
- **Formula/s**: =Query(BD_Movimientos!A2:H;"select * where (H = 'Adyen' or H = 'CheckOut' or H = 'SOLIDGATE' or H = 'SolidProcessing') limit "&CONTARA(BD_Movimientos!A2:H))
- **Referencias**: 
- **Fuente**: [[N_Caixa_$-BD_Movimientos]]

### **B**
- **Nombre**: 'Fecha'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: [[N_Caixa_$-BD_Movimientos_Formulas#F1]] 
- **Fuente**: [[N_Caixa_$-BD_Movimientos#A]].

### **C**
- **Nombre**: 'Fecha valor'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: [[N_Caixa_$-BD_Movimientos_Formulas#F1]] 
- **Fuente**: [[N_Caixa_$-BD_Movimientos#A]].

### **D**
- **Nombre**: 'Movimiento'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: [[N_Caixa_$-BD_Movimientos_Formulas#F1]] 
- **Fuente**: [[N_Caixa_$-BD_Movimientos#A]].

### **E**
- **Nombre** : 'Más datos'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: [[N_Caixa_$-BD_Movimientos_Formulas#F1]] 
- **Fuente**: [[N_Caixa_$-BD_Movimientos#A]].

### **F**
- **Nombre**: 'Importe'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: [[N_Caixa_$-BD_Movimientos_Formulas#F1]] 
- **Fuente**: [[N_Caixa_$-BD_Movimientos#A]]..

### **G**
- **Nombre**: 'Saldo'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: [[N_Caixa_$-BD_Movimientos_Formulas#F1]] 
- **Fuente**: [[N_Caixa_$-BD_Movimientos#A]].

### **H**
- **Nombre**: 'PreConcepto'
- **Contenido**: Columna helper para la construcción del "Concepto" del Cashflow.
- **Formula/s**: 
- **Referencias**: [[N_Caixa_$-BD_Movimientos_Formulas#F2]]
- **Fuente**: 

### **I**
- **Nombre**: 'Descriptor'.
- **Contenido**: 
- **Formula/s**: [[N_Caixa_$-BD_Movimientos_Formulas#F3]]
- **Referencias**: 
- **Fuente**: 

### **J**
- **Nombre**: 'Fra'
- **Contenido**: UID's de facturas.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#I]]

### **K**
- **Nombre**: 'PeriodoCobro'
- **Contenido**: Mes/año. 
- **Formula/s**: [[N_Caixa_$-BD_Movimientos_Formulas#F4]]
- **Referencias**: 
- **Fuente**: 

### **L**
- **Nombre**: 'CF in/out'
- **Contenido**: Clasificación de los tipos de gasto.
- **Formula/s**: [[N_Caixa_$-BD_Movimientos_Formulas#F5]]
- **Referencias**: 
- **Fuente**: 

### **M**
- **Nombre**: 'CF category'
- **Contenido**: .
- **Formula/s**: [[N_Caixa_$-BD_Movimientos_Formulas#F6]]
- **Referencias**:  
- **Fuente**: 

### **N**
- **Nombre**: 'TipoCambio'
- **Contenido**: Conversión $ a €.
- **Formula/s**: [[N_Caixa_$-BD_Movimientos_Formulas#F7]] !!! COPIAR Y PEGAR VALORES ¡¡¡ para evitar recalculos.
- **Referencias**:  
- **Fuente**: 
### **O**
- **Nombre**: '€'
- **Contenido**: Importe en euros.
- **Formula/s**: [[N_Caixa_$-BD_Movimientos_Formulas#F8]] Se hace con la diferencia de los saldos para elminar la diferencia en los tipos de cambio entre los dos dias.
- **Referencias**: 
- **Fuente**: 


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
