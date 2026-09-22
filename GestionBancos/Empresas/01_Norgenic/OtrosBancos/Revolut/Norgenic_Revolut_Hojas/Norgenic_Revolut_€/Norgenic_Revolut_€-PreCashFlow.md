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
462348830

## 📋 Descripción de las columnas



### **A**
- **Nombre**: 'Periodo'
- **Contenido**: UID formado mediante la concatenación de las distintas columnas del movimiento.
- **Formula/s**: =QUERY('BD_Movimientos_€'!A:M;"select H,I,J,sum(E) where E is not null group by H,I,J label H 'Periodo', I 'CF in/out', J 'CF category', sum(E) 'Importe €'";0)
- **Referencias**: 
- **Fuente**: [[Norgenic_Revolut_€-BD_Movimientos]]

### **B**
- **Nombre**: 'CF in/out'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[Norgenic_Revolut_€-PreCashFlow#A]].

### **C**
- **Nombre**: 'CF category'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[Norgenic_Revolut_€-PreCashFlow#A]].

### **D**
- **Nombre**: 'Importe €'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[Norgenic_Revolut_€-PreCashFlow#A]].



---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
