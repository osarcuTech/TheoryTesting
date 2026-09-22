---
title: 
tags: 
component: 
related: [[Taxgov_Caixabank_€-Pipeline#A1]], [[Taxgov_Caixabank_€-BD_Movimientos]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Base de datos que contiene todos los movimientos bancarios en estado puro y, al terminar el pipeline, tambien los datos de las facturas relacionadas con ellos, ...

---
## **Gid**
2069899177

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'Fecha'
- **Contenido**: 
- **Formula/s**: [[Taxgov_Caixabank_€-BD_Movimientos_Formulas#F1]]
- **Referencias**:  
- **Fuente**: [[Taxgov_Caixabank_€-BD_Banco]].

### **B**
- **Nombre**: 'Fecha valor'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[Taxgov_Caixabank_€-BD_Movimientos#A]].

### **C**
- **Nombre**: 'Movimiento'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[Taxgov_Caixabank_€-BD_Movimientos#A]].

### **D**
- **Nombre** : 'Más datos'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[Taxgov_Caixabank_€-BD_Movimientos#A]].

### **E**
- **Nombre**: 'Importe'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[Taxgov_Caixabank_€-BD_Movimientos#A]]..

### **F**
- **Nombre**: 'Saldo'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[Taxgov_Caixabank_€-BD_Movimientos#A]].

### **G**
- **Nombre**: 'Fra'
- **Contenido**: UID's de facturas.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: 

### **H**
- **Nombre**: 'Descriptor'.
- **Contenido**: 
- **Formula/s**: [[Taxgov_Caixabank_€-BD_Movimientos_Formulas#F2]]
- **Referencias**: 
- **Fuente**: 

### **I**
- **Nombre**: 'Periodo'
- **Contenido**: Mes/año. 
- **Formula/s**: [[Taxgov_Caixabank_€-BD_Movimientos_Formulas#F3]]
- **Referencias**: 
- **Fuente**: 

### **J**
- **Nombre**: 'CF in/out'
- **Contenido**: Clasificación de los tipos de gasto.
- **Formula/s**: [[Taxgov_Caixabank_€-BD_Movimientos_Formulas#F4]]
- **Referencias**: 
- **Fuente**: [[Taxgov_Caixabank_€-BD_AsigCostes]]

### **K**
- **Nombre**: 'CF category'
- **Contenido**: .
- **Formula/s**: [[Taxgov_Caixabank_€-BD_Movimientos_Formulas#F5]]
- **Referencias**:  
- **Fuente**: [[Taxgov_Caixabank_€-BD_AsigCostes]]
 


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
