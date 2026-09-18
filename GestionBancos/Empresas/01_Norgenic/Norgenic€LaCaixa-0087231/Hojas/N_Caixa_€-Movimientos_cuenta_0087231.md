---
title: 
tags: 
component: 
related: [[N_Caixa_€-Pipeline#A1]], [[N_Caixa_€-Pipeline#A2]] [[C0_PunteoFacturas]], [[N_Caixa_€-Pipeline#C0]], [[N_Caixa_€-PProveedores.]], [[H0_ControlHumano]].
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

x.

---

## 📋 Descripción de las columnas

- **GID Hoja**: 1963712436

### **A**
  - **Nombre**: UID.
  - **Contenido**:  UID formado mediante la concatenación de las distintas columnas del movimiento.
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N_Caixa_€-Pipeline#A1]].
  
### **B**
  - **Nombre**: 'Fecha'.
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**:  
  - **Fuentes**: [[N_Caixa_€-Pipeline#A1]].
  
### **C**
  - **Nombre**: 'Fecha valor'.
  - **Contenido**: 
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N_Caixa_€-Pipeline#A1]].
  
### **D**
  - **Nombre**: 'Movimiento'.
  - **Contenido**: 
  - **Formula/s**: 
  - **Referencias**: 
  - **Fuentes**: [[N_Caixa_€-Pipeline#A1]].
  
### **E**
  - **Nombre** : 'Más datos'.
  - **Contenido**: 
  - **Formula/s**: 
  - **Referencias**: 
  - **Fuentes**: [[N_Caixa_€-Pipeline#A1]].
  
### **F**
  - **Nombre**: 'Importe'.
  - **Contenido**: 
  - **Formula/s**: 
  - **Referencias**: 
  - **Fuentes**: [[N_Caixa_€-Pipeline#A1]].
  
### **G**
  - **Nombre**: 'Saldo'.
  - **Contenido**: 
  - **Formula/s**: 
  - **Referencias**: 
  - **Fuentes**: [[N_Caixa_€-Pipeline#A1]].
  
### **H**
  - **Nombre**: 'NombreFactura'.
  - **Contenido**: C0.3. UID de las Facturas heredadas en función de C0.1B. Si( (C0.2=true),(C0.1A),(C0.1B) ).
  - **Formula/s**: [[N_Caixa_€-Movimientos_cuenta_0087231_Formulas#F1]]
  - **Referencias**: [[N_Caixa_€-Movimientos_cuenta_0087231#P|C0.2]],[[C0_PunteoFacturas]]
  - **Fuentes**: [[N_Caixa_€-Movimientos_cuenta_0087231#O|C0.1A]], [[N_Caixa_€-Movimientos_cuenta_0087231#Q|C0.1B]]
  
### **I**
  - **Nombre**: 'PeriodoCobro'.
  - **Contenido**: Mes/año.
  - **Formula/s**: [[N_Caixa_€-Movimientos_cuenta_0087231_Formulas#F2]]
  - **Referencias**: 
  - **Fuentes**: [[N_Caixa_€-Movimientos_cuenta_0087231#B]]
  
### **J**
  - **Nombre**: 'DescripccionMovimiento'.
  - **Contenido**: Descritpor único del causante del movimiento.
  - **Formula/s**: [[N_Caixa_€-Movimientos_cuenta_0087231_Formulas#F3]]
  - **Referencias**: 
  - **Fuentes**: [[N_Caixa_€-Movimientos_cuenta_0087231#D|Movimiento]], [[N_Caixa_€-Movimientos_cuenta_0087231#E|MásDatos]]
  
### **K**
  - **Nombre**: 'CF in/out'.
  - **Contenido**: Clasificación de los tipos de gasto. Se actualiza cada vez que se actualiza `A2.1`
  - **Formula/s**: [[N_Caixa_€-Movimientos_cuenta_0087231_Formulas#F4]] 
  - **Referencias**: [[N_Caixa_€-Form_AsigCostes|A2.1]], [[N_Caixa_€-Rangos]]
  - **Fuentes**: 
  
### **L**
  - **Nombre**: 'CF category'.
  - **Contenido**: 
  - **Formula/s**: Null
  - **Referencias**: [[N_Caixa_€-Movimientos_cuenta_0087231_Formulas#F4]] 
  - **Fuentes**: [[N_Caixa_€-Movimientos_cuenta_0087231#K]]
  
### **M**
  - **Nombre**: 'PlataformaPago'.
  - **Contenido**: Clasifica los distintos bancos para encontrar los que tenemos que realizarles un seguimiento especial.
  - **Formula/s**: [[N_Caixa_€-Movimientos_cuenta_0087231_Formulas#F5]]
  - **Referencias**:  
  - **Fuentes**: 
  
### **N**
  - **Nombre**: 'Def_UID'.
  - **Contenido**: Creación de una uid, a partir de la anterior, que contenga la infromación de la relación de cada movimiento con las facturas.
  - **Formula/s**: [[N_Caixa_€-Movimientos_cuenta_0087231_Formulas#F6]]
  - **Referencias**: 
  - **Fuentes**: 
  
### **O**
  - **Nombre**: 'Autopunteo'.
  - **Contenido**: C0.1 Sugerencia de coincidencias.
  - **Formula/s**: [[N_Caixa_€-Movimientos_cuenta_0087231_Formulas#F7]]
  - **Referencias**: 
  - **Fuentes**: [[N_Caixa_€-HistorialFacturas#A]]
  
### **P**
  - **Nombre**: 'Validacion (CO)'.
  - **Contenido**: C0.2 Booleano que indica la fuente de la verdad.
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[H0_ControlHumano]]
  
### **Q**
  - **Nombre**: 'Fra.Manual'.
  - **Contenido**: Introducción manual del UID de la factura cuando C0.1A no acierte.
  - **Formula/s**: NULL
  - **Referencias**: [[N_Caixa_€-HistorialFacturas#A]]
  - **Fuentes**: [[H0_ControlHumano]]
  
### **R**
  - **Nombre**: 'P.Contable'.
  - **Contenido**: Mes y año en el que se contabiliza una factura en caso de haber una asociada.
  - **Formula/s**: 
  - **Referencias**: 
  - **Fuentes**: [[H0_ControlHumano]]
  
### **S**
  - **Nombre**: 'Ubicación VT'.
  - **Contenido**: Indica en que carpeta de Via Tribut se encuentra una factura.
  - **Formula/s**: 
  - **Referencias**: 
  - **Fuentes**: 
  
### **T**
  - **Nombre**: 'ID_Enviada'.
  - **Contenido**: Indica el ID de la factura enviada para su facil localización concantenado "https://drive.google.com/file/d/"& ID.
  - **Formula/s**: 
  - **Referencias**: 
  - **Fuentes**: 
  
### **U**
  - **Nombre**: 'Carpeta'.
  - **Contenido**: Indica el ID de la carpeta de Via Tributa en la que se encuentra la factura. Función similar a la columna anterior
  - **Formula/s**: 
  - **Referencias**: 
  - **Fuentes**: 
  
### **V**
  - **Nombre**: 'BD'.
  - **Contenido**: Booleano que indica si una fila esta lista para la su arxivado o no.
  - **Formula/s**: 
  - **Referencias**: 
  - **Fuentes**: 
  

---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
