# Contexto del Workflow: Asignación de Gastos

## Descripción General
Este workflow de n8n (Asignacion_de_Gastos.json) se ejecuta después del workflow "ImportarMovimientos" (que importa y actualiza movimientos bancarios en un Google Sheet histórico). Su función principal es clasificar cada movimiento bancario en categorías específicas para preparar los datos para generar un cashflow mediante una tabla dinámica. Además, identifica y diferencia los movimientos relacionados con proveedores, ya que estos son relevantes para procesos de facturación subsiguientes. 

El flujo lee los movimientos del Sheet histórico (filtrando por "Filtro existente n8n" = 1 para procesar solo los nuevos o pendientes), los clasifica en ingresos/gastos, subcategorías (e.g., bancos específicos como Addon, SolidGate, PayPal; gobiernos/impuestos; devoluciones; proveedores), asigna etiquetas como "CF in/out" (e.g., In_CFO para ingresos operativos, Out_CFO para gastos operativos) y "CF category" (e.g., Ventas, Bancos, Impuestos, Proveedores), y actualiza el Sheet con estas clasificaciones. Incluye notificaciones por email para revisión y triggers para ejecución manual o automática (via polling en Sheet o llamada desde otro workflow).

En un contexto E2E/BPO, este workflow automatiza la categorización financiera, facilitando el análisis de cashflow y la reconciliación con facturación. Mejora la precisión en reportes financieros, reduce intervención manual y soporta escalabilidad en procesos de negocio como contabilidad, auditoría y planificación fiscal.

## Análisis Detallado del Flujo de Trabajo
### Nodos Principales y Funciones
- **Google Sheets Trigger**: Polling cada minuto para detectar actualizaciones en filas del Sheet histórico (ID: 1sZeGfiuG7Ab9jx14_-oaQZTtrhIohlx5dhYoSgZCOuw, Sheet: 1963712436).
- **Manual Trigger** y **Execute Workflow Trigger**: Para pruebas manuales o llamadas desde workflows externos (e.g., ImportarMovimientos).
- **Wait**: Pausa el flujo (resume: wait), posiblemente para sincronización.
- **IDs**: Set que define variables como SpreadSheet ID y SheetBDHistoricoBanco.
- **Google Sheets**: Lee movimientos filtrando por "CF in/out" vacío y "Filtro existente n8n" = 1 (nuevos movimientos pendientes de clasificación).
- **If** y **Filter Not Update**: Filtra items donde "CF in/out" está vacío para procesar solo no clasificados.
- **Switch**: Clasifica en Ingresos (Importe > 0) o Gastos (Importe < 0).
- **Bancos?**: Para ingresos, clasifica por bancos/procesadores (Addon, SolidGate, PayPal, LaCaixa) usando regex en Movimiento o Más datos; fallback a extra para otros.
- **Gobierno o Devos**: Para ingresos no bancarios, clasifica en Hacienda, IVA, DevolucionesCompras.
- **Bancos? CFFO**: Similar para gastos, clasifica bancos/procesadores.
- **CFOO**: Para gastos no bancarios, clasifica en Compras, Compras2, Impuestos, Nominas, Publicidad; fallback a Revisar.
- **Switch Devoluciones**: Para gastos bancarios, identifica Devoluciones (Importe < 0).
- **Merge** nodos (e.g., Merge CFFI_Bancos, Merge CFFO_Bancos, Merge CFOO_Facturación): Combinan outputs de switches para consolidar categorías.
- **Set** nodos (e.g., CFO_Ventas, CFFI Bancos, CFO Proveedores): Asignan "CF_In_Out" (e.g., In_CFO, Out_CFF) y "CF_Category" (e.g., Ventas, Proveedores) basados en clasificación; incluyen row_number para matching.
- **Google Sheets CFFI CBancario2**: Actualiza el Sheet con las nuevas columnas "CF in/out" y "CF category" usando row_number como clave.
- **Gmail CashFlow In/Out Review**: Envía emails de notificación para revisión de cashflow (uno deshabilitado).

El JSON está truncado en pollTimes y columns schema, pero el flujo es completo para clasificación.

### Conexiones y Flujo Lógico
El flujo es ramificado basado en switches, con merges para reconverger:
```
[Triggers: Google Sheets Trigger / Manual / Execute Workflow] → Wait → IDs → Google Sheets → If (CF in/out empty?) → Filter Not Update → Switch (Ingresos/Gastos)
  ├─ Ingresos → Bancos? → [Addon/SolidGate/PayPal/LaCaixa → Merge CFFI_Bancos → CFFI Bancos | extra → Gobierno o Devos → [Hacienda/IVA → Merge CFFI_Impuestos → CFF Impuestos | DevolucionesCompras → CFO Devos Compras | extra → Gmail CashFlow In Review]]
  └─ Gastos → Bancos? CFFO → [Addon/SolidGate/PayPal/LaCaixa/Bancos? → Merge CFFO_Bancos → Switch Devoluciones → [Devoluciones → CFO Devos | extra → CFF Bancos] | extra → CFOO → [Compras/Compras2 → Merge CFOO_Facturación → CFO Proveedores | Impuestos → CFO Impuestos | Nominas → CFO Salarios | Publicidad → CFO Publicidad | extra → Gmail CashFlow Out Review (disabled) / Revisar]]
Todos los Sets → Google Sheets CFFI CBancario2 (update)
```
- Input: Movimientos con campos como Fecha, Movimiento, Más datos, Importe, row_number.
- Outputs: Items clasificados con CF_In_Out y CF_Category; actualizaciones en Sheet.

### Mapeo de Datos
- Campos leídos: Fecha, Fecha valor, Movimiento, Más datos, Importe, Saldo, NombreFactura, CF in/out, Filtro existente n8n, row_number.
- Clasificación via regex/matches en Movimiento y Más datos (e.g., "WEB" para Addon, nombres específicos para proveedores como "ABAC ASSES.S.L." para Compras).
- Campos agregados/actualizados: CF_In_Out (e.g., In_CFO para ventas operativas, Out_CFF para financieros), CF_Category (e.g., Ventas, Proveedores, Impuestos).
- Matching: Usa row_number para updates precisos en el Sheet.
- Posibles issues: Regex sensibles a variaciones en texto; fallbacks a "Revisar" para no clasificados.

## Contexto para Informe E2E/BPO
En un flujo E2E/BPO, este workflow orquesta la categorización post-importación para cashflow y facturación:
- **Eficiencia**: Clasificación automática basada en reglas reduce errores manuales; polling asegura procesamiento near-real-time de actualizaciones.
- **Integraciones**: Dependiente de Google Sheets/Gmail APIs; se integra con ImportarMovimientos via executeWorkflow.
- **Gestión de Errores**: Fallbacks a "Revisar" y emails para intervención humana; sugerencia: Agregar nodos para logging o alertas en altos volúmenes de "Revisar".
- **Escalabilidad y Optimización**: Ideal para BPO financiero; optimizar regex para cobertura; agregar ML para clasificación dinámica si crecen proveedores. Monitoreo: Trackear % de movimientos clasificados automáticamente. Para facturación, "Proveedores" puede trigger subworkflows de matching con invoices.
- **Seguridad**: Credenciales OAuth; limitar scopes. Métricas: Tiempo de clasificación por movimiento, tasa de revisión manual, precisión vs. cashflow histórico.
Este contexto ayuda a un LLM/MCP a analizar, optimizar o extender el workflow para informes de orquestación de procesos financieros.