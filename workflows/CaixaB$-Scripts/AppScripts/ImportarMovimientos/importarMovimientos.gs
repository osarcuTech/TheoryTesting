//Formulario de variables a rellenar que varian entre documentos. Contiene: 
let idCarpetaDrive = "1QL47EotyHLz4xhEssWw_MWIAvqDKcsg1" //id de la carpeta donde se sacara la información a importar (idCarpetaDrive)
let filaInicioDatosImportados = 4 //fila en la que empieza a haber datos que nos interesen (filaInicioDatosImportados) ya que variara entre bancos

//Plantilla del flujo para Importar MovimientosBancarios al Historico.

let sheetBDB_Range = sheetBDB.getRange(1,1,sheetBDB.getLastRow(),sheetBDB.getLastColumn()).getValues(); //No hay riesgo de que LastColumn sobreeescriba datos ya que solo deja pasar los no existentes y que, por lo tanto aún no pueden tener mas datos que los aportados por el banco.
let sheetBDB_RangeUIDs = sheetBDB.getRange(1,1,sheetBDB.getLastRow(),1).getValues();
let folderMovimientosBancarios = DriveApp.getFolderById(idCarpetaDrive);

function getMovimientosBancarios(){
  
  Logger.log(folderMovimientosBancarios.getFiles())
  var listMovim = folderMovimientosBancarios.getFilesByType("application/vnd.google-apps.spreadsheet");
  
  var file = listMovim.next();
  var fileId = file.getId();
  

  var fileInfo = SpreadsheetApp.openById(fileId);  //Id extraida del arxivo importado.
  var fileSheets = fileInfo.getSheetId();
  var fileSheet = fileInfo.getSheetById(fileSheets); //Obtenemos el arxivo importado sin la necesidad de indicar de cual se trata
  //Logger.log(fileSheets);

  var importadosLastRow = fileSheet.getLastRow();
  var importadosLastCol = fileSheet.getLastColumn();

  var fileContent = fileSheet.getRange(filaInicioDatosImportados,1,importadosLastRow,importadosLastCol).getValues(); // Sacamos el contenido a partir de la 4 fila en este caso y a partir de la primera columna)
  //Logger.log(fileContent);

  // Invertimos el orden de los datos.
  var inverseBD = [...fileContent]; //append fileContent al array vacio de la variable inverseBD
   //Logger.log(inverseBD);
  inverseBD = inverseBD.filter(row => row[0] !== ""); //Eliminamos potenciales filas vacias.
  //Logger.log(inverseBD);
  inverseBD = inverseBD.reverse();
  //Logger.log(inverseBD);
  //Logger.log(fileContent);

// Convertir solo las columnas de fecha (0 y 1) a strings antes de generar el UID
    
  const uids = inverseBD.map(row => [
  row[0] ? `${new Date(row[0]).getDate().toString().padStart(2, '0')}/${(new Date(row[0]).getMonth() + 1).toString().padStart(2, '0')}/${new Date(row[0]).getFullYear()}` : '',
  row[1] ? `${new Date(row[1]).getDate().toString().padStart(2, '0')}/${(new Date(row[1]).getMonth() + 1).toString().padStart(2, '0')}/${new Date(row[1]).getFullYear()}` : '',
  (row[2] || '').trim(),
  (row[3] || '').trim(),
  row[4] ? row[4].toString().replace(/,/g, '').replace(/\./g, ',') : '',
  row[5] ? row[5].toString().replace(/,/g, '').replace(/\./g, ',') : ''
].join("'_'"));//Unimos las columnas para generar la uid.



  
  let inverseUidBD = inverseBD.map((row, index) => [uids[index], ...row]);
//
  //Aquí iria la funcion de importar en hoja de prueba si no la hubiesemos movido
    return inverseUidBD //Devuelve unicamente la UID de los movimientos en el SpreadSheet a importar
}



function appendBD(){
  let arrayImportadosUID = getMovimientosBancarios();
  //Logger.log(arrayImportadosUID);
  //sheetBDB_Range es el rango en el que se encuentran los datos de la base de datos historica. La definimos al principio de todo el codigo.  
 
  let sheetBDB_RangeUid = sheetBDB_Range.map((row, index) => [sheetBDB_RangeUIDs[index][0], ...row]); //Extraemos los valores de UID del Historico para compararlos con la UID de arrayImportadosUID

  //let historicoUIDs = sheetBDB_RangeUid.map(row => row[0]); //Extraemos las uids del historico para filtrar los importados que no coincidan.
  let historicoUIDs = new Set(sheetBDB_RangeUid.map(row => row[0]));
  //let noCoincidencia = arrayImportadosUID.filter(row => !historicoUIDs.includes(row[0]));
  let noCoincidencia = arrayImportadosUID.filter(row => !historicoUIDs.has(row[0])); //Filtramos las no coincidentes para importarlas.
  //Logger.log(noCoincidencia.length);
  let noCoincidenciaImportar = noCoincidencia.map(row => row.slice(0)); //Sacamos el array a importar quitando la columna de UID's
  //Logger.log(noCoincidenciaImportar);

  let importarEnHistorico = sheetBDB.getRange(sheetBDB.getLastRow()+1,1,noCoincidenciaImportar.length,noCoincidenciaImportar[0].length).setValues(noCoincidenciaImportar)
//Esta linea puede presentar error si se añade información (ej: celda de validación) en otras filas y/o si la hoja no tiene mas filas para rellenar.

// Nuevas variables para el apend en Movimientos que sustituye a la query.
  let importarEnMovimientos = sheet_Mov.getRange(sheet_Mov.getLastRow()+1,1,noCoincidenciaImportar.length,noCoincidenciaImportar[0].length).setValues(noCoincidenciaImportar)
}