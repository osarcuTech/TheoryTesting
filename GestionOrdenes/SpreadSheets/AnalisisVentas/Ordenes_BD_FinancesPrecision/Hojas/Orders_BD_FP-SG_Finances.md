---
title: 
tags: 
component: 
related:  
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Base de datos que contiene todas las ordenes de Solidgate y datos enriquecidos a partir de la información importada con el objetivo de prepara la información para la revisión en los distintos data marts.
Los datos de las ordenes de Solidgate para este documento se sacan de las siguiente url: 
https://hub.solidgate.com/reports-and-exports
Creando un reporte de tipo "Finance" seleccionando los "Channels" y los intervalos de fachas correspondientes.

---
## **Gid**
0

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'Order_id'
- **Contenido**: Id de la orden.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: 

### **B**
- **Nombre**: 'created_at'
- **Contenido**: Momento del registro de un cambio.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: 

### **C**
- **Nombre**: 'amount_in_major_units'
- **Contenido**: Precio en la moneda de origen.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: 

### **D**
- **Nombre** : 'Currency'
- **Contenido**: Moneda en la que se hace la transacción.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: 

### **E**
- **Nombre**: 'payout_amount_in_major_units'
- **Contenido**: Precio en la moneda en que lo cobramos/pagamos.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: 

### **F**
- **Nombre**: 'payout_currency'
- **Contenido**: Moneda en la que cobramos/pagamos.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: 

### **G**
- **Nombre**: 'record_type_key'
- **Contenido**: Tipo de transacacción que ser realiza (SALE/REFUND/CHARGEBACK).
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: 

### **H**
- **Nombre**: 'created_at_t'.
- **Contenido**: Fecha en un formato utilizable para las querys de los datamarts.
- **Formula/s**: 
                =FECHA(
                INDICE(ArrayFormula(SPLIT(SPLIT(B2;" ");"/"));3);
                INDICE(ArrayFormula(SPLIT(SPLIT(B2;" ");"/"));2);
                INDICE(ArrayFormula(SPLIT(SPLIT(B2;" ");"/"));1)
                )
- **Referencias**: 
- **Fuente**: 



---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
