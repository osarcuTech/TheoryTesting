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
1445711227

## 📋 Descripción de las columnas



### **A**
- **Nombre**: 'Periodo'
- **Contenido**: UID formado mediante la concatenación de las distintas columnas del movimiento.
- **Formula/s**: =QUERY(BD_Movimientos_AUD!A:M;"select H,I,J,sum(E),sum(L) where E is not null group by H,I,J label H 'Periodo', I 'CF in/out', J 'CF category', sum(E) 'ImporteAUD', sum(L) 'Importe €'";0)
- **Referencias**: 
- **Fuente**: [[Norgenic_Revolut_AUD-BD_Movimientos]]

### **B**
- **Nombre**: 'CF in/out'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[Norgenic_Revolut_AUD-PreCashFlow#A]].

### **C**
- **Nombre**: 'CF category'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[Norgenic_Revolut_AUD-PreCashFlow#A]].

### **D**
- **Nombre**: 'Importe AUD'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[Norgenic_Revolut_AUD-PreCashFlow#A]].

### **D**
- **Nombre**: 'Importe €'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[Norgenic_Revolut_AUD-PreCashFlow#A]].



---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
