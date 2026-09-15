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
- Movimiento faltante (pedir movimientos actualizados)
- Importe inconsistente (revisar si es la factura correcta y en caso negativo conseguir la correcta o modificar cebollón para que la saque de forma correcta)
- Movimiento no reconocido (preguntar por la correcta asignación de este para poder ponerla en A2.1)

**Acciones por Tipo**:
| Incidencia | Acción | Responsable |
|-----------|--------|------------|
| Factura faltante | Buscar manual en BD_Facturas o pedir a proveedor | H0 |
| Importe inconsistente | Registrar diferencia (retención/impuesto/descuento) en nota | H0 |
| Proveedor nuevo | Agregar a PerfilProveedores para futuro | H0 + [[A2_AsignacionDeGastos]] |
| Movimiento no reconocido | Contactar H0 | H0 + B2 |

#### 3️⃣ Actualizar Bases de Datos
Según incidencias, H0 actualiza:

- **Form_AsigCostes**: Correcciones de clasificación.
- **AsigCostes**: Correcciones de clasificación.
- **PProveedores**: Agregar nuevos proveedores/patrones
- **HistorialFacturas**: Correcciones de importe/fecha/proveedor
- **Notas de Auditoría**: Registrar cambios y razón

#### 4️⃣ Autorizar Archivo
Una vez validados todos los punteos:
- Generar lista de facturas pendientes a recibir.
- Verificar completitud (todas con factura asignada)
- Marcar como "Listo para H1"
- Trigger automático de [[H1_ArchivoRegistro|H1]]

---

## 📊 Decisiones de Control

### Matriz de Decisiones

```
Si Sugerencia O ≠ vacío:
  Si coincide (95%+ de confianza):
    → P = TRUE (aceptar)
  Si parcialmente coincide (-95%):
    → Revisar manual/ ajustado A2.1 si hace falta → Si OK: P=TRUE, Si NO: Q=correcta
  Si no lo detecta C0:
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

1. **Movimiento desconocido** (patrón anómalo)
   - Riesgo: Fraude potencial
   - Acción: Reportar a Manager
2. **Movimientos/Facturas faltantes**
   - Acción: Pedir a Manager


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

**Tiempo estimado**: 1-5 minutos

```
1. Leer movimiento (proveedor, importe, fecha aproximada)

2. Buscar en HistorialFacturas o en carpeta:
3. Si encontrada factura coincidente:
   → Ingresar nombre en Q2
   → Marcar P2 = ✓
   
4. Si no encontrada:
   → Registrar en R2: "Factura no encontrada"
   → Marcar como "Incidencia" para seguimiento
   → Contactar Manager
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
