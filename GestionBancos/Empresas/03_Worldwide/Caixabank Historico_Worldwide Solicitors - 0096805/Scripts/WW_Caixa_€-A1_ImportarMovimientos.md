## Introducción.
ScriptURL: : https://script.google.com/u/0/home/projects/1pPhsGNNM65tUJW9dZvZRJmZrCYHyzGLv2-luhcbh08H_XA7tEStQqWko/edit

- spreadsheet = ![[WW_Caixa_€-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[WW_Caixa_€-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("1BYzMPwRmZyaBawt6KcSyO-yH8jMnmnb_A2FWpf_b-Ic");
let idCarpetaDrive = "19oRtssDHWsYgFX3zWsooJlezgsxhzhbS"
let filaInicioDatosImportados = 4
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(2,1,bdsheet.getLastRow()-1,bdsheet.getLastColumn()).getValues();
```


## Plantilla
![[Plantilla-A1_ImportarMovimientos]]