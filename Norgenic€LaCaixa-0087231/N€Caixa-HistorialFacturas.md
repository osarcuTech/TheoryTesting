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

- **Fuente**: [[BD_Facturas]]
- **GID Hoja**: 1839937135
- **Columnas**:
  - **A: UID**:
    - **Contenido**: UID de las facturas. Heredado de `BD_Facturas`. 
    - **Formula/s**: =QUERY(BD_Facturas!A2:B;"select A where B='' LIMIT "&CONTARA(BD_Facturas!A2:A)) [[BD_Facturas]]
    - **Referencias**: 
  - **B: 'Fecha'**:
    - **Contenido**: Fecha completa de la factura.
    - **Formula/s**: =ArrayFormula(SPLIT($A2:INDICE(A:A;LastRow_Hist_Fras);"_")) [[BD_Facturas]], [[Rangos]]
    - **Referencias**:  
  - **C: 'Proveedor'**:
    - **Contenido**: [[N€Caixa-HistorialFacturas|B]]. Nombre del Proveedor que emite la factura.
    - **Formula/s**: NULL
    - **Referencias**: 
  - **D: 'Importe'**:
    - **Contenido**: [[N€Caixa-HistorialFacturas|B]]. Importe de la factura.
    - **Formula/s**: NULL
    - **Referencias**: 
  - **E: 'Moneda'**:
    - **Contenido**: [[N€Caixa-HistorialFacturas|B]]. Divisa de la factura.
    - **Formula/s**: NULL
    - **Referencias**: 
  - **F: 'Factura'**:
    - **Contenido**: [[N€Caixa-HistorialFacturas|B]]. ID de la factura según Proveedor.
    - **Formula/s**: NULL
    - **Referencias**: 
  - **G: 'Empresa'**:
    - **Contenido**: [[N€Caixa-HistorialFacturas|B]]. Norgenic.
    - **Formula/s**: NULL
    - **Referencias**: 
  - **H: 'Dia'**:
    - **Contenido**: nº de Dia del mes de la factura.
    - **Formula/s**: =ArrayFormula(SPLIT($B2:INDICE(B:B;LastRow_Hist_Fras);"/"))
    - **Referencias**: 
  - **I: 'Mes'**:
    - **Contenido**: [[N€Caixa-HistorialFacturas|H]]. Mes de la factura.
    - **Formula/s**: NULL
    - **Referencias**: 
  - **J: 'Año'**:
    - **Contenido**: [[N€Caixa-HistorialFacturas|H]]. Año de la factura.
    - **Formula/s**: NULL
    - **Referencias**: 
  - **K: 'Periodo'**:
    - **Contenido**: Mes/Año de la factura.
    - **Formula/s**: =ArrayFormula(DERECHA($B2:INDICE(B:B;LastRow_Hist_Fras);7))
    - **Referencias**: 
  - **L: 'Punteada'**:
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
    - **Referencias**: [[N€Caixa-Rangos]],[[N€Caixa-Movimientos_cuenta_0087231]]

---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
