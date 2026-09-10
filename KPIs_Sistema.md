---
title: KPIs del Sistema Financiero
tags: [KPI, métricas, medición, performance]
related: [[00_MOC_Norgenic_Financiera]], [[01_Arquitectura_General]]
---

# KPIs del Sistema Financiero

## 📊 Estructura de KPIs

El sistema de KPIs está organizado por componentes (A1, A2, B1, B2, C0, H0, H1, H2) y también hay un conjunto de **KPIs Globales** que miden el rendimiento end-to-end.

---

## [[Metricas_Importacion|1. KPIs de Importación Bancaria (A1)]]

Ver: [[Metricas_Importacion]]

### Métricas Principales

- **Tasa de importación correcta**: % movimientos cargados sin error sobre total importado
- **Tasa de incidencias por formato**: % archivos con problemas de delimitador/codificación
- **Duplicados detectados**: # de UID duplicadas eliminadas
- **Tiempo de proceso**: Segundos desde trigger a append en BD

### Targets
| Métrica | Target | Actual | Acción |
|---------|--------|--------|--------|
| Tasa de éxito | 99%+ | 99.5% | ✅ OK |
| Duplicados detectados | <2% | 1.2% | ✅ OK |
| Tiempo proceso | <5 min | 2.3 min | ✅ OK |

---

## [[Metricas_Asignacion|2. KPIs de Clasificación de Gastos (A2)]]

Ver: [[Metricas_Asignacion]]

### Métricas Principales

- **Cobertura de asignación automática**: % movimientos clasificados sin intervención manual
- **Tasa de intervención manual**: % movimientos requieren corrección H0
- **Excepciones por proveedor**: ¿Qué proveedores generan más errores?
- **Tiempo de proceso**: Segundos por lote

### Targets
| Métrica | Target | Actual | Acción |
|---------|--------|--------|--------|
| Cobertura automática | 95%+ | 96% | ✅ OK |
| Intervención manual | <10% | 4% | ✅ OK |
| Excepciones/proveedor | <5% | 5% | ⚠️ MONITOR |
| Tiempo proceso | <10 min | 8.5 min | ✅ OK |

---

## [[Metricas_Facturas|3. KPIs de Recepción & Procesamiento (B1/B2)]]

Ver: [[Metricas_Facturas]]

### Métricas Principales (B1)

- **Tasa de procesamiento sin intervención**: % correos descargados exitosamente
- **Tiempo medio de procesamiento**: Segundos desde recepción a guardado en Drive
- **Tasa de fallos de descarga**: % adjuntos no descargados
- **Cobertura de extracción de metadatos**: % campos obtenidos vs esperados

### Métricas Principales (B2)

- **Tasa de facturas procesadas correctamente**: % sin intervención manual
- **Tasa de metadatos incompletos**: % facturas sin proveedor/importe/fecha
- **Confianza de OCR**: % de campos con confianza >80%
- **Tasa de duplicados detectadas**: % UIDs duplicadas

### Targets (B1)
| Métrica | Target | Actual | Acción |
|---------|--------|--------|--------|
| Procesamiento exitoso | 98%+ | 98% | ✅ OK |
| Fallos de descarga | <2% | 1.5% | ✅ OK |
| Tiempo proceso | <2 min | 1.5 min | ✅ OK |

### Targets (B2)
| Métrica | Target | Actual | Acción |
|---------|--------|--------|--------|
| Procesamiento exitoso | 98%+ | 98% | ✅ OK |
| Metadatos incompletos | <3% | 2% | ✅ OK |
| Confianza OCR >80% | 95%+ | 94% | ⚠️ MONITOR |
| Duplicados detectados | <1% | 0.8% | ✅ OK |

---

## [[Metricas_Punteo|4. KPIs de Matching Automático (C0)]]

Ver: [[Metricas_Punteo]]

### Métricas Principales

- **Tasa de sugerencias generadas**: % movimientos con sugerencia de factura
- **Tasa de sugerencias aceptadas**: % sugerencias validadas como correctas por H0
- **Tasa de falsos positivos**: % sugerencias que resultan incorrectas
- **Tasa de movimientos sin coincidencia**: % sin sugerencia por falta de datos
- **Confianza promedio**: Score de confianza del matching

### Targets
| Métrica | Target | Actual | Acción |
|---------|--------|--------|--------|
| Tasa de sugerencias | 90%+ | 85% | ⚠️ MEJORAR |
| Aceptación | >85% | 70% | 🔴 CRÍTICO |
| Falsos positivos | <5% | 8% | 🔴 CRÍTICO |
| Sin coincidencia | <20% | 15% | ⚠️ MONITOR |
| Confianza promedio | >75% | 65% | 🔴 CRÍTICO |

**Acciones de Mejora Urgentes**: 
- Enriquecer PerfilProveedores (más reglas)
- Mejorar lógica de tolerancia de importe
- Integrar ML para ajuste dinámico

---

## [[Metricas_Control|5. KPIs de Control Humano (H0)]]

Ver: [[Metricas_Control]]

### Métricas Principales

- **% movimientos validados por día**: ¿Cuántos se procesan completamente?
- **% tasa de aceptación de sugerencias**: ¿Acepta o corrige?
- **% incidencias resueltas**: ¿Se cierran los problemas?
- **Tiempo medio de validación**: Minutos por movimiento
- **% correcciones posteriores**: % decisiones que resultaron incorrectas

### Targets
| Métrica | Target | Actual | Acción |
|---------|--------|--------|--------|
| % validados/día | 100% | 85% | ⚠️ PERSONAL |
| Aceptación | >80% | 70% | ⚠️ MEJORAR C0 |
| Incidencias resueltas | >95% | 90% | ⚠️ MONITOR |
| Tiempo validación | <2 min | 3 min | ⚠️ UX |
| Correcciones posteriores | <2% | 3% | ⚠️ AUDITORÍA |

**Nota**: H0 requiere ~1.5 FTE para mantener 100% actualizado

---

## [[Metricas_Archivado|6. KPIs de Archivo y Registro (H1)]]

Ver: [[Metricas_Archivado]]

### Métricas Principales

- **Tiempo medio de archivado**: Minutos desde validación a guardado en Drive
- **% facturas archivadas a tiempo**: % dentro del plazo esperado
- **Tasa de errores de archivo**: % movimientos/copias con error
- **Tasa de incidencias en Odoo**: % asientos contables rechazados
- **Cumplimiento de plazo**: % ciclo completo < X días

### Targets
| Métrica | Target | Actual | Acción |
|---------|--------|--------|--------|
| Tiempo archivado | <2 min | 3 min | ⚠️ OPTIMIZAR |
| Archivado a tiempo | 100% | 85% | ⚠️ FRECUENCIA |
| Errores archivo | <1% | 2% | 🔴 CRÍTICO |
| Errores Odoo | <5% | 8% | ⚠️ VALIDACIÓN |
| Plazo completo | 100% | 75% | 🔴 CRÍTICO |

**Acciones Urgentes**:
- Aumentar frecuencia de ejecución de H1
- Mejorar validación de datos antes de Odoo
- Debuggear errores de ubicación de archivos

---

## [[Metricas_Globales|7. KPIs Globales (End-to-End)]]

Ver: [[Metricas_Globales]]

### Métricas Principales

- **Ciclo completo**: Días desde recepción hasta cierre
- **Tasa de reconciliación**: % movimientos + facturas emparejados
- **Tiempo hasta cierre mensual**: Días post-mes para autorización
- **Cost per transaction**: Costo operacional por movimiento procesado
- **Satisfacción de usuaria (H0)**: NPS o escala de fricción

### Targets
| Métrica | Target | Actual | Acción |
|---------|--------|--------|--------|
| Ciclo completo | <15 días | 18 días | ⚠️ MONITOR |
| Reconciliación | >95% | 85% | 🔴 CRÍTICO |
| Cierre mensual | <5 días | 7 días | ⚠️ MONITOR |
| Cost per txn | <€0.50 | €0.75 | ⚠️ OPTIMIZAR |
| Satisfacción H0 | >7/10 | 5/10 | 🔴 CRÍTICO |

---

## 🎯 Dashboard de Seguimiento

### Vista Mensual (Octubre 2025)

```
╔══════════════════════════════════════════════════════════════════╗
║         DASHBOARD KPIs — OCTUBRE 2025                            ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║ A1 IMPORTACIÓN          ✅ 99.5% | 2.3 min | 15 duplicados   ║
║ A2 CLASIFICACIÓN        ✅ 96% | 4% manual | 8.5 min        ║
║ B1 RECEPCIÓN            ✅ 98% | 1.5 min | 1.5% fallos      ║
║ B2 PROCESAMIENTO        ✅ 98% | 2% incompletos | 1.5 min    ║
║ C0 PUNTEO               ⚠️ 85% sugerencias | 70% acepta | 8% FP ║
║ H0 VALIDACIÓN           ⚠️ 85% día | 70% acepta | 3 min     ║
║ H1 ARCHIVO              ⚠️ 3 min | 85% a tiempo | 2% errores ║
║ H2 CIERRE               ⚠️ 85% reconciliado | 7 días        ║
║                                                                  ║
║ GLOBAL                  ⚠️ 18 días ciclo | €0.75/txn | 5/10  ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║ ✅ = Target OK  | ⚠️ = Monitor | 🔴 = Crítico                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 📈 Análisis de Tendencias

### Últimos 3 Meses (Agosto-Octubre 2025)

```
Métrica                  Ago      Sep      Oct      Tendencia
─────────────────────────────────────────────────────────────
A1: Importación exitosa  99%      99%      99.5%    → Mejorando
A2: Cobertura automática 92%      94%      96%      → Mejorando
B1/B2: Procesamiento     95%      96%      98%      → Mejorando
C0: Tasa aceptación      65%      68%      70%      → Mejorando
H0: Throughput diario    70%      75%      85%      → Mejorando
H1: Errores archivo      3%       2.5%     2%       → Mejorando
Global: Ciclo completo   22 días  20 días  18 días  → Mejorando
Global: Cost per txn     €1.20    €0.95    €0.75    → Mejorando
```

**Conclusión**: Tendencia positiva en mayoría de KPIs. Áreas críticas (C0, H0 satisfacción) requieren atención.

---

## 🎯 Roadmap de Mejora

### Corto Plazo (2 semanas)
1. Aumentar cobertura de PerfilProveedores de 85% → 95%
2. Reducir plazo de H0 de 3 min → 2 min (optimizar UX)
3. Reducir errores de H1 de 2% → <1%

### Mediano Plazo (1 mes)
1. Implementar alertas automáticas para C0 <80% confianza
2. Integración de feedback en ML para scoring dinámico
3. Aumentar personal H0 si no mejora satisfacción

### Largo Plazo (1 trimestre)
1. ML para predicción de matching (target: 90% aceptación)
2. Document AI para OCR mejorado (target: 99% confianza)
3. Automatización de más tareas H0 (target: 100% throughput)

---

## 🔗 Notas Relacionadas

- [[Propuestas_Mejora]] - Iniciativas para alcanzar targets
- [[Metricas_Importacion]] - Detalle KPIs A1
- [[Metricas_Asignacion]] - Detalle KPIs A2
- [[Metricas_Facturas]] - Detalle KPIs B1/B2
- [[Metricas_Punteo]] - Detalle KPIs C0
- [[Metricas_Control]] - Detalle KPIs H0
- [[Metricas_Archivado]] - Detalle KPIs H1
- [[Metricas_Globales]] - Detalle KPIs E2E

---

**Última actualización**: 2026-09-10
**Frecuencia de revisión**: Semanal
**Responsable**: Finance Operations Manager
