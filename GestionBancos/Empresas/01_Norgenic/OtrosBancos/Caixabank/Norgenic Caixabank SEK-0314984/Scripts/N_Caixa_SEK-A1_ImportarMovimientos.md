## Introducción.
ScriptURL: : https://script.google.com/u/0/home/projects/1IDTX38Vutqew3I2dH-TC-VL2TjMpVA3ANAWnq4vnWORsRlT7HloBkDO6/edit

- spreadsheet = ![[N_Caixa_SEK-AquitecturaBanco#SS_ID]];
- bdsheet = spreadsheet.getSheetById(![[N_Caixa_SEK-BD_Banco#Gid]]);

## InputsVariables
```js
let spreadsheet = SpreadsheetApp.openById("1oB0uGdeuMT8I8dypY48GZVi7CyjQptFLFBZJMCZCD9k");
let idCarpetaDrive = "1NQhIPTyfmAb_PiziUh2LL6j7aPNeCo1p"
let filaInicioDatosImportados = 4
let bdsheet = spreadsheet.getSheetById(0);
let bdSheetRange = bdsheet.getRange(2,1,bdsheet.getLastRow()-1,bdsheet.getLastColumn()).getValues();
```


## Plantilla
![[Plantilla-A1_ImportarMovimientos]]