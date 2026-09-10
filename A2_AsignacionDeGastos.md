---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos, n8n]
component: A2
related: [[01_Arquitectura_General]], [[wf_A2_AsignacionDeGastos]], [[A1_ImportarMovimientos]], [[C0_PunteoFacturas]], [[Metricas_Asignacion]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Clasificar automáticamente cada movimiento bancario según:
- **Departamento** (Ventas, Operaciones, Admin, etc.)
- **Naturaleza** (Gasto operativo, Inversión, etc.)
- **Categoría** (Servicios, Suministros, etc.)

usando reglas de matching basadas en patrones de texto del movimiento.

---

## 📋 Descripción del Proceso

### Entrada
- **Fuente**: Movimientos nuevos en BD_Banco (trigger desde A1)
- **Datos base**: Tabla `AsigCostes` con reglas de clasificación
- **Formato**: Movimiento + Más Datos

### Procesamiento
1. **Lectura** de movimientos recientes en BD_Banco
2. **Búsqueda** de patrones en tabla `AsigCostes`
3. **Matching** usando campos:
   - Movimiento exacto o patrón
   - Más Datos (descriptor adicional)
4. **Asignación** automática de:
   - Departamento
   - Naturaleza
   - Categoría
5. **Actualización** en hoja `Movimientos_cuenta` (columnas I y siguientes)

### Salida
- Movimientos clasificados con campos I (Cashflow in/out) y derivados
- Movimientos no clasificados marcados para [[H0_ControlHumano|H0 (intervención manual)]]
- Trigger automático de [[C0_PunteoFacturas|C0]] para punteo

---

## 🔄 Flujo en n8n

Workflow: [[wf_A2_AsignacionDeGastos]]

### Datos de Entrada

**Tabla AsigCostes** (Reglas de clasificación):
```
| Movimiento | Más Datos | Departamento | Naturaleza | Categoría |
|------------|-----------|--------------|-----------|-----------|
| "TELEFONICA" | "INVOICE" | Admin | Gasto Operativo | Servicios |
| "AMAZON" | "*" | Operaciones | Gasto Operativo | Suministros |
| "SALARY" | "*" | RRHH | Gasto de Personal | Salarios |
```

**Movimientos a clasificar** (desde BD_Banco):
```
| Fecha | Movimiento | Más Datos | Importe |
|-------|-----------|----------|---------|
| 2025-10-01 | TELEFONICA | INV-2025-001 | 150.00 |
| 2025-10-02 | AMAZON | ORDER123456 | 500.00 |
```

### Salida

**Columnas en Movimientos_cuenta**:
```
I: CF in/out (Entrada/Salida en Cashflow)
J: Departamento (asignado)
K: Naturaleza (asignado)
L: Categoría (asignado)
M: Subcategoría (opcional)
```

---

## 🔧 Lógica de Matching

### Estrategia Actual

```javascript
// Pseudocódigo
FOR cada movimiento en BD_Banco {
  FOR cada regla en AsigCostes {
    IF (movimiento.Movimiento CONTAINS regla.Movimiento OR 
        movimiento.Movimiento EXACT regla.Movimiento) AND
       (regla.MasDatos == "*" OR 
        movimiento.MasDatos CONTAINS regla.MasDatos) {
      
      ASSIGN(Departamento, Naturaleza, Categoría)
      BREAK
    }
  }
  
  IF no match encontrado {
    MARK como "intervención manual requerida"
  }
}
```

### Órdenes de Prioridad
1. **Exact match** en Movimiento + Más Datos específico
2. **Partial match** en Movimiento + comodín (*)
3. **Pattern match** con regex (si está configurado)
4. **Sin match**: Pendiente para H0

---

## 📊 Datos Relacionados

### Tabla AsigCostes
- **Ubicación**: Hoja `AsigCostes` en Google Sheets
- **Estructura**:
  - Columna A: Patrón de Movimiento
  - Columna B: Filtro de Más Datos
  - Columnas C-E: Clasificación (Depto, Naturaleza, Categoría)
- **Mantenimiento**: Actualizada manualmente o por [[H0_ControlHumano|H0]]

### Tabla Movimientos_cuenta
- **Ubicación**: Hoja `Movimientos_cuenta` (Query sobre BD_Banco)
- **Columnas resultantes**:
  - A-F: Datos bancarios (desde BD_Banco)
  - G-H: Derivados (NombreFactura, Hash, etc.)
  - I-M: Clasificación (A2 output)

---

## ⚙️ Configuración

### Workflow n8n
- **Trigger**: Cambio en BD_Banco o ejecución manual desde [[A1_ImportarMovimientos|A1]]
- **Rango procesado**: Últimas N filas sin clasificar
- **Destino**: Escritura en Movimientos_cuenta columnas I-M

### Reglas Especiales
- **Wildcards**: `*` en Más Datos = cualquier valor
- **Regex**: Si la regla comienza con `/` se usa como expresión regular
- **Case-sensitive**: Por defecto NO (busca case-insensitive)

---

## 🐛 Desafíos & Limitaciones

### Ambigüedad de Patrones
- **Problema**: Un movimiento puede coincidir con múltiples reglas
- **Actual**: Usa la primera coincidencia en orden de tabla
- **Solución**: Definir prioridades explícitas por regla

### Datos Inconsistentes
- **Problema**: Mismo proveedor con variaciones en nombre
  - "AMAZON EU" vs "AMAZON.ES" vs "AMAZON PAYMENT"
- **Actual**: Requiere múltiples reglas
- **Solución**: Normalizar nombres antes de matching ([[Propuestas_Mejora#A2_Normalización]])

### Tasa de Intervención Manual
- **Actual**: ~15-20% de movimientos requieren H0
- **Objetivo**: Reducir a <5%
- **Estrategia**: Enriquecer tabla AsigCostes y usar [[Propuestas_Mejora#Machine_Learning|ML]]

---

## 📊 Métricas & KPIs

Ver: [[Metricas_Asignacion]]

- **Cobertura de asignación automática**: % movimientos clasificados sin intervención
- **Tasa de intervención manual**: % movimientos requieren H0
- **Tasa de excepciones por proveedor**: ¿Qué proveedores generan más errores?
- **Tiempo de proceso**: Segundos por lote de movimientos

---

## 🔗 Notas Relacionadas

- **Anterior**: [[A1_ImportarMovimientos]] (importación)
- **Siguiente**: [[C0_PunteoFacturas]] (matching factura-movimiento)
- **Control**: [[H0_ControlHumano]] (intervención manual)
- **Datos base**: [[03_BDs_Principales#AsigCostes]]
- **Workflow**: [[wf_A2_AsignacionDeGastos]] (detalles n8n)
- **Mejoras**: [[Propuestas_Mejora#A2_Optimizaciones]]

---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
