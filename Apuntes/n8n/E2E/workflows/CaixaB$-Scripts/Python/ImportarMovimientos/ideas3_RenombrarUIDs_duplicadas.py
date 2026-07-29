"""
Renombrado y conteo de UIDs duplicadas (misma fecha)

Contexto:
- En `ImportarMovimientos.py` las filas leídas y normalizadas tienen la forma:
  [UID, Fecha, FechaValor, Movimiento, MasDatos, Importe, Saldo]
- Las UID duplicadas pueden aparecer únicamente dentro del mismo día
  (según la observación del usuario). Para evitar colisiones y mantener
  unicidad antes de comparar con el histórico, queremos:
  1) Contar cuántas UIDs tienen repeticiones (unique=false) por día.
  2) Renombrar las ocurrencias adicionales añadiendo un sufijo
     `(<n>)` donde `n` es 2 para la segunda ocurrencia, 3 para la tercera, etc.

Enfoque recomendado (resumen):
- Lugar de inserción: justo después de generar los UIDs en memoria,
  es decir, tras `filas_con_uid = [[generar_uid(fila)] + fila for fila in filas]`
  dentro de `leer_movimientos_bancarios()` (o inmediatamente después de
  llamar a esa función en `main()`), antes de comparar con `uids_existentes`.
  Razonamiento: así el resto del flujo (detección de nuevas UIDs,
  comparación con histórico, etc.) trabaja con UIDs ya normalizados y únicos.

- Algoritmo:
  1) Agrupar `filas_con_uid` por fecha (usar la columna Fecha en índice 1).
  2) Para cada fecha, construir un map de UID -> lista de índices (posiciones
     relativas en `filas_con_uid`).
  3) Si la lista tiene longitud > 1, incrementar un contador global de
     duplicados y renombrar las ocurrencias a partir de la segunda:
       nueva_uid = f"{uid}({k})"  # k = 2,3,...
     Actualizar `filas_con_uid[idx][0] = nueva_uid`.
  4) Devolver (o loguear) el número total de renombrados y un pequeño resumen
     (p. ej. dict por fecha -> número de duplicados).

Consideraciones:
- Usar `pd.to_datetime(..., dayfirst=True)` para normalizar fechas si vienen
  como strings. Si las fechas ya son objetos `datetime`, extraer `.date()`.
- Evitar colisiones con UIDs que ya tengan un sufijo similar: comprobar
  que la nueva UID generada no exista ya entre las UIDs del mismo día;
  si existe, incrementar el sufijo hasta que sea única.
- Esta operación modifica sólo las UIDs en memoria del archivo importado;
  no toca el histórico hasta el paso de escritura.

Fragmento de código (PARA PEGAR en `ImportarMovimientos.py` justo tras generar
`filas_con_uid`). Está presentado como comentario multilínea listo para copiar.

'''
# --- Inicio: renombrado UIDs duplicadas (misma fecha) ---
from collections import defaultdict
import pandas as pd

'''
def renombrar_uids_duplicadas_por_fecha(filas_con_uid):
    #Renombra UIDs duplicadas dentro del mismo día.

    filas_con_uid: lista de registros [UID, Fecha, FechaValor, ..., Importe, Saldo]
    Retorna: (filas_modificadas, resumen)
      - filas_modificadas: la lista modificada (se altera in-place también)
      - resumen: dict fecha->numero_de_duplicados (int)
    
    # Map fecha -> uid -> list(indices)
    por_fecha = defaultdict(lambda: defaultdict(list))

    # Normaliza fechas a tipo date para agrupar
    for i, fila in enumerate(filas_con_uid):
        fecha_raw = fila[1]
        if fecha_raw is None or (isinstance(fecha_raw, str) and fecha_raw.strip() == ""):
            clave_fecha = None
        else:
            fecha_dt = pd.to_datetime(fecha_raw, dayfirst=True)
            clave_fecha = fecha_dt.date()
        uid = str(fila[0])
        por_fecha[clave_fecha][uid].append(i)

    resumen = {}
    total_renombrados = 0

    for fecha, mapa_uid in por_fecha.items():
        duplicados_en_fecha = 0
        # Para asegurar unicidad al renombrar, mantenemos un set de uids ya usados
        usados = set(mapa_uid.keys())
        for uid, indices in mapa_uid.items():
            if len(indices) <= 1:
                continue
            # las ocurrencias adicionales serán renombradas
            for j, idx in enumerate(indices):
                if j == 0:
                    continue  # primera ocurrencia la dejamos igual
                k = j + 1  # segunda ocurrencia -> (2)
                nueva_uid = f"{uid}({k})"
                # Evitar colisión con uids ya usados: incrementar sufijo si hace falta
                while nueva_uid in usados:
                    k += 1
                    nueva_uid = f"{uid}({k})"
                usados.add(nueva_uid)
                filas_con_uid[idx][0] = nueva_uid
                duplicados_en_fecha += 1
                total_renombrados += 1

        if duplicados_en_fecha:
            resumen[str(fecha)] = duplicados_en_fecha

    return filas_con_uid, {"total_renombrados": total_renombrados, "por_fecha": resumen}

# Uso (ejemplo):
# filas_con_uid, reporte = renombrar_uids_duplicadas_por_fecha(filas_con_uid)
# print(f"UIDs renombradas: {reporte}")
# --- Fin: renombrado UIDs duplicadas (misma fecha) ---
Fin del documento.

'''

"""
