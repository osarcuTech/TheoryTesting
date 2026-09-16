---
title: 
tags: 
component: 
related: [[01_Arquitectura_General]], [[A1_ImportarMovimientos_GS|A1_ImportarMovimientos_GS]], [[A1_ImportarMovimientos_GS|A1_ImportarMovimientos_WF(Deprecado)]], [[wf_A2_AsignacionDeGastos]], [[A2_AsignacionDeGastos]], [[C0_PunteoFacturas]], [[Metricas_Asignacion]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Clasificar automáticamente cada nuevo movimiento bancario usando reglas de matching basadas en patrones de texto del movimiento para añadirlo a `AsigCostes` y crear una query utilizable por [[C0_PunteoFacturas|C0]] para seleccionar las facturas coincidentes.

---

## 📋 Descripción de las columnas

- **Fuente**: [[A1_ImportarMovimientos_GS|A1]]
- **GID Hoja**: 1089991841

### **A**
- **Nombre**: UID
- **Contenido**: Heredado de [[A1_ImportarMovimientos_GS|A1]]. UID formado mediante la concatenación de las distintas columnas del movimiento.
- **Formula/s**: NULL
- **Referencias**: [[A1_ImportarMovimientos_GS|A1]]; [[N€Caixa-Rangos#A]]
- **Fuente**:

### **B**
- **Nombre**: 'Fecha'
- **Contenido**: Heredado de [[A1_ImportarMovimientos_GS|A1]].
- **Formula/s**: NULL
- **Referencias**: [[A1_ImportarMovimientos_GS|A1]] 
- **Fuente**:

### **C**
- **Nombre**: 'Fecha valor'
- **Contenido**: Heredado de [[A1_ImportarMovimientos_GS|A1]].
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**:

### **D**
- **Nombre**: 'Movimiento'
- **Contenido**: Heredado de [[A1_ImportarMovimientos_GS|A1]].
- **Formula/s**: 
- **Referencias**: 
- **Fuente**:

### **E**
- **Nombre** : 'Más datos'
- **Contenido**: Heredado de [[A1_ImportarMovimientos_GS|A1]].
- **Formula/s**: 
- **Referencias**: 
- **Fuente**:

### **F**
- **Nombre**: 'Importe'
- **Contenido**: Heredado de [[A1_ImportarMovimientos_GS|A1]].
- **Formula/s**: 
- **Referencias**: 
- **Fuente**:

### **G**
- **Nombre**: 'Saldo'
- **Contenido**: Heredado de [[A1_ImportarMovimientos_GS|A1]].
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: 

### **H**
- **Nombre**: 'Archivado'
- **Contenido**: Booleano marcado por el Script de Archivado cuando se a archivado con exito ese movimiento.
- **Formula/s**: Null
- **Referencias**: 
- **Fuente**:

### **I**
- **Nombre**: 'Def_UID'**: Creación de una uid, a partir de la anterior, que contenga la infromación de la relación de cada movimiento con las factur
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N€Caixa-Movimientos_cuenta_0087231#N]]

### **J**
- **Nombre**: 'PeriodoCobro'**: Mes y año de `Fec
- **Contenido**: 
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N€Caixa-Movimientos_cuenta_0087231#I]]

### **K**
- **Nombre**: 'NombreFact'
- **Contenido**: Concatenación de `Movimiento` y `Más datos` para formar un descritpor único para asistir en varios objetivos.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[N€Caixa-Movimientos_cuenta_0087231#H]]

### **L**
- **Nombre**: 'CF in/out'
- **Contenido**: Clasificación de los tipos de gasto.
- **Formula/s**: NULL 
- **Referencias**: 
- **Fuente**: [[N€Caixa-Movimientos_cuenta_0087231#K]]

### **M**
- **Nombre**: 'CF category'
- **Contenido**: .
- **Formula/s**: Null
- **Referencias**:  
- **Fuente**: [[N€Caixa-Movimientos_cuenta_0087231#L]]

### **N**
- **Nombre**: 'PlataformaPago'
- **Contenido**: Clasifica los distintos bancos para encontrar los que tenemos que realizarles un seguimiento especial.
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: [[N€Caixa-Movimientos_cuenta_0087231#M]]

### **O**
- **Nombre**: 'Validacion (CO)'
- **Contenido**: C0.2 Booleano que indica la fuente de la verdad.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[N€Caixa-Movimientos_cuenta_0087231#P]]

### **P**
- **Nombre**: 'P.Conable'
- **Contenido**: Mes y año en el que se contabiliza una factura en caso de haber una asociada.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N€Caixa-Movimientos_cuenta_0087231#R]]

### **Q**
- **Nombre**: 'Ubicación VT'
- **Contenido**: Indica en que carpeta de Via Tribut se encuentra una factura.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N€Caixa-Movimientos_cuenta_0087231#S]]

### **R**
- **Nombre**: 'ID_Enviada'
- **Contenido**: Indica el ID de la factura enviada para su facil localización concantenado "https://drive.google.com/file/d/"& ID.
- **Formula/s**: 
- **Referencias**: 
- **Fuente**: [[N€Caixa-Movimientos_cuenta_0087231#T]]

### **S**
- **Nombre**: 'Carpeta'
- **Contenido**: Indica el ID de la carpeta de Via Tributa en la que se encuentra la factura. Función similar a la columna anterior
- **Formula/s**: 
- **Referencias**:  
- **Fuente**: [[N€Caixa-Movimientos_cuenta_0087231#U]]


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
