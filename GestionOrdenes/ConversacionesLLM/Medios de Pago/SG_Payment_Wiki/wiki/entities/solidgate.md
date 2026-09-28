---
title: Solidgate
created: 2026-09-10
updated: 2026-09-10
type: entity
status: parcial
tags: [gateway, pagos, proveedor]
sources: [Contexto_Solidgate_30_04_2026, solidgate_context_v02.docx]
---

# Solidgate

Procesador/gateway de pagos principal. Registra y liquida órdenes independientemente del banco adquirente subyacente (Checkout, Adyen, Revolut...). Emite settlements semanales en PDF.

## Acceso
Exclusivo vía Solidgate Hub (`hub.solidgate.com`). Sin API de Reports ni webhooks activos actualmente → extracción manual vía CSV/PDF.

## Reportes usados
- Ver [[finance_report]] — `/finances/financial-entries`.
- Ver [[orders_report]] — Card Orders.
- `/fraud-prevention/alerts` — marcado "sin valor" en la documentación previa del proyecto, **sin confirmar si se evaluó para el objetivo de fraude/aceptación actual** (pendiente).
- `/payments/fraud-notifications` — igual, sin valor confirmado, mismo pendiente.

## Conectores/proveedores observados
Checkout, Adyen, Revolut, Solidgate (fees internos), Solidgate Acquiring. **Addonpayments** aparece mencionado como acquirer subyacente en la documentación original pero no como `provider` en los exports — desde 2026 es además el destino de la migración de `itin_norgenic` (ver [[sitios_mid_comparativa]]).

## Interacción con el usuario/negocio
- El jefe del usuario pidió a Solidgate activar reintentos automáticos de soft-decline → **Solidgate se negó**. Este es un hecho de negocio, no solo técnico: cualquier plan de mejora del ratio que dependa de retry debe asumir que Solidgate no lo hará del lado suyo.
- Posible inconsistencia de etiquetado: el procesador subyacente (Solid Processing) tendería a marcar declines genéricos con el código `3.02` (Insufficient funds) en vez de un código más genérico. Ver [[codigos_error]] — `status: pendiente`, sin cuantificar.

## Ver también
- [[ai_analyst]] — nueva feature de IA en el Hub, sin probar aún por el usuario.
- [[mid_descriptor_mapping]]
