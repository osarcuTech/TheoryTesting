# Log — Solidgate: Medios de Pago y Riesgo

> Registro cronológico, solo-append. Formato: `## [fecha] acción | asunto`

## [2026-09-10] create | Vault inicializado a partir de conversación de análisis
- Estructura creada con CLAUDE.md, index.md, log.md, wiki/entities, wiki/concepts, wiki/comparisons, wiki/sources.
- Fuente: conversación completa sobre análisis de medios de pago de Solidgate.

## [2026-09-10] ingest | Documentación de contexto de Solidgate (proyecto previo)
- Fuentes: `Contexto_Solidgate_30_04_2026`, `solidgate_context_v02.docx` (v2), `SheetContext_SG_Orders_`, `SheetContext_MID_`, `SheetContext_CalculoManualV€/$/£`, `SolidgateOrdersUpsert` (AppScript).
- Páginas creadas/actualizadas: [[solidgate]], [[stropper]], [[mid_descriptor_mapping]].
- Hallazgo clave: la clave de conciliación Solidgate↔Stropper sigue sin definir → bloqueante para automatizar conciliación cruzada.

## [2026-09-10] query | Primera pregunta sobre medios de pago y fraude
- El usuario pide entender los medios de pago para optimizar el ratio de aceptación.
- Conclusión inicial (con solo documentación, sin datos reales): el histórico `SG_Orders` filtra Status=Settled/Refunded en la exportación → no hay denominador de intentos rechazados. **Esta conclusión se revisó más adelante** (ver entrada del Finance Report).

## [2026-09-10] ingest | Muestra del Finance Report (`_csv_.xlsx`, 510.803 filas)
- Página creada: [[finance_report]].
- Hallazgo: 99,7% de `order_id` generan `AUTHORIZATION_FEE`/`FRAUD_SCREENING_FEE` (cargo por intento), pero solo 45,8% generan `SALE`. Nace la hipótesis del [[proxy_sale_authfee]].
- Anomalía detectada: patrón de 3 registros `SALE` por `order_id` (−X/+X reverso al mismo timestamp), causa desconocida.

## [2026-09-10] query | Cross-validation del proxy con muestra pequeña de Orders (`MuestraOrdenes.xlsx`, 439 filas)
- Resultado: 100% de acierto en 326 órdenes contrastables (326 = SALE↔settle_ok/refunded, NO_SALE↔auth_failed).
- Columnas perfiladas: 11 de 69 columnas vacías al 100% en la muestra; columnas de alto valor identificadas (`order_error_code`, `transaction_authorization_type`, `routing.cascade_number`, `transaction.card.*`); columnas PII marcadas para excluir de cualquier dashboard.

## [2026-09-10] query | Lista de MIDs con movimiento en Finance Report
- Sin columna `Descriptor` explícita en Finance Report → se infiere "sitio" desde `Source.Name` del fichero exportado.
- 13 sitios detectados; 2 (`nzbc_norgenic`, `app_taxgov_org`) no existen en la hoja `MID` de referencia → posible gap de la tabla de referencia.
- Página creada: [[mid_descriptor_mapping]].

## [2026-09-10] create | Documento entregable: Plan_Medios_Pago_y_Riesgo.docx
- Solicitado explícitamente por el usuario. Contiene resumen ejecutivo, lista de investigación priorizada, plan en 4 fases, diario de decisiones.
- Nota: este vault reemplaza/complementa ese docx como formato de contexto para LLM, no lo sustituye como entregable de lectura humana.

## [2026-09-10] discuss | Rutas relativas en Power Query
- Dos iteraciones: (1) parámetro con ruta absoluta hardcodeada — descartado, no portable; (2) ruta derivada de `CELL("filename")` — descartado, escribe en el archivo y genera commits innecesarios; (3) **solución adoptada**: tabla `EntornosRaiz` (fila por dispositivo/persona) + consulta "solo conexión" que prueba cada raíz contra un fichero centinela y devuelve la primera que resuelve, sin persistir nada en el workbook.
- Página creada: [[powerquery_rutas_relativas]].

## [2026-09-10] ingest | Histórico completo de Finance Report (`AppendDisputas_-_copia_-_copia.xlsx`, 510.803 filas, tipado limpio)
- Confirma cifras del proxy sin el ruido de coma decimal del CSV.
- Cuantificado el patrón de 3 SALE: 16.848 de 51.504 órdenes (32,7%), sin punto de corte temporal único — recurrente en decenas de fechas distintas. Causa aún desconocida.

## [2026-09-10] query | Definición del objetivo estadístico — 3 opciones planteadas, se elige C (híbrido)
- A) proxy solo; B) migrar todo a Card Orders; C) proxy + validación cruzada con muestra de Card Orders. **Elegida: C.**

## [2026-09-10] ingest | Histórico completo de Orders (`DL-Ordenes.xlsx`, 76.115 filas, ene-2025→jul-2026, 28 columnas)
- Página actualizada: [[orders_report]].
- Proxy validado a escala completa: 49.542/49.549 coincidencias (99,99%).
- Ratio de aceptación real (ya no proxy): **64,4% global**.
- Ratio por sitio calculado — ver [[sitios_mid_comparativa]].
- Pareto de `order_error_code` obtenido (sin diccionario todavía en este punto).

## [2026-09-10] ingest | Diccionario oficial de error codes (docs.solidgate.com)
- Página actualizada: [[codigos_error]].
- Decodificados los 10 códigos principales (310, 302, 1, 501, 308, 304, 206, 301, 312, 405).
- Hallazgo clave: ~52,8% de los rechazos son "soft decline" que Solidgate recomienda reintentar; ~37,1% son "hard decline" genuino.
- Hallazgo clave 2 (tras cruce por sitio): `310` (suspected fraud) concentrado en `itin_norgenic` (24,1% del total) y `ukpa_e_docshub_net` (28,2% del total) vs. 2,4% en `tfn_e_docshub_org`. `ukpa_e_docshub_net` tiene además un problema propio de 3DS (`501`+`212`+`215` ≈ 25% del total).

## [2026-09-10] update | Contexto del usuario: migración ITIN a Addonpayments + reticencia de Solidgate a reintentos + sospecha de mislabeling del 302
- `itin_norgenic` migró de Solidgate a Addonpayments por cambio de dominio (explica caída de volumen desde abril 2026, NO explica el ratio bajo — el ratio ~44% era estable desde mucho antes de la migración).
- El jefe del usuario ya pidió a Solidgate activar reintentos de soft-decline; **Solidgate se negó**. Esto reclasifica el punto de "confirmar si hay retry activo" a "ya sabemos que está bloqueado, evaluar alternativas".
- Solid Processing (el procesador) tendería a usar `302` como "general decline" genérico, inflando ese código — **hipótesis sin cuantificar**, sin salto temporal claro en los datos que la aísle. Afecta sobre todo a la lectura de `tfn_e_docshub_org`, donde `302` es el código dominante.

## [2026-09-10] query | Cruce de error codes por sitio (`site x error_code`)
- Confirma que los 4 sitios tienen perfiles de rechazo distintos, no el mismo problema a distinta escala.
- Página creada: [[sitios_mid_comparativa]] (actualizada con el desglose de causas).

## [2026-09-10] request | Acceso pedido a `hub.solidgate.com/orchestration/routing` y `hub.solidgate.com/antifraud/rules`
- No accesible por fetch (requiere sesión). Pendiente de que el usuario comparta capturas/export.
- Hipótesis a probar con esos datos: ¿el routing/antifraud por MID explica la concentración de `310` en `itin_norgenic`/`ukpa_e_docshub_net`?

## [2026-09-10] discuss | Plan de preguntas para el AI Analyst de Solidgate (Hub)
- Limitación detectada: la versión actual del AI Analyst **no** desglosa por MID (llega en versión futura).
- Workaround encontrado: el país (`order_geo_country`) es un proxy casi perfecto del sitio — `tfn_e_docshub_org`/`tfn_norgenic`≈AUS (92-93%), `itin_norgenic`≈USA (82%), `ukpa_e_docshub_net`≈GBR (99%).
- Plan de preguntas diseñado usando país como filtro sustituto de MID (ver [[ai_analyst]]).
