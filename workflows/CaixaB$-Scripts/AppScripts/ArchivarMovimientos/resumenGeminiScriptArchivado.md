Documento de Arquitectura: Flujo de Archivado de Movimientos Bancarios

Objetivo: Automatizar el archivo seguro de movimientos bancarios validados desde una "Bandeja de entrada" (Movimientos_cuenta) hacia una base de datos maestra (BD_Banco) en Google Sheets, garantizando la integridad de los datos ante fallos de conexión, límites de ejecución y concurrencia de usuarios.

1. Gestión de Triggers y Concurrencia

Idea original: Usar un trigger simple onEdit y depender de que los cambios generados por el script re-dispararan el trigger para procesar filas en cadena.

Descartado: Apps Script bloquea los auto-triggers por seguridad (evitar bucles infinitos). Además, el trigger simple tiene permisos limitados (no puede usar LockService).

Solución implementada:

Uso de un Trigger Instalable (onEditInstalable).

Implementación de LockService para encolar ejecuciones si varios usuarios marcan casillas simultáneamente.

Feedback visual (notificaciones Toast y cambio de color de fondo) para bloquear psicológicamente la interacción del usuario mientras el script trabaja.

2. Rendimiento y Resiliencia de la API

Problema: Procesar celda por celda genera demasiadas llamadas a la API, arriesgando un timeout (límite de 6 minutos de Google).

Idea descartada: Añadir un "Cooldown" (temporizador de 5 segundos) entre clics para no agotar cuota. Motivo del descarte: No soluciona el problema real. Si el script falla a la mitad por un corte de red, un cooldown no evita que los datos queden en un estado inconsistente.

Solución implementada (Batching + Idempotencia):

Procesamiento por Lotes (Batch): Se cuenta el número de TRUE consecutivos (máx 50) y se procesan en memoria con una sola lectura/escritura masiva.

Idempotencia: En lugar de simplemente añadir filas, el script crea un mapa en memoria (new Map()) de los UIDs existentes en BD_Banco. Si el script falla y el usuario reintenta, el código sobreescribe los datos del mismo UID en lugar de duplicarlos.

3. El Fallo Estructural: "Split-Brain" (Dinámico vs Estático)

Problema: La hoja combinaba una fórmula QUERY (que traía los datos del banco a las columnas izquierdas) con columnas de introducción manual a la derecha. Si el script fallaba tras actualizar la BD pero antes de borrar la fila manual, la QUERY actualizaba la vista (haciendo desaparecer el movimiento procesado y subiendo el siguiente) mientras que los datos manuales se quedaban estancados en la fila 2. Esto corrompía la BD al mezclar el nuevo UID con los datos manuales antiguos en la siguiente ejecución.

Idea descartada 1 (Panel de control / Checkboxes extra): Crear una hoja separada para trackear qué pasos del script habían terminado. Motivo: Añade complejidad innecesaria; la BD debe ser la única fuente de verdad.

Idea descartada 2 (Script Auto-Sanador): Un código que leyese el UID de la fila 2 para ver si ya estaba en BD_Banco y así auto-limpiar la fila. Motivo: Imposible de ejecutar. Al actuar la QUERY, el UID original desaparecía de la vista, por lo que el script leería un UID diferente y seguiría corrompiendo datos.

Solución implementada: Arquitectura 100% Estática. Se eliminó la QUERY. Los datos entran a la bandeja como texto estático. El script ejecuta el archivo y finaliza con un borrado atómico (deleteRows()) de la fila completa. Al ser estático, si el script falla, nada se desalinea y el reintento idempotente soluciona el problema.

4. Limitaciones de las "Tablas" de Google Sheets

Problema: Al utilizar la nueva función de "Tablas", las cabeceras no admiten fórmulas. Las ARRAYFORMULA (necesarias para cálculos complejos como el Autopunteo) debían residir obligatoriamente en la Fila 2. Al ejecutar deleteRows() para limpiar los movimientos procesados, el motor de fórmulas se destruía.

Solución implementada: Hack de Captura y Restauración. El script lee y guarda en memoria las fórmulas de la fila 2 mediante getFormula() antes de procesar el lote. Tras ejecutar el deleteRows(), utiliza setFormula() para inyectar nuevamente las fórmulas en la nueva fila 2. Se añadió una regla anti-colapso: si se van a borrar todas las filas de la tabla, se conserva la última usando clearContent() en lugar de deleteRow() para no destruir la estructura de la Tabla.

5. Desacoplamiento de Dominios (Banco vs Facturas)

Problema original: El script intentaba archivar la información simultáneamente en BD_Banco y BD_Facturas.

Descartado: Archivar en BD_Facturas desde este trigger. Motivo: La relación contable entre banco y facturas es de "Muchos a Muchos" (Many2Many). Un pago puede saldar varias facturas, y una factura puede pagarse en varios plazos. Obligar a una actualización 1 a 1 corrompería la lógica financiera a largo plazo.

Solución implementada: Separación de dominios. El script actual es un orquestador atómico exclusivo para BD_Banco. La conciliación de facturas se delegó a una arquitectura independiente.