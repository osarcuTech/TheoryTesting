
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
- Detectamos el banco que corresponde. Todos los archivos contienen en su nombre o en su interior los últimos 4 digitos de la targeta. Se usa esto y/o el contenido (si el nombre del arxivo es incorrecto) para detectar el match del "Importado" con el [[N_BBVA_€-AquitecturaBanco#NombreSpreadSheet|Historico]]
- Subimos el archivo a la carpeta correspondiente [[N_BBVA_€-AquitecturaArchivos#A1_Input]].

### A1: 
**TLDR**: Update de los historicos de Extractos bancarios
**Objetivo**: Hacer un Upsert de los movimientos bancarios.
**Processo**: 
    - Ejecutamos el [[N_BBVA_€-Wf_A1_ImportarMovimientos|workflow]]/script encargado de hacer un processo ETL de los datos añadios a la carpeta a [[N_BBVA_€-AquitecturaArchivos#A1_Input]]. 
    - El [[N_BBVA_€-Wf_A1_ImportarMovimientos|workflow]]/script los manda a la carpeta [[N_BBVA_€-AquitecturaArchivos#A1_Output]] en caso de no estar preparado lo hacemos manualmente para minimizar fuentes con datos duplicados.
    - Los datos se añaden en [[N_BBVA_€-BD_Banco]].


### A2
**TLDR**: Enriquecimiento de Movimientos 
**Objetivo**: Classificación de los movimientos por su relación con el cashflow y, opcionalmente, con otra información relacinada da la facturación.
**Processo**: 
    - Formulas: [[N_BBVA_€-BD_Movimientos]], [[N_BBVA_€-BD_AsigCostes]]:

## B
Condición: "Opcional" = Solo obligatorio para los bancos con facturas de proveedores.

### B0
**TLDR**:  Recepción de Facturas
**Objetivo**: Poner las facturas a disposición de B1 o B2.
**Processo**: 
    - Captura manual de las facturas no obtenidas automaticametne por B1 para decidir si ponerlas en la carpeta de B1 o B2.
        - ej: Llegan por GoogleChat; falla el trigger de B1; se han de volver a processar por algún error en B1/B2
    - Decisión de carpeta:
        - [[N_BBVA_€-AquitecturaArchivos#B1_Input|B1]]: Si hay varias empresas.
        - [[N_BBVA_€-AquitecturaArchivos#B1_Output|B2]]: Para la empresa correspondiente (Si estamos seguros de que no hay mezclas). 
    - Carpeta input B1: https://drive.google.com/drive/folders/17WR7hfIet-hcpFrjHW0agwHsC8KnM1Sn "Facturación".
    - Carpeta input B2: Manual "Facturación".

### B1
**TLDR**:  Clasificación por empresa
**Objetivo**: Classificar las facturas del grupo por empresa y enviarlas a la carpeta correspondiente para B2.
**Processo**: 
    - Workflow: [[wf_B1_GmailMetralleta_Context]]
    - Carpeta Intput: [[N_BBVA_€-AquitecturaArchivos#B1_Input|B1]]
    - Carpeta Output Exito: [[N_BBVA_€-AquitecturaArchivos#B1_Output|B1]]
    - Carpeta Output Fallo 1: No detecta la empresa [[N_BBVA_€-AquitecturaArchivos#B1_Fail_1|B1]]
    - Carpeta Output Fallo 2: No detecta el proveedor [[N_BBVA_€-AquitecturaArchivos#B1_Fail_2|B1]]


### B2
**TLDR**:  Renombrado de pdf y Registro en BD_Facturas
**Objetivo**: Sacar la información de la factura relevante (Fecha_Proveedor_Importe_Divisa_idFactura_EmpresaDelGrupo) para C0 y depositado en una carpeta temporal para la comprobación por [[H0_ControlHumano]]
**Processo**: 
    - Workflow: [[wf_B2_Cebollon_Context|workflow]]/[[H0_ControlHumano|manual]]
    - Carpeta Intput: [[N_BBVA_€-AquitecturaArchivos#B1_Output|B1]]
    - Carpeta Output Exito: [[N_BBVA_€-AquitecturaArchivos#B2_Output|B1]]
    - Carpeta Output Fallo 1: No detecta la empresa [[N_BBVA_€-AquitecturaArchivos#B1_Fail_1|B1]]
    - Carpeta Output Fallo 2: [[N_BBVA_€-AquitecturaArchivos#B1_Fail_1|B1]]



## C
Condición: "Opcional" = Solo obligatorio para los bancos con facturas de proveedores.

### C0
**TLDR**:  Asociación de Movimientos y Facturas
**Objetivo**: Que cada factura este asociada a los movimientos bancarios que le correspondan.
**Processo**: 
    - Alternativas:
        - Formulas en Google Sheets: [[N_BBVA_€-BD_Movimientos#H]] 
        - n8n: Actualmente deprecado [[wf_C0_PuntearFacturas_context]]
        - Manualmente: [[H0_ControlHumano]]. 


### C1
**TLDR**:  Envio de Facturas a ViaTribut
**Objetivo**: Enviar una copia de las facturas a la empresa que nos lleba la contabilidad y poner la nuestra en otra carpeta como señal que ya ha sido enviada.
**Processo**: 
    - Alternativas:
        - n8n: [[wf_C1_ReenvioFras_context]]. 
            - Se debe configurar la carpeta de input y las de output cada mes.
                - Input: Mes actual nuestro.
                - OutputEmpresa: "Enviadas ViaTribut".
                - Output: Mes actual Via Tribut.
            - El workflow registra automaticamente la id de la factura en [[N_BBVA_€-BD_MovimientosT]]
        - manual: [[H0_ControlHumano]].


### C2
**TLDR**:  Comprobación de la corrección en el envio.
**Objetivo**: Comprobación de que todas nuestras facturas se encuentran el las carpeta que ViaTributt tiene para las pendientes de contabilizar o en la de ya contabilizadas.
**Processo**:
    - Alternativas:
        - n8n: [[wf_C2_ComprobFras_Context]]. 
            - Se debe configurar la carpeta de input y las de output cada mes.
                - Input 1 : Mes buscado (nuestro) -->"Enviadas ViaTribut".
                - Input 2: Mes buscado Via Tribut ("Enviados").
                - Input 3: Mes buscado Via Tribut ("Contabilizados").
            - El workflow registra automaticamente la id de la factura en [[N_BBVA_€-BD_MovimientosT]]
        - manual: [[H0_ControlHumano]].



## D
Condición: Obligatorio para todos los bancos.

### D1
**TLDR**:  Exportación de movimientos a Odoo
**Objetivo**: Tener los movimientos bancarios actualizados en Odoo para comparar con la contabilidad de Via Tribut.
**Processo**: manual [[H0_ControlHumano]] assistido por formulas en Google Sheets [[N_BBVA_€-Odoo]].


### D2
**TLDR**:  Control Plataformas/Proveedores inusuales
**Objetivo**: Mantener actualizado el saldo de proveedores con facturas inusuales para comprobar su correcció y/o comprobar la correcta recepción de los pagos de las distintas plataformas utilizadas para la orquestación de pagos (ej: Checkout).
**Processo**: manual [[H0_ControlHumano]] assistido por formulas en Google Sheets. Lista:
    - Control Plataformas: [[N_BBVA_€-ControlPlataformas]].
    - Proveedor1: 



## E
Condición: Obligatorio para todos los bancos.

### E1
**TLDR**:  Preparación de Cashflows
**Objetivo**: Actualización de formulas e información introducida manualmente (ej: saldo a final de cada mes) para E2.
**Processo**: manual [[H0_ControlHumano]] assistido por formulas en Google Sheets [[N_BBVA_€-PreCashFlow]].


### E2
**TLDR**:  Control de Cashflows
**Objetivo**: Comprobación del correcto estado de toda la información, analisis y generación de informes cuando sea pertinente.
**Processo**: manual [[H0_ControlHumano]] assistido por formulas en Google Sheets. [[N_BBVA_€-AquitecturaArchivos#E1_Input|CarpetaCashFlows]].




