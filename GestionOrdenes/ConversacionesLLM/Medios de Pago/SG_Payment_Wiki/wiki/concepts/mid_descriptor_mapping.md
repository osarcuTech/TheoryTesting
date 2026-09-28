---
title: Mapeo sitio/MID/Descriptor
created: 2026-09-10
updated: 2026-09-10
type: concept
status: parcial
tags: [mid, descriptor, mapeo]
sources: [SheetContext_MID_, finance_report, orders_report]
---

# Mapeo sitio/MID/Descriptor

Ninguno de los exports de datos usados (Finance Report, Orders Report reducido a 28 columnas) trae una columna `Descriptor`/MID legible directamente utilizable de forma consistente.

## Cómo se infiere hoy
- **Finance Report**: `Source.Name` (nombre del fichero de exportación mensual) codifica `{producto}_{sitio}` o `{sitio}` — se usa como proxy de agrupación por MID.
- **Orders Report** (`DL-Ordenes.xlsx`): columna `mid` es un **UUID**, no legible. Se cruzó por `Source.Name` (mismo truco) para obtener 17 UUID → nombre de sitio.
- **Hoja `MID` de referencia** (Google Sheets del proyecto original): mapea Website → Descriptor → Connector → Product, pero es **independiente** de estos dos exports y no siempre coincide 1:1 (un mismo dominio puede tener 2 descriptores según el conector).

## Sitios/MID detectados con movimiento (13 en Finance Report)
`tfn_e_docshub_org`, `itin_norgenic`, `tfn_norgenic`, `ukpa_e_docshub_net`, `aca_e_docshub_com`, `app_taxgov_org`, `abn_norgenic`, `abn_australia`, `utf_taxesonline`, `nzbc_norgenic`, `ein_norgenic`, `norgenic`, `utf_norgenic`. En Orders aparece además `norgenic_sandbox` (tráfico de test, excluir de análisis de negocio).

## `status: pendiente` — 2 sitios sin match en la hoja `MID` de referencia
`nzbc_norgenic` y `app_taxgov_org` no existen en `SheetContext_MID_`. O son sitios nuevos sin dar de alta, o el naming no sigue la convención esperada. Volumen mínimo (<0,1% combinado) — baja prioridad pero sin cerrar.

## Workaround para el AI Analyst (mientras no haya desglose nativo por MID)
El país (`order_geo_country`) es proxy casi exacto del sitio para los 4 principales — ver [[sitios_mid_comparativa]] y [[ai_analyst]].

## Ver también
- [[finance_report]]
- [[orders_report]]
- [[sitios_mid_comparativa]]
