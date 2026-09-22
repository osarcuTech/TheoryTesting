
# Plantilla Pipeline.
**Objetivo**: Mostrar el flujo tipico de datos de la gestión de todo banco de este grupo de empresas. 
**Aviso**: Cada empresa y banco variara ligeramente su arquitectura y su pipeline por lo que, tras aberiguar la empresa y banco que estamos gestionando, consultaremos su versión particular para adaptar el proceso a sus herramientas. [[00_Empresas&Bancos]] [[00_AquitecturaBancos]].
    - Ejemplo: Si es **Norgenic** **Caixabank** **EUR** usaremos la arquitectura de [[N_Caixa_AUD-Aquitectura]] con sus **Scripts** y **Workflows** correspondientes.
**Herramientas prioritarias**: La prioridad de ejcución es **AppScripts**-->**n8n**-->**Python**-->**Manual** (Si no hay uno saltamos al siguiente).


## A 
Condición: Obligatorio para todos los bancos.

### A0
**TLDR**: Recepción de Extractos bancarios
**Objetivo**: Poner el documento a disposición de A1.
**Processo**:
- El encargado nos envia por iniciativa propia o petición nuestra un xlsx/csv de un extracto bancario.
- Detectamos la empresa a la que corresponde. [[00_Empresas&Bancos]]
- Detectamos el banco que corresponde.
- Subimos el archivo a la carpeta correspondiente.

### A1: 
**TLDR**: Update de los historicos de Extractos bancarios
**Objetivo**: Hacer un Upsert de los movimientos bancarios.
**Processo**: Ejecutamos el wf/scrip encargado de hacer un processo ETL de los datos añadios a la carpeta a [[00_AquitecturaBancos#BDB]]. 


### A2
**TLDR**: Enriquecimiento de Movimientos 
**Objetivo**: 
**Processo**: Classificación de los movimientos por su relación con el cashflow y, opcionalmente, con otra información relacinada da la facturación.
- 

## B
Condición: "Opcional" = Solo obligatorio para los bancos con facturas de proveedores.

### B0
**TLDR**:  Recepción de Facturas
**Objetivo**: Poner las facturas a disposición de B1 o B2.
**Processo**: Captura de las facturas no obtenidas automaticametne por B1 (ej: Llegan por GoogleChat; falla el trigger de B1; se han de volver a processar por algún error en B1/B2) para ponerlas en la carpeta utilizada por B1 (si hay varias empresas) o (B2) para la empresa correspondiente (Si estamos seguros de que no hay mezclas). La carpeta en questión es https://drive.google.com/drive/folders/17WR7hfIet-hcpFrjHW0agwHsC8KnM1Sn "Facturación".

### B1
**TLDR**:  Clasificación por empresa
**Objetivo**: Classificar las facturas del grupo por empresa y enviarlas a la carpeta correspondiente para B2.
**Processo**: [[wf_B1_GmailMetralleta_Context]]


### B2
**TLDR**:  Renombrado de pdf y Registro en BD_Facturas
**Objetivo**: Sacar la información de la factura relevante (Fecha_Proveedor_Importe_Divisa_idFactura_EmpresaDelGrupo) para C0 y depositado en una carpeta temporal para la comprobación por [[H0_ControlHumano]]
**Processo**: n8n (ej: [[wf_B2_Cebollon_Context]]) o manual [[H0_ControlHumano]].



## C
Condición: "Opcional" = Solo obligatorio para los bancos con facturas de proveedores.

### C0
**TLDR**:  Asociación de Movimientos y Facturas
**Objetivo**: Que cada factura este asociada a los movimientos bancarios que le correspondan.
**Processo**: Formulas en Google Sheets (ej: [[N_Caixa_AUD-BD_Movimientos#H]] en su momento usamo el actualmente deprecado [[wf_C0_PuntearFacturas_context]] pero actualmente no hay ningún worklow n8n funcional) o manualmente [[H0_ControlHumano]]. 


### C1
**TLDR**:  Envio de Facturas a ViaTribu
**Objetivo**: Enviar una copia de las facturas a la empresa que nos lleba la contabilidad y poner la nuestra en otra carpeta como señal que ya ha sido enviada.
**Processo**: n8n (ej: [[wf_C1_ReenvioFras_context]]) o manual [[H0_ControlHumano]].


### C2
**TLDR**:  Comprobación de la corrección en el envio.
**Objetivo**: Comprobación de que todas nuestras facturas se encuentran el las carpeta que ViaTribut tiene para las pendientes de contabilizar o en la de ya contabilizadas.
**Processo**: n8n (ej: [[wf_C2_ComprobFras_Context]]) o manual [[H0_ControlHumano]].



## D
Condición: Obligatorio para todos los bancos.

### D1
**TLDR**:  Exportación de movimientos a Odoo
**Objetivo**: Tener los movimientos bancarios actualizados en Odoo para comparar con la contabilidad de Via Tribut.
**Processo**: manual [[H0_ControlHumano]] assistido por formulas en Google Sheets.


### D2
**TLDR**:  Control Plataformas/Proveedores inusuales
**Objetivo**: Mantener actualizado el saldo de proveedores con facturas inusuales para comprobar su correcció y/o comprobar la correcta recepción de los pagos de las distintas plataformas utilizadas para la orquestación de pagos (ej: Checkout).
**Processo**: manual [[H0_ControlHumano]] assistido por formulas en Google Sheets.



## E
Condición: Obligatorio para todos los bancos.

### E1
**TLDR**:  Preparación de Cashflows
**Objetivo**: Actualización de formulas e información introducida manualmente (ej: saldo a final de cada mes) para E2.
**Processo**: manual [[H0_ControlHumano]] assistido por formulas en Google Sheets.


### E2
**TLDR**:  Control de Cashflows
**Objetivo**: Comprobación del correcto estado de toda la información, analisis y generación de informes cuando sea pertinente.
**Processo**: manual [[H0_ControlHumano]] assistido por formulas en Google Sheets.




