---
title: 
tags: 
component: 
related: [[N_Caixa_€-Pipeline#A1]], [[N_Caixa_€-Movimientos_cuenta_0087231]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Base de datos que contiene todos los movimientos bancarios en estado puro y, al terminar el pipeline, tambien los datos de las facturas relacionadas con ellos, ...

---
## **Gid**
807203707

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'Fecha'
- **Contenido**: 
- **Formula/s**: =QUERY(BD_Movimientos!A1:J;"select B,I,F where B >= date '"&TEXTO(D2;"yyyy-mm-dd")&"' and B< date '"&TEXTO(E2;"yyyy-mm-dd")&"'")
- **Referencias**: 
- **Fuente**: [[N_Caixa_$-BD_Movimientos]], [[N_Caixa_$-Odoo#D]], [[N_Caixa_$-Odoo#E]]

### **B**
- **Nombre**: 'Descriptor'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[N_Caixa_$-Odoo#A]].

### **C**
- **Nombre**: 'Importe'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[N_Caixa_$-Odoo#A]].

### **D**
- **Nombre**: 'LastUpdated'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:
- **Fuente**: .

### **E**
- **Nombre** : 'LastDay'
- **Contenido**: 
- **Formula/s**:  =Max(BD_Banco!B:B).
- **Referencias**:
- **Fuente**: [[N_Caixa_$-BD_Movimientos#B]]





---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
