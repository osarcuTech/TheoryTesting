---
title: B2 — Cebollón (Procesamiento de Facturas)
tags: [B2, facturas, procesamiento, n8n]
component: B2
related: [[01_Arquitectura_General]], [[wf_B2_Cebollon]], [[B1_RecepcionFacturas]], [[C0_PunteoFacturas]]
---

# B2 — Cebollón (Procesamiento de Facturas)

## 🎯 Objetivo

Procesar facturas descargadas por [[B1_RecepcionFacturas|B1]]: normalizar nombres, extraer metadatos clave (proveedor, importe, fecha), registrar en **BD_Facturas** y pre-archivar en estructura apropiada.

---

## 📋 Descripción del Proceso

### Entrada
- **Fuente**: Facturas en Google Drive descargadas por B1
- **Formato**: PDF, Excel, Imágenes
- **Metadatos iniciales**: Proveedor, fecha recepción, nombre archivo

### Procesamiento
1. **Lectura** de facturas nuevas en carpeta Drive
2. **OCR/Extracción** de datos (si es PDF/imagen):
   - Número de factura
   - Proveedor
   - Importe
   - Fecha de factura
   - Descripción/concepto
3. **Normalización** de nombre de archivo:
   - Formato: `YYYYMMDD_Proveedor_NumFactura.pdf`
   - Ejemplo: `20251001_TELEFONICA_F-2025-001.pdf`
4. **Generación de UID** único
5. **Validación** de completitud de datos
6. **Registro** en BD_Facturas
7. **Almacenamiento** en carpeta estructurada:
   - `/FacturasArchivadas/2025-10/Proveedor/`

### Salida
- Facturas renombradas y organizadas en Drive
- Metadatos completos en BD_Facturas
- UIDs para matching con movimientos
- Listo para [[C0_PunteoFacturas|C0]]
- Trigger automático de C0

---

## 🔄 Flujo en n8n

Workflow: [[wf_B2_Cebollon]]

### Nodos Principales

| Nodo | Tipo | Descripción |
|------|------|-------------|
| **Drive Trigger** | Trigger | Detecta facturas nuevas en carpeta entrada |
| **Google Drive** | API | Lee metadatos del archivo |
| **Download File** | Code | Descarga para procesamiento local |
| **Extract Metadata** | Code/AI | OCR y extracción de datos (Google Docs API) |
| **Parse & Normalize** | Code | Extrae y valida: Proveedor, Importe, Fecha, Num Factura |
| **Generate UID** | Code | Crea UID: Proveedor + NumFactura + Importe |
| **Validate Data** | Conditional | ¿Datos completos? SI → continuar, NO → reportar |
| **Google Sheets B2** | API | Registra en BD_Facturas |
| **Rename & Move** | Drive API | Renombra a `YYYYMMDD_Proveedor_NumFactura.pdf` y mueve |
| **Execute Workflow C0** | Trigger | Ejecuta C0 Punteo |
| **Mark Processed** | Code | Registra timestamp de procesamiento |

---

## 📊 Estructura de Datos

### Entrada (desde B1)
```
Archivo: "Factura_F-2025-001.pdf"
Ubicación Drive: /FacturasNorgenic/2025-10/
Metadata: 
  Proveedor: proveedor@example.com
  Fecha Recepción: 2025-10-01
  Tamaño: 245 KB
```

### Extracción de Datos (por OCR)
```
Número Factura: "F-2025-001"
Proveedor: "TELEFONICA"
Importe: 1500.00 EUR
Fecha Factura: "2025-10-01"
Descripción: "Servicios telefónicos octubre"
IBAN (opcional): "ES91..."
Concepto: "Teléfono - Línea Principal"
```

### Registro en BD_Facturas
```
Columna A: Fecha Recepción (2025-10-01)
Columna B: Fecha Factura (2025-10-01)
Columna C: Proveedor (TELEFONICA)
Columna D: Número Factura (F-2025-001)
Columna E: Importe (1500.00)
Columna F: Moneda (EUR)
Columna G: UID (TELEFONICA|F-2025-001|1500.00)
Columna H: Estado (Procesado)
Columna I: Descripción (Servicios telefónicos octubre)
```

### Salida (Almacenamiento)
```
/FacturasArchivadas/2025-10/TELEFONICA/
  └── 20251001_TELEFONICA_F-2025-001.pdf
```

---

## 🔧 Lógica de Extracción

### Método 1: Google Docs API (PDF→Google Docs→Extracción)
```
1. Convertir PDF a Google Docs
2. Usar DocumentAI o OCR built-in
3. Parsear texto plano para patrones
4. Extraer campos con regex
```

### Método 2: Regex Patterns
```
Número Factura: /Factura[:\s]*([A-Z0-9-]+)/i
Importe: /Total[:\s]*([€$]?[\d.,]+)/i
Fecha: /Fecha[:\s]*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i
IBAN: /IBAN[:\s]*([A-Z]{2}[0-9]{2}[A-Z0-9]{1,30})/
```

### Normalización
```javascript
proveedor = proveedor.toUpperCase().trim()
  .replace(/[®™©]/g, '')
  .replace(/\s+/g, ' ');
  
importe = parseFloat(
  importe.replace(/[^\d.,]/g, '')
    .replace(',', '.')
);

fecha = fecha.split(/[-/]/).reverse().join('-');  // DD/MM/YYYY → YYYY-MM-DD
```

---

## ⚙️ Configuración

### Carpetas en Google Drive
- **Entrada**: `/FacturasNorgenic/2025-10/` (desde B1)
- **Salida**: `/FacturasArchivadas/2025-10/{Proveedor}/`
- **Errores**: `/FacturasErrores/2025-10/` (si OCR falla)

### Validación de Datos
Campos **requeridos**:
- Proveedor
- Importe
- Fecha Factura

Campos **opcionales**:
- Número de Factura
- IBAN / Referencia de pago
- Descripción

### Formato de Nombre
- Patrón: `YYYYMMDD_PROVEEDOR_NUMFACTURA.pdf`
- Reemplazo de caracteres especiales: ` ` → `_`, `/` → `-`
- Ejemplo: `20251001_TELEFONICA_F-2025-001.pdf`

---

## 🐛 Desafíos & Consideraciones

### OCR Imperfecto
- **Problema**: Facturas escaneadas, imágenes de baja calidad
- **Actual**: Requiere validación manual en [[H0_ControlHumano|H0]]
- **Futuro**: Integración con Google Document AI (ver [[Propuestas_Mejora#Document_AI]])

### Variabilidad de Formatos
- **Problema**: Cada proveedor tiene formato diferente
- **Solución**: Machine Learning o reglas específicas por proveedor
- **Alternativa**: Plantillas para proveedores frecuentes

### UID Duplicada
- **Problema**: Si se recibe factura duplicada = mismo UID
- **Actual**: Detectado por [[C0_PunteoFacturas|C0]]
- **Mejora**: Flag de duplicada en BD_Facturas

### Errores Silenciosos
- **Riesgo**: OCR extrae datos parciales sin alerta
- **Solución**: Validar completitud, registrar confianza de extracción
- **Threshold**: Si confianza < 80%, marcar para revisión manual

---

## 📊 Métricas & KPIs

Ver: [[Metricas_Facturas]]

- **Tasa de facturas procesadas correctamente**: % sin intervención manual
- **Tasa de metadatos incompletos**: % facturas sin proveedor/importe/fecha
- **Tiempo medio de procesamiento**: Segundos por factura
- **Tasa de OCR confiable**: % confianza de extracción >80%
- **Tasa de duplicados detectados**: % UIDs duplicadas

---

## 🔗 Notas Relacionadas

- **Anterior**: [[B1_RecepcionFacturas]] (recepción)
- **Siguiente**: [[C0_PunteoFacturas]] (matching)
- **Control**: [[H0_ControlHumano]] (validación)
- **Workflow**: [[wf_B2_Cebollon]] (detalles técnicos)
- **Mejoras**: [[Propuestas_Mejora#B2_OCR_ML]]
- **Fórmulas**: [[Formulas_Google_Sheets#UID_Factura]]

---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐⭐ (Crítico)
