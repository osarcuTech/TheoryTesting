Este link muestra el contenido de todas las columnas:
https://docs.solidgate.com/finance/financial-reports/financial-entries/#view-report-data
 
Para este documento necesitarás saber de power query.
Cabe recalcar que no se ha encontrado nada de valor en este Reporte.
 
Para poder tener el documento en un formato utilizable tenemos que hacer los 3 primeros pasos de esto:
 
let
    Origen = Csv.Document(File.Contents("C:\Users\Oscar Ardevol\Downloads\prevention_alerts_120526_134126_tfn_e_docshub_org.csv"),[Delimiter=",", Columns=11, Encoding=1252, QuoteStyle=QuoteStyle.None]),
    #"Encabezados promovidos" = Table.PromoteHeaders(Origen, [PromoteAllScalars=true]),
     #"Valor reemplazado" = Table.ReplaceValue(#"Encabezados promovidos",".",",",Replacer.ReplaceText,{"amount"}),
    #"Tipo cambiado" = Table.TransformColumnTypes(#"Encabezados promovidos",{{"id", type text}, {"amount", Int64.Type}, {"currency", type text}, {"provider_name", type text}, {"alert_date", type datetime}, {"outcome", type text}, {"alert_type", type text}, {"order_id", type text}, {"payment_method", type text}, {"created_at", type datetime}, {"updated_at", type datetime}})
in
    #"Tipo cambiado"