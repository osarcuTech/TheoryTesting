Este link muestra el contenido de todas las columnas:
https://docs.solidgate.com/finance/financial-reports/financial-entries/#view-report-data
 
Para este documento necesitarás saber de power query.
 
Para poder tener el documento en un formato utilizable tenemos que hacer los 4 primeros pasos de esto:
 
[let
    Origen = Csv.Document(File.Contents("C:\Users\Oscar Ardevol\Downloads\fin_080426_085523_tfn_e_docshub_org.csv"),[Delimiter=",", Columns=25, Encoding=1252, QuoteStyle=QuoteStyle.None]),
    #"Encabezados promovidos" = Table.PromoteHeaders(Origen, [PromoteAllScalars=true]),
    #"Valor reemplazado" = Table.ReplaceValue(#"Encabezados promovidos",".",",",Replacer.ReplaceText,{"amount_in_major_units", "payout_amount", "payout_amount_in_major_units"}),
    #"Tipo cambiado" = Table.TransformColumnTypes(#"Valor reemplazado",{{"id", type text}, {"order_id", type text}, {"external_psp_order_id", type text}, {"created_at", type datetime}, {"transaction_datetime_provider", type datetime}, {"transaction_datetime_utc", type datetime}, {"accounting_date", type date}, {"amount", Int64.Type}, {"amount_in_major_units", type number}, {"currency", type text}, {"currency_minor_units", Int64.Type}, {"payout_amount", type number}, {"payout_amount_in_major_units", type number}, {"payout_currency", type text}, {"payout_currency_minor_units", Int64.Type}, {"record_type_key", type text}, {"provider", type text}, {"payment_method", type text}, {"card_brand", type text}, {"geo_country", type text}, {"issuing_country", type text}, {"transaction_id", type text}, {"chargeback_id", type text}, {"legal_entity", type text}, {"order_description", type text}}),
    #"Filas filtradas" = Table.SelectRows(#"Tipo cambiado", each ([record_type_key] = "CHARGEBACK" or [record_type_key] = "RDR" or [record_type_key] = "RDR_REVERSED" or [record_type_key] = "REFUND" or [record_type_key] = "SALE") and ([provider] = "Checkout")),
    #"Columnas quitadas" = Table.RemoveColumns(#"Filas filtradas",{"id", "external_psp_order_id", "transaction_datetime_provider", "transaction_datetime_utc", "accounting_date", "amount", "currency_minor_units", "payout_amount", "payout_currency_minor_units", "payment_method", "card_brand", "geo_country", "issuing_country", "transaction_id", "legal_entity", "order_description"}),
    #"Personalizada agregada" = Table.AddColumn(#"Columnas quitadas", "TipoCambio", each [amount_in_major_units]/[payout_amount_in_major_units])
in
    #"Personalizada agregada"
 
 
Sin los 4 pasos anteriores sobre los datos crudos resulta realmente difícil usar los datos ya que tanto excel como sheets les aplican cambios (al formatear) que los dejan inservibles.
El 5o paso filtra manteniendo solo los pagos procesados (Ventas y Refunds). Luego vimos que era necesario añadir los RDR ya que forman parte de los considerados Chargeback's.
En el 6o paso eliminamos las columnas que consideramos que 
En el 7o añadimos el tipo de cambio.
-------------------
 
Los siguientes apartados han sido experimentos que hemos realizado para tratar de concretar el tipo de cambio:
 
Aquí tratamos de ver el tipo de cambio por día y vimos que habían hasta 3 por día:
 
let
    Origen = BD,
    #"Filas filtradas" = Table.SelectRows(Origen, each ([record_type_key] = "SALE")),
    #"Columnas quitadas" = Table.RemoveColumns(#"Filas filtradas",{"order_id", "amount_in_major_units", "payout_amount_in_major_units", "record_type_key", "provider", "chargeback_id"}),
    #"Tipo cambiado" = Table.TransformColumnTypes(#"Columnas quitadas",{{"created_at", type date}}),
    #"Filas agrupadas" = Table.Group(#"Tipo cambiado", {"created_at", "currency", "payout_currency", "TipoCambio"}, {{"Recuento", each Table.RowCount(_), Int64.Type}}),
    #"Filas ordenadas" = Table.Sort(#"Filas agrupadas",{{"created_at", Order.Ascending}})
in
    #"Filas ordenadas"
-----------------------
 
Luego valoramos sacar el promedio de tipo de cambio por día de la siguiente forma:
 
let
    Origen = BD,
    #"Filas filtradas" = Table.SelectRows(Origen, each ([record_type_key] = "SALE")),
    #"Columnas quitadas" = Table.RemoveColumns(#"Filas filtradas",{"order_id", "amount_in_major_units", "payout_amount_in_major_units", "record_type_key", "provider", "chargeback_id"}),
    #"Tipo cambiado" = Table.TransformColumnTypes(#"Columnas quitadas",{{"created_at", type date}}),
    #"Filas agrupadas" = Table.Group(#"Tipo cambiado", {"created_at", "currency", "payout_currency"}, {{"Recuento", each List.Median([TipoCambio]), type number}}),
    #"Filas ordenadas" = Table.Sort(#"Filas agrupadas",{{"created_at", Order.Ascending}})
in
    #"Filas ordenadas"
-------------------------------------
 
 
Por último valoramos sacar el tipo de cambio/orden de la siguiente forma:
 
let
    Origen = BD,
    #"Columnas quitadas" = Table.RemoveColumns(Origen,{"amount_in_major_units", "currency", "payout_amount_in_major_units", "payout_currency", "provider", "chargeback_id"})
in
    #"Columnas quitadas"
 
De este modo nos dimos cuenta que los Refunds presentaban un tipo de cambio muy distinto de los sales, llegando a la conclusión que los importes se sobrescribían y que deberíamos averiguar el tipo de cambio al dia de la venta y al día del refund para hacer el match con los Settlements. 
---------------------
 
Aquí, aislamos las disputas. 
 
let
    Origen = Csv.Document(File.Contents("C:\Users\Oscar Ardevol\Downloads\fin_120526_103432_itin_norgenic.csv"),[Delimiter=",", Columns=25, Encoding=1252, QuoteStyle=QuoteStyle.None]),
    #"Encabezados promovidos" = Table.PromoteHeaders(Origen, [PromoteAllScalars=true]),
    #"Valor reemplazado" = Table.ReplaceValue(#"Encabezados promovidos",".",",",Replacer.ReplaceText,{"amount_in_major_units", "payout_amount", "payout_amount_in_major_units"}),
    #"Tipo cambiado" = Table.TransformColumnTypes(#"Valor reemplazado",{{"id", type text}, {"order_id", type text}, {"external_psp_order_id", type text}, {"created_at", type datetime}, {"transaction_datetime_provider", type datetime}, {"transaction_datetime_utc", type datetime}, {"accounting_date", type date}, {"amount", Int64.Type}, {"amount_in_major_units", type number}, {"currency", type text}, {"currency_minor_units", Int64.Type}, {"payout_amount", type number}, {"payout_amount_in_major_units", type number}, {"payout_currency", type text}, {"payout_currency_minor_units", Int64.Type}, {"record_type_key", type text}, {"provider", type text}, {"payment_method", type text}, {"card_brand", type text}, {"geo_country", type text}, {"issuing_country", type text}, {"transaction_id", type text}, {"chargeback_id", type text}, {"legal_entity", type text}, {"order_description", type text}}),
    #"Filas filtradas" = Table.SelectRows(#"Tipo cambiado", each ([record_type_key] = "REFUND" or [record_type_key] = "CHARGEBACK" or [record_type_key] = "RDR" or [record_type_key] = "SALE") and ([provider] = "Checkout")),
    #"Personalizada agregada" = Table.AddColumn(#"Filas filtradas", "TipoCambio", each [amount_in_major_units]/[payout_amount_in_major_units]),
    #"Filas filtradas1" = Table.SelectRows(#"Personalizada agregada", each ([chargeback_id] <> "")),
    #"Columnas quitadas" = Table.RemoveColumns(#"Filas filtradas1",{"id", "external_psp_order_id", "amount", "amount_in_major_units", "currency", "currency_minor_units", "payout_amount", "payout_amount_in_major_units", "payout_currency", "payout_currency_minor_units", "payment_method", "card_brand", "geo_country", "issuing_country", "transaction_id", "legal_entity", "order_description", "TipoCambio", "transaction_datetime_provider", "transaction_datetime_utc", "accounting_date"})
in
    #"Columnas quitadas"
Esto deja solo las columnas relevantes para asociar una disputa a una orden y devolver como se registra en el Settlement.
 
Con ello confirmamos que los RDR's aparecen como "Ventas" y no como "Refunds" en el Hub de Ordenes de Solidgate. Hemos de tener en cuenta que cuando se actualiza la fecha de una disputa no lo hace la de su orden correspondiente. Por ello, debería considerar hacer el upsert dependiente de la columna dispute status.
 