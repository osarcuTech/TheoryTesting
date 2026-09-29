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
https://hub.solidgate.com/payments/order?updated_at_from=2026-09-21&order_id=&customer_email=&amount=&currency_code=&cardholder_name=&customer_id=&card_info=&solidgate_id=&website=&ip_address=&psp_mid_descriptor=&bank=&card_id=&auth_code=&product_id=&arn_code=&description=&ip_city=&pp_invoice_id=&payer_first_name=&payer_last_name=&order_statuses=settled&order_statuses=refunded&traffic_source=

---
## **Gid**
0

## 📋 Descripción de las columnas


### **A**
- **Nombre**: 'Order_id'
- **Contenido**: Id de la orden de Solidgate.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[SolidgateOrdersUpsert]]

### **B**
- **Nombre**: 'created_at'
- **Contenido**: Momento del registro de la orden.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[SolidgateOrdersUpsert]]

### **C**
- **Nombre**: 'updated_at'
- **Contenido**: Momento del registro de un cambio en la orden.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[SolidgateOrdersUpsert]]

### **D**
- **Nombre**: 'Amount'
- **Contenido**: Precio en la moneda de origen.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[SolidgateOrdersUpsert]]

### **E**
- **Nombre** : 'Currency'
- **Contenido**: Moneda en la que se hace la transacción.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[SolidgateOrdersUpsert]]

### **F**
- **Nombre**: 'Status'
- **Contenido**: settled/refunded indica si es un venta o un reembolso.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[SolidgateOrdersUpsert]]

### **G**
- **Nombre**: 'Descriptor'
- **Contenido**: Ayuda a diferenciar las plataformas de pago.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[SolidgateOrdersUpsert]]

### **H**
- **Nombre**: 'Channel'
- **Contenido**: Ayuda a detectar por donde llega.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[SolidgateOrdersUpsert]]

### **I**
- **Nombre**: 'Card number'.
- **Contenido**: Tarjeta del cliente.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[SolidgateOrdersUpsert]]

### **J**
- **Nombre**: 'Email'.
- **Contenido**: Correo del cliente.
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: [[SolidgateOrdersUpsert]]

### **K**
- **Nombre**: 'Connector'
- **Contenido**: Plataforma de pago.
- **Formula/s**: [[Orders_BD-SG_Orders_Formulas#F1]]
- **Referencias**: 
- **Fuente**: 

### **L**
- **Nombre**: 'Product'
- **Contenido**: Tipo de producto.
- **Formula/s**:  [[Orders_BD-SG_Orders_Formulas#F2]]
- **Referencias**: 
- **Fuente**: 

### **M**
- **Nombre**: 'Amount'
- **Contenido**: Importe en moneda de pago.
- **Formula/s**: [[Orders_BD-SG_Orders_Formulas#F3]]
- **Referencias**:  
- **Fuente**: 

### **N**
- **Nombre**: 'Sett_Pago'
- **Contenido**: .
- **Formula/s**: NULL
- **Referencias**:  
- **Fuente**: Manual

### **O**
- **Nombre**: 'Sett_Refunded'
- **Contenido**: .
- **Formula/s**: NULL
- **Referencias**: 
- **Fuente**: Manual

### **P**
- **Nombre**: 'F_created_at'
- **Contenido**: [[Orders_BD-SG_Orders#B]] en formato utilizable para las query's de los data marts.
- **Formula/s**: [[Orders_BD-SG_Orders_Formulas#F4]]
- **Referencias**: 
- **Fuente**: 

### **Q**
- **Nombre**: 'F_updated_at'
- **Contenido**: [[Orders_BD-SG_Orders#C]] en formato utilizable para las query's de los data marts.
- **Formula/s**: [[Orders_BD-SG_Orders_Formulas#F5]]
- **Referencias**: 
- **Fuente**: 

### **R**
- **Nombre**: 'alternUID'
- **Contenido**: .
- **Formula/s**: [[Orders_BD-SG_Orders_Formulas#F6]]
- **Referencias**: 
- **Fuente**: 

### **S**
- **Nombre**: 'Sett_Pago_Revolut'
- **Contenido**: 
- **Formula/s**: [[Orders_BD-SG_Orders_Formulas#F7]]
- **Referencias**:  
- **Fuente**: 

### **T**
- **Nombre**: 'Sett_Refunded_Revolut'
- **Contenido**: 
- **Formula/s**: [[Orders_BD-SG_Orders_Formulas#F8]]
- **Referencias**:  
- **Fuente**: 


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
