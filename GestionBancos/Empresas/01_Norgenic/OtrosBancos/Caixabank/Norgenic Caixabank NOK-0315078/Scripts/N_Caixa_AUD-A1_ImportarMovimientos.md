## Introducción.
ScriptURL: : https://script.google.com/u/0/home/projects/1FWzVALMtGyTiymSod7A6_axz6Q-UNK_xCs9KEkAB-z3_v0np92a_as0F/edit

- spreadsheet = ![[N_Caixa_AUD-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[N_Caixa_AUD-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("1us-02j4RbkchrZa4e7JTicsavz5ZeEE35zc3S9R5CrU");
let idCarpetaDrive = "1pthVS8-nZHBeZwlvrMPXmwfHlaK2M6Ep"
let filaInicioDatosImportados = 4
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(2,1,bdsheet.getLastRow()-1,bdsheet.getLastColumn()).getValues();
```


## Plantilla
![[Plantilla-A1_ImportarMovimientos]]