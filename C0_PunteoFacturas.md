---
title: C0 — Punteo de Facturas (Matching Automático)
tags: [C0, punteo, matching, fórmulas, google-sheets]
component: C0
related: [[01_Arquitectura_General]], [[wf_C0_PuntearFacturas]], [[A2_AsignacionDeGastos]], [[B2_Cebollón]], [[H0_ControlHumano]], [[Metricas_Punteo]]
---

# C0 — Punteo de Facturas (Matching Automático)

## 🎯 Objetivo

Generar sugerencias automáticas de emparejamiento entre movimientos bancarios ([[A2_AsignacionDeGastos|clasificados en A2]]) y facturas ([[B2_Cebollón|procesadas en B2]]) utilizando lógica de matching inteligente.

El resultado es una columna "O" (Sugerencia) y "P" (Validación) que [[H0_ControlHumano|H0]] usa para conciliación.

---

## 📋 Descripción del Proceso

### Entrada
1. **Movimientos clasificados**: Hoja `Movimientos_cuenta` (desde A2)
   - Campos: Fecha, Movimiento, Más Datos, Importe, Departamento, etc.
2. **Facturas procesadas**: `HistorialFacturas` (desde B2)
   - Campos: Fecha Factura, Proveedor, Importe, Descripción, UID

### Lógica de Matching
Para cada movimiento bancario, C0 busca facturas coincidentes basándose en:

1. **Proveedor** (PerfilProveedores)
   - Tabla que mapea "Movimiento" bancario → "Proveedor" esperado
   - Ejemplo: "TELEFONICA" → Proveedor "TELEFONICA"

2. **Importe** (tolerancia)
   - Coincidencia exacta O dentro de rango % (ej. ±5%)
   - Maneja diferencias por decimales, redondeos

3. **Fecha** (ventana temporal)
   - Factura debe estar dentro de X días del movimiento
   - Default: ±30 días

4. **Descripción** (opcional)
   - Búsqueda de keywords comunes

### Salida
- **Columna O (Sugerencia)**: Nombre factura sugerida (o vacío)
- **Columna P (Validación)**: Checkbox de aceptación manual por H0
- **Columna Q (Override manual)**: Campo para ingreso manual si sugerencia es incorrecta

---

## 🔄 Fórmula en Google Sheets

Ubicación: [[Formulas_Google_Sheets#C0_PunteoFacturas]]

### Estructura Simplificada

```
COLUMNA O (Sugerencia automática):
=LET(
  movimiento, C2,
  masDatos, D2,
  importe, E2,
  fecha, A2,
  
  perfilProv, INDIRECTO("PerfilProveedores!A:D"),
  historialFras, INDIRECTO("HistorialFacturas!A:F"),
  
  proveedorEsperado, VLOOKUP(movimiento, perfilProv, 2, FALSE),
  
  candidatas, FILTER(
    historialFras,
    (historialFras[Proveedor] = proveedorEsperado) AND
    (ABS(historialFras[Importe] - importe) / importe < 0.05) AND
    (ABS(DAY(fecha, historialFras[Fecha])) <= 30)
  ),
  
  mejorCoincidencia, INDEX(candidatas, 1, 0),
  
  SI(ISNA(mejorCoincidencia), "", mejorCoincidencia)
)

COLUMNA P (Validación manual):
=SI(O2<>"", FALSE(), NA())
// H0 cambia a TRUE si acepta la sugerencia, deja vacío si rechaza

COLUMNA Q (Override manual):
=SI(P2=TRUE, O2, SI(Q2<>"", Q2, ""))
// Si P=TRUE usa O, si no usa override manual en Q
```

---

## 📊 Tabla de Soporte: PerfilProveedores

Esta tabla es la **base del matching**. Define para cada patrón de movimiento:

```
| Movimiento    | Proveedor    | Tolerancia % | Ventana Días |
|---------------|--------------|--------------|--------------|
| TELEFONICA    | TELEFONICA   | 5%           | 30           |
| AMAZON        | AMAZON       | 10%          | 45           |
| SALARY        | RRHH INTERNO | 0%           | 0            |
| FACTURA-*     | VARIED       | 5%           | 60           |
| TRANSFER      | UNKNOWN      | N/A          | N/A          |
```

---

## 🔧 Algoritmo de Matching Detallado

### Paso 1: Identificar Proveedor Esperado
```javascript
// Buscar en PerfilProveedores usando Movimiento como clave
expectedProvider = VLOOKUP(movimiento, PerfilProveedores, 2, FALSE)

// Si no hay coincidencia exacta:
//   → Buscar con patrón (REGEX)
//   → Si sigue sin haber → "UNKNOWN"
```

### Paso 2: Buscar Candidatas
```javascript
// Filtrar historialFacturas por:
candidates = FILTER(
  HistorialFacturas,
  
  // 1. Proveedor coincide
  [Proveedor] = expectedProvider,
  
  // 2. Importe dentro de tolerancia
  ABS([Importe] - movimientoImporte) <= (movimientoImporte * tolerancia%),
  
  // 3. Fecha dentro de ventana
  ABS(DAYS(movimientoFecha, [FechaFactura])) <= ventanaDías,
  
  // 4. Estado no duplicado/archivado
  [Estado] <> "ARCHIVADO"
)
```

### Paso 3: Seleccionar Mejor Coincidencia
```javascript
// Ranking por precisión:
// 1. Coincidencia exacta de importe (score +100)
// 2. Proximidad de fechas (score = 50 - abs(días_dif) * 2)
// 3. Coincidencia en descripción (score +20)

bestMatch = MAX(scores)

// Retornar nombre de factura del mejor match
// Si score < umbral mínimo (ej. 30) → vacío (sin sugerencia)
```

### Paso 4: Registrar Confianza
```
Confianza = Score / ScoreMáximo

HIGH (>80%): Sugerencia muy probable
MEDIUM (50-80%): Revisar
LOW (<50%): Rechazar sugerencia, requerir manual
```

---

## 📊 Métricas de Desempeño

Ver: [[Metricas_Punteo]]

| Métrica | Target | Actual |
|---------|--------|--------|
| **Tasa de sugerencias aceptadas** | >85% | ~70% |
| **Tasa de falsos positivos** | <5% | ~8% |
| **Movimientos sin sugerencia** | <15% | ~20% |
| **Tiempo de cálculo (por lote)** | <30s | ~45s |

---

## 🐛 Desafíos & Mejoras

### Challenge 1: Perfiles de Proveedores Incompletos
- **Problema**: No hay regla para ~15% de movimientos
- **Impacto**: Sin sugerencia automática
- **Solución**: Enriquecer PerfilProveedores iterativamente (ver [[H0_ControlHumano]])

### Challenge 2: Variaciones de Importe
- **Problema**: Factura €100 vs Movimiento €95 (descuentos, retenciones)
- **Actual**: Tolerancia ±5%, cubre mayoría
- **Mejora**: Análisis histórico por proveedor para ajustar tolerancia

### Challenge 3: Movimientos Duplicados
- **Problema**: Mismo movimiento 2x en BD_Banco por error de banco
- **Impacto**: Puede sugerir misma factura 2x
- **Solución**: Detección de duplicados en A1, flag en BD_Banco

### Challenge 4: Rendimiento con Volumen
- **Problema**: Fórmulas se lentifican con >10,000 filas
- **Actual**: ~45 segundos por cálculo
- **Futuro**: [[Propuestas_Mejora#C0_Optimización_Rendimiento]]

---

## 💡 Mejoras Propuestas

### Corto Plazo
1. **Mejorar PerfilProveedores**
   - Agregar regex patterns
   - Documentar tolerancias por proveedor
   
2. **Logging de Matching**
   - Columna oculta con score/confianza
   - Auditoría de por qué se sugirió X

### Mediano Plazo
1. **Machine Learning**
   - Entrenar modelo con historial de validaciones
   - Ajustar pesos de criterios automáticamente

2. **Integración Workflow**
   - n8n ejecuta C0 después de cada A2/B2
   - Notificaciones a H0 si hay nuevas sugerencias

### Largo Plazo
1. **OCR inteligente + IA**
   - Extraer datos de factura más precisamente
   - Mejor matching por descripción

2. **Reconciliación Triangular**
   - Validar también con datos contables
   - Detectar inconsistencias

---

## 🔗 Notas Relacionadas

- **Datos entrada**: [[A2_AsignacionDeGastos]] (movimientos), [[B2_Cebollón]] (facturas)
- **Control**: [[H0_ControlHumano]] (validación y correcciones)
- **Fórmulas**: [[Formulas_Google_Sheets#C0_Punteo]] (implementación)
- **Workflow**: [[wf_C0_PuntearFacturas]] (orquestación n8n)
- **Mejoras**: [[Propuestas_Mejora#C0_Matching_IA]]
- **KPIs**: [[Metricas_Punteo]]

---

**Última actualización**: 2026-09-10
**Estado**: Activo (pero con limitaciones)
**Impacto**: ⭐⭐⭐⭐⭐ (Crítico - core del sistema)
