---
title: 
tags: 
component: 
related: [[WW_Caixa_€-Pipeline#A1]], [[WW_Caixa_€-BD_Movimientos]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Base de datos que contiene todos los movimientos bancarios en estado puro y, al terminar el pipeline, tambien los datos de las facturas relacionadas con ellos, ...

---
## **Gid**
719681145

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'Fecha'
- **Contenido**: 
- **Formula/s**: [[WW_Caixa_€-BD_Movimientos_Formulas#F1]]
- **Referencias**:  
- **Fuente**: [[WW_Caixa_€-BD_Banco]].

### **B**
- **Nombre**: 'Fecha valor'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[WW_Caixa_€-BD_Movimientos#A]].

### **C**
- **Nombre**: 'Movimiento'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[WW_Caixa_€-BD_Movimientos#A]].

### **D**
- **Nombre** : 'Más datos'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[WW_Caixa_€-BD_Movimientos#A]].

### **E**
- **Nombre**: 'Importe'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[WW_Caixa_€-BD_Movimientos#A]]..

### **F**
- **Nombre**: 'Saldo'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[WW_Caixa_€-BD_Movimientos#A]].

### **G**
- **Nombre**: 'Fra'
- **Contenido**: UID's de facturas.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: 

### **H**
- **Nombre**: 'Descriptor'.
- **Contenido**: 
- **Formula/s**: [[WW_Caixa_€-BD_Movimientos_Formulas#F2]]
- **Referencias**: 
- **Fuente**: 

### **I**
- **Nombre**: 'PeriodoCobro'
- **Contenido**: Mes/año. 
- **Formula/s**: [[WW_Caixa_€-BD_Movimientos_Formulas#F3]]
- **Referencias**: 
- **Fuente**: 

### **J**
- **Nombre**: 'CF in/out'
- **Contenido**: Clasificación de los tipos de gasto.
- **Formula/s**: [[WW_Caixa_€-BD_Movimientos_Formulas#F4]]
- **Referencias**: 
- **Fuente**: [[WW_Caixa_€-BD_AsigCostes]]

### **K**
- **Nombre**: 'CF category'
- **Contenido**: .
- **Formula/s**: [[WW_Caixa_€-BD_Movimientos_Formulas#F5]]
- **Referencias**:  
- **Fuente**: [[WW_Caixa_€-BD_AsigCostes]]

### **L**
- **Nombre**: 'Publicidad'
- **Contenido**: 
- **Formula/s**: [[WW_Caixa_€-BD_Movimientos_Formulas#F6]]
- **Referencias**:  
- **Fuente**: 


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
