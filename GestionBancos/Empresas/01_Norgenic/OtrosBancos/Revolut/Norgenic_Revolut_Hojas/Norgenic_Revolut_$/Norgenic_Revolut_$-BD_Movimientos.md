---
title: 
tags: 
component: 
related: [[Norgenic_Revolut-BD_Banco-Pipeline#A1]], [[Norgenic_Revolut_$-BD_Movimientos]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Base de datos que contiene todos los movimientos bancarios en estado puro y, al terminar el pipeline, tambien los datos de las facturas relacionadas con ellos, ...

---
## **Gid**
525270837

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'Date started (UTC)'
- **Contenido**: 
- **Formula/s**: [[Norgenic_Revolut_$-BD_Movimientos_Formulas#F1]]
- **Referencias**:  
- **Fuente**: [[Norgenic_Revolut-BD_Banco]].

### **B**
- **Nombre**: 'Date completed (UTC)'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[Norgenic_Revolut_$-BD_Movimientos#A]].

### **C**
- **Nombre**: 'Description'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[Norgenic_Revolut_$-BD_Movimientos#A]].

### **D**
- **Nombre** : 'Reference'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[Norgenic_Revolut_$-BD_Movimientos#A]].

### **E**
- **Nombre**: 'Total amount'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[Norgenic_Revolut_$-BD_Movimientos#A]].

### **F**
- **Nombre**: 'Balance'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[Norgenic_Revolut_$-BD_Movimientos#A]].


### **J**
- **Nombre**: 'Descriptor'
- **Contenido**: 
- **Formula/s**: [[Norgenic_Revolut_$-BD_Movimientos_Formulas#F2]]
- **Referencias**: 
- **Fuente**:  .

### **H**
- **Nombre**: 'Periodo'
- **Contenido**: 
- **Formula/s**: [[Norgenic_Revolut_$-BD_Movimientos_Formulas#F3]]
- **Referencias**: 
- **Fuente**:  .

### **I**
- **Nombre**: 'CF in/out'
- **Contenido**: 
- **Formula/s**: [[Norgenic_Revolut_$-BD_Movimientos_Formulas#F4]]
- **Referencias**: 
- **Fuente**:  .

### **J**
- **Nombre**: 'CF category'
- **Contenido**: 
- **Formula/s**: [[Norgenic_Revolut_$-BD_Movimientos_Formulas#F5]]
- **Referencias**: 
- **Fuente**:  .

### **K**
- **Nombre**: 'TipoCambio'
- **Contenido**: 
- **Formula/s**: [[Norgenic_Revolut_$-BD_Movimientos_Formulas#F6]]
- **Referencias**: 
- **Fuente**:  .

### **L**
- **Nombre**: '€'
- **Contenido**: 
- **Formula/s**: [[Norgenic_Revolut_$-BD_Movimientos_Formulas#F7]]
- **Referencias**: 
- **Fuente**:  .



---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
