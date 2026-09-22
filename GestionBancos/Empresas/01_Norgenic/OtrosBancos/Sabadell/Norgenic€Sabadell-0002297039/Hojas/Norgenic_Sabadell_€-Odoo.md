---
title: 
tags: 
component: 
related: [[Norgenic_Sabadell_€-Pipeline#A1]], [[Norgenic_Sabadell_€-BD_Movimientos]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Base de datos que contiene todos los movimientos bancarios en estado puro y, al terminar el pipeline, tambien los datos de las facturas relacionadas con ellos, ...

---
## **Gid**
1988865257

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'Fecha'
- **Contenido**: 
- **Formula/s**: =QUERY(BD_Banco!A1:D;"select C,B,D where A >= date '"&TEXTO(Odoo!$D2;"yyyy-mm-dd")&"' and A<= date '"&TEXTO(Odoo!$E2;"yyyy-mm-dd")&"'")
- **Referencias**: 
- **Fuente**: [[Norgenic_Sabadell_€-BD_Banco]], [[Norgenic_Sabadell_€-Odoo#D]], [[Norgenic_Sabadell_€-Odoo#E]]

### **B**
- **Nombre**: 'Descriptor'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[Norgenic_Sabadell_€-Odoo#A]].

### **C**
- **Nombre**: 'Importe'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[Norgenic_Sabadell_€-Odoo#A]].

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
- **Fuente**: [[Norgenic_Sabadell_€-Pre_Odoo#B]]





---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
