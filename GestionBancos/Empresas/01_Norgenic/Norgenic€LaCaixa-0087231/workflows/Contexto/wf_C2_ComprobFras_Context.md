# ComprobacionFras_context.md

## Descripción General
Este workflow de n8n, llamado "ComprobaciónFras", sigue al "Reenvio de facturas" y verifica el estado de facturas enviadas a fiscalistas (ViaTribut). Se activa manualmente o por schedule, lista archivos en carpetas específicas de Drive (e.g., Norgenic Enviadas, VT Enviadas/Contabilizadas para un mes dado como 09-2025), compara datasets para detectar diferencias (facturas en Norgenic no en VT, o viceversa), actualiza el Sheet HistorialFacturas (inferido columna P para ubicación real-time), y envía alertas por email si discrepancias. Incluye waits para sincronización y edits para preparar nombres. Sirve para tracking en tiempo real, asegurando que facturas movidas a "Enviadas" se reflejen en carpetas fiscalistas (copiadas vs. contabilizadas), facilitando cierre contable.

En un contexto E2E/BPO, automatiza verificación post-reenvío, integra con histórico bancario/facturas para compliance fiscal, reduce errores manuales en seguimiento, y enlaza con workflows previos para flujo completo de facturación. Mejora auditoría mensual, con potencial para alertas proactivas.

## Análisis Detallado del Flujo de Trabajo
### Nodos Principales y Funciones
- **When clicking ‘Test workflow’** (ManualTrigger): Inicio manual.
- **Schedule Trigger**: Ejecuta diariamente (infiere por previos, aunque no especificado aquí).
- **When Executed by Another Workflow** (ExecuteWorkflowTrigger): Para llamadas externas.
- **Wait/Wait1**: Pausas para sincronización Drive.
- **Google Drive Norgenic Enviadas 09-2025** (GoogleDrive): Lista archivos en carpeta Norgenic "Enviadas" para mes específico.
- **Edit Fields**: Asigna name de archivo.
- **Google Drive VT Enviadas 09-2025** (GoogleDrive): Lista en VT "Enviadas".
- **Google Drive VT Contabilizadas 09-2025** (GoogleDrive): Lista en VT "Contabilizadas".
- **Edit Fields1**: Limpia name (remueve "Copia de ").
- **Edit Fields2**: Similar para otra rama.
- **Compare Datasets Norgenic vs Contabilidad/Enviadas** (CompareDatasets): Compara nombres (fuzzy) para detectar no presentes en VT.
- **Google Sheets Contabilizadas/Enviadas 09-2025** (GoogleSheets): Actualiza HistorialFacturas con UID, Ubicación VT="Buscar" (matching UID).
- **Google Norgenic+NoCont./NoEnviadas** (Gmail): Envía alertas email con discrepancias.

Truncado en schema/columns, pero enfocado en comparaciones mensuales (e.g., 09-2025).

### Conexiones y Flujo Lógico
Flujo secuencial con comparaciones:
```
[Triggers: Manual / Schedule / ExecuteWorkflow] → Wait1 → Wait → [Google Drive Norgenic Enviadas → Edit Fields → Google Drive VT Enviadas → Edit Fields2 → Compare Datasets Norgenic vs Enviadas → [Common: Google Sheets Enviadas | Only1: Gmail NoEnviadas] | Google Drive VT Contabilizadas → Edit Fields1 → Compare Datasets Norgenic vs Contabilidad → [Common: Google Sheets Contabilizadas | Only1: Gmail NoCont.]]
```
- Input: Archivos en carpetas Drive (names).
- Outputs: Updates en Sheets (columna P? inferido Ubicación VT), alertas email.

### Mapeo de Datos
- Campos: name (limpiado, matched fuzzy), UID (name como UID).
- Comparaciones: Por name entre Norgenic y VT carpetas.
- Updates: En HistorialFacturas, matching UID, set Ubicación VT (e.g., "Buscar" para tracking real-time).
- Alertas: Emails con lists discrepancias (e.g., Norgenic+NoCont. para no contabilizadas).

## Contexto para Informe E2E/BPO
En BPO fiscal, este workflow verifica post-Reenvio, actualizando ubicación en HistorialFacturas (columna P para real-time), comparando "Enviadas" Norgenic vs. VT (copiadas/contabilizadas). Asegura cierre mensual, integra con histórico bancario para traceability completa. Eficiencia: Automatiza checks, alertas proactivas. Optimización: Ejecutar mensual; monitorear % discrepancias (>5% → revisar procesos). Enlace E2E: Post-Cebollón/Reenvio, pre-auditoría; útil para compliance, reduciendo latencia en contabilidad. Para LLM/MCP, simular discrepancias o auditar updates.