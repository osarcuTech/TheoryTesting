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

## 📋 Descripción de las columnas

- **GID Hoja**: 1089991841

### **A**
- **Nombre**: UID
- **Contenido**: UID formado mediante la concatenación de las distintas columnas del movimiento.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Pipeline#A1]]

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
- **Fuente**: Script Archivado de Movimientos

### **I**
- **Nombre**: 'Def_UID'**: Creación de una uid, a partir de la anterior, que contenga la infromación de la relación de cada movimiento con las facturas.
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#N]]

### **J**
- **Nombre**: 'PeriodoCobro'**: Mes/año.
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#I]]

### **K**
- **Nombre**: 'NombreFact'
- **Contenido**: 
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#H]]

### **L**
- **Nombre**: 'CF in/out'
- **Contenido**: Clasificación de los tipos de gasto.
- **Formula/s**: NULL 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#K]]

### **M**
- **Nombre**: 'CF category'
- **Contenido**: .
- **Formula/s**: Null
- **Referencias**:  
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#L]]

### **N**
- **Nombre**: 'PlataformaPago'
- **Contenido**: Clasifica los distintos bancos para encontrar los que tenemos que realizarles un seguimiento especial.
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#M]]

### **O**
- **Nombre**: 'Validacion (CO)'
- **Contenido**: C0.2 Booleano que indica la fuente de la verdad.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#P]]

### **P**
- **Nombre**: 'P.Conable'
- **Contenido**: Mes y año en el que se contabiliza una factura en caso de haber una asociada.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#R]]

### **Q**
- **Nombre**: 'Ubicación VT'
- **Contenido**: Indica en que carpeta de Via Tribut se encuentra una factura.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#S]]

### **R**
- **Nombre**: 'ID_Enviada'
- **Contenido**: Indica el ID de la factura enviada para su facil localización concantenado "https://drive.google.com/file/d/"& ID.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#T]]

### **S**
- **Nombre**: 'Carpeta'
- **Contenido**: Indica el ID de la carpeta de Via Tributa en la que se encuentra la factura. Función similar a la columna anterior
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[N_Caixa_€-Movimientos_cuenta_0087231#U]]


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
