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
1626582603

## 📋 Descripción de las columnas



### **A**
- **Nombre**: 'Periodo'
- **Contenido**: UID formado mediante la concatenación de las distintas columnas del movimiento.
- **Formula/s**: =QUERY(BD_Movimientos!A:M;"select I,J,K,sum(E),sum(M) where E is not null group by I,J,K label I 'Periodo', J 'CF in/out', K 'Concepto', sum(E) 'ImporteAUD', sum(M) 'Importe €'";0)
- **Referencias**: 
- **Fuente**: [[N_Caixa_AUD-BD_Movimientos]]

### **B**
- **Nombre**: 'CF in/out'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[N_Caixa_AUD-PreCashFlow#A]].

### **C**
- **Nombre**: 'Concepto' ('CF category')
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[N_Caixa_AUD-PreCashFlow#A]].

### **D**
- **Nombre**: 'ImporteAUD'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[N_Caixa_AUD-PreCashFlow#A]].

### **E**
- **Nombre**: 'Importe€'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[N_Caixa_AUD-PreCashFlow#A]].


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
