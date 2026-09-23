## Introducción.
ScriptURL: : https://script.google.com/u/0/home/projects/1qpgi9R2DdNQsI41FLcOINoS_DBpQCaCYspa6EQ5l5OBw9kKBWQLu7MDb/edit

- spreadsheet = ![[N_Caixa_NZD-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[N_Caixa_NZD-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("1JnLMnSgzV_gcAqSD0NjWRF-77-Mq55iuJDIHDhbO4iQ");
let idCarpetaDrive = "1J3pRjxYkcW-R0cBagsyWugWIgOPxMYDH"
let filaInicioDatosImportados = 4
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(2,1,bdsheet.getLastRow()-1,bdsheet.getLastColumn()).getValues();
```


## Plantilla
![[Plantilla-A1_ImportarMovimientos]]