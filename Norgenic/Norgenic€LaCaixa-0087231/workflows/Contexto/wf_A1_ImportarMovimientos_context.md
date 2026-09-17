# Contexto del Workflow: ImportarMovimientos

## Descripción General
Este workflow (ImportarMovimientos.json), nombrado "HistoricoMov.Banc.Norgenic€" en n8n, se activa automáticamente cuando se crea un nuevo archivo de Google Sheets en una carpeta específica de Google Drive (https://drive.google.com/drive/folders/1QL47EotyHLz4xhEssWw_MWIAvqDKcsg1). 

El propósito principal es importar movimientos bancarios descargados en formato Sheets, invertir su orden para que coincida con el histórico existente, compararlos con la base de datos bancaria "Histórico Bancario" almacenada en otro Google Sheet, y agregar los nuevos movimientos no duplicados. 

Finalmente, elimina el archivo original de Drive y (opcionalmente, ya que algunos nodos están deshabilitados) ejecuta subworkflows relacionados con punteo de facturas y asignación de gastos.

### E2E
En el contexto de la carpeta/repositorio, este workflow juega un rol central en la automatización de la conciliación bancaria, integrándose con otros procesos financieros. 

Actúa como punto de entrada para datos bancarios crudos, asegurando que el repositorio mantenga un histórico unificado y deduplicado. Esto facilita flujos downstream como reporting, análisis de gastos y reconciliación con facturas, promoviendo una orquestación E2E/BPO eficiente. 
Su integración con Google Drive y Sheets lo hace ideal para repositorios enfocados en automatización cloud-based, donde se pueden enlazar con workflows como "PuntearFacturas" (ID: zzvYSx0zfhl1rHWA) y "AsignaciónDeGastos" (ID: nQyAge8xl3tEL2Mg) para una cadena completa de gestión financiera.

## Análisis Detallado del Flujo de Trabajo
### Nodos Principales y Funciones
- **Google Drive Trigger**: Trigger que se activa cada minuto al detectar un nuevo archivo de tipo Google Sheets en la carpeta especificada. Proporciona el ID del archivo nuevo.
- **Google Drive1**: Descarga el archivo recién creado usando su ID.
- **Google Sheets Importado**: Lee los datos del Sheet importado, comenzando desde la fila 4 (asumiendo headers en fila 3). Extrae campos como Fecha, Fecha valor, Movimiento, Más datos, Importe, Saldo.
- **Code**: Invierte el orden de los items (filas) del Sheet importado usando JavaScript (`items.reverse()`), para alinear con el orden cronológico del histórico.
- **Campos Historico**: Genera un UID único concatenando Movimiento + Más datos + Importe + Saldo. Asigna tipos a los campos (string para fechas y textos, number para Importe y Saldo).
- **Google Sheets Historico1**: Lee el Sheet histórico existente (ID: 1sZeGfiuG7Ab9jx14_-oaQZTtrhIohlx5dhYoSgZCOuw, Sheet ID: 1089991841).
- **Campos Historico1**: Similar a "Campos Historico", genera UID para los datos históricos.
- **Compare Datasets**: Compara los datasets importados y históricos usando UID (fuzzy compare activado). Prefiere input1 (importados) y resuelve conflictos. Output: Solo items no duplicados del importado.
- **Edit FieldsImportados**: Limpia y asigna tipos finales a los campos de los nuevos items.
- **Google Sheets Historico**: Appendea los nuevos movimientos al Sheet histórico.
- **Google Drive**: Elimina el archivo original de Drive para limpieza.
- **Execute Workflow PuntearFacturas** y **Execute Workflow AsignaciónDeGastos**: Nodos deshabilitados que ejecutan subworkflows para punteo de facturas y asignación de gastos (IDs: zzvYSx0zfhl1rHWA y nQyAge8xl3tEL2Mg). No se ejecutan actualmente.

Hay nodos deshabilitados para testing manual (e.g., Manual Trigger, Google Sheets Historico2/3, Code1), que simulan el flujo para depuración.

### Conexiones y Flujo Lógico
El flujo es lineal con bifurcaciones mínimas:
```
Google Drive Trigger → Google Drive1 → [Google Sheets Importado → Code → Campos Historico → Compare Datasets → Edit FieldsImportados → Google Sheets Historico → (Execute Workflow PuntearFacturas / AsignaciónDeGastos)]
                              └→ Google Sheets Historico1 → Campos Historico1 → Compare Datasets (input 1)
                              └→ Google Drive (delete)
```
- Input principal: Metadatos del archivo nuevo (ID, name).
- Outputs intermedios: Arrays de objetos con campos bancarios (e.g., {Fecha: "2025-10-01", Importe: 100.50, ...}).
- UID como clave de deduplicación asegura integridad de datos.

### Mapeo de Datos
- Campos procesados: Fecha (string), Fecha valor (string), Movimiento (string), Más datos (string), Importe (number), Saldo (number).
- UID: Concatenación string de Movimiento + Más datos + Importe + Saldo (potencial issue si hay variaciones en formato, e.g., decimales).
- Automap en append: Usa autoMapInputData para coincidir columnas en el Sheet histórico.

## Contexto para Informe E2E/BPO y Rol en el Repositorio
En un contexto de Business Process Orchestration (BPO), este workflow orquesta la integración de datos bancarios de forma end-to-end:
- **Eficiencia**: Automatiza la importación, comparación y almacenamiento, reduciendo tiempo manual de conciliación bancaria. En tu repositorio, sirve como "ingestor" de datos, alimentando workflows dependientes para análisis o reporting.
- **Integraciones**: Depende de APIs de Google Drive y Sheets (credenciales OAuth2). En el repositorio, se enlaza con subworkflows para extender la cadena: e.g., después de importar, activa punteo de facturas para reconciliar con registros contables, o asignación de gastos para categorizar transacciones.
- **Gestión de Errores**: Retry en subworkflow de punteo (deshabilitado). Posibles fallos: Errores en descarga/lectura si archivo malformado; duplicados no detectados si UID colisiona. Sugerencia para repositorio: Agregar nodos de error handling (e.g., IF para chequear items count) y logging via webhook para monitoreo centralizado.
- **Escalabilidad y Optimización**: Para BPO en el repositorio, agregar triggers webhook en lugar de polling para eficiencia. Monitoreo: Usar n8n's execution logs para auditar importaciones. Integración con sistemas ERP podría extenderse via subworkflows, haciendo este workflow un hub para flujos financieros.
- **Seguridad**: Credenciales específicas de usuario (Oscar); recomendar rotación y scopes limitados en el repositorio.
- **Métricas para Informe**: Tasa de duplicados detectados, tiempo de procesamiento por batch, volumen de movimientos importados. Útil para dashboards de compliance financiero en el contexto del repositorio.
- **Papel en el Repositorio**: Como parte de una carpeta de workflows n8n, este actúa como upstream para procesos downstream. Por ejemplo, los datos importados pueden ser consumidos por queries en otros workflows para generar informes mensuales o alertas de saldo. Facilita la modularidad: actualiza el histórico central sin intervención manual, asegurando consistencia across el repositorio. Tag: "Conciliación Bancaria" indica su categoría, útil para búsqueda y organización.

Este contexto permite a un LLM/MCP razonar sobre optimizaciones, depuración o extensión del workflow en escenarios BPO dentro de tu repositorio, promoviendo una visión holística de la automatización financiera.