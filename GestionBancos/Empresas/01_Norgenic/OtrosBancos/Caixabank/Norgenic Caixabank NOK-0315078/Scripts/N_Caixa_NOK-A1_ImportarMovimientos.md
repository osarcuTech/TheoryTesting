## Introducción.
ScriptURL: : https://script.google.com/u/0/home/projects/1rWPMd8mHdrpcw5GoSXX7ZO6wbL98-fP1SeQLaS2cKukX56j9B0FDnU62/edit

- spreadsheet = ![[N_Caixa_NOK-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[N_Caixa_NOK-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("11jy-BneAPEP2QXOZxRQPWVcoWniincG1Xmul4-Z9iiM");
let idCarpetaDrive = "1yCQSz6c2DBnAjAliUjUwvRBkdIQ1e3Ty"
let filaInicioDatosImportados = 4
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(2,1,bdsheet.getLastRow()-1,bdsheet.getLastColumn()).getValues();
```


## Plantilla
![[Plantilla-A1_ImportarMovimientos]]