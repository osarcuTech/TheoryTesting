## Transformar archivo de Data
### Consultas auxiliares
#### Archivo de ejemplo
```M
let
    Origen = Folder.Files("C:\Users\Oscar Ardevol\Desktop\InformesSolidgate\Finance\2025\05\Data"),
    Navegación1 = Origen{0}[Content]
in
    Navegación1
```

#### Parámetro1
![alt text](image.png)

#### Archivo de ejemplo

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

## Data
Saca la información de todos los arxivos de 2025 buscando en la carpeta de su mes correspondiente 01 a 12. Tendremos arxivos "identicos" para los años siguientes. La la ruta para la extracción tiene esta estructura.
= Folder.Files("C:\Users\Oscar Ardevol\Desktop\InformesSolidgate\Finance\ **Año**\ **MES**\Data")
Ejemplo:
= Folder.Files("C:\Users\Oscar Ardevol\Desktop\InformesSolidgate\Finance\2025\05\Data")
Todos los documentos en estas carpetas han sido descargados de [[reportes_financieros_solidgate]]

Todos los años y meses se exportaràn con siguiento el ejemplo mostrado a continuación.

### Data_05-2025
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

## BD's

### BD
    - Objetivo: Unificar la información del resto de fuentes.

´´´M
let
    Origen = Table.Combine({#"Data_05-2025", #"Data_06-2025", #"Data_07-2025", #"Data_08-2025", #"Data_09-2025", #"Data_10-2025", #"Data_11-2025", #"Data_12-2025", #"Data_01-2026", #"Data_02-2026", #"Data_03-2026", #"Data_04-2026", #"Data_05-2026", #"Data_06-2026", #"Data_07-2026", #"Data_08-2026"}),
    #"Filas ordenadas" = Table.Sort(Origen,{{"created_at", Order.Ascending}})
in
    #"Filas ordenadas"
´´´

### BD_Ordenes
    - Objetivo: Simplificación de [[PQ_Finances-AppendDisputas_Code#BD]] con el objetivo de retener solo la información necesaria para el analisis de las ventas en [[Orders_BD_FP-SG_Finances]].

´´´M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen,{"order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each not Text.Contains([record_type_key], "FEE"))
in
    #"Filas filtradas"
´´´


### BD_simplified
    - Objetivo: Simplificación de [[PQ_Finances-AppendDisputas_Code#BD_Ordenes]] agrupando las ventas por varios conceptos (ej: Dia, Proveedor, ...) con el objetivo de reducir lo maximo posible el tamaño de la base de datos sin perder información relevante para el analisis de dichas ventas.

´´´M
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
´´´


### BD_simplified_Checkout
    - Objetivo: Fork de [[PQ_Finances-AppendDisputas_Code#BD_simplified]] que filtra solo por Checkout con para servir de fuente para [[Orders_BD_FPS-SG_Finances]].

´´´M
let
    Origen = BD_simplified,
    #"Filas filtradas" = Table.SelectRows(Origen, each ([provider] = "Checkout"))
in
    #"Filas filtradas"
´´´


### BD_lenght
    - Objetivo:

´´´M

´´´




## Comprovaciones
### Ventas
#### V_Dup_Anomalas
- Objetivo: Busca las ventas que tengan un recuento de 2 (potencialmente anomalos). Si se encuentran al principio/final de la bd puede ser causado por falta de información de los meses anteriores/posteriores.

´´´M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen,{"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each ([record_type_key] = "SALE")),
    #"Filas agrupadas" = Table.Group(#"Filas filtradas", {"order_id"}, {{"Recuento", each Table.RowCount(_), Int64.Type}}),
    #"Filas filtradas1" = Table.SelectRows(#"Filas agrupadas", each ([Recuento] = 2))
in
    #"Filas filtradas1"
´´´
#### V_Anomalas
- Objetivo: Filtra las que no se encuentran al principio de la BD para dedicarles especial atención. Las que se encuentren al final de la BD deberian desaparecer con el tiempo.

´´´M
let
    Origen = Table.NestedJoin(BD_Ordenes, {"order_id"}, V_Dup_Anomalas, {"order_id"}, "V_Dup_Anomalas", JoinKind.Inner),
    #"Filas filtradas" = Table.SelectRows(Origen, each [created_at] > #datetime(2025, 5, 2, 0, 0, 0))
in
    #"Filas filtradas"
´´´
### V_OK
- Objetivo: Tratar de ver si las ventas que tiene negativos a su vez son ventas positivas duplicadas.
#### VentasDuplicadas
- Objetivo: Busca aquellas ventas duplicadas que tengan un numero impar de movimientos para ver si es (+-+ = +).

´´´M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen,{"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each ([record_type_key] = "SALE")),
    #"Filas agrupadas" = Table.Group(#"Filas filtradas", {"order_id"}, {{"Recuento", each Table.RowCount(_), Int64.Type}}),
    #"Filas filtradas1" = Table.SelectRows(#"Filas agrupadas", each ([Recuento] = 3 or [Recuento] = 5))
in
    #"Filas filtradas1"
´´´

#### VentasNegativas
- Objetivo: Filtra todas las ventas con importes negativos.

´´´M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen,{"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each [payout_amount_in_major_units] < 0),
    #"Filas filtradas1" = Table.SelectRows(#"Filas filtradas", each ([record_type_key] = "SALE"))
in
    #"Filas filtradas1"
´´´

#### V_Dup_SinNegativos
- Objetivo: Busca si hay alguna venta con importe negativo que a su vez no esté en la tabla [[PQ_Finances-AppendDisputas_Code#VentasDuplicadas]].

´´´M
= Table.NestedJoin(VentasDuplicadas, {"order_id"}, VentasNegativas, {"order_id"}, "VentasNegativas", JoinKind.LeftAnti)
´´´
### Refunds
- Objetivo: Analizar los refunds de forma similar a como lo hemos hecho con las ventas.
#### R_OK
##### RefundsDuplicados
- Objetivo: Lista los refunds duplicados con numeros impares.

´´´M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen,{"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each [record_type_key] = "REFUND"),
    #"Filas agrupadas" = Table.Group(#"Filas filtradas", {"order_id"}, {{"Recuento", each Table.RowCount(_), Int64.Type}}),
    #"Filas filtradas1" = Table.SelectRows(#"Filas agrupadas", each ([Recuento] = 3 or [Recuento] = 5))
in
    #"Filas filtradas1"
´´´

##### RefundsPositivosEjemplo
- Objetivo: Lista los refunds positivos.

´´´M
let
    Origen = BD,
    #"Otras columnas quitadas" = Table.SelectColumns(Origen,{"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas1" = Table.SelectRows(#"Otras columnas quitadas", each not Text.Contains([record_type_key], "FEE")),
    #"Filas filtradas" = Table.SelectRows(#"Filas filtradas1", each [payout_amount_in_major_units] > 0),
    #"Filas filtradas2" = Table.SelectRows(#"Filas filtradas", each ([record_type_key] = "REFUND"))
in
    #"Filas filtradas2"
´´´

##### R_Dup_SinPositivos
- Objetivo: Lista los refunds positivos que no estén duplicados (anomalos).

´´´M
let
    Origen = Table.NestedJoin(RefundsDuplicados, {"order_id"}, RefundsPositivosEjemplo, {"order_id"}, "VentasNegativas", JoinKind.LeftAnti)
in
    Origen
´´´

#### R_Dup_Anomalos
- Objetivo: Busca los refunds que tengan un recuento de 2 (potencialmente anomalos). Si se encuentran al principio/final de la bd puede ser causado por falta de información de los meses anteriores/posteriores.

´´´M
let
    Origen = BD,
    #"Columnas quitadas" = Table.SelectColumns(Origen,{"id", "order_id", "created_at", "amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "record_type_key", "provider", "chargeback_id"}),
    #"Filas filtradas" = Table.SelectRows(#"Columnas quitadas", each [record_type_key] = "REFUND"),
    #"Filas agrupadas" = Table.Group(#"Filas filtradas", {"order_id"}, {{"Recuento", each Table.RowCount(_), Int64.Type}}),
    #"Filas filtradas1" = Table.SelectRows(#"Filas agrupadas", each ([Recuento] = 2))
in
    #"Filas filtradas1"
´´´

#### R_Anomalas
- Objetivo: Filtra las que no se encuentran al principio de la BD para dedicarles especial atención. Las que se encuentren al final de la BD deberian desaparecer con el tiempo. El filtro de fechas no ha sido aplicado como con las ventas ya que, actualmente, todas las potenciales anomalias se encuentran en el primer dia de la BD.

´´´M
let
    Origen = Table.NestedJoin(BD_Ordenes, {"order_id"}, R_Dup_Anomalos, {"order_id"}, "V_Dup_Anomalas", JoinKind.Inner)
in
    Origen
´´´

