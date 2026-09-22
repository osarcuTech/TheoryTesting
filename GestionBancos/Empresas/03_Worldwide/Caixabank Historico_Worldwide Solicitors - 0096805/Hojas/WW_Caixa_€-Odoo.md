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
1320013239

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'Fecha'
- **Contenido**: 
- **Formula/s**: =QUERY(BD_Movimientos!A:H;"select A,H,E where A >= date '"&TEXTO(D2;"yyyy-mm-dd")&"' and A<= date '"&TEXTO(E2;"yyyy-mm-dd")&"'";1)
- **Referencias**: 
- **Fuente**: [[WW_Caixa_€-BD_Movimientos]], [[WW_Caixa_€-Odoo#D]], [[WW_Caixa_€-Odoo#E]]

### **B**
- **Nombre**: 'Descriptor'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[WW_Caixa_€-Odoo#A]].

### **C**
- **Nombre**: 'Importe'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[WW_Caixa_€-Odoo#A]].

### **D**
- **Nombre**: 'LastUpdated'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:
- **Fuente**: .

### **E**
- **Nombre** : 'LastDay'
- **Contenido**: 
- **Formula/s**:  =max(BD_Movimientos!B2:B)-1.
- **Referencias**:
- **Fuente**: [[WW_Caixa_€-BD_Movimientos#B]]





---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
