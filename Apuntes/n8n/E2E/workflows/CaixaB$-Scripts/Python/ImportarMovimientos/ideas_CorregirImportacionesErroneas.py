"""Presentación: ampliar `filas_a_importar` según comprobación de saldos.

Este módulo muestra cómo se podría implementar, en memoria, la verificación
de saldos antes de escribir al histórico. Si la comprobación falla para la
primera fila a importar (comparada con el ``last_saldo_historico``), se
incluyen filas anteriores de ``filas_nuevas`` hasta que la secuencia sea
consistente o hasta llegar al inicio de la lista.

Notas:
- `filas_nuevas` en este repo tiene la forma: [UID, Fecha, FechaValor,
  Movimiento, MasDatos, Importe, Saldo] (importe índice 5, saldo índice 6).
- Se usa una tolerancia para comparar floats y evitar errores por precisión.
- En caso de no poder resolver el desajuste al llegar al inicio, se
  devuelve un error y se llama a un placeholder que "marca" el error
  (impresión y punto de integración para escribir en la hoja o en código).
"""

from typing import List, Optional, Tuple


def _to_float(valor) -> Optional[float]:
    try:
        if valor is None or (isinstance(valor, str) and valor.strip() == ""):
            return None
        return float(valor)
    except Exception:
        return None


def detectar_primer_nuevo_idx(filas_nuevas: List[list], uids_existentes: set) -> Optional[int]:
    """Detecta el índice de la primera fila nueva comparando UIDs.

    Retorna `None` si no hay filas nuevas.
    """
    for idx, fila in enumerate(filas_nuevas):
        uid = str(fila[0]).strip()
        if uid not in uids_existentes:
            return idx
    return None


def marcar_error_en_codigo(primer_nuevo_idx: int, mensaje: str) -> None:
    """Placeholder: marcar el error en el sitio indicado y hacer print.

    Integración futura: escribir el texto en la celda correspondiente del
    histórico o en un registro de auditoría. Aquí solo imprimimos y
    devolvemos (presentación).
    """
    # Simulación de la doble alerta: escribir en 'código' (placeholder)
    print(f"[MARCAR] en primer_nuevo_idx={primer_nuevo_idx}: {mensaje}")
    # Además, salida por consola (requisito del usuario)
    print(mensaje)


def ajustar_filas_por_saldo(
    filas_nuevas: List[list],
    uids_existentes: set,
    last_saldo_historico: float,
    tol: float = 1e-6,
) -> Tuple[Optional[int], List[list], Optional[str]]:
    """Intenta expandir `filas_a_importar` hacia atrás hasta que los saldos
    sean consistentes con `last_saldo_historico`.

    Devuelve una tupla `(primer_nuevo_idx, filas_a_importar, error_msg)`.
    Si `error_msg` es None la comprobación fue exitosa.
    """
    primer_nuevo_idx = detectar_primer_nuevo_idx(filas_nuevas, uids_existentes)
    if primer_nuevo_idx is None:
        return None, [], None

    idx = primer_nuevo_idx

    while True:
        filas_a_importar = filas_nuevas[idx:]

        if not filas_a_importar:
            return idx, [], "No hay filas a importar"

        # Comprobación inicial: la primera fila importada debe ser
        # consistente con el saldo histórico previo.
        primera = filas_a_importar[0]
        importe_prim = _to_float(primera[5])
        saldo_prim = _to_float(primera[6])

        if importe_prim is None or saldo_prim is None:
            # Falta dato: tratamos como inconsistencia y ampliamos hacia atrás
            consistente = False
        else:
            consistente = abs((saldo_prim - importe_prim) - float(last_saldo_historico)) <= tol

        # Si la primera fila no coincide con el saldo histórico, intentamos
        # ampliar incluyendo una fila anterior (si existe).
        if not consistente:
            if idx == 0:
                # Hemos llegado al inicio y seguimos sin resolver el desajuste.
                msg = (
                    "Error de importación, saldo erroneo, se requieren mas filas para corregirlo"
                )
                marcar_error_en_codigo(primer_nuevo_idx, msg)
                return primer_nuevo_idx, filas_a_importar, msg
            idx -= 1
            continue

        # Si la primera fila es consistente con el histórico, comprobamos la
        # consistencia interna entre filas a importar (cadena de saldos).
        interno_ok = True
        for i in range(1, len(filas_a_importar)):
            prev_saldo = _to_float(filas_a_importar[i - 1][6])
            curr_saldo = _to_float(filas_a_importar[i][6])
            curr_importe = _to_float(filas_a_importar[i][5])
            if None in (prev_saldo, curr_saldo, curr_importe):
                interno_ok = False
                break
            if abs((curr_saldo - curr_importe) - prev_saldo) > tol:
                interno_ok = False
                break

        if interno_ok:
            return idx, filas_a_importar, None

        # Si la secuencia interna falla, ampliamos hacia atrás si es posible
        if idx == 0:
            msg = (
                "Error de importación, saldo erroneo, se requieren mas filas para corregirlo"
            )
            marcar_error_en_codigo(primer_nuevo_idx, msg)
            return primer_nuevo_idx, filas_a_importar, msg
        idx -= 1


if __name__ == "__main__":
    # Ejemplo de presentación: cada fila tiene la estructura
    # [UID, Fecha, FechaValor, Movimiento, MasDatos, Importe, Saldo]
    filas_demo = [
        ["UID0", "01/01/2026", "01/01/2026", "mov", "md", 5.0, 5.0],
        ["UID1", "02/01/2026", "02/01/2026", "mov", "md", 2.0, 7.0],
        ["UID2", "03/01/2026", "03/01/2026", "mov", "md", 3.0, 10.0],
    ]
    # Simulamos que solo los dos últimos UIDs ya existen en el histórico
    uids_existentes_demo = {"UID0"}
    last_saldo_hist_demo = 5.0

    idx, filas_ok, error = ajustar_filas_por_saldo(filas_demo, uids_existentes_demo, last_saldo_hist_demo)
    print("primer_nuevo_idx:", idx)
    print("filas_a_importar (len):", len(filas_ok))
    print("error:", error)
