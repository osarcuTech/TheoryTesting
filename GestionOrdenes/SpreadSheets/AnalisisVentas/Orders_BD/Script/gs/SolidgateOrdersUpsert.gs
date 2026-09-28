/** !!!!!!!!!!!!!!!! QUITAR FILTROS ANTES DE EJECUTAR ¡¡¡¡¡¡¡¡¡¡¡¡¡
 * ================================================
 * UPSERT MOVIMIENTOS BANCARIOS → HISTÓRICO
 * ================================================
 * 
 * Lógica del UPSERT:
 * 1. UID (columna A) NO existe en histórico → APPEND (solo columnas A-J)
 * 2. UID existe:
 *    - updated_at (columna C) es DIFERENTE → UPDATE (solo columnas A-J)
 *    - updated_at es IGUAL     → IGNORE (no se hace nada)
 * 
 * Solo se modifican las columnas A-J (1 a 10). El resto de columnas del histórico
 * quedan intactas aunque tenga muchas más columnas.
 */


//Formulario de variables a rellenar que varian entre documentos. Contiene: 
let idSpreadSheet = "1weZYeqAS-6BfEDaXgIpnmQGJoECNpI809-ljPKr2Ezk"; //id del documento que se està tratando (spreadSheetPrueba)
let gidHojaHistoricoSolidgateOrders=0 // ID/gid de la hoja donde importaremos los movimientos bancarios.
let idCarpetaDriveOrdenesSolidgate = "1_Tx_87SB1GTUJN3dGfORzwxmRaxdSwqy" //id de la carpeta donde se sacara la información a importar (idCarpetaDriveOrdenesSolidgate)
let filaInicioDatosImportadosSG = 2 //fila en la que empieza a haber datos que nos interesen (filaInicioDatosImportados).

//Plantilla del flujo para Importar MovimientosBancarios al Historico.

//Variables de Scope Global
let spreadSheet = SpreadsheetApp.openById(idSpreadSheet);
let bdsheetSolidgateOrders = spreadSheet.getSheetById(gidHojaHistoricoSolidgateOrders);

let lastRelevantColumnSG= 10; //Seleccionamos la última columna a actualizar 10 = J.
//let rangeUIDs = bdsheetSolidgateOrders.getRange(1,1,bdsheetSolidgateOrders.getLastRow(),1).getDisplayValues();
//let rangeUpdatedDate = bdsheetSolidgateOrders.getRange(1,3,bdsheetSolidgateOrders.getLastRow(),1).getDisplayValues();

let folderOrdenesSolidgate = DriveApp.getFolderById(idCarpetaDriveOrdenesSolidgate);

// ==================== FUNCIÓN PRINCIPAL: OBTENER DATOS A IMPORTAR ====================
/**
 * Lee el primer archivo Google Sheets que encuentra en la carpeta de Drive,
 * invierte el orden y devuelve solo los datos útiles.
 */
function getOrdenesSolidgate(){
  
  Logger.log(folderOrdenesSolidgate.getFiles())
  const files = folderOrdenesSolidgate.getFilesByType("application/vnd.google-apps.spreadsheet");
  
  if (!files.hasNext()) {
    Logger.log("❌ No se encontró ningún archivo Google Sheets en la carpeta");
    return [];
  }

  const file = files.next(); // Tomamos el primer archivo
  var fileId = file.getId();
  var fileInfo = SpreadsheetApp.openById(fileId);  //Id extraida del arxivo importado.

  // Obtenemos la PRIMERA hoja del archivo importado
  var fileSheets = fileInfo.getSheetId();
  var fileSheet = fileInfo.getSheetById(fileSheets); //Obtenemos el arxivo importado sin la necesidad de indicar de cual se trata
  //Logger.log(fileSheets);

  var importadosLastRow = fileSheet.getLastRow();
  var importadosLastCol = fileSheet.getLastColumn();

// Leemos desde la fila que nos interesa
  var fileContent = fileSheet.getRange(filaInicioDatosImportadosSG,1,importadosLastRow - filaInicioDatosImportadosSG + 1,importadosLastCol).getDisplayValues(); // Sacamos el contenido a partir de la fila x en este caso y a partir de la primera columna)
  //Logger.log(fileContent);

  // Invertimos el orden de los datos.
  var inverseBD = [...fileContent]; //append fileContent al array vacio de la variable inverseBD
  inverseBD = inverseBD.filter(row => row[0] !== ""); //Eliminamos potenciales filas vacias.
  inverseBD = inverseBD.reverse();
  Logger.log(`📥 Se cargaron ${inverseBD.length} filas del archivo importado`);
  return inverseBD;
}



function upsertSolidgateOrders(){
  const importData = getOrdenesSolidgate(); //Importamos los datos de la otra hoja ejecutando la función previa.
  
  //Validamos la existencia de datos a procesar
  if (importData.length === 0) {
    //SpreadsheetApp.getUi().alert("❌ No hay datos para procesar");
    return;
  }
  
  // === Leer histórico (solo columnas A-J) ===
  const lastRowHistorico = bdsheetSolidgateOrders.getLastRow();
  const historicoData = bdsheetSolidgateOrders.getRange(1, 1, lastRowHistorico, lastRelevantColumnSG).getDisplayValues();

  // === Crear mapa rápido para búsquedas rápidas ===
  // Clave = UID (columna A)
  // Valor = { rowIndex: número de fila, updatedAt: valor de columna C }
  const uidMap = new Map();

  for (let i = 1; i < historicoData.length; i++) {   // empezamos en 1 para saltar encabezados
    const uid = String(historicoData[i][0]).trim();
    if (uid) {                              // Si uid existe haz {}
      uidMap.set(uid, {                     // Crea un mapa Clave-Valor donde la UID es la clave y tanto la fila como "updatedAt"  son los valores
        rowIndex: i + 1,                    // fila real en la hoja (1-based)
        updatedAt: historicoData[i][2]      // columna C (updated_at)
      });
    }
  }
  const toAppend = [];   // Filas nuevas que se añadirán al final
  let updatedCount = 0;

  // === Procesar cada fila importada ===
  for (let i = 0; i < importData.length; i++) {   //Itera incrementando el nº de fila hasta que no haya mas.
    const row = importData[i];                    //Variable interna que selecciona filas
    const uid = String(row[0]).trim();            //Variable interna que extrae el UID de la fila seleccionada en la variable anterior.
    if (!uid) continue;                           //Termina el bucle cuando no haya UID
    const newUpdatedAt = row[2];                  //Valor de "updated_at" del archivo importado en la fila seleccionada

    if (uidMap.has(uid)) {                        //Busca en el Mapa de UID's Historicos el UID de la fila iterada de importados para ver si existe.
      // === UID EXISTE → comprobar updated_at ===
      const existing = uidMap.get(uid);           // En caso de existir pone la Clave-Valor en la variable existing para poder comparar sus valores con los de los importados.

      // Comparación segura (funciona tanto con Date como con texto)
      const existingTime = (existing.updatedAt instanceof Date)     // Saca del historico el valor de "updated_at" (para el UID coincidente) y Evalua si es un fecha -->
                           ? existing.updatedAt.getTime()           // En caso afirmativo saca el valor de la fecha
                           : String(existing.updatedAt).trim();     // En caso negativo saca el string que contiene la fecha.

      const newTime = (newUpdatedAt instanceof Date)                // Repetimos la evaluación anterior para el valor de "updated_at" importado.
                      ? newUpdatedAt.getTime() 
                      : String(newUpdatedAt).trim();

      if (existingTime !== newTime) {                               // Mira si los valores de "updated_at" del Historico y el Importado son distinto. En caso afirmativo hace el update y lo cuenta.
        // UPDATE → solo columnas A-J
        bdsheetSolidgateOrders.getRange(existing.rowIndex, 1, 1, lastRelevantColumnSG)               // Seleccióna la Fila de coincidencia en el historico (hasta la columna 10=J); 
               .setValues([row.slice(0, lastRelevantColumnSG)]);                      // set value: row importada (hasta la columna 10=J)
        updatedCount++;                                             // Incrementa la cuenta de las filas actualizadas.
      }                                                             // Fin de la logica a realizar si no coinciden los "created_at".Si updated_at es igual → IGNORE (no hacemos nada)
    }                                                               // Fin de la logica si UID_importado existe en UID_Historico.
     else {                                                         // === UID NO EXISTE → APPEND (solo columnas A-J) ===
      toAppend.push(row.slice(0, lastRelevantColumnSG));              // Añade en la lista que se hará el append la fila de importados a añadir. Hace un slice preventivo para no añadir información.
    }                                                               // Fin del IF(UID_Hisorico=UID_Importado)
  }                                                                 // Fin de la evaluación de los datos a actualizar vs Append vs ignore.

  // === Realizar el APPEND de las filas nuevas ===
  if (toAppend.length > 0) {                                                            // Mira si hay filas para hacer el Append, if TRUE lo ejecuta.
    bdsheetSolidgateOrders.getRange(bdsheetSolidgateOrders.getLastRow() + 1, 1, toAppend.length, lastRelevantColumnSG)  // Selecciona el rango desde la siguiente fila a la ultima rellenas hasta esa + el nº de filas a importar.
           .setValues(toAppend);                                                        // Hace el append de las filas con UID no coincidentes.
  }                                                                                     // Fin del Append

  /* === Mensaje final ===
  SpreadsheetApp.getUi().alert(
    `✅ UPSERT COMPLETADO\n\n` +
    `Actualizadas: ${updatedCount} filas\n` +
    `Añadidas:    ${toAppend.length} filas\n\n` +
    `Solo se modificaron las columnas A-J`
    )
  */;

  Logger.log(`🔄 Upsert finalizado - ${updatedCount} actualizadas + ${toAppend.length} añadidas`);
}

// ==================== MENÚ EN LA HOJA ====================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🔄 UPSERT Ordenes Solidgate')
    .addItem('Ejecutar UPSERT desde carpeta Drive', 'upsertSolidgateOrders')
    .addToUi();
    
}

