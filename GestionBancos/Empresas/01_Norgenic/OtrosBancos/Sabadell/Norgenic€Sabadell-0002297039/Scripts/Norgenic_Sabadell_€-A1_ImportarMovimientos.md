## Introducción.
ScriptURL: : https://script.google.com/u/0/home/projects/1gP4qh9JS-_jtGjwT5JzsMIKqdyc7wbG1Sq4mEN6q5zVeKPgAKvPgY3PV/edit

- spreadsheet = ![[Norgenic_Sabadell_€-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[Norgenic_Sabadell_€-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("1-3qlwX6rnA6-vtgHzKBVNIChPu1Ee-4-l6amNT7OjXY");
let idCarpetaDrive = "1xOcsh1HW31HHI5LW9tcGIxlQ5sCgC3Uz"
let filaInicioDatosImportados = 10
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(2,1,bdsheet.getLastRow()-1,bdsheet.getLastColumn()).getValues();
```


## Plantilla
![[Plantilla-A1_ImportarMovimientos]]