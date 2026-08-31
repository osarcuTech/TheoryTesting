
// ── Constantes: nombres de hojas ────────────────────────────

const ss_id = "1sZeGfiuG7Ab9jx14_-oaQZTtrhIohlx5dhYoSgZCOuw"
Logger.log(`[G0] Antes de openById: ${new Date().toISOString()}`);
const ss = SpreadsheetApp.openById(ss_id);
Logger.log(`[G1] Después de openById: ${new Date().toISOString()}`);

const gid_Mov = 1963712436
const gid_BDB = 1089991841
const sheetBDB = ss.getSheetById(gid_BDB);
//Logger.log(`[G2] Después de getSheetById(BDB): ${new Date().toISOString()}`);

const sheet_Mov = ss.getSheetById(gid_Mov);
//Logger.log(`[G3] Después de getSheetById(Mov): ${new Date().toISOString()}`);


// ── Constantes: columnas Movimientos_cuenta (1-based) ───────
//const sheetMovimientos= ss.getSheetById(1963712436)
const Mov_UID        = 1;   // A  UID movimiento
const Mov_NOMBREFRA  = 8;   // H  NombreFactura
const Mov_PeriodoCobro  = 9;   // I  PeriodoCobro
const Mov_Decripcion  = 10;   // J  DescripccionMovimiento
const Mov_CFInOut  = 11;   // K  CF in/out
const Mov_CFCategory = 12; // L "CF category"
const Mov_PlataformaPago  = 13;   // M  PlataformaPago
const Mov_DEF_UID    = 14;  // N  Def_UID (fórmula) Def_UID = DUID
const Mov_Autopunteo  = 15;   // O  Autopunteo
const Mov_VALIDACION = 16;  // P  inicio bloque manual
const Mov_FRA_MANUAL = 17;  // Q  Fra.Manual
const Mov_PCONABLE   = 18;  // R  P.Conable
const Mov_UBICACION  = 19;  // S  Ubicación VT
const Mov_ID_ENVIADA = 20;  // T  ID_Enviada
const Mov_CARPETA    = 21;  // U  Carpeta
const Mov_BD         = 22;  // V  BD checkbox (trigger)

const numColsManuales = Mov_BD - Mov_VALIDACION + 1; // Columnas P:V = 7 cols
const COLUMNAS_FORMULAS = [8, 9, 10, 11, 12, 13, 14, 15];


// ── Constantes: columnas BD_Banco (1-based) ─────────────────
const BDB_UID        = 1;   // A
const BDB_DEFINITIVO = 8;   // H  — escribir SIEMPRE al final
const BDB_DEF_UID    = 9;   // I "Def_UID = DUID"
const BDB_PeriodoCobro  = 10;  // J
const BDB_NOMBREFRA  = 11;  // K
const BDB_CFInOut	= 12;  // L
const BDB_CFCategory	= 13;  // M
const BDB_PlataformaPago	= 14;  // N
const BDB_Validacion= 15;  // O (CO)
const BDB_PCONABLE   = 16;  // P  ← Movimientos_cuenta!R
const BDB_UBICACION  = 17;  // Q  ← Movimientos_cuenta!S
const BDB_ID_ENVIADA = 18;  // R  ← Movimientos_cuenta!T
const BDB_CARPETA    = 19;  // S  ← Movimientos_cuenta!U
const totalColsBDB  = sheetBDB.getLastColumn()
//Logger.log(`[G4] Después de getLastColumn: ${new Date().toISOString()}`);


/*
//Helpers globales
//Devuelve el nº de la última fila con dato real en una columna clave (evita el problema de getLastRow() contando filas "fantasma" con fórmulas sin datos reales).
function obtenerUltimaFilaConDatos(sheet, columnaClave) {
  const filasMax = sheet.getMaxRows();
  const valores = sheet.getRange(1, columnaClave, filasMax, 1).getValues();
  for (let i = valores.length - 1; i >= 0; i--) {
    if (valores[i][0] !== "" && valores[i][0] !== null) return i + 1; // 0-based → 1-based
  }
  return 0; // hoja sin datos
}
*/