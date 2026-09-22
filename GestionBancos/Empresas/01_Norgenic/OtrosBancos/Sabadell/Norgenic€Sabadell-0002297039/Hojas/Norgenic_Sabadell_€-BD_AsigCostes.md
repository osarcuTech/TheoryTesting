---
title: 
tags: 
component: 
related: 
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Base de datos que contiene todos los movimientos bancarios en estado puro y, al terminar el pipeline, tambien los datos de las facturas relacionadas con ellos, ...

---
## **Gid**
622432304

## 📋 Descripción de las columnas


### **A**
- **Nombre**: Concepto
- **Contenido**: Solo se necesita 'Concepto' en este banco para formar 'Descriptor'.
- **Formula/s**: =UNIQUE(BD_Movimientos!B:B)
- **Referencias**: 
- **Fuente**: [[Norgenic_Sabadell_€-BD_Banco#B]]

### **B**
- **Nombre**: 'CF in/out'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: .

### **C**
- **Nombre**: 'CF category' 
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: .


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
