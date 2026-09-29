---
title: 
tags: 
component: 
related:  
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Es un fork de [[Orders_BD_FP-SG_Finances]] a partir de una fuente de datos simplificada para no importar tantos datos.

Base de datos que contiene todas las ordenes de Solidgate y datos enriquecidos a partir de la información importada con el objetivo de prepara la información para la revisión en los distintos data marts.
Los datos de las ordenes de Solidgate para este documento se sacan de las siguiente url: 
https://hub.solidgate.com/reports-and-exports
Creando un reporte de tipo "Finance" seleccionando los "Channels" y los intervalos de fachas correspondientes.

---
## **Gid**
0

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'created_at'
- **Contenido**: Momento del registro de un cambio.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: 

### **B**
- **Nombre**: 'amount_in_major_units'
- **Contenido**: Precio en la moneda de origen.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: 

### **C**
- **Nombre** : 'Currency'
- **Contenido**: Moneda en la que se hace la transacción.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: 

### **D**
- **Nombre**: 'payout_amount_in_major_units'
- **Contenido**: Precio en la moneda en que lo cobramos/pagamos.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: 

### **E**
- **Nombre**: 'payout_currency'
- **Contenido**: Moneda en la que cobramos/pagamos.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: 

### **F**
- **Nombre**: 'record_type_key'
- **Contenido**: Tipo de transacacción que ser realiza (SALE/REFUND/CHARGEBACK).
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: 


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
