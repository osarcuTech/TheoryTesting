---
title: C0 — Punteo de Facturas (Matching Automático)
tags: [C0, punteo, matching, fórmulas, google-sheets]
component: C0
related: [[01_Arquitectura_General]], [[wf_C0_PuntearFacturas]], [[A2_AsignacionDeGastos]], [[B2_Cebollón]], [[H0_ControlHumano]], [[Metricas_Punteo]]
---

# C0 — Punteo de Facturas (Matching Automático)

## 🎯 Objetivo

Generar sugerencias automáticas de emparejamiento entre movimientos bancarios ([[A2_AsignacionDeGastos_Sheets_Arquitectura|clasificados en A2]]) y facturas ([[B2_Cebollón|procesadas en B2]]) utilizando lógica de matching inteligente.

El resultado es una columna "O" (Sugerencia) y "P" (Validación) que [[H0_ControlHumano|H0]] usa para conciliación.

---

## 📋 Descripción del Proceso

### Entrada
1. **Movimientos clasificados**: Hoja `Movimientos_cuenta_0087231` (desde A2.1)
   - Campos: Fecha, Movimiento, Más Datos, Importe, Departamento, etc.
2. **Facturas procesadas**: `HistorialFacturas` (desde B2)
   - Campos: Fecha Factura, Proveedor, Importe, Descripción, UID

### Lógica de Matching
Para cada movimiento bancario, C0 busca facturas coincidentes basándose en:

1. **Proveedor** (PerfilProveedores)
   - Tabla que mapea "Movimiento"/"Más datos" bancario → "Proveedor" esperado
   - Ejemplo: "TELEFONICA" → Proveedor "TELEFONICA"

2. **Importe** (tolerancia)
   - Coincidencia exacta O no en función de lo establecido en [[N€Caixa-PProveedores]]

3. **Fecha** (ventana temporal)
   - Factura debe estar dentro de X días del movimiento en función de lo establecido en [[N€Caixa-PProveedores]]

### Salida
- **Columna O (Sugerencia)**: Nombre factura sugerida (o vacío)
- **Columna P (Validación)**: Checkbox de aceptación manual por H0
- **Columna Q (Override manual)**: Campo para ingreso manual si sugerencia es incorrecta

---

## 🔄 Fórmulas en Google Sheets

Ubicación: [[N€Caixa-Movimientos_cuenta_0087231|H]], [[N€Caixa-Movimientos_cuenta_0087231|O]], [[N€Caixa-Movimientos_cuenta_0087231|P]], [[N€Caixa-Movimientos_cuenta_0087231|Q]]


## 🐛 Desafíos & Mejoras

### Challenge 1: Rendimiento con Volumen
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

- **Datos entrada**: [[A2_AsignacionDeGastos_Sheets_Arquitectura]] (movimientos), [[B2_Cebollón]] (facturas)
- **Control**: [[H0_ControlHumano]] (validación y correcciones)
- **Fórmulas**: [[Formulas_Google_Sheets#C0_Punteo]] (implementación)
- **Workflow**: [[wf_C0_PuntearFacturas_context]] (orquestación n8n)
- **Mejoras**: [[Propuestas_Mejora#C0_Matching_IA]]

---

**Última actualización**: 2026-09-10
**Estado**: Activo (pero con limitaciones)
**Impacto**: ⭐⭐⭐⭐⭐ (Crítico - core del sistema)
