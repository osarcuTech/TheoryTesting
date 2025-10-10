Permítame desglosar el análisis detallado de la arquitectura de datos dentro del spreadsheet, centrándome en el contenido, las funciones y las interconexiones de las hojas de cálculo clave.

El ecosistema de reporting de Norgenic está compuesto por al menos ocho archivos o "hojas" interconectadas, diseñadas para transformar los movimientos bancarios brutos y los datos de facturación en informes de flujo de caja (Cash Flow) y análisis de costes operativos. La relación entre las hojas es altamente sofisticada, empleando un método de "punteo" (conciliación) basado en reglas para automatizar la contabilidad.

I. Arquitectura de Datos del Sistema de Reporting
El sistema está cimentado en bases de datos de movimientos bancarios y facturas, y utiliza hojas analíticas y de automatización para generar el Cash Flow y el reporting de proveedores.




1.  BD_Banco (Base de Datos Central del Banco)
Esta hoja es la fuente primaria de datos de tesorería de Norgenic, registrando todas las transacciones de su cuenta principal en CaixaBank (identificador 0087231).

Columna	Contenido y Propósito
Fecha, Fecha valor	Fechas de registro y de efectividad del movimiento.
Movimiento, Más datos	Descripción del concepto de la transacción (ej: PAG NOMINAS, CURRENCYAPI.COM, WEB355784927 2811).
Importe	
Valor monetario de la transacción. Las salidas (pagos) se muestran como negativos , y las entradas como positivos.   

Saldo	Saldo de la cuenta después de cada transacción.



2. BD_Facturas (Base de Datos de Facturas Emitidas/Recibidas)
Contiene información de las facturas gestionadas por Norgenic.   

Columna	Propósito Clave
UID (Identificador Único)	
Es el formato de referencia para el punteo, combinando Fecha, Proveedor, Importe, Moneda y Número de factura (ej: "01/03/2025_MailgunTechnologies_69,00_€_77495581_Norgenic").   

  


3. PerfilProveedores.csv / Asig.Costes.csv (Costeo y Reglas de Conciliación)
Estas hojas definen cómo Norgenic clasifica y contabiliza los pagos a sus proveedores, siendo cruciales para la automatización y el análisis de costes.   

Columna	Contenido y Uso de Fórmulas
Empresas	
Nombre del Proveedor (ej: Ahrefs, DigitalOcean, OVHcloud).   

Movimiento A/B/C, Mas Datos	
Contienen los textos o patrones de búsqueda que la automatización utiliza para identificar la transacción en el banco, permitiendo el punteo.   

Coste F/V/P	
Clasificación del Coste (Fijo, Variable o Parcial/Periodificado).   

Departamento, Categoria, Concepto, Frequencia	
Estructura analítica de costes (ej: Marketing, SEO, Mensual), permitiendo el costeo multi-departamental.   

Patron+Minimo, Patron+Maximo, Importe	
Se utilizan como parámetros de las fórmulas de punteo. Por ejemplo, para Ahrefs, los campos de patrón, como Movimiento+Importe+Fecha, y valores de importe (1,00) son utilizados para la conciliación.   

Sincrona, F.Cobro, F.Fra, Alerta	
Controles para el proceso de facturación (ej: Síncrona indica si el cobro debe ser instantáneo; Alerta es un control de back office).   

Función del Punteo Automático: Las columnas Patron+Minimo y Patron+Maximo de PerfilProveedores.csv se usan en conjunción con los campos de fecha (Fecha Fija, F.Cobro) para definir la tolerancia de días permitida al buscar una coincidencia entre la factura y el movimiento bancario. Esto simula una función de conciliación automática.   

4. CashFlow.csv y CashFlowDin.Table.csv (Informes Financieros Clave)
Estas hojas son los outputs finales del sistema y contienen el resumen del flujo de caja.

Archivo	Contenido Clave y Propósito
CashFlow.csv	
Presenta una proyección mensual de la liquidez (Caja que tengo en el banco). Contiene las entradas (CFF in, CFO in) y salidas (CFF out, CFO out) de caja segregadas por mes (Ene-25 a Dic-26).   

CashFlowDin.Table.csv	
Es una tabla dinámica que consolida los totales de los movimientos de caja, categorizados por CF in/out y CF category (ej: Bancos, Proveedores). Esta hoja es la base para calcular las métricas críticas, como la liquidez y el Burn Rate.   

Fórmulas Implícitas (Ejemplo): Las celdas en CashFlow.csv contienen sumas complejas (SUM) que agregan el campo Importe del archivo Movimientos_cuenta_0087231.csv según el PeriodoCobro y la CF category, permitiendo la vista mensual del flujo de caja.   

5. Hojas Específicas y de Control
Archivo	Contenido Clave y Propósito
ResumenPlataformas.csv	
Detalla las transacciones mensuales por plataforma de pago (CheckOut, Adyen, Solid Processing), desglosando PayOuts, Fees y Otros Gastos. Es crucial para el análisis de costes variables y la eficiencia de las pasarelas de pago.   

FacturasPendientes.csv	
Una lista de control manual, utilizada para registrar el estado de las facturas que están pendientes de puntear o de recibir. Las columnas UID, Pedida, Fecha, Empresa, Importe rastrean los pasivos no liquidados, mitigando el riesgo de pasivo oculto.   

Links.csv	
Mapea los procesos automatizados (flujos n8n) con sus carpetas de origen y destino en Google Drive. Esta hoja es el backbone de la infraestructura de automatización de datos.   

Google.csv / Nexmo.csv	
Son bases de datos de movimientos que requieren un tratamiento especial, como los micropagos de Google Ads  o los pagos de telecomunicaciones de Nexmo , que a menudo se consolidan para su posterior conciliación en la hoja principal de movimientos bancarios.   

II. El Proceso de Punteo (Conciliación) y Clasificación
El sistema de Norgenic utiliza una lógica avanzada para el Punteo (Conciliación), que es el proceso de igualar las facturas pendientes de pago/cobro con los movimientos reales del banco:

Generación de Movimiento Bancario (BD_Banco): Los movimientos se importan a Movimientos_cuenta_0087231.csv.   

Generación de Factura (BD_Facturas): Las facturas se registran con un UID único.   

Búsqueda Automática (PerfilProveedores): El sistema consulta PerfilProveedores.csv para obtener los patrones de texto y la tolerancia de fecha (Patron+Minimo, Patron+Maximo) para cada proveedor.   

Conciliación / Punteo: Se aplica una fórmula (o automatización) que busca un Movimiento en Movimientos_cuenta_0087231.csv que coincida con el Importe y el Movimiento (o Más datos) según los patrones de PerfilProveedores.csv.   

Clasificación de Cash Flow: Una vez punteado (conciliado), el movimiento bancario se clasifica automáticamente en la columna CF category (Ventas, Salarios, Proveedores, Impuestos) y se etiqueta como In_CFO, Out_CFO, In_CFF o Out_CFF.   

Reporte Final (CashFlow.csv): Los totales clasificados (CF category, CF in/out) se agregan a través de fórmulas de suma para construir el informe de Cash Flow mensual y trimestral.   

Este proceso detalla una operación financiera que depende de la precisión de las reglas de búsqueda (Regex) definidas en el archivo de perfiles para reducir al mínimo la intervención manual.