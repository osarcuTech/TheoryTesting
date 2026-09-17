// ── Límite de filas por lote ─────────────────────────────────
const MAX_FILAS_LOTE = 50; //Exitoso pero con tiempos exageradamente altos por la necesidad de recalcular todas las formulas con cada transferencia.

/*
// ── Trigger principal ────────────────────────────────────────
function onEditInstalable(e) {          //e = valor de la celda de Validacion que inicia el trigger
  if (!e) return;                       //si = FALSE no ejecutes nada
  
  if (
    e.range.getSheet().getSheetId() == gid_Mov &&    
    e.range.getColumn()    == Mov_BD  &&  
    e.range.getRow()       == 2       &&
    e.value                == "TRUE"
    ){procesarLoteBancos(sheet_Mov)}else{return}
}
*/


// ── Orquestador principal ────────────────────────────────────
function procesarLoteBancos() {

  // LockService: encola ejecuciones concurrentes. tryLock(10000) = espera hasta 10s para obtener el lock. Una vez obtenido, dura toda la ejecución (hasta 6 min).
  
  const lock = LockService.getDocumentLock();
  if (!lock.tryLock(10000)) {
    Logger.log("ABORTADO: otra ejecución en curso.");
    return;
  }

  
  

  try {                                   //Saca lastRow al scope de toda la función si este es mayor  que 2
    //Logger.log(`[T0] Inicio try: ${new Date().toISOString()}`); // Imprimir en consola el inicio de este paso.
    const lastRow = sheet_Mov.getLastRow();
    if (lastRow < 2) return;

    /* ── PASO 0: Evaluar reanudación ────────────────────────
       Si el script falló después del volcado en BD pero antes del deleteRows, al relanzar encontrará A2 con Definitivo=TRUE en BD_Banco. En ese caso salta directamente a limpiar esa fila. 
    */ 


    //Logger.log(`[T1] Antes de evaluar reanudación: ${new Date().toISOString()}`); // Imprimir en consola el inicio de este paso.
    const revIf_UidMov_Preprocesada = String(sheet_Mov.getRange(2, Mov_DEF_UID).getValue()).trim();    // UID MOvimientos para comparar con uid BD
    if (revIf_UidMov_Preprocesada) {                                                             // Si existe UID Movimiento
      const mapa_DEF_UidsBDB = obtenerMapaFilasBDB(sheetBDB, BDB_DEF_UID);         // Lista UID's BD
      const filaMatchUids_Reviewed = mapa_DEF_UidsBDB.get(revIf_UidMov_Preprocesada);                            // Buscar UID's movimiento en UID's BD / lista no valores
      if (filaMatchUids_Reviewed) {                                                    // Si coincidencia = True siguiente condición
        const yaArchivado = sheetBDB.getRange(filaMatchUids_Reviewed, BDB_DEFINITIVO).getValue(); // Mirar el valor de validados * coincidencia
        if (yaArchivado === true) {
          // Contar filas consecutivas ya archivadas desde el punto de coincidencia
          // (cubre que el crash ocurriera a mitad del batch, no solo en la fila 1)
          const limiteReanudacion = Math.min(MAX_FILAS_LOTE, lastRow - 1); //Busca el menor de los dos valores entre la última filas y el maximo de filas permitidas a porcesar
          const bloqueDefinitivo = sheetBDB.getRange(filaMatchUids_Reviewed, BDB_DEFINITIVO, limiteReanudacion, 1).getValues(); //Busca en BBD si estan marcadas como definitivo (tick) o no.
          let numFilasYaArchivadas = 0;
          for (let i = 0; i < bloqueDefinitivo.length; i++) { // bloqueDefinitivo.length para que no lea más allá de lo que trajiste
            if (bloqueDefinitivo[i][0] === true) numFilasYaArchivadas++;  // Cuenta los trues.
            else break;
          }
          Logger.log(`REANUDACIÓN: ${numFilasYaArchivadas} fila(s) ya archivada(s) — limpiando de golpe.`);
          const formulasGuardadas = capturarFormulas(sheet_Mov);
          limpiarYRestaurar(sheet_Mov, numFilasYaArchivadas, formulasGuardadas, numColsManuales, lastRow);
          ss.toast(`Reanudación completada. ${numFilasYaArchivadas} fila(s) limpiada(s).`, "✅ Reanudado", 5);
          return;
        }
      }
    }

    // ── PASO 1: Contar filas con V=TRUE consecutivas ────────
    //Logger.log(`[T2] Antes de contar filas TRUE: ${new Date().toISOString()}`); // Imprimir en consola el inicio de este paso.
    const checkValues = sheet_Mov.getRange(2, Mov_BD, lastRow - 1, 1).getValues(); // Seleccionar rango V2:lastRow (Hoja Movimientos)

    let numFilasAProcesar = 0;
    for (let i = 0; i < checkValues.length; i++) {  // mientras i menor length V (movimientos) loop
      
      if (checkValues[i][0] !== true) {
        break // Bloque continuo — se rompe al primer valor distinto de TRUE
      };

      numFilasAProcesar++
      if (numFilasAProcesar >= MAX_FILAS_LOTE) {
        break; // Límite de lote alcanzado
      }
    }

    if (numFilasAProcesar === 0) return; // Tras aplicar el loop, si el valor sigue siendo 0 termina la función.

    // ── PASO 2: Feedback visual ─────────────────────────────
    //Logger.log(`[T3] Antes de toast+flush: ${new Date().toISOString()}`); // Imprimir en consola el inicio de este paso.
    ss.toast(`Archivando ${numFilasAProcesar} movimiento(s)... No edites la hoja.`,"⏳ En proceso", -1); //Aviso a Usuario
    sheet_Mov.getRange(2, Mov_VALIDACION, numFilasAProcesar, numColsManuales).setBackground('#FFF2CC');  //Resaltar como señal de no tocar aún
    SpreadsheetApp.flush();  //Fuerza la ejecución inmediata de los cambios pendientes en la hoja. No borra nada, no elimina el Spreadsheet, ni tampoco borra formatos.
    Logger.log(`[T4] Después de flush: ${new Date().toISOString()}`); // Imprimir en consola el inicio de este paso.

    // ── PASO 3: Capturar fórmulas de fila 2 ────────────────
    const formulasGuardadas = capturarFormulas(sheet_Mov);
    Logger.log(`[T5] Después de capturar fórmulas: ${new Date().toISOString()}`); // Imprimir en consola el inicio de este paso.

    // ── PASO 4: Volcado idempotente en BD_Banco (Leer bloque completo del lote de una sola llamada API).
    //Logger.log(`[T6] Antes de leer sheet_Mov_DataProcessing: ${new Date().toISOString()}`); // Imprimir en consola el inicio de este paso.
    const sheet_Mov_DataProcessing = sheet_Mov.getRange(2, 1, numFilasAProcesar, Mov_BD).getValues(); //Selecciona A2:Vnº
    
    //Logger.log(`[T7] Antes de obtenerMapaFilasBDB: ${new Date().toISOString()}`); // Imprimir en consola el inicio de este paso.
    const primerUID = String(sheet_Mov_DataProcessing[0][Mov_UID - 1]).trim();   //Saca la info de la primera fila de movimientos, columna que contiene el UID!!!!!!!!!!!!
    const mapaUidsBDB = obtenerMapaFilasBDB(sheetBDB, BDB_UID); // Map UID → fila para búsqueda O(1) en lugar de O(n) por fila
    //Logger.log(`[T8] Después de obtenerMapaFilasBDB: ${new Date().toISOString()}`);// Imprimir en consola el inicio de este paso.
    const filaInicioBDB = mapaUidsBDB.get(primerUID);  //Busca el valor de la fila de coincidencia de UID's en BDB !!!!!!!!



    
      /* Leer fila completa de BD_Banco (1 llamada API), modificar en memoria con índices derivados de constantes BDB_* (0-based = constante - 1), y volcar atómicamente (1 llamada API).
         Ventaja vs offset manual: si BD_Banco añade/mueve columnas, solo hay que actualizar la constante BDB_* correspondiente. 
         Definitivo=TRUE se asigna AL FINAL para que la QUERY no filtre la fila antes de que todos los datos estén escritos.
      */ 

    if (!filaInicioBDB) {
          Logger.log(`ERROR CRÍTICO: UID de la primera fila del lote no encontrado en BD_Banco: ${primerUID}`);
        } else {
          const rangoBloqueBDB = sheetBDB.getRange(filaInicioBDB, 1, numFilasAProcesar, totalColsBDB);
          const matrizBDB = rangoBloqueBDB.getValues();

          for (let i = 0; i < numFilasAProcesar; i++) {
            const fila = sheet_Mov_DataProcessing[i];
            const datosMemoria = matrizBDB[i]; // correspondencia directa por offset, sin buscar la fila correspondiente para el UID de cada fila.




        //Aquí cambiamos los datos EN MEMORIA de BDB por los de Movimientos como paso anterior a su sustitución.
      datosMemoria[BDB_DEF_UID - 1]    = fila[Mov_DEF_UID - 1];  // Mov_DEF_UID era el nº de columna, fila[n-1]
      datosMemoria[BDB_PeriodoCobro - 1] = fila[Mov_PeriodoCobro - 1]; 
      datosMemoria[BDB_NOMBREFRA - 1]  = String(fila[Mov_NOMBREFRA - 1]).trim();
      datosMemoria[BDB_CFInOut - 1]      = fila[Mov_CFInOut - 1];
      datosMemoria[BDB_CFCategory - 1]   = fila[Mov_CFCategory - 1];
      datosMemoria[BDB_PlataformaPago -1]= fila[Mov_PlataformaPago - 1];
      datosMemoria[BDB_Validacion - 1]   = fila[Mov_VALIDACION - 1];
      datosMemoria[BDB_PCONABLE - 1]   = fila[Mov_PCONABLE - 1];
      datosMemoria[BDB_UBICACION - 1]  = fila[Mov_UBICACION - 1];
      datosMemoria[BDB_ID_ENVIADA - 1] = fila[Mov_ID_ENVIADA - 1];
      datosMemoria[BDB_CARPETA - 1]    = fila[Mov_CARPETA - 1];
      datosMemoria[BDB_DEFINITIVO - 1] = true; // AL FINAL

      Logger.log(`BD_Banco preparada (batch, offset ${i}) — UID: ${String(fila[Mov_UID - 1]).trim()}`);
      }

      rangoBloqueBDB.setValues(matrizBDB);
    }

    // ── PASO 5: Borrado atómico + restauración ──────────────
    limpiarYRestaurar(
      sheet_Mov, numFilasAProcesar, formulasGuardadas, numColsManuales, lastRow
    );

    // ── Feedback final ──────────────────────────────────────
    ss.toast(`${numFilasAProcesar} movimiento(s) archivado(s) correctamente.`,"✅ Completado", 5);

    // Aviso si el lote se cortó por MAX_FILAS_LOTE
    if (
      checkValues.length > numFilasAProcesar &&
      checkValues[numFilasAProcesar][0] === true            //Esas filas son (numFilasAProcesar=1 ==> checkValues[0]),(numFilasAProcesar=2 ==> checkValues[1]), ..., checkValues[numFilasAProcesar - 1].
    ) {ss.toast("Quedan filas pendientes. Vuelve a marcar la casilla para continuar.","⚠️ Pausa", 10)}

  } catch (error) {
    Logger.log("ERROR CRÍTICO: " + error.message);
    ss.toast(
      "Error inesperado. El sistema es seguro — puedes reintentar.",
      "❌ Error", 10
    );

    // Intentar revertir el color de la fila de validación en caso de error.
    // Si esta limpieza falla, no queremos que el fallo original se pierda,
    // por eso atrapamos el error secundario y lo ignoramos.
    try {
      sheet_Mov.getRange(2, Mov_VALIDACION, 1, numColsManuales).setBackground(null);
    } catch (_) {
      // Ignorar error secundario de limpieza.
    }

  } finally {
    lock.releaseLock();
  }
}







/* ── Helpers ──────────────────────────────────────────────────
    Captura las fórmulas de COLUMNAS_FORMULAS en fila 2. Devuelve [{columna, formula}] para restaurarlas tras deleteRows.
*/ 

function capturarFormulas(sheet_Mov) {
  // COLUMNAS_FORMULAS = [8,9,10,11,12,13,14,15] son contiguas (H:O) → 1 sola llamada batch
  const primeraCol = COLUMNAS_FORMULAS[0];
  const numCols = COLUMNAS_FORMULAS.length;
  const formulasFila = sheet_Mov.getRange(2, primeraCol, 1, numCols).getFormulas()[0]; // 1 llamada API usamos [0] pq getFormulas devuelve [[8,9,10,...,15]] y queremos [8,9,10,...,15]

  return COLUMNAS_FORMULAS.map((col, i) => ({ //col pasara el array de columnas, i pasara el array de formulas.
    columna: col,
    formula: formulasFila[i]
  }));
}
/*------------------------------------------------------------------------------------------------
Restaura fórmulas capturadas en la nueva fila 2. Solo actúa si había fórmula (ignora celdas que eran valores).
*/ 

function restaurarFormulas(sheet_Mov, formulasGuardadas) {
  for (const item of formulasGuardadas) {
    if (item.formula) {sheet_Mov.getRange(2, item.columna).setFormula(item.formula)}
  }
}
//---------------------------------------------------------------------------------------------


/*
 Borrado atómico + restauración de fórmulas.
 Protección anti-colapso de Tabla:
 * Si vamos a borrar TODAS las filas de datos, conservamos la última con clearContent() en vez de deleteRow() para que la Tabla no
 * colapse y las ARRAYFORMULA restauradas puedan expandirse.
 */

function limpiarYRestaurar(sheet_Mov, numFilasAProcesar, formulasGuardadas, numColsManuales, lastRow) {
  
  sheet_Mov.getRange(2, Mov_VALIDACION, numFilasAProcesar, numColsManuales).setBackground(null);    // Quitar formato
  const totalFilasDatos = lastRow - 1; // sin contar header fila 1

  if (numFilasAProcesar == totalFilasDatos) {
    if (numFilasAProcesar > 1) {sheet_Mov.deleteRows(2, numFilasAProcesar - 1)} // Caso límite: borrar todas las filas menos la última
    sheet_Mov.getRange(2, 1, 1, Mov_BD).clearContent()} // La última fila (ahora en posición 2) se limpia sin borrar para mantener la estructura de Tabla viva
    else {sheet_Mov.deleteRows(2, numFilasAProcesar)} // Caso normal: borrar el bloque completo de filas procesadas
  
  restaurarFormulas(sheet_Mov, formulasGuardadas);// Restaurar fórmulas en la nueva fila 2
  SpreadsheetApp.flush();
}

//-------------------------------------------------------------------------------------------------------

//Lee BDB_UID o BDB_DEF_UID de sheetBDB desde fila 2 y devuelve Map { uid → número de fila (1-based) }. Búsqueda O(1) en el volcado del lote.

function obtenerMapaFilasBDB(sheetBDB, BDB_UID_OR_DUID) {
  const lastRow = sheetBDB.getLastRow();
  const mapa    = new Map();
  if (lastRow < 2) return mapa;

  const valores = sheetBDB.getRange(2, BDB_UID_OR_DUID, lastRow - 1, 1).getValues();

  for (let i = 0; i < valores.length; i++) {
    const uid = String(valores[i][0]).trim();
    if (uid) mapa.set(uid, i + 2);
  }
  return mapa;
}

// ── Test manual ──────────────────────────────────────────────
//Ejecutar desde el editor de Apps Script para probar sin necesidad de marcar el checkbox manualmente. Asegúrate de que fila 2 tiene datos reales antes de ejecutar.

function testManual() {
  sheet_Mov.getRange(2, Mov_BD).setValue(true);
  onEditInstalable({
    range: sheet_Mov.getRange(2, Mov_BD),
    value: "TRUE"
  });
}