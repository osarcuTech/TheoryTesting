---
title: Bases de Datos Principales
tags: [database, sheets, BD_Banco, BD_Facturas]
related: [[01_Arquitectura_General]], [[A1_ImportarMovimientos]], [[B2_Cebollón]], [[C0_PunteoFacturas]]
---

# Bases de Datos Principales

## 🗄️ BD_Banco — Base de Datos de Movimientos Bancarios

### Ubicación
- **Sheet ID**: `1sZeGfiuG7Ab9jx14_-oaQZTtrhIohlx5dhYoSgZCOuw`
- **Sheet Index**: `1089991841`
- **Nombre en Google Sheets**: "BD_Banco"

### Estructura de Columnas

| Col | Campo | Tipo | Origen | Descripción |
|-----|-------|------|--------|-------------|
| **A** | Fecha | String | A1 (Banco) | Fecha del movimiento (DD-MM-YYYY) |
| **B** | Fecha Valor | String | A1 (Banco) | Fecha valor (DD-MM-YYYY) |
| **C** | Movimiento | String | A1 (Banco) | Descripción del movimiento ("TRANSFERENCIA ABC", "SALARIO", etc.) |
| **D** | Más Datos | String | A1 (Banco) | Información adicional (referencia, concepto) |
| **E** | Importe | Number | A1 (Banco) | Cantidad en EUR (negativo si es gasto) |
| **F** | Saldo | Number | A1 (Banco) | Saldo de la cuenta post-movimiento |
| **G** | UID | String | A1 (Generada) | Identificador único: `Mov\|MasDatos\|Importe\|Saldo` |
| **H** | FechaImportacion | Date | A1 (Auto) | Fecha en que fue importado (hoy) |
| **I** | Estado | String | A1 (Auto) | "ACTIVO", "PROCESADO", "DUPLICADO" |

### Características

- **Cantidad de registros**: ~1,200-1,500 por mes
- **Retención**: Histórico completo desde inicio (2024)
- **Append-only**: Nunca se eliminan (solo marcar como DUPLICADO)
- **Índices**:
  - Primario: UID
  - Secundario: Fecha, Movimiento

### Consultas Típicas

```sql
-- Últimos movimientos del mes
SELECT * FROM BD_Banco
WHERE Fecha >= "2025-10-01" AND Fecha <= "2025-10-31"
ORDER BY Fecha DESC

-- Movimientos sin procesar
SELECT * FROM BD_Banco
WHERE Estado = "ACTIVO"
ORDER BY Fecha DESC

-- Detectar duplicados
SELECT Movimiento, Importe, COUNT(*)
FROM BD_Banco
GROUP BY Movimiento, Importe
HAVING COUNT(*) > 1
```

---

## 🗄️ BD_Facturas — Base de Datos de Facturas

### Ubicación
- **Sheet ID**: `1sZeGfiuG7Ab9jx14_-oaQZTtrhIohlx5dhYoSgZCOuw` (mismo que BD_Banco)
- **Sheet Index**: (diferente, TBD)
- **Nombre en Google Sheets**: "BD_Facturas"

### Estructura de Columnas

| Col | Campo | Tipo | Origen | Descripción |
|-----|-------|------|--------|-------------|
| **A** | FechaRecepcion | Date | B1 (Gmail) | Fecha en que se recibió correo |
| **B** | FechaFactura | Date | B2 (OCR) | Fecha en la factura |
| **C** | Proveedor | String | B2 (OCR) | Nombre normalizado del proveedor |
| **D** | NumFactura | String | B2 (OCR) | Número de factura ("F-2025-001", "INV-123", etc.) |
| **E** | Importe | Number | B2 (OCR) | Cantidad facturada en EUR |
| **F** | Moneda | String | B2 (OCR) | Divisa (EUR, USD, etc.) |
| **G** | UID | String | B2 (Generada) | Identificador único: `Proveedor\|NumFactura\|Importe` |
| **H** | Estado | String | H0/H1 (Manual) | "PROCESADA", "VALIDADA", "ARCHIVADO", "RECHAZADA" |
| **I** | FechaArchivo | Date | H1 (Auto) | Fecha en que fue archivada |
| **J** | UbicacionFinal | String | H1 (Auto) | Ruta en Drive: `/FacturasArchivadas/2025-10/PROVEEDOR/archivo.pdf` |
| **K** | Descripcion | String | B2 (OCR) | Concepto/Descripción de la factura |
| **L** | Confianza_OCR | Number | B2 (Auto) | % de confianza de OCR (0-100) |
| **M** | NombreArchivo | String | B2 (Auto) | Nombre normalizado: `YYYYMMDD_PROVEEDOR_NUMFAC.pdf` |
| **N** | Notas_H0 | String | H0 (Manual) | Observaciones del operador |
| **O** | Notas_H1 | String | H1 (Manual) | Observaciones del archivo |

### Características

- **Cantidad de registros**: ~800-900 por mes
- **Retención**: Histórico completo desde inicio
- **Status workflow**: Cada factura progresa a través de estados
- **Índices**:
  - Primario: UID
  - Secundario: Proveedor, FechaFactura, Estado

### Consultas Típicas

```sql
-- Facturas pendientes de archivo
SELECT * FROM BD_Facturas
WHERE Estado = "VALIDADA" AND FechaArchivo IS NULL
ORDER BY FechaRecepcion ASC

-- Facturas por proveedor (mes actual)
SELECT Proveedor, COUNT(*), SUM(Importe)
FROM BD_Facturas
WHERE FechaRecepcion >= "2025-10-01" AND FechaRecepcion <= "2025-10-31"
GROUP BY Proveedor
ORDER BY SUM(Importe) DESC

-- Facturas archivadas
SELECT * FROM BD_Facturas
WHERE Estado = "ARCHIVADO" AND FechaArchivo >= "2025-10-01"
ORDER BY FechaArchivo DESC

-- Facturas con baja confianza OCR
SELECT * FROM BD_Facturas
WHERE Confianza_OCR < 80
ORDER BY Confianza_OCR ASC
```

---

## 🗄️ Hojas Derivadas (Queries sobre BDs)

### Movimientos_cuenta

**Propósito**: Integrar datos bancarios + clasificación + matching

```sql
= QUERY(BD_Banco!A2:I, "select * LIMIT " & CONTARA(BD_Banco!A2:A))
```

**Uso**: 
- Agrupa información de movimiento bancario
- Muestra clasificación (A2)
- Muestra sugerencias de matching (C0)
- Interface para validación H0

**Columnas adicionales** (derivadas):
- Col J-M: Clasificación (A2)
- Col N-R: Matching y validación (C0 + H0)

### HistorialFacturas

**Propósito**: Integrar datos de facturas procesadas para matching

```sql
= QUERY(BD_Facturas!A2:O, "select * LIMIT " & CONTARA(BD_Facturas!A2:A))
```

**Filtro**: Solo facturas con Estado = "PROCESADA" o "VALIDADA"

**Uso**:
- Fuente para C0 en búsqueda de coincidencias
- Evita considerar facturas archivadas

### AsigCostes

**Propósito**: Tabla de reglas de clasificación (A2)

| Movimiento | MasDatos | Departamento | Naturaleza | Categoría |
|-----------|----------|--------------|-----------|-----------|
| TELEFONICA | * | Admin | Gasto Operativo | Servicios |
| AMAZON | * | Operaciones | Gasto Operativo | Suministros |
| SALARY | * | RRHH | Gasto Personal | Salarios |
| TRANSFER | * | Tesorería | Transferencia | Interna |

**Mantenimiento**: Manual por H0 según excepciones

### PerfilProveedores

**Propósito**: Tabla de reglas de matching (C0)

| Movimiento | ProvedorEsperado | ToleranciaImporte | VentanaFechas |
|-----------|-----------------|------------------|---------------|
| TELEFONICA | TELEFONICA | 5% | 30 |
| AMAZON | AMAZON | 10% | 45 |
| SALARY | RRHH INTERNO | 0% | 0 |

**Mantenimiento**: Automática por H0, enriquecida con experiencia

---

## 📊 Estadísticas de Volumen

### Por Mes (Promedio Octubre 2025)

```
BD_Banco:
  • Total movimientos: 1,247
  • Movimientos nuevos: 1,232 (98%)
  • Duplicados detectados: 15 (1%)
  • Tamaño aprox: 250 KB

BD_Facturas:
  • Total facturas: 856
  • Facturas procesadas: 845 (99%)
  • Facturas archivadas: 812 (95%)
  • Facturas pendientes: 33 (4%)
  • Tamaño aprox: 180 KB

Movimientos_cuenta (Query):
  • Filas activas: 1,247
  • Tamaño (incl. derivadas): ~450 KB
  • Tiempo de recalc: ~5 segundos

HistorialFacturas (Query):
  • Filas activas: ~600 (solo PROCESADA/VALIDADA)
  • Tamaño: ~150 KB
  • Tiempo de recalc: ~2 segundos
```

---

## 🔒 Consideraciones de Seguridad

### Permisos
- **Lectura**: Todos los equipos financieros
- **Escritura**:
  - A1, A2: Aplicación n8n (servicio)
  - B1, B2: Aplicación n8n (servicio)
  - H0, H1, H2: Operadores humanos autorizados
- **Administración**: Finance Manager solo

### Auditoría
- Todas las escrituras registradas en tabla de auditoría
- Timestamps automáticos de cambios
- Notas obligatorias de cambios manuales

### Backup & Recuperación
- Google Sheets mantiene 30 versiones históricas
- Backup semanal a Google Drive
- Disaster recovery plan: TBD

---

## 🔗 Notas Relacionadas

- [[A1_ImportarMovimientos]] - Cómo se completa BD_Banco
- [[B2_Cebollón]] - Cómo se completa BD_Facturas
- [[C0_PunteoFacturas]] - Cómo usa estas BDs
- [[H0_ControlHumano]] - Cómo actualiza estas BDs
- [[Formulas_Google_Sheets]] - Fórmulas que leen estas BDs

---

**Última actualización**: 2026-09-10
**Versión**: 3.1
