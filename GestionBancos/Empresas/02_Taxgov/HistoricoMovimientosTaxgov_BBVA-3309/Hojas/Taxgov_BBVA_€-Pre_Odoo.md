---
title: 
tags: 
component: 
related: [[Taxgov_BBVA_€-Pipeline#A1]], [[Taxgov_BBVA_€-BD_Banco#B]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Base de datos que contiene todos los movimientos bancarios en estado puro y, al terminar el pipeline, tambien los datos de las facturas relacionadas con ellos, ...

---
## **Gid**
234001999

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'Fecha'
- **Contenido**: 
- **Formula/s**: =ArrayFormula(BD_Banco!B2:B)
- **Referencias**: 
- **Fuente**: [[Taxgov_BBVA_€-BD_Banco#B]]

### **B**
- **Nombre**: 'Descriptor'
- **Contenido**: 
- **Formula/s**: =ArrayFormula(CONCAT(CONCAT(BD_Banco!G2:G;BD_Banco!E2:E);BD_Banco!F2:F))
- **Referencias**:  
- **Fuente**: [[Taxgov_BBVA_€-BD_Banco], ].

### **C**
- **Nombre**: 'Importe'
- **Contenido**: 
- **Formula/s**: =ArrayFormula(BD_Banco!H2:H)
- **Referencias**:  
- **Fuente**: [[Taxgov_BBVA_€-BD_Banco#G]].





---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
