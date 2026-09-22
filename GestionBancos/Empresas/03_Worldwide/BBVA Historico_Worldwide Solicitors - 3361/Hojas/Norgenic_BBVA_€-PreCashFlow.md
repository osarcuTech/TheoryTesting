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
1345895290

## 📋 Descripción de las columnas



### **A**
- **Nombre**: 'Periodo'
- **Contenido**: UID formado mediante la concatenación de las distintas columnas del movimiento.
- **Formula/s**: =QUERY(BD_Movimientos!A:O;"select M,N,O,sum(G) where G is not null group by M,N,O label M 'Periodo', N 'CF in/out', O 'CF category', sum(G) 'Importe'";0)
- **Referencias**: 
- **Fuente**: [[Norgenic_BBVA_€-BD_Movimientos]]

### **B**
- **Nombre**: 'CF in/out'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[Norgenic_BBVA_€-PreCashFlow#A]].

### **C**
- **Nombre**: 'CF category'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[Norgenic_BBVA_€-PreCashFlow#A]].

### **D**
- **Nombre**: 'Importe'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[Norgenic_BBVA_€-PreCashFlow#A]].



---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
