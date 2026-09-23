## Introducción.
ScriptURL: : https://script.google.com/u/0/home/projects/1FGeCo3RzWRJgqk4jALY51SdtvTjYLUVXlck0bhHkD72FzEjxL-N23dQU/edit

- spreadsheet = ![[N_Caixa_GBP-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[N_Caixa_GBP-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("1P1ULeZE04Eeu1Q4RvIKVgclEyjpSDooGVibiUukO9oU");
let idCarpetaDrive = "1qX5wN3MgwPQMht6r5_UTZZ2EMaobe7Hf"
let filaInicioDatosImportados = 4
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(2,1,bdsheet.getLastRow()-1,bdsheet.getLastColumn()).getValues();
```


## Plantilla
![[Plantilla-A1_ImportarMovimientos]]