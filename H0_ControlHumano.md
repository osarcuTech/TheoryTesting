---
title: H0 — Control Humano (Validación)
tags: [H0, control, validación, manual]
component: H0
related: [[01_Arquitectura_General]], [[C0_PunteoFacturas]], [[H1_ArchivoRegistro]], [[H2_ComprobacionCierre]], [[03_BDs_Principales]]
---

# H0 — Control Humano (Validación)

## 🎯 Objetivo

Supervisión manual de las sugerencias automáticas de [[C0_PunteoFacturas|C0]]. Un operador humano valida cada punteo propuesto, toma decisiones sobre incidencias y autoriza el paso a [[H1_ArchivoRegistro|H1]].

Es el **corazón de calidad** del sistema: decide qué se archiva, qué requiere corrección, y qué es excepción.

---

## 📋 Descripción del Proceso

### Tareas Principales de H0

#### 1️⃣ Validar Punteos Correctos
**Entrada**: Hoja `Movimientos_cuenta` con columnas O, P, Q
- Columna O: Sugerencia automática de C0
- Columna P: Checkbox para aceptar/rechazar
- Columna Q: Override manual (si rechaza sugerencia)

**Proceso**:
- Revisar cada fila con O ≠ vacío
- Comparar movimiento bancario vs factura sugerida
- ¿Coinciden cantidad, fecha, proveedor?
- SÍ → Marcar P = TRUE
- NO → Dejar en blanco o ingresar factura correcta en Q

**Salida**: Columna P marcada con validaciones

#### 2️⃣ Revisar Incidencias
**Tipos de Incidencias**:
- Factura faltante (movimiento sin sugerencia)
- Movimiento duplicado
- Importe inconsistente (retención, impuesto)
- Proveedor no reconocido

**Acciones por Tipo**:
| Incidencia | Acción | Responsable |
|-----------|--------|------------|
| Factura faltante | Buscar manual en BD_Facturas o pedir a proveedor | H0 |
| Duplicado bancario | Marcar como duplicado, eliminar de BD_Banco | H0 + A1 review |
| Importe inconsistente | Registrar diferencia (retención/impuesto/descuento) en nota | H0 |
| Proveedor nuevo | Agregar a PerfilProveedores para futuro | H0 + [[A2_AsignacionDeGastos]] |
| Factura ilegible (OCR fallido) | Contactar B2, solicitar re-OCR o input manual | H0 + B2 |

#### 3️⃣ Actualizar Bases de Datos
Según incidencias, H0 actualiza:

- **PerfilProveedores**: Agregar nuevos proveedores/patrones
- **AsigCostes**: Correcciones de clasificación (Depto/Categoría)
- **HistorialFacturas**: Correcciones de importe/fecha/proveedor
- **Notas de Auditoría**: Registrar cambios y razón

#### 4️⃣ Autorizar Archivo
Una vez validados todos los punteos:
- Generar lista de facturas a archivar
- Verificar completitud (todas con factura asignada)
- Marcar como "Listo para H1"
- Trigger automático de [[H1_ArchivoRegistro|H1]]

---

## 🖥️ Interface de Trabajo

### Hoja de Control (Movimientos_cuenta)

```
Columnas A-M: Datos bancarios + clasificación (de A1/A2)
├─ A-C: Fecha, Movimiento, Más Datos
├─ D-E: Importe, Saldo
├─ F-H: Departamento, Naturaleza, Categoría
├─ I-K: Cashflow, etc.

Columnas N-R: Trabajo de H0
├─ N: Búsqueda (nota de búsqueda manual)
├─ O: Sugerencia (de C0)
├─ P: ✓ Aceptar (checkbox)
├─ Q: Override manual (nombre factura correcta)
├─ R: Nota / Incidencia (comentarios)
```

### Daily Workflow de H0

**Mañana (30 min)**:
1. Abrir `Movimientos_cuenta`
2. Filtrar P = vacío O Q = vacío (sin validar)
3. Revisar sugerencias
4. Marcar P = TRUE o ingresar en Q

**Mediodía (20 min)**:
1. Buscar incidencias (movimientos sin O)
2. Investigar en BD_Facturas
3. Contactar proveedor si falta factura
4. Actualizar PerfilProveedores

**Tarde (10 min)**:
1. Verificar correcciones de la mañana
2. Autorizar lista para H1
3. Registrar KPIs diarios

---

## 📊 Decisiones de Control

### Matriz de Decisiones

```
Si Sugerencia O ≠ vacío:
  Si coincide (95%+ de confianza):
    → P = TRUE (aceptar)
  Si parcialmente coincide (50-95%):
    → Revisar manual → Si OK: P=TRUE, Si NO: Q=correcta
  Si no coincide (<50%):
    → Q = factura correcta (o vacío si no encontrada)

Si Sugerencia O = vacío (sin sugerencia):
  Si movimiento es trivial (transfers internos, payroll):
    → Ignorar (es esperado)
  Si movimiento es gasto normal:
    → Buscar manual en HistorialFacturas
      → Si encontrada: Q = nombre
      → Si no encontrada: Nota en R = "factura faltante"

Si Importe inconsistente (O=X pero importe diferente):
  → Revisar retenciones/impuestos
  → Si diferencia <5%: Aceptar P=TRUE
  → Si diferencia >5%: Investigar → Q = correcta o R=nota
```

---

## 🐛 Escaladas & Excepciones

### Casos que requieren Escalada a Manager

1. **Factura muy antigua** (>90 días)
   - Riesgo: Pasivo de período anterior
   - Acción: Contactar Finance Manager

2. **Importe muy grande** (>€10,000)
   - Riesgo: Requiere aprobación adicional
   - Acción: Validación con Finance

3. **Proveedor sancionado o bajo análisis**
   - Riesgo: Compliance/Auditoría
   - Acción: Bloquear, notificar Legal

4. **Movimiento sospechoso** (patrón anómalo)
   - Riesgo: Fraude potencial
   - Acción: Reportar a Auditoría Interna

---

## 📊 Métricas de H0

Ver: [[Metricas_Control]]

| KPI | Target | Actual | Acción |
|-----|--------|--------|--------|
| % movimientos validados/día | 100% | ~85% | Aumentar personal o mejorar C0 |
| % tasa de aceptación de O | >80% | ~70% | Mejorar PerfilProveedores |
| % incidencias resueltas | >95% | ~90% | Formación, SOP mejorada |
| Tiempo medio validación | <2 min | ~3 min | Optimizar interface |
| % correcciones posteriores | <2% | ~3% | Auditoría de decisiones |

---

## 📋 Standard Operating Procedure (SOP)

### SOP: Validar un Punteo

**Tiempo estimado**: 1-2 minutos por movimiento

```
1. ¿Hay sugerencia en O?
   → NO: Pasar a SOP_BuscarManual
   → SÍ: Continuar
   
2. Leer movimiento (C2:D2) y factura sugerida (O2)
   
3. Preguntas de validación:
   ✓ ¿Proveedor coincide?
   ✓ ¿Importe es igual o dentro ±5%?
   ✓ ¿Fecha está dentro de ±30 días?
   ✓ ¿Descripción es relevante?
   
4. Si ≥3/4 respuestas SÍ:
   → Marcar P2 = ✓ (checkbox)
   
5. Si <3/4 respuestas SÍ:
   → Ingresar factura correcta en Q2 (si existe)
   → O dejar vacío si no encontrada
   → Agregar nota en R2
```

### SOP: Buscar Factura Manualmente

**Tiempo estimado**: 5-10 minutos

```
1. Leer movimiento (proveedor, importe, fecha aproximada)

2. Buscar en HistorialFacturas:
   FILTER(HistorialFacturas,
     [Proveedor] = proveedor_del_mov AND
     ABS([Importe] - importe_mov) / importe_mov < 0.1 AND
     ABS(DAYS([FechaFact], fecha_mov)) <= 60
   )

3. Si encontrada factura coincidente:
   → Ingresar nombre en Q2
   → Marcar P2 = ✓
   
4. Si no encontrada:
   → Registrar en R2: "Factura no encontrada"
   → Marcar como "Incidencia" para seguimiento
   → Contactar proveedor
```

---

## 🔄 Integración con otros componentes

```
INPUT de H0:
├─ C0 (sugerencias)
├─ Nuevas facturas de B2
├─ Incidencias de workflows

ACCIONES de H0:
├─ Actualiza PerfilProveedores
├─ Actualiza AsigCostes
├─ Actualiza HistorialFacturas
├─ Marca validaciones en P
└─ Autoriza lista para H1

OUTPUT de H0:
├─ Lista de facturas validadas → H1
├─ Incidencias registradas → Backlog
├─ Mejoras de bases de datos → A2/C0
└─ Auditoría de cambios → Compliance
```

---

## 🔗 Notas Relacionadas

- **Entrada**: [[C0_PunteoFacturas]] (sugerencias), [[B2_Cebollón]] (facturas)
- **Salida**: [[H1_ArchivoRegistro]] (archivado), [[H2_ComprobacionCierre]] (verificación)
- **Datos**: [[03_BDs_Principales]] (bases modificadas)
- **KPIs**: [[Metricas_Control]]
- **Escaladas**: [[Propuestas_Mejora#H0_Automatización]]

---

**Última actualización**: 2026-09-10
**Estado**: Activo (requiere atención diaria)
**Impacto**: ⭐⭐⭐⭐⭐ (Crítico - filtro de calidad)
**Personal Requerido**: 1-2 FTE (tiempo completo)
