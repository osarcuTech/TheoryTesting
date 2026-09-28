---
title: AI Analyst (Solidgate Hub)
created: 2026-09-10
updated: 2026-09-10
type: entity
status: pendiente
tags: [solidgate, hub, ia, sin-probar]
sources: [email Solidgate Team, capturas de pantalla del anuncio]
---

# AI Analyst

Feature nueva anunciada por Solidgate: interfaz conversacional en el Hub para consultar datos de pago en lenguaje natural. **El usuario aún no lo ha probado** (pendiente de acceso/rol Merchant Admin o Analyst).

## Qué promete cubrir (según el anuncio)
- Payments: acceptance rate y decline breakdown por country, payment method, card brand, provider.
- Compliance: chargeback (CHB) rate, fraud rate, VAMP score, refund rate.
- User retention: suscripciones activas, MRR, cancelaciones.

## Limitación importante detectada
**La versión actual NO desglosa por MID ni por cascade step** — eso llega en una versión futura, según el propio anuncio.

## Workaround diseñado: país como proxy de sitio/MID
Mientras no haya desglose por MID, se puede usar `country` como filtro sustituto casi exacto, porque cada sitio principal tiene una concentración geográfica dominante (ver [[sitios_mid_comparativa]]):
- `tfn_e_docshub_org` / `tfn_norgenic` ≈ AUS (92-93%)
- `itin_norgenic` ≈ USA (82%)
- `ukpa_e_docshub_net` ≈ GBR (99%)

## Plan de preguntas propuesto (pendiente de ejecutar)
1. Validar el proxy: pedir volumen por país y comparar contra las cifras propias.
2. `310` (suspected fraud): decline breakdown para USA y GBR, comparado contra AUS. Si permite cruzar por card brand/bank, hacerlo — es la pregunta más valiosa pendiente.
3. 3DS en GBR (`ukpa_e_docshub_net`): tasa de éxito de 3DS por país, comparar GBR vs AUS.
4. Contrastar (no puede resolver del todo) el peso relativo de `302` por país frente al mislabeling sospechado — ver [[codigos_error]].
5. VAMP score y fraud/chargeback/refund rate por país — dato que faltaba desde el contexto original del proyecto (control del VAMP mencionado en `SheetContext_SG_Orders_`).

## Ver también
- [[solidgate]]
- [[codigos_error]]
