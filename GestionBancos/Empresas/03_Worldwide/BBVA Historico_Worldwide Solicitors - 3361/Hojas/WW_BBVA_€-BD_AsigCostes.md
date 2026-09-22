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
285571693

## 📋 Descripción de las columnas


### **A**
- **Nombre**: Descriptor
- **Contenido**: UID formado mediante la concatenación de las distintas columnas del movimiento.
- **Formula/s**: =UNIQUE(BD_Movimientos!N:N)
- **Referencias**: 
- **Fuente**: [[WW_BBVA_€-BD_Banco#N]]

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
