## Introducción.

ScriptURL: https://script.google.com/u/0/home/projects/1E2ymq0Hxw9KZ4Cqlanq8N06zakEO-I94N2FUMnmhNr_5ZwUX1icT9a7y/edit

- spreadsheet = ![[N_Caixa_AUD-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[N_Caixa_CAD-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("1SdzMwKaGxpyywSKgUb4MSHulzMHWriRQaQUcll2yZ-I");
let idCarpetaDrive = "1-AFIiI6NpiibOXEmpvnnn-uxzil1Sj0n"
let filaInicioDatosImportados = 4
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(2,1,bdsheet.getLastRow()-1,bdsheet.getLastColumn()).getValues();
```


## Plantilla
![[Plantilla-A1_ImportarMovimientos]]