---
title: 
tags: 
component: 
related: [[Norgenic_BBVA_€-Pipeline#A1]], [[[[Norgenic_BBVA_€-BD_Banco#B]]]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Base de datos que contiene todos los movimientos bancarios en estado puro y, al terminar el pipeline, tambien los datos de las facturas relacionadas con ellos, ...

---
## **Gid**
1804003886

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'Fecha'
- **Contenido**: 
- **Formula/s**: =ArrayFormula(BD_Banco!B2:B)
- **Referencias**: 
- **Fuente**: [[Norgenic_BBVA_€-BD_Banco#B]]

### **B**
- **Nombre**: 'Descriptor'
- **Contenido**: 
- **Formula/s**: =ArrayFormula(CONCAT(CONCAT(BD_Banco!F2:F;BD_Banco!D2:D);BD_Banco!E2:E))
- **Referencias**:  
- **Fuente**: [[Norgenic_BBVA_€-BD_Banco], ].

### **C**
- **Nombre**: 'Importe'
- **Contenido**: 
- **Formula/s**: =ArrayFormula(BD_Banco!G2:G)
- **Referencias**:  
- **Fuente**: [[Norgenic_BBVA_€-BD_Banco#G]].





---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
