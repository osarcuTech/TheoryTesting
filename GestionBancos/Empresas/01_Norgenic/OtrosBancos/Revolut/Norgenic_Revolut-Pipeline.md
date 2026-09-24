
# Plantilla Pipeline.
**Objetivo**: Mostrar el flujo tipico de datos de la gestión de todo banco de este grupo de empresas. 
**Aviso**: Cada empresa y banco variara ligeramente su arquitectura y su pipeline por lo que, tras aberiguar la empresa y banco que estamos gestionando, consultaremos su versión particular para adaptar el proceso a sus herramientas. [[00_Empresas&Bancos]] [[00_AquitecturaBancos]].
**Herramientas prioritarias**: La prioridad de ejcución es **AppScripts**-->**n8n**-->**Python**-->**Manual** (Si no hay uno saltamos al siguiente).


## A 
Condición: Obligatorio para todos los bancos.

### A0
**TLDR**: Recepción de Extractos bancarios
**Objetivo**: Poner el documento a disposición de A1.
**Processo**:
- El encargado nos envia por iniciativa propia o **petición nuestra** un xlsx/csv de un extracto bancario.
- Detectamos la empresa a la que corresponde. [[00_Empresas&Bancos]].
- Detectamos el banco que corresponde. Todos los archivos contienen en su nombre o en su interior los últimos 4 digitos de la targeta. Se usa esto y/o el contenido (si el nombre del arxivo es incorrecto) para detectar el match del "Importado" con el [[N_Revolut-AquitecturaBanco#NombreSpreadSheet|Historico]]
- Subimos el archivo a la carpeta correspondiente [[N_Revolut-AquitecturaArchivos#A1_Input]].

### A1: 
**TLDR**: Update de los historicos de Extractos bancarios
**Objetivo**: Hacer un Upsert de los movimientos bancarios.
**Processo**: 
    - Ejecutamos el [[N_Revolut-Wf_A1_ImportarMovimientos|workflow]]/script encargado de hacer un processo ETL de los datos añadios a la carpeta a [[N_Revolut-AquitecturaArchivos#A1_Input]]. 
    - El [[N_Revolut-Wf_A1_ImportarMovimientos|workflow]]/script los manda a la carpeta [[N_Revolut-AquitecturaArchivos#A1_Output]] en caso de no estar preparado lo hacemos manualmente para minimizar fuentes con datos duplicados.
    - Los datos se añaden en [[N_Revolut-BD_Banco]].


### A2
**TLDR**: Enriquecimiento de Movimientos 
**Objetivo**: Classificación de los movimientos por su relación con el cashflow y, opcionalmente, con otra información relacinada da la facturación.
**Processo**: 
    - Formulas: [[N_Revolut-BD_Movimientos]], [[N_Revolut-BD_AsigCostes]]:

## B
NULL

## C
NULL

## D
Condición: Obligatorio para todos los bancos.

### D1
**TLDR**:  Exportación de movimientos a Odoo
**Objetivo**: Tener los movimientos bancarios actualizados en Odoo para comparar con la contabilidad de Via Tribut.
**Processo**: manual [[H0_ControlHumano]] assistido por formulas en Google Sheets [[N_Revolut-Odoo]].


### D2
NULL


## E
Condición: Obligatorio para todos los bancos.

### E1
**TLDR**:  Preparación de Cashflows
**Objetivo**: Actualización de formulas e información introducida manualmente (ej: saldo a final de cada mes) para E2.
**Processo**: manual [[H0_ControlHumano]] assistido por formulas en Google Sheets [[N_Revolut-PreCashFlow]].


### E2
**TLDR**:  Control de Cashflows
**Objetivo**: Comprobación del correcto estado de toda la información, analisis y generación de informes cuando sea pertinente.
**Processo**: manual [[H0_ControlHumano]] assistido por formulas en Google Sheets. [[N_Revolut-AquitecturaArchivos#E1_Input|CarpetaCashFlows]].




