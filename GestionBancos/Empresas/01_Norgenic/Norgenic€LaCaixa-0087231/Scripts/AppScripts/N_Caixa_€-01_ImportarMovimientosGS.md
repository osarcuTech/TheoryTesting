## Estructura
La ejecución de este escript requiere de el script que contiene las variables globales de "N_Caixa_€" como resumen de su "arquitectura" de columnas y la logica de manipulación de las mismas para todos los scripts del SpreadSheet.

Consulta las variables globales de [[N_Caixa_€-ConstantesGlobalesScriptsGS|VariablesGlobales]].

```JS
//Formulario de variables a rellenar que varian entre documentos. Contiene:
let idCarpetaDrive = "1QL47EotyHLz4xhEssWw_MWIAvqDKcsg1" //id de la carpeta donde se sacara la información a importar (idCarpetaDrive)
let filaInicioDatosImportados = 4 //fila en la que empieza a haber datos que nos interesen (filaInicioDatosImportados) ya que variara entre bancos
let lastColumn = 7  // numCols: UID+Fecha+FechaValor+Movimiento+MasDatos+Importe+Saldo

//Plantilla del flujo para Importar MovimientosBancarios al Historico.

function getMovimientosBancarios(){
  Logger.log("[getMovimientosBancarios] Inicio");
  const folderMovimientosBancarios = DriveApp.getFolderById(idCarpetaDrive);
  Logger.log("[getMovimientosBancarios] Carpeta Drive obtenida");
  const listMovim = folderMovimientosBancarios.getFilesByType("application/vnd.google-apps.spreadsheet");
  if (!listMovim.hasNext()) {
    Logger.log("[getMovimientosBancarios] Finalizado: no hay archivos de movimientos");
    return [];
  }

  const fileInfo = SpreadsheetApp.openById(listMovim.next().getId());
  const fileSheet = fileInfo.getSheets()[0];
  if (!fileSheet) throw new Error("El archivo de movimientos no contiene hojas.");
  Logger.log("[getMovimientosBancarios] Archivo fuente abierto");

  Logger.log("[getMovimientosBancarios] Antes de getLastRow() de la hoja fuente");
  const importadosLastRow = fileSheet.getLastRow();
  Logger.log(`[getMovimientosBancarios] Después de getLastRow(): ${importadosLastRow}`);
  const numFilas = importadosLastRow - filaInicioDatosImportados + 1;
  if (numFilas <= 0) {
    Logger.log("[getMovimientosBancarios] Finalizado: no hay filas de datos");
    return [];
  }

  // Se leen únicamente las seis columnas de origen usadas para el UID y la importación.
  const numColumnasOrigen = lastColumn - 1;
  Logger.log(`[getMovimientosBancarios] Antes de getValues() de la fuente: ${numFilas} x ${numColumnasOrigen}`);
  const fileContent = fileSheet
    .getRange(filaInicioDatosImportados, 1, numFilas, numColumnasOrigen)
    .getValues();
  Logger.log("[getMovimientosBancarios] Después de getValues() de la fuente");
  const inverseBD = fileContent.filter(row => row[0] !== "" && row[0] !== null).reverse();

  const formatearFechaUID = valor => {
    if (!valor) return '';
    const fecha = new Date(valor);
    return `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
  };

  const resultado = inverseBD.map(row => {
    const uid = [
      formatearFechaUID(row[0]),
      formatearFechaUID(row[1]),
      (row[2] || '').toString().trim(),
      (row[3] || '').toString().trim(),
      row[4] ? row[4].toString().replace(/,/g, '').replace(/\./g, ',') : '',
      row[5] ? row[5].toString().replace(/,/g, '').replace(/\./g, ',') : ''
    ].join("'_'"); //No se puede poner como '_' ya que devolveria _ en vez de '_' y hay celdas que tienen _ dentro de su string haciendo confuso el separador.
    return [uid, ...row];
  });
  Logger.log(`[getMovimientosBancarios] UID generadas: ${resultado.length} movimientos válidos`);
  return resultado;
}

function appendBD(){
  Logger.log("[appendBD] Inicio");
  const arrayImportadosUID = getMovimientosBancarios();
  Logger.log(`[appendBD] Movimientos preparados: ${arrayImportadosUID.length} filas`);
  if (arrayImportadosUID.length === 0) {
    Logger.log("[appendBD] Finalizado: no hay movimientos para procesar");
    return;
  }

  Logger.log("[appendBD] Antes de getSheetBDB()");
  const sheetBDB = getSheetBDB();
  Logger.log("[appendBD] Después de getSheetBDB()");
  Logger.log("[appendBD] Antes de getSheetMov()");
  const sheetMov = getSheetMov();
  Logger.log("[appendBD] Después de getSheetMov()");
  // getLastRow puede contar datos de otras columnas; se lee la columna UID para deduplicar
  // y encontrar la siguiente fila disponible en BD_Banco.
  Logger.log("[appendBD] Antes de getLastRow() de BD_Banco");
  const bdbLastRow = sheetBDB.getLastRow();
  Logger.log(`[appendBD] Después de getLastRow() de BD_Banco: ${bdbLastRow}`);
  let bdbUIDValues = [];
  if (bdbLastRow > 0) {
    Logger.log(`[appendBD] Antes de getValues() de UID en BD_Banco: ${bdbLastRow} x 1`);
    bdbUIDValues = sheetBDB.getRange(1, BDB_UID, bdbLastRow, 1).getValues().map(row => row[0]);
    Logger.log("[appendBD] Después de getValues() de UID en BD_Banco");
  }
  const historicoUIDs = new Set(bdbUIDValues.filter(uid => uid !== "" && uid !== null));
  // Cada fila importada tiene la UID en row[0]; se conservan solo las que no están en el histórico.
  const noCoincidenciaImportar = arrayImportadosUID.filter(row => !historicoUIDs.has(row[0]));
  Logger.log(`[appendBD] Deduplicación completada: ${noCoincidenciaImportar.length} filas nuevas`);
  // No llamar a setValues con cero filas ni acceder a la primera fila, que no existiría.
  if (noCoincidenciaImportar.length === 0) {
    Logger.log("[appendBD] Finalizado: no hay movimientos nuevos para importar");
    return;
  }

  // setValues requiere que el rango tenga las mismas dimensiones que la matriz de datos.
  const numNuevasFilas = noCoincidenciaImportar.length;
  const numColumnas = noCoincidenciaImportar[0].length;
  // La columna A es continua: su primera celda vacía marca dónde empieza el nuevo lote.
  const bdbFirstEmptyIndex = bdbUIDValues.findIndex(uid => uid === "" || uid === null);
  // findIndex da un índice desde 0; si no encuentra vacíos, se añade después de lo leído.
  const bdbStartRow = bdbFirstEmptyIndex !== -1 ? bdbFirstEmptyIndex + 1 : bdbLastRow + 1;
  Logger.log(`[appendBD] Antes de setValues() en BD_Banco: ${numNuevasFilas} x ${numColumnas}, fila ${bdbStartRow}`);
  sheetBDB
    .getRange(bdbStartRow, BDB_UID, numNuevasFilas, numColumnas)
    .setValues(noCoincidenciaImportar);
  Logger.log("[appendBD] Después de setValues() en BD_Banco");

  // Se busca el primer hueco en la columna UID para reutilizarlo; si no hay huecos,
  // los nuevos movimientos se añaden después de la última fila utilizada.
  Logger.log("[appendBD] Antes de getLastRow() de Movimientos");
  const movLastRow = sheetMov.getLastRow();
  Logger.log(`[appendBD] Después de getLastRow() de Movimientos: ${movLastRow}`);

  //Esto quiere decir si(movLastRow>0; coge fila UID; devuelve rango bacio)
  let movUidValues = [];
  if (movLastRow > 0) {
    Logger.log(`[appendBD] Antes de getValues() de UID en Movimientos: ${movLastRow} x 1`);
    movUidValues = sheetMov.getRange(1, Mov_UID, movLastRow, 1).getValues();
    Logger.log("[appendBD] Después de getValues() de UID en Movimientos");
  }

  // findIndex devuelve el indice de la primera fila vacia.
  const firstEmptyIndex = movUidValues.findIndex(row => row[0] === "" || row[0] === null);

  // Sheets numera las filas desde 1; si no hay hueco, se usa la fila posterior a movLastRow.
  const sheetMovStartRow = firstEmptyIndex !== -1 ? firstEmptyIndex + 1 : movLastRow + 1;

  // Escribe todas las filas nuevas en bloque, con el UID en la columna Mov_UID.
  Logger.log(`[appendBD] Antes de setValues() en Movimientos: ${numNuevasFilas} x ${numColumnas}, fila ${sheetMovStartRow}`);
  sheetMov
    .getRange(sheetMovStartRow, Mov_UID, numNuevasFilas, numColumnas)
    .setValues(noCoincidenciaImportar);
  Logger.log("[appendBD] Después de setValues() en Movimientos");
  Logger.log("[appendBD] Finalizado");
}
```
## Rendimiento

### Análisis general de las pruebas

Los registros de varias ejecuciones muestran el mismo patrón general, aunque la duración total cambia entre ejecuciones (aproximadamente **4–7 minutos**):

- **La mayor parte del tiempo, aproximadamente el 80–90 %, se consume en operaciones con las hojas de destino**: inicializar/obtener hojas, calcular la última fila y leer las UID. Son esperas del orden de **decenas de segundos hasta alrededor de 1–2 minutos por operación** en las pruebas observadas.
- **La preparación del archivo fuente y el procesamiento local son muy rápidos** comparados con el total: normalmente del orden de **segundos o menos del 1 %** de la ejecución para unos 100 movimientos.
- **La deduplicación local y las escrituras en bloque no aparecen como los cuellos de botella dominantes** en los logs disponibles. En particular, el registro temporal redondeado a segundos no permite medir con precisión las escrituras cuando los mensajes anterior y posterior aparecen en el mismo segundo.
- **Alrededor del 10–20 % puede quedar entre el último mensaje y el aviso de fin**. Ese tramo no está asociado a una llamada concreta instrumentada, por lo que no se puede atribuir todavía a una causa determinada.

Estos porcentajes y rangos son orientativos, no garantías: el registro de Apps Script muestra marcas temporales con precisión limitada y las duraciones varían entre ejecuciones. La conclusión más consistente es que optimizar el trabajo local de JavaScript tendría poco impacto mientras las llamadas de lectura e inicialización de Sheets sigan dominando.

### `getLastRow()` en `BD_Banco`

La última fila general de `BD_Banco` puede ser mayor que la última UID de la columna A porque `getLastRow()` considera datos de cualquier columna. Una causa potencial es la casilla booleana de la columna H usada por `N_Caixa_€-99_ArchivarMovimientosGS.md`; si tiene valores en filas posteriores, puede extender la última fila detectada. Es una explicación probable que debe confirmarse inspeccionando la hoja.

Por ello, el destino de las nuevas filas se determina con la primera celda vacía de la columna A, que es la columna índice continua, y no con `getLastRow() + 1`. La lectura de UID existente se reutiliza también para la deduplicación, evitando una lectura adicional.

### Qué medir a continuación

Los logs antes y después de cada llamada permiten identificar si en una nueva prueba persisten las esperas en `getSheetBDB()`, `getLastRow()` o `getValues()`. Conviene comparar varias ejecuciones con un volumen similar y anotar filas leídas; si esas lecturas continúan concentrando la mayor parte del tiempo, la optimización debería enfocarse en el acceso a las hojas y en el tamaño de los rangos, sin excluir filas que contengan datos válidos.

### Hipótesis: efecto del archivado y de las fórmulas

El proceso `N_Caixa_€-99_ArchivarMovimientosGS.md` no reduce necesariamente el volumen total de movimientos gestionados: desplaza movimientos desde `Movimientos` a `BD_Banco`, aunque algunas columnas no se trasladan. Por tanto, el número histórico total puede mantenerse o crecer, mientras disminuye el conjunto de movimientos activos en `Movimientos`.

La mejora de rendimiento que se espera notar más es la reducción de celdas con fórmulas al retirar filas archivadas de `Movimientos`. Menos fórmulas podrían reducir el recálculo que acompaña a las operaciones en la hoja. Es una hipótesis razonable, pero los logs actuales no miden el recálculo ni el número de fórmulas; todavía no prueban que esa sea la causa de las demoras.

Para evaluar esta hipótesis a lo largo del tiempo, conviene registrar por ejecución los movimientos nuevos importados y archivados, las filas activas de `Movimientos`, las filas históricas de `BD_Banco` y los tiempos de cada etapa. Si el tiempo baja después de archivar mientras disminuyen las filas activas/fórmulas, pese a que `BD_Banco` conserva o aumenta sus registros, eso apoyaría la hipótesis de que la carga de fórmulas activas influye en el rendimiento.
