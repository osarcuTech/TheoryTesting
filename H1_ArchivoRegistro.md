---
title: H1 — Archivo y Registro de Facturas
tags: [H1, archivo, registro, n8n]
component: H1
related: [[01_Arquitectura_General]], [[wf_C1_ReenvioFacturas]], [[H0_ControlHumano]], [[H2_ComprobacionCierre]], [[H1_ArchivoRegistro_Implementacion]]
---

# H1 — Archivo y Registro de Facturas

## 🎯 Objetivo

Ejecutar el archivado físico de facturas validadas por [[H0_ControlHumano|H0]] hacia su ubicación final, registrar en BD_Facturas que están archivadas, e iniciar el proceso de contabilización.

Es el punto de **no retorno** del pipeline: una vez archivada, la factura está cerrada en el ciclo.

---

## 📋 Descripción del Proceso

### Entrada
- **Fuente**: Fila de autorización de H0
  - Movimiento validado ✓ (P=TRUE)
  - Factura asignada: Columna Q o O
  - Estatus: "Listo para archivar"

### Procesamiento
1. **Leer** lista de facturas autorizadas de H0
2. **Localizar** archivo de factura en Google Drive
3. **Archivar** (mover a carpeta definitiva según:
   - Mes: `/FacturasArchivadas/2025-10/`
   - Proveedor: `/FacturasArchivadas/2025-10/TELEFONICA/`
   - Departamento: Opcional, subfolder adicional
4. **Registrar** estado en BD_Facturas:
   - Columna "Estado" = "ARCHIVADO"
   - Columna "FechaArchivo" = hoy
   - Columna "UbicacionFinal" = ruta Drive
5. **Contabilizar** (opcional):
   - Generar asiento contable
   - Enviar a ERP Odoo
6. **Notificar** a departamentos relevantes
7. **Generar** comprobante de archivo

### Salida
- Factura archivada en Drive
- BD_Facturas actualizada
- Comprobante de archivo registrado
- Asiento contable generado (si aplica)
- Listo para [[H2_ComprobacionCierre|H2]]

---

## 🔄 Flujo en n8n

Workflow: [[wf_C1_ReenvioFacturas]]

### Nodos Principales

| Nodo | Tipo | Descripción |
|------|------|-------------|
| **Trigger H0** | n8n Workflow | Inicia cuando H0 marca "Listo para archivar" |
| **Read Validated List** | Google Sheets | Lee filas con P=TRUE |
| **For Each File** | Loop | Procesa cada factura |
| **Locate File** | Drive API | Busca archivo en Drive por UID/nombre |
| **Verify File** | Code | Valida que archivo existe y es accesible |
| **Create Archive Folder** | Drive API | Crea carpeta destino si no existe |
| **Move File** | Drive API | Mueve archivo a carpeta definitiva |
| **Update BD_Facturas** | Sheets API | Actualiza Estado = "ARCHIVADO" |
| **Register Path** | Sheets API | Registra ruta final en UbicacionFinal |
| **Generate Receipt** | PDF Gen | Genera comprobante de archivo |
| **Send to Accounting** | Odoo API | Envía asiento contable (opcional) |
| **Notify Departments** | Email | Notifica a depts. relevantes |
| **Log Audit** | Sheets API | Registra en tabla de auditoría |
| **Execute Workflow H2** | Trigger | Ejecuta H2 ComprobacionCierre |

---

## 📊 Estructura de Datos

### Entrada (desde H0)

```
Hoja: Movimientos_cuenta (filas validadas)
├─ Columna A: Fecha movimiento
├─ Columna C: Movimiento bancario
├─ Columna E: Importe
├─ Columna O/Q: Nombre factura (sugerencia/override)
└─ Nota en R: "Listo para archivar"
```

### Búsqueda de Archivo

```
UID Factura: Proveedor + NumFactura + Importe
Nombre archivo: YYYYMMDD_PROVEEDOR_NUMFACTURA.pdf

Ubicación actual: /FacturasArchivadas/TEMP/ (desde B2)
  └─ 20251001_TELEFONICA_F-2025-001.pdf
```

### Destino Final

```
/FacturasArchivadas/2025-10/TELEFONICA/
  └─ 20251001_TELEFONICA_F-2025-001.pdf

/FacturasArchivadas/2025-10/TELEFONICA/Operaciones/ (opcional, por dept)
  └─ 20251001_TELEFONICA_F-2025-001.pdf
```

### Registro en BD_Facturas

```
Antes del archivo:
| UID | Proveedor | Importe | Estado | FechaArchivo | UbicacionFinal |
| ... | TELEFONICA | 1500.00 | Procesado | | |

Después del archivo:
| UID | Proveedor | Importe | Estado | FechaArchivo | UbicacionFinal |
| ... | TELEFONICA | 1500.00 | ARCHIVADO | 2025-10-02 | /FacturasArchivadas/2025-10/TELEFONICA/... |
```

---

## ⚙️ Configuración

### Carpetas en Google Drive

```
/FacturasArchivadas/
├─ 2025-10/
│  ├─ TELEFONICA/
│  │  └─ 20251001_TELEFONICA_F-2025-001.pdf
│  ├─ AMAZON/
│  │  └─ 20251001_AMAZON_ORDER123456.pdf
│  └─ ...
├─ 2025-11/
│  └─ ...
```

### Permisos de Archivo
- **Solo lectura**: Una vez archivado, cambiar permisos a "Ver solo"
- **Retención**: Mantener mínimo 7 años (requisito fiscal)
- **Backup**: Drive mantiene versiones históricas

### Integración Odoo (si aplica)
```
Campos a enviar:
├─ Fecha factura
├─ Número factura
├─ Proveedor
├─ Importe
├─ Departamento
├─ Cuenta contable
└─ Referencia (UID)
```

---

## 🐛 Desafíos & Consideraciones

### Error 1: Archivo no encontrado
- **Causa**: Nombre cambió, archivo eliminado, movido antes de H1
- **Detección**: H1 intenta localizar y falla
- **Acción**: Reportar a H0, registrar como "Error de ubicación"
- **Resolución**: Búsqueda manual o re-procesamiento

### Error 2: Permisos insuficientes
- **Causa**: Cambios en compartición de Drive
- **Detección**: Falla al mover archivo
- **Acción**: Reintentar con permisos elevados
- **Resolución**: Validar permisos de servicio Account

### Error 3: Duplicado en destino
- **Causa**: Archivo ya existe en carpeta destino
- **Detección**: Drive API rechaza move/copy
- **Acción**: Comparar hash/tamaño, usar original si idéntico
- **Resolución**: Si diferente, renombrar con timestamp

### Error 4: Asiento contable rechazado
- **Causa**: Datos incompletos, cuenta no válida en Odoo
- **Detección**: Odoo API retorna error
- **Acción**: Registrar error, no impedir archivado
- **Resolución**: Corrección manual en Odoo, luego sincronizar

---

## 📊 Métricas & KPIs

Ver: [[Metricas_Archivado]]

| KPI | Target | Actual | Acción |
|-----|--------|--------|--------|
| Tiempo medio archivado | <2 min | ~3 min | Optimizar búsqueda |
| % archivos archivados correctamente | 99%+ | ~95% | Mejorar validación previa |
| % errores de ubicación | <1% | ~2% | Auditar nombres de archivos |
| % asientos contables rechazados | <5% | ~8% | Validar datos en B2 |
| Cumplimiento plazo archivado | 100% | ~85% | Aumentar frecuencia de H1 |

---

## 🔄 Workflow Detallado

```
┌─ H0 autoriza ("Listo para archivar")
│
├─ H1 inicia (trigger)
│
├─ Para cada factura:
│  ├─ Localizar archivo en Drive (por UID)
│  ├─ Validar acceso
│  ├─ Crear carpeta destino (año-mes/proveedor)
│  ├─ Mover archivo a destino
│  ├─ Registrar ruta en BD_Facturas
│  ├─ Generar comprobante
│  ├─ Enviar a Odoo (si aplica)
│  └─ Notificar departamentos
│
├─ Resumen: X archivadas, Y errores
│
└─ Ejecutar H2 (ComprobacionCierre)
```

---

## 💡 Mejoras Futuras

1. **Digitalización completa**
   - Escaneado automático de facturas papel
   - OCR + extracción de datos en archivo

2. **Integración contable avanzada**
   - Validación de cuenta contable en tiempo real
   - Alertas de excepciones (importe >límite, proveedor nuevo)

3. **Cumplimiento normativo**
   - Firma digital automática
   - Certificado de integridad hash
   - Auditoría con timestamp Blockchain (futuro)

---

## 🔗 Notas Relacionadas

- **Entrada**: [[H0_ControlHumano]] (autorización)
- **Salida**: [[H2_ComprobacionCierre]] (verificación)
- **Datos**: [[03_BDs_Principales#BD_Facturas]] (registro)
- **Workflow**: [[wf_C1_ReenvioFacturas]] (detalles técnicos)
- **KPIs**: [[Metricas_Archivado]]
- **Mejoras**: [[Propuestas_Mejora#H1_Digitalización]]

---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐⭐ (Crítico - cierre del ciclo)
