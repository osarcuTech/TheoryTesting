# Notas sobre la lógica de importación

## Uso de `encontrar_siguiente_fila()`

La función `encontrar_siguiente_fila(ws)` se usa para calcular la fila siguiente libre en la hoja Excel donde se van a escribir los nuevos movimientos.

### ¿Por qué no usar `len(uids)`?

`len(uids)` devuelve el número de UID únicos que ya existen en memoria, pero no indica la posición real de la última fila ocupada en la hoja de Excel.

En este script, la función es más robusta porque permite manejar casos como:
- filas vacías al final,
- cabeceras,
- filas con datos pero sin UID,
- o inconsistencias futuras en el histórico.

### Nota de futuro

Si el histórico se mantiene siempre con una estructura estricta (una fila por UID, sin huecos y sin filas incompletas), entonces `len(uids)` podría servir como aproximación para calcular la siguiente fila.

```python
# Nota futura: si el histórico se mantiene siempre bien formado, len(uids)
# podría usarse para calcular la siguiente fila. Por ahora usamos
# encontrar_siguiente_fila() para ser más robustos.
```
