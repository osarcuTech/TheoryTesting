// ============================================================
// archivarValidados_BORRADOR.gs
//
// ESTADO: BORRADOR — pendiente de:
//   [ ] Revisar COLUMNAS_FORMULAS con las fórmulas reales del doc
//   [ ] Completar Pasos 1-3 (migración a hoja estática):
//       Paso 1: adaptar script A1 para append a Movimientos_cuenta
//       Paso 2: verificar hojas dependientes con datos estáticos
//       Paso 3: eliminar QUERY de Movimientos_cuenta!A2
//
// Trigger: onEdit INSTALABLE → apuntar a onEditInstalable()
//   (NO usar nombre "onEdit" — es reservado para trigger simple
//    y causaría doble ejecución)
//
// Arquitectura: Estática + Atómica + Idempotente + Restauración
//
// Flujo:
//   0. Evaluar reanudación: si A2 ya está en BD como Definitivo=TRUE
//      → el script falló tras el volcado pero antes del borrado
//      → saltar directamente a limpieza (idempotencia)
//   1. Contar filas con V=TRUE consecutivas desde fila 2 (max 50)
//      El bloque se rompe al primer FALSE (comportamiento intencional)
//   2. Feedback visual: color amarillo + toast
//   3. Capturar fórmulas de fila 2 (cols H-O) en memoria
//   4. Volcado idempotente en BD_Banco con Map de UIDs (O(1))
//      Escritura por constantes COL_BDBanco_* — inmune a cambios estructurales
//      Definitivo=TRUE se escribe SIEMPRE al final para evitar que
//      la futura QUERY filtre la fila antes de escribir todos los datos
//   5. Borrado atómico (deleteRows) con protección anti-colapso de Tabla
//      + restauración de fórmulas en nueva fila 2
// ============================================================

// ── Columnas de Movimientos_cuenta_0087231 con ARRAYFORMULA en fila 2 ─────────────────────
// ⚠️ REVISAR antes de activar — basado en ContextoHoja
// H=8  NombreFactura      (LET/ARRAYFORMULA)
// I=9  PeriodoCobro       (LET/ArrayFormula)
// J=10 DescripccionMovim  (LET/MAP)
// K=11 CF in/out          (ARRAYFORMULA — ocupa K y L)
// L=12 CF category        (derrame de K)
// M=13 PlataformaPago     (LET/ArrayFormula)
// N=14 Def_UID            (LET)
// O=15 Autopunteo C0      (LET — la fórmula C0 completa)
// Col.A (1) se omite: desaparecerá al eliminar la QUERY en Paso 3


/* ------------------------
El trigger no es obligatorio para ejecutar el proceso.
Pero si lo eliminas, debes ejecutar directamente procesarLoteBancos(sheet_Mov) o crear otra función sin e.
Si solo borras onEditInstalable y no cambias nada más, dejará de funcionar automáticamente y onEditInstalable ya no servirá para nada.
*/