## Introducción.
ScriptURL: : https://script.google.com/u/0/home/projects/1NRN-L94xkkxiDwl9qCl1tlQvbpEX-4y9RwhYHNT1XI8TO3ZnP_UHcsDD/edit

- spreadsheet = ![[Taxgov_Caixabank_€-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[Taxgov_Caixabank_€-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("1T9-UEFyODMd5g_6jpbdiB7lBmAbMS-GV9PHm2hXMgHM");
let idCarpetaDrive = "1BoAbhwU2W3rg-b4SAjiQaUhPRJRn6qmc"
let filaInicioDatosImportados = 4
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(2,1,bdsheet.getLastRow()-1,bdsheet.getLastColumn()).getValues();
```


## Plantilla
![[Plantilla-A1_ImportarMovimientos]]