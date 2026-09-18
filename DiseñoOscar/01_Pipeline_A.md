## A 
Condición: Obligatorio para todos los bancos.

### A0: Recepción de Extractos bancarios
**Processo**:
- El encargado nos envia por iniciativa propia o petición nuestra un xlsx/csv de un extracto bancario.
- Detectamos la empresa a la que corresponde. [[00_Empresas&Bancos]]
- Detectamos el banco que corresponde.
- Subimos el archivo a la carpeta correspondiente.

### A1: Update de los historicos de Extractos bancarios
**Processo**:
- Ejecutamos el wf/scrip encargado de hacer el Upsert a [[AquitecturaBancos#BDB]] para la empresa y el banco correspondiente. La prioridad de ejcución es **AppScripts**-->**n8n**-->**Python** (Si no hay uno saltamos al siguiente).
    - Ejemplo: Si es **Norgenic** **Caixabank** **EUR** usaremos la arquitectura de [[N€Caixa-Aquitectura]] con sus **Scripts** y **Workflows** correspondientes.


### A2: Enriquecimiento de Movimientos
**Processo**:
- 