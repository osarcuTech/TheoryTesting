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
- **Fuente**: Facturas en Google Drive descargadas por B1 o por carpeta de drive https://drive.google.com/drive/u/0/folders/1TWAWtb7FC52wXBHsJdB5YHOw4w70rZmu
- **Formato**: PDF.

### Procesamiento
1. **Lectura** de facturas nuevas en carpeta Drive
2. **Extracción** de datos:
   - Fecha de factura
   - Proveedor
   - Importe
   - Divisa
   - Número de factura
   - Descripción/concepto
3. **Normalización** de nombre de archivo:
   - Formato: `YYYY/MM/DD_Proveedor_Importe_Divisa_NumFactura.pdf`
   - Ejemplo: `31/08/2026_Google_278,58_€_5664396173_Norgenic.pdf`
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
| **Extract Metadata** | Code/AI | OCR y extracción de datos (Google Docs API) |    <--ERRONEO
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
Ubicación Drive: https://drive.google.com/drive/u/0/folders/1TWAWtb7FC52wXBHsJdB5YHOw4w70rZmu
```

### Extracción de Datos
```
Número Factura: "F-2025-001"
Fecha Factura: "2025-10-01"
Proveedor: "TELEFONICA"
Importe: 1500.00 EUR  <--INCOMPLETO
```

### Registro en BD_Facturas
```
Columna A: UID factura (nombre pdf)
```

### Salida (Almacenamiento)
```
https://drive.google.com/drive/u/0/folders/1XQ-zoNbAz910MdC_zrb5hjUc-zl8UtuX
  └── 31/08/2026_Google_278,58_€_5664396173_Norgenic.pdf
```

---

## 🔧 Lógica de Extracción

### Método 1: Google Docs API (PDF→Google Docs→Extracción)
```
1. Convertir PDF a Google Docs
2. Parsear texto plano para patrones
3. Extraer campos con regex
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

### Variabilidad de Formatos
- **Problema**: Cada proveedor tiene formato diferente
- **Solución**: Machine Learning o reglas específicas por proveedor
- **Alternativa**: Plantillas para proveedores frecuentes

### UID Duplicada
- **Problema**: Si se recibe factura duplicada = mismo UID
- **Actual**: Detectado por [[C0_PunteoFacturas|C0]]
- **Mejora**: Flag de duplicada en BD_Facturas

### Errores Silenciosos
- **Riesgo**: Extrae datos parciales sin alerta
- **Solución**: Validar completitud, registrar confianza de extracción
- **Threshold**: Si confianza < 80%, marcar para revisión manual

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
