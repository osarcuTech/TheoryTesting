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
1089991841

## 📋 Descripción de las columnas


### **A**
- **Nombre**: UID
- **Contenido**: UID formado mediante la concatenación de las distintas columnas del movimiento.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Pipeline#A1]], [[N_Caixa_€-01_ImportarMovimientosGS|A1]]

### **B**
- **Nombre**: 'Fecha'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: [[N_Caixa_€-Pipeline#A1]] 
- **Fuente**: [[N_Caixa_€-Pipeline#A1]].

### **C**
- **Nombre**: 'Fecha valor'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Pipeline#A1]].

### **D**
- **Nombre**: 'Movimiento'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Pipeline#A1]].

### **E**
- **Nombre** : 'Más datos'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Pipeline#A1]].

### **F**
- **Nombre**: 'Importe'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Pipeline#A1]].

### **G**
- **Nombre**: 'Saldo'
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: 
- **Fuente**:  [[N_Caixa_€-Pipeline#A1]].

### **H**
- **Nombre**: 'Archivado'
- **Contenido**: Booleano marcado por el Script de Archivado cuando se a archivado con exito ese movimiento.
- **Formula/s**: Null
- **Referencias**: 
- **Fuente**: Script Archivado de Movimientos [[N_Caixa_€-99_ArchivarMovimientosGS|Archivado]]

### **I**
- **Nombre**: 'Def_UID'**: Creación de una uid, a partir de la anterior, que contenga la infromación de la relación de cada movimiento con las facturas.
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#N]] [[N_Caixa_€-99_ArchivarMovimientosGS|Archivado]]

### **J**
- **Nombre**: 'PeriodoCobro'**: Mes/año.
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#I]] [[N_Caixa_€-99_ArchivarMovimientosGS|Archivado]]

### **K**
- **Nombre**: 'NombreFact'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#H]] [[N_Caixa_€-99_ArchivarMovimientosGS|Archivado]]

### **L**
- **Nombre**: 'CF in/out'
- **Contenido**: Clasificación de los tipos de gasto.
- **Formula/s**: NULL 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#K]] [[N_Caixa_€-99_ArchivarMovimientosGS|Archivado]]

### **M**
- **Nombre**: 'CF category'
- **Contenido**: .
- **Formula/s**: Null
- **Referencias**:  
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#L]] [[N_Caixa_€-99_ArchivarMovimientosGS|Archivado]]

### **N**
- **Nombre**: 'PlataformaPago'
- **Contenido**: Clasifica los distintos bancos para encontrar los que tenemos que realizarles un seguimiento especial.
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#M]] [[N_Caixa_€-99_ArchivarMovimientosGS|Archivado]]

### **O**
- **Nombre**: 'Validacion (CO)'
- **Contenido**: C0.2 Booleano que indica la fuente de la verdad.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#P]] [[N_Caixa_€-99_ArchivarMovimientosGS|Archivado]]

### **P**
- **Nombre**: 'P.Conable'
- **Contenido**: Mes y año en el que se contabiliza una factura en caso de haber una asociada.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#R]] [[N_Caixa_€-99_ArchivarMovimientosGS|Archivado]]

### **Q**
- **Nombre**: 'Ubicación VT'
- **Contenido**: Indica en que carpeta de Via Tribut se encuentra una factura.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#S]] [[N_Caixa_€-99_ArchivarMovimientosGS|Archivado]]

### **R**
- **Nombre**: 'ID_Enviada'
- **Contenido**: Indica el ID de la factura enviada para su facil localización concantenado "https://drive.google.com/file/d/"& ID.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#T]] [[N_Caixa_€-99_ArchivarMovimientosGS|Archivado]]

### **S**
- **Nombre**: 'Carpeta'
- **Contenido**: Indica el ID de la carpeta de Via Tributa en la que se encuentra la factura. Función similar a la columna anterior
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#U]] [[N_Caixa_€-99_ArchivarMovimientosGS|Archivado]]


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
