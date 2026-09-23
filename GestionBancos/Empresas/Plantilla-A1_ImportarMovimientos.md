## Introducción.
Cada banco aporta los siguiente datos distintos entre si.: 
    - spreadsheet= id del documento donde queremos hacer el upsert.
    - idCarpetaDrive= id de la carpeta donde se añaden los datos a importar
    - filaInicioDatosImportados = fila en la que empiezan los datos, tras el header, a comprobar para importar.
    - bdsheet = gid (id de la hoja donde queremos hacer el upsert) casi siempre sera git = 0

filaInicioDatosImportados tendra los siguientes valores en función del banco:
  - Caixabank = 4
  - BBVA = z
  - Sabadell = z
  - Revolut = z


## InputsVariables (ejemplo)
```js
let spreadsheet = SpreadsheetApp.openById("1us-02j4RbkchrZa4e7JTicsavz5ZeEE35zc3S9R5CrU");
let idCarpetaDrive = "1pthVS8-nZHBeZwlvrMPXmwfHlaK2M6Ep"
let filaInicioDatosImportados = 4
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(2,1,bdsheet.getLastRow()-1,bdsheet.getLastColumn()).getValues();
```


## Plantilla
```js
function getMovimientosBancarios(){
  
  var dApp = DriveApp;
  var folderMovimientosBancarios = dApp.getFolderById(idCarpetaDrive);
  Logger.log(folderMovimientosBancarios.getFiles())
  var listMovim = folderMovimientosBancarios.getFilesByType("application/vnd.google-apps.spreadsheet");
  
  var file = listMovim.next();
  var fileId = file.getId();
  

  var fileInfo = SpreadsheetApp.openById(fileId);  //Id extraida del arxivo importado.
  var fileSheets = fileInfo.getSheetId();
  var fileSheet = fileInfo.getSheetById(fileSheets);
  //Logger.log(fileSheets);

  var importadosLastRow = fileSheet.getLastRow();
  var importadosLastCol = fileSheet.getLastColumn();

  var fileContent = fileSheet.getRange(filaInicioDatosImportados,1,importadosLastRow,importadosLastCol).getValues();
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
    row[0] ? new Date(row[0]).toLocaleDateString('es-ES') : '',
    row[1] ? new Date(row[1]).toLocaleDateString('es-ES') : '',
    row[2],
    row[3],
    row[4],
    row[5]
  ].join('_'));
  let inverseUidBD = inverseBD.map((row, index) => [uids[index], ...row]);
//
  //Aquí iria la funcion de importar en hoja de prueba si no la hubiesemos movido
    return inverseUidBD
}

function appendBD(){
  let arrayImportadosUID = getMovimientosBancarios();
  //Logger.log(arrayImportadosUID);
  //bdSheetRange es el rango en el que se encuentran los datos de la base de datos historica. La definimos al principio de todo el codigo.  
  const uidsHistorico = bdSheetRange.map(row => [
    row[0] ? new Date(row[0]).toLocaleDateString('es-ES') : '',
    row[1] ? new Date(row[1]).toLocaleDateString('es-ES') : '',
    row[2],
    row[3],
    row[4],
    row[5]
  ].join('_'));
  let bdSheetRangeUid = bdSheetRange.map((row, index) => [uidsHistorico[index], ...row]); //Historic con la columna UID para comparar con la UID de arrayImportadosUID

  //let historicoUIDs = bdSheetRangeUid.map(row => row[0]); //Extraemos las uids del historico para filtrar los importados que no coincidan.
  let historicoUIDs = new Set(bdSheetRangeUid.map(row => row[0]));
  //let noCoincidencia = arrayImportadosUID.filter(row => !historicoUIDs.includes(row[0]));
  let noCoincidencia = arrayImportadosUID.filter(row => !historicoUIDs.has(row[0]));
  //Logger.log(noCoincidencia.length);
  let noCoincidenciaImportar = noCoincidencia.map(row => row.slice(1)); //Sacamos el array a importar quitando la columna de UID's
  //Logger.log(noCoincidenciaImportar);

  let importarEnHistorico = bdsheet.getRange(bdsheet.getLastRow()+1,1,noCoincidenciaImportar.length,noCoincidenciaImportar[0].length).setValues(noCoincidenciaImportar)

}

function onOpen(){
  //var ui = SpreadsheetApp.getUi();ui.createMenu('Nombre del menu').addItem('Nombre del boton en el menu', 'funcion a usar').addToUi()
  //var ui = SpreadsheetApp.getUi();ui.createMenu('My Custom Menu').addItem('Run My Function: getMovimientosBancarios', 'appendBD').addToUi();
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('My Custom Menu')
      .addItem('Run My Function: getMovimientosBancarios', 'appendBD')
      .addToUi();
  } catch (e) {
    Logger.log('Error al crear el menú: ' + e.message);
  }
}
```