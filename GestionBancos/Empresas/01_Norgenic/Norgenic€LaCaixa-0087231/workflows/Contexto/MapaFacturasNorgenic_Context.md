---
title: MapaFacturasNorgenic
tags:
  - n8n
  - facturas
  - Norgenic
component: workflow
related:
  - "[[N_Caixa_€-BD_Facturas_B2]]"
  - "[[wf_C2_ComprobFras_Context]]"
---

# MapaFacturasNorgenic

## Objetivo

Mantiene en [[N_Caixa_€-BD_Facturas_B2]] las referencias de Drive que permiten localizar cada factura: su archivo y carpeta en el árbol de facturas enviadas de Norgenic, y su archivo y ubicación en ViaTribut (VT), incluyendo si está en **Enviadas** o **Contabilizadas**.

El workflow cumple una función de registro y localización, relacionada con el seguimiento de [[wf_C2_ComprobFras_Context]], pero no reproduce sus alertas ni sus comparaciones de discrepancias. Trabaja sobre una hoja de menor tamaño para reducir el tiempo de lectura y escritura frente a la base de facturas completa.

## Fuentes y destino

| Recurso | Uso |
|---|---|
| [[N_Caixa_€-BD_Facturas_B2]] — Spreadsheet ID `1e32wr8Lx5e-P6uGApQDnXFxnIQyijgGX6QAITRPZLKI`, GID `707381639` | Lee las filas y escribe las referencias encontradas en las mismas filas. |
| Google Drive: carpeta de facturas de Norgenic | Busca las facturas dentro de la jerarquía de año, mes y carpeta enviada a VT. |
| Google Drive: carpetas VT **Enviadas** y **Contabilizadas** | Busca las copias/documentos por año, mes y carpeta de estado. |

Los IDs de Spreadsheet, hoja y carpetas raíz se definen en el nodo **Edit Fields** del JSON del workflow.

## Inicio y alcance temporal

Tiene dos entradas: ejecución manual mediante **When clicking ‘Test workflow’** y ejecución desde otro workflow mediante **When Executed by Another Workflow**. El JSON no contiene un disparador Schedule.

Las ramas de Drive seleccionan carpetas de año/mes mediante condiciones basadas en la fecha de ejecución. Se contemplan el año actual y el anterior según el mes, y se filtran los meses recientes; en algunas ramas existe además una condición especial para los meses finales del año. Por tanto, el workflow no explora indiscriminadamente todo el histórico. Si una factura antigua no se localiza, hay que comprobar si su año y mes pasan estos filtros.

## Funcionamiento

1. **Lee la base compacta.** **Google Sheets1** obtiene las filas de la hoja configurada. **Edit Fields BD_Fras** conserva el número de fila y los datos existentes necesarios para comparar: `UID`, `Id_Fra_Norgenic`, `Id_Carpeta_Norgenic` y `Estado_Carpeta`. El UID se normaliza como `name_Fra`, clave usada en los cruces.
2. **Busca los archivos de Norgenic.** Recorre el árbol de año/mes de la carpeta de Norgenic y lista los archivos de la carpeta de envío a VT. Normaliza sus nombres quitando el prefijo `Copia de ` y construye la ubicación relativa año/mes/carpeta.
3. **Completa los datos de Norgenic que faltan.** Solo pasan a esta búsqueda las filas cuyo `Id_Carpeta_Norgenic` está vacío. El nodo **Merge2** combina esas filas con los archivos encontrados usando `name_Fra` y coincidencia difusa. Las coincidencias actualizan los datos de Norgenic en la hoja.
4. **Busca los documentos de VT.** Explora las ramas de carpetas **Enviadas** y **Contabilizadas** de VT. Para cada archivo conserva su ID de Drive, la carpeta y el año, elimina `Copia de ` del nombre y etiqueta el estado (`Enviadas` o `Contabilizadas`).
5. **Actualiza el estado/ubicación de VT.** Solo se cruzan con los archivos de VT las filas cuyo `Estado_Carpeta` no sea `Contabilizadas` ni `N/A`. **Merge** combina ambos conjuntos por `name_Fra` con coincidencia difusa y actualiza las coincidencias en la hoja.

## Datos que escribe

Las actualizaciones se hacen usando `row_number` como columna de coincidencia; no se crea una fila nueva.

| Columna de la hoja | Procedencia |
|---|---|
| `Id_Fra_Norgenic` | ID del archivo de factura encontrado en Drive. |
| `Id_Carpeta_Norgenic` | ID de la carpeta que contiene el archivo de Norgenic. |
| `Nombre_Carpeta_Norgenic` | Ruta de carpetas de Norgenic (año/mes/carpeta de envío). |
| `Id_Fra_VT` | ID del archivo de factura localizado en VT. |
| `Id_Carpeta_VT` | ID de la carpeta de VT donde está el archivo. |
| `Año_Carpeta` | Nombre de la carpeta de año de VT. |
| `Nombre_Carpeta` | Nombre/ruta de la carpeta de VT que contiene el archivo. |
| `Estado_Carpeta` | `Enviadas` o `Contabilizadas`, según la rama de Drive coincidente. |
| `n8n` | Se escribe `TRUE` al registrar una coincidencia de VT. |

El workflow actualiza los datos de Norgenic y VT por separado. Los campos no incluidos en la actualización de cada rama no se modifican mediante ese nodo.

## Consideraciones y límites

- La coincidencia entre archivos y UID es difusa, no una comparación estricta de IDs. Conviene revisar manualmente posibles nombres ambiguos o muy similares.
- El registro de Norgenic solo se busca en filas sin `Id_Carpeta_Norgenic`; una referencia ya informada no se vuelve a comprobar en esa rama.
- La búsqueda de VT excluye filas con estado `Contabilizadas` y `N/A`; una factura con esos estados no se vuelve a actualizar por esta rama.
- Los nodos **Compare Datasets** y **Compare Datasets1** aparecen en el JSON, pero no tienen salidas conectadas a las escrituras. No son la vía que registra los resultados descritos.
- No se observan nodos de correo ni alertas en este workflow.
- El rendimiento depende del tamaño de la hoja configurada y del volumen de carpetas/archivos que pasen los filtros temporales.

## Referencias técnicas

- Definición exportada de n8n: [[MapaFacturasNorgenic]].
- Hoja de destino y descripción de su tamaño/rendimiento: [[N_Caixa_€-BD_Facturas_B2]].
- Workflow previo de seguimiento/comprobación: [[wf_C2_ComprobFras_Context]].

---

**Última actualización**: 2026-10-14  
**Estado**: Activo  
**Impacto**: ⭐⭐⭐ (Alto)
