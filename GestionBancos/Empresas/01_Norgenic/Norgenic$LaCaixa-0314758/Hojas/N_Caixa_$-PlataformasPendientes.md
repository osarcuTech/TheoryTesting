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
- **Nombre**: UID
- **Contenido**: UID formado mediante la concatenación de las distintas columnas del movimiento.
- **Formula/s**: =Query(PunteoPlataformas!A2:J;"select * where I = '' limit "&CONTARA(PunteoPlataformas!A2:J))
- **Referencias**: 
- **Fuente**: [[N_Caixa_$-PunteoPlataformas]]

### **B**
- **Nombre**: 'Fecha'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[N_Caixa_$-PlataformasPendientes#A]].

### **C**
- **Nombre**: 'Fecha valor'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[N_Caixa_$-PlataformasPendientes#A]].

### **D**
- **Nombre**: 'Movimiento'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[N_Caixa_$-PlataformasPendientes#A]].

### **E**
- **Nombre** : 'Más datos'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[N_Caixa_$-PlataformasPendientes#A]].

### **F**
- **Nombre**: 'Importe'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[N_Caixa_$-PlataformasPendientes#A]]..

### **G**
- **Nombre**: 'Saldo'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[N_Caixa_$-PlataformasPendientes#A]].

### **H**
- **Nombre**: 'Concepto'
- **Contenido**: Columna helper para la construcción del "Concepto" del Cashflow.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N_Caixa_$-PlataformasPendientes#A]].

### **I**
- **Nombre**: 'NombreFactura'.
- **Contenido**: UID's de facturas.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: 

### **J**
- **Nombre**: 'Ubicacion'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: 




---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
