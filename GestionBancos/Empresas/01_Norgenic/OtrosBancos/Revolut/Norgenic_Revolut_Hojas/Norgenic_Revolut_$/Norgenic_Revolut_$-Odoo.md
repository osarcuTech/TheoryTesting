---
title: 
tags: 
component: 
related: [[Norgenic_Revolut-Pipeline#A1]], [[Norgenic_Revolut_$-BD_Movimientos]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Base de datos que contiene todos los movimientos bancarios en estado puro y, al terminar el pipeline, tambien los datos de las facturas relacionadas con ellos, ...

---
## **Gid**
993368351

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'Fecha'
- **Contenido**: 
- **Formula/s**: =QUERY('BD_Movimientos_€'!A:H;"select B,G,E where B >= date '"&TEXTO(D2;"yyyy-mm-dd")&"' and B<= date '"&TEXTO(E2;"yyyy-mm-dd")&"'";1)
- **Referencias**: 
- **Fuente**: [[Norgenic_Revolut-Pre_Odoo]], [[Norgenic_Revolut_$-Odoo#D]], [[Norgenic_Revolut_$-Odoo#E]]

### **B**
- **Nombre**: 'Descriptor'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[Norgenic_Revolut_$-Odoo#A]].

### **C**
- **Nombre**: 'Importe'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[Norgenic_Revolut_$-Odoo#A]].

### **D**
- **Nombre**: 'LastUpdated'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:
- **Fuente**: .

### **E**
- **Nombre** : 'LastDay'
- **Contenido**: 
- **Formula/s**: =max('BD_Movimientos_€'!A2:A)-1
- **Referencias**:
- **Fuente**: [[Norgenic_Revolut_$-BD_Movimientos_€#A]]





---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
