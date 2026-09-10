---
title: H1 — Implementación Técnica en Google Apps Script
tags: [H1, implementación, google-apps-script, archivado, idempotencia, volcado-atómico]
component: H1
related: [[H1_ArchivoRegistro]], [[Formulas_Google_Sheets]], [[ConstantesGlobales]], [[Metricas_Detalladas]]
source: workflows/CaixaB$-Scripts/AppScripts/ArchivarMovimientos/ArxivarMovimientos.gs
---

# H1 — Implementación Técnica

## 🎯 Propósito

Este documento detalla cómo se implementa el componente H1 (Archivar Movimientos) usando Google Apps Script. Vincula el código técnico con la documentación conceptual de [[H1_ArchivoRegistro]].

---

## 📂 Archivos de Referencia

| Archivo | Propósito |
|---------|-----------|
| `ArxivarMovimientos.gs` | Script principal de archivado (estado: BORRADOR) |
| `ConstantesGlobales.gs` | Variables globales compartidas |
| `documentacion.md` | Documentación técnica suelta (sin vinculo Obsidian) |

**Estado**: ⚠️ **BORRADOR** — Pendiente de completar migraciones

---

## 🔄 Arquitectura: Estática + Atómica + Idempotente + Restauración

### Principios de Diseño

```
1️⃣ ESTÁTICA: Datos se mueven como bloques completos (no celdas individuales)
2️⃣ ATÓMICA: O todo se guarda o nada (no estados intermedios)
3️⃣ IDEMPOTENTE: Si falla a mitad, se puede reintentar sin duplicar
4️⃣ RESTAURACIÓN: Después de borrar filas, se restituyen fórmulas en nuevas filas
```

---

## 📋 Flujo de Ejecución

### Trigger

```javascript
function onEditInstalable(e) {
  if (!e) return;
  
  // Detecta cambio en columna V (Mov_BD) fila 2 = TRUE
  if (
    e.range.getSheet().getSheetId() == gid_Mov &&    
    e.range.getColumn() == Mov_BD &&  
    e.range.getRow() == 2 &&
    e.value == "TRUE"
  ) {
    procesarLoteBancos(sheet_Mov)
  }
}
```

**Activación**:
- Usuario marca checkbox en columna V (BD) = TRUE
- Script `procesarLoteBancos()` se ejecuta automáticamente
- Procesa fila 2 y consecutivas con TRUE (máximo 50)

**⚠️ Nota Importante**: 
- Trigger debe llamarse `onEditInstalable` (NO `onEdit`)
- `onEdit` es reservado por GAS y causaría doble ejecución

### Paso 0: Evaluar Reanudación (Idempotencia)

```javascript
const lock = LockService.getDocumentLock();
if (!lock.tryLock(10000)) {
  Logger.log("ABORTADO: otra ejecución en curso.");
  return;
}

try {
  const lastRow = sheet_Mov.getLastRow();
  if (lastRow < 2) return;
  
  // Evaluar si script falló a mitad (entre volcado en BD y borrado)
  const revIf_UidMov_Preprocesada = String(sheet_Mov.getRange(2, Mov_DEF_UID).getValue()).trim();
  
  if (revIf_UidMov_Preprocesada) {
    const mapa_DEF_UidsBDB = obtenerMapaFilasBDB(sheetBDB, BDB_DEF_UID);
    const filaMatchUids_Reviewed = mapa_DEF_UidsBDB.get(revIf_UidMov_Preprocesada);
    
    if (filaMatchUids_Reviewed) {
      const yaArchivado = sheetBDB.getRange(filaMatchUids_Reviewed, BDB_DEFINITIVO).getValue();
      if (yaArchivado === true) {
        // Ya está en BD → saltar a limpieza (recuperación)
        limpiarFila(2);
        return;
      }
    }
  }
} catch(e) {
  lock.releaseLock();
  throw e;
}
```

**Lógica**:
1. Adquirir lock (evita ejecuciones paralelas)
2. Obtener UID de Movimientos (col N, fila 2)
3. Buscar en BD_Banco si ya existe como Definitivo=TRUE
4. Si existe → Script falló tras volcado pero antes del borrado
5. Si existe → Saltamos directamente a limpiar (idempotencia)

### Paso 1: Contar Filas Válidas

```javascript
// Contar filas consecutivas con V=TRUE desde fila 2 (máximo MAX_FILAS_LOTE)
let numeroFilasAProcesar = 0;

for (let i = 2; i <= lastRow && numeroFilasAProcesar < MAX_FILAS_LOTE; i++) {
  const bdCheckbox = sheet_Mov.getRange(i, Mov_BD).getValue();
  
  if (bdCheckbox === true) {
    numeroFilasAProcesar++;
  } else {
    break; // Romper en primer FALSE (comportamiento intencional)
  }
}

if (numeroFilasAProcesar === 0) return;
```

**Comportamiento**:
- Lee desde fila 2 hacia abajo
- Cuenta cuántas filas tienen V=TRUE seguidas
- Se rompe en primer FALSE (no procesa salteadas)
- Máximo 50 filas por lote ([[ConstantesGlobales#límites-de-procesamiento]])

### Paso 2: Feedback Visual

```javascript
const rango = sheet_Mov.getRange(2, 1, numeroFilasAProcesar, Mov_BD);
rango.setBackground("#FFFF00"); // Color amarillo

SpreadsheetApp.getActive().toast(
  `Procesando ${numeroFilasAProcesar} filas...`,
  "H1: Archivado",
  5
);
```

**Propósito**: Usuario ve que se está procesando

### Paso 3: Capturar Fórmulas de Fila 2

```javascript
const columnasConFormulas = COLUMNAS_FORMULAS; // [8, 9, 10, 11, 12, 13, 14, 15]
const formulasGuardadas = {};

for (let col of columnasConFormulas) {
  const celda = sheet_Mov.getRange(2, col);
  const formula = celda.getFormula();
  
  if (formula) {
    formulasGuardadas[col] = formula;
  }
}
```

**Por qué**: 
- Cuando se borran filas, las fórmulas se pierden
- Hay que guardarlas en memoria antes
- Después se restaurarán en la nueva fila 2

### Paso 4: Volcado Idempotente en BD_Banco

```javascript
// Obtener datos de filas 2:numeroFilasAProcesar
const datosAVolcar = sheet_Mov.getRange(
  2, 
  1, 
  numeroFilasAProcesar, 
  Mov_BD - 1 // Todas las columnas excepto la de BD checkbox
).getValues();

// Crear Map de UIDs en BD_Banco para O(1) lookup
const mapa_DEF_UidsBDB = obtenerMapaFilasBDB(sheetBDB, BDB_DEF_UID);

// Volcado por filas
for (let i = 0; i < datosAVolcar.length; i++) {
  const uid = datosAVolcar[i][Mov_UID - 1]; // columna A
  
  let filaTargetBDB = mapa_DEF_UidsBDB.get(uid);
  
  if (!filaTargetBDB) {
    // Si no existe, buscar por UID simple
    filaTargetBDB = mapa_DEF_UidsBDB.get(datosAVolcar[i][0]); // Primera columna
  }
  
  if (filaTargetBDB) {
    // Volcado por constantes de columna (inmune a cambios estructurales)
    const fila = datosAVolcar[i];
    
    sheetBDB.getRange(filaTargetBDB, BDB_NOMBREFRA).setValue(fila[Mov_NOMBREFRA - 1]);
    sheetBDB.getRange(filaTargetBDB, BDB_CFInOut).setValue(fila[Mov_CFInOut - 1]);
    sheetBDB.getRange(filaTargetBDB, BDB_CFCategory).setValue(fila[Mov_CFCategory - 1]);
    // ... resto de columnas
    
    // ⚠️ CRÍTICO: Escribir DEFINITIVO al final
    // Si lo hiciéramos primero, la QUERY filtraría la fila antes de escribir otros datos
    sheetBDB.getRange(filaTargetBDB, BDB_DEFINITIVO).setValue(true);
  }
}
```

**Características**:
- Map de UIDs en BD_Banco → O(1) lookup (muy rápido)
- Escritura por constantes (`BDB_NOMBREFRA`, etc.) → Inmune a cambios de estructura
- `BDB_DEFINITIVO` se escribe SIEMPRE al final → Evita que QUERY filtre prematuramente

### Paso 5: Borrado Atómico + Restauración de Fórmulas

```javascript
// Borrado de filas
sheet_Mov.deleteRows(2, numeroFilasAProcesar);

// Las filas desaparecen, la fila 3 pasa a ser fila 2
// Pero pierde las fórmulas del header

// Restaurar fórmulas en nueva fila 2
const nuevaFila2 = sheet_Mov.getRange(2, 1);

for (let col of columnasConFormulas) {
  if (formulasGuardadas[col]) {
    // Adaptar fórmula de fila 2 a nueva fila 2 (referencias relativas)
    let formulaAdaptada = formulasGuardadas[col];
    
    // Actualizar referencias de fila 2 → fila 2 (la referencia es relativa)
    // Google Sheets auto-ajusta referencias relativas
    sheet_Mov.getRange(2, col).setFormula(formulaAdaptada);
  }
}
```

**Protección anti-colapso de Tabla**:
- Si borro filas y hay tabla, puedo romper su estructura
- La restauración de fórmulas restablece el estado

---

## 🔐 Características de Seguridad

### LockService — Evitar Concurrencia

```javascript
const lock = LockService.getDocumentLock();
if (!lock.tryLock(10000)) {
  Logger.log("ABORTADO: otra ejecución en curso.");
  return;
}

try {
  // ... procesamiento
} finally {
  lock.releaseLock();
}
```

**Razón**: Si dos ejecuciones de H1 ocurren simultáneamente:
- Primera: Borra filas 2-10
- Segunda: Intenta leer filas 2-10 (ya no existen) → ERROR

**Solución**: Lock bloquea a la segunda ejecución por 10 segundos

### Idempotencia — Reintentos Seguros

```
Escenario: Script falla entre volcado en BD y borrado en Movimientos

Intento 1:
  ├─ Volcado en BD_Banco ✅
  └─ Borrado en Movimientos ❌ (timeout)

Intento 2 (reinicio):
  ├─ Detecta UID ya en BD.DEFINITIVO=TRUE
  └─ Salta directo a limpiar ✅ (sin duplicar)

Resultado: Sin duplicados, sin estados intermedios
```

---

## 🐛 Errores Potenciales

### Error 1: Rango de filas vacío

```javascript
// ❌ Si numeroFilasAProcesar = 0
sheet_Mov.deleteRows(2, 0); // No hace nada pero genera warning
```

**Solución**: Verificar `if (numeroFilasAProcesar === 0) return;`

### Error 2: Fórmulas con referencias absolutas

```javascript
// ❌ Si fórmula usa $A$2 (referencia absoluta)
=LET(dato, $A$2, ...)  // Sigue apuntando a fila 2 aunque nos hemos movido

// ✅ Usar referencias relativas
=LET(dato, A2, ...)    // Se adapta automáticamente
```

### Error 3: UID no encontrada en BD_Banco

```javascript
// ❌ Si UID de Movimientos no existe en BD_Banco
const filaTargetBDB = mapa_DEF_UidsBDB.get(uid); // undefined

if (!filaTargetBDB) {
  // No sabemos dónde volcador → SKIP esta fila
  Logger.log(`UID no encontrada: ${uid}`);
  continue;
}
```

**Prevención**: Validar que A1 importó correctamente antes de H1

---

## 📊 Rendimiento

| Operación | Tiempo |
|-----------|--------|
| Leer 50 filas de Movimientos | ~1 seg |
| Crear Map de BD_Banco (10,000 filas) | ~3 seg |
| Volcado de 50 filas | ~5 seg |
| Borrado atómico | ~1 seg |
| **Total** | **~10 segundos** |

**Optimización**: Ver [[Informes_Sesiones_Tecnicas#optimización-carga-perezosa]]

---

## 📝 Estado del Código

### ⚠️ Pendiente de Completar

El script está en estado **BORRADOR** con tareas pendientes:

```
[ ] Revisar COLUMNAS_FORMULAS con fórmulas reales del doc
[ ] Completar Pasos 1-3 de migración a hoja estática:
    Paso 1: adaptar script A1 para append a Movimientos_cuenta
    Paso 2: verificar hojas dependientes con datos estáticos
    Paso 3: eliminar QUERY de Movimientos_cuenta!A2
```

**Implicación**: Script está funcional pero no optimizado completamente

---

## 🔗 Notas Relacionadas

- [[H1_ArchivoRegistro]] → Descripción funcional de H1
- [[ConstantesGlobales]] → Variables compartidas (mapeo columnas)
- [[Metricas_Detalladas]] → KPIs de H1 (sección 6)
- [[Informes_Sesiones_Tecnicas]] → Informes de debugging y optimización
- [[Scripts_GoogleAppsScript_Referencia]] → Índice de scripts
- [[Trazabilidad_Codigo_Documentacion]] → Mapeo código ↔ doc

---

**Última actualización**: 2026-09-10
**Archivo source**: `workflows/CaixaB$-Scripts/AppScripts/ArchivarMovimientos/ArxivarMovimientos.gs`
**Estado**: ⚠️ BORRADOR (funcional, optimizable)
**Responsable técnico**: Google Apps Script
**Frecuencia de revisión**: Post-implementación de optimizaciones
