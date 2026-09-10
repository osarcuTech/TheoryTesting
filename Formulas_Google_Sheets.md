---
title: Fórmulas Google Sheets — Referencia
tags: [fórmulas, google-sheets, LET, QUERY, ARRAYFORMULA, UID]
related: [[C0_PunteoFacturas]], [[A2_AsignacionDeGastos]], [[03_BDs_Principales]], [[A1_ImportarMovimientos_Implementacion]]
---

# Fórmulas Google Sheets — Referencia

## 📌 Fórmulas Principales

### LastRow — Identificar Última Fila

**Propósito**: Crear rangos dinámicos que se adapten al crecimiento de datos

**Ubicación**: Celda interna en cada hoja (ej: `C2` en una hoja oculta)

```
=LET(
  nombreHoja, A2,
  columnaControl, B2,
  rangoHoja, INDIRECTO(nombreHoja&"!"&columnaControl&":"&columnaControl),
  lastRow, CONTARA(rangoHoja),
  lastRow
)
```

**Entrada**:
- `A2`: Nombre de hoja (ej: "BD_Banco")
- `B2`: Columna de control (ej: "A" - Fecha)

**Salida**: Número de última fila con datos

**Ejemplo de uso**: `INDIRECTO("BD_Banco!A2:A"&LastRow_MovimBanco)`

---

### C0 — Punteo de Facturas (Matching Automático)

**Ubicación**: Hoja `Movimientos_cuenta`, Columna O (Sugerencia)

#### Columna O: Sugerencia Automática

```javascript
=LET(
  movimiento, C2,
  masDatos, D2,
  importe, E2,
  fecha, A2,
  
  // Rangos de datos
  perfilProv, INDIRECTO("PerfilProveedores!A:D"),
  historialFras, INDIRECTO("HistorialFacturas!A:F"),
  
  // Paso 1: Buscar proveedor esperado en PerfilProveedores
  proveedorEsperado, VLOOKUP(movimiento, perfilProv, 2, FALSE),
  
  // Paso 2: Filtrar candidatas por proveedor, importe, fecha
  candidatas, FILTER(
    historialFras,
    (INDEX(historialFras,0,3) = proveedorEsperado) AND
    (ABS(INDEX(historialFras,0,5) - importe) / importe < 0.05) AND
    (ABS(DAYS(fecha, INDEX(historialFras,0,2))) <= 30) AND
    (INDEX(historialFras,0,8) <> "ARCHIVADO")
  ),
  
  // Paso 3: Seleccionar mejor coincidencia (primera)
  mejorCoincidencia, IF(COUNTA(candidatas)>0, INDEX(candidatas, 1, 4), NA()),
  
  // Retornar nombre de factura o vacío
  SI(ISNA(mejorCoincidencia), "", mejorCoincidencia)
)
```

**Columnas esperadas en HistorialFacturas**:
- Col A: FechaRecepcion
- Col 2: FechaFactura
- Col 3: Proveedor
- Col 4: NumFactura (← RETORNA ESTO)
- Col 5: Importe
- Col 8: Estado

#### Columna P: Validación Manual

```
=SI(O2<>"", FALSO, NA())
```

Operador H0 cambia a VERDADERO si acepta sugerencia

#### Columna Q: Override Manual

```
=SI(P2=VERDADERO, O2, SI(Q2<>"", Q2, ""))
```

Si validado (P=TRUE) usa O, si no usa override manual en Q

---

### A2 — Clasificación de Gastos

**Ubicación**: Hoja `Movimientos_cuenta`, Columnas I-M (Clasificación)

#### Columna I: Cashflow In/Out

```javascript
=LET(
  movimiento, C2,
  masDatos, D2,
  
  // Tabla de reglas
  tablaAsigCostes, INDIRECTO("AsigCostes!A2:E"&lr_AsigCostes),
  
  // Buscar coincidencia
  resultado, FILTER(
    tablaAsigCostes,
    (INDEX(tablaAsigCostes,0,1) = movimiento) OR
    (SEARCH(INDEX(tablaAsigCostes,0,1), movimiento) > 0),
    (INDEX(tablaAsigCostes,0,2) = "*" OR INDEX(tablaAsigCostes,0,2) = masDatos)
  ),
  
  // Retornar Departamento
  SI(COUNTA(resultado)>0, INDEX(resultado, 1, 3), "REVISAR")
)
```

---

### Query Dinámicas

#### HistorialFacturas (desde BD_Facturas)

**Ubicación**: Hoja `HistorialFacturas`

```sql
=QUERY(
  BD_Facturas!A:O,
  "SELECT * 
   WHERE H IN ('PROCESADA', 'VALIDADA', 'ARCHIVADO')
   ORDER BY A DESC",
  1
)
```

#### Movimientos_cuenta (desde BD_Banco)

**Ubicación**: Hoja `Movimientos_cuenta`

```sql
=QUERY(
  BD_Banco!A:I,
  "SELECT * 
   WHERE I IN ('ACTIVO', 'PROCESADO')
   ORDER BY A DESC",
  1
)
```

---

### Generación de UID (Identificadores Únicos)

#### UID para Movimientos Bancarios (A1)

```javascript
=CONCATENATE(C2, "|", D2, "|", E2, "|", F2)
```

Resultado: `"TRANSFER ABC|REF001|1500.50|45000.00"`

**Propósito**: Detectar duplicados en importación

#### UID para Facturas (B2)

```javascript
=CONCATENATE(C2, "|", D2, "|", E2)
```

Resultado: `"TELEFONICA|F-2025-001|1500.00"`

**Propósito**: Matching con movimientos

---

## 🔧 Funciones Auxiliares

### SEARCH (Búsqueda de Patrón)

```javascript
=ISNUMBER(SEARCH("patrón", celda))
// Retorna TRUE si "patrón" encontrado en celda
// Case-insensitive

// Uso en A2:
IF(ISNUMBER(SEARCH("AMAZON", C2)), "AMAZON", "OTRO")
```

### DAYS (Diferencia de Días)

```javascript
=DAYS(fecha1, fecha2)
// Retorna número de días entre dos fechas

// Uso en C0:
IF(ABS(DAYS(A2, fecha_factura)) <= 30, "OK", "RECHAZAR")
```

### VLOOKUP (Búsqueda Vertical)

```javascript
=VLOOKUP(búsqueda, tabla, columna, [rango_exacto])

// Ejemplo en C0:
=VLOOKUP(C2, PerfilProveedores!A:D, 2, FALSE)
// Busca movimiento (C2) en PerfilProveedores, retorna col 2 (Proveedor)
```

### FILTER (Filtrado Dinámico)

```javascript
=FILTER(rango, criterio1, [criterio2], ...)

// Ejemplo en C0:
=FILTER(
  HistorialFacturas!A:F,
  HistorialFacturas!C = proveedor,
  HistorialFacturas!E >= importe*0.95,
  HistorialFacturas!E <= importe*1.05
)
```

### INDEX + MATCH (Búsqueda Flexible)

```javascript
=INDEX(rango_retorno, MATCH(búsqueda, rango_búsqueda, 0))

// Alternativa a VLOOKUP con más flexibilidad
```

---

## 📊 Fórmulas de Agregación

### Suma Condicional

```javascript
=SUMIF(rango_criterio, criterio, [rango_suma])

// Ejemplo: Suma de movimientos por departamento
=SUMIF(
  Movimientos_cuenta!J:J, "Operaciones",
  Movimientos_cuenta!E:E
)
```

### Conteo Condicional

```javascript
=COUNTIF(rango, criterio)

// Ejemplo: Contar facturas por proveedor
=COUNTIF(HistorialFacturas!C:C, "TELEFONICA")
```

### Media Condicional

```javascript
=AVERAGEIF(rango_criterio, criterio, [rango_promedio])

// Ejemplo: Importe promedio de movimientos clasificados
=AVERAGEIF(
  Movimientos_cuenta!I:I, "Admin",
  Movimientos_cuenta!E:E
)
```

---

## 🎯 Patrones de Diseño

### Patrón LET para Fórmulas Complejas

```javascript
=LET(
  var1, expresión1,
  var2, expresión2,
  var3, función(var1, var2),
  var3  // retorna var3
)

// Ventajas:
// - Variables nombradas (legibilidad)
// - Evita repeticiones (eficiencia)
// - Mejor debugging
```

### Patrón ARRAYFORMULA para Aplicar a Toda Columna

```javascript
=ARRAYFORMULA(
  IF(A2:A="", "", función(A2:A))
)

// Aplica IF a toda columna A sin copiar fórmula en cada fila
```

### Patrón IFERROR para Manejo de Errores

```javascript
=IFERROR(fórmula_principal, valor_por_defecto)

// Ejemplo:
=IFERROR(
  VLOOKUP(C2, PerfilProveedores!A:D, 2, FALSE),
  "NO ENCONTRADO"
)
```

---

## ⚙️ Optimización de Rendimiento

### Problemas Comunes

1. **Fórmulas Lentas**: Si spreadsheet tarda >30s en recalcular
   - Causa: QUERY con datos muy grandes o FILTER con muchas condiciones
   - Solución: Limitar datos a mes actual, usar VLOOKUP en lugar de FILTER

2. **Circular References**: Si Google Sheets muestra error
   - Causa: Fórmula que se refiere a sí misma
   - Solución: Usar hojas separadas para entrada y cálculo

3. **Memory Exhaustion**: Si hay demasiadas fórmulas
   - Causa: Derivar demasiadas columnas en hojas queries
   - Solución: Consolidar en pocas columnas, calcular bajo demanda

### Tips de Optimización

```javascript
// ❌ LENTO: FILTER + QUERY
=FILTER(QUERY(BD_Banco!A:F, "select *"), INDEX(BD_Banco!A:A,0)="2025-10")

// ✅ RÁPIDO: Usar WHERE en QUERY
=QUERY(BD_Banco!A:F, "select * where A contains '2025-10'")

// ❌ LENTO: Múltiples VLOOKUP en misma fila
=VLOOKUP(C2, T1, 2) + VLOOKUP(C2, T2, 2) + VLOOKUP(C2, T3, 2)

// ✅ RÁPIDO: Consolidar tabla, un VLOOKUP
=VLOOKUP(C2, TablaCombinada!A:F, 2)
```

---

## 🔗 Referencias

- [[C0_PunteoFacturas]] - Uso de fórmula C0 (matching)
- [[A2_AsignacionDeGastos]] - Uso de fórmula A2 (clasificación)
- [[03_BDs_Principales]] - Estructura de datos para fórmulas
- [Google Sheets Function List](https://support.google.com/docs/table/25273) - Documentación oficial

---

**Última actualización**: 2026-09-10
**Versión**: 3.1
