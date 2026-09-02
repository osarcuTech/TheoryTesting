
/
GestiónBancos
GestiónBancos

¿Cómo puedo ayudarle hoy?




Recientes
Optimizar rendimiento de scripts de Google Sheets
hace 9 minutos
Arquit&Archivado_Movimientos
hace 35 minutos
KPI's
hace 40 minutos
Err_Cashflow_Norgenic
hace 41 minutos
Cebollón.gs
hace 44 minutos
ReenvioFras.gs
hace 44 minutos
ImportMov.py
hace 1 hora
TipsDocumentaciónBancaria
hace 1 hora
Instrucciones
Eres un experto en programación (principalmente: Python, JavaScript/TypeScript/AppScript), tratamiento de datos (ej: n8n, xlwings, sql, ...) y en fin-tech. Misión principal de este proyecto: Montar en GoogleSheets (sistema actual pero no necesariamente el final) una "GUI" para llevar el seguimiento de forma visual de forma sencilla. Valoramos la posibilidad de usar otras herramientas (ej: SQL, DataVisualization, ...) para facilitar el tratamiento y visualización de datos. Misiones secundarias es tener un registro/contexto de la lógica (ej: scripts, formulas, bd's, relaciones, ...) de los "documentos", sus objetivos, ...

Contexto
2% de la capacidad del proyecto utilizada

ScriptImportaciónBancaria_N€[https:
1 elemento


Informe_Sesion_ProcesarLoteBancos_2026-07-21 (1).docx
52,1kB

docx




Informe_Sesion_ProcesarLoteBancos_2026-07-21.docx
52,1kB

docx




Informe_C0_alternativas.docx
8,4kB

docx




ContextoHoja.txt
44,8kB

txt




Arquitectura y Flujo de datos V3.1.docx
44,2kB

docx



arquitecturadatospersonal.pdf
pdf



Informe_Sesion_ProcesarLoteBancos_2026-07-21.docx
**Informe de sesión — Optimización de rendimiento**
 
*Script procesarLoteBancos (Apps Script) — Proyecto Arquitectura y Flujo de Datos*
 
**VERSIÓN 2 — actualizado con la continuación de la sesión (secciones 11-15)**
 
**Fecha de la sesión: **21 de julio de 2026
 
**Documento asociado: **01_ImportarMovimientos / A2_AsignacionDeGastos — Arquitectura y Flujo de Datos V3.1
 
**Objetivo del documento: **Servir de contexto completo y autocontenido para retomar este tema (por ti o por otro chat/LLM) sin perder el razonamiento seguido, las decisiones tomadas y por qué se tomaron.
 
## Índice
 
- 1. Resumen ejecutivo
 
- 2. Contexto: qué hace el script y por qué existe
 
- 3. Glosario de variables globales
 
- 4. Problema 1 — Shadowing de "sheet_Mov" (bloqueo total)
 
- 5. Problema 2 — Correspondencia de columnas incompleta
 
- 6. Problema 3 — Rendimiento: de 9 minutos a segundos
 
- 7. Hipótesis del usuario y su validación empírica
 
- 8. Estado actual del código
 
- 9. Pendientes y próximos pasos
 
- 10. Diario de decisiones (razonamiento completo)
 
- 11. Medición de la Hipótesis 1 — resultados de 4 pruebas
 
- 12. Revisión crítica del código final y correcciones aplicadas
 
- 13. Riesgo de reordenamiento de filas — análisis y resolución
 
- 14. Estado actual y pendientes (actualizado)
 
- 15. Diario de decisiones — continuación
 
# 1. Resumen ejecutivo
 
En esta sesión se depuró y optimizó el script de Apps Script "procesarLoteBancos", responsable de archivar en BD_Banco los movimientos bancarios ya validados manualmente en Movimientos_cuenta. Se identificaron y corrigieron tres problemas independientes, y se cerró con una validación empírica de dos hipótesis del usuario sobre el comportamiento futuro del rendimiento.
 
| **Problema** | **Causa raíz** | **Resultado** |
| --- | --- | --- |
| Script no arrancaba (línea 34) | Shadowing: el parámetro "sheet_Mov" de la función tapaba la constante global del mismo nombre | Resuelto — función sin parámetro, usa la global directamente |
| Solo se copiaba Def_UID a BD_Banco | Correspondencia de columnas Movimientos↔BD_Banco incompleta en el código | Resuelto — mapeo completo de 11 columnas |
| Ejecución de ~9 minutos para 4 filas | Lecturas/escrituras fila a fila en BD_Banco (N llamadas) + 8 llamadas sueltas de getFormula() | Mejorado a ~4 s de procesamiento propio (batch). Persiste un coste fijo de 60-90 s ajeno al script |
 
Conclusión principal: tras optimizar el código del script al máximo razonable, el cuello de botella dominante ya NO está en el script, sino en el tiempo que Google Sheets tarda en abrir el archivo y resolver el recálculo pendiente de sus fórmulas antes de devolver el control a Apps Script (evidenciado por los ~43 s que tarda un simple "openById"). Esto apunta a la carga estructural de fórmulas del propio Spreadsheet (en particular la fórmula C0 de punteo en Movimientos_cuenta!O) como el siguiente foco de optimización, ya fuera del ámbito de este script.
 
Actualización de esta versión (continuación de la misma jornada): se midió la Hipótesis 1 con 4 pruebas (sin resultado concluyente todavía, ver sección 11), se hizo una revisión crítica completa del script consolidado que detectó y corrigió la desincronización de la lógica de reanudación con el nuevo modelo de batch (sección 12), y se resolvió — mediante protección nativa de hojas en Google Sheets, ya aplicada — el riesgo de que un reordenamiento manual de filas rompiera el invariante del que depende todo el diseño por offset (sección 13).
 
# 2. Contexto: qué hace el script y por qué existe
 
## 2.1 Objetivo funcional
 
"procesarLoteBancos" automatiza el paso de archivado definitivo de movimientos bancarios: cuando en la hoja Movimientos_cuenta el operador (H0) marca la casilla de la columna V ("BD", trigger) como TRUE en la primera fila pendiente, el script toma ese movimiento (y todos los TRUE consecutivos que le sigan, hasta un máximo por lote) y:
 
- Copia los datos de control y clasificación (fórmulas ya resueltas en Movimientos_cuenta) a la fila correspondiente en BD_Banco.
 
- Marca esa fila de BD_Banco como "Definitivo = TRUE" — el sello de que el movimiento ya está procesado y archivado.
 
- Borra la fila ya procesada de Movimientos_cuenta, dejando la hoja con solo los movimientos pendientes de revisión.
 
- Restaura las fórmulas de la nueva fila 2 (las que se "desplazan hacia arriba" tras el borrado) para que la hoja siga funcionando con normalidad.
 
Esto conecta directamente con la Arquitectura de Datos general del proyecto: Movimientos_cuenta actúa como "mesa de trabajo" activa donde ocurre el punteo (C0) y la validación humana (H0), mientras que BD_Banco es el histórico permanente e inmutable. El script es, en esencia, el puente de "graduación" de un movimiento desde estado activo/editable a estado archivado/histórico.
 
## 2.2 Por qué existe (motivación de diseño)
 
- Mantener Movimientos_cuenta ligera reduce la carga de cálculo de la fórmula C0 (punteo), que es pesada y se ejecuta por cada fila activa.
 
- Evita mezclar en una misma hoja movimientos "en revisión" con movimientos "ya cerrados", mejorando la claridad operativa para H0/H2.
 
- El diseño es idempotente y reanudable: si el script falla a mitad de ejecución (por ejemplo por timeout de 6 min de Apps Script), al relanzarse detecta el estado exacto en el que quedó (fila ya escrita en BD_Banco pero no borrada de Movimientos_cuenta) y continúa desde ahí sin duplicar ni perder datos.
 
## 2.3 Estructura general del flujo (PASO 0 a PASO 5)
 
| **Paso** | **Función** |
| --- | --- |
| 0 | Evaluar reanudación: ¿la fila 2 ya quedó archivada en BD_Banco en un intento anterior fallido? Si sí, salta directo a limpieza. |
| 1 | Contar cuántas filas consecutivas tienen la casilla V = TRUE, hasta el límite MAX_FILAS_LOTE (50). |
| 2 | Feedback visual al usuario (toast + resaltado amarillo de la zona en proceso). |
| 3 | Capturar las fórmulas de la fila 2 (columnas H:O) antes de que el borrado las desplace. |
| 4 | Volcado del lote a BD_Banco: para cada fila con UID coincidente, copiar los 11 campos correspondientes y marcar Definitivo = TRUE. |
| 5 | Borrado atómico de las filas procesadas en Movimientos_cuenta + restauración de fórmulas en la nueva fila 2. |
 
# 3. Glosario de variables globales
 
Definidas en el archivo de configuración global, compartido por todos los scripts del proyecto.
 
## 3.1 Identificadores de documento y hojas
 
| **Variable** | **Descripción** |
| --- | --- |
| ss_id / ss | ID del Spreadsheet y objeto Spreadsheet abierto (SpreadsheetApp.openById). |
| gid_Mov / sheet_Mov | gid y objeto de la hoja Movimientos_cuenta_0087231. |
| gid_BDB / sheetBDB | gid y objeto de la hoja BD_Banco. |
| sheetMovimientos | ⚠️ Duplicado exacto de sheet_Mov (mismo gid). No se usa en el script. Candidato a eliminar — genera una llamada API redundante en cada ejecución. |
 
## 3.2 Columnas de Movimientos_cuenta (1-based)
 
| **Constante** | **Col.** | **Contenido** |
| --- | --- | --- |
| Mov_UID | A | UID del movimiento (clave de emparejamiento con BD_Banco) |
| Mov_NOMBREFRA | H | NombreFactura — validación final de conciliación |
| Mov_PeriodoCobro | I | Periodo contable del movimiento |
| Mov_Decripcion | J | DescripccionMovimiento — concatenación usada por C0 y A2 (no se transfiere a BDB) |
| Mov_CFInOut | K | Clasificación CF in/out (entrada/salida de caja) |
| Mov_CFCategory | L | CF category (categoría del gasto/ingreso) |
| Mov_PlataformaPago | M | Plataforma de pago asociada |
| Mov_DEF_UID | N | Def_UID — fórmula de concatenación completa de la fila, usada como clave de reanudación |
| Mov_Autopunteo | O | Fórmula C0 — sugerencia automática de punteo (la más pesada de la hoja) |
| Mov_VALIDACION | P | Inicio de bloque manual — validación H0 de la sugerencia C0 |
| Mov_FRA_MANUAL | Q | Registro manual de UID de factura si no se acepta la sugerencia |
| Mov_PCONABLE | R | Periodo de contabilización |
| Mov_UBICACION | S | Ubicación (carpeta) de la factura |
| Mov_ID_ENVIADA | T | ID de envío de la factura |
| Mov_CARPETA | U | Carpeta de archivado |
| Mov_BD | V | Checkbox trigger — al marcarlo TRUE, dispara el archivado |
 
- numColsManuales = Mov_BD − Mov_VALIDACION + 1 → 7 columnas (P:V), el bloque de control manual que se resalta durante el procesamiento.
 
- COLUMNAS_FORMULAS = [8..15] (H:O) → columnas cuya fórmula se captura antes de borrar y se restaura después, para que la nueva fila 2 siga funcionando.
 
## 3.3 Columnas de BD_Banco (1-based)
 
| **Constante** | **Col.** | **Contenido** |
| --- | --- | --- |
| BDB_UID | A | UID del movimiento — clave de búsqueda |
| BDB_DEFINITIVO | H | Definitivo — se escribe TRUE siempre al final, como sello de "archivado completo" |
| BDB_DEF_UID | I | Def_UID — recibe Mov_DEF_UID |
| BDB_PeriodoCobro | J | recibe Mov_PeriodoCobro |
| BDB_NOMBREFRA | K | recibe Mov_NOMBREFRA |
| BDB_CFInOut | L | recibe Mov_CFInOut |
| BDB_CFCategory | M | recibe Mov_CFCategory |
| BDB_PlataformaPago | N | recibe Mov_PlataformaPago |
| BDB_Validacion | O | recibe Mov_VALIDACION |
| BDB_PCONABLE | P | recibe Mov_PCONABLE |
| BDB_UBICACION | Q | recibe Mov_UBICACION |
| BDB_ID_ENVIADA | R | recibe Mov_ID_ENVIADA |
| BDB_CARPETA | S | recibe Mov_CARPETA |
| totalColsBDB | — | sheetBDB.getLastColumn() — ancho total usado para leer/escribir la fila completa |
 
Correspondencia final validada Movimientos → BD_Banco: H→K, I→J, J→(no se transfiere), K→L, L→M, M→N, N→I, O→(no se transfiere, es la propia sugerencia), P→O, Q→(no se transfiere), R→P, S→Q, T→R, U→S.
 
# 4. Problema 1 — Shadowing de "sheet_Mov" (bloqueo total)
 
## 4.1 Síntoma
 
El script fallaba en la línea 34 ("const lastRow = sheet_Mov.getLastRow()") indicando, en apariencia, que no encontraba el valor de las variables globales.
 
## 4.2 Diagnóstico
 
La función estaba declarada como "function procesarLoteBancos(sheet_Mov) {...}", con un parámetro llamado igual que la constante global "const sheet_Mov = ss.getSheetById(gid_Mov)". En JavaScript/Apps Script, un parámetro de función siempre tiene prioridad de scope sobre una variable global del mismo nombre. Al ejecutar la función directamente desde el editor (sin pasar argumento), el parámetro local "sheet_Mov" quedaba "undefined", y por tanto "sheet_Mov.getLastRow()" fallaba — no porque la global no existiera, sino porque estaba "tapada" por el parámetro vacío. La función testManual() sí funcionaba, porque esa pasaba explícitamente la global como argumento.
 
## 4.3 Solución aplicada
 
Se eliminó el parámetro de la función; ahora usa directamente la constante global.
 
function procesarLoteBancos() {
  // ...usa sheet_Mov directamente, sin declararlo como parámetro
}
 
## 4.4 Regla general anotada para el futuro
 
Cuando una función recibe como parámetro algo que también existe como constante global con la misma finalidad: o se renombra el parámetro (ej. "hojaMov"), o se elimina el parámetro y se usa la global directamente. Mezclar ambos con el mismo nombre es la trampa. En proyectos con muchas constantes globales (como este), conviene una convención de prefijo para parámetros locales que choque menos con nombres de globales.
 
# 5. Problema 2 — Correspondencia de columnas incompleta
 
## 5.1 Síntoma
 
Tras resolver el Problema 1, el script se ejecutaba sin error, pero en BD_Banco solo se rellenaba la columna Def_UID; el resto de columnas de control quedaban vacías.
 
## 5.2 Diagnóstico
 
El código original del PASO 4 solo copiaba explícitamente 6 de los 11 campos necesarios (Def_UID, NombreFactura, PConable, Ubicación, ID_Enviada, Carpeta), dejando fuera PeriodoCobro, CF in/out, CF category, PlataformaPago y Validación. Además, se detectó que faltaba declarar la constante "Mov_CFCategory" (columna L) en el archivo de variables globales — había un hueco entre Mov_CFInOut (K) y Mov_PlataformaPago (M).
 
## 5.3 Solución aplicada
 
- Se añadió la constante que faltaba: Mov_CFCategory = 12 (columna L).
 
- Se completó la correspondencia de las 11 columnas en el volcado a BD_Banco, validada explícitamente por el usuario: H/K, I/J, K/L, L/M, M/N, N/I, P/O, R/P, S/Q, T/R, U/S.
 
La columna J (DescripccionMovimiento) se confirmó como intencionadamente excluida — no tiene columna equivalente de destino en BD_Banco.
 
# 6. Problema 3 — Rendimiento: de 9 minutos a segundos
 
## 6.1 Síntoma inicial
 
Con la lógica ya funcionalmente correcta, procesar un lote de solo 4 filas tardaba aproximadamente 9 minutos (ritmo de 1-2 minutos por fila), con el patrón de logs mostrando una escritura completa en BD_Banco entre cada log de "fila archivada".
 
## 6.2 Primera optimización — batch de lectura/escritura en BD_Banco
 
Causa identificada: el bucle del PASO 4 hacía, por cada fila del lote, una lectura ("getRange(...).getValues()") y una escritura ("setValues(...)") independientes contra BD_Banco. Cada llamada de escritura dispara un recálculo de las fórmulas dependientes de esa hoja (ARRAYFORMULA, QUERY, INDIRECT, etc.), y ese recálculo — no la transferencia de datos en sí — es lo que consumía el tiempo.
 
Solución: separar "decidir qué escribir" (barato, en memoria) de "escribir" (caro, llamada API). Se sustituyó el bucle de N lecturas + N escrituras por una única lectura de bloque + una única escritura de bloque para todo el lote.
 
Refinamiento posterior (aportado por el usuario): dado que Movimientos_cuenta y BD_Banco comparten el mismo orden de UIDs sin excepción (con el offset de las filas ya eliminadas de Movimientos_cuenta), no hace falta buscar la fila destino de cada UID individualmente. Basta con localizar la fila de la primera coincidencia una sola vez; el resto del lote se resuelve por simple desplazamiento (offset), eliminando el bucle de emparejamiento completo.
 
// PASO 4 — versión final
const sheet_Mov_DataProcessing = sheet_Mov.getRange(2, 1, numFilasAProcesar, Mov_BD).getValues();
 
const primerUID = String(sheet_Mov_DataProcessing[0][Mov_UID - 1]).trim();
const mapaUidsBDB = obtenerMapaFilasBDB(sheetBDB, BDB_UID);
const filaInicioBDB = mapaUidsBDB.get(primerUID);
 
const rangoBloqueBDB = sheetBDB.getRange(filaInicioBDB, 1, numFilasAProcesar, totalColsBDB);
const matrizBDB = rangoBloqueBDB.getValues();          // 1 lectura para todo el lote
 
for (let i = 0; i < numFilasAProcesar; i++) {
  const filaOrigen = sheet_Mov_DataProcessing[i];
  const datosMemoria = matrizBDB[i];                    // correspondencia directa por offset
  // ...asignación de los 11 campos (H/K, I/J, K/L, L/M, M/N, N/I, P/O, R/P, S/Q, T/R, U/S)...
  datosMemoria[BDB_DEFINITIVO - 1] = true;               // al final
}
 
rangoBloqueBDB.setValues(matrizBDB);                     // 1 escritura para todo el lote
 
Aviso de diseño anotado (no bloqueante): al basarse en offset y no en verificación de UID fila a fila, si el invariante de orden se rompiera algún día (p. ej. una fila insertada manualmente en BD_Banco), el script escribiría en la fila equivocada sin lanzar ningún error — desalineación silenciosa. Queda documentado como punto de partida de depuración si algo raro ocurriera en el futuro, sin necesidad de blindarlo ahora.
 
## 6.3 Segunda optimización — captura de fórmulas en batch
 
Causa identificada: "capturarFormulas" hacía 8 llamadas independientes a "getFormula()" (una por cada columna de COLUMNAS_FORMULAS), incluyendo la columna O (fórmula C0, la más pesada de la hoja).
 
Solución: como las 8 columnas (H:O) son contiguas, se sustituyó por una única llamada "getFormulas()" sobre el rango completo.
 
function capturarFormulas(sheet_Mov) {
  const primeraCol = COLUMNAS_FORMULAS[0];
  const numCols = COLUMNAS_FORMULAS.length;
  const formulasFila = sheet_Mov.getRange(2, primeraCol, 1, numCols).getFormulas()[0];
  // [0] porque getFormulas() siempre devuelve una matriz 2D (filas × columnas),
  // aunque el rango leído sea de una sola fila.
 
  return COLUMNAS_FORMULAS.map((col, i) => ({ columna: col, formula: formulasFila[i] }));
}
 
## 6.4 Hallazgo clave: el cuello de botella real no estaba en el script
 
Para localizar con precisión dónde se iba el tiempo, se instrumentó el código con timestamps (Logger.log con new Date().toISOString()) en cada paso, incluyendo la apertura del propio Spreadsheet. Resultado de la medición decisiva:
 
| **Tramo** | **Tiempo** | **¿Depende del código del script?** |
| --- | --- | --- |
| openById (abrir el Spreadsheet) | ~43 s | No |
| capturarFormulas (incluso ya en batch) | ~40 s | No (tras el fix de batch, el tiempo no bajó) |
| Lectura + emparejamiento + escritura BD_Banco (PASO 4) | ~2-4 s | Sí — ya optimizado |
 
Conclusión: el 85-90% del tiempo total de ejecución no depende de las llamadas API que genera el script, sino de que Google Sheets no libera el control hasta terminar de resolver el recálculo de fórmulas pendiente del Spreadsheet — y esto ocurre incluso al abrir el archivo, antes de que el script pida ningún dato. La sospecha principal, coherente con el documento de Arquitectura, es la fórmula de punteo C0 (Movimientos_cuenta!O), que anida LET + QUERY + INDIRECT + MATCH y se ejecuta por cada fila activa de la hoja.
 
## 6.5 Evolución de los tiempos de ejecución a lo largo de la sesión
 
| **Prueba** | **Filas** | **Resultado** |
| --- | --- | --- |
| Inicial (sin batch) | 4 | ~9 minutos (1-2 min por fila) |
| Tras batch PASO 4 | 3-4 | ~96 segundos totales; PASO 4 ya en ~1-4 s |
| Tras batch capturarFormulas | 3 | ~97 s totales — sin mejora, confirma que el cuello estaba fuera del script |
| Prueba de carga (Hipótesis 2) | 50 (de 52 marcadas) | Corte en 50 exacto y correcto; tramo que escala con el lote: <1 s adicional frente a 3 filas |
 
# 7. Hipótesis del usuario y su validación empírica
 
## 7.1 Hipótesis 1 — "El script se acelerará de forma inversamente proporcional a las filas restantes"
 
**Planteamiento del usuario: **Movimientos_cuenta concentra tanto el mayor volumen de fórmulas como las más pesadas a nivel de cálculo (haciendo el resto de hojas, comparativamente, irrelevante). Por tanto, menos filas en Movimientos_cuenta implica menos recálculo, y el objetivo de mantener la hoja "limpia" (solo filas pendientes de revisión) debería traducirse en una mejora de rendimiento sostenida.
 
**Validación: **Dirección correcta, confirmada como razonable dado el diseño de la fórmula C0 (LET anidado con QUERY + INDIRECT + MATCH + lógica anti-duplicados, ejecutada por cada fila activa). Sin embargo, se matizó la forma exacta de la relación:
 
- "Inversamente proporcional" (y = k/x) implica una curva concreta y uniforme; el coste real por fila de C0 no es constante (depende del número de coincidencias devueltas por la QUERY interna y de la posición en el rango anti-duplicados), por lo que es más plausible una tendencia decreciente con forma superlineal en el peor caso, no una inversa matemática pura.
 
- Otras hojas del ecosistema (HistorialFacturas, AsigCostes/PProveedores, CashFlowDin.Table, Google!, Nexmo!, Compr.Fras.Manual) no dependen del tamaño de Movimientos_cuenta que el script vacía — dependen de sus propios tamaños, que tienden a crecer con el tiempo (más facturas, más histórico).
 
- Movimientos_cuenta no solo se vacía por este script — también recibe entradas nuevas constantemente vía A1 (importación automática), por lo que el "neto" de filas podría no tender a cero de forma limpia.
 
**Conclusión acordada: **el tiempo dependerá de la carga de cálculo agregada de todo el Spreadsheet, de la cual Movimientos_cuenta es el mayor contribuyente pero no el único. Pendiente de confirmación con mediciones a lo largo de varios días (ver sección 9).
 
## 7.2 Hipótesis 2 — "Procesar 3 filas vs 50 no debería aumentar significativamente el tiempo"
 
**Planteamiento del usuario: **dada la ubicación de los cuellos de botella (fuera del bucle de procesamiento), el tamaño del lote no debería impactar de forma relevante el tiempo total.
 
**Validación: **CONFIRMADA EMPÍRICAMENTE. Se ejecutó una prueba de carga marcando 52 casillas (para forzar también la comprobación del corte en MAX_FILAS_LOTE = 50):
 
- El script se detuvo exactamente en la fila 50, tal como se esperaba por diseño.
 
- El tramo que escala con el tamaño del lote (lectura de bloque + bucle en memoria + escritura de bloque) tardó menos de 1 segundo adicional al pasar de 3 a 50 filas — diferencia indistinguible del ruido de medición normal entre ejecuciones.
 
- El coste fijo (openById + capturarFormulas) se mantuvo igual de dominante (~85-90 s) independientemente del tamaño del lote.
 
**Implicación práctica derivada: **como el coste de "arrancar" el script es fijo y dominante, y el coste de procesar filas dentro del lote es marginal, conviene procesar siempre el máximo posible por ejecución (MAX_FILAS_LOTE = 50 ya va en la dirección correcta) en vez de ejecutar con más frecuencia y lotes pequeños. Cada ejecución "paga" el mismo peaje fijo de ~70-90 s, así que menos ejecuciones con lotes grandes es estrictamente mejor que más ejecuciones con lotes pequeños.
 
# 8. Estado actual del código
 
- procesarLoteBancos() ya no recibe sheet_Mov como parámetro — usa la constante global directamente.
 
- PASO 4 reescrito: localiza la fila de inicio en BD_Banco mediante un único lookup del primer UID, y resuelve el resto del lote por offset directo (sin bucle de emparejamiento ni lecturas/escrituras individuales).
 
- Correspondencia completa de 11 columnas entre Movimientos_cuenta y BD_Banco, incluyendo la constante Mov_CFCategory que faltaba declarar.
 
- capturarFormulas() reescrita para usar una sola llamada getFormulas() sobre el rango contiguo H:O, en vez de 8 llamadas getFormula() sueltas.
 
- Instrumentación de diagnóstico (Logger.log con timestamps) añadida temporalmente durante la sesión — se mantienen activos G0/G1 (openById) y T4/T5 (capturarFormulas) de forma deliberada para continuar la medición de la Hipótesis 1 en próximas sesiones; el resto de checkpoints (T0-T3, T6-T8, G2-G4) quedan comentados.
 
- Nota: este bloque se amplía y corrige en la sección 12, que recoge el código final consolidado tras la revisión crítica de la continuación de la sesión — en particular, el fix de la lógica de reanudación (sección 12.2).
 
# 9. Pendientes y próximos pasos (versión original — ver sección 14 para el estado actualizado)
 
### 9.1 Limpieza de código (bajo esfuerzo)
 
- Eliminar la constante "sheetMovimientos" (duplicado exacto de sheet_Mov, sin uso, genera una llamada API redundante en cada ejecución). [RESUELTO — ver sección 12: se dejó comentada en el archivo de variables globales].
 
- Decidir si se retiran los Logger.log de diagnóstico (T0-T8, G0-G4) o se dejan comentados para reutilizarlos en próximas auditorías de rendimiento. [RESUELTO — se decidió mantener G0/G1 y T4/T5 activos, ver sección 8].
 
### 9.2 Investigación del cuello de botella estructural (medio esfuerzo, mayor impacto)
 
- Confirmar el modo de recálculo del Spreadsheet (Archivo → Configuración de la hoja de cálculo → Cálculo).
 
- Aislar qué fórmula concreta es la más costosa (candidata principal: C0 en Movimientos_cuenta!O) — método propuesto: copiar temporalmente la columna como valores y medir cuánto tarda el Spreadsheet en "asentarse".
 
- Evaluar, a medio plazo, mover parte de la lógica de C0 desde fórmulas de Sheets a Apps Script (cálculo en memoria, sin depender del motor de recálculo de la hoja) — línea ya apuntada en el propio documento de Arquitectura, sección "Recomendaciones para la Optimización de Sistemas". [SIGUE PENDIENTE — no abordado en la continuación de esta sesión, ver sección 14].
 
### 9.3 Validación pendiente de la Hipótesis 1 con datos reales
 
- Registrar tiempos de ejecución en varios días distintos, anotando en cada caso el número de filas de Movimientos_cuenta y, si es posible, de las hojas dependientes que crecen con el tiempo (HistorialFacturas, AsigCostes, etc.), para confirmar si la reducción de filas en Movimientos_cuenta se traduce en una mejora sostenida de rendimiento o si queda compensada por el crecimiento de otras hojas. [EN CURSO — ver sección 11: primeras 4 mediciones realizadas, sin resultado concluyente todavía].
 
### 9.4 Integridad de datos — CashFlowDin.Table (a futuro, sin prisa, ya anotado por el usuario)
 
- El documento de Arquitectura indica que CashFlowDin.Table agrega el campo Importe de Movimientos_cuenta. Si esto es literal, cada borrado de filas ya procesadas (que hace justamente este script) haría desaparecer esos movimientos del Cashflow, salvo que la tabla dinámica en realidad deba leer de BD_Banco (que sí conserva todo permanentemente).
 
- El usuario ya tiene esto identificado: el objetivo a futuro es que la fuente sea BD_Banco (y posiblemente también Movimientos_cuenta); pendiente de planificar el rediseño, sin urgencia. [SIGUE PENDIENTE, sin cambios].
 
# 10. Diario de decisiones (razonamiento completo)
 
Recogido en formato "valoré X por razón Y, pero Z / decisión final" para que el histórico de lógica quede explícito y reutilizable.
 
### 10.1 Sobre el parámetro sheet_Mov
 
- Valoré mantener el parámetro y simplemente renombrarlo (ej. "hojaMov") para preservar la idea original de "función pura" que recibe su dependencia. No se llevó a cabo porque, dado que sheet_Mov es una constante fija de todo el proyecto (no cambia entre llamadas ni se reutiliza la función con otra hoja), no aportaba ningún beneficio real frente a usar la global directamente, y sí añadía riesgo de repetir el mismo error de shadowing en el futuro.
 
- Decisión final: eliminar el parámetro y usar la global directamente.
 
### 10.2 Sobre la estrategia de batch en BD_Banco
 
- Valoré una primera versión con Math.min/Math.max sobre las filas destino de cada match, más una salvaguarda de "bloque disperso" con un camino de respaldo fila a fila, por si las coincidencias no fueran consecutivas. No se llevó a cabo en su forma completa porque el usuario confirmó que, por diseño del sistema (mismo orden de UIDs entre Movimientos_cuenta y BD_Banco, con offset por las filas ya eliminadas), las coincidencias son SIEMPRE consecutivas — lo que hace innecesaria la salvaguarda de dispersión.
 
- Valoré, tras esa confirmación, simplificar a "fila de la primera coincidencia + numFilasAProcesar − 1" (propuesta del usuario). Se ajustó ligeramente: anclar el cálculo al primer y último elemento del array de coincidencias reales ("matches"), en vez de al total de numFilasAProcesar, para no leer/escribir una fila de más en el caso (raro pero posible) de que alguna fila del lote se descarte por falta de UID o de coincidencia.
 
- Decisión final (con el segundo refinamiento del usuario): ya que todas las UIDs de Movimientos_cuenta se encuentran siempre en BD_Banco sin excepción, ni siquiera hace falta construir el emparejamiento completo — basta con localizar la fila de la primera coincidencia una única vez, y resolver el resto por offset directo. Se eliminó el bucle de matching por completo, dejando la solución más simple posible dado el invariante de diseño confirmado.
 
- Aviso documentado (no bloqueante): esta solución por offset asume el invariante de orden como verdad absoluta; si algún día se rompiera (edición manual en BD_Banco, desincronización), el script escribiría en la fila equivocada sin lanzar error. Se decidió no blindar esto ahora porque el invariante está confirmado dos veces por el usuario y añadir protección aquí sería complejidad prematura — queda anotado como primer punto a revisar si en el futuro aparece un comportamiento anómalo.
 
### 10.3 Sobre el diagnóstico del cuello de botella de rendimiento
 
- Valoré, tras el primer batch (PASO 4), dar el problema por resuelto — el tiempo bajó de 9 min a 96 s, una mejora notable. No se dio por cerrado porque el patrón de logs mostraba una "pausa" de ~90 s antes incluso de llegar al primer paso del código, señal de que quedaba un cuello de botella sin explicar.
 
- Valoré la hipótesis de que capturarFormulas (8 llamadas sueltas) era la causa principal del tramo lento. Se instrumentó con timestamps para confirmarlo antes de asumirlo. El batch de capturarFormulas SÍ era una mejora de código correcta (menos llamadas API), pero los tiempos no bajaron tras aplicarlo — lo cual descartó la hipótesis de "el problema es el número de llamadas API" y apuntó a algo más estructural.
 
- Decisión final: instrumentar también la apertura del Spreadsheet (openById) como prueba definitiva. El resultado (~43 s solo para abrir el archivo, sin tocar ningún dato) confirmó que el cuello de botella real es el tiempo que Sheets tarda en resolver su recálculo de fórmulas pendiente antes de devolver el control a cualquier llamada — un problema de carga estructural del Spreadsheet, no del código del script. Se dejó explícitamente fuera del alcance de esta sesión de optimización de código, y anotado como línea de investigación futura (sección 9.2).
 
### 10.4 Sobre las dos hipótesis del usuario
 
- Hipótesis 1 (relación inversa filas-rendimiento): valorada como razonable en dirección pero se matizó la forma exacta de la curva (superlineal decreciente probable, no inversa pura), y se señaló que otras hojas del ecosistema crecen de forma independiente a Movimientos_cuenta, por lo que la mejora neta a largo plazo no está garantizada solo por vaciar esta hoja. Queda pendiente de confirmación empírica con mediciones a lo largo de varios días.
 
- Hipótesis 2 (3 filas vs 50 filas, mismo tiempo): confirmada con datos reales mediante una prueba de carga deliberada (52 casillas marcadas). Se comprobó tanto el corte correcto en MAX_FILAS_LOTE = 50 como que el tramo que escala con el lote añade menos de 1 segundo al pasar de 3 a 50 filas. De aquí se derivó una recomendación operativa: preferir lotes grandes y pocas ejecuciones frente a lotes pequeños y ejecuciones frecuentes, dado que el coste fijo de arranque (~70-90 s) se paga en cada ejecución independientemente del tamaño del lote.
 
# **11. Medición de la Hipótesis 1 — resultados de 4 pruebas**
 
Recordatorio de la Hipótesis 1: "el script se acelerará de forma inversamente proporcional a las filas restantes en Movimientos_cuenta, dado que esta hoja concentra el mayor volumen de fórmulas y las más pesadas a nivel de cálculo (en particular C0)".
 
## 11.1 Método
 
Se instrumentó el script con timestamps en los puntos G0 (antes de openById), G1 (después de openById), T4 (antes de capturarFormulas) y T5 (después de capturarFormulas), además de Inicio y Fin de la ejecución completa. Se realizaron 4 ejecuciones consecutivas en la misma jornada, reduciendo el volumen de Movimientos_cuenta entre cada una.
 
## 11.2 Datos brutos y tramos calculados
 
| **Filas** | **Inicio→G0** | **G0→G1 (openById)** | **G1→T4** | **T4→T5 (capturarFormulas)** | **T5→Fin** | **Total** |
| --- | --- | --- | --- | --- | --- | --- |
| 2321 | 7 s | 40 s | 2 s | 37 s | 0 s | **86 s** |
| 2271 | 7 s | 39 s | 3 s | 40 s | 2 s | **91 s** |
| 2221 | 7 s | 34 s | 2 s | 37 s | 1 s | **81 s** |
| 2171 | 7 s | 35 s | 3 s | 36 s | 1 s | **82 s** |
 
Nota sobre el primer registro: la fila de 2321 filas se recogió inicialmente con un error de transcripción manual (T4/T5/Fin mal anotados); fue corregida por el usuario antes de continuar con las siguientes pruebas. Los valores de la tabla ya reflejan la corrección.
 
## 11.3 Lectura de los resultados
 
- El rango de reducción de filas entre la primera y la última prueba fue de 2321 → 2171, es decir, una caída del 6,5%.
 
- El tiempo total osciló entre 81 s y 91 s, sin una tendencia monótona decreciente clara: 86 → 91 → 81 → 82.
 
- El tramo G0→G1 (openById) mostró una leve tendencia a la baja (40 → 39 → 34 → 35 s) pero con un salto no lineal entre la 2ª y 3ª prueba.
 
- El tramo T4→T5 (capturarFormulas) se mantuvo prácticamente plano (37 → 40 → 37 → 36 s), sin tendencia visible.
 
**Conclusión de esta ronda: **no hay evidencia suficiente para confirmar ni refutar la Hipótesis 1 con este rango de datos. La variación de filas (6,5%) es demasiado pequeña frente al ruido normal de medición (variabilidad de red, estado momentáneo de los servidores de Google, actividad concurrente en el documento) para que un efecto real, si existe, se distinga con claridad. Se necesitaría o bien un rango de reducción mucho mayor (varios cientos o miles de filas de diferencia) o bien muchas más mediciones en el mismo rango para que una tendencia estadística emerja del ruido.
 
## 11.4 Observación adicional del usuario, pendiente de más datos
 
El usuario señaló que la reducción porcentual de G0→G1 entre la primera y la última prueba (aprox. 6-7%) es numéricamente parecida a la reducción porcentual de filas (6,5%), y preguntó si esto podría ser indicio de una relación proporcional. Se acordó tratarlo como una observación a vigilar, no como una conclusión — con solo 4 puntos y un rango de variación tan pequeño, la coincidencia de cifras del mismo orden de magnitud es compatible tanto con una relación real como con el azar. Pendiente de más rango y más puntos para confirmar.
 
## 11.5 Próximos pasos para esta hipótesis
 
- Repetir la medición con un rango de reducción de filas mucho mayor (p. ej., de varios miles a unos cientos), no solo un 6-7%.
 
- Aumentar el número de mediciones por rango para poder calcular una tendencia o promedio móvil que filtre el ruido.
 
- Mantener la cadencia entre pruebas similar en cada sesión de medición, evitando pausas largas que puedan introducir el efecto "primera ejecución tras reposo" como variable de confusión.
 
# **12. Revisión crítica del código final y correcciones aplicadas**
 
Tras confirmar el estado del código con todas las optimizaciones de la primera parte de la sesión ya integradas (batch por offset, captura de fórmulas en batch, sin parámetro sombreado), se realizó una revisión crítica completa a petición del usuario, buscando vulnerabilidades más allá del rendimiento: robustez, UX, y riesgos de integridad de datos.
 
## 12.1 Hallazgos y su resolución
 
| **Hallazgo** | **Decisión del usuario** | **Estado** |
| --- | --- | --- |
| testManual() roto (llama a onEditInstalable, que está comentado) | Solo relevante si se retoma el uso del trigger; no planeado a medio plazo | Aceptado sin cambio, documentado |
| PASO 0 (reanudación) desincronizado del batch: solo limpiaba 1 fila aunque el crash ocurriera a mitad de un lote de hasta 50 | Corregir contando filas consecutivas con Definitivo=TRUE desde el punto de coincidencia, no asumiendo solo 1 | Resuelto — ver 12.2 |
| catch solo limpia el resaltado de la fila 2, no de todo el lote resaltado | Irrelevante: al borrar las filas, el formato desaparece igualmente. Se puede quitar el setBackground(null) sin consecuencias | Aceptado, sin acción necesaria |
| Fallo de lock (otra ejecución en curso) no avisa al usuario, solo hace Logger.log | Solo relevante si se activa el trigger de edición automática | Aceptado sin cambio, documentado |
| Inicialización global (ss, sheetBDB, totalColsBDB) sin try/catch; cualquier función del proyecto paga el coste y el riesgo | Intencionado: no hay ni se prevén otros scripts que no usen Movimientos_cuenta. El fallo ante gid inválido es deseado — el gid es inmutable, el nombre de hoja no, por eso se ancla al gid | Aceptado por diseño |
| getLastRow() sigue expuesto al problema de "filas fantasma" (fórmulas sin datos por debajo de los datos reales) | Anotar para revisión futura | Pendiente — ver sección 14 |
| Sin validación de que los UIDs realmente coincidan entre Movimientos_cuenta y BD_Banco tras pasar a offset puro | Anotar para contemplar; propuesta inicial: comparar UID de cada fila desde la segunda contra el bloque leído de BD_Banco | Superado por la solución de la sección 13 (protección de hojas) |
| Typo "Mov_Decripcion", instrumentación de logs con comentado irregular, espaciado con tabulación irregular | Typo apuntado para corregir; logs de G0/G1/T4/T5 dejados activos intencionadamente para seguir midiendo H1; resto "irrelevante" | Aceptado / pendiente menor |
 
## 12.2 Fix aplicado — reanudación por bloque, no por fila única
 
Se sustituyó la lógica original del PASO 0 (que asumía que, tras un crash, como mucho 1 fila había quedado archivada en BD_Banco) por una versión que cuenta cuántas filas consecutivas desde el punto de coincidencia ya tienen Definitivo = TRUE, y limpia ese bloque completo de una vez — coherente con que el volcado ahora se hace en batch (hasta 50 filas de golpe), no fila a fila.
 
if (yaArchivado === true) {
  // Contar filas consecutivas ya archivadas desde el punto de coincidencia
  // (cubre que el crash ocurriera a mitad del batch, no solo en la fila 1)
  const limiteReanudacion = Math.min(MAX_FILAS_LOTE, lastRow - 1);
  const bloqueDefinitivo = sheetBDB.getRange(filaMatchUids_Reviewed, BDB_DEFINITIVO, limiteReanudacion, 1).getValues();
  let numFilasYaArchivadas = 0;
  for (let i = 0; i < bloqueDefinitivo.length; i++) {
    if (bloqueDefinitivo[i][0] === true) numFilasYaArchivadas++;
    else break;
  }
  Logger.log(`REANUDACIÓN: ${numFilasYaArchivadas} fila(s) ya archivada(s) — limpiando de golpe.`);
  const formulasGuardadas = capturarFormulas(sheet_Mov);
  limpiarYRestaurar(sheet_Mov, numFilasYaArchivadas, formulasGuardadas, numColsManuales, lastRow);
  ss.toast(`Reanudación completada. ${numFilasYaArchivadas} fila(s) limpiada(s).`, "✅ Reanudado", 5);
  return;
}
 
Aclaración sobre la mecánica del bucle (consulta explícita del usuario, para que quede documentado): bloqueDefinitivo.length NO es el resultado — es solo el límite del bucle ("no leas más allá de lo que se trajo de la hoja"). El conteo real ocurre en numFilasYaArchivadas, que se incrementa de uno en uno solo mientras el valor es TRUE, y se detiene en el primer FALSE gracias al break. Es el mismo patrón que ya usa el PASO 1 para contar los checkboxes TRUE consecutivos.
 
## 12.3 Riesgo evaluado y descartado — ventana entre deleteRows() y restaurarFormulas()
 
Se planteó como hallazgo un posible riesgo: si el script falla justo entre el deleteRows() y el restaurarFormulas() (dentro de limpiarYRestaurar), la fila 2 quedaría sin las fórmulas de control (columnas H:O), dejando la hoja parcialmente rota. La primera estimación de severidad fue incorrecta — se asumió, por extrapolación del tiempo de openById (40 s), que esta ventana podía ser de una magnitud similar.
 
Al revisar los datos reales medidos en las 4 pruebas de la Hipótesis 1, se comprobó que el tramo T5→Fin (que incluye TODO el PASO 4 + PASO 5, del cual deleteRows()+restaurarFormulas() es solo una fracción) dura entre 0 y 2 segundos en total. La estimación de riesgo se corrigió: la ventana real es una fracción de segundo, no una ventana de decenas de segundos. La calificación original del usuario ("caso casi imposible por velocidad de procesamiento") resultó ser la más ajustada a los datos reales.
 
**Decisión: **se documenta una mejora opcional de bajo coste (usar Range.copyTo() con CopyPasteType.PASTE_FORMULA desde una fila donante, en vez de hardcodear texto de fórmulas, para que la reparación se adapte automáticamente si la fórmula cambia en el futuro) como mejora "por qué no, ya que es fácil" — no como prioridad urgente, dado el riesgo residual mínimo confirmado con datos.
 
# **13. Riesgo de reordenamiento de filas — análisis y resolución**
 
Este fue el punto priorizado como más urgente por el usuario tras la revisión crítica: el diseño actual del PASO 4 (offset puro desde la primera coincidencia) descansa por completo en el invariante "Movimientos_cuenta y BD_Banco comparten siempre el mismo orden de UIDs". Si ese invariante se rompiera — por ejemplo, si alguien ordenara manualmente una de las dos hojas por un criterio distinto al de inserción — el script escribiría datos en filas equivocadas de forma silenciosa, sin lanzar ningún error.
 
## 13.1 Opciones de mitigación evaluadas y descartadas
 
### Opción A — Validar + fallback automático fila a fila + bloqueo preventivo
 
- Descartada. El camino de fallback fila a fila apenas se ejecutaría en la práctica (solo si el invariante se rompe), lo que lo convierte en el código con menor cobertura de pruebas reales del sistema — justo el que más necesita funcionar bien el día que se dispare. Además, un "bloqueo preventivo" de reordenamiento no es viable de forma nativa: no existe un evento fiable en Sheets/Apps Script para interceptar una acción de ordenar antes de que ocurra.
 
### Opción B — Mapear la correspondencia completa de UIDs en memoria en cada ejecución (como se hacía con las columnas)
 
- Descartada. Esto equivale a deshacer la optimización de rendimiento central de toda la sesión (pasar de "buscar cada UID individualmente" a "offset desde la primera coincidencia"). Habría recuperado seguridad a costa de perder por completo la ganancia de rendimiento lograda.
 
### Opción C (intermedia, explorada) — Verificación en memoria sin coste API + reordenamiento local si no hay saltos
 
- Se diseñó una versión que reutiliza el mapa de UIDs de BD_Banco ya construido (sin llamadas API extra) para detectar si la desalineación es una simple permutación dentro del mismo bloque ya leído ("sin saltos", recuperable gratis en memoria) o si implica filas fuera de ese bloque ("con saltos", no recuperable sin fallback fila a fila).
 
- Descartada como solución principal tras el análisis del usuario: con un reordenamiento por fecha, solo se evitarían saltos si el reordenamiento respeta límites de lote exactos — poco fiable. Con cualquier otro criterio de orden (importe, proveedor, alfabético), los saltos están casi garantizados, forzando el fallback fila a fila de todos modos. Además, un reordenamiento de la hoja probablemente causaría también errores de cálculo en otras fórmulas dependientes de posición, haciendo que la recuperación del script fuera irrelevante frente al daño mayor ya causado a la hoja.
 
## 13.2 Solución adoptada — prevención en el origen, no detección posterior
 
Conclusión compartida: dado que cualquier forma de detección/recuperación en memoria queda invalidada por un reordenamiento arbitrario, el enfoque correcto es impedir que el reordenamiento ocurra, no intentar sobrevivirlo después.
 
### Mecanismo: protección de rangos/hojas nativa de Google Sheets
 
- Google Sheets bloquea de forma nativa la opción "Ordenar rango" en la interfaz cuando el rango afectado incluye celdas protegidas para las que el usuario no tiene permiso de edición.
 
- Configuración acordada: proteger en Movimientos_cuenta las columnas A:O (datos automáticos + C0), dejando editable P:V (bloque de trabajo manual de H0). Proteger BD_Banco en su totalidad.
 
- Confirmado: la protección de rango/hoja SOLO afecta a usuarios humanos interactuando por la interfaz (o por API con las credenciales de ese usuario). NO afecta a SpreadsheetApp cuando el script se ejecuta con las credenciales del propietario/editor autorizado (incluyendo triggers instalables) — el script sigue funcionando exactamente igual tras aplicar la protección.
 
- Se descartó "ocultar la hoja" como medida alternativa o provisional: ocultar es una orden puramente visual (Ver → Hojas ocultas revierte el ocultamiento en dos clics para cualquier editor), no un control de seguridad real. No aporta nada que la protección no cubra ya mejor.
 
### Capa adicional acordada — alarma temprana (pendiente de implementar)
 
- Se documentó el trigger onChange de Apps Script como mecanismo de aviso complementario: se dispara ante cambios estructurales de la hoja (SORT, inserción/eliminación de filas, etc.) vía el parámetro changeType del evento.
 
- Naturaleza del control: es detección posterior al hecho, no prevención — el cambio ya ocurrió cuando el trigger se dispara. Sirve para notificar (ej. email), no para revertir automáticamente.
 
- Plan de reacción ante la alarma: restauración manual desde el Historial de versiones de Google Sheets (Archivo → Historial de versiones), apuntando al punto granular más cercano y anterior al incidente.
 
### Matiz importante documentado sobre la restauración por historial de versiones
 
- El historial de versiones revierte el documento completo a un punto en el tiempo, no una hoja aislada ni un cambio concreto — cualquier trabajo legítimo posterior al reordenamiento (checkboxes marcados, lotes archivados, entradas nuevas vía A1) también se perdería al restaurar.
 
- Se corrigió la estimación inicial del usuario ("máximo 24h de trabajo perdido, asumiendo una versión por día"): el historial de Sheets guarda revisiones con mayor granularidad que una vez al día (visible al expandir el detalle en el panel de historial), por lo que el margen real de pérdida, actuando con rapidez tras la alarma de onChange, debería ser de minutos, no de horas.
 
- Limitación técnica confirmada: no existe una función en SpreadsheetApp ni en la API de Sheets para restaurar una versión de forma programática con garantías — la restauración es siempre una acción manual del usuario en la interfaz. onChange puede avisar, pero no puede autorrestaurar.
 
## 13.3 Estado al cierre de esta sesión
 
**✅ COMPLETADO: **protección de rangos/hojas aplicada por el usuario en Movimientos_cuenta y BD_Banco.
 
**⏳ PENDIENTE: **implementar el trigger onChange como alarma temprana de respaldo (no se llegó a codificar en esta sesión).
 
**Decisión de simplificación: **con la protección de hojas puesta, el riesgo de reordenamiento pasa a ser de baja probabilidad real (impedido por la interfaz), no solo de baja probabilidad asumida. Por tanto, se descarta implementar la lógica de verificación/recuperación en memoria de la Opción C — un chequeo simple del primer UID (ya existente en el código, vía el ERROR CRÍTICO si filaInicioBDB no se encuentra) se considera suficiente como red de seguridad residual.
 
# **14. Estado actual y pendientes (actualizado)**
 
## 14.1 Cambios integrados en el código desde el inicio de la sesión
 
- Logging de diagnóstico G0/G1 y T4/T5 dejado activo intencionadamente (resto comentado) para continuar midiendo la Hipótesis 1 en próximas sesiones.
 
- Constante duplicada sheetMovimientos comentada (ya no se declara activa).
 
- Fix de reanudación por bloque (sección 12.2) — redactado y validado en esta sesión.
 
- Protección de rangos/hojas aplicada directamente en Google Sheets (fuera del código Apps Script) — Movimientos_cuenta (A:O) y BD_Banco (hoja completa).
 
## 14.2 Pendientes priorizados
 
| **Prioridad** | **Pendiente** | **Notas** |
| --- | --- | --- |
| Media | Implementar trigger onChange como alarma temprana ante SORT/reordenamiento estructural | Diseño ya acordado (sección 13.2); falta codificar y desplegar |
| Media | Aplicar en el .gs en producción el fix de reanudación por bloque (sección 12.2) | Código ya redactado y validado en esta sesión |
| Baja | Continuar midiendo la Hipótesis 1 con mayor rango de filas y más puntos de datos | Ver sección 11.5 |
| Baja | Sustituir getLastRow() por el helper obtenerUltimaFilaConDatos (evitar filas fantasma con fórmulas) | Helper ya escrito, queda comentado en el archivo de globales |
| Baja | Auto-reparación de fórmulas de la fila 2 con Range.copyTo(PASTE_FORMULA) desde fila donante | Riesgo residual confirmado como mínimo (sección 12.3); mejora opcional de bajo coste |
| Baja | Corregir typo Mov_Decripcion → Mov_Descripcion | Cosmético |
| Sin prisa | CashFlowDin.Table: decidir si debe leer de BD_Banco y/o Movimientos_cuenta | El usuario indicó que no es urgente |
| Investigación | Localizar la fórmula más costosa del Spreadsheet (candidata: C0 en Movimientos_cuenta!O) para atacar el cuello de botella estructural de fondo (openById ~35-40s) | Sigue vigente, sin abordar en esta sesión |
 
# **15. Diario de decisiones — continuación**
 
### 15.1 Sobre la lógica de reanudación
 
- Valoré mantener la reanudación limitada a 1 fila, asumiendo que el escenario de crash a mitad de un lote grande era poco probable. No se mantuvo así porque, con el cambio a escritura en batch de esta misma sesión, un crash a mitad de un lote de 50 dejaría hasta 49 filas mal gestionadas por la reanudación (recuperándose de una en una, en 49 ejecuciones sucesivas, en vez de una sola). Se corrigió para contar el bloque completo ya archivado, no solo la primera fila.
 
### 15.2 Sobre el riesgo entre deleteRows() y restaurarFormulas()
 
- Valoré este riesgo como significativo, por extrapolación del tiempo de apertura del Spreadsheet (openById, ~40s), asumiendo que cualquier operación de escritura podía verse afectada por recálculo pendiente de forma similar. No se sostuvo al contrastar con los datos reales medidos: el tramo que contiene íntegramente esta ventana (T5→Fin, que incluye PASO 4 completo + PASO 5 completo) dura 0-2 segundos en las 4 mediciones de la sesión. Se corrigió la estimación de severidad a la baja, validando que la valoración original del usuario ("caso casi imposible") era la más ajustada a los datos.
 
- Valoré proponer hardcodear el texto de las fórmulas como mecanismo de auto-reparación. Se ajustó a una alternativa más robusta (Range.copyTo con CopyPasteType.PASTE_FORMULA desde una fila donante) porque no requiere mantener un string sincronizado manualmente si la fórmula cambia en el futuro, y reutiliza una mecánica de Apps Script ya familiar en el proyecto. Con el riesgo real confirmado como mínimo, esta mejora queda como opcional de bajo coste, no como urgente.
 
### 15.3 Sobre el riesgo de reordenamiento — el hilo más largo de la sesión
 
- Valoré una verificación de UIDs fila a fila con fallback automático a escritura individual si se detectaba desalineación (Opción A). No se llevó a cabo porque el camino de fallback, al ejecutarse solo en el caso raro de que el invariante se rompa, sería el código con menor cobertura de pruebas reales — justo el que más necesita funcionar bien el día que se dispare. Tampoco es viable un "bloqueo preventivo" de reordenamiento a nivel de evento en Sheets/Apps Script.
 
- Valoré (propuesta del usuario) mapear la correspondencia completa de UIDs en memoria en cada ejecución, igual que se hizo con las columnas. No se llevó a cabo porque equivale a deshacer la optimización central de rendimiento lograda en la primera parte de la sesión (pasar de mapeo completo a offset desde la primera coincidencia) — se habría recuperado seguridad a cambio de perder por completo la ganancia de velocidad.
 
- Valoré una solución intermedia (propuesta del usuario, Opción C): reutilizar el mapa de UIDs de BD_Banco ya construido (sin coste API adicional) para distinguir entre desalineación "sin saltos" (permutación dentro del mismo bloque, recuperable en memoria) y "con saltos" (requiere fallback fila a fila). Llegamos a diseñar el código completo para esta opción. No se implementó porque el propio usuario razonó que, con un reordenamiento por cualquier criterio distinto a fecha exacta alineada a los límites de lote, los saltos están casi garantizados — invalidando la parte "recuperable" del diseño en la mayoría de casos reales. Además, un reordenamiento de la hoja probablemente rompería también otras fórmulas dependientes de posición, haciendo irrelevante que el script se recuperase si el resto de la hoja ya está comprometido.
 
- Decisión final: en vista de que ninguna estrategia de detección/recuperación en memoria cubre de forma fiable un reordenamiento arbitrario, se cambió el enfoque de "sobrevivir al reordenamiento" a "impedir que ocurra". Se adoptó la protección nativa de rangos/hojas de Google Sheets como mecanismo de prevención (confirmado que no afecta la ejecución del script, al operar este con credenciales de editor autorizado), descartando "ocultar la hoja" por ser un control puramente cosmético sin valor de seguridad real.
 
- Sobre el plan de contingencia si la protección fallara o se ampliaran permisos en el futuro: se valoró y aceptó un trigger onChange como alarma temprana, combinado con restauración manual vía Historial de versiones. Se corrigió la estimación inicial del usuario sobre la pérdida de datos al restaurar (de "máximo 24h asumiendo una versión diaria" a "minutos, dado que el historial de Sheets guarda revisiones con mayor granularidad de la aparente, actuando con rapidez tras la alarma"), y se documentó la limitación de que la restauración de versiones no se puede automatizar desde Apps Script — siempre requiere acción manual del usuario en la interfaz.
 
*— Fin del informe —*
Informe_Sesion_ProcesarLoteBancos_2026-07-21 (1).docx
**Informe de sesión — Optimización de rendimiento**
 
*Script procesarLoteBancos (Apps Script) — Proyecto Arquitectura y Flujo de Datos*
 
**VERSIÓN 2 — actualizado con la continuación de la sesión (secciones 11-15)**
 
**Fecha de la sesión: **21 de julio de 2026
 
**Documento asociado: **01_ImportarMovimientos / A2_AsignacionDeGastos — Arquitectura y Flujo de Datos V3.1
 
**Objetivo del documento: **Servir de contexto completo y autocontenido para retomar este tema (por ti o por otro chat/LLM) sin perder el razonamiento seguido, las decisiones tomadas y por qué se tomaron.
 
## Índice
 
- 1. Resumen ejecutivo
 
- 2. Contexto: qué hace el script y por qué existe
 
- 3. Glosario de variables globales
 
- 4. Problema 1 — Shadowing de "sheet_Mov" (bloqueo total)
 
- 5. Problema 2 — Correspondencia de columnas incompleta
 
- 6. Problema 3 — Rendimiento: de 9 minutos a segundos
 
- 7. Hipótesis del usuario y su validación empírica
 
- 8. Estado actual del código
 
- 9. Pendientes y próximos pasos
 
- 10. Diario de decisiones (razonamiento completo)
 
- 11. Medición de la Hipótesis 1 — resultados de 4 pruebas
 
- 12. Revisión crítica del código final y correcciones aplicadas
 
- 13. Riesgo de reordenamiento de filas — análisis y resolución
 
- 14. Estado actual y pendientes (actualizado)
 
- 15. Diario de decisiones — continuación
 
# 1. Resumen ejecutivo
 
En esta sesión se depuró y optimizó el script de Apps Script "procesarLoteBancos", responsable de archivar en BD_Banco los movimientos bancarios ya validados manualmente en Movimientos_cuenta. Se identificaron y corrigieron tres problemas independientes, y se cerró con una validación empírica de dos hipótesis del usuario sobre el comportamiento futuro del rendimiento.
 
| **Problema** | **Causa raíz** | **Resultado** |
| --- | --- | --- |
| Script no arrancaba (línea 34) | Shadowing: el parámetro "sheet_Mov" de la función tapaba la constante global del mismo nombre | Resuelto — función sin parámetro, usa la global directamente |
| Solo se copiaba Def_UID a BD_Banco | Correspondencia de columnas Movimientos↔BD_Banco incompleta en el código | Resuelto — mapeo completo de 11 columnas |
| Ejecución de ~9 minutos para 4 filas | Lecturas/escrituras fila a fila en BD_Banco (N llamadas) + 8 llamadas sueltas de getFormula() | Mejorado a ~4 s de procesamiento propio (batch). Persiste un coste fijo de 60-90 s ajeno al script |
 
Conclusión principal: tras optimizar el código del script al máximo razonable, el cuello de botella dominante ya NO está en el script, sino en el tiempo que Google Sheets tarda en abrir el archivo y resolver el recálculo pendiente de sus fórmulas antes de devolver el control a Apps Script (evidenciado por los ~43 s que tarda un simple "openById"). Esto apunta a la carga estructural de fórmulas del propio Spreadsheet (en particular la fórmula C0 de punteo en Movimientos_cuenta!O) como el siguiente foco de optimización, ya fuera del ámbito de este script.
 
Actualización de esta versión (continuación de la misma jornada): se midió la Hipótesis 1 con 4 pruebas (sin resultado concluyente todavía, ver sección 11), se hizo una revisión crítica completa del script consolidado que detectó y corrigió la desincronización de la lógica de reanudación con el nuevo modelo de batch (sección 12), y se resolvió — mediante protección nativa de hojas en Google Sheets, ya aplicada — el riesgo de que un reordenamiento manual de filas rompiera el invariante del que depende todo el diseño por offset (sección 13).
 
# 2. Contexto: qué hace el script y por qué existe
 
## 2.1 Objetivo funcional
 
"procesarLoteBancos" automatiza el paso de archivado definitivo de movimientos bancarios: cuando en la hoja Movimientos_cuenta el operador (H0) marca la casilla de la columna V ("BD", trigger) como TRUE en la primera fila pendiente, el script toma ese movimiento (y todos los TRUE consecutivos que le sigan, hasta un máximo por lote) y:
 
- Copia los datos de control y clasificación (fórmulas ya resueltas en Movimientos_cuenta) a la fila correspondiente en BD_Banco.
 
- Marca esa fila de BD_Banco como "Definitivo = TRUE" — el sello de que el movimiento ya está procesado y archivado.
 
- Borra la fila ya procesada de Movimientos_cuenta, dejando la hoja con solo los movimientos pendientes de revisión.
 
- Restaura las fórmulas de la nueva fila 2 (las que se "desplazan hacia arriba" tras el borrado) para que la hoja siga funcionando con normalidad.
 
Esto conecta directamente con la Arquitectura de Datos general del proyecto: Movimientos_cuenta actúa como "mesa de trabajo" activa donde ocurre el punteo (C0) y la validación humana (H0), mientras que BD_Banco es el histórico permanente e inmutable. El script es, en esencia, el puente de "graduación" de un movimiento desde estado activo/editable a estado archivado/histórico.
 
## 2.2 Por qué existe (motivación de diseño)
 
- Mantener Movimientos_cuenta ligera reduce la carga de cálculo de la fórmula C0 (punteo), que es pesada y se ejecuta por cada fila activa.
 
- Evita mezclar en una misma hoja movimientos "en revisión" con movimientos "ya cerrados", mejorando la claridad operativa para H0/H2.
 
- El diseño es idempotente y reanudable: si el script falla a mitad de ejecución (por ejemplo por timeout de 6 min de Apps Script), al relanzarse detecta el estado exacto en el que quedó (fila ya escrita en BD_Banco pero no borrada de Movimientos_cuenta) y continúa desde ahí sin duplicar ni perder datos.
 
## 2.3 Estructura general del flujo (PASO 0 a PASO 5)
 
| **Paso** | **Función** |
| --- | --- |
| 0 | Evaluar reanudación: ¿la fila 2 ya quedó archivada en BD_Banco en un intento anterior fallido? Si sí, salta directo a limpieza. |
| 1 | Contar cuántas filas consecutivas tienen la casilla V = TRUE, hasta el límite MAX_FILAS_LOTE (50). |
| 2 | Feedback visual al usuario (toast + resaltado amarillo de la zona en proceso). |
| 3 | Capturar las fórmulas de la fila 2 (columnas H:O) antes de que el borrado las desplace. |
| 4 | Volcado del lote a BD_Banco: para cada fila con UID coincidente, copiar los 11 campos correspondientes y marcar Definitivo = TRUE. |
| 5 | Borrado atómico de las filas procesadas en Movimientos_cuenta + restauración de fórmulas en la nueva fila 2. |
 
# 3. Glosario de variables globales
 
Definidas en el archivo de configuración global, compartido por todos los scripts del proyecto.
 
## 3.1 Identificadores de documento y hojas
 
| **Variable** | **Descripción** |
| --- | --- |
| ss_id / ss | ID del Spreadsheet y objeto Spreadsheet abierto (SpreadsheetApp.openById). |
| gid_Mov / sheet_Mov | gid y objeto de la hoja Movimientos_cuenta_0087231. |
| gid_BDB / sheetBDB | gid y objeto de la hoja BD_Banco. |
| sheetMovimientos | ⚠️ Duplicado exacto de sheet_Mov (mismo gid). No se usa en el script. Candidato a eliminar — genera una llamada API redundante en cada ejecución. |
 
## 3.2 Columnas de Movimientos_cuenta (1-based)
 
| **Constante** | **Col.** | **Contenido** |
| --- | --- | --- |
| Mov_UID | A | UID del movimiento (clave de emparejamiento con BD_Banco) |
| Mov_NOMBREFRA | H | NombreFactura — validación final de conciliación |
| Mov_PeriodoCobro | I | Periodo contable del movimiento |
| Mov_Decripcion | J | DescripccionMovimiento — concatenación usada por C0 y A2 (no se transfiere a BDB) |
| Mov_CFInOut | K | Clasificación CF in/out (entrada/salida de caja) |
| Mov_CFCategory | L | CF category (categoría del gasto/ingreso) |
| Mov_PlataformaPago | M | Plataforma de pago asociada |
| Mov_DEF_UID | N | Def_UID — fórmula de concatenación completa de la fila, usada como clave de reanudación |
| Mov_Autopunteo | O | Fórmula C0 — sugerencia automática de punteo (la más pesada de la hoja) |
| Mov_VALIDACION | P | Inicio de bloque manual — validación H0 de la sugerencia C0 |
| Mov_FRA_MANUAL | Q | Registro manual de UID de factura si no se acepta la sugerencia |
| Mov_PCONABLE | R | Periodo de contabilización |
| Mov_UBICACION | S | Ubicación (carpeta) de la factura |
| Mov_ID_ENVIADA | T | ID de envío de la factura |
| Mov_CARPETA | U | Carpeta de archivado |
| Mov_BD | V | Checkbox trigger — al marcarlo TRUE, dispara el archivado |
 
- numColsManuales = Mov_BD − Mov_VALIDACION + 1 → 7 columnas (P:V), el bloque de control manual que se resalta durante el procesamiento.
 
- COLUMNAS_FORMULAS = [8..15] (H:O) → columnas cuya fórmula se captura antes de borrar y se restaura después, para que la nueva fila 2 siga funcionando.
 
## 3.3 Columnas de BD_Banco (1-based)
 
| **Constante** | **Col.** | **Contenido** |
| --- | --- | --- |
| BDB_UID | A | UID del movimiento — clave de búsqueda |
| BDB_DEFINITIVO | H | Definitivo — se escribe TRUE siempre al final, como sello de "archivado completo" |
| BDB_DEF_UID | I | Def_UID — recibe Mov_DEF_UID |
| BDB_PeriodoCobro | J | recibe Mov_PeriodoCobro |
| BDB_NOMBREFRA | K | recibe Mov_NOMBREFRA |
| BDB_CFInOut | L | recibe Mov_CFInOut |
| BDB_CFCategory | M | recibe Mov_CFCategory |
| BDB_PlataformaPago | N | recibe Mov_PlataformaPago |
| BDB_Validacion | O | recibe Mov_VALIDACION |
| BDB_PCONABLE | P | recibe Mov_PCONABLE |
| BDB_UBICACION | Q | recibe Mov_UBICACION |
| BDB_ID_ENVIADA | R | recibe Mov_ID_ENVIADA |
| BDB_CARPETA | S | recibe Mov_CARPETA |
| totalColsBDB | — | sheetBDB.getLastColumn() — ancho total usado para leer/escribir la fila completa |
 
Correspondencia final validada Movimientos → BD_Banco: H→K, I→J, J→(no se transfiere), K→L, L→M, M→N, N→I, O→(no se transfiere, es la propia sugerencia), P→O, Q→(no se transfiere), R→P, S→Q, T→R, U→S.
 
# 4. Problema 1 — Shadowing de "sheet_Mov" (bloqueo total)
 
## 4.1 Síntoma
 
El script fallaba en la línea 34 ("const lastRow = sheet_Mov.getLastRow()") indicando, en apariencia, que no encontraba el valor de las variables globales.
 
## 4.2 Diagnóstico
 
La función estaba declarada como "function procesarLoteBancos(sheet_Mov) {...}", con un parámetro llamado igual que la constante global "const sheet_Mov = ss.getSheetById(gid_Mov)". En JavaScript/Apps Script, un parámetro de función siempre tiene prioridad de scope sobre una variable global del mismo nombre. Al ejecutar la función directamente desde el editor (sin pasar argumento), el parámetro local "sheet_Mov" quedaba "undefined", y por tanto "sheet_Mov.getLastRow()" fallaba — no porque la global no existiera, sino porque estaba "tapada" por el parámetro vacío. La función testManual() sí funcionaba, porque esa pasaba explícitamente la global como argumento.
 
## 4.3 Solución aplicada
 
Se eliminó el parámetro de la función; ahora usa directamente la constante global.
 
function procesarLoteBancos() {
  // ...usa sheet_Mov directamente, sin declararlo como parámetro
}
 
## 4.4 Regla general anotada para el futuro
 
Cuando una función recibe como parámetro algo que también existe como constante global con la misma finalidad: o se renombra el parámetro (ej. "hojaMov"), o se elimina el parámetro y se usa la global directamente. Mezclar ambos con el mismo nombre es la trampa. En proyectos con muchas constantes globales (como este), conviene una convención de prefijo para parámetros locales que choque menos con nombres de globales.
 
# 5. Problema 2 — Correspondencia de columnas incompleta
 
## 5.1 Síntoma
 
Tras resolver el Problema 1, el script se ejecutaba sin error, pero en BD_Banco solo se rellenaba la columna Def_UID; el resto de columnas de control quedaban vacías.
 
## 5.2 Diagnóstico
 
El código original del PASO 4 solo copiaba explícitamente 6 de los 11 campos necesarios (Def_UID, NombreFactura, PConable, Ubicación, ID_Enviada, Carpeta), dejando fuera PeriodoCobro, CF in/out, CF category, PlataformaPago y Validación. Además, se detectó que faltaba declarar la constante "Mov_CFCategory" (columna L) en el archivo de variables globales — había un hueco entre Mov_CFInOut (K) y Mov_PlataformaPago (M).
 
## 5.3 Solución aplicada
 
- Se añadió la constante que faltaba: Mov_CFCategory = 12 (columna L).
 
- Se completó la correspondencia de las 11 columnas en el volcado a BD_Banco, validada explícitamente por el usuario: H/K, I/J, K/L, L/M, M/N, N/I, P/O, R/P, S/Q, T/R, U/S.
 
La columna J (DescripccionMovimiento) se confirmó como intencionadamente excluida — no tiene columna equivalente de destino en BD_Banco.
 
# 6. Problema 3 — Rendimiento: de 9 minutos a segundos
 
## 6.1 Síntoma inicial
 
Con la lógica ya funcionalmente correcta, procesar un lote de solo 4 filas tardaba aproximadamente 9 minutos (ritmo de 1-2 minutos por fila), con el patrón de logs mostrando una escritura completa en BD_Banco entre cada log de "fila archivada".
 
## 6.2 Primera optimización — batch de lectura/escritura en BD_Banco
 
Causa identificada: el bucle del PASO 4 hacía, por cada fila del lote, una lectura ("getRange(...).getValues()") y una escritura ("setValues(...)") independientes contra BD_Banco. Cada llamada de escritura dispara un recálculo de las fórmulas dependientes de esa hoja (ARRAYFORMULA, QUERY, INDIRECT, etc.), y ese recálculo — no la transferencia de datos en sí — es lo que consumía el tiempo.
 
Solución: separar "decidir qué escribir" (barato, en memoria) de "escribir" (caro, llamada API). Se sustituyó el bucle de N lecturas + N escrituras por una única lectura de bloque + una única escritura de bloque para todo el lote.
 
Refinamiento posterior (aportado por el usuario): dado que Movimientos_cuenta y BD_Banco comparten el mismo orden de UIDs sin excepción (con el offset de las filas ya eliminadas de Movimientos_cuenta), no hace falta buscar la fila destino de cada UID individualmente. Basta con localizar la fila de la primera coincidencia una sola vez; el resto del lote se resuelve por simple desplazamiento (offset), eliminando el bucle de emparejamiento completo.
 
// PASO 4 — versión final
const sheet_Mov_DataProcessing = sheet_Mov.getRange(2, 1, numFilasAProcesar, Mov_BD).getValues();
 
const primerUID = String(sheet_Mov_DataProcessing[0][Mov_UID - 1]).trim();
const mapaUidsBDB = obtenerMapaFilasBDB(sheetBDB, BDB_UID);
const filaInicioBDB = mapaUidsBDB.get(primerUID);
 
const rangoBloqueBDB = sheetBDB.getRange(filaInicioBDB, 1, numFilasAProcesar, totalColsBDB);
const matrizBDB = rangoBloqueBDB.getValues();          // 1 lectura para todo el lote
 
for (let i = 0; i < numFilasAProcesar; i++) {
  const filaOrigen = sheet_Mov_DataProcessing[i];
  const datosMemoria = matrizBDB[i];                    // correspondencia directa por offset
  // ...asignación de los 11 campos (H/K, I/J, K/L, L/M, M/N, N/I, P/O, R/P, S/Q, T/R, U/S)...
  datosMemoria[BDB_DEFINITIVO - 1] = true;               // al final
}
 
rangoBloqueBDB.setValues(matrizBDB);                     // 1 escritura para todo el lote
 
Aviso de diseño anotado (no bloqueante): al basarse en offset y no en verificación de UID fila a fila, si el invariante de orden se rompiera algún día (p. ej. una fila insertada manualmente en BD_Banco), el script escribiría en la fila equivocada sin lanzar ningún error — desalineación silenciosa. Queda documentado como punto de partida de depuración si algo raro ocurriera en el futuro, sin necesidad de blindarlo ahora.
 
## 6.3 Segunda optimización — captura de fórmulas en batch
 
Causa identificada: "capturarFormulas" hacía 8 llamadas independientes a "getFormula()" (una por cada columna de COLUMNAS_FORMULAS), incluyendo la columna O (fórmula C0, la más pesada de la hoja).
 
Solución: como las 8 columnas (H:O) son contiguas, se sustituyó por una única llamada "getFormulas()" sobre el rango completo.
 
function capturarFormulas(sheet_Mov) {
  const primeraCol = COLUMNAS_FORMULAS[0];
  const numCols = COLUMNAS_FORMULAS.length;
  const formulasFila = sheet_Mov.getRange(2, primeraCol, 1, numCols).getFormulas()[0];
  // [0] porque getFormulas() siempre devuelve una matriz 2D (filas × columnas),
  // aunque el rango leído sea de una sola fila.
 
  return COLUMNAS_FORMULAS.map((col, i) => ({ columna: col, formula: formulasFila[i] }));
}
 
## 6.4 Hallazgo clave: el cuello de botella real no estaba en el script
 
Para localizar con precisión dónde se iba el tiempo, se instrumentó el código con timestamps (Logger.log con new Date().toISOString()) en cada paso, incluyendo la apertura del propio Spreadsheet. Resultado de la medición decisiva:
 
| **Tramo** | **Tiempo** | **¿Depende del código del script?** |
| --- | --- | --- |
| openById (abrir el Spreadsheet) | ~43 s | No |
| capturarFormulas (incluso ya en batch) | ~40 s | No (tras el fix de batch, el tiempo no bajó) |
| Lectura + emparejamiento + escritura BD_Banco (PASO 4) | ~2-4 s | Sí — ya optimizado |
 
Conclusión: el 85-90% del tiempo total de ejecución no depende de las llamadas API que genera el script, sino de que Google Sheets no libera el control hasta terminar de resolver el recálculo de fórmulas pendiente del Spreadsheet — y esto ocurre incluso al abrir el archivo, antes de que el script pida ningún dato. La sospecha principal, coherente con el documento de Arquitectura, es la fórmula de punteo C0 (Movimientos_cuenta!O), que anida LET + QUERY + INDIRECT + MATCH y se ejecuta por cada fila activa de la hoja.
 
## 6.5 Evolución de los tiempos de ejecución a lo largo de la sesión
 
| **Prueba** | **Filas** | **Resultado** |
| --- | --- | --- |
| Inicial (sin batch) | 4 | ~9 minutos (1-2 min por fila) |
| Tras batch PASO 4 | 3-4 | ~96 segundos totales; PASO 4 ya en ~1-4 s |
| Tras batch capturarFormulas | 3 | ~97 s totales — sin mejora, confirma que el cuello estaba fuera del script |
| Prueba de carga (Hipótesis 2) | 50 (de 52 marcadas) | Corte en 50 exacto y correcto; tramo que escala con el lote: <1 s adicional frente a 3 filas |
 
# 7. Hipótesis del usuario y su validación empírica
 
## 7.1 Hipótesis 1 — "El script se acelerará de forma inversamente proporcional a las filas restantes"
 
**Planteamiento del usuario: **Movimientos_cuenta concentra tanto el mayor volumen de fórmulas como las más pesadas a nivel de cálculo (haciendo el resto de hojas, comparativamente, irrelevante). Por tanto, menos filas en Movimientos_cuenta implica menos recálculo, y el objetivo de mantener la hoja "limpia" (solo filas pendientes de revisión) debería traducirse en una mejora de rendimiento sostenida.
 
**Validación: **Dirección correcta, confirmada como razonable dado el diseño de la fórmula C0 (LET anidado con QUERY + INDIRECT + MATCH + lógica anti-duplicados, ejecutada por cada fila activa). Sin embargo, se matizó la forma exacta de la relación:
 
- "Inversamente proporcional" (y = k/x) implica una curva concreta y uniforme; el coste real por fila de C0 no es constante (depende del número de coincidencias devueltas por la QUERY interna y de la posición en el rango anti-duplicados), por lo que es más plausible una tendencia decreciente con forma superlineal en el peor caso, no una inversa matemática pura.
 
- Otras hojas del ecosistema (HistorialFacturas, AsigCostes/PProveedores, CashFlowDin.Table, Google!, Nexmo!, Compr.Fras.Manual) no dependen del tamaño de Movimientos_cuenta que el script vacía — dependen de sus propios tamaños, que tienden a crecer con el tiempo (más facturas, más histórico).
 
- Movimientos_cuenta no solo se vacía por este script — también recibe entradas nuevas constantemente vía A1 (importación automática), por lo que el "neto" de filas podría no tender a cero de forma limpia.
 
**Conclusión acordada: **el tiempo dependerá de la carga de cálculo agregada de todo el Spreadsheet, de la cual Movimientos_cuenta es el mayor contribuyente pero no el único. Pendiente de confirmación con mediciones a lo largo de varios días (ver sección 9).
 
## 7.2 Hipótesis 2 — "Procesar 3 filas vs 50 no debería aumentar significativamente el tiempo"
 
**Planteamiento del usuario: **dada la ubicación de los cuellos de botella (fuera del bucle de procesamiento), el tamaño del lote no debería impactar de forma relevante el tiempo total.
 
**Validación: **CONFIRMADA EMPÍRICAMENTE. Se ejecutó una prueba de carga marcando 52 casillas (para forzar también la comprobación del corte en MAX_FILAS_LOTE = 50):
 
- El script se detuvo exactamente en la fila 50, tal como se esperaba por diseño.
 
- El tramo que escala con el tamaño del lote (lectura de bloque + bucle en memoria + escritura de bloque) tardó menos de 1 segundo adicional al pasar de 3 a 50 filas — diferencia indistinguible del ruido de medición normal entre ejecuciones.
 
- El coste fijo (openById + capturarFormulas) se mantuvo igual de dominante (~85-90 s) independientemente del tamaño del lote.
 
**Implicación práctica derivada: **como el coste de "arrancar" el script es fijo y dominante, y el coste de procesar filas dentro del lote es marginal, conviene procesar siempre el máximo posible por ejecución (MAX_FILAS_LOTE = 50 ya va en la dirección correcta) en vez de ejecutar con más frecuencia y lotes pequeños. Cada ejecución "paga" el mismo peaje fijo de ~70-90 s, así que menos ejecuciones con lotes grandes es estrictamente mejor que más ejecuciones con lotes pequeños.
 
# 8. Estado actual del código
 
- procesarLoteBancos() ya no recibe sheet_Mov como parámetro — usa la constante global directamente.
 
- PASO 4 reescrito: localiza la fila de inicio en BD_Banco mediante un único lookup del primer UID, y resuelve el resto del lote por offset directo (sin bucle de emparejamiento ni lecturas/escrituras individuales).
 
- Correspondencia completa de 11 columnas entre Movimientos_cuenta y BD_Banco, incluyendo la constante Mov_CFCategory que faltaba declarar.
 
- capturarFormulas() reescrita para usar una sola llamada getFormulas() sobre el rango contiguo H:O, en vez de 8 llamadas getFormula() sueltas.
 
- Instrumentación de diagnóstico (Logger.log con timestamps) añadida temporalmente durante la sesión — se mantienen activos G0/G1 (openById) y T4/T5 (capturarFormulas) de forma deliberada para continuar la medición de la Hipótesis 1 en próximas sesiones; el resto de checkpoints (T0-T3, T6-T8, G2-G4) quedan comentados.
 
- Nota: este bloque se amplía y corrige en la sección 12, que recoge el código final consolidado tras la revisión crítica de la continuación de la sesión — en particular, el fix de la lógica de reanudación (sección 12.2).
 
# 9. Pendientes y próximos pasos (versión original — ver sección 14 para el estado actualizado)
 
### 9.1 Limpieza de código (bajo esfuerzo)
 
- Eliminar la constante "sheetMovimientos" (duplicado exacto de sheet_Mov, sin uso, genera una llamada API redundante en cada ejecución). [RESUELTO — ver sección 12: se dejó comentada en el archivo de variables globales].
 
- Decidir si se retiran los Logger.log de diagnóstico (T0-T8, G0-G4) o se dejan comentados para reutilizarlos en próximas auditorías de rendimiento. [RESUELTO — se decidió mantener G0/G1 y T4/T5 activos, ver sección 8].
 
### 9.2 Investigación del cuello de botella estructural (medio esfuerzo, mayor impacto)
 
- Confirmar el modo de recálculo del Spreadsheet (Archivo → Configuración de la hoja de cálculo → Cálculo).
 
- Aislar qué fórmula concreta es la más costosa (candidata principal: C0 en Movimientos_cuenta!O) — método propuesto: copiar temporalmente la columna como valores y medir cuánto tarda el Spreadsheet en "asentarse".
 
- Evaluar, a medio plazo, mover parte de la lógica de C0 desde fórmulas de Sheets a Apps Script (cálculo en memoria, sin depender del motor de recálculo de la hoja) — línea ya apuntada en el propio documento de Arquitectura, sección "Recomendaciones para la Optimización de Sistemas". [SIGUE PENDIENTE — no abordado en la continuación de esta sesión, ver sección 14].
 
### 9.3 Validación pendiente de la Hipótesis 1 con datos reales
 
- Registrar tiempos de ejecución en varios días distintos, anotando en cada caso el número de filas de Movimientos_cuenta y, si es posible, de las hojas dependientes que crecen con el tiempo (HistorialFacturas, AsigCostes, etc.), para confirmar si la reducción de filas en Movimientos_cuenta se traduce en una mejora sostenida de rendimiento o si queda compensada por el crecimiento de otras hojas. [EN CURSO — ver sección 11: primeras 4 mediciones realizadas, sin resultado concluyente todavía].
 
### 9.4 Integridad de datos — CashFlowDin.Table (a futuro, sin prisa, ya anotado por el usuario)
 
- El documento de Arquitectura indica que CashFlowDin.Table agrega el campo Importe de Movimientos_cuenta. Si esto es literal, cada borrado de filas ya procesadas (que hace justamente este script) haría desaparecer esos movimientos del Cashflow, salvo que la tabla dinámica en realidad deba leer de BD_Banco (que sí conserva todo permanentemente).
 
- El usuario ya tiene esto identificado: el objetivo a futuro es que la fuente sea BD_Banco (y posiblemente también Movimientos_cuenta); pendiente de planificar el rediseño, sin urgencia. [SIGUE PENDIENTE, sin cambios].
 
# 10. Diario de decisiones (razonamiento completo)
 
Recogido en formato "valoré X por razón Y, pero Z / decisión final" para que el histórico de lógica quede explícito y reutilizable.
 
### 10.1 Sobre el parámetro sheet_Mov
 
- Valoré mantener el parámetro y simplemente renombrarlo (ej. "hojaMov") para preservar la idea original de "función pura" que recibe su dependencia. No se llevó a cabo porque, dado que sheet_Mov es una constante fija de todo el proyecto (no cambia entre llamadas ni se reutiliza la función con otra hoja), no aportaba ningún beneficio real frente a usar la global directamente, y sí añadía riesgo de repetir el mismo error de shadowing en el futuro.
 
- Decisión final: eliminar el parámetro y usar la global directamente.
 
### 10.2 Sobre la estrategia de batch en BD_Banco
 
- Valoré una primera versión con Math.min/Math.max sobre las filas destino de cada match, más una salvaguarda de "bloque disperso" con un camino de respaldo fila a fila, por si las coincidencias no fueran consecutivas. No se llevó a cabo en su forma completa porque el usuario confirmó que, por diseño del sistema (mismo orden de UIDs entre Movimientos_cuenta y BD_Banco, con offset por las filas ya eliminadas), las coincidencias son SIEMPRE consecutivas — lo que hace innecesaria la salvaguarda de dispersión.
 
- Valoré, tras esa confirmación, simplificar a "fila de la primera coincidencia + numFilasAProcesar − 1" (propuesta del usuario). Se ajustó ligeramente: anclar el cálculo al primer y último elemento del array de coincidencias reales ("matches"), en vez de al total de numFilasAProcesar, para no leer/escribir una fila de más en el caso (raro pero posible) de que alguna fila del lote se descarte por falta de UID o de coincidencia.
 
- Decisión final (con el segundo refinamiento del usuario): ya que todas las UIDs de Movimientos_cuenta se encuentran siempre en BD_Banco sin excepción, ni siquiera hace falta construir el emparejamiento completo — basta con localizar la fila de la primera coincidencia una única vez, y resolver el resto por offset directo. Se eliminó el bucle de matching por completo, dejando la solución más simple posible dado el invariante de diseño confirmado.
 
- Aviso documentado (no bloqueante): esta solución por offset asume el invariante de orden como verdad absoluta; si algún día se rompiera (edición manual en BD_Banco, desincronización), el script escribiría en la fila equivocada sin lanzar error. Se decidió no blindar esto ahora porque el invariante está confirmado dos veces por el usuario y añadir protección aquí sería complejidad prematura — queda anotado como primer punto a revisar si en el futuro aparece un comportamiento anómalo.
 
### 10.3 Sobre el diagnóstico del cuello de botella de rendimiento
 
- Valoré, tras el primer batch (PASO 4), dar el problema por resuelto — el tiempo bajó de 9 min a 96 s, una mejora notable. No se dio por cerrado porque el patrón de logs mostraba una "pausa" de ~90 s antes incluso de llegar al primer paso del código, señal de que quedaba un cuello de botella sin explicar.
 
- Valoré la hipótesis de que capturarFormulas (8 llamadas sueltas) era la causa principal del tramo lento. Se instrumentó con timestamps para confirmarlo antes de asumirlo. El batch de capturarFormulas SÍ era una mejora de código correcta (menos llamadas API), pero los tiempos no bajaron tras aplicarlo — lo cual descartó la hipótesis de "el problema es el número de llamadas API" y apuntó a algo más estructural.
 
- Decisión final: instrumentar también la apertura del Spreadsheet (openById) como prueba definitiva. El resultado (~43 s solo para abrir el archivo, sin tocar ningún dato) confirmó que el cuello de botella real es el tiempo que Sheets tarda en resolver su recálculo de fórmulas pendiente antes de devolver el control a cualquier llamada — un problema de carga estructural del Spreadsheet, no del código del script. Se dejó explícitamente fuera del alcance de esta sesión de optimización de código, y anotado como línea de investigación futura (sección 9.2).
 
### 10.4 Sobre las dos hipótesis del usuario
 
- Hipótesis 1 (relación inversa filas-rendimiento): valorada como razonable en dirección pero se matizó la forma exacta de la curva (superlineal decreciente probable, no inversa pura), y se señaló que otras hojas del ecosistema crecen de forma independiente a Movimientos_cuenta, por lo que la mejora neta a largo plazo no está garantizada solo por vaciar esta hoja. Queda pendiente de confirmación empírica con mediciones a lo largo de varios días.
 
- Hipótesis 2 (3 filas vs 50 filas, mismo tiempo): confirmada con datos reales mediante una prueba de carga deliberada (52 casillas marcadas). Se comprobó tanto el corte correcto en MAX_FILAS_LOTE = 50 como que el tramo que escala con el lote añade menos de 1 segundo al pasar de 3 a 50 filas. De aquí se derivó una recomendación operativa: preferir lotes grandes y pocas ejecuciones frente a lotes pequeños y ejecuciones frecuentes, dado que el coste fijo de arranque (~70-90 s) se paga en cada ejecución independientemente del tamaño del lote.
 
# **11. Medición de la Hipótesis 1 — resultados de 4 pruebas**
 
Recordatorio de la Hipótesis 1: "el script se acelerará de forma inversamente proporcional a las filas restantes en Movimientos_cuenta, dado que esta hoja concentra el mayor volumen de fórmulas y las más pesadas a nivel de cálculo (en particular C0)".
 
## 11.1 Método
 
Se instrumentó el script con timestamps en los puntos G0 (antes de openById), G1 (después de openById), T4 (antes de capturarFormulas) y T5 (después de capturarFormulas), además de Inicio y Fin de la ejecución completa. Se realizaron 4 ejecuciones consecutivas en la misma jornada, reduciendo el volumen de Movimientos_cuenta entre cada una.
 
## 11.2 Datos brutos y tramos calculados
 
| **Filas** | **Inicio→G0** | **G0→G1 (openById)** | **G1→T4** | **T4→T5 (capturarFormulas)** | **T5→Fin** | **Total** |
| --- | --- | --- | --- | --- | --- | --- |
| 2321 | 7 s | 40 s | 2 s | 37 s | 0 s | **86 s** |
| 2271 | 7 s | 39 s | 3 s | 40 s | 2 s | **91 s** |
| 2221 | 7 s | 34 s | 2 s | 37 s | 1 s | **81 s** |
| 2171 | 7 s | 35 s | 3 s | 36 s | 1 s | **82 s** |
 
Nota sobre el primer registro: la fila de 2321 filas se recogió inicialmente con un error de transcripción manual (T4/T5/Fin mal anotados); fue corregida por el usuario antes de continuar con las siguientes pruebas. Los valores de la tabla ya reflejan la corrección.
 
## 11.3 Lectura de los resultados
 
- El rango de reducción de filas entre la primera y la última prueba fue de 2321 → 2171, es decir, una caída del 6,5%.
 
- El tiempo total osciló entre 81 s y 91 s, sin una tendencia monótona decreciente clara: 86 → 91 → 81 → 82.
 
- El tramo G0→G1 (openById) mostró una leve tendencia a la baja (40 → 39 → 34 → 35 s) pero con un salto no lineal entre la 2ª y 3ª prueba.
 
- El tramo T4→T5 (capturarFormulas) se mantuvo prácticamente plano (37 → 40 → 37 → 36 s), sin tendencia visible.
 
**Conclusión de esta ronda: **no hay evidencia suficiente para confirmar ni refutar la Hipótesis 1 con este rango de datos. La variación de filas (6,5%) es demasiado pequeña frente al ruido normal de medición (variabilidad de red, estado momentáneo de los servidores de Google, actividad concurrente en el documento) para que un efecto real, si existe, se distinga con claridad. Se necesitaría o bien un rango de reducción mucho mayor (varios cientos o miles de filas de diferencia) o bien muchas más mediciones en el mismo rango para que una tendencia estadística emerja del ruido.
 
## 11.4 Observación adicional del usuario, pendiente de más datos
 
El usuario señaló que la reducción porcentual de G0→G1 entre la primera y la última prueba (aprox. 6-7%) es numéricamente parecida a la reducción porcentual de filas (6,5%), y preguntó si esto podría ser indicio de una relación proporcional. Se acordó tratarlo como una observación a vigilar, no como una conclusión — con solo 4 puntos y un rango de variación tan pequeño, la coincidencia de cifras del mismo orden de magnitud es compatible tanto con una relación real como con el azar. Pendiente de más rango y más puntos para confirmar.
 
## 11.5 Próximos pasos para esta hipótesis
 
- Repetir la medición con un rango de reducción de filas mucho mayor (p. ej., de varios miles a unos cientos), no solo un 6-7%.
 
- Aumentar el número de mediciones por rango para poder calcular una tendencia o promedio móvil que filtre el ruido.
 
- Mantener la cadencia entre pruebas similar en cada sesión de medición, evitando pausas largas que puedan introducir el efecto "primera ejecución tras reposo" como variable de confusión.
 
# **12. Revisión crítica del código final y correcciones aplicadas**
 
Tras confirmar el estado del código con todas las optimizaciones de la primera parte de la sesión ya integradas (batch por offset, captura de fórmulas en batch, sin parámetro sombreado), se realizó una revisión crítica completa a petición del usuario, buscando vulnerabilidades más allá del rendimiento: robustez, UX, y riesgos de integridad de datos.
 
## 12.1 Hallazgos y su resolución
 
| **Hallazgo** | **Decisión del usuario** | **Estado** |
| --- | --- | --- |
| testManual() roto (llama a onEditInstalable, que está comentado) | Solo relevante si se retoma el uso del trigger; no planeado a medio plazo | Aceptado sin cambio, documentado |
| PASO 0 (reanudación) desincronizado del batch: solo limpiaba 1 fila aunque el crash ocurriera a mitad de un lote de hasta 50 | Corregir contando filas consecutivas con Definitivo=TRUE desde el punto de coincidencia, no asumiendo solo 1 | Resuelto — ver 12.2 |
| catch solo limpia el resaltado de la fila 2, no de todo el lote resaltado | Irrelevante: al borrar las filas, el formato desaparece igualmente. Se puede quitar el setBackground(null) sin consecuencias | Aceptado, sin acción necesaria |
| Fallo de lock (otra ejecución en curso) no avisa al usuario, solo hace Logger.log | Solo relevante si se activa el trigger de edición automática | Aceptado sin cambio, documentado |
| Inicialización global (ss, sheetBDB, totalColsBDB) sin try/catch; cualquier función del proyecto paga el coste y el riesgo | Intencionado: no hay ni se prevén otros scripts que no usen Movimientos_cuenta. El fallo ante gid inválido es deseado — el gid es inmutable, el nombre de hoja no, por eso se ancla al gid | Aceptado por diseño |
| getLastRow() sigue expuesto al problema de "filas fantasma" (fórmulas sin datos por debajo de los datos reales) | Anotar para revisión futura | Pendiente — ver sección 14 |
| Sin validación de que los UIDs realmente coincidan entre Movimientos_cuenta y BD_Banco tras pasar a offset puro | Anotar para contemplar; propuesta inicial: comparar UID de cada fila desde la segunda contra el bloque leído de BD_Banco | Superado por la solución de la sección 13 (protección de hojas) |
| Typo "Mov_Decripcion", instrumentación de logs con comentado irregular, espaciado con tabulación irregular | Typo apuntado para corregir; logs de G0/G1/T4/T5 dejados activos intencionadamente para seguir midiendo H1; resto "irrelevante" | Aceptado / pendiente menor |
 
## 12.2 Fix aplicado — reanudación por bloque, no por fila única
 
Se sustituyó la lógica original del PASO 0 (que asumía que, tras un crash, como mucho 1 fila había quedado archivada en BD_Banco) por una versión que cuenta cuántas filas consecutivas desde el punto de coincidencia ya tienen Definitivo = TRUE, y limpia ese bloque completo de una vez — coherente con que el volcado ahora se hace en batch (hasta 50 filas de golpe), no fila a fila.
 
if (yaArchivado === true) {
  // Contar filas consecutivas ya archivadas desde el punto de coincidencia
  // (cubre que el crash ocurriera a mitad del batch, no solo en la fila 1)
  const limiteReanudacion = Math.min(MAX_FILAS_LOTE, lastRow - 1);
  const bloqueDefinitivo = sheetBDB.getRange(filaMatchUids_Reviewed, BDB_DEFINITIVO, limiteReanudacion, 1).getValues();
  let numFilasYaArchivadas = 0;
  for (let i = 0; i < bloqueDefinitivo.length; i++) {
    if (bloqueDefinitivo[i][0] === true) numFilasYaArchivadas++;
    else break;
  }
  Logger.log(`REANUDACIÓN: ${numFilasYaArchivadas} fila(s) ya archivada(s) — limpiando de golpe.`);
  const formulasGuardadas = capturarFormulas(sheet_Mov);
  limpiarYRestaurar(sheet_Mov, numFilasYaArchivadas, formulasGuardadas, numColsManuales, lastRow);
  ss.toast(`Reanudación completada. ${numFilasYaArchivadas} fila(s) limpiada(s).`, "✅ Reanudado", 5);
  return;
}
 
Aclaración sobre la mecánica del bucle (consulta explícita del usuario, para que quede documentado): bloqueDefinitivo.length NO es el resultado — es solo el límite del bucle ("no leas más allá de lo que se trajo de la hoja"). El conteo real ocurre en numFilasYaArchivadas, que se incrementa de uno en uno solo mientras el valor es TRUE, y se detiene en el primer FALSE gracias al break. Es el mismo patrón que ya usa el PASO 1 para contar los checkboxes TRUE consecutivos.
 
## 12.3 Riesgo evaluado y descartado — ventana entre deleteRows() y restaurarFormulas()
 
Se planteó como hallazgo un posible riesgo: si el script falla justo entre el deleteRows() y el restaurarFormulas() (dentro de limpiarYRestaurar), la fila 2 quedaría sin las fórmulas de control (columnas H:O), dejando la hoja parcialmente rota. La primera estimación de severidad fue incorrecta — se asumió, por extrapolación del tiempo de openById (40 s), que esta ventana podía ser de una magnitud similar.
 
Al revisar los datos reales medidos en las 4 pruebas de la Hipótesis 1, se comprobó que el tramo T5→Fin (que incluye TODO el PASO 4 + PASO 5, del cual deleteRows()+restaurarFormulas() es solo una fracción) dura entre 0 y 2 segundos en total. La estimación de riesgo se corrigió: la ventana real es una fracción de segundo, no una ventana de decenas de segundos. La calificación original del usuario ("caso casi imposible por velocidad de procesamiento") resultó ser la más ajustada a los datos reales.
 
**Decisión: **se documenta una mejora opcional de bajo coste (usar Range.copyTo() con CopyPasteType.PASTE_FORMULA desde una fila donante, en vez de hardcodear texto de fórmulas, para que la reparación se adapte automáticamente si la fórmula cambia en el futuro) como mejora "por qué no, ya que es fácil" — no como prioridad urgente, dado el riesgo residual mínimo confirmado con datos.
 
# **13. Riesgo de reordenamiento de filas — análisis y resolución**
 
Este fue el punto priorizado como más urgente por el usuario tras la revisión crítica: el diseño actual del PASO 4 (offset puro desde la primera coincidencia) descansa por completo en el invariante "Movimientos_cuenta y BD_Banco comparten siempre el mismo orden de UIDs". Si ese invariante se rompiera — por ejemplo, si alguien ordenara manualmente una de las dos hojas por un criterio distinto al de inserción — el script escribiría datos en filas equivocadas de forma silenciosa, sin lanzar ningún error.
 
## 13.1 Opciones de mitigación evaluadas y descartadas
 
### Opción A — Validar + fallback automático fila a fila + bloqueo preventivo
 
- Descartada. El camino de fallback fila a fila apenas se ejecutaría en la práctica (solo si el invariante se rompe), lo que lo convierte en el código con menor cobertura de pruebas reales del sistema — justo el que más necesita funcionar bien el día que se dispare. Además, un "bloqueo preventivo" de reordenamiento no es viable de forma nativa: no existe un evento fiable en Sheets/Apps Script para interceptar una acción de ordenar antes de que ocurra.
 
### Opción B — Mapear la correspondencia completa de UIDs en memoria en cada ejecución (como se hacía con las columnas)
 
- Descartada. Esto equivale a deshacer la optimización de rendimiento central de toda la sesión (pasar de "buscar cada UID individualmente" a "offset desde la primera coincidencia"). Habría recuperado seguridad a costa de perder por completo la ganancia de rendimiento lograda.
 
### Opción C (intermedia, explorada) — Verificación en memoria sin coste API + reordenamiento local si no hay saltos
 
- Se diseñó una versión que reutiliza el mapa de UIDs de BD_Banco ya construido (sin llamadas API extra) para detectar si la desalineación es una simple permutación dentro del mismo bloque ya leído ("sin saltos", recuperable gratis en memoria) o si implica filas fuera de ese bloque ("con saltos", no recuperable sin fallback fila a fila).
 
- Descartada como solución principal tras el análisis del usuario: con un reordenamiento por fecha, solo se evitarían saltos si el reordenamiento respeta límites de lote exactos — poco fiable. Con cualquier otro criterio de orden (importe, proveedor, alfabético), los saltos están casi garantizados, forzando el fallback fila a fila de todos modos. Además, un reordenamiento de la hoja probablemente causaría también errores de cálculo en otras fórmulas dependientes de posición, haciendo que la recuperación del script fuera irrelevante frente al daño mayor ya causado a la hoja.
 
## 13.2 Solución adoptada — prevención en el origen, no detección posterior
 
Conclusión compartida: dado que cualquier forma de detección/recuperación en memoria queda invalidada por un reordenamiento arbitrario, el enfoque correcto es impedir que el reordenamiento ocurra, no intentar sobrevivirlo después.
 
### Mecanismo: protección de rangos/hojas nativa de Google Sheets
 
- Google Sheets bloquea de forma nativa la opción "Ordenar rango" en la interfaz cuando el rango afectado incluye celdas protegidas para las que el usuario no tiene permiso de edición.
 
- Configuración acordada: proteger en Movimientos_cuenta las columnas A:O (datos automáticos + C0), dejando editable P:V (bloque de trabajo manual de H0). Proteger BD_Banco en su totalidad.
 
- Confirmado: la protección de rango/hoja SOLO afecta a usuarios humanos interactuando por la interfaz (o por API con las credenciales de ese usuario). NO afecta a SpreadsheetApp cuando el script se ejecuta con las credenciales del propietario/editor autorizado (incluyendo triggers instalables) — el script sigue funcionando exactamente igual tras aplicar la protección.
 
- Se descartó "ocultar la hoja" como medida alternativa o provisional: ocultar es una orden puramente visual (Ver → Hojas ocultas revierte el ocultamiento en dos clics para cualquier editor), no un control de seguridad real. No aporta nada que la protección no cubra ya mejor.
 
### Capa adicional acordada — alarma temprana (pendiente de implementar)
 
- Se documentó el trigger onChange de Apps Script como mecanismo de aviso complementario: se dispara ante cambios estructurales de la hoja (SORT, inserción/eliminación de filas, etc.) vía el parámetro changeType del evento.
 
- Naturaleza del control: es detección posterior al hecho, no prevención — el cambio ya ocurrió cuando el trigger se dispara. Sirve para notificar (ej. email), no para revertir automáticamente.
 
- Plan de reacción ante la alarma: restauración manual desde el Historial de versiones de Google Sheets (Archivo → Historial de versiones), apuntando al punto granular más cercano y anterior al incidente.
 
### Matiz importante documentado sobre la restauración por historial de versiones
 
- El historial de versiones revierte el documento completo a un punto en el tiempo, no una hoja aislada ni un cambio concreto — cualquier trabajo legítimo posterior al reordenamiento (checkboxes marcados, lotes archivados, entradas nuevas vía A1) también se perdería al restaurar.
 
- Se corrigió la estimación inicial del usuario ("máximo 24h de trabajo perdido, asumiendo una versión por día"): el historial de Sheets guarda revisiones con mayor granularidad que una vez al día (visible al expandir el detalle en el panel de historial), por lo que el margen real de pérdida, actuando con rapidez tras la alarma de onChange, debería ser de minutos, no de horas.
 
- Limitación técnica confirmada: no existe una función en SpreadsheetApp ni en la API de Sheets para restaurar una versión de forma programática con garantías — la restauración es siempre una acción manual del usuario en la interfaz. onChange puede avisar, pero no puede autorrestaurar.
 
## 13.3 Estado al cierre de esta sesión
 
**✅ COMPLETADO: **protección de rangos/hojas aplicada por el usuario en Movimientos_cuenta y BD_Banco.
 
**⏳ PENDIENTE: **implementar el trigger onChange como alarma temprana de respaldo (no se llegó a codificar en esta sesión).
 
**Decisión de simplificación: **con la protección de hojas puesta, el riesgo de reordenamiento pasa a ser de baja probabilidad real (impedido por la interfaz), no solo de baja probabilidad asumida. Por tanto, se descarta implementar la lógica de verificación/recuperación en memoria de la Opción C — un chequeo simple del primer UID (ya existente en el código, vía el ERROR CRÍTICO si filaInicioBDB no se encuentra) se considera suficiente como red de seguridad residual.
 
# **14. Estado actual y pendientes (actualizado)**
 
## 14.1 Cambios integrados en el código desde el inicio de la sesión
 
- Logging de diagnóstico G0/G1 y T4/T5 dejado activo intencionadamente (resto comentado) para continuar midiendo la Hipótesis 1 en próximas sesiones.
 
- Constante duplicada sheetMovimientos comentada (ya no se declara activa).
 
- Fix de reanudación por bloque (sección 12.2) — redactado y validado en esta sesión.
 
- Protección de rangos/hojas aplicada directamente en Google Sheets (fuera del código Apps Script) — Movimientos_cuenta (A:O) y BD_Banco (hoja completa).
 
## 14.2 Pendientes priorizados
 
| **Prioridad** | **Pendiente** | **Notas** |
| --- | --- | --- |
| Media | Implementar trigger onChange como alarma temprana ante SORT/reordenamiento estructural | Diseño ya acordado (sección 13.2); falta codificar y desplegar |
| Media | Aplicar en el .gs en producción el fix de reanudación por bloque (sección 12.2) | Código ya redactado y validado en esta sesión |
| Baja | Continuar midiendo la Hipótesis 1 con mayor rango de filas y más puntos de datos | Ver sección 11.5 |
| Baja | Sustituir getLastRow() por el helper obtenerUltimaFilaConDatos (evitar filas fantasma con fórmulas) | Helper ya escrito, queda comentado en el archivo de globales |
| Baja | Auto-reparación de fórmulas de la fila 2 con Range.copyTo(PASTE_FORMULA) desde fila donante | Riesgo residual confirmado como mínimo (sección 12.3); mejora opcional de bajo coste |
| Baja | Corregir typo Mov_Decripcion → Mov_Descripcion | Cosmético |
| Sin prisa | CashFlowDin.Table: decidir si debe leer de BD_Banco y/o Movimientos_cuenta | El usuario indicó que no es urgente |
| Investigación | Localizar la fórmula más costosa del Spreadsheet (candidata: C0 en Movimientos_cuenta!O) para atacar el cuello de botella estructural de fondo (openById ~35-40s) | Sigue vigente, sin abordar en esta sesión |
 
# **15. Diario de decisiones — continuación**
 
### 15.1 Sobre la lógica de reanudación
 
- Valoré mantener la reanudación limitada a 1 fila, asumiendo que el escenario de crash a mitad de un lote grande era poco probable. No se mantuvo así porque, con el cambio a escritura en batch de esta misma sesión, un crash a mitad de un lote de 50 dejaría hasta 49 filas mal gestionadas por la reanudación (recuperándose de una en una, en 49 ejecuciones sucesivas, en vez de una sola). Se corrigió para contar el bloque completo ya archivado, no solo la primera fila.
 
### 15.2 Sobre el riesgo entre deleteRows() y restaurarFormulas()
 
- Valoré este riesgo como significativo, por extrapolación del tiempo de apertura del Spreadsheet (openById, ~40s), asumiendo que cualquier operación de escritura podía verse afectada por recálculo pendiente de forma similar. No se sostuvo al contrastar con los datos reales medidos: el tramo que contiene íntegramente esta ventana (T5→Fin, que incluye PASO 4 completo + PASO 5 completo) dura 0-2 segundos en las 4 mediciones de la sesión. Se corrigió la estimación de severidad a la baja, validando que la valoración original del usuario ("caso casi imposible") era la más ajustada a los datos.
 
- Valoré proponer hardcodear el texto de las fórmulas como mecanismo de auto-reparación. Se ajustó a una alternativa más robusta (Range.copyTo con CopyPasteType.PASTE_FORMULA desde una fila donante) porque no requiere mantener un string sincronizado manualmente si la fórmula cambia en el futuro, y reutiliza una mecánica de Apps Script ya familiar en el proyecto. Con el riesgo real confirmado como mínimo, esta mejora queda como opcional de bajo coste, no como urgente.
 
### 15.3 Sobre el riesgo de reordenamiento — el hilo más largo de la sesión
 
- Valoré una verificación de UIDs fila a fila con fallback automático a escritura individual si se detectaba desalineación (Opción A). No se llevó a cabo porque el camino de fallback, al ejecutarse solo en el caso raro de que el invariante se rompa, sería el código con menor cobertura de pruebas reales — justo el que más necesita funcionar bien el día que se dispare. Tampoco es viable un "bloqueo preventivo" de reordenamiento a nivel de evento en Sheets/Apps Script.
 
- Valoré (propuesta del usuario) mapear la correspondencia completa de UIDs en memoria en cada ejecución, igual que se hizo con las columnas. No se llevó a cabo porque equivale a deshacer la optimización central de rendimiento lograda en la primera parte de la sesión (pasar de mapeo completo a offset desde la primera coincidencia) — se habría recuperado seguridad a cambio de perder por completo la ganancia de velocidad.
 
- Valoré una solución intermedia (propuesta del usuario, Opción C): reutilizar el mapa de UIDs de BD_Banco ya construido (sin coste API adicional) para distinguir entre desalineación "sin saltos" (permutación dentro del mismo bloque, recuperable en memoria) y "con saltos" (requiere fallback fila a fila). Llegamos a diseñar el código completo para esta opción. No se implementó porque el propio usuario razonó que, con un reordenamiento por cualquier criterio distinto a fecha exacta alineada a los límites de lote, los saltos están casi garantizados — invalidando la parte "recuperable" del diseño en la mayoría de casos reales. Además, un reordenamiento de la hoja probablemente rompería también otras fórmulas dependientes de posición, haciendo irrelevante que el script se recuperase si el resto de la hoja ya está comprometido.
 
- Decisión final: en vista de que ninguna estrategia de detección/recuperación en memoria cubre de forma fiable un reordenamiento arbitrario, se cambió el enfoque de "sobrevivir al reordenamiento" a "impedir que ocurra". Se adoptó la protección nativa de rangos/hojas de Google Sheets como mecanismo de prevención (confirmado que no afecta la ejecución del script, al operar este con credenciales de editor autorizado), descartando "ocultar la hoja" por ser un control puramente cosmético sin valor de seguridad real.
 
- Sobre el plan de contingencia si la protección fallara o se ampliaran permisos en el futuro: se valoró y aceptó un trigger onChange como alarma temprana, combinado con restauración manual vía Historial de versiones. Se corrigió la estimación inicial del usuario sobre la pérdida de datos al restaurar (de "máximo 24h asumiendo una versión diaria" a "minutos, dado que el historial de Sheets guarda revisiones con mayor granularidad de la aparente, actuando con rapidez tras la alarma"), y se documentó la limitación de que la restauración de versiones no se puede automatizar desde Apps Script — siempre requiere acción manual del usuario en la interfaz.
 
*— Fin del informe —*
