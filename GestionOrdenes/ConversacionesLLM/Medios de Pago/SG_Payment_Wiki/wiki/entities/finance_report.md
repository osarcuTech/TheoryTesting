---
title: Finance Report (financial-entries)
created: 2026-09-10
updated: 2026-09-10
type: entity
status: confirmado
tags: [solidgate, dataset, finanzas]
sources: [_csv_.xlsx (muestra CSV cruda), AppendDisputas_-_copia_-_copia.xlsx (histórico completo tipado), Export_Report_Finances]
---

# Finance Report

Export de `/finances/financial-entries` de Solidgate. Ledger de movimientos financieros: ventas, refunds, chargebacks, RDR y **fees por intento** (AUTHORIZATION_FEE, FRAUD_SCREENING_FEE, THREE_D_SECURE_FEE).

## Cobertura
- 510.803 filas, 51.504 `order_id` únicos.
- Rango: may-2025 → ago-2026, repartido en 79 ficheros mensuales por sitio (`Source.Name`).
- **No tiene columna `Descriptor`/MID explícita** — se infiere vía `Source.Name` (ver [[mid_descriptor_mapping]]).
- No tiene `order_status` ni `order_error_code` — solo `record_type_key`.

## Problema de formato conocido
El CSV crudo (`_csv_.xlsx`) tiene los decimales rotos por uso de coma como separador decimal, generando entre 29-34 tokens por fila en vez de 28 fijos. Se resolvió extrayendo los últimos 12 campos por posición (son siempre texto/categóricos, estables). La versión `AppendDisputas_-_copia_-_copia.xlsx` ya viene tipada correctamente — preferir esta para cualquier análisis futuro.

## Uso principal: base del [[proxy_sale_authfee]]
`AUTHORIZATION_FEE` (y `FRAUD_SCREENING_FEE`) se cobra por intento, casi independientemente del resultado (99,7% de order_id lo tienen). `SALE` solo aparece si la orden se liquida. La ausencia de `SALE` con presencia de `AUTHORIZATION_FEE` es un proxy validado de rechazo (ver [[proxy_sale_authfee]]).

## Anomalía sin resolver
32,7% de los `order_id` (16.848 de 51.504) tienen exactamente 3 registros `SALE`: la venta original + un par reverso/recreación (−X/+X) al mismo importe y timestamp, horas/días después. Efecto neto económico = 0€, pero infla cualquier conteo de filas `SALE` sin agrupar por `order_id`. Aparece repartido en decenas de fechas distintas — no es un evento puntual. **Causa desconocida.**

## Campos categóricos confirmados con datos reales
`payment_method` ≈100% `card`. `card_brand`: MASTERCARD (53,6%), VISA (45,5%), AMEX (0,7%). `geo_country` vs `issuing_country` disponibles y distintos entre sí (útil para mismatch geográfico). `provider`: Checkout, Solidgate, Revolut, Solidgate Acquiring, Adyen (residual).

## Ver también
- [[orders_report]] — complementario, tiene `order_status`/`order_error_code` que Finance Report no tiene.
- [[ratio_aceptacion]]
