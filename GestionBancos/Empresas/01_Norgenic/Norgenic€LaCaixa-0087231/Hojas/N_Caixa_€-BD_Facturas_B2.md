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

## **SpreadSheet id**
1e32wr8Lx5e-P6uGApQDnXFxnIQyijgGX6QAITRPZLKI
Spreadsheet creado para ser leido por [[wf_B2_Cebollon_Context]] en lugar de [[N_Caixa_€-BD_Facturas]] ya que el spreadsheet es tan grande que requiere mucho tiempo de lectura y escritura para operaciones sencillas. Poniendo la lectura y escritura en este Spreadsheet el workflow pasa de +5min a unos 30 segundos. Y la transferencia de datos a [[N_Caixa_€-BD_Facturas#A]] es de meros segundos. Esto agiliza mucho el trabajo, especialmente relevante en periodos contrareloj como el cierre de mes.

## **Gid**
707381639

## 📋 Descripción de las columnas


### **A**
  - **Nombre**: UID
  - **Contenido**: Heredado de [[N_Caixa_€-Pipeline#B2]]. UID de las facturas.
  - **Formula/s**: NULL
  - **Referencias**: ; [[N_Caixa_€-Rangos#A]]
  - **Fuentes:**: [[wf_B2_Cebollon_Context]]


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
