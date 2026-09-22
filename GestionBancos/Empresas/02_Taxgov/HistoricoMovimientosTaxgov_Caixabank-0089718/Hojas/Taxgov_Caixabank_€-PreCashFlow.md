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
493827295

## 📋 Descripción de las columnas



### **A**
- **Nombre**: 'Periodo'
- **Contenido**: UID formado mediante la concatenación de las distintas columnas del movimiento.
- **Formula/s**: =QUERY(
{
ARRAYFORMULA(TEXTO(BD_Movimientos!I1:I;"yyyy/MM"))\
BD_Movimientos!D1:L
};
"select Col1,Col8,Col9,sum(Col3)
 where Col3 is not null
 group by Col1,Col8,Col9
 label Col1 'Periodo', Col8 'CF in/out', Col9 'CF category', sum(Col3) 'Importe'";
0)
- **Referencias**: 
- **Fuente**: [[Taxgov_Caixabank_€-BD_Movimientos]]

### **B**
- **Nombre**: 'CF in/out'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[Taxgov_Caixabank_€-PreCashFlow#A]].

### **C**
- **Nombre**: 'CF category'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[Taxgov_Caixabank_€-PreCashFlow#A]].

### **D**
- **Nombre**: 'Importe'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[Taxgov_Caixabank_€-PreCashFlow#A]].

### **E**
- **Nombre**: 'Importe€'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[Taxgov_Caixabank_€-PreCashFlow#A]].


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
