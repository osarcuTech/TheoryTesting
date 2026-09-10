---
title: A1 — Importar Movimientos Bancarios
tags: [A1, importación, banco, n8n]
component: A1
related: [[01_Arquitectura_General]], [[wf_A1_ImportarMovimientos]], [[A2_AsignacionDeGastos]], [[Metricas_Detalladas]], [[03_BDs_Principales]], [[A1_ImportarMovimientos_Implementacion]]
---

# A1 — Importar Movimientos Bancarios

## 🎯 Objetivo

Importar de forma automática movimientos bancarios descargados en formato Excel/CSV hacia la base de datos central **BD_Banco** en Google Sheets, eliminando duplicados mediante UID único.

---

## 📋 Descripción del Proceso

### Entrada
- **Fuente**: Archivos Excel/Sheets descargados del banco
- **Ubicación**: Carpeta específica en Google Drive
- **Trigger**: Detección automática de nuevo archivo (n8n cada 1 minuto)
- **Formato esperado**: Columnas: Fecha, Fecha Valor, Movimiento, Más Datos, Importe, Saldo

### Procesamiento
1. **Descarga** del archivo desde Google Drive
2. **Lectura** de datos comenzando en fila 4 (asumiendo headers en fila 3)
3. **Inversión de orden** para alinear con histórico existente
4. **Generación de UID** único (ver [[A1_ImportarMovimientos_Implementacion#🔐-generación-de-uid-deduplicación]])
5. **Comparación** con BD_Banco usando UID (fuzzy compare activado)
6. **Deduplicación**: Solo se agregan movimientos nuevos
7. **Limpieza**: Asignación de tipos de datos finales
8. **Almacenamiento** en BD_Banco
9. **Eliminación** del archivo original de Drive

> 📌 **Detalles técnicos**: Consulta [[A1_ImportarMovimientos_Implementacion]] para ver cómo se implementa en Google Apps Script

### Salida
- Movimientos nuevos agregados a BD_Banco
- Trigger automático de [[A2_AsignacionDeGastos|A2]] (si está habilitado)
- Trigger automático de [[wf_C0_PuntearFacturas|C0]] (si está habilitado)

---

## 🔄 Flujo en n8n

Workflow: [[wf_A1_ImportarMovimientos]]

### Nodos Principales

| Nodo | Tipo | Descripción |
|------|------|-------------|
| **Google Drive Trigger** | Trigger | Detecta archivos nuevos en carpeta cada minuto |
| **Google Drive1** | API | Descarga el archivo nuevo |
| **Google Sheets Importado** | API | Lee datos del Sheet (fila 4+) |
| **Code** | JavaScript | Invierte orden de items: `items.reverse()` |
| **Campos Historico** | Transform | Genera UID y asigna tipos de datos |
| **Google Sheets Historico1** | API | Lee BD_Banco existente |
| **Campos Historico1** | Transform | Prepara datos históricos para comparación |
| **Compare Datasets** | Compare | Fuzzy compare con UID, prefiere input1 |
| **Edit FieldsImportados** | Transform | Limpia y asigna tipos finales |
| **Google Sheets Historico** | API | Append de nuevos movimientos a BD_Banco |
| **Google Drive** | API | Elimina archivo original |
| **Execute Workflow** | Trigger | Ejecuta A2 y C0 (deshabilitado) |

### Mapeo de Datos

```
Entrada (Excel/Sheets):
├── Fecha (string): "2025-10-01"
├── Fecha valor (string): "2025-10-02"
├── Movimiento (string): "TRANSFER FROM ABC"
├── Más datos (string): "CONCEPTO/REF"
├── Importe (number): 1500.50
└── Saldo (number): 45000.00

UID generado: "TRANSFER FROM ABC|CONCEPTO/REF|1500.50|45000.00"

Salida (BD_Banco):
├── A: Fecha
├── B: Fecha valor
├── C: Movimiento
├── D: Más datos
├── E: Importe
└── F: Saldo
```

---

## ⚙️ Configuración

### Google Drive Trigger
- **Carpeta monitoreada**: `1QL47EotyHLz4xhEssWw_MWIAvqDKcsg1`
- **Intervalo**: 1 minuto
- **Tipo de archivo**: Google Sheets

### Lectura de Datos
- **Hoja a leer**: Primera hoja del archivo
- **Rango**: Comenzar en fila 4 (headers en fila 3)
- **Campos esperados**: A=Fecha, B=Fecha Valor, C=Movimiento, D=Más Datos, E=Importe, F=Saldo

### Destino
- **Sheet ID**: `1sZeGfiuG7Ab9jx14_-oaQZTtrhIohlx5dhYoSgZCOuw` (BD_Banco)
- **Sheet Index**: `1089991841`
- **Append mode**: Automap por nombre de columna

---

## 🐛 Consideraciones & Issues

### Deduplicación
- **Método**: UID basada en concatenación de campos
- **Riesgo**: Si el formato de decimales varía (ej., `1500.50` vs `1500.5`), será considerado diferente
- **Solución propuesta**: Normalizar decimales antes de generar UID (ver [[Propuestas_Mejora#Normalizar_Decimales]])

### Reversión de Orden
- Se invierte porque los bancos export cronológicamente inverso
- **Verificar**: Si el banco cambió formato, puede requerirse actualización

### Ciclo de Vida del Archivo
- Archivo se elimina después de importación para evitar reimportes
- **Riesgo**: Si falla eliminación, puede repetirse
- **Solución**: Flag de "procesado" en nombre de archivo antes de eliminación

---

## 📊 Métricas & KPIs

Ver: [[Metricas_Importacion]]

- **Tasa de importación correcta**: % movimientos cargados sin error
- **Tasa de duplicados detectados**: % movimientos filtrados por UID
- **Tiempo de proceso**: Segundos desde trigger hasta append
- **Tasa de fallos**: % ejecuciones con error

---

## 🔗 Notas Relacionadas

- **Siguiente**: [[A2_AsignacionDeGastos]] (clasificación de gastos)
- **Datos**: [[03_BDs_Principales#BD_Banco]] (estructura BD)
- **Workflow**: [[wf_A1_ImportarMovimientos]] (detalles técnicos n8n)
- **Mejoras**: [[Propuestas_Mejora#A1_Optimizaciones]]
- **Fórmulas**: [[Formulas_Google_Sheets#LastRow_Movimientos]]

---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐⭐ (Crítico - punto de entrada)
