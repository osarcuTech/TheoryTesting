## Introducción.
ScriptURL: : https://script.google.com/u/0/home/projects/1DAv1ePO3qcVRhiO4Q0GI-S61VIRDlYBdFKw73HugC4_y2l0i3-LwqL-h/edit

- spreadsheet = ![[N_Caixa_PLN-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[N_Caixa_PLN-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("1VZCd6dUUpvCo4IVEqxmrc0oSBeAnim-7JwpTb3QlYYs");
let idCarpetaDrive = "1N43IOhq6uqbSw35S1MOHDmBVizMOX2FI"
let filaInicioDatosImportados = 4
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(2,1,bdsheet.getLastRow()-1,bdsheet.getLastColumn()).getValues();
```


## Plantilla
![[Plantilla-A1_ImportarMovimientos]]