## Estructura
La ejecución de este escript requiere de el script que contiene las variables globales de "N_Caixa_€" como resumen de su "arquitectura" de columnas y la logica de manipulación de las mismas para todos los scripts del SpreadSheet.

Consulta las variables globales de [[N_Caixa_€-ConstantesGlobalesScriptsGS|VariablesGlobales]].

```JS
//Formulario de variables a rellenar que varian entre documentos. Contiene:
let idCarpetaDrive = "1QL47EotyHLz4xhEssWw_MWIAvqDKcsg1" //id de la carpeta donde se sacara la información a importar (idCarpetaDrive)
let filaInicioDatosImportados = 4 //fila en la que empieza a haber datos que nos interesen (filaInicioDatosImportados) ya que variara entre bancos
let lastColumn = 7  // numCols: UID+Fecha+FechaValor+Movimiento+MasDatos+Importe+Saldo

//Plantilla del flujo para Importar MovimientosBancarios al Historico.

function getMovimientosBancarios(){
  Logger.log("[getMovimientosBancarios] Inicio");
  const folderMovimientosBancarios = DriveApp.getFolderById(idCarpetaDrive);
  Logger.log("[getMovimientosBancarios] Carpeta Drive obtenida");
  const listMovim = folderMovimientosBancarios.getFilesByType("application/vnd.google-apps.spreadsheet");
  if (!listMovim.hasNext()) {
    Logger.log("[getMovimientosBancarios] Finalizado: no hay archivos de movimientos");
    return [];
  }

  const fileInfo = SpreadsheetApp.openById(listMovim.next().getId());
  const fileSheet = fileInfo.getSheets()[0];
  if (!fileSheet) throw new Error("El archivo de movimientos no contiene hojas.");
  Logger.log("[getMovimientosBancarios] Archivo fuente abierto");

  Logger.log("[getMovimientosBancarios] Antes de getLastRow() de la hoja fuente");
  const importadosLastRow = fileSheet.getLastRow();
  Logger.log(`[getMovimientosBancarios] Después de getLastRow(): ${importadosLastRow}`);
  const numFilas = importadosLastRow - filaInicioDatosImportados + 1;
  if (numFilas <= 0) {
    Logger.log("[getMovimientosBancarios] Finalizado: no hay filas de datos");
    return [];
  }

  // Se leen únicamente las seis columnas de origen usadas para el UID y la importación.
  const numColumnasOrigen = lastColumn - 1;
  Logger.log(`[getMovimientosBancarios] Antes de getValues() de la fuente: ${numFilas} x ${numColumnasOrigen}`);
  const fileContent = fileSheet
    .getRange(filaInicioDatosImportados, 1, numFilas, numColumnasOrigen)
    .getValues();
  Logger.log("[getMovimientosBancarios] Después de getValues() de la fuente");
  const inverseBD = fileContent.filter(row => row[0] !== "" && row[0] !== null).reverse();

  const formatearFechaUID = valor => {
    if (!valor) return '';
    const fecha = new Date(valor);
    return `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
  };

  const resultado = inverseBD.map(row => {
    const uid = [
      formatearFechaUID(row[0]),
      formatearFechaUID(row[1]),
      (row[2] || '').toString().trim(),
      (row[3] || '').toString().trim(),
      row[4] ? row[4].toString().replace(/,/g, '').replace(/\./g, ',') : '',
      row[5] ? row[5].toString().replace(/,/g, '').replace(/\./g, ',') : ''
    ].join("'_'"); //No se puede poner como '_' ya que devolveria _ en vez de '_' y hay celdas que tienen _ dentro de su string haciendo confuso el separador.
    return [uid, ...row];
  });
  Logger.log(`[getMovimientosBancarios] UID generadas: ${resultado.length} movimientos válidos`);
  return resultado;
}

function appendBD(){
  Logger.log("[appendBD] Inicio");
  const arrayImportadosUID = getMovimientosBancarios();
  Logger.log(`[appendBD] Movimientos preparados: ${arrayImportadosUID.length} filas`);
  if (arrayImportadosUID.length === 0) {
    Logger.log("[appendBD] Finalizado: no hay movimientos para procesar");
    return;
  }

  Logger.log("[appendBD] Antes de getSheetBDB()");
  const sheetBDB = getSheetBDB();
  Logger.log("[appendBD] Después de getSheetBDB()");
  Logger.log("[appendBD] Antes de getSheetMov()");
  const sheetMov = getSheetMov();
  Logger.log("[appendBD] Después de getSheetMov()");
  // getLastRow puede contar datos de otras columnas; se lee la columna UID para deduplicar
  // y encontrar la siguiente fila disponible en BD_Banco.
  Logger.log("[appendBD] Antes de getLastRow() de BD_Banco");
  const bdbLastRow = sheetBDB.getLastRow();
  Logger.log(`[appendBD] Después de getLastRow() de BD_Banco: ${bdbLastRow}`);
  let bdbUIDValues = [];
  if (bdbLastRow > 0) {
    Logger.log(`[appendBD] Antes de getValues() de UID en BD_Banco: ${bdbLastRow} x 1`);
    bdbUIDValues = sheetBDB.getRange(1, BDB_UID, bdbLastRow, 1).getValues().map(row => row[0]);
    Logger.log("[appendBD] Después de getValues() de UID en BD_Banco");
  }
  const historicoUIDs = new Set(bdbUIDValues.filter(uid => uid !== "" && uid !== null));
  // Cada fila importada tiene la UID en row[0]; se conservan solo las que no están en el histórico.
  const noCoincidenciaImportar = arrayImportadosUID.filter(row => !historicoUIDs.has(row[0]));
  Logger.log(`[appendBD] Deduplicación completada: ${noCoincidenciaImportar.length} filas nuevas`);
  // No llamar a setValues con cero filas ni acceder a la primera fila, que no existiría.
  if (noCoincidenciaImportar.length === 0) {
    Logger.log("[appendBD] Finalizado: no hay movimientos nuevos para importar");
    return;
  }

  // setValues requiere que el rango tenga las mismas dimensiones que la matriz de datos.
  const numNuevasFilas = noCoincidenciaImportar.length;
  const numColumnas = noCoincidenciaImportar[0].length;
  // La columna A es continua: su primera celda vacía marca dónde empieza el nuevo lote.
  const bdbFirstEmptyIndex = bdbUIDValues.findIndex(uid => uid === "" || uid === null);
  // findIndex da un índice desde 0; si no encuentra vacíos, se añade después de lo leído.
  const bdbStartRow = bdbFirstEmptyIndex !== -1 ? bdbFirstEmptyIndex + 1 : bdbLastRow + 1;
  Logger.log(`[appendBD] Antes de setValues() en BD_Banco: ${numNuevasFilas} x ${numColumnas}, fila ${bdbStartRow}`);
  sheetBDB
    .getRange(bdbStartRow, BDB_UID, numNuevasFilas, numColumnas)
    .setValues(noCoincidenciaImportar);
  Logger.log("[appendBD] Después de setValues() en BD_Banco");

  // Se busca el primer hueco en la columna UID para reutilizarlo; si no hay huecos,
  // los nuevos movimientos se añaden después de la última fila utilizada.
  Logger.log("[appendBD] Antes de getLastRow() de Movimientos");
  const movLastRow = sheetMov.getLastRow();
  Logger.log(`[appendBD] Después de getLastRow() de Movimientos: ${movLastRow}`);

  //Esto quiere decir si(movLastRow>0; coge fila UID; devuelve rango bacio)
  let movUidValues = [];
  if (movLastRow > 0) {
    Logger.log(`[appendBD] Antes de getValues() de UID en Movimientos: ${movLastRow} x 1`);
    movUidValues = sheetMov.getRange(1, Mov_UID, movLastRow, 1).getValues();
    Logger.log("[appendBD] Después de getValues() de UID en Movimientos");
  }

  // findIndex devuelve el indice de la primera fila vacia.
  const firstEmptyIndex = movUidValues.findIndex(row => row[0] === "" || row[0] === null);

  // Sheets numera las filas desde 1; si no hay hueco, se usa la fila posterior a movLastRow.
  const sheetMovStartRow = firstEmptyIndex !== -1 ? firstEmptyIndex + 1 : movLastRow + 1;

  // Escribe todas las filas nuevas en bloque, con el UID en la columna Mov_UID.
  Logger.log(`[appendBD] Antes de setValues() en Movimientos: ${numNuevasFilas} x ${numColumnas}, fila ${sheetMovStartRow}`);
  sheetMov
    .getRange(sheetMovStartRow, Mov_UID, numNuevasFilas, numColumnas)
    .setValues(noCoincidenciaImportar);
  Logger.log("[appendBD] Después de setValues() en Movimientos");
  Logger.log("[appendBD] Finalizado");
}
```