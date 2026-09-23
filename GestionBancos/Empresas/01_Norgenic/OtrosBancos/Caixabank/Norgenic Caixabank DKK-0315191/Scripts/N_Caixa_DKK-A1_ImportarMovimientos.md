## Introducción.
ScriptURL: : https://script.google.com/u/0/home/projects/17-HBmWU5SDpsGfqOqrqI6IYBqPaZW6dqIkOuTmhgQDWc2XpkY8_xrlBd/edit

- spreadsheet = ![[N_Caixa_DKK-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[N_Caixa_DKK-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("1wzX6YHW_RANujF1SGCgXWyfUxI-ImHozzJnra9H3bIU");
let idCarpetaDrive = "1XQeCOEaLY6ZmZkZxvU2MWLCJEnWKFxXt"
let filaInicioDatosImportados = 4
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(2,1,bdsheet.getLastRow()-1,bdsheet.getLastColumn()).getValues();
```


## Plantilla
![[Plantilla-A1_ImportarMovimientos]]