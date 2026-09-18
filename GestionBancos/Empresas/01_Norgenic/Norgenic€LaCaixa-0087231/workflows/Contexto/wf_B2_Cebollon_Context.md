# Contexto del Workflow: Autom.Fact.Norgenic (Loop Over Invoice List) Cebollón

## Descripción General
Este workflow de n8n (Cebollon.json), conocido como "Cebollón", detecta la adición de facturas (PDF) en una carpeta específica de Google Drive (https://drive.google.com/drive/folders/1TWAWtb7FC52wXBHsJdB5YHOw4w70rZmu). Extrae el texto del PDF, usa regex y condiciones para clasificar por empresa proveedora (e.g., Ahrefs, ViaTribut, Movistar, GoogleAds) y extraer información clave como nºFactura, Empresa Vendedora, Fecha Factura, ImporteTotal, Empresa Compradora. Formatea la fecha y renombra el PDF (e.g., fecha_empresa_Importe_Moneda_NumeroFactura_Norgenic.pdf). Verifica si los campos requeridos están completos; si sí, envía a carpeta "Cuadrar" (para punteo via fórmulas o workflow "Puntear" futuro) y actualiza el Sheet histórico bancario (ID: inferido de previos, Sheet: HistóricoFacturas) agregando el nombre si no existe (eliminando duplicados). Si no cumplen requisitos, envía a revisión manual con alerta por email.

En un contexto E2E/BPO, este workflow filtra y prepara facturas para reconciliación financiera, integrándose con workflows previos (e.g., Gmail_Metralleta para ingesta) y futuros (Puntear para matching con movimientos bancarios), optimizando procesos de facturación, compliance y auditoría.

## Análisis Detallado del Flujo de Trabajo
### Nodos Principales y Funciones
- **Google Drive Trigger1**: Trigger que detecta creación de archivos en carpeta (polling cada minuto).
- **Google Drive**: Lista las facturas detectadas en la carpeta.
- **Loop Over Items1**: Es usado para procesar las facturas una a una, por separado.
- **Google Drive2**: Descarga la factura individual para procesamiento adicional.
- **Extract from File**: Extrae contenido PDF.
- **Edit Fields Pre_If's**: Asigna 'text' del PDF para regex.
- **Switch Empresa Vendedora** (y muchos switches como Switch, Switch1): Clasifica por proveedor usando contains en text (e.g., "Ahrefs", "VIA TRIBUT", "TELEFONICA", "Google Ads").
- **Edit Fields [Proveedor]**: Asigna "Empresa Vendedora" (e.g., "Vitaly Health Services", "Canva", "Nexmo Ltd.").
- **If TG not empty**: Verifica campos no vacíos (nºFactura, Empresa Vendedora, Fecha Factura, ImporteTotal, Empresa Compradora).
- **Code**: JavaScript para extraer y formatear campos (fecha, empresa, nºFactura, importe, moneda) via regex.
- **Edit Fields ImporteTotalFormatado**: Formatea ImporteTotal a number (reemplaza '.' y ',').
- **Edit Fields Nombre Factura2**: Construye nombre PDF formateado.
- **Google Drive5**: Mueve a "Cuadrar" (URL: https://drive.google.com/drive/folders/1XQ-zoNbAz910MdC_zrb5hjUc-zl8UtuX).
- **Google Drive6**: Actualiza nombre en Drive.
- **Google Drive4**: Mueve a revisión (URL: https://drive.google.com/drive/folders/1nzTB7wdzOGMQp9y29Xla9ov2di8WvLBm).
- **Gmail4**: Envía alerta revisión.
- **If5**: Chequea NombreFactura no vacío. !!!Incorrecto, repassar¡¡¡
- **Google Sheets3**: Lee Sheet histórico facturas (ID: 1sZeGfiuG7Ab9jx14_-oaQZTtrhIohlx5dhYoSgZCOuw, Sheet: 1963712436).
- **Edit Fields1**: Asigna NombreFactura.
- **Remove Duplicates**: Compara para evitar duplicados.
- **Filter**: Filtra vacíos.
- **Edit Fields**: Prepara para append.(Inactivo)
- **Google Sheets**: Appendea a histórico facturas.
- **When Executed by Another Workflow**: Para llamada externa.

El JSON está altamente truncado, con muchos Edit Fields para proveedores específicos (e.g., Everapi, Coremind, Laravel) y switches para subcasos (e.g., Telefonica/Movistar).

### Conexiones y Flujo Lógico
Flujo lineal con ramificaciones por switches y loops:
```
[Triggers: Google Drive Trigger1 / When Executed by Another Workflow] → Google Drive → Loop Over Items1 (bucle sobre items) → Google Drive2 → Extract from File → Edit Fields Pre_If's → Switch Empresa Vendedora → [ramas por proveedor: Edit Fields [Proveedor] → If TG not empty → [True: Code → Edit Fields ImporteTotalFormatado → Edit Fields Nombre Factura2 → Google Drive5 → Google Drive6 → If5 → Google Sheets3 → Edit Fields1 → Remove Duplicates → Filter → Edit Fields → Google Sheets (append histórico)] | False: Google Drive4 → Gmail4 (revisión/alert)]
```
- Input: Metadatos de archivo nuevo (ID, name).
- Outputs: PDFs renombrados/movidos; actualizaciones en Sheet histórico.

### Mapeo de Datos
- Campos extraídos via regex en Code: Fecha Factura (DD/MM/YYYY → YYYY-MM-DD), Empresa Vendedora, nºFactura ([w d -]+), ImporteTotal ([d.,]+ €), Moneda (w+ default EUR).
- Asignados: Empresa Compradora ("Norgenic" inferido), ImporteTotal formateado (number).
- NombreFactura: Concatenación (FechaFormateada_EmpresaVendedora_ImporteTotal_Moneda_nºFactura_EmpresaCompradora).
- Histórico: Appendea NombreFactura; matching/duplicados via NombreFactura.
- Posibles issues: Regex fallan si formatos varían; truncado oculta mappings completos.

## Contexto para Informe E2E/BPO
En un flujo E2E/BPO, este workflow procesa facturas post-ingesta (de Gmail_Metralleta), preparando para punteo:
- **Eficiencia**: Regex automatiza extracción/clasificación; loop maneja batches; timeout 180s para PDFs grandes.
- **Integraciones**: Google Drive (triggers/moves), Gmail (alertas), Sheets (histórico bancario linkeado a workflows como ImportarMovimientos).
- **Gestión de Errores**: Fallback revisión con alerta; deduplicación previene entradas repetidas. Sugerencia: Agregar OCR si PDFs escaneados; validar regex con samples.
- **Escalabilidad y Optimización**: Para BPO, extender switches para nuevos proveedores; integrar AI (e.g., OpenAI para extracción si regex falla). Monitoreo: % facturas auto-procesadas, tiempo por factura. Enlace a "Cuadrar"/"Puntear" facilita reconciliación con movimientos bancarios; histórico asegura traceability para auditorías.
- **Seguridad**: Credenciales OAuth; carpetas segregadas por empresa.
Este contexto ayuda a un LLM/MCP a evaluar integración en cadena facturación, optimizaciones o depuración para informes BPO.