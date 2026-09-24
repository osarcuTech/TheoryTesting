---
title: H1 — Archivo y Registro de Facturas
tags: [H1, archivo, registro, n8n]
component: H1
related: [[01_Arquitectura_General]], [[H0_ControlHumano]], [[H2_ComprobacionCierre]], [[H3_ArchivoRegistro_Implementacion]]
---

# H1 — Archivo y Registro de Facturas

## 🎯 Objetivo

Ejecutar el [[N_Caixa_€-99_ArchivarMovimientosGS|script]] de archivado de movimientos validados por [[H0_ControlHumano|H0]] hacia su ubicación final en [[N_Caixa_€-BD_Banco]].

Es el punto de **no retorno** del pipeline: una vez archivada, la factura está cerrada en el ciclo.

---

## 📋 Descripción del Proceso

### Entrada
- **Fuente**: Fila de autorización de H0
  - Movimiento validado ✓ (P=TRUE)
  - Factura asignada: Columna Q o O
  - Estatus: "Listo para archivar"

### Procesamiento 
¡¡¡Incorrecto!!! mirar script de Archivado y rehacer el resto.


