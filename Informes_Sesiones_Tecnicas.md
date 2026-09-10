---
title: Informes de Sesiones Técnicas — Debugging & Optimización
tags: [debugging, optimización, performance, sesiones-técnicas, google-apps-script]
related: [[A1_ImportarMovimientos_Implementacion]], [[H1_ArchivoRegistro_Implementacion]], [[ConstantesGlobales]], [[Scripts_GoogleAppsScript_Referencia]]
source: workflows/CaixaB$-Scripts/AppScripts/ArchivarMovimientos/
---

# Informes de Sesiones Técnicas

## 📌 Objetivo

Centralizar y vincular informes técnicos de debugging, optimización y sesiones de análisis. Estos documentos contienen información valiosa para entender problemas de performance y decisiones de arquitectura.

---

## 📂 Informes Disponibles

### 1. Informe_Sesion_OptimizacionCargaGlobal_2026-09-02.md

**Fecha**: 2 de septiembre de 2026
**Tema**: Aislamiento de llamadas API y carga perezosa de variables globales
**Continúa**: Hilo del informe del 21/07/2026 (`Informe_Sesion_ProcesarLoteBancos_2026-07-21`)

#### 🔍 Problema Identificado

**Hipótesis del usuario**: Al ejecutar una función de un archivo `.gs`, Google Apps Script evalúa el código de nivel superior de **todos los archivos del proyecto**, aunque no estén involucrados, causando llamadas API redundantes.

**Conclusión**: ✅ **La hipótesis se confirma**

#### 📊 Hallazgo Concreto

**Archivo**: `ConstantesGlobales.gs` tiene triple `openById()` redundante

```javascript
// ❌ PROBLEMA ACTUAL
const ss = SpreadsheetApp.openById(ss_id);                              // Llamada 1
const sheetBDB = SpreadsheetApp.openById(ss_id).getSheetById(gid_BDB);  // Llamada 2 (REPETIDA)
const sheet_Mov = SpreadsheetApp.openById(ss_id).getSheetById(gid_Mov); // Llamada 3 (REPETIDA)
const totalColsBDB = sheetBDB.getLastColumn();                          // Llamada 4
```

**Impacto**:
- `openById()` es llamada cara (abre archivo completo): **~30 segundos**
- Se ejecuta 3 veces innecesariamente: **~90 segundos de overhead**
- Ocurre en CADA ejecución de cualquier script del proyecto

#### ✅ Solución Propuesta: Lazy Loading

```javascript
// ✅ RECOMENDADO
let _ss = null;

function getSpreadsheet() {
  if (!_ss) {
    _ss = SpreadsheetApp.openById(ss_id);
  }
  return _ss;
}

function getSheetBDB() {
  return getSpreadsheet().getSheetById(gid_BDB);
}

function getSheetMov() {
  return getSpreadsheet().getSheetById(gid_Mov);
}
```

**Ventaja**: Solo 1 llamada `openById()` por ejecución (caché)

**Beneficio esperado**: 45x más rápido (~2 seg vs ~90 seg)

#### 📋 Problema Adicional

También existe **código muerto de nivel superior** en `appendBD.gs`:

```javascript
let sheetBDB_Range = sheetBDB.getRange(1,1,sheetBDB.getLastRow(),sheetBDB.getLastColumn()).getValues()
// Se ejecuta SIEMPRE, aunque no lo uses
```

**Solución**: Mover dentro de función `getMovimientosBancarios()`

---

### 2. informesSesionClaude.md

**Tipo**: Historial de sesiones
**Contenido**: Múltiples análisis de Claude sobre:
- Scripts de importación bancaria
- Optimización de procesamiento
- Debugging de fallos

**Referencia**: Consultar para contexto histórico de decisiones

**Ubicación**: `workflows/CaixaB$-Scripts/AppScripts/ArchivarMovimientos/informesSesionClaude.md`

---

### 3. resumenGeminiScriptArchivado.md

**Tipo**: Resumen de análisis
**Herramienta**: Gemini AI (complementa análisis de Claude)
**Contenido**: Resumen de optimizaciones identificadas en script de archivado

**Referencia**: Validación independiente de decisiones técnicas

---

## 🔍 Tema Central: Rendimiento en Google Apps Script

### Problema Raíz

```
Apps Script cargar SIEMPRE el código de nivel superior de:
├─ ConstantesGlobales.gs
├─ importarMovimientos.gs  
├─ ArchivarMovimientos.gs
├─ Otros scripts...
└─ AUNQUE solo ejecutes 1 función

Resultado: Llamadas API innecesarias en cada ejecución
```

### Arquitectura Actual (Problemática)

```
Tiempo fijo por ejecución: ~90 segundos
├─ 3x openById() redundantes
├─ Código muerto ejecutándose
├─ Variables globales sin lazy loading
└─ getRange().getValues() de tablas completas

Tiempo de procesamiento: Variable (depende de datos)
```

### Arquitectura Propuesta (Optimizada)

```
Tiempo fijo por ejecución: ~2 segundos  (45x menos)
├─ 1x openById() con caché
├─ Código muerto eliminado
├─ Lazy loading de getters
└─ getRange() solo cuando sea necesario

Tiempo de procesamiento: Variable (igual)
```

---

## 📋 Impacto en Componentes

### A1 — Importación Bancaria

**Afectado por**: Triple `openById()` en ConstantesGlobales

**Mejora esperada**:
- Actual: 6 seg procesamiento + 90 seg overhead = 96 seg total
- Optimizado: 6 seg procesamiento + 2 seg overhead = 8 seg total
- **Mejora: 12x más rápido**

**Acción**: Aplicar lazy loading en ConstantesGlobales (ver [[ConstantesGlobales#solución-lazy-loading]])

### H1 — Archivado de Movimientos

**Afectado por**: LockService esperando a que termine A1

**Mejora esperada**:
- Actual: Espera 96 seg a que A1 libere lock
- Optimizado: Espera 8 seg a que A1 libere lock
- **Mejora: 12x más rápido**

**Acción**: Completar optimización del script (estado BORRADOR)

---

## 🎯 Checklist de Implementación

- [ ] **Paso 1**: Reescribir ConstantesGlobales.gs con lazy loading
  - [ ] Crear getters para Spreadsheet
  - [ ] Crear getters para Sheets (BDB, Mov)
  - [ ] Eliminar código de nivel superior
  - [ ] Test: Verificar que rendimiento baja <5 seg

- [ ] **Paso 2**: Optimizar appendBD.gs
  - [ ] Mover variables de nivel superior dentro de función
  - [ ] Eliminar getRange() innecesarios
  - [ ] Test: Verificar importación sigue funcionando

- [ ] **Paso 3**: Optimizar ArchivarMovimientos.gs
  - [ ] Completar migraciones pendientes (BORRADOR)
  - [ ] Aplicar lazy loading
  - [ ] Test: Verificar archivado sigue funcionando

- [ ] **Paso 4**: Validar mejora
  - [ ] Medir overhead antes/después
  - [ ] Actualizar [[KPIs_Sistema]] con nuevos benchmarks
  - [ ] Documentar en [[Propuestas_Mejora]] como ✅ Completado

---

## 🔗 Vinculación a Documentación

### Problemas Identificados → Soluciones Documentadas

| Problema | Ubicado en | Solución | Referencia |
|----------|-----------|----------|-----------|
| Triple openById | ConstantesGlobales.gs | Lazy loading | [[ConstantesGlobales#solución-lazy-loading]] |
| Código muerto A1 | appendBD.gs | Mover dentro función | [[A1_ImportarMovimientos_Implementacion]] |
| Scripts sin optimizar | ArchivarMovimientos.gs | Completar BORRADOR | [[H1_ArchivoRegistro_Implementacion]] |
| Rendimiento bajo | Todos | Aplicar cambios | [[Metricas_Detalladas#kpi-de-rendimiento-global]] |

---

## 📊 Impacto Estimado

### Performance

| Métrica | Actual | Optimizado | Mejora |
|---------|--------|-----------|--------|
| Overhead fijo | ~90 seg | ~2 seg | 45x |
| A1 total | ~96 seg | ~8 seg | 12x |
| H1 total | ~110 seg | ~20 seg | 5.5x |
| N8n throughput | 6-8 paquetes/hora | 50-80 paquetes/hora | 8x |

### Negocio

- **Tiempo de ciclo**: 15-20 días → 2-3 días (7x más rápido)
- **Capacidad**: 6-8 bancos → 50-80 bancos simultáneos
- **Costo**: Libre (optimización de código)

---

## 🚀 Próximos Pasos

### Prioritario (Critical Path)

1. ✅ Documentar problemas (completado en este informe)
2. ⏳ Implementar lazy loading en ConstantesGlobales
3. ⏳ Validar que A1 sigue funcionando
4. ⏳ Medir impacto
5. ⏳ Aplicar a H1

### Secundario

- Aplicar a otros scripts (si los hay)
- Documentar patrón en guía de estilos GAS
- Entrenar equipo en lazy loading

---

## 📚 Referencias Completas

### Archivos Fuente (Sin vincular a Obsidian aún)

```
workflows/CaixaB$-Scripts/AppScripts/
├── Informe_Sesion_OptimizacionCargaGlobal_2026-09-02.md ← ESTE
├── informesSesionClaude.md
├── resumenGeminiScriptArchivado.md
├── ConstantesGlobales.gs
├── ImportarMovimientos/
│   ├── importarMovimientos.gs
│   └── importarMovimientosV2.gs
└── ArchivarMovimientos/
    └── ArxivarMovimientos.gs
```

### Documentación Obsidian Relacionada

- [[ConstantesGlobales]] → Documentación de variables globales (incluye solución lazy loading)
- [[A1_ImportarMovimientos_Implementacion]] → Rendimiento de A1
- [[H1_ArchivoRegistro_Implementacion]] → Rendimiento de H1
- [[Scripts_GoogleAppsScript_Referencia]] → Índice de scripts
- [[Metricas_Detalladas]] → KPIs de performance
- [[Propuestas_Mejora]] → Roadmap de optimizaciones

---

## 💡 Lecciones Aprendidas

1. **En Google Apps Script, todo código de nivel superior se ejecuta siempre**
   - Coste oculto importante
   - Lazy loading es esencial en código productivo

2. **LockService resuelve concurrencia pero es sintoma de bottleneck**
   - Si scripts esperan mucho, revisar performance
   - Optimización upstream reduce congestión

3. **Documentación de sesiones es valiosa**
   - Permite traceability de decisiones
   - Facilita onboarding de nuevo equipo

---

**Última actualización**: 2026-09-10
**Estado**: 📌 Prioritario para implementar
**Responsable**: DevOps / Google Apps Script
**Frecuencia de revisión**: Post-implementación de optimizaciones
**Impacto estimado**: 12x mejora en performance
