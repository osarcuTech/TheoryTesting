---
title: B1 — Recepción de Facturas
tags: [B1, facturas, correo, n8n]
component: B1
related: [[01_Arquitectura_General]], [[wf_B1_GmailMetralleta]], [[B2_Cebollón]], [[C0_PunteoFacturas]]
---

# B1 — Recepción de Facturas

## 🎯 Objetivo

Monitorear una cuenta de correo compartida (Gmail), extraer facturas adjuntas automáticamente y preparar la base de datos para procesamiento en [[B2_Cebollón|B2]].

---

## 📋 Descripción del Proceso

### Entrada
- **Fuente**: Correo compartido norgenic@empresa.com
- **Contenido**: Facturas PDF, Excel, o imágenes adjuntas
- **Trigger**: Nuevo correo sin procesar
- **Metadatos extraídos**: De, Asunto, Fecha, Adjuntos

### Procesamiento
1. **Lectura** de correos no procesados en Gmail
2. **Filtrado** por asunto/remitente (opcionales)
3. **Descarga** de adjuntos a carpeta temporal en Google Drive
4. **Extracción** de metadatos:
   - Proveedor (desde remitente)
   - Fecha de recepción
   - Cantidad de adjuntos
5. **Registro inicial** en tabla temporal o BD_Facturas
6. **Marcado** de correo como procesado (etiqueta)

### Salida
- Facturas almacenadas en Google Drive (carpeta por mes)
- Metadatos registrados en BD_Facturas
- Correo etiquetado "procesado" o archivado
- Trigger automático de [[B2_Cebollón|B2]]

---

## 🔄 Flujo en n8n

Workflow: [[wf_B1_GmailMetralleta]]

### Nodos Principales

| Nodo | Tipo | Descripción |
|------|------|-------------|
| **Gmail Trigger** | Trigger | Detecta correos no leídos en carpeta Facturas |
| **Gmail** | API | Lee metadatos y contenido del correo |
| **Extract Attachments** | Code | Extrae nombres y IDs de adjuntos |
| **Google Drive** | API | Descarga adjuntos a carpeta temporal |
| **Parse Metadata** | Code | Extrae proveedor, fecha, importe (si está visible) |
| **Google Sheets** | API | Registra en tabla temporal o BD_Facturas |
| **Gmail Attachment** | API | Descarga cada adjunto |
| **Google Drive Upload** | API | Guarda en carpeta destino (Drive) |
| **Mark as Processed** | Gmail | Etiqueta correo como procesado |
| **Execute Workflow B2** | Trigger | Ejecuta B2 Cebollón (opcional) |

---

## 📊 Estructura de Datos

### Gmail Input
```
De: proveedor@example.com
Asunto: "Factura F-2025-001 - Servicios Octubre"
Fecha: 2025-10-01
Adjuntos: 
  - Factura_F-2025-001.pdf
  - Remesa.xlsx (opcional)
```

### Extracción de Metadatos
```
Proveedor: proveedor@example.com (o normalizado a "ProveedorXYZ")
Fecha Recepción: 2025-10-01
Número Adjuntos: 1
Nombre Archivo: "Factura_F-2025-001.pdf"
Tamaño: 245 KB
Formato: PDF
```

### Destino en Google Drive
```
/FacturasNorgenic/2025-10/
  ├── proveedor1_2025-10-01_F-001.pdf
  ├── proveedor2_2025-10-01_F-002.pdf
  └── ...
```

---

## ⚙️ Configuración Gmail

### Cuenta Monitorizada
- **Email**: norgenic@empresa.com
- **Carpeta**: "Facturas" (label en Gmail)
- **Trigger**: Cada 5 minutos
- **Filtro**: No leídos/sin etiqueta de procesado

### Metadata Extraction
- **Proveedor**: Extraído de "De"
- **Fecha**: Campo "Date" del correo
- **Referencia**: Asunto o línea de asunto
- **Importe**: Búsqueda en body (opcional, puede ser manual)

### Post-Procesamiento
- **Marca**: Etiqueta "Procesado-B1"
- **Archivo**: Opcional (mover a Procesados)
- **Notificación**: Opcional a [[H0_ControlHumano|H0]]

---

## 🐛 Desafíos & Consideraciones

### Variabilidad de Formatos
- **Problema**: Facturas en PDF, Excel, JPG, imágenes escaneadas
- **Impacto**: OCR manual podría requerirse para algunos
- **Solución**: [[B2_Cebollón|B2]] maneja esto con validación manual

### Extracción de Importe
- **Problema**: No siempre está disponible en metadatos
- **Actual**: Se extrae en [[B2_Cebollón|B2]] manualmente o por OCR
- **Futuro**: Integración de Google Document AI para OCR automático

### Errores de Descarga
- **Riesgo**: Archivos corruptos o conexión perdida
- **Solución**: Reintentos exponenciales en n8n

### Privacidad
- **Cuidado**: Facturas contienen datos sensibles (IBAN, DNI, etc.)
- **Política**: Acceso limitado a usuarios autorizados, auditoría de accesos

---

## 📊 Métricas & KPIs

Ver: [[Metricas_Facturas]]

- **Tasa de procesamiento sin intervención**: % correos descargados exitosamente
- **Tiempo medio de procesamiento**: Segundos desde recepción a guardado en Drive
- **Tasa de fallos de descarga**: % adjuntos no descargados
- **Cobertura de extracción de metadatos**: % campos obtenidos vs esperados

---

## 🔗 Notas Relacionadas

- **Siguiente**: [[B2_Cebollón]] (nombrado y registro)
- **Matching**: [[C0_PunteoFacturas]] (emparejamiento con movimientos)
- **Revisión**: [[H0_ControlHumano]] (control manual)
- **Workflow**: [[wf_B1_GmailMetralleta]] (detalles técnicos)
- **Mejoras**: [[Propuestas_Mejora#B1_OCR_Automático]]

---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐⭐ (Crítico - punto de entrada)
