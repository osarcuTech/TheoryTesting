---
title: Ratio de aceptación
created: 2026-09-10
updated: 2026-09-10
type: concept
status: confirmado
tags: [metrica, objetivo-negocio]
sources: [orders_report, finance_report]
---

# Ratio de aceptación

Métrica objetivo del proyecto: `órdenes aceptadas / (aceptadas + rechazadas)`. El objetivo de negocio es optimizarla, lo que se descompuso en dos preguntas separadas: **medir** (serie temporal fiable) y **explicar** (causas de rechazo, ver [[codigos_error]]).

## Cifra global confirmada (con datos reales de [[orders_report]], `DL-Ordenes.xlsx`)
**64,4% de aceptación global** (48.996 de 76.115 órdenes, sumando `settle_ok`+`refunded`+`auth_ok`), periodo may-2025→jul-2026.

## Por qué antes se pensó que no se podía calcular
El histórico legacy `SG_Orders` (AppScript upsert) solo exporta Status=Settled/Refunded → sin denominador de intentos. Esto se resolvió con el [[proxy_sale_authfee]] primero, y confirmó/reemplazó después con `order_status` real del [[orders_report]].

## Por decisión explícita del usuario (sept. 2026)
**No mezclar con causas de caída de volumen** (marketing, hackeos, migración de proveedor) — el foco es exclusivamente el ratio (%), no el volumen absoluto. Ver entrada de `log.md` correspondiente.

## Ver también
- [[sitios_mid_comparativa]] — desglose del ratio por sitio.
- [[proxy_sale_authfee]]
- [[codigos_error]]
