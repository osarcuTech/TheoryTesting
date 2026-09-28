# LLM Wiki — Schema (proyecto: Solidgate — Medios de Pago y Riesgo)

## Capas
- `wiki/sources/` — notas de puntero a las fuentes originales (no son copias; ver `location` en el frontmatter). Nunca editar el contenido citado, solo la nota que lo resume.
- `wiki/entities/` — sistemas, empresas, reportes y herramientas concretas (Solidgate, Finance Report, Orders Report, AI Analyst...).
- `wiki/concepts/` — ideas transversales, métricas y metodologías (ratio de aceptación, el proxy de validación, el patrón de rutas relativas de Power Query...).
- `wiki/comparisons/` — tablas comparativas entre entidades del mismo tipo (sitios/MID).
- `index.md` — catálogo con una línea de resumen por página.
- `log.md` — registro cronológico, solo-append. Una entrada por hito de la conversación.

## Frontmatter estándar
```yaml
---
title: Título de la página
created: 2026-09-10
updated: 2026-09-10
type: entity | concept | comparison | source
status: confirmado | parcial | pendiente | bloqueante
tags: []
sources: []
---
```

## Reglas
- Toda cifra o hallazgo debe indicar de qué fichero/consulta sale (Finance Report `AppendDisputas_-_copia_-_copia.xlsx` vs Orders `DL-Ordenes.xlsx`) — son dos fuentes distintas con coberturas ligeramente distintas.
- `status: bloqueante` se usa para lo que impide avanzar (ej. clave de conciliación Solidgate↔Stropper).
- `status: pendiente` para hipótesis sin validar (ej. mislabeling del código 302).
- Enlazar entre páginas con `[[wikilink]]` (compatible Obsidian).
- Este vault es append-only por hito: al añadir información nueva, no se reescribe una conclusión ya validada — se añade una nota de actualización con fecha y se enlaza a la página afectada.

## Workflows sugeridos para el LLM que continúe este trabajo
- `/ingest` — cuando llegue un fichero/dato nuevo (ej. el documento de "flujo de pagos actual", las reglas de antifraude/routing del Hub): leerlo, actualizar la(s) página(s) de `wiki/` afectadas, añadir entrada a `log.md`.
- `/query` — para responder preguntas del usuario, leer primero `index.md` y las páginas de `wiki/` relevantes antes que fuentes crudas.
- `/lint` — revisar que no haya conclusiones contradictorias entre páginas sin marcar `status: pendiente` o una nota explicando el conflicto.
