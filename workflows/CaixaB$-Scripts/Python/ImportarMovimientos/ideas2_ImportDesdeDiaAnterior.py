"""PSEUDOCÓDIGO: Comprobación de rango de fechas antes de importar

1) Obtener `max_date_historico` desde la hoja histórica (última fecha conocida).
   - Leer la última fila válida de `config['hoja_historico']` y extraer la columna Fecha.

2) Calcular `min_date_importados` desde `filas_nuevas` (cada fila: [UID, Fecha, FechaValor, ..., Importe, Saldo]).
   - Convertir valores de Fecha (índice 1) a datetime y tomar el mínimo.

3) Condición de seguridad:
   if max_date_historico >= min_date_importados:
       - Mensaje de error y doble aviso (print + marcar en la variable/sitio pedido).
       - Detener (break / return) para evitar insertar datos incompletos.

4) Si pasa la comprobación, filtrar/importar solo las filas cuya Fecha > (max_date_historico - 1 día)
   (equivalente a: select * from importados where Fecha > max_date_historico - 1)

--------------------------------------------------------------------------------
MULTILÍNEA (FRAGMENTO PYTHON) — insertar dentro de `anadir_movimientos_al_historico`:
Lugar exacto: justo después de calcular `uids_existentes = leer_uids_existentes(config)`
y antes de detectar `primer_nuevo_idx`.

Razonamiento: necesitamos comprobar el solapamiento temporal entre lo ya
existente en el histórico y lo que vamos a importar; si el archivo importado
empieza en una fecha posterior o igual a la última del histórico, puede faltar
el "día anterior" que permite reconstruir saldos y concatenar filas sin gaps.

Código a añadir (presentación):

    # --- Comprobación de rango de fechas (seguridad previa a la importación) ---
    from datetime import timedelta
    import pandas as pd

    # 1) obtener la última fecha del histórico (max_date_historico)
    wb_tmp = load_workbook(config["ruta_historico"], read_only=True, data_only=True)
    ws_tmp = wb_tmp[config["hoja_historico"]]
    # buscar la última fila con fecha válida en la columna de Fecha (columna 2)
    for r in range(ws_tmp.max_row, 0, -1):
        val = ws_tmp.cell(row=r, column=2).value
        if val is not None and str(val).strip() != "":
            max_date_historico = pd.to_datetime(val, dayfirst=True)
            break
    else:
        max_date_historico = None
    wb_tmp.close()

    # 2) obtener la mínima fecha del archivo importado (min_date_importados)
    fechas_importadas = []
    for f in filas_nuevas:
        fecha_raw = f[1]   # record: filas_nuevas = [UID, Fecha, FechaValor, ...]
        if fecha_raw is not None and str(fecha_raw).strip() != "":
            fechas_importadas.append(pd.to_datetime(fecha_raw, dayfirst=True))
    min_date_importados = min(fechas_importadas) if fechas_importadas else None

    # 3) prueba de seguridad solicitada
    if max_date_historico is not None and min_date_importados is not None:
        if max_date_historico >= min_date_importados:
            msg = (
                "Error de importación, saldo erroneo, se requieren mas filas para corregirlo"
            )
            # Doble aviso: asignar al símbolo `primer_nuevo_idx` (presentación)
            primer_nuevo_idx = msg
            # Print en consola
            print(msg)
            # Detener la función para evitar escrituras inseguras
            return 0

    # 4) si pasa, opcionalmente filtrar importados por umbral de fecha:
    # umbral = max_date_historico - timedelta(days=1)
    # filas_a_importar = [f for f in filas_nuevas if pd.to_datetime(f[1], dayfirst=True) > umbral]

Notas de implementación:
- Asignar la cadena de error a `primer_nuevo_idx` es una medida de señalización
  (presentación). En producción puede ser preferible escribir el mensaje en una
  celda específica del histórico (por ejemplo, columna A de la fila donde hubiera
  ido el primer nuevo registro) o almacenar en un log/auditoría.
- Se usa `pd.to_datetime(..., dayfirst=True)` para mantener compatibilidad con
  la lógica actual de formateo de fechas.
- El `return 0` evita que el código continúe y escriba filas inconsistentes.

Fin del fragmento.
"""

# Archivo de presentación; no ejecuta cambios sobre `ImportarMovimientos.py`.
'''
PSEUDOCÓDIGO: Comprobación de rango de fechas antes de importar

1) Obtener `max_date_historico` desde la hoja histórica (última fecha conocida).
   - Leer la última fila válida de `config['hoja_historico']` y extraer la columna Fecha.

2) Calcular `min_date_importados` desde `filas_nuevas` (cada fila: [UID, Fecha, FechaValor, ..., Importe, Saldo]).
   - Convertir valores de Fecha (índice 1) a datetime y tomar el mínimo.

3) Condición de seguridad:
   if max_date_historico >= min_date_importados:
       - Mensaje de error y doble aviso (print + marcar en la variable/sitio pedido).
       - Detener (break / return) para evitar insertar datos incompletos.

4) Si pasa la comprobación, filtrar/importar solo las filas cuya Fecha > (max_date_historico - 1 día)
   (equivalente a: select * from importados where Fecha > max_date_historico - 1)
   --------------------------------------------------------------------------------
''' 

'''
MULTILÍNEA (FRAGMENTO PYTHON) — insertar dentro de `anadir_movimientos_al_historico`:
Lugar exacto: justo después de calcular `uids_existentes = leer_uids_existentes(config)`
y antes de detectar `primer_nuevo_idx`.

Razonamiento: necesitamos comprobar el solapamiento temporal entre lo ya
existente en el histórico y lo que vamos a importar; si el archivo importado
empieza en una fecha posterior o igual a la última del histórico, puede faltar
el "día anterior" que permite reconstruir saldos y concatenar filas sin gaps.


Código a añadir (presentación):

    # --- Comprobación de rango de fechas (seguridad previa a la importación) ---
    from datetime import timedelta
    import pandas as pd

    # 1) obtener la última fecha del histórico (max_date_historico)
    wb_tmp = load_workbook(config["ruta_historico"], read_only=True, data_only=True)
    ws_tmp = wb_tmp[config["hoja_historico"]]
    # buscar la última fila con fecha válida en la columna de Fecha (columna 2)
    for r in range(ws_tmp.max_row, 0, -1):
        val = ws_tmp.cell(row=r, column=2).value
        if val is not None and str(val).strip() != "":
            max_date_historico = pd.to_datetime(val, dayfirst=True)
            break
    else:
        max_date_historico = None
    wb_tmp.close()

    # 2) obtener la mínima fecha del archivo importado (min_date_importados)
    fechas_importadas = []
    for f in filas_nuevas:
        fecha_raw = f[1]   # record: filas_nuevas = [UID, Fecha, FechaValor, ...]
        if fecha_raw is not None and str(fecha_raw).strip() != "":
            fechas_importadas.append(pd.to_datetime(fecha_raw, dayfirst=True))
    min_date_importados = min(fechas_importadas) if fechas_importadas else None

    # 3) prueba de seguridad solicitada
    if max_date_historico is not None and min_date_importados is not None:
        if max_date_historico >= min_date_importados:
            msg = (
                "Error de importación, saldo erroneo, se requieren mas filas para corregirlo"
            )
            # Doble aviso: asignar al símbolo `primer_nuevo_idx` (presentación)
            primer_nuevo_idx = msg
            # Print en consola
            print(msg)
            # Detener la función para evitar escrituras inseguras
            return 0

    # 4) si pasa, opcionalmente filtrar importados por umbral de fecha:
    # umbral = max_date_historico - timedelta(days=1)
    # filas_a_importar = [f for f in filas_nuevas if pd.to_datetime(f[1], dayfirst=True) > umbral]

Notas de implementación:
- Asignar la cadena de error a `primer_nuevo_idx` es una medida de señalización
  (presentación). En producción puede ser preferible escribir el mensaje en una
  celda específica del histórico (por ejemplo, columna A de la fila donde hubiera
  ido el primer nuevo registro) o almacenar en un log/auditoría.
- Se usa `pd.to_datetime(..., dayfirst=True)` para mantener compatibilidad con
  la lógica actual de formateo de fechas.
- El `return 0` evita que el código continúe y escriba filas inconsistentes.

Fin del fragmento.

*/
'''