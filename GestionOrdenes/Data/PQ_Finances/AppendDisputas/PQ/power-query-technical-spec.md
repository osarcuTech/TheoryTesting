# Especificación Técnica para LLM: Modelo de Datos y Reconciliación en Power Query (M)

Este documento contiene la especificación técnica completa, el flujo de datos y el código en lenguaje **Power Query (M)** extraído del sistema de transformación y reconciliación financiera. Está diseñado para servir como contexto de entrada estructurado para un Modelo de Lenguaje (LLM).

---

## 1. Arquitectura General y Flujo de Procesamiento

El pipeline procesa archivos CSV mensuales con transacciones financieras (ventas, reembolsos y comisiones) distribuidos en una estructura jerárquica de carpetas (`Finance/Año/MES/Data`).

```
[ Archivos CSV Mensuales (Data_MM-YYYY) ]
                    │
                    ▼
            [ BD ] (Tabla Maestra Consolidada)
                    │
         ┌──────────┴──────────────────────────┐
         ▼                                     ▼
 [ BD_Ordenes ]                         [ Comprovaciones ]
         │                            (Auditoría y Análisis de Anomalías)
         ▼
 [ BD_simplified ]
         │
         ▼
 [ BD_simplified_Checkout ]
```

---

## 2. Ingesta y Funciones Auxiliares

### 2.1 Archivo de Ejemplo (`Archivo de ejemplo`)
Extrae la primera muestra de archivo de la carpeta de origen para inferir esquema y encabezados.
```M
let
    Origen = Folder.Files("C:\Users\Oscar Ardevol\Desktop\InformesSolidgate\Finance\2025\05\Data"),
    Navegación1 = Origen{0}[Content]
in
    Navegación1
```

### 2.2 Parámetro1 / Transformar archivo (`Transformar archivo`)
Función personalizada que analiza cada archivo CSV utilizando un delimitador por coma, 27 columnas, codificación Windows-1252 (`1252`) y sin comillas.
```M
let
    Origen = (Parámetro1) => let
        Origen = Csv.Document(Parámetro1,[Delimiter=",", Columns=27, Encoding=1252, QuoteStyle=QuoteStyle.None]),
        #"Encabezados promovidos" = Table.PromoteHeaders(Origen, [PromoteAllScalars=true])
    in
        #"Encabezados promovidos"
in
    Origen
```

### 2.3 Extracción Mensual (`Data_05-2025`)
Procesa y formatea los archivos de cada carpeta mensual (`Finance/2025/05/Data`):
1. Filtra archivos ocultos.
2. Invoca la función personalizada de transformación y expande todas las columnas.
3. Reemplaza el delimitador de punto (`.`) por coma (`,`) en los campos de montos (`amount`, `amount_in_major_units`, `payout_amount`, `payout_amount_in_major_units`).
4. Tipifica campos clave (`created_at`, `transaction_datetime_provider`, `transaction_datetime_utc` a `datetime`; `accounting_date` a `date`; montos en unidades mayores a `number`; identificadores y unidades menores a `text` o `Int64`).

```M
let
    Origen = Folder.Files("C:\Users\Oscar Ardevol\Desktop\InformesSolidgate\Finance\2025\05\Data"),
    #"Archivos ocultos filtrados1" = Table.SelectRows(Origen, each [Attributes]?[Hidden]? <> true),
    #"Invocar función personalizada1" = Table.AddColumn(#"Archivos ocultos filtrados1", "Transformar archivo", each #"Transformar archivo"([Content])),
    #"Columnas con nombre cambiado1" = Table.RenameColumns(#"Invocar función personalizada1", {"Name", "Source.Name"}),
    #"Otras columnas quitadas1" = Table.SelectColumns(#"Columnas con nombre cambiado1", {"Source.Name", "Transformar archivo"}),
    #"Columna de tabla expandida1" = Table.ExpandTableColumn(#"Otras columnas quitadas1", "Transformar archivo", Table.ColumnNames(#"Transformar archivo"(#"Archivo de ejemplo"))),
    #"Valor reemplazado" = Table.ReplaceValue(#"Columna de tabla expandida1",".",",",Replacer.ReplaceText,{"amount", "amount_in_major_units", "payout_amount", "payout_amount_in_major_units"}),
    #"Tipo cambiado" = Table.TransformColumnTypes(#"Valor reemplazado",{{"Source.Name", type text}, {"id", type text}, {"order_id", type text}, {"external_psp_order_id", type text}, {"created_at", type datetime}, {"transaction_datetime_provider", type datetime}, {"transaction_datetime_utc", type datetime}, {"accounting_date", type date}, {"amount", type number}, {"amount_in_major_units", type number}, {"currency", type text}, {"currency_minor_units", Int64.Type}, {"payout_amount", Int64.Type}, {"payout_amount_in_major_units", type number}, {"payout_currency", type text}, {"payout_currency_minor_units", Int64.Type}, {"record_type_key", type text}, {"provider", type text}, {"payment_method", type text}, {"card_brand", type text}, {"geo_country", type text}, {"issuing_country", type text}, {"transaction_id", type text}, {"chargeback_id", Int64.Type}, {"legal_entity", type text}, {"order_description", type text}, {"product_id", type any}, {"product_name", type any}})
in
    #"Tipo cambiado"
```

---

## 3. Consultas Principales de la Base de Datos (BD's)

### 3.1 `BD` (Base de Datos Consolidada)
Unifica todas las cargas mensuales (`Data_05-2025` a `Data_08-2026`) en un único conjunto de datos ordenado por fecha de creación.
```M
let
    Origen = Table.Combine({
        #"Data_05-2025", #"Data_06-2025", #"Data_07-2025", #"Data_08-2025",
        #"Data_09-2025", #"Data_10-2025", #"Data_11-2025", #"Data_12-2025",
        #"Data_01-2026", #"Data_02-2026", #"Data_03-2026", #"Data_04-2026",
        #"Data_05-2026", #"Data_06-2026", #"Data_07-2026", #"Data_08-2026"
    }),
    #"Filas ordenadas" = Table.Sort(Origen,{{"created_at", Order.Ascending}})
in
    #"Filas ordenadas"
```

### 3.2 `BD_Ordenes`
Filtra la tabla consolidada `BD` reteniendo únicamente los campos requeridos para el análisis de ventas y excluyendo explícitamente los registros de comisiones (`FEE`).
```M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen,{"order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each not Text.Contains([record_type_key], "FEE"))
in
    #"Filas filtradas"
```

### 3.3 `BD_simplified`
Agrupa las ventas por fecha, moneda, moneda de pago, tipo de registro y proveedor para reducir sustancialmente el volumen de datos manteniendo métricas financieras agregadas.
```M
let
    Origen = BD_Ordenes,
    #"Columnas quitadas" = Table.RemoveColumns(Origen,{"order_id"}),
    #"Tipo cambiado1" = Table.TransformColumnTypes(#"Columnas quitadas",{{"created_at", type date}}),
    #"Personalizada agregada" = Table.AddColumn(#"Tipo cambiado1", "Classificador", each Date.ToText([created_at]) &"-"& [currency] &"-"& [payout_currency] &"-"& [record_type_key] &"-"& [provider]),
    #"Filas agrupadas" = Table.Group(#"Personalizada agregada", {"Classificador"}, {{"amount_in_major_units", each List.Sum([amount_in_major_units]), type nullable number}, {"payout_amount_in_major_units", each List.Sum([payout_amount_in_major_units]), type nullable number}}),
    #"Dividir columna por delimitador" = Table.SplitColumn(#"Filas agrupadas", "Classificador", Splitter.SplitTextByDelimiter("-", QuoteStyle.Csv), {"Classificador.1", "Classificador.2", "Classificador.3", "Classificador.4", "Classificador.5"}),
    #"Tipo cambiado" = Table.TransformColumnTypes(#"Dividir columna por delimitador",{{"Classificador.1", type date}}),
    #"Columnas con nombre cambiado" = Table.RenameColumns(#"Tipo cambiado",{{"Classificador.1", "created_at"}, {"payout_amount_in_major_units", "payout_amount_in_major_units"}, {"Classificador.2", "currency"},{"Classificador.3", "payout_currency"}, {"Classificador.4", "record_type_key"}, {"Classificador.5", "provider"}}),
    #"Columnas reordenadas" = Table.ReorderColumns(#"Columnas con nombre cambiado",{"created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider"})
in
    #"Columnas reordenadas"
```

### 3.4 `BD_simplified_Checkout`
Filtro directo sobre `BD_simplified` centrado exclusivamente en el proveedor Checkout.
```M
let
    Origen = BD_simplified,
    #"Filas filtradas" = Table.SelectRows(Origen, each ([provider] = "Checkout"))
in
    #"Filas filtradas"
```

---

## 4. Módulo de Comprobaciones y Auditoría

### 4.1 Auditoría de Ventas (`SALE`)

#### `V_Dup_Anomalas`
Detecta órdenes de venta (`SALE`) con un recuento exacto de 2 apariciones (posibles duplicados en cortes de mes).
```M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen,{"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each ([record_type_key] = "SALE")),
    #"Filas agrupadas" = Table.Group(#"Filas filtradas", {"order_id"}, {{"Recuento", each Table.RowCount(_), Int64.Type}}),
    #"Filas filtradas1" = Table.SelectRows(#"Filas agrupadas", each ([Recuento] = 2))
in
    #"Filas filtradas1"
```

#### `V_Anomalas`
Cruza `BD_Ordenes` con `V_Dup_Anomalas` mediante `JoinKind.Inner` por `order_id` y aísla registros posteriores al `02/05/2025`.
```M
let
    Origen = Table.NestedJoin(BD_Ordenes, {"order_id"}, V_Dup_Anomalas, {"order_id"}, "V_Dup_Anomalas", JoinKind.Inner),
    #"Filas filtradas" = Table.SelectRows(Origen, each [created_at] > #datetime(2025, 5, 2, 0, 0, 0))
in
    #"Filas filtradas"
```

#### `VentasDuplicadas`
Agrupa ventas y filtra aquellas con recuentos impares (`Recuento = 3` o `Recuento = 5`) para verificar la compensación contable `(+ - + = +)`.
```M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen,{"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each ([record_type_key] = "SALE")),
    #"Filas agrupadas" = Table.Group(#"Filas filtradas", {"order_id"}, {{"Recuento", each Table.RowCount(_), Int64.Type}}),
    #"Filas filtradas1" = Table.SelectRows(#"Filas agrupadas", each ([Recuento] = 3 or [Recuento] = 5))
in
    #"Filas filtradas1"
```

#### `VentasNegativas`
Identifica ventas cuyos cobros tienen valores negativos (`payout_amount_in_major_units < 0`).
```M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen,{"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each [payout_amount_in_major_units] < 0),
    #"Filas filtradas1" = Table.SelectRows(#"Filas filtradas", each ([record_type_key] = "SALE"))
in
    #"Filas filtradas1"
```

#### `V_Dup_SinNegativos`
Aplica un cruce anti-izquierda (`JoinKind.LeftAnti`) entre `VentasDuplicadas` y `VentasNegativas` por `order_id`.
```M
Table.NestedJoin(VentasDuplicadas, {"order_id"}, VentasNegativas, {"order_id"}, "VentasNegativas", JoinKind.LeftAnti)
```

---

### 4.2 Auditoría de Reembolsos (`REFUND`)

#### `RefundsDuplicados`
Filtra registros de reembolso (`REFUND`) con un recuento impar (`Recuento = 3` o `Recuento = 5`).
```M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen,{"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each [record_type_key] = "REFUND"),
    #"Filas agrupadas" = Table.Group(#"Filas filtradas", {"order_id"}, {{"Recuento", each Table.RowCount(_), Int64.Type}}),
    #"Filas filtradas1" = Table.SelectRows(#"Filas agrupadas", each ([Recuento] = 3 or [Recuento] = 5))
in
    #"Filas filtradas1"
```

#### `RefundsPositivosEjemplo`
Detecta reembolsos no pertenecientes a comisiones con importes de liquidación positivos (`payout_amount_in_major_units > 0`).
```M
let
    Origen = BD,
    #"Otras columnas quitadas" = Table.SelectColumns(Origen,{"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas1" = Table.SelectRows(#"Otras columnas quitadas", each not Text.Contains([record_type_key], "FEE")),
    #"Filas filtradas" = Table.SelectRows(#"Filas filtradas1", each [payout_amount_in_major_units] > 0),
    #"Filas filtradas2" = Table.SelectRows(#"Filas filtradas", each ([record_type_key] = "REFUND"))
in
    #"Filas filtradas2"
```

#### `R_Dup_SinPositivos`
Combina `RefundsDuplicados` con `RefundsPositivosEjemplo` mediante `JoinKind.LeftAnti` por `order_id`.
```M
let
    Origen = Table.NestedJoin(RefundsDuplicados, {"order_id"}, RefundsPositivosEjemplo, {"order_id"}, "VentasNegativas", JoinKind.LeftAnti)
in
    Origen
```

#### `R_Dup_Anomalos`
Aísla reembolsos que se repiten exactamente 2 veces.
```M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen,{"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each [record_type_key] = "REFUND"),
    #"Filas agrupadas" = Table.Group(#"Filas filtradas", {"order_id"}, {{"Recuento", each Table.RowCount(_), Int64.Type}}),
    #"Filas filtradas1" = Table.SelectRows(#"Filas agrupadas", each ([Recuento] = 2))
in
    #"Filas filtradas1"
```

#### `R_Anomalas`
Realiza un `JoinKind.Inner` entre `BD_Ordenes` y `R_Dup_Anomalos` para inspección detallada de reembolsos anómalos.
```M
let
    Origen = Table.NestedJoin(BD_Ordenes, {"order_id"}, R_Dup_Anomalos, {"order_id"}, "V_Dup_Anomalas", JoinKind.Inner)
in
    Origen
```
