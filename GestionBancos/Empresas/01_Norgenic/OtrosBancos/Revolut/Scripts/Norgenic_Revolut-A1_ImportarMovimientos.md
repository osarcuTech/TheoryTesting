## Introducción.
ScriptURL: : https://script.google.com/u/0/home/projects/11_G5P6jk9jXAglXPiwjtgMZ2XF_M7ry1Sh-x9ESF_MvvO13BFzk2qIT1/edit

- spreadsheet = ![[Norgenic_Revolut-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[Norgenic_Revolut-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("1EesFEFgBtNfL-ODI50CKTk0le7rVaKCRCZvxUVeiYUA");
let idCarpetaDrive = "188wFNYo2kGGGQsRgMPzETvPP8h6Ycd-x"
let filaInicioDatosImportados = 2
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(1,1,bdsheet.getLastRow(),bdsheet.getLastColumn()).getValues();
```


## Plantilla
Fork de [[Plantilla-A1_ImportarMovimientos]].

´´´
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



//Ponemos una función para formatearlos datos nuemricos a formato español.Se ha de activar solo cuando los datos esten mal formatados.
/*
  function callFormatDataIterator(){ 
    let replaceArrayColumns = [13,15,16,18,20]

      function formatData(i){
        let replaceDataRangeM = fileSheet.getRange(2,i,fileSheet.getLastRow()-1,1)
        let replaceDataM = replaceDataRangeM.getValues();
        replaceDataM = replaceDataM.map(row => [row[0].toString().replace(",","").replace(".",",")])
        replaceDataRangeM.setValues(replaceDataM)

      }
    
    for (n in replaceArrayColumns){formatData(replaceArrayColumns[n])}
  }
callFormatDataIterator()
*/

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
  inverseBD.map(col => [
    col[0] ? new Date(col[0]).toLocaleDateString('es-ES') : '',   //Date started (UTC)
    col[1] ? new Date(col[1]).toLocaleDateString('es-ES') : '',   //Date completed (UTC)
    col[2],                                                       //ID
    col[3],                                                       //Type
    col[4],                                                       //State
    col[5],                                                       //Description
    col[6],                                                       //Reference
    col[7],                                                       //Payer
    col[8],                                                       //Card number
    col[9],                                                       //Card label
    col[10],                                                      //Card state
    col[11],                                                      //Orig currency
    col[12],                                                      //Orig amount         -->
    col[13],                                                      //Payment currency
    col[14],                                                      //Amount              -->
    col[15],                                                      //Total amount        -->
    col[16],                                                      //Exchange rate
    col[17],                                                      //Fee                 -->
    col[18],                                                      //Fee currency
    col[19],                                                      //Balance             -->
    col[20],                                                      //Account
    col[21],                                                      //Beneficiary account number
    col[22],                                                      //Beneficiary sort code or routing number
    col[23],                                                      //Beneficiary IBAN
    col[24],                                                      //Beneficiary BIC
    col[25],                                                      //MCC
    col[26],                                                      //Related transaction id
    col[27]                                                       //Spend program
  ]);

  
  let uids = inverseBD.join("_")


  let inverseUidBD = inverseBD.map((row, index) => [uids[index], ...row]);
//
  //Aquí iria la funcion de importar en hoja de prueba si no la hubiesemos movido
    return inverseUidBD
}

function appendBD(){
  let arrayImportadosUID = getMovimientosBancarios();
  //Logger.log(arrayImportadosUID);
  //bdSheetRange es el rango en el que se encuentran los datos de la base de datos historica. La definimos al principio de todo el codigo.  
  const uidsHistorico = bdSheetRange.map(col => [
    col[0] ? new Date(col[0]).toLocaleDateString('es-ES') : '',   //Date started (UTC)
    col[1] ? new Date(col[1]).toLocaleDateString('es-ES') : '',   //Date completed (UTC)
    col[2],                                                       //ID
    col[3],                                                       //Type
    col[4],                                                       //State
    col[5],                                                       //Description
    col[6],                                                       //Reference
    col[7],                                                       //Payer
    col[8],                                                       //Card number
    col[9],                                                       //Card label
    col[10],                                                      //Card state
    col[11],                                                      //Orig currency
    col[12],                                                      //Orig amount         -->
    col[13],                                                      //Payment currency
    col[14],                                                      //Amount              -->
    col[15],                                                      //Total amount        -->
    col[16],                                                      //Exchange rate
    col[17],                                                      //Fee                 -->
    col[18],                                                      //Fee currency
    col[19],                                                      //Balance             -->
    col[20],                                                      //Account
    col[21],                                                      //Beneficiary account number
    col[22],                                                      //Beneficiary sort code or routing number
    col[23],                                                      //Beneficiary IBAN
    col[24],                                                      //Beneficiary BIC
    col[25],                                                      //MCC
    col[26],                                                      //Related transaction id
    col[27]                                                       //Spend program
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

´´´