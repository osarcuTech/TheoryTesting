---
title: Rutas relativas/portables en Power Query
created: 2026-09-10
updated: 2026-09-10
type: concept
status: confirmado
tags: [power-query, onedrive, git, portabilidad]
sources: [conversación — diseño iterativo]
---

# Rutas relativas/portables en Power Query

Problema original: las consultas de Power Query en Excel tenían rutas de carpeta hardcodeadas (ej. `C:\Users\Oscar Ardevol\Downloads\...`), rompiendo el refresco al mover el archivo a otro dispositivo/OneDrive/repo clonado.

## Iteraciones descartadas
1. **Parámetro con ruta absoluta fija** — funciona pero sigue atado a una sola máquina; solo resuelve el caso de mover carpetas dentro del mismo dispositivo.
2. **`CELL("filename")` en una celda nombrada** leída desde Power Query vía `Excel.CurrentWorkbook()` — resuelve la portabilidad, pero **el valor se escribe en el propio archivo**, generando un diff/commit innecesario cada vez que se abre en un dispositivo distinto. Descartado por el usuario explícitamente por este motivo.

## Solución adoptada
1. Tabla de Excel `EntornosRaiz` (columnas `Entorno`, `RutaRaiz`) — una fila por dispositivo/persona que clona el repo. Solo cambia cuando se añade un entorno nuevo (commit intencional, no automático).
2. Fichero centinela pequeño y estable (ej. `RawData\_ruta_ok.txt`) que viaja junto a los datos reales, usado solo para probar si una raíz "resuelve" sin depender de nombres de CSV que cambian en cada exportación.
3. Consulta `RutaBaseActiva`, marcada **solo conexión** (nunca se carga a una celda, por lo que nunca se persiste en el archivo): prueba cada `RutaRaiz` de la tabla contra el centinela con `try...otherwise null`, y devuelve la primera que funciona. Si ninguna resuelve, lanza un `error Error.Record(...)` explícito pidiendo añadir una fila nueva.
4. `pCarpetaBase = RutaBaseActiva & pRutaRelativa` — el resto de las consultas de origen (Finance, Disputes, Alertas, Orders) referencian `pCarpetaBase` en vez de una ruta fija.

## Por qué evita el problema original
La consulta que resuelve la raíz activa no se carga a ninguna celda → cero bytes del `.xlsx` cambian solo por abrirlo en un dispositivo distinto. La tabla `EntornosRaiz` sí vive en el archivo, pero solo cambia por decisión explícita (añadir un entorno), no en cada apertura.

## Pendiente/no resuelto
- Los nombres de fichero de exportación (`fin_080426_085523_...csv`) llevan timestamp → cambian en cada reexportación, obligando a editar el nombre a mano en cada refresco (problema distinto al de la ruta de carpeta, más recurrente). Propuesta pendiente de implementar: sustituir `File.Contents("...nombre exacto...")` por `Folder.Files(pCarpetaBase)` filtrado por prefijo + quedarse con el más reciente.
- Advertencia: `CELL("filename")` no aplica aquí (se descartó), pero si en el futuro se reintroduce algo similar, recordar que solo funciona con Excel de escritorio sobre ruta de sistema de archivos local, no en Excel Online.

## Ver también
- [[solidgate]] (el AppScript de Google Sheets tiene un problema análogo: siempre coge "el primer Sheets que encuentre en la carpeta Drive" — mismo patrón de fragilidad por convención implícita, no resuelto en Power Query pero documentado en `SolidgateOrdersUpsert`).
