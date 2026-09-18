# Informe de sesión — Aislamiento de llamadas API y carga perezosa de variables globales

**Fecha de la sesión:** 02 de septiembre de 2026
**Documento asociado:** Arquitectura y Flujo de Datos V3.1 — Departamento Financiero (Norgenic); continúa el hilo de `Informe_Sesion_ProcesarLoteBancos_2026-07-21` (21/07/2026)
**Scripts afectados:** Archivo de Variables Globales, `Importación Bancaria` (`appendBD.gs`), `Archivar Movimientos` (`procesarLoteBancos.gs`)
**Objetivo del documento:** Servir de contexto autocontenido para que otro chat/LLM (con el código en mano) pueda llegar a las mismas conclusiones y aplicar el fix sin repetir el diagnóstico.

---

## 1. Resumen ejecutivo

El usuario reportó problemas de rendimiento persistentes en los scripts de Apps Script y planteó una hipótesis propia: que **al ejecutar una función de un archivo .gs, Apps Script evalúa también el código de nivel superior de los demás archivos del proyecto**, aunque no estén involucrados en esa ejecución concreta — generando llamadas API redundantes e innecesarias.

**La hipótesis se confirma.** En Apps Script, todo el código fuera de funciones (top-level) de **todos** los archivos `.gs` del proyecto se ejecuta antes de invocar la función objetivo, sin excepción y sin carga perezosa por archivo. Se identificaron llamadas API duplicadas y de código muerto ejecutándose en cada invocación, independientemente del script que se quisiera correr.

**Conclusión de la sesión:** se diseñó (no aplicado aún en producción) un patrón de **inicialización perezosa mediante funciones getter con caché de ejecución**, que sustituye las `const` de nivel superior por funciones que solo hacen la llamada cara la primera vez que alguien las pide dentro de esa ejecución. Esto no sustituye la investigación pendiente sobre el coste de recálculo de fórmulas de Sheets (sección 14.2 del informe del 21/07) — es un problema distinto y adicional, que se solapaba con aquel y probablemente explica parte del coste fijo (~85-90s) ya documentado.

---

## 2. Problema planteado por el usuario

Cita (resumen fiel de la intención): los scripts presentan problemas de rendimiento, probablemente por múltiples llamadas API para cargar la hoja entera; se busca **minimizar llamadas innecesarias** y **maximizar el aislamiento** — que cada script solo llame a las variables que realmente necesita, no a todas. El usuario sospechaba que ejecutar un script evalúa el resto de scripts del proyecto aunque no estén implicados.

---

## 3. Análisis: causa raíz identificada

### 3.1 Comportamiento de Apps Script (contexto necesario)

Un proyecto de Apps Script comparte un único espacio de ejecución entre todos sus archivos `.gs`. El código de nivel superior (fuera de `function`) de **cada** archivo se ejecuta como parte de la inicialización del contexto, antes de que la función solicitada empiece a correr — sin importar desde qué archivo se invoque ni si esas variables se van a usar.

### 3.2 Hallazgos concretos en el código auditado

**a) Archivo de Variables Globales — triple apertura del Spreadsheet**

```javascript
const ss = SpreadsheetApp.openById(ss_id);                              // llamada 1
const sheetBDB = SpreadsheetApp.openById(ss_id).getSheetById(gid_BDB);  // llamada 2 (openById repetido)
const sheet_Mov = SpreadsheetApp.openById(ss_id).getSheetById(gid_Mov); // llamada 3 (openById repetido)
const totalColsBDB = sheetBDB.getLastColumn();                          // llamada 4
```

`openById()` es la llamada cara (abre el archivo completo); `getSheetById()` sobre un objeto `Spreadsheet` ya abierto es barata. Aquí se paga el coste caro **tres veces** cuando bastaría con uno.

**b) `appendBD.gs` (Importación Bancaria) — trabajo de nivel superior que se ejecuta siempre, se use o no**

```javascript
let sheetBDB_Range = sheetBDB.getRange(1,1,sheetBDB.getLastRow(),sheetBDB.getLastColumn()).getValues(); // hoja BD_Banco entera
let sheetBDB_RangeUIDs = sheetBDB.getRange(1,1,sheetBDB.getLastRow(),1).getValues();
let folderMovimientosBancarios = DriveApp.getFolderById(idCarpetaDrive); // llamada a Drive
```

Estas tres líneas están fuera de cualquier función. Efecto directo: **al ejecutar `procesarLoteBancos()`** (que no tiene relación funcional con la importación), el runtime igualmente:
- lee la hoja `BD_Banco` completa con todas sus columnas,
- llama a Drive para obtener la carpeta de movimientos bancarios,

sin que ningún resultado de estas llamadas se use en esa ejecución. Además, `sheetBDB_Range` (con todas las columnas) ni siquiera se usa dentro de `appendBD()` en su propio flujo — solo se necesita la columna de UIDs para construir el `Set` de deduplicación.

### 3.3 Relación con la investigación de rendimiento previa (21/07/2026)

El informe de sesión anterior documentó un coste fijo de ~85-90s por ejecución (`openById` ~40s + `capturarFormulas` ~37-40s) y lo atribuyó al recálculo estructural de fórmulas del Spreadsheet (candidata principal: C0). Esa conclusión sigue siendo válida como hipótesis de fondo, pero **no se había aislado el coste añadido por el propio código del proyecto** (llamadas redundantes de inicialización). Es decir: el diagnóstico de julio pudo estar midiendo una mezcla de dos causas distintas —
1. recálculo estructural de fórmulas de Sheets (fuera del control del código), y
2. llamadas API redundantes de inicialización a nivel de proyecto (dentro del control del código, no auditado hasta ahora).

Esta sesión aísla y ataca la causa (2), dejando (1) como línea de investigación pendiente sin cambios.

---

## 4. Solución diseñada: inicialización perezosa con caché de ejecución

### 4.1 Principio

Sustituir las `const` de nivel superior (que se evalúan siempre, para todos los scripts) por **funciones getter** que:
- solo ejecutan la llamada API cara la primera vez que se invocan dentro de esa ejecución concreta,
- cachean el resultado en una variable de módulo (`let _x = null`) para no repetir la llamada si se piden varias veces en la misma ejecución,
- no dejan rastro entre ejecuciones distintas (cada invocación de función en Apps Script arranca un contexto nuevo, así que no hay riesgo de datos obsoletos).

### 4.2 Variables Globales — reescritura propuesta

```javascript
const ss_id = "1sZeGfiuG7Ab9jx14_-oaQZTtrhIohlx5dhYoSgZCOuw";
const gid_Mov = 1963712436;
const gid_BDB = 1089991841;

// Caché de ejecución: se rellena solo si alguien llama al getter
let _ss = null;
let _sheetMov = null;
let _sheetBDB = null;
let _totalColsBDB = null;

function getSS() {
  if (!_ss) _ss = SpreadsheetApp.openById(ss_id); // única llamada real, cacheada
  return _ss;
}
function getSheetMov() {
  if (!_sheetMov) _sheetMov = getSS().getSheetById(gid_Mov); // barato, no reabre el archivo
  return _sheetMov;
}
function getSheetBDB() {
  if (!_sheetBDB) _sheetBDB = getSS().getSheetById(gid_BDB);
  return _sheetBDB;
}
function getTotalColsBDB() {
  if (_totalColsBDB === null) _totalColsBDB = getSheetBDB().getLastColumn();
  return _totalColsBDB;
}

// Las constantes de columnas (números) NO son llamadas API — se quedan igual, sin coste
const Mov_UID = 1;
const Mov_NOMBREFRA = 8;
const Mov_PeriodoCobro = 9;
const Mov_Decripcion = 10;
const Mov_CFInOut = 11;
const Mov_CFCategory = 12;
const Mov_PlataformaPago = 13;
const Mov_DEF_UID = 14;
const Mov_Autopunteo = 15;
const Mov_VALIDACION = 16;
const Mov_FRA_MANUAL = 17;
const Mov_PCONABLE = 18;
const Mov_UBICACION = 19;
const Mov_ID_ENVIADA = 20;
const Mov_CARPETA = 21;
const Mov_BD = 22;

const numColsManuales = Mov_BD - Mov_VALIDACION + 1;
const COLUMNAS_FORMULAS = [8, 9, 10, 11, 12, 13, 14, 15];

const BDB_UID = 1;
const BDB_DEFINITIVO = 8;
const BDB_DEF_UID = 9;
const BDB_PeriodoCobro = 10;
const BDB_NOMBREFRA = 11;
const BDB_CFInOut = 12;
const BDB_CFCategory = 13;
const BDB_PlataformaPago = 14;
const BDB_Validacion = 15;
const BDB_PCONABLE = 16;
const BDB_UBICACION = 17;
const BDB_ID_ENVIADA = 18;
const BDB_CARPETA = 19;
```

**Nota clave:** `getSheetById()` no reabre el Spreadsheet — es una operación barata sobre un objeto ya cargado en memoria. Por eso el getter de `ss` es el único que hace la llamada realmente cara (`openById`), y los demás getters solo derivan de él.

### 4.3 `appendBD.gs` — reescritura propuesta

```javascript
let idCarpetaDrive = "1QL47EotyHLz4xhEssWw_MWIAvqDKcsg1";
let filaInicioDatosImportados = 4;

function getMovimientosBancarios() {
  const folderMovimientosBancarios = DriveApp.getFolderById(idCarpetaDrive); // movido dentro de la función
  Logger.log(folderMovimientosBancarios.getFiles());
  var listMovim = folderMovimientosBancarios.getFilesByType("application/vnd.google-apps.spreadsheet");
  var file = listMovim.next();
  var fileId = file.getId();

  var fileInfo = SpreadsheetApp.openById(fileId);
  var fileSheets = fileInfo.getSheetId();
  var fileSheet = fileInfo.getSheetById(fileSheets);

  var importadosLastRow = fileSheet.getLastRow();
  var importadosLastCol = fileSheet.getLastColumn();
  var fileContent = fileSheet.getRange(filaInicioDatosImportados, 1, importadosLastRow, importadosLastCol).getValues();

  var inverseBD = [...fileContent].filter(row => row[0] !== "").reverse();

  const uids = inverseBD.map(row => [
    row[0] ? `${new Date(row[0]).getDate().toString().padStart(2, '0')}/${(new Date(row[0]).getMonth() + 1).toString().padStart(2, '0')}/${new Date(row[0]).getFullYear()}` : '',
    row[1] ? `${new Date(row[1]).getDate().toString().padStart(2, '0')}/${(new Date(row[1]).getMonth() + 1).toString().padStart(2, '0')}/${new Date(row[1]).getFullYear()}` : '',
    (row[2] || '').trim(),
    (row[3] || '').trim(),
    row[4] ? row[4].toString().replace(/,/g, '').replace(/\./g, ',') : '',
    row[5] ? row[5].toString().replace(/,/g, '').replace(/\./g, ',') : ''
  ].join("'_'"));

  return inverseBD.map((row, index) => [uids[index], ...row]);
}

function appendBD() {
  const sheetBDB = getSheetBDB();   // getter, no variable global directa
  const sheet_Mov = getSheetMov();

  const lastRow = sheetBDB.getLastRow();
  // Optimización adicional: solo se necesita la columna UID para el Set de deduplicación,
  // no la hoja BD_Banco completa con todas sus columnas
  const sheetBDB_RangeUIDs = sheetBDB.getRange(1, 1, lastRow, 1).getValues();
  const historicoUIDs = new Set(sheetBDB_RangeUIDs.map(row => String(row[0]).trim()));

  let arrayImportadosUID = getMovimientosBancarios();
  let noCoincidencia = arrayImportadosUID.filter(row => !historicoUIDs.has(row[0]));
  let noCoincidenciaImportar = noCoincidencia.map(row => row.slice(0));

  if (noCoincidenciaImportar.length === 0) return; // evita setValues con array vacío

  sheetBDB.getRange(sheetBDB.getLastRow() + 1, 1, noCoincidenciaImportar.length, noCoincidenciaImportar[0].length)
    .setValues(noCoincidenciaImportar);

  sheet_Mov.getRange(sheet_Mov.getLastRow() + 1, 1, noCoincidenciaImportar.length, noCoincidenciaImportar[0].length)
    .setValues(noCoincidenciaImportar);
}
```

Cambios respecto al original, con su razón:
- `folderMovimientosBancarios` movido dentro de `getMovimientosBancarios()` → deja de ejecutarse en cada arranque del proyecto, solo cuando esta función se invoca.
- `sheetBDB_Range` (hoja completa) eliminado → no se usaba dentro de `appendBD()`, solo `sheetBDB_RangeUIDs`.
- Se añade guarda `if (noCoincidenciaImportar.length === 0) return;` → evita un posible error de `setValues()` con array vacío (`noCoincidenciaImportar[0]` sería `undefined` si no hay filas nuevas).

### 4.4 `procesarLoteBancos.gs` — cambio mínimo necesario

Solo el arranque de la función cambia; el resto de la lógica (PASO 0 a PASO 5, `capturarFormulas`, `limpiarYRestaurar`, `obtenerMapaFilasBDB`) se mantiene igual, porque ya reciben `sheet_Mov` / `sheetBDB` como parámetro:

```javascript
function procesarLoteBancos() {
  const ss = getSS();
  const sheet_Mov = getSheetMov();
  const sheetBDB = getSheetBDB();
  const totalColsBDB = getTotalColsBDB();

  const lock = LockService.getDocumentLock();
  // ...resto del código sin cambios, usando estas variables locales en vez de las globales...
}
```

---

## 5. Efecto esperado del cambio

| Antes | Después |
|---|---|
| `procesarLoteBancos()` pagaba: 3× `openById` (por la inicialización global) + lectura completa de `BD_Banco` + llamada a Drive + `getLastColumn`, todo sin usarlo | Solo paga 1× `openById` y exactamente lo que su propia lógica necesita |
| `appendBD()` pagaba las mismas 3 aperturas redundantes de la inicialización global | Solo paga 1× `openById` |
| Cada script "arrastraba" el peso de inicialización de todos los demás | Aislamiento real: cada función solo dispara las llamadas que le corresponden |

Este cambio **no** elimina el coste de recálculo de fórmulas de Sheets documentado en julio (C0 sigue siendo candidata principal, sin resolver). Sí debería recortar una parte real y medible del coste fijo de ~85-90s por ejecución, al eliminar trabajo duplicado o directamente no utilizado que el propio código estaba generando.

---

## 6. Estado al cierre de esta sesión

- **Diagnóstico:** confirmado — Apps Script evalúa el código de nivel superior de todos los archivos `.gs` del proyecto en cada ejecución, independientemente del script invocado. Las `const`/`let` fuera de funciones no tienen carga perezosa nativa.
- **Solución:** diseñada y documentada (patrón getter + caché de ejecución) para Variables Globales, `appendBD.gs` y `procesarLoteBancos.gs`.
- **Aplicación:** **no realizada aún** — el código anterior sigue en producción tal cual. Pendiente de que el usuario lo despliegue.
- **Medición:** pendiente. Se recomienda repetir la instrumentación con timestamps (G0/G1, T4/T5) ya usada en la sesión del 21/07, esta vez comparando explícitamente antes/después de este refactor, para separar cuánto del coste fijo era código redundante propio vs. cuánto es recálculo estructural genuino de Sheets.

---

## 7. Pendientes derivados de esta sesión

| Prioridad | Pendiente | Notas |
|---|---|---|
| Alta | Aplicar el refactor de getters + caché en los tres archivos (Variables Globales, `appendBD.gs`, `procesarLoteBancos.gs`) | Código ya redactado en este informe, listo para desplegar |
| Alta | Repetir medición con timestamps antes/después del refactor | Para aislar el ahorro real y actualizar la Hipótesis 1 de la sesión del 21/07 con datos limpios |
| Media | Revisar si existen más archivos `.gs` en el proyecto con código de nivel superior no auditado en esta sesión (solo se revisaron los tres mencionados) | No confirmado — el usuario solo compartió estos tres scripts |
| Baja (heredado, sin cambios) | Localizar la fórmula más costosa del Spreadsheet (candidata: C0 en `Movimientos_cuenta!O`) | Sigue pendiente desde la sesión del 21/07, sección 14.2 — este informe no lo resuelve, solo aísla una causa distinta y adicional |

---

*— Fin del informe —*
