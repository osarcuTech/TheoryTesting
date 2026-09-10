---
title: H2 — Comprobación y Cierre
tags: [H2, comprobación, cierre, mes]
component: H2
related: [[01_Arquitectura_General]], [[wf_C2_ComprobacionFacturas]], [[H1_ArchivoRegistro]], [[H0_ControlHumano]], [[Metricas_Globales]]
---

# H2 — Comprobación y Cierre

## 🎯 Objetivo

Verificar la completitud y consistencia del ciclo mensual antes de cerrarlo:
- ¿Todas las facturas fueron archivadas?
- ¿Todos los movimientos tienen factura coincidente?
- ¿Hay inconsistencias o pendientes?

Es el **último control de calidad** antes de considerar el mes cerrado.

---

## 📋 Descripción del Proceso

### Entrada
- **Fuente**: Todo lo procesado en el mes
  - BD_Banco con A1/A2 completados
  - BD_Facturas con B1/B2 completados
  - Movimientos validados por H0
  - Facturas archivadas por H1

### Verificaciones

#### 1. Completitud de Matching
```
Para cada movimiento en BD_Banco (mes actual):
  ¿Tiene factura coincidente validada?
    → SÍ: OK
    → NO: Incidencia "Factura Faltante"
    
Resultado: % movimientos con match / total movimientos
Target: 100% (excepto transfers internos)
Actual: ~85%
```

#### 2. Consistencia de Valores
```
Para cada match (movimiento + factura):
  Validar:
    ✓ Importe coincide (±5%)
    ✓ Fecha dentro de ventana
    ✓ Proveedor coincide
    
  Si inconsistencia:
    → Registrar como "Anomalía detectada"
    → Requiere revisión por H0/Manager
```

#### 3. Archivado Completo
```
Para cada factura en BD_Facturas (mes anterior):
  Estado = "ARCHIVADO"?
    → SÍ: OK
    → NO: Incidencia "Pendiente de Archivo"
    
Resultado: % facturas archivadas / total facturas
Target: 100%
Actual: ~95%
```

#### 4. Datos Faltantes
```
Verificar en BD_Facturas:
  Campos requeridos presentes?
    ├─ Proveedor ✓
    ├─ Importe ✓
    ├─ Fecha ✓
    └─ Ubicación final (si archivado) ✓
    
  Datos incompletos → Incidencia "Falta de Datos"
```

#### 5. Duplicados
```
Detectar:
  ├─ Movimientos duplicados (mismo UID)
  ├─ Facturas duplicadas (mismo UID)
  ├─ Matches duplicadas (factura para 2+ movimientos)
  
  Acción: Reportar, segregar, requerir resolución manual
```

### Salida
- **Reporte de Cierre Mensual**: Estado completo del mes
- **Listado de Incidencias**: Pendientes de resolución
- **Autorización de Cierre**: SI (sin pendientes) o NO (requiere H0)
- **Estadísticas**: KPIs mensuales

---

## 🔄 Flujo en n8n

Workflow: [[wf_C2_ComprobacionFacturas]]

### Nodos Principales

| Nodo | Tipo | Descripción |
|------|------|-------------|
| **Trigger H1** | n8n Workflow | Inicia después de H1 |
| **Read Month Data** | Sheets API | Lee datos del mes en BD_Banco y BD_Facturas |
| **Check Matching** | Code | Valida completitud de matches |
| **Verify Consistency** | Code | Verifica valores (importe, fecha, proveedor) |
| **Detect Anomalies** | Code | Identifica inconsistencias y duplicados |
| **Check Archive Status** | Code | Verifica archivado completo de facturas |
| **Generate Report** | PDF/Sheets | Crea reporte de cierre mensual |
| **List Incidents** | Sheets API | Registra incidencias encontradas |
| **Calculate KPIs** | Code | Calcula métricas mensuales |
| **Send Report** | Email | Envía reporte a Finance Manager |
| **Authorize Closure** | Conditional | ¿Cerrar mes? Decide basado en incidencias |
| **Lock Month** | Sheets API | Si OK: bloquea mes para edición (opcional) |
| **Escalate Issues** | Email | Notifica incidencias a responsables |

---

## 📊 Reporte de Cierre Mensual

### Estructura de Reporte

```
╔════════════════════════════════════════════════════════╗
║   REPORTE DE CIERRE MENSUAL — OCTUBRE 2025             ║
║   Sistema Financiero Norgenic                           ║
╚════════════════════════════════════════════════════════╝

1. RESUMEN EJECUTIVO
   Período: 01-10-2025 a 31-10-2025
   Estado: ⚠️ CIERRE PENDIENTE (3 incidencias)
   Datos Procesados:
     • Movimientos bancarios: 1,247
     • Facturas recibidas: 856
     • Matches realizados: 1,190 (95%)
     • Incidencias: 3

2. MOVIMIENTOS BANCARIOS
   Total: 1,247
   Clasificados: 1,200 (96%)
   Pendientes: 47 (4%)
   Con factura coincidente: 1,190 (95%)
   Sin factura: 57 (5%)
   
   Top Proveedores:
     1. TELEFONICA: 45 movimientos
     2. AMAZON: 38 movimientos
     3. TRANSFERENCIA INTERNA: 156 movimientos

3. FACTURAS
   Total recibidas: 856
   Procesadas: 845 (98%)
   Archivadas: 812 (95%)
   Pendientes archivo: 33 (4%)
   
   Top Proveedores (por volumen):
     1. TELEFONICA: 42 facturas
     2. SERVICIOS_GENÉRICOS: 38 facturas
     3. SUMINISTROS: 35 facturas

4. MATCHING & VALIDACIÓN
   Matches exitosos: 1,190
   Validados por H0: 1,180 (99%)
   Rechazados/Corregidos: 10 (1%)
   
   Tasa de aceptación C0: 92%
   Tasa de falsos positivos: 3%

5. INCIDENCIAS DETECTADAS
   
   Incidencia #1: Factura Faltante
   • Movimiento: TRANSFERENCIA_BANCO_XYZ, €2,500
   • Fecha: 2025-10-15
   • Estado: Pendiente búsqueda manual
   • Asignado: H0 - Jose García
   • Plazo: 48 horas
   
   Incidencia #2: Importe Inconsistente
   • Movimiento: TELEFONICA, €145.50
   • Factura sugerida: F-2025-001 (€150.00)
   • Diferencia: €4.50 (3%)
   • Probable causa: Retención
   • Acción: Validar retención, actualizar
   
   Incidencia #3: Duplicado Detectado
   • Factura: "20251001_AMAZON_ORDER123456.pdf"
   • Ubicación original: /2025-10/AMAZON/
   • Duplicado encontrado: /2025-11/AMAZON/
   • Acción: Eliminar duplicado, validar BD_Facturas

6. ANÁLISIS DE CALIDAD
   
   Tasa de Validación Manual: 95% (H0 aceptó sugerencias)
   Tasa de Intervención Manual: 5% (H0 corrigió)
   
   Top Proveedores con Excepciones:
     1. SERVICIOS_GENÉRICOS: 8 excepciones (5%)
     2. SUMINISTROS: 6 excepciones (4%)
     3. OTROS: 5 excepciones (3%)
   
   Recomendación: Mejorar perfil de SERVICIOS_GENÉRICOS

7. AUDITORÍA DE CAMBIOS
   
   Cambios realizados por H0:
     • Correcciones de PerfilProveedores: 12
     • Correcciones de AsigCostes: 8
     • Correcciones de importe: 3
     • Notas de auditoría registradas: 23/23
   
   Cambios realizados por H1:
     • Archivos movidos: 1,190
     • Rutas registradas: 1,190
     • Errores de archivo: 0
   
   Cambios realizados por H2:
     • Incidencias registradas: 3
     • Anomalías detectadas: 0 (críticas)
     • Duplicados detectados: 1

8. KPIs MENSUALES
   
   Importación (A1):
     ├─ Tasa de éxito: 99.5%
     ├─ Duplicados detectados: 15
     └─ Tiempo promedio: 2.3 min
   
   Clasificación (A2):
     ├─ Cobertura automática: 96%
     ├─ Intervención manual: 4%
     └─ Excepciones por proveedor: 5%
   
   Recepción Facturas (B1):
     ├─ Tasa de procesamiento: 98%
     ├─ Facturas sin metadatos: 2
     └─ Tiempo promedio: 1.5 min
   
   Punteo (C0):
     ├─ Tasa de sugerencias: 95%
     ├─ Tasa de aceptación: 92%
     ├─ Falsos positivos: 3%
     └─ Movimientos sin sugerencia: 5%
   
   Control Humano (H0):
     ├─ Movimientos validados: 1,180
     ├─ Incidencias resueltas: 95%
     ├─ Escaladas a manager: 2
     └─ Tiempo promedio validación: 2.8 min
   
   Archivado (H1):
     ├─ Facturas archivadas: 1,190
     ├─ Errores de ubicación: 0
     ├─ Asientos contables enviados: 1,180
     └─ Tiempo promedio archivado: 2.1 min
   
   Cierre (H2):
     ├─ Completitud de matching: 95%
     ├─ Consistencia validada: 100%
     ├─ Duplicados detectados: 1
     └─ Cierre autorizado: NO (pendientes incidencias)

9. RECOMENDACIONES & PRÓXIMOS PASOS
   
   Corto plazo (48 horas):
     1. Resolver Incidencia #1 (Factura Faltante)
     2. Validar Incidencia #2 (Retención)
     3. Eliminar Incidencia #3 (Duplicado)
   
   Mediano plazo (2 semanas):
     1. Mejorar perfil de SERVICIOS_GENÉRICOS
     2. Aumentar tasa de cobertura de C0 a 97%
     3. Capacitación adicional a H0 en nuevos patrones
   
   Largo plazo (1 trimestre):
     1. Implementar ML para predicción de matching
     2. Integración de Document AI para OCR mejorado
     3. Automatización de más tareas en H2

10. FIRMAS & AUTORIZACIONES
    
    Compilado por: Sistema H2
    Fecha: 2025-11-01 14:30 UTC
    
    Revisado por: Francisco López (Finance Manager)
    Firma digital: ___________________
    
    Autorizado para cierre: ⚠️ PENDIENTE
    Razón: Incidencias por resolver
    
    Fecha de cierre esperada: 2025-11-03
```

---

## 🐛 Decisiones de Cierre

### Criterios para Autorizar Cierre

```
¿CERRAR EL MES?

Condición A: Completitud de Matching
  ├─ % movimientos con factura ≥ 95% → OK
  └─ % movimientos con factura < 95% → BLOQUEAR

Condición B: Archivado Completo
  ├─ % facturas archivadas = 100% → OK
  └─ % facturas archivadas < 100% → BLOQUEAR

Condición C: Sin Incidencias Críticas
  ├─ Duplicados: 0 → OK
  ├─ Inconsistencias de importe >10%: 0 → OK
  └─ Cualquier incidencia crítica → BLOQUEAR

Condición D: Validación Manual
  ├─ % movimientos validados ≥ 90% → OK
  └─ % movimientos validados < 90% → ADVERTENCIA (permitir, pero notificar)

CIERRE AUTORIZADO: SI todas A, B, C = OK y D ≥ 90%
CIERRE BLOQUEADO: SI algún A, B, C = BLOQUEAR
CIERRE CONDICIONAL: SI A,B,C OK pero advertencias menores
```

---

## 📊 Métricas & KPIs

Ver: [[Metricas_Globales]]

Principal KPI de cierre:
- **Tasa de cierre exitoso**: % meses cerrados sin incidencias
- **Días hasta cierre**: Días desde fin de mes hasta autorización
- **Incidencias por cierre**: Promedio de incidencias encontradas

---

## 🔗 Notas Relacionadas

- **Entrada**: [[H1_ArchivoRegistro]] (archivado)
- **Escaladas**: [[H0_ControlHumano]] (revisión manual)
- **Datos**: [[03_BDs_Principales]] (fuente de datos)
- **Workflow**: [[wf_C2_ComprobacionFacturas]] (detalles técnicos)
- **KPIs**: [[Metricas_Globales]]

---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐⭐ (Crítico - cierre contable)
**Frecuencia**: Mensual (últimos días del mes)
