---
title: 
tags: 
component: 
related: [[GD_BBVA_€-Pipeline#A1]], [[GD_BBVA_€-BD_Movimientos]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Base de datos que contiene todos los movimientos bancarios en estado puro y, al terminar el pipeline, tambien los datos de las facturas relacionadas con ellos, ...

---
## **Gid**
279480814

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'UID'
- **Contenido**: 
- **Formula/s**: [[GD_BBVA_€-BD_Movimientos_Formulas#F1]]
- **Referencias**:  
- **Fuente**: [[GD_BBVA_€-BD_Banco]].

### **B**
- **Nombre**: 'F.CONTABLE'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[GD_BBVA_€-BD_Movimientos#A]].

### **C**
- **Nombre**: 'F.VALOR'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[GD_BBVA_€-BD_Movimientos#A]].

### **D**
- **Nombre**: 'CÓDIGO'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[GD_BBVA_€-BD_Movimientos#A]].

### **E**
- **Nombre** : 'CONCEPTO'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[GD_BBVA_€-BD_Movimientos#A]].

### **F**
- **Nombre**: 'BENEFICIARIO/ORDENANTE'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[GD_BBVA_€-BD_Movimientos#A]].

### **G**
- **Nombre**: 'OBSERVACIONES'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[GD_BBVA_€-BD_Movimientos#A]].

### **H**
- **Nombre**: 'IMPORTE'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[GD_BBVA_€-BD_Movimientos#A]].

### **I**
- **Nombre**: 'SALDO'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[GD_BBVA_€-BD_Movimientos#A]].

### **J**
- **Nombre**: 'DIVISA'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[GD_BBVA_€-BD_Movimientos#A]].

### **K**
- **Nombre**: 'OFICINA'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[GD_BBVA_€-BD_Movimientos#A]].

### **L**
- **Nombre**: 'REMESA'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[GD_BBVA_€-BD_Movimientos#A]].

### **M**
- **Nombre**: 'Factura'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[GD_BBVA_€-BD_Movimientos#A]].

### **N**
- **Nombre**: 'Descriptor'
- **Contenido**: 
- **Formula/s**: [[GD_BBVA_€-BD_Movimientos_Formulas#F2]]
- **Referencias**: 
- **Fuente**:  .

### **O**
- **Nombre**: 'Periodo'
- **Contenido**: 
- **Formula/s**: [[GD_BBVA_€-BD_Movimientos_Formulas#F3]]
- **Referencias**: 
- **Fuente**:  .

### **P**
- **Nombre**: 'CF in/out'
- **Contenido**: 
- **Formula/s**: [[GD_BBVA_€-BD_Movimientos_Formulas#F4]]
- **Referencias**: 
- **Fuente**:  .

### **Q**
- **Nombre**: 'CF category'
- **Contenido**: 
- **Formula/s**: [[GD_BBVA_€-BD_Movimientos_Formulas#F5]]
- **Referencias**: 
- **Fuente**:  .



---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
