---
title: Comparativa de sitios/MID
created: 2026-09-10
updated: 2026-09-10
type: comparison
status: confirmado
tags: [sitios, mid, ratio-aceptacion, error-codes]
sources: [orders_report — DL-Ordenes.xlsx]
---

# Comparativa de sitios/MID

Datos: `DL-Ordenes.xlsx`, may-2025→jul-2026 (excluye placeholders ene-abr 2025). Ver metodología de mapeo en [[mid_descriptor_mapping]].

| Sitio | País dominante | Vol. total | % Aceptación | Causa dominante | % del total del sitio |
|---|---|---|---|---|---|
| `tfn_e_docshub_org` | AUS (92%) | 43.085 | **75,7%** | 302 (Insufficient funds — *status: pendiente de confirmar, sospecha de mislabeling*) | 8,7% |
| `tfn_norgenic` | AUS (93%) | 9.866 | 60,1% | 310 (Suspected fraud) | 10,9% |
| `itin_norgenic` | **USA (82%)** | 17.018 | **44,5%** | **310 (Suspected fraud)** | **24,1%** |
| `ukpa_e_docshub_net` | **GBR (99%)** | 5.079 | **38,4%** (el peor) | **310 (28,2%) + 501/3DS (17,8%)** | **~46% combinado** |
| `norgenic_sandbox` | — | 748 | 92,6% | — | tráfico de test, excluir de conclusiones de negocio |

## Lectura principal
No es el mismo problema a distinta escala — son **problemas distintos por sitio**:
- `tfn_e_docshub_org` (mejor): perfil "normal", dominado por fondos insuficientes (con la reserva del mislabeling de 302).
- `itin_norgenic` y `ukpa_e_docshub_net` (peores): dominados por `310` (fraude sospechado) a un nivel 10-12x superior al mejor sitio. No es ruido — apunta a que el banco emisor trata el tráfico de estos dos sitios como sospechoso de forma sistemática.
- `ukpa_e_docshub_net` tiene además un problema **propio y distinto**: fricción de 3DS (~25% del total), potencialmente arreglable del lado de la implementación del checkout (según recomendaciones de Solidgate para esos códigos), no del banco.

## Nota sobre volumen (fuera de foco por decisión del usuario)
`itin_norgenic` sufrió una caída de volumen desde abril 2026 por migración a Addonpayments (cambio de dominio) — **esto NO afecta al ratio de aceptación**, que era estable (~38-48%) desde mucho antes de la migración. El usuario pidió explícitamente no mezclar causas de volumen con el análisis de ratio.

## Pendiente para profundizar
- Cruzar `310` por `card_brand`/`bank` — no disponible en el export de 28 columnas usado aquí, requeriría la extracción con las columnas de la muestra de 69 (`transaction.card.*`).
- Reglas de `orchestration/routing` y `antifraud/rules` del Hub (pedidas al usuario, no recibidas) — candidato más directo para explicar por qué `310` se concentra en estos 2 sitios.

## Ver también
- [[codigos_error]]
- [[ratio_aceptacion]]
- [[ai_analyst]] — plan de preguntas usando país como proxy de sitio.
