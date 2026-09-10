---
title: Métricas Detalladas del Sistema
tags: [métricas, KPI, análisis, medición]
related: [[KPIs_Sistema]], [[00_MOC_Norgenic_Financiera]], [[Propuestas_Mejora]]
---

# Métricas Detalladas del Sistema

## 📌 Introducción

Este documento expande el análisis de KPIs del sistema financiero Norgenic. Proporciona detalles específicos sobre cómo medir cada métrica, qué significa cada indicador, y recomendaciones de análisis para detectar problemas.

---

## 1️⃣ KPI de Importación Bancaria (A1)

### Métricas Principales

#### Tasa de Importación Correcta
**Fórmula**: (Movimientos cargados correctamente / Total importado) × 100

**Qué mide**: % de movimientos bancarios que se cargan sin error en BD_Banco

**Target**: >99%

**Interpretación**:
- >99%: Excelente, el sistema está funcionando
- 95-99%: Aceptable, pero revisar causas
- <95%: Crítico, hay problema de conectividad o formato

#### Tasa de Incidencias por Formato
**Fórmula**: (Archivos con problemas / Total de archivos) × 100

**Problemas típicos**:
- Delimitador incorrecto (coma vs punto y coma)
- Codificación (UTF-8 vs Latin-1)
- Estructura de columnas cambió
- Filas vacías al inicio/final

**Acción recomendada**: Segmentar por:
- Banco (¿cuál tiene más problemas?)
- Tipo de extracto (Movimientos vs Remesas)
- Mes (¿cambió el formato?)

### Análisis Profundo

**🔍 Deduplicación mediante UID**: El sistema A1 genera un UID único combinando Fecha Valor + Fecha Operación + Proveedor + Más Datos + Importe. Ver detalles técnicos en [[A1_ImportarMovimientos_Implementacion#🔐-generación-de-uid-deduplicación]].

```
Si tasa de incidencias > 5%:
  ├─ Revisar si banco cambió formato (¡CRÍTICO!)
  ├─ Verificar nuevos tipos de movimiento
  ├─ Actualizar regex/parsers en A1
  └─ Notificar al equipo de cambio

Si tasa de duplicados > 2%:
  ├─ Banco enviando extractos duplicados
  ├─ Revisar lógica de UID (algoritmo en A1_Implementacion)
  └─ Considerar normalización de caracteres (ñ, á, é, etc.)

Si importación cae (error técnico):
  ├─ Revisar logs en Google Apps Script
  ├─ Validar permisos de Drive
  ├─ Comprobar que filas están disponibles en BD_Banco
  └─ Ver [[A1_ImportarMovimientos_Implementacion#🐛-errores-potenciales]]
```

### Causa Raíz Típica
- **A1 falla** → Problema en importación de datos
- **Cascada** → Todos los flujos downstream afectados
- **Prioridad**: Máxima (antes de continuar con A2)

---

## 2️⃣ KPI de Clasificación de Gastos (A2)

### Métricas Principales

#### Cobertura de Asignación Automática
**Fórmula**: (Movimientos con Depto/Naturaleza/Cat asignados / Total) × 100

**Target**: >95%

**Qué significa**:
- Cuántos movimientos el sistema puede clasificar sin intervención humana
- Indicador de madurez de tabla `AsigCostes`

#### Tasa de Intervención Manual
**Fórmula**: (Movimientos requieren H0 / Total) × 100

**Target**: <10%

**Por qué es importante**:
- Movimientos sin clasificación automática generan trabajo manual
- Si >10%, el sistema no está maduro
- Cada intervención manual cuesta ~2 minutos

#### Excepciones por Proveedor
**Fórmula**: Para cada proveedor: (Excepciones / Total movimientos) × 100

**Ejemplo**:
```
TELEFONICA: 2% excepciones (bueno)
AMAZON: 12% excepciones (malo, revisar)
SERVICIOS_GENERICOS: 18% excepciones (crítico)
```

**Acción**: Si un proveedor >5% excepciones:
1. Analizar qué variaciones de nombre usa
2. Crear reglas específicas en `AsigCostes`
3. Normalizar nombres en BD_Banco

### Análisis Recomendado

```
Preguntarse:
1. ¿Hay un patrón en las excepciones?
   - Mismo proveedor con múltiples nombres
   - Mismo proveedor diferentes conceptos
   
2. ¿Cuántas reglas explican 80% de los fallos?
   - Si 5 reglas explican 80% → inversión en esas
   - Si 50 reglas necesarias → revisión de estructura
   
3. ¿Hay estacionalidad?
   - Marzo (impuestos): más excepciones
   - Navidad: proveedores especiales
```

---

## 3️⃣ KPI de Recepción y Procesamiento de Facturas (B1/B2)

### B1: Recepción de Facturas

#### Tasa de Procesamiento Sin Intervención
**Fórmula**: (Facturas descargadas correctamente / Total recibidas) × 100

**Target**: >98%

**Fallos típicos**:
- Adjunto corrupido
- Formato no soportado
- Sin permisos de lectura

#### Cobertura de Metadatos Iniciales
**Fórmula**: (Facturas con De/Asunto/Fecha / Total) × 100

**Target**: >99%

**Qué se extrae**:
- De: Proveedor (desde remitente)
- Asunto: Descripción/Número factura
- Fecha: Timestamp de recepción

### B2: Procesamiento de Facturas

#### Tasa de Procesamiento Correcto
**Fórmula**: (Facturas con todos metadatos / Total) × 100

**Metadatos requeridos**:
- Proveedor ✓
- Importe ✓
- Fecha Factura ✓
- Número Factura (opcional)

**Target**: >98%

#### Confianza de OCR
**Fórmula**: Promedio de confianza de extracción por factura (0-100%)

**Target**: >90%

**Interpretación**:
- >85%: Procesable automáticamente
- 70-85%: Requiere revisión manual
- <70%: Rechazar, requerir input manual

#### Tasa de Metadatos Incompletos
**Fórmula**: (Facturas sin proveedor/importe/fecha / Total) × 100

**Target**: <2%

**Si >2%**: Problema en OCR
- Imágenes de baja calidad
- Facturas en formato no estándar
- Necesidad de integración con Document AI

### Análisis por Canal
```
Por canal de entrada:
├─ Gmail automático: ~98% éxito
├─ Subida manual: ~95% éxito
├─ PDF escaneado: ~80% éxito
└─ Imágenes móvil: ~60% éxito

Tiempo medio por canal:
├─ Gmail: 1-2 min
├─ Manual: 2-3 min
├─ Escaneado: 5-10 min (OCR)
└─ Móvil: 10-15 min (OCR + manual)
```

---

## 4️⃣ KPI de Punteo Automático (C0)

### Métricas Principales

#### Tasa de Sugerencias Generadas
**Fórmula**: (Movimientos con sugerencia en col. O / Total movimientos) × 100

**Target**: >85%

**Qué significa**: % de movimientos para los que C0 pudo encontrar una factura candidata

**Si <85%**: Problema en PerfilProveedores
- Faltan reglas de matching
- Movimientos con proveedor desconocido

#### Tasa de Sugerencias Aceptadas
**Fórmula**: (Sugerencias validadas como correctas / Total sugerencias) × 100

**Target**: >85%

**Qué significa**: Cuántas sugerencias de C0 H0 marca como "P=TRUE"

**Si <85%**: Problema en lógica de matching
- Tolerancia de importe incorrecta
- Ventana de fechas muy amplia
- Proveedor mal identificado

#### Tasa de Sugerencias Rechazadas
**Fórmula**: (Sugerencias P=FALSE o Q≠O / Total sugerencias) × 100

**Target**: <15%

**Interpretación**:
- Si alta: C0 sugiere mal → Revisar lógica
- Si baja: C0 es fiable → Considerar auto-aceptación

#### Tasa de Movimientos Sin Coincidencia
**Fórmula**: (Movimientos sin sugerencia O=∅ / Total) × 100

**Target**: <15%

**Causas típicas**:
- Factura nunca recibida
- Proveedor no en PerfilProveedores
- Importe muy diferente (retención, descuento)

#### Tasa de Falsos Positivos
**Fórmula**: (Sugerencias H0 acepta pero después son erróneas / Total aceptadas) × 100

**Target**: <5%

**Impacto**: Facturas archivadas incorrectamente, problema contable

**Acción**: Si >5%:
1. Auditar decisiones de H0
2. Revisar confianza de matching
3. Considerar reentrenamiento de PerfilProveedores

### Análisis Segmentado

```
Analizar C0 por:

1. Proveedor:
   - TELEFONICA: 92% aceptación (excelente)
   - AMAZON: 78% aceptación (revisar)
   - OTROS: 65% aceptación (crítico)

2. Rango de Importe:
   - <€100: 85% aceptación
   - €100-€1,000: 80% aceptación
   - >€1,000: 70% aceptación (retenciones comunes)

3. Diferencia de Fechas:
   - 0-7 días: 95% aceptación
   - 7-30 días: 85% aceptación
   - >30 días: 40% aceptación (facturas atrasadas)

4. Patrón Textual:
   - Texto claro: 90% aceptación
   - Acrónimos: 75% aceptación
   - Caracteres especiales: 60% aceptación
```

### Recomendación de Mejora
```
Si tasa aceptación < 80%:
  
  PASO 1: ¿Es problema de PerfilProveedores?
    → Agregar 50 nuevos patrones de movimiento
    → Documentar excepciones por proveedor
    → Target: +15% aceptación
  
  PASO 2: ¿Es problema de HistorialFacturas?
    → Mejorar OCR (Document AI)
    → Limpiar datos duplicados
    → Target: +10% cobertura de datos
  
  PASO 3: ¿Es problema de lógica de C0?
    → Ajustar tolerancia por proveedor
    → Implementar scoring de confianza
    → Usar ML para pesos dinámicos
    → Target: +15% aceptación
```

---

## 5️⃣ KPI de Control Humano (H0/H2)

### Métricas de H0

#### Tasa de Correcciones Manuales
**Fórmula**: (Movimientos H0 corrige / Total movimientos) × 100

**Target**: <5%

**Qué significa**: % de decisiones de C0 que H0 rechaza o corrige

**Análisis**:
- Si <5%: C0 es fiable, considerar auto-aceptación
- Si 5-15%: Normal, C0 necesita mejora
- Si >15%: C0 no está listo para confianza

#### Tasa de Duplicados Detectadas
**Fórmula**: (UIDs duplicadas encontradas / Total) × 100

**Target**: <1%

**Qué detecta**:
- Mismo movimiento 2x en BD_Banco
- Misma factura 2x en BD_Facturas
- Factura sugerida para 2+ movimientos

#### Tasa de Facturas Pendientes
**Fórmula**: (Facturas con estado≠ARCHIVADO / Total procesadas) × 100 al cierre de mes

**Target**: <2%

**Qué significa**: Facturas que no se archivaron a tiempo

### Análisis de Calidad de Datos

```
Preguntarse:
1. ¿Calidad de BD_Facturas es el bottleneck?
   - Muchos metadatos incompletos
   - OCR de baja confianza
   → Invertir en Document AI

2. ¿Calidad de PerfilProveedores es el bottleneck?
   - Muchas excepciones por proveedor nuevo
   - Patrones similares no capturados
   → Enriquecer reglas (30-50 más)

3. ¿Mantenimiento de datos es el bottleneck?
   - Hay UID duplicadas
   - Datos históricos inconsistentes
   → Hacer cleanup de datos históricos
```

---

## 6️⃣ KPI de Flujo de Archivado (H1/C1/C2)

### Métricas de H1

#### Tiempo Medio de Archivado
**Fórmula**: Promedio(FechaArchivo - FechaValidacion) en días

**Target**: <1 día (idealmente <4 horas)

**Qué significa**: Cuánto tarda desde que H0 valida hasta que factura está en Drive final

> 🔧 **Implementación técnica**: Consultar [[H1_ArchivoRegistro_Implementacion]] para detalles de optimización (arquitectura atómica, idempotencia)
>
> ⚡ **Problema de performance identificado**: [[Informes_Sesiones_Tecnicas]] documenta que el overhead actual es ~90 seg por ejecución, optimizable a ~2 seg con lazy loading

#### % Facturas Archivadas a Tiempo
**Fórmula**: (Facturas archivadas en día N / Total proceso ese día) × 100

**Target**: >95%

#### Tasa de Incidencias en Archivo
**Fórmula**: (Archivos con error (ubicación, permiso, corrupción) / Total archivados) × 100

**Target**: <1%

**Errores típicos**:
- Archivo no encontrado
- Permiso denegado
- Carpeta destino no existe

### Métricas de H2

#### % Ciclo Completo en Plazo
**Fórmula**: (Movimiento fecha → Archivado en <X días / Total) × 100

**Target**: >90%

**Plazo típico**: 15-20 días hábiles desde recepción

#### % Cierre Mensual a Tiempo
**Fórmula**: (Meses cerrados en <5 días post-mes / Total) × 100

**Target**: 100%

---

## 7️⃣ KPI de Rendimiento Global

### Ciclo Completo End-to-End

#### Tiempo Medio de Ciclo Completo
**Fórmula**: Promedio(FechaArchivado - FechaRecepcionMovimiento) en días

**Target**: <15 días

**Desglose típico**:
```
Movimiento recibido
  ↓ A1 (1 min)
Importado en BD_Banco
  ↓ A2 (1 min)
Clasificado
  ↓ B2 (1-5 min) [Factura recibida en paralelo]
Factura procesada
  ↓ C0 (1 min)
Sugerencia generada
  ↓ H0 (1-3 min)
Validado
  ↓ H1 (2-5 min)
Archivado
  ↓ H2 (1 min)
Comprobado
────────────────
Total: 8-18 minutos de procesamiento automático
+ 1-3 días espera por B1 (recepción factura)
+ 1-7 días espera por H0 (validación manual)
────────────────
TOTAL CICLO: 3-15 días
```

#### Automatización vs Manual
**Fórmula**: (Operaciones sin intervención H0 / Total) × 100

**Target**: >85%

**Qué mide**: % del trabajo que no requiere validación manual

**Si <85%**: Sistema no está suficientemente automatizado
- C0 necesita mejora
- PerfilProveedores incompleto

#### % Cierre Mensual Completado
**Fórmula**: (Meses completamente cerrados / Total meses) × 100

**Target**: 100%

**Qué significa**: Todos los movimientos y facturas reconciliados

---

## 🎯 Recomendaciones Clave

### Construir Tablero
```
Crear dashboard mensual con:
├─ KPIs por mes (tendencias)
├─ KPIs por proveedor (quién necesita atención)
├─ KPIs por canal (Gmail vs manual)
├─ KPIs por tipo (movimientos vs facturas)
└─ Proyección de cierre (% completo)
```

### Identificar Bottlenecks
```
Preguntar mensualmente:
1. ¿Dónde se gasta más tiempo?
   → Automatizar o mejorar
   
2. ¿Dónde hay más errores?
   → Agregar validación
   
3. ¿Dónde hay más intervención manual?
   → Enriquecer datos / reglas
```

### ROI de Mejoras
```
Cada mejora debe medirse por:
├─ Reducción de tiempo (minutos/mes)
├─ Reducción de errores (%)
├─ Reducción de intervención manual (%)
└─ Costo de implementación (horas)

Fórmula: (Horas ahorradas × €50/hora - Costo impl) / Costo impl
```

---

## 📊 Resumen: KPIs Críticos por Componente

| Componente | KPI Crítico | Target | Acción si Falla |
|-----------|------------|--------|-----------------|
| **A1** | Tasa importación | >99% | Revisar formato banco |
| **A2** | Cobertura automática | >95% | Enriquecer AsigCostes |
| **B1/B2** | Confianza OCR | >90% | Integrar Document AI |
| **C0** | Tasa aceptación | >85% | Mejorar PerfilProveedores |
| **H0** | Correcciones | <5% | Mejorar C0 |
| **H1** | Tiempo archivado | <1 día | Aumentar frecuencia H1 |
| **H2** | Cierre a tiempo | 100% | Extensión plazo |
| **Global** | Ciclo completo | <15 días | Revisar [[Informes_Sesiones_Tecnicas]] para optimización |

---

## 🔗 Notas Relacionadas

- [[KPIs_Sistema]] - Resumen ejecutivo de KPIs
- [[Propuestas_Mejora]] - Iniciativas para mejorar KPIs
- [[A1_ImportarMovimientos]] hasta [[H2_ComprobacionCierre]] - Detalle de componentes
- [[00_MOC_Norgenic_Financiera]] - Índice general

---

**Última actualización**: 2026-09-10
**Responsable**: Finance Operations Manager
**Frecuencia de revisión**: Semanal
**Frecuencia de medición**: Diaria o automática
