# ReenvioFacturas_context.md

## Descripción General
Este workflow de n8n, llamado "RedirectNorgenic", gestiona el reenvío de facturas de Norgenic a fiscalistas (ViaTribut). Se activa manualmente o por schedule/webhook, lista carpetas en Drive, identifica facturas no enviadas, copia archivos a carpetas compartidas con nombres similares (e.g., "Enviadas a ViaTribut"), mueve originales a "Enviadas", y actualiza el Sheet HistorialFacturas (columnas M:O) con IDs de documentos para tracking de ubicación y fecha de envío. Incluye waits para sincronización y filtros para procesar solo carpetas relevantes. Sirve como registro y seguimiento de facturas, asegurando trazabilidad en procesos fiscales.

En un contexto E2E/BPO, automatiza el flujo de documentos fiscales post-procesamiento (integrado con Cebollón para preparación), reduce carga manual en contabilidad, y enlaza con histórico bancario para compliance. Mejora eficiencia en orquestación de facturación, con riesgos en dependencias de nombres de carpetas.

## Análisis Detallado del Flujo de Trabajo
### Nodos Principales y Funciones
- **When clicking ‘Test workflow’** (ManualTrigger): Inicio manual para pruebas.
- **Schedule Trigger**: Ejecuta diariamente a medianoche.
- **Webhook**: Endpoint para llamadas externas.
- **Wait2/Wait3**: Pausas (amount 0, posiblemente para webhook resume).

- **Google Search NorgenicFolders** (GoogleDrive): Lista carpetas en raíz Norgenic.
- **Loop Over Items** (SplitInBatches): Bucle sobre carpetas/archivos.
- **Edit Fields**: Asigna id, name, webViewLink de carpeta.
- **Google ArchivosPorCarpeta** (GoogleDrive): Lista archivos en carpeta actual (fields: id, name, webViewLink).
- **If1** (If): Chequea si hay >1 item (archivos en carpeta).
- **Switch** (Switch): Clasifica por nombre carpeta (EnviadasViaTribut, PendientesViaTribut).
- **Edit Fields3/Edit Fields2** (Set): Asigna id/name para procesar.
- **Merge** (Merge): Combina ramas.
- **Google CarpetaEnviadas** (Set): Asigna id/name de copia.
- **Google Drive CarpetasVT** (GoogleDrive): Lista carpetas en ViaTribut.
- **Filter NombresCarpetas NG-VT** (Set): Filtra/asigna carpeta coincidente.
- **Google VT** (GoogleDrive): Copia archivo a carpeta fiscalista.
- **Google Drive Google ID_DocCopiado** (GoogleDrive): Lista en carpeta fiscalista.
- **Filter** (Filter): Chequea si nombre coincide con enviadas.
- **Google Sheets** (GoogleSheets): Actualiza HistorialFacturas (columnas M:O con ID, fecha envío).

El JSON truncado en switch conditions, pero enfocado en copiar/mover archivos y actualizar Sheets.

### Conexiones y Flujo Lógico
Flujo looped con ramificaciones:
```
[Triggers: Manual / Schedule / Webhook] → Wait2 → Wait3 → Google Search NorgenicFolders → Loop Over Items → Edit Fields → Google ArchivosPorCarpeta → If1 (>1 item?) → Switch (nombre carpeta) → [Enviadas: Edit Fields3 | Pendientes: Edit Fields2] → Merge → Google VT (copy to fiscalista) → Google CarpetaEnviadas → Google Drive CarpetasVT → Filter NombresCarpetas NG-VT → Google Drive Google ID_DocCopiado → Filter (coincide enviadas?) → Google Sheets (update HistorialFacturas M:O)
```
- Input: Carpetas/archivos en Drive.
- Outputs: Copias en fiscalistas, movimientos a "Enviadas", updates en Sheets.

### Mapeo de Datos
- Campos: id, name, webViewLink de archivos/carpetas.
- Clasificación: Via match regex en name (e.g., /(?:EnviadasViaTribut|Enviadas Via Tribut|Enviadas a ViaTribut)/).
- Updates: En HistorialFacturas, columnas M:O con ID copia, fecha envío, ubicación.
- Dependencias: Nombres carpetas exactos; IDs Drive.

## Contexto para Informe E2E/BPO
En BPO fiscal/contable, este workflow orquesta reenvío y tracking post-Cebollón, asegurando compliance. Eficiencia: Automatiza copias/updates, reduce errores. Integraciones: Drive (list/copy/move), Sheets (update HistorialFacturas linkeado a bancario). Errores: Sensible a nombres; sugerencia: Agregar error handling para mismatches. Escalabilidad: Buen para volúmenes bajos; monitorear duplicados. Métricas: % facturas enviadas timely, tiempo seguimiento. Enlace a histórico facilita auditorías; sirve como log para procesos E2E facturación.