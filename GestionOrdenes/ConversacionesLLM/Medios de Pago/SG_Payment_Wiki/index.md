# Índice — Solidgate: Medios de Pago y Riesgo

> Generado a partir de una conversación de exploración de datos (sept. 2026). Ver `log.md` para el orden cronológico de los hallazgos.

## Entidades
- [[solidgate]] — el gateway de pagos, sus reportes y el AI Analyst. `status: parcial`
- [[finance_report]] — export de financial-entries, histórico may-2025→ago-2026. `status: confirmado`
- [[orders_report]] — export de Card Orders, histórico completo ene-2025→jul-2026 (`DL-Ordenes.xlsx`). `status: confirmado`
- [[ai_analyst]] — feature nueva del Hub (IA conversacional sobre datos de pago). `status: pendiente` (sin probar aún)
- [[stropper]] — sistema interno de control de órdenes; la conciliación con Solidgate sigue bloqueada. `status: bloqueante`

## Conceptos
- [[ratio_aceptacion]] — la métrica objetivo del proyecto. `status: confirmado`
- [[proxy_sale_authfee]] — método para calcular aceptación desde Finance Report sin Orders. `status: confirmado` (validado al 99,99% a escala completa)
- [[codigos_error]] — diccionario de `order_error_code` y el Pareto de causas de rechazo. `status: parcial` (302 bajo sospecha de mislabeling)
- [[mid_descriptor_mapping]] — cómo se infiere el sitio/MID de cada orden sin columna Descriptor explícita. `status: parcial`
- [[powerquery_rutas_relativas]] — patrón para que el Excel con Power Query funcione en cualquier dispositivo/OneDrive/repo clonado sin hardcodear rutas. `status: confirmado`, listo para implementar

## Comparaciones
- [[sitios_mid_comparativa]] — los 4 sitios principales, su ratio, su país dominante y su causa de rechazo dominante. `status: confirmado`

## Fuentes
- Ver `wiki/sources/` — notas de puntero a los documentos y ficheros de datos usados en el análisis.

## Objetivo de negocio (recordatorio)
Optimizar el ratio de aceptación de los medios de pago. Se separó explícitamente en dos preguntas: **medir** (serie temporal fiable — resuelto vía Finance Report/Orders) y **explicar** (causas de rechazo — en curso, ver [[codigos_error]] y [[sitios_mid_comparativa]]).

## Pendientes activos (ver `log.md` para detalle y contexto)
1. Reglas de `orchestration/routing` y `antifraud/rules` del Hub — pedidas al usuario, no recibidas aún.
2. Documento "flujo de pagos actual" — prometido por el usuario, no recibido aún.
3. Aclarar con Solidgate/Solid Processing si `302` se usa como catch-all de "general decline".
4. Decidir si insistir con Solidgate sobre reintentos de soft-decline (ya rechazado una vez) o construir una alternativa propia.
