---
title: 
tags: 
component: 
related: [[N_Caixa_CHF-Pipeline#A1]], [[N_Caixa_CHF-BD_Movimientos]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Base de datos que contiene todos los movimientos bancarios en estado puro y, al terminar el pipeline, tambien los datos de las facturas relacionadas con ellos, ...

---
## **Gid**
1710942705

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'Fecha'
- **Contenido**: 
- **Formula/s**: [[N_Caixa_CHF-BD_Movimientos_Formulas#F1]]
- **Referencias**:  
- **Fuente**: [[N_Caixa_CHF-BD_Banco]].

### **B**
- **Nombre**: 'Fecha valor'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[N_Caixa_CHF-BD_Movimientos#A]].

### **C**
- **Nombre**: 'Movimiento'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[N_Caixa_CHF-BD_Movimientos#A]].

### **D**
- **Nombre** : 'Más datos'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[N_Caixa_CHF-BD_Movimientos#A]].

### **E**
- **Nombre**: 'Importe'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[N_Caixa_CHF-BD_Movimientos#A]]..

### **F**
- **Nombre**: 'Saldo'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[N_Caixa_CHF-BD_Movimientos#A]].

### **G**
- **Nombre**: 'Fra'
- **Contenido**: UID's de facturas.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: 

### **H**
- **Nombre**: 'Descriptor'.
- **Contenido**: 
- **Formula/s**: [[N_Caixa_CHF-BD_Movimientos_Formulas#F2]]
- **Referencias**: 
- **Fuente**: 

### **I**
- **Nombre**: 'PeriodoCobro'
- **Contenido**: Mes/año. 
- **Formula/s**: [[N_Caixa_CHF-BD_Movimientos_Formulas#F3]]
- **Referencias**: 
- **Fuente**: 

### **J**
- **Nombre**: 'CF in/out'
- **Contenido**: Clasificación de los tipos de gasto.
- **Formula/s**: [[N_Caixa_CHF-BD_Movimientos_Formulas#F4]]
- **Referencias**: 
- **Fuente**: [[N_Caixa_CHF-BD_AsigCostes]]

### **K**
- **Nombre**: 'CF category'
- **Contenido**: .
- **Formula/s**: [[N_Caixa_CHF-BD_Movimientos_Formulas#F5]]
- **Referencias**:  
- **Fuente**: [[N_Caixa_CHF-BD_AsigCostes]]

### **L**
- **Nombre**: 'TipoCambio'
- **Contenido**: Conversión $ a €.
- **Formula/s**: [[N_Caixa_CHF-BD_Movimientos_Formulas#F6]] !!! COPIAR Y PEGAR VALORES ¡¡¡ para evitar recalculos.
- **Referencias**:  
- **Fuente**: 

### **M**
- **Nombre**: '€'
- **Contenido**: Importe en euros.
- **Formula/s**: [[N_Caixa_CHF-BD_Movimientos_Formulas#F7]] Se hace con la diferencia de los saldos para elminar la diferencia en los tipos de cambio entre los dos dias.
- **Referencias**: 
- **Fuente**: 


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
