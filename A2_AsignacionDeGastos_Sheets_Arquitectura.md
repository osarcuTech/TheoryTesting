---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos, n8n]
component: A2
related: [[01_Arquitectura_General]], [[wf_A2_AsignacionDeGastos]], [[A1_ImportarMovimientos_WF(deprecado)]], [[C0_PunteoFacturas]], [[Metricas_Asignacion]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Clasificar automáticamente cada movimiento bancario según usando reglas de matching basadas en patrones de texto del movimiento.

---

## 📋 Descripción del Proceso

### Entrada
- **Fuente**: Movimientos nuevos en BD_Banco (trigger desde A1)
- **Datos base**: Tabla `Form_AsigCostes` con reglas de clasificación y `AsigCostes` con el historico.

### Procesamiento
1. **A2.0.0: Lectura** de [[N€Caixa-Movimientos_cuenta_0087231|J]] `DescripccionMovimiento` 
2. **A2.0.1: Búsqueda** de patrones en tabla `AsigCostes` por parte de 
3. **A2.0.2: Matching automatico/AsignaciónManual** : [[N€Caixa-Form_AsigCostes]]
4. **A2.1: Actualización** [[N€Caixa-_AsigCostes]], [[N€Caixa-Movimientos_cuenta_0087231]]
4. **A2.2: Actualización** [[N€Caixa-PProveedores]]

### Salida
- Movimientos clasificados según `Cashflow in/out`  y `Cashflow category`
- Movimientos no clasificados marcados para [[H0_ControlHumano|H0 (intervención manual)]] `A2.0.2`
- Trigger automático de [[C0_PunteoFacturas|C0]] para punteo

---


### Salida

**Columnas en Movimientos_cuenta**:
```
K: CF in/out (Entrada/Salida en Cashflow)
L: CF category (Descriptor Extra)
```

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

## 🐛 Desafíos & Limitaciones

### Ambigüedad de Patrones
- **Problema**: Un movimiento puede coincidir con múltiples reglas
- **Actual**: Usa la primera coincidencia en orden de tabla
- **Solución**: Definir prioridades explícitas por regla

### Datos Inconsistentes
- **Problema**: Mismo proveedor con variaciones en nombre
  - "AMAZON EU" vs "AMAZON.ES" vs "AMAZON PAYMENT"
- **Actual**: Requiere múltiples reglas
- **Solución**: Normalizar nombres antes de matching ([[Propuestas_Mejora#A2_Normalización]]). No interesa y que pueden ser proveedores distintos bajo nombres parecidos.

## 🔗 Notas Relacionadas

- **Anterior**: [[A1_ImportarMovimientos_WF(deprecado)]] (importación)
- **Siguiente**: [[C0_PunteoFacturas]] (matching factura-movimiento)
- **Control**: [[H0_ControlHumano]] (intervención manual)
- **Datos base**: [[03_BDs_Principales#AsigCostes]]
- **Workflow**: [[wf_A2_AsignacionDeGastos]] (detalles n8n)
- **Mejoras**: [[Propuestas_Mejora#A2_Optimizaciones]]

---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
