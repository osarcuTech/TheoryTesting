---
title: Stropper / Old-Stropper
created: 2026-09-10
updated: 2026-09-10
type: entity
status: bloqueante
tags: [sistema-interno, conciliacion]
sources: [Contexto_Solidgate_30_04_2026]
---

# Stropper / Old-Stropper

Sistema interno propio (GUI/web con backend propio) de gestión y control de órdenes entrantes. Debe coincidir con lo registrado en Solidgate — es la base de la conciliación principal del proyecto original (dashboard financiero).

`Old-Stropper` es el sistema legacy que cubre órdenes cobradas por bancos externos no integrados en Solidgate — volumen casi nulo, fuera de scope.

## Bloqueante activo
**No existe clave de unión definida entre Solidgate y Stropper.** Es la dependencia más importante sin resolver del proyecto original — bloquea la automatización de la conciliación cruzada. No se ha tocado directamente en la parte de la conversación centrada en medios de pago/fraude, pero sigue abierto.

## Ver también
- [[solidgate]]
