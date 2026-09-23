## Introducción.
ScriptURL: : https://script.google.com/u/0/home/projects/1wIwklWEiPiDhArBYolU1k3pldDqCExzmA9AohR7_HY1-_ge3qwvoXtJ6/edit

- spreadsheet = ![[Norgenic_BBVA_€-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[Norgenic_BBVA_€-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("1wpnUpQF14bW9AA35ib62qhJNb4ZiQKtmupPaim3V6Uo");
let idCarpetaDrive = "1T2yOXfjK7dbOB0Ig78yHquGb_82SPLK3"
let filaInicioDatosImportados = 17
let columnaInicioDatosImportados = 3
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(1,1,bdsheet.getLastRow(),bdsheet.getLastColumn()).getValues();
```


## Plantilla
![[PlantillaV2-A1_ImportarMovimientos]] **¡¡¡Incompleto!!!**