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
566070109

## 📋 Descripción de las columnas


### **A**
- **Nombre**: Descriptor
- **Contenido**: UID formado mediante la concatenación de las distintas columnas del movimiento.
- **Formula/s**: =UNIQUE(BD_Movimientos!H:H)
- **Referencias**: 
- **Fuente**: [[N_Caixa_DKK-BD_Banco#H]]

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
