# Contexto del Workflow: Autom.Facturas-Empresas(Gmail_Regex) Metralleta

## Descripción General
Este workflow de n8n (Gmail_Metralleta.json) inicia el proceso de facturación detectando correos electrónicos de finanzas en Gmail (etiqueta específica: Label_1255925899534323982) que contienen adjuntos PDF no leídos. Filtra y descarga solo los PDF, los clasifica según la empresa compradora mencionada en el contenido (Norgenic, Global Documents, Worldwide Solicitors, Taxgov u Other) usando condiciones basadas en strings y regex. Envía los PDF a carpetas específicas en Google Drive para cada empresa, o a pendientes de revisión si no cumplen criterios, marcando el email como leído. Si no es PDF o no tiene adjuntos, termina en nodos NoOp. El flujo clave es hasta Norgenic (Google Drive6), que en el futuro alimentará el workflow "Cebollón" para filtrar facturas válidas hacia "Cuadrar" (punteo via fórmulas o workflow "Puntear") y actualizar el Sheet histórico bancario con nombres de facturas, o revisión manual si no cumplen.

En un contexto E2E/BPO, automatiza la ingesta y clasificación inicial de facturas, integrándose con workflows previos (e.g., conciliación bancaria) y futuros (punteo/facturación), mejorando eficiencia en procesos financieros como recepción de facturas, compliance y reconciliación.

## Análisis Detallado del Flujo de Trabajo
### Nodos Principales y Funciones
- **On email received** (GmailTrigger): Polling cada minuto para correos no leídos con adjuntos en etiqueta específica (finanzas).
- **Has attachments?** (If): Verifica si hay binarios adjuntos; si no, termina en NoOp.
- **Iterate over email attachments** (Code): Bucle para procesar cada adjunto individualmente.
- **Is PDF** (If): Chequea extensión .pdf; si no, termina en NoOp.
- **Extract from File1** (ExtractFromFile): Extrae texto de PDF (modo text).
- **Upload file to folder** (GoogleDrive): Sube PDF a carpeta temporal.
- **Google Drive1** (GoogleDrive): Mueve PDF a carpeta de facturación (URL: https://drive.google.com/drive/folders/17WR7hfIet-hcpFrjHW0agwHsC8KnM1Sn).
- **Gmail6** (Gmail): Marca email como leído.
- **Google Drive2** (GoogleDrive): Descarga PDF para extracción.
- **Extract from File** (ExtractFromFile): Extrae contenido PDF completo.
- **Loop Over Items** (SplitInBatches): Bucle sobre páginas/extraídas (reset false para mantener estado).
- **Edit Fields Pre_If's** (Set): Asigna 'text' para clasificación.
- **If Taxgov/WW/GD/Norgenic** (If): Condiciones OR con contains para detectar empresa en texto (e.g., "Taxgov" o "TAXGOV").
- **SwitchWW/GD/Empresa Compradora** etc. (Switch): Ramifica por subcasos de empresas (e.g., proveedores específicos como Crec, ViaTribut).
- **Edit Fields [Empresa]** (Set): Asigna "Empresa Compradora" (e.g., "Taxgov", "Norgenic").
- **If [Empresa] not empty** (If): Verifica si hay coincidencia; si no, envía a revisión.
- **Edit Fields Nombre Factura** (Set): Asigna nombre factura basado en clasificación.
- **Google Drive [N]** (GoogleDrive): Mueve PDF a carpeta específica (e.g., Google Drive6 para Norgenic).
- **Gmail [N]** (Gmail): Alertas por email si revisión needed.

El JSON truncado implica nodos adicionales para ramificaciones detalladas (e.g., switches para proveedores como Bing, Google en Taxgov).

### Conexiones y Flujo Lógico
Flujo lineal con ramificaciones condicionales:
```
On email received → Has attachments? → [True: Iterate over email attachments → Is PDF → [True: Extract from File1 → Upload file to folder → Google Drive1 → Gmail6 → Google Drive2 → Extract from File → Loop Over Items → Edit Fields Pre_If's → If Taxgov → [True: If TAXGOV-NORGENIC → [True: Edit Fields Taxgov → If EmpresaCompradora → Edit Fields EmpresaCompradora → Switch Empresa Compradora → Switch Empresas TaxG → [ramas: Edit Fields TaxG-Bing/Google → If TG not empty → If → Edit Fields Nombre Factura2 → Google Drive5 → Google Drive6 (Norgenic?)] | False: Edit Fields Other → Google Drive13 → Gmail1] | False: If WW → [ramas similares para WW/GD/Norgenic → ... → Google Drive6 para Norgenic]] | False: If1 → Edit Fields Other → ...]]
| False (no PDF): Not a PDF
| False (no adjuntos): There are no attachments
```
- Input: Emails con adjuntos PDF (binary data).
- Outputs: PDFs movidos a Drive carpetas por empresa; emails marcados leídos; alertas si Other/revision.

### Mapeo de Datos
- Campos clave: text (contenido PDF extraído), Empresa Compradora (asignado via Sets), NombreFactura (para histórico).
- Clasificación: Basada en contains/regex en text (e.g., /WORLDWIDE SOLICITORS/ para WW).
- Binarios: Adjuntos procesados como binary.data (fileName, fileExtension).
- Posibles issues: Regex case-sensitive; falsos positivos si texto ambiguo; truncado en JSON sugiere más mappings.

## Contexto para Informe E2E/BPO
En un flujo E2E/BPO, este workflow orquesta la ingesta inicial de facturas:
- **Eficiencia**: Automatiza detección/clasificación, reduce manejo manual; polling asegura procesamiento timely (timeout 300s para batches grandes).
- **Integraciones**: Gmail (triggers/alertas), Google Drive (almacenamiento); se integra con workflows bancarios (histórico) y futuros (Cebollón → Cuadrar/Puntear).
- **Gestión de Errores**: Fallbacks a Other/revision con alertas; sugerencia: Agregar logging o conteo de fallos; validar PDF integrity post-extracción.
- **Escalabilidad y Optimización**: Para BPO, mejorar regex con ML (Machine Learning) para precisión; monitorear volúmenes por empresa. Enlace a histórico bancario facilita reconciliación; futuro Cebollón optimizará punteo automático. Métricas: % facturas clasificadas automáticamente, tiempo de procesamiento por email, tasa de revisión manual.
- **Seguridad**: Credenciales OAuth; scopes limitados a etiquetas/carpeta específicas.
Este contexto permite a un LLM/MCP razonar sobre integración con workflows como ImportarMovimientos/Asignación de Gastos para informes financieros E2E.