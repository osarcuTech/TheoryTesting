---
title: 
tags: 
component: 
related: [[WW_BBVA_€-Pipeline#A1]], [[WW_BBVA_€-BD_Movimientos]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Base de datos que contiene todos los movimientos bancarios en estado puro y, al terminar el pipeline, tambien los datos de las facturas relacionadas con ellos, ...

---
## **Gid**
69527981

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'Fecha'
- **Contenido**: 
- **Formula/s**: =QUERY(Pre_Odoo!A1:C;"select * where A >= date '"&TEXTO(Odoo!$D2;"yyyy-mm-dd")&"' and A< date '"&TEXTO(Odoo!$E2;"yyyy-mm-dd")&"'")
- **Referencias**: 
- **Fuente**: [[WW_BBVA_€-Pre_Odoo]], [[WW_BBVA_€-Odoo#D]], [[WW_BBVA_€-Odoo#E]]

### **B**
- **Nombre**: 'Descriptor'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[WW_BBVA_€-Odoo#A]].

### **C**
- **Nombre**: 'Importe'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[WW_BBVA_€-Odoo#A]].

### **D**
- **Nombre**: 'LastUpdated'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:
- **Fuente**: .

### **E**
- **Nombre** : 'LastDay'
- **Contenido**: 
- **Formula/s**:  =MAX(Pre_Odoo!A1:A)-1
- **Referencias**:
- **Fuente**: [[WW_BBVA_€-Pre_Odoo#B]]





---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
