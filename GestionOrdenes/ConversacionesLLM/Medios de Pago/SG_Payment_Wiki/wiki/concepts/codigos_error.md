---
title: Códigos de error (order_error_code)
created: 2026-09-10
updated: 2026-09-10
type: concept
status: parcial
tags: [decline, fraude, causas]
sources: [orders_report, docs.solidgate.com/payments/payments-insights/error-codes]
---

# Códigos de error (order_error_code)

Formato: código interno = categoría×100 + subcódigo (ej. `310` = doc oficial `3.10`). Diccionario oficial: https://docs.solidgate.com/payments/payments-insights/error-codes/

## Pareto global (sobre 27.119 `auth_failed` en `DL-Ordenes.xlsx`)
| Código | % rechazos | Significado | Tipo | Acción recomendada por Solidgate |
|---|---|---|---|---|
| 310 | 28,2% | Suspected fraud | Hard decline | Contactar al emisor |
| 302 | 23,6% | Insufficient funds | Soft decline | Acción del cliente / retry con descuento |
| 1 | 10,8% | General decline | Soft decline | Reintentar 3-4x con demora |
| 501 | 8,3% | 3DS verification failed | Soft decline | Reintentar más tarde |
| 308 | 6,6% | Do not honor | Soft decline | Reintentar 1-2x |
| 304 | 3,5% | Declined by issuer | Soft decline | Reintentar más tarde |
| 206 | 2,5% | Invalid CVV2 | Hard decline | No reintentar — UX del formulario |
| 301 | 2,4% | Card is blocked | Hard decline | Acción del cliente |
| 312 | 2,2% | Closed account | Hard decline | No reintentar |
| 405 | 1,8% | PSP antifraud | Hard decline | Contactar soporte |

**~52,8%** de los rechazos son *soft decline* que Solidgate recomienda reintentar. **~37,1%** son *hard decline* genuino.

## Hallazgo clave: el desglose por sitio no es homogéneo
Ver [[sitios_mid_comparativa]] para el cruce completo. Resumen: `310` está muy concentrado en `itin_norgenic` (24,1% del TOTAL de ese sitio) y `ukpa_e_docshub_net` (28,2% del total) frente a solo 2,4% en `tfn_e_docshub_org`. `ukpa_e_docshub_net` tiene además un bloque propio de fricción 3DS (`501`+`212`+`215` ≈ 25% del total de ese sitio).

## `status: pendiente` — sospecha de mislabeling del código 302
El jefe del usuario indica que Solid Processing (el procesador) tendería a usar `302` como "general decline" genérico en vez de un código más apropiado, inflando artificialmente ese código. Se comprobó la evolución mensual de `302` como % de rechazos en `tfn_e_docshub_org` (donde más pesa): persistentemente entre 25-53% durante todo el periodo, **sin salto temporal que aísle cuándo empezó** → no se puede cuantificar el efecto solo con estos datos. Requiere aclaración directa de Solidgate, o una muestra verificada manualmente.

**Implicación:** la lectura de "`tfn_e_docshub_org` va bien porque su causa dominante (302) es poco accionable" queda en `status: pendiente` de confirmar — si una parte de ese 302 es en realidad "general decline" mal etiquetado, la composición real de causas de ese sitio podría ser distinta.

## `status: bloqueante` — Solidgate se negó a activar reintentos de soft-decline
El jefe del usuario ya pidió esto directamente a Solidgate y fue rechazado. El ~52,8% de rechazos "reintentables según su propia doc" no se puede recuperar vía configuración de Solidgate sin volver a escalar o construir una alternativa propia (retry orquestado desde el lado del comerciante).

## Ver también
- [[sitios_mid_comparativa]]
- [[ratio_aceptacion]]
- [[ai_analyst]] — plan para investigar `310` por país/banco/marca.
