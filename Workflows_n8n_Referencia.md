---
title: Workflows n8n — Referencia Rápida
tags: [n8n, workflow, automatización]
related: [[00_MOC_Norgenic_Financiera]], [[01_Arquitectura_General]]
---

# Workflows n8n — Referencia Rápida

## 📌 Tabla de Workflows

| ID | Nombre | Component | Trigger | Estado | Descripción |
|-----|--------|-----------|---------|--------|-------------|
| [[wf_A1_ImportarMovimientos|A1]] | ImportarMovimientos | [[A1_ImportarMovimientos]] | Gmail cada 5 min | ✅ Activo | Importa movimientos bancarios, deduplica por UID |
| [[wf_A2_AsignacionDeGastos|A2]] | AsignacionDeGastos | [[A2_AsignacionDeGastos]] | Cambio en BD_Banco | ✅ Activo | Clasifica movimientos por Depto/Naturaleza |
| [[wf_B1_GmailMetralleta|B1]] | GmailMetralleta | [[B1_RecepcionFacturas]] | Correo nuevo | ✅ Activo | Descarga facturas desde Gmail |
| [[wf_B2_Cebollon|B2]] | Cebollón | [[B2_Cebollón]] | Archivo en Drive | ✅ Activo | Procesa facturas: OCR, normaliza, registra |
| [[wf_C0_PuntearFacturas|C0]] | PuntearFacturas | [[C0_PunteoFacturas]] | Soft-trigger (C0) | ✅ Activo | Ejecuta fórmula de matching (si aplica) |
| [[wf_C1_ReenvioFacturas|C1]] | ReenvioFacturas | [[H1_ArchivoRegistro]] | H0 autoriza | ✅ Activo | Archiva facturas validadas en Drive |
| [[wf_C2_ComprobacionFacturas|C2]] | ComprobacionFacturas | [[H2_ComprobacionCierre]] | Fin de mes | ✅ Activo | Verifica cierre y genera reporte |

---

## 🔍 Detalle por Workflow

### [[wf_A1_ImportarMovimientos|A1 — Importar Movimientos Bancarios]]

**Propósito**: Cargar movimientos del banco a BD_Banco

**Trigger**: 
- Google Drive: Detecta nuevo Sheets en carpeta cada minuto
- Alternativa: Trigger manual desde n8n

**Pasos Principales**:
1. Descarga archivo desde Drive
2. Lee datos (fila 4+)
3. Invierte orden (reverse)
4. Genera UID: `Mov|MasDatos|Importe|Saldo`
5. Compara con BD_Banco (fuzzy)
6. Append solo nuevos
7. Elimina archivo original

**Salida**: BD_Banco actualizada

**Errores Comunes**:
- Archivo no encontrado: Verificar ID carpeta
- Duplicados no detectados: Revisar lógica de UID
- Conexión Google rechazada: Renovar credenciales

---

### [[wf_A2_AsignacionDeGastos|A2 — Clasificación de Gastos]]

**Propósito**: Clasificar movimientos (Depto/Naturaleza/Categoría)

**Trigger**: Cambio en BD_Banco o ejecución desde A1

**Pasos Principales**:
1. Lee últimos movimientos de BD_Banco
2. Busca regla en tabla AsigCostes
3. Asigna Depto/Naturaleza/Categoría
4. Actualiza Movimientos_cuenta columnas I-M

**Salida**: Columnas I-M completadas

**Tips**:
- Si >20% "sin clasificación", revisar AsigCostes
- Escalations a H0 si no hay regla

---

### [[wf_B1_GmailMetralleta|B1 — Recepción de Facturas (Gmail)]]

**Propósito**: Descargar facturas de correo compartido

**Trigger**: Nuevo correo sin etiqueta "Procesado"

**Pasos Principales**:
1. Lee correos no procesados
2. Descarga adjuntos
3. Guarda en Google Drive (carpeta temporal)
4. Extrae metadatos (De, Asunto, Fecha)
5. Marca correo como procesado

**Salida**: Facturas en Drive, correos archivados

**Troubleshooting**:
- Correos no detectados: Verificar etiquetas/carpeta
- Adjuntos no descargan: Revisar permisos de aplicación

---

### [[wf_B2_Cebollon|B2 — Procesamiento de Facturas]]

**Propósito**: OCR, nombra, registra en BD_Facturas

**Trigger**: Archivo nuevo en carpeta Drive (desde B1)

**Pasos Principales**:
1. Lee archivo PDF/Imagen
2. OCR con Google Docs API
3. Extrae: Proveedor, Importe, Fecha, NumFactura
4. Normaliza nombre: `YYYYMMDD_PROVEEDOR_NUMFAC.pdf`
5. Genera UID
6. Registra en BD_Facturas
7. Mueve a carpeta destino

**Salida**: BD_Facturas actualizada, archivo renombrado

**Issues Frecuentes**:
- OCR falla en imágenes de baja calidad: Marcar para revisión manual
- Extracción de importe incorrecto: Revisar regex
- Duplicado de UID: Comparar con BD_Facturas antes de append

---

### [[wf_C0_PuntearFacturas|C0 — Punteo (Matching)]]

**Propósito**: Ejecutar fórmula de matching C0

**Trigger**: 
- Manual desde n8n
- Soft-trigger automático desde cambios en Movimientos_cuenta/HistorialFacturas

**Pasos Principales**:
1. Lee Movimientos_cuenta y HistorialFacturas
2. Ejecuta fórmula LET de matching (ver [[Formulas_Google_Sheets]])
3. Actualiza columna O (Sugerencia)
4. Notifica a H0 si hay nuevas sugerencias

**Salida**: Columna O actualizada en Movimientos_cuenta

**Performance**:
- Típicamente 30-60 segundos
- Si >2 min: Revisar volumen de datos

---

### [[wf_C1_ReenvioFacturas|C1 — Archivo y Registro]]

**Propósito**: Archivar facturas validadas, registrar en BD

**Trigger**: H0 autoriza ("Listo para archivar")

**Pasos Principales**:
1. Lee lista de facturas autorizadas de H0
2. Localiza archivo en Drive (por UID)
3. Mueve a `/FacturasArchivadas/YYYYMM/PROVEEDOR/`
4. Registra ruta en BD_Facturas
5. Genera comprobante
6. Envía asiento a Odoo (si configurado)

**Salida**: 
- Facturas archivadas en Drive
- BD_Facturas actualizada (Estado=ARCHIVADO, UbicacionFinal=ruta)
- Asiento contable en Odoo

**Alertas**:
- Archivo no encontrado: Búsqueda fallida
- Permiso denegado: Revisar permisos de Drive
- Asiento rechazado: Validar datos en Odoo

---

### [[wf_C2_ComprobacionFacturas|C2 — Comprobación y Cierre]]

**Propósito**: Verificar completitud del mes, generar reporte

**Trigger**: Fin de mes (manual o automático)

**Pasos Principales**:
1. Lee datos del mes en BD_Banco y BD_Facturas
2. Valida:
   - % movimientos con factura (target >95%)
   - % facturas archivadas (target 100%)
   - Duplicados detectados
   - Inconsistencias de importe
3. Genera reporte de cierre mensual
4. Lista incidencias pendientes
5. Calcula KPIs mensuales
6. Envía reporte a Finance Manager

**Salida**: Reporte PDF + decisión de cierre

**Condiciones de Cierre**:
- ✅ >95% de movimientos con factura
- ✅ 100% de facturas archivadas (o con nota)
- ✅ Sin duplicados detectados
- ✅ <5 incidencias críticas pendientes

---

## 🔗 Fórmulas de Trigger

### Soft-Trigger (Actualización en Cascada)

```javascript
// Cuando cambia BD_Banco:
BD_Banco → Movimientos_cuenta (Query) 
         → A2 (Recalcula clasificación)
         → C0 (Recalcula matching)

// Cuando cambia BD_Facturas:
BD_Facturas → HistorialFacturas (Query)
            → C0 (Recalcula matching)
```

### Webhooks en n8n

Algunos workflows pueden activarse por webhook:
- URL: `https://n8n.instance.com/webhook/workflow-name`
- Uso: Llamadas desde scripts externos o apps

---

## 📊 Tabla de Cambios y Responsables

| Workflow | Quién modifica | Con qué frecuencia | Cambios típicos |
|----------|----------------|-------------------|-----------------|
| A1 | Devops | Trimestral | Actualizar carpeta Drive, permisos |
| A2 | Finance Ops | Semanal | Agregar reglas a AsigCostes |
| B1 | Devops | Mensual | Agregar nuevos remitentes a whitelist |
| B2 | Devops | Semanal | Ajustar regex de OCR |
| C0 | Devops | Trimestral | Actualizar PerfilProveedores |
| C1 | Devops | Mensual | Cambios en estructura de carpetas |
| C2 | Devops | Mensual | Actualizar template de reporte |

---

## 🔗 Notas Relacionadas

- [[01_Arquitectura_General]] - Flujo integrado
- [[A1_ImportarMovimientos]] a [[H2_ComprobacionCierre]] - Detalle de cada componente
- [n8n Documentación](https://docs.n8n.io/) - Referencia oficial

---

**Última actualización**: 2026-09-10
**Próxima revisión**: 2026-10-10
