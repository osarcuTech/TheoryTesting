## Introducción.
ScriptURL: : https://script.google.com/u/0/home/projects/1_fTTbOO6HZAvn_Bzcp8j1NFsho193f7fs-aFyNIU6bea7HUGka4uWEe5/edit

- spreadsheet = ![[N_Caixa_$-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[N_Caixa_$-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("1UJXBub3M1dkQCVcTWPwLsvuyPPZK_CiyGXdaJ5mRmRs");
let idCarpetaDrive = "1QQ8nDFUSRBSX91Qz-h4zPIGt815bbv9i"
let filaInicioDatosImportados = 4
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(2,1,bdsheet.getLastRow()-1,bdsheet.getLastColumn()).getValues();
```


## Plantilla
![[Plantilla-A1_ImportarMovimientos]]