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
3111763

## 📋 Descripción de las columnas



### **A**
- **Nombre**: 'Periodo'
- **Contenido**: UID formado mediante la concatenación de las distintas columnas del movimiento.
- **Formula/s**: =QUERY(BD_Movimientos!A2:O;"select K,L,M,sum(F),sum(O) where A is not null group by K,L,M label K 'Periodo', L 'CF in/out', M 'Concepto', sum(F) 'ImporteUSD', sum(O) 'Importe €'";0)
- **Referencias**: 
- **Fuente**: [[N_Caixa_$-BD_Movimientos]]

### **B**
- **Nombre**: 'CF in/out'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[N_Caixa_$-PreCashFlow#A]].

### **C**
- **Nombre**: 'Concepto' ('CF category')
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[N_Caixa_$-PreCashFlow#A]].

### **D**
- **Nombre**: 'ImporteUSD'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[N_Caixa_$-PreCashFlow#A]].

### **E**
- **Nombre**: 'Importe€'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[N_Caixa_$-PreCashFlow#A]].


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
