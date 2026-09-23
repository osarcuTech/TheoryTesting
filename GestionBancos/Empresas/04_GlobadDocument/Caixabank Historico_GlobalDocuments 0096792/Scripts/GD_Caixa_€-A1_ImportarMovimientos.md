## Introducción.
ScriptURL: : https://script.google.com/u/0/home/projects/1vdqKAOQCNdTl307EXzJQ639NBEhEW41P61DHubrRuWSdPmhRybUnaheD/edit

- spreadsheet = ![[GD_Caixa_€-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[GD_Caixa_€-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("12SdzO29iKwuZjaLLeCdbe0Kqb_b9tLRhmsZ9RRsmgF8");
let idCarpetaDrive = "1pFzzVxLl1L5Vy8PV6imCbH_q1MKGGXJt"
let filaInicioDatosImportados = 4
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(2,1,bdsheet.getLastRow()-1,bdsheet.getLastColumn()).getValues();
```


## Plantilla
![[Plantilla-A1_ImportarMovimientos]]