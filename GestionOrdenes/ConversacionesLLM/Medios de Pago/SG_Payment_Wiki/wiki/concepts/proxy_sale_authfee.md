---
title: Proxy SALE/AUTHORIZATION_FEE
created: 2026-09-10
updated: 2026-09-10
type: concept
status: confirmado
tags: [metodologia, validacion]
sources: [finance_report, orders_report]
---

# Proxy SALE/AUTHORIZATION_FEE

Método para estimar el ratio de aceptación usando solo el [[finance_report]] (que no tiene `order_status`), aprovechando que `AUTHORIZATION_FEE`/`FRAUD_SCREENING_FEE` se cobran por intento casi independientemente del resultado.

## Fórmula
`proxy_aceptado = tiene registro SALE` / `tiene AUTHORIZATION_FEE o SALE`

## Validación (2 rondas)
1. **Muestra pequeña** (`MuestraOrdenes.xlsx`, 326 órdenes contrastables): 100% de acierto.
2. **Escala completa** (`DL-Ordenes.xlsx` cruzado contra `AppendDisputas_-_copia_-_copia.xlsx`, 49.549 órdenes contrastables): **99,99% de acierto** (49.542/49.549). Las 7 discrepancias son `refunded` sin `SALE` en Finance — residual.

## Limitación conocida
776 de 50.325 order_id del Orders histórico no aparecen en absoluto en Finance Report (ni SALE ni AUTHORIZATION_FEE) — 385 `auth_failed`, 328 `settle_ok`, 21 `auth_ok`, 6 `refunded`. **No es un patrón sistemático de "cierto rechazo no genera fee"** (se pensó eso con la muestra pequeña, se corrigió con la escala completa) — es más probablemente un gap de cobertura entre ambos exports, aunque el usuario confirmó que el rango de fechas es el mismo (ene-abr 2025 son solo placeholder en Orders). **Sin resolver del todo, impacto marginal (~1,5%).**

## Estado actual de uso
Ya no es estrictamente necesario para el ratio global — con `DL-Ordenes.xlsx` completo hay `order_status` real. Sigue siendo útil como método de contraste/QA entre ambos datasets.

## Ver también
- [[ratio_aceptacion]]
- [[finance_report]]
- [[orders_report]]
