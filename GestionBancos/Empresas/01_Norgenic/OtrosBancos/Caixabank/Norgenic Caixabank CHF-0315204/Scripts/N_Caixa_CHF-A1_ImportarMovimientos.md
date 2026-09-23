## Introducción.
ScriptURL: : https://script.google.com/u/0/home/projects/1nBqirnwXMzt0dFq6i2jFImMySjigawJxIl7tGjcaAPMNQ5UvcTQai0Fh/edit

- spreadsheet = ![[N_Caixa_CHF-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[N_Caixa_CHF-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("1pkiRHypIem0m07j7laZOSSipUQC7MRmHg6O4Cbeeq10");
let idCarpetaDrive = "1CGn0-qW23JKjhwVMPZamY3vPlYGPIg58"
let filaInicioDatosImportados = 4
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(2,1,bdsheet.getLastRow()-1,bdsheet.getLastColumn()).getValues();

```


## Plantilla
![[Plantilla-A1_ImportarMovimientos]]