# Especificación Técnica y Documentación de Power Query (M) - Versión Portable (GitHub Ready)

Este documento contiene la especificación completa, arquitectura de datos y código en **Lenguaje M (Power Query)** adaptado para **rutas relativas**. Ha sido diseñado para ser totalmente ejecutable e independiente del entorno local, permitiendo exportar el proyecto a cualquier máquina (ej. clonado de repositorios en GitHub, Azure DevOps o carpetas compartidas) sin romper los enlaces de datos.

---

## 1. Estrategia de Portabilidad y Rutas Relativas

En la versión original, las consultas utilizaban rutas absolutas hardcodadas como `C:\Users\Oscar Ardevol\Desktop\InformesSolidgate\Finance\...`. Para garantizar la portabilidad entre diferentes usuarios y sistemas operativos, se implementa una **Ruta Relativa Dinámica** mediante un parámetro base o ruta relativa al proyecto.

### Estrategia de Parámetro de Ruta Base (`RutaBase`)
Se define una consulta auxiliar `RutaBase` en Power Query que resuelve la ubicación relativa respecto a la raíz del proyecto/repositorio:

```M
// Consulta M: RutaBase
let
    // Opción 1: Ruta relativa estándar al directorio raíz del proyecto
    RutaLocal = "./Finance/"
in
    RutaLocal
```

*Nota para Power BI / Excel:* Si se requiere resolución automática en Excel sin modificar parámetros, se puede emplear el origen dinámico desde la carpeta actual:
```M
let
    UbicacionActual = Text.BeforeDelimiter(Cell.Url(Excel.CurrentWorkbook(){[Name="TablaOrigen"]}[Cell]), "\", {0, RelativePosition.FromEnd}),
    RutaCompleta = UbicacionActual & "\Finance\"
in
    RutaCompleta
```

---

## 2. Estructura de Directorios del Repositorio

Para que las consultas funcionen correctamente, la estructura de carpetas en el repositorio debe mantener la siguiente jerarquía:

```
repo-root/
│
├── Finance/
│   ├── 2025/
│   │   ├── 01/Data/*.csv
│   │   ├── 05/Data/*.csv
│   │   └── ...
│   └── 2026/
│       ├── 01/Data/*.csv
│       └── ...
│
├── docs/
│   └── README.md
│
└── power-query-portable-spec.md
```

---

## 3. Consultas Auxiliares y Funciones de Ingesta

### A. Archivo de Ejemplo (Uso de Ruta Relativa)
Extrae el archivo de muestra inicial desde la carpeta relativa `./Finance/2025/05/Data/`.

```M
let
    Origen = Folder.Files(RutaBase & "2025/05/Data"),
    Navegación1 = Origen{0}[Content]
in
    Navegación1
```

---

### B. Parámetro1 (Función de Transformación de Archivo)
Función encargada de parsear los archivos CSV individuales con formato estándar de 27 columnas y codificación `Windows-1252`.

```M
let
    Origen = (Parámetro1) => let
        Origen = Csv.Document(Parámetro1, [Delimiter=",", Columns=27, Encoding=1252, QuoteStyle=QuoteStyle.None]),
        #"Encabezados promovidos" = Table.PromoteHeaders(Origen, [PromoteAllScalars=true])
    in
        #"Encabezados promovidos"
in
    Origen
```

---

### C. Plantilla de Extracción Mensual (`Data_MM-YYYY`)
Cada mes procesa los archivos CSV invocando la función de transformación sobre la carpeta relativa correspondiente (`RutaBase & "Año/MES/Data"`).

#### Ejemplo: `Data_05-2025`
```M
let
    Origen = Folder.Files(RutaBase & "2025/05/Data"),
    #"Archivos ocultos filtrados1" = Table.SelectRows(Origen, each [Attributes]?[Hidden]? <> true),
    #"Invocar función personalizada1" = Table.AddColumn(#"Archivos ocultos filtrados1", "Transformar archivo", each #"Transformar archivo"([Content])),
    #"Columnas con nombre cambiado1" = Table.RenameColumns(#"Invocar función personalizada1", {"Name", "Source.Name"}),
    #"Otras columnas quitadas1" = Table.SelectColumns(#"Columnas con nombre cambiado1", {"Source.Name", "Transformar archivo"}),
    #"Columna de tabla expandida1" = Table.ExpandTableColumn(#"Otras columnas quitadas1", "Transformar archivo", Table.ColumnNames(#"Transformar archivo"(#"Archivo de ejemplo"))),
    #"Valor reemplazado" = Table.ReplaceValue(#"Columna de tabla expandida1", ".", ",", Replacer.ReplaceText, {"amount", "amount_in_major_units", "payout_amount", "payout_amount_in_major_units"}),
    #"Tipo cambiado" = Table.TransformColumnTypes(#"Valor reemplazado", {
        {"Source.Name", type text}, 
        {"id", type text}, 
        {"order_id", type text}, 
        {"external_psp_order_id", type text}, 
        {"created_at", type datetime}, 
        {"transaction_datetime_provider", type datetime}, 
        {"transaction_datetime_utc", type datetime}, 
        {"accounting_date", type date}, 
        {"amount", type number}, 
        {"amount_in_major_units", type number}, 
        {"currency", type text}, 
        {"currency_minor_units", Int64.Type}, 
        {"payout_amount", Int64.Type}, 
        {"payout_amount_in_major_units", type number}, 
        {"payout_currency", type text}, 
        {"payout_currency_minor_units", Int64.Type}, 
        {"record_type_key", type text}, 
        {"provider", type text}, 
        {"payment_method", type text}, 
        {"card_brand", type text}, 
        {"geo_country", type text}, 
        {"issuing_country", type text}, 
        {"transaction_id", type text}, 
        {"chargeback_id", Int64.Type}, 
        {"legal_entity", type text}, 
        {"order_description", type text}, 
        {"product_id", type any}, 
        {"product_name", type any}
    })
in
    #"Tipo cambiado"
```

---

## 4. Capa de Bases de Datos Consolidadas (`BD's`)

### A. `BD` (Base de Datos Maestra)
Combina todas las fuentes de datos mensuales relativas en una única tabla cronológica.

```M
let
    Origen = Table.Combine({
        #"Data_05-2025", #"Data_06-2025", #"Data_07-2025", #"Data_08-2025", 
        #"Data_09-2025", #"Data_10-2025", #"Data_11-2025", #"Data_12-2025", 
        #"Data_01-2026", #"Data_02-2026", #"Data_03-2026", #"Data_04-2026", 
        #"Data_05-2026", #"Data_06-2026", #"Data_07-2026", #"Data_08-2026"
    }),
    #"Filas ordenadas" = Table.Sort(Origen, {{"created_at", Order.Ascending}})
in
    #"Filas ordenadas"
```

### B. `BD_Ordenes`
Filtra la tabla maestra `BD` reteniendo solo atributos clave de ventas y excluyendo cobros de comisiones (`FEE`).

```M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen, {
        "order_id", "created_at", "amount_in_major_units", "currency", 
        "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider"
    }),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each not Text.Contains([record_type_key], "FEE"))
in
    #"Filas filtradas"
```

### C. `BD_simplified`
Optimiza el volumen de datos agrupando registros por una clave sintética compuesta (`Classificador`) y sumando los importes.

```M
let
    Origen = BD_Ordenes,
    #"Columnas quitadas" = Table.RemoveColumns(Origen, {"order_id"}),
    #"Tipo cambiado1" = Table.TransformColumnTypes(#"Columnas quitadas", {{"created_at", type date}}),
    #"Personalizada agregada" = Table.AddColumn(#"Tipo cambiado1", "Classificador", each Date.ToText([created_at]) & "-" & [currency] & "-" & [payout_currency] & "-" & [record_type_key] & "-" & [provider]),
    #"Filas agrupadas" = Table.Group(#"Personalizada agregada", {"Classificador"}, {
        {"amount_in_major_units", each List.Sum([amount_in_major_units]), type nullable number}, 
        {"payout_amount_in_major_units", each List.Sum([payout_amount_in_major_units]), type nullable number}
    }),
    #"Dividir columna por delimitador" = Table.SplitColumn(#"Filas agrupadas", "Classificador", Splitter.SplitTextByDelimiter("-", QuoteStyle.Csv), {"Classificador.1", "Classificador.2", "Classificador.3", "Classificador.4", "Classificador.5"}),
    #"Tipo cambiado" = Table.TransformColumnTypes(#"Dividir columna por delimitador", {{"Classificador.1", type date}}),
    #"Columnas con nombre cambiado" = Table.RenameColumns(#"Tipo cambiado", {
        {"Classificador.1", "created_at"}, 
        {"Classificador.2", "currency"}, 
        {"Classificador.3", "payout_currency"}, 
        {"Classificador.4", "record_type_key"}, 
        {"Classificador.5", "provider"}
    }),
    #"Columnas reordenadas" = Table.ReorderColumns(#"Columnas con nombre cambiado", {"created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider"})
in
    #"Columnas reordenadas"
```

### D. `BD_simplified_Checkout`
Subconjunto filtrado para transacciones operadas por el proveedor Checkout.

```M
let
    Origen = BD_simplified,
    #"Filas filtradas" = Table.SelectRows(Origen, each ([provider] = "Checkout"))
in
    #"Filas filtradas"
```

---

## 5. Módulo de Auditoría y Comprobaciones (`Comprovaciones`)

### A. Auditoría de Ventas

#### `V_Dup_Anomalas`
Detecta órdenes de venta (`SALE`) que aparecen registradas exactamente **2 veces**.
```M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen, {"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each ([record_type_key] = "SALE")),
    #"Filas agrupadas" = Table.Group(#"Filas filtradas", {"order_id"}, {{"Recuento", each Table.RowCount(_), Int64.Type}}),
    #"Filas filtradas1" = Table.SelectRows(#"Filas agrupadas", each ([Recuento] = 2))
in
    #"Filas filtradas1"
```

#### `V_Anomalas`
Filtra ventas duplicadas ocurridas después del 02/05/2025 mediante cruce interno.
```M
let
    Origen = Table.NestedJoin(BD_Ordenes, {"order_id"}, V_Dup_Anomalas, {"order_id"}, "V_Dup_Anomalas", JoinKind.Inner),
    #"Filas filtradas" = Table.SelectRows(Origen, each [created_at] > #datetime(2025, 5, 2, 0, 0, 0))
in
    #"Filas filtradas"
```

#### `VentasDuplicadas`
Aísla ventas con repeticiones impares (`Recuento = 3` o `Recuento = 5`) para verificar la secuencia contable `+ - + = +`.
```M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen, {"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each ([record_type_key] = "SALE")),
    #"Filas agrupadas" = Table.Group(#"Filas filtradas", {"order_id"}, {{"Recuento", each Table.RowCount(_), Int64.Type}}),
    #"Filas filtradas1" = Table.SelectRows(#"Filas agrupadas", each ([Recuento] = 3 or [Recuento] = 5))
in
    #"Filas filtradas1"
```

#### `VentasNegativas`
Identifica ventas registradas con importe de liquidación negativo.
```M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen, {"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each [payout_amount_in_major_units] < 0),
    #"Filas filtradas1" = Table.SelectRows(#"Filas filtradas", each ([record_type_key] = "SALE"))
in
    #"Filas filtradas1"
```

#### `V_Dup_SinNegativos`
Cruza mediante `LeftAnti Join` las ventas duplicadas con las ventas negativas para hallar inconsistencias.
```M
let
    Origen = Table.NestedJoin(VentasDuplicadas, {"order_id"}, VentasNegativas, {"order_id"}, "VentasNegativas", JoinKind.LeftAnti)
in
    Origen
```

---

### B. Auditoría de Reembolsos (Refunds)

#### `RefundsDuplicados`
Aísla reembolsos con secuencias impares (`Recuento = 3` o `Recuento = 5`).
```M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen, {"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each [record_type_key] = "REFUND"),
    #"Filas agrupadas" = Table.Group(#"Filas filtradas", {"order_id"}, {{"Recuento", each Table.RowCount(_), Int64.Type}}),
    #"Filas filtradas1" = Table.SelectRows(#"Filas agrupadas", each ([Recuento] = 3 or [Recuento] = 5))
in
    #"Filas filtradas1"
```

#### `RefundsPositivosEjemplo`
Lista reembolsos no pertenecientes a comisiones con importe positivo (`payout_amount_in_major_units > 0`).
```M
let
    Origen = BD,
    #"Otras columnas quitadas" = Table.SelectColumns(Origen, {"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas1" = Table.SelectRows(#"Otras columnas quitadas", each not Text.Contains([record_type_key], "FEE")),
    #"Filas filtradas" = Table.SelectRows(#"Filas filtradas1", each [payout_amount_in_major_units] > 0),
    #"Filas filtradas2" = Table.SelectRows(#"Filas filtradas", each ([record_type_key] = "REFUND"))
in
    #"Filas filtradas2"
```

#### `R_Dup_SinPositivos`
Aplica un `LeftAnti Join` entre `RefundsDuplicados` y `RefundsPositivosEjemplo`.
```M
let
    Origen = Table.NestedJoin(RefundsDuplicados, {"order_id"}, RefundsPositivosEjemplo, {"order_id"}, "VentasNegativas", JoinKind.LeftAnti)
in
    Origen
```

#### `R_Dup_Anomalos`
Aísla reembolsos con exactamente 2 apariciones (`Recuento = 2`).
```M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen, {"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each [record_type_key] = "REFUND"),
    #"Filas agrupadas" = Table.Group(#"Filas filtradas", {"order_id"}, {{"Recuento", each Table.RowCount(_), Int64.Type}}),
    #"Filas filtradas1" = Table.SelectRows(#"Filas agrupadas", each ([Recuento] = 2))
in
    #"Filas filtradas1"
```

#### `R_Anomalas`
Realiza un `Inner Join` entre `BD_Ordenes` y `R_Dup_Anomalos` para inspeccionar los detalles de la orden de reembolso anómala.
```M
let
    Origen = Table.NestedJoin(BD_Ordenes, {"order_id"}, R_Dup_Anomalos, {"order_id"}, "V_Dup_Anomalas", JoinKind.Inner)
in
    Origen
```

---

## 6. Instrucciones para la Exportación y Uso en GitHub

1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   ```
2. **Ubicación de Datos**:
   Asegúrate de colocar los archivos CSV de cada período dentro de la carpeta `./Finance/Año/MES/Data/`.
3. **Carga en Power BI / Excel**:
   - En el Editor de Power Query, verifica que el parámetro `RutaBase` apunte a `./Finance/` o actualízalo a la carpeta local raíz del proyecto.
   - Haz clic en **Cerrar y aplicar** o **Actualizar todo** para procesar los datos de forma portable.
