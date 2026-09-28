---
title: Índice de fuentes
created: 2026-09-10
updated: 2026-09-10
type: source
status: confirmado
---

# Fuentes usadas en este análisis

> Notas de puntero — no son copias del contenido. Los ficheros de datos citados son propiedad del usuario y no se han incluido en este vault (solo sus hallazgos derivados, en `wiki/`).

## Documentación de contexto (proyecto original, pre-existente)
- `Contexto_Solidgate_30_04_2026` — documento .docx generado con `docx` (npm), contexto general del ecosistema Solidgate/Stropper/Sheets.
- `solidgate_context_v02.docx` (dos versiones) — versión ampliada del anterior, incluye estructura de columnas de `SG_Orders` y hojas de conciliación Checkout €/$/£.
- `SheetContext_SG_Orders_`, `SheetContext_MID_`, `SheetContext_CalculoManualV€/$/£` — notas de estructura de las hojas de Google Sheets del proyecto.
- `SolidgateOrdersUpsert` — script de Google Apps Script, lógica UPSERT del histórico de órdenes.
- `Cambios_Tarde_05_05_2026` — registro de cambios manuales en las hojas de conciliación.
- `Export_Report_Finances/Disputes/Alertas/Orders` — notas de Power Query (M) para limpiar los exports crudos de Solidgate.

## Datos analizados en esta conversación (medios de pago / fraude)
- `_csv_.xlsx` — muestra cruda del Finance Report (CSV con problema de coma decimal), 510.803 filas.
- `MuestraOrdenes.xlsx` — muestra de Card Orders, 439 filas, 69 columnas, usada para validar el proxy y perfilar columnas.
- `AppendDisputas_-_copia_-_copia.xlsx` — Finance Report histórico completo, tipado limpio, 510.803 filas.
- `DL-Ordenes.xlsx` — Orders Report histórico completo, 76.115 filas, 28 columnas.

## Fuentes externas
- https://docs.solidgate.com/payments/payments-insights/error-codes/ — diccionario oficial de `order_error_code`, usado en [[codigos_error]].
- Email de Solidgate Team anunciando el AI Analyst — usado en [[ai_analyst]].

## Pendientes de recibir
- Capturas/export de `hub.solidgate.com/orchestration/routing`.
- Capturas/export de `hub.solidgate.com/antifraud/rules`.
- Documento "flujo de pagos actual" (prometido por el usuario, contexto del jefe).
