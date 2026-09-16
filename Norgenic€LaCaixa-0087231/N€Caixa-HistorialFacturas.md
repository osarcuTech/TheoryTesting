---
title: 
tags: 
component: 
related: [[01_Arquitectura_General]], [[B1_ImportarMovimientos_GS]], [[B1_ImportarMovimientos_WF(Deprecado)]], [[wf_A2_AsignacionDeGastos]], [[A2_AsignacionDeGastos]], [[C0_PunteoFacturas]], [[Metricas_Asignacion]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Registro de facturas con información accesible para C0.

---

## 📋 Descripción de las columnas

- **Fuente**: [[N€Caixa-BD_Facturas]]
- **GID Hoja**: 1839937135
- **Columnas**:

### **A**
  - **Nombre**: 'UID'
  - **Contenido**: UID de las facturas.
  - **Formula/s**: =QUERY(BD_Facturas!A2:B;"select A where B='' LIMIT "&CONTARA(BD_Facturas!A2:A))
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-BD_Facturas#A]]

### **B**
  - **Nombre**: 'Fecha'
  - **Contenido**: Fecha completa de la factura.
  - **Formula/s**: =ArrayFormula(SPLIT($A2:INDICE(A:A;LastRow_Hist_Fras);"_")) 
  - **Referencias**:  [[N€Caixa-Rangos#C]]
  - **Fuentes**: [[N€Caixa-HistorialFacturas#A]] 

### **C**
  - **Nombre**: 'Proveedor'
  - **Contenido**: Nombre del Proveedor que emite la factura
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-HistorialFacturas#B]]. 

### **D**
  - **Nombre**: 'Importe'
  - **Contenido**: Importe de la factura.
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-HistorialFacturas#B]]. 

### **E**
  - **Nombre**: 'Moneda'
  - **Contenido**: Divisa de la factura.
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-HistorialFacturas#B]]. 

### **F**
  - **Nombre**: 'Factura'
  - **Contenido**: ID de la factura según Proveedor.
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-HistorialFacturas#B]]. 

### **G**
  - **Nombre**: 'Empresa'
  - **Contenido**: Norgenic.
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-HistorialFacturas#B]]. 

### **H**
  - **Nombre**: 'Dia'
  - **Contenido**: nº de Dia del mes de la factura.
  - **Formula/s**: =ArrayFormula(SPLIT($B2:INDICE(B:B;LastRow_Hist_Fras);"/"))
  - **Referencias**: [[N€Caixa-Rangos#C]]
  - **Fuentes**: [[N€Caixa-HistorialFacturas#B]]

### **I**
  - **Nombre**: 'Mes'
  - **Contenido**: Mes de la factura.
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-HistorialFacturas#H]]. 

### **J**
  - **Nombre**: 'Año'
  - **Contenido**: Año de la factura.
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-HistorialFacturas#H]]. 

### **K**
  - **Nombre**: 'Periodo'
  - **Contenido**: Mes/Año de la factura.
  - **Formula/s**: =ArrayFormula(DERECHA($B2:INDICE(B:B;LastRow_Hist_Fras);7))
  - **Referencias**: [[N€Caixa-Rangos#C]]
  - **Fuentes**: [[N€Caixa-HistorialFacturas#B]]

### **L**
  - **Nombre**: 'Punteada'
  - **Contenido**: Indica si la factura ha sido ya punteada o no.
  - **Formula/s**: =ARRAYFORMULA(
                                  let(
                                  limiteFras;LastRow_Hist_Fras;
                                  limiteBanco; LastRow_Movim_Banco;
                                  facturas;INDIRECTO("$A$2:$A"& limiteFras);
                                  columnaPunteo; INDIRECTO("Movimientos_cuenta_0087231!$H$2:$H"& limiteBanco);

                                  SI(BUSCARV(facturas; columnaPunteo;1;0)<>"";"Si"; "")
                                  )
                                  )
  - **Referencias**: [[N€Caixa-Rangos#C]],[[N€Caixa-Movimientos_cuenta_0087231#H]]
  - **Fuentes**: [[N€Caixa-HistorialFacturas#A]]


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
