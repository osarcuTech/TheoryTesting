# Contexto del workflow: Cebollón (wf_B2_Cebollon)

## Propósito y alcance

Workflow de n8n para recoger archivos de la carpeta de facturación de Norgenic, extraer datos de facturas/recibos, clasificarlos por proveedor, renombrarlos y moverlos a la carpeta de conciliación o a revisión. También registra archivos procesados en la hoja de Google Sheets **BD Facturas** y, para los elementos que pasan por esa rama, lanza el workflow **Fras.Odoo**.

El JSON contiene 111 nodos. La extracción está configurada para PDF; no se observa un nodo OCR. Por tanto, no debe darse por hecho que procesa correctamente PDF escaneados sin texto extraíble.

## Entradas y arquitectura

Hay dos entradas:

- **Google Drive Trigger1**: vigila la carpeta de facturación, cada minuto, ante la creación de archivos. La configuración del trigger acepta todos los tipos de archivo, aunque el nodo de extracción posterior está configurado para PDF.
- **When Executed by Another Workflow**: permite iniciar el flujo desde otro workflow.

Ambas entradas —el trigger de Drive y **When Executed by Another Workflow**— pasan por **VariablesGlobales**. Este nodo centraliza los IDs de Sheets y las carpetas y alimenta tanto la búsqueda de archivos en Drive como la lectura de la hoja mediante **Google Sheets4**. Así, la ejecución iniciada por otro workflow usa la misma configuración y entra en el flujo de control de duplicados que la ejecución iniciada por el trigger.

En la ruta automática, el nodo **Google Drive** consulta los archivos de la carpeta configurada; no se ve que filtre esa búsqueda por el ID del archivo recién notificado por el trigger. Conviene comprobar si se pretende recorrer todo el contenido de la carpeta en cada ejecución.

La secuencia principal es:

```text
Google Drive Trigger1
  → VariablesGlobales
  → Google Drive (listar archivos de la carpeta)
  → Google Sheets4 (leer BD Facturas)
  → Loop Over Items1
  → Google Drive2 (descargar archivo)
  → Extract from File (extraer PDF)
  → Edit Fields Pre_If's (conservar texto extraído)
  → Switch Empresas Norgenic y rutas auxiliares
  → asignación de datos por proveedor/formato
  → validación de campos
      ├─ válidos: formatear fecha e importe, construir nombre,
      │           mover a Cuadrar y renombrar
      └─ incompletos/no clasificados: carpeta de revisión y Gmail4
  → al terminar el lote: deduplicación y comparación con BD Facturas
      → añadir UID y ejecutar Fras.Odoo

When Executed by Another Workflow
  → VariablesGlobales
  → mismas ramas de Google Drive y Google Sheets4
```

## Clasificación y extracción

**Switch Empresas Norgenic** clasifica el texto extraído mediante reglas de coincidencia y tiene decenas de rutas específicas. Las ramas **If** y los switches secundarios distinguen variantes de formato, por ejemplo factura frente a recibo, y casos de Movistar. Los nodos **Edit Fields [proveedor]** asignan campos específicos; no existe un único extractor genérico que aplique la misma regex a todos los proveedores.

Entre las rutas configuradas se encuentran Ahrefs, ViaTribut, GitHub, OpenRouter, Celonis/Make, Slack, Bright Data, LinkedIn, Movistar, Google Ads, OpenAI, Canva, Odoo, Anthropic, Paddle, Endesa, Cloudflare y otros proveedores. La lista exacta puede cambiar al editar el JSON.

Los campos comprobados por las validaciones principales son:

- `nºFactura`
- `Empresa Vendedora`
- `Fecha Factura`
- `ImporteTotal`
- `Empresa Compradora`

Las tres validaciones `If TG not empty`, `If TG not empty1` y `If TG not empty2` exigen que esos cinco campos no estén vacíos. La rama OpenAI tiene rutas separadas para importes en dólares y euros; usa expresiones adaptadas a sus formatos de factura. También se ajustó la extracción de recibos para aceptar variantes de “Visa” y “ending in”.

### Formatos y nombre generado

- **Code** convierte fechas reconocidas a `DD/MM/YYYY` (no a `YYYY-MM-DD`). Contempla formatos en inglés y español y una fecha ISO de entrada.
- **Edit Fields ImporteTotalFormatado** cambia ciertos importes con formato decimal estadounidense, como `1,234.56` o `1234.56`, a texto con coma decimal, como `1234,56`. No garantiza que el resultado sea un valor numérico ni convierte todos los formatos.
- **Edit Fields Nombre Factura2** construye `NombreFactura` concatenando, con guiones bajos: fecha formateada, proveedor, importe, moneda, número de factura y comprador.
- **Google Drive5** mueve el archivo válido a **Cuadrar** y **Google Drive6** actualiza su nombre.

## Revisión de incidencias

Las ramas de validación general que no cumplen los campos requeridos llevan a **Google Drive4** y después a **Gmail4** para revisión. El switch principal y algunos switches secundarios también tienen una ruta hacia esa carpeta cuando no clasifican el documento.

Hay una excepción relevante: la salida falsa de **If TG not empty2** (la validación añadida para OpenAI) no está conectada. Si una factura de esas rutas no cumple los requisitos, el JSON no la envía por esa salida a revisión.

## Registro y deduplicación

**VariablesGlobales** contiene la configuración actual:

- Carpeta de entrada: [Facturación](https://drive.google.com/drive/folders/1TWAWtb7FC52wXBHsJdB5YHOw4w70rZmu)
- Carpeta de salida: [Cuadrar](https://drive.google.com/drive/folders/1XQ-zoNbAz910MdC_zrb5hjUc-zl8UtuX)
- Carpeta de incidencias: [Información faltante](https://drive.google.com/drive/folders/1nzTB7wdzOGMQp9y29Xla9ov2di8WvLBm)
- Documento de Google Sheets: `1e32wr8Lx5e-P6uGApQDnXFxnIQyijgGX6QAITRPZLKI`
- Pestaña (GID): `707381639`

El control de registro usa **BD Facturas**, no una hoja llamada `HistóricoFacturas`:

1. **Google Sheets4** lee la columna `A:A` de la pestaña configurada.
2. **Remove Duplicates** compara por `id`; **Filter** conserva items con `name`.
3. **Compare Datasets** compara `UID` de Sheets con `name` de Google Drive.
4. **Edit Fields1** conserva `name` e `id`; **Google Sheets** añade `name` como `UID` a la hoja.
5. Desde **Edit Fields1** también se inicia **Execute Workflow FrasOdoo**, configurado con `waitForSubWorkflow: false` (la ejecución no espera a que termine).

Así, el identificador que se registra es el nombre del archivo —no `NombreFactura`— y la deduplicación no se basa en la concatenación usada para renombrarlo. La rama conectada de **Compare Datasets** debe seguir verificándose si cambia la configuración de sus salidas.

## Comprobaciones pendientes al mantener el JSON

- **If5** no comprueba que `NombreFactura` exista: evalúa si `name` no contiene `Receipt` **o** no contiene `Ahrefs`. Solo su salida verdadera está conectada al retorno del loop. Conviene confirmar que esta condición y el combinador `or` son intencionados.
- La validación falsa de **If TG not empty2** no tiene ruta conectada, a diferencia de las ramas generales que notifican incidencias.
- No se aprecia una configuración explícita de timeout de 180 segundos en el JSON; no asumir ese límite en documentación operativa.
- La carpeta **Cuadrar** y **Fras.Odoo** forman parte del flujo actual. El JSON no muestra un workflow de “Puntear” ni una conciliación directa con movimientos bancarios.

## Documentación relacionada

- [[N_Caixa_€-Aquitectura]] — arquitectura general del banco y sus bases de datos.
- [[N_Caixa_€-AquitecturaArchivos#B2_Input|CarpetasB2]] — carpetas de entrada, salida y revisión que usa el workflow.
- [[N_Caixa_€-Pipeline#B1|PipelineB1]] — workflow upstream que clasifica facturas del grupo.
- [[N_Caixa_€-Pipeline#B2|PipelineB2]] — función de Cebollón en el proceso de facturas.
- [[N_Caixa_€-BD_Facturas_B2]] — hoja auxiliar rápida donde Cebollón registra los UID.
- [[N_Caixa_€-BD_Facturas]] — base principal de facturas, que importa los UID desde la hoja auxiliar.
- [[N_Caixa_€-HistorialFacturas]] — hoja que desglosa y expone los datos de factura para su uso posterior.
- [[wf_B1_GmailMetralleta_Context]] — contexto del workflow de clasificación previo a B2.
- [[H0_ControlHumano]] — proceso manual relacionado con la revisión y conciliación de facturas.
- [[FrasOdoo.json]] — workflow llamado por Cebollón después de comparar los archivos con la BD de facturas.
- [[wf_C0_PuntearFacturas_context]] — contexto de asociación de facturas y movimientos; el pipeline lo marca como deprecado.
