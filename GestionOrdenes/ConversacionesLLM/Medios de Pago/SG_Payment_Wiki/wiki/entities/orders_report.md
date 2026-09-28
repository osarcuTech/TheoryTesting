---
title: Orders Report (Card Orders)
created: 2026-09-10
updated: 2026-09-10
type: entity
status: confirmado
tags: [solidgate, dataset, ordenes]
sources: [MuestraOrdenes.xlsx (muestra 69 columnas, 439 filas), DL-Ordenes.xlsx (histórico completo, 28 columnas, 76.115 filas)]
---

# Orders Report (Card Orders)

Export de Card Orders de Solidgate. A diferencia del [[finance_report]], SÍ trae `order_status` explícito (incl. `auth_failed`) y `order_error_code`.

## Dos versiones usadas en este proyecto
1. **`MuestraOrdenes.xlsx`** — 439 filas, 69 columnas, dic-2025→jun-2026, no continua/aleatoria. Se usó para **validar** el [[proxy_sale_authfee]] (100% de acierto en 326 órdenes contrastables) y para perfilar qué columnas de las 69 aportan valor.
2. **`DL-Ordenes.xlsx`** — histórico completo, 76.115 filas, ene-2025→jul-2026 (ene-abr 2025 son solo placeholders de arquitectura, sin datos reales), **solo 28 columnas** (subset reducido — sin `transaction_authorization_type`, `transaction.card.brand/bank/country`, `routing.cascade_number` que sí traía la muestra de 69). Se usó para calcular el **ratio de aceptación real** (ya no proxy) y el Pareto de `order_error_code`.

## Columnas de valor confirmadas (de la muestra de 69)
`order_status`, `order_error_code`, `transaction_authorization_type` (3DS), `routing.cascade_number`, `transaction.card.brand/bank/country/type`, `order_geo_country`, `mid`/`routing.mid_descriptor`.

## Columnas sin valor / a excluir
11 columnas 100% vacías en la muestra: `order_customer_account_id`, `order_fraudulent`, `traffic_source`, `order_metadata`, `payment_type`, `subscription_id`, `product_id`, `product_name`, `product_type`, `original_payment_method`, `routing.connector_account_id`. `order_platform` casi constante (`WEB`).

## PII presente — excluir de cualquier histórico/dashboard consolidado
`order_customer_email`, `first_name`, `last_name`, `order_ip_address`, `transaction_card_holder`, `transaction_billing_details.*`, `transaction.card.number`.

## Hallazgo clave: `mid` es un UUID, no el Descriptor legible
`DL-Ordenes.xlsx` trae `mid` como UUID (17 valores distintos). Se cruzó con el sitio derivado de `Source.Name` (ver [[mid_descriptor_mapping]]) para obtener una etiqueta legible por UUID.

## Resultados de aceptación real (no proxy)
Ver [[ratio_aceptacion]] y [[sitios_mid_comparativa]] para las cifras desglosadas.

## Ver también
- [[finance_report]]
- [[codigos_error]]
