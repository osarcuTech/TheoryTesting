Comprendido. Como experto en n8n, analizo el archivo JSON del flujo de trabajo "PuntearFacturasBancos TestSimplificar" y detallo la función de cada nodo en orden.

Este flujo de trabajo parece estar diseñado para conciliar facturas con movimientos bancarios registrados en Google Sheets, marcando las facturas como "Punteada" (conciliadas) e insertando el identificador de factura (UID) en el registro bancario. También maneja diferentes patrones de proveedor, divisas, y notifica por email si hay excepciones.

A continuación, se lista cada nodo en el orden aproximado de ejecución y se explica su función:

## **Flujo Principal y Preparación de Datos**

| \# | Nombre del Nodo | Tipo de Nodo | Función Detallada |
| :---- | :---- | :---- | :---- |
| 1 | **When clicking ‘Test workflow’** | manualTrigger | Inicia el flujo manualmente, útil para pruebas. (Conecta a Wait1) |
| 2 | **Google Sheets Trigger** | googleSheetsTrigger | Define un punto de entrada para el flujo, disparándose cada minuto ante una nueva fila (rowAdded) en la hoja de Google Sheets. (Conecta a Wait1) |
| 3 | **When Executed by Another Workflow** | executeWorkflowTrigger | Permite que el flujo sea ejecutado por otro flujo de trabajo. (Conecta a Wait1) |
| 4 | **Wait1** | wait | Introduce un retraso de 0 segundos, actuando como un punto de convergencia o sincronización inicial para los diferentes disparadores. (Conecta a Execute Workflow y Google Sheets HistoricoBancoBD) |
| 5 | **Execute Workflow** | executeWorkflow | (Deshabilitado) Diseñado para ejecutar otro flujo de trabajo (qg6VpJduAic9a4uj). |
| 6 | **Google Sheets HistoricoBancoBD** | googleSheets | Lee datos del Google Sheet del histórico bancario (1963712436), filtrando por la columna "Filtro existente n8n" \= "1" y "CF category" \= "Proveedores", y donde "NombreFactura" esté vacío. |
| 7 | **Filter4** | filter | Filtra los registros bancarios para procesar solo aquellos con un **importe negativo** ($json.Importe \< 0), indicando un gasto o pago. |
| 8 | **Edit Fields Histórico BancoBD** | set | Prepara y estandariza los datos de los movimientos bancarios, asegurando que los campos relevantes como row\_number, Fecha, Movimiento, Importe, etc., estén presentes. |
| 9 | **Aggregate** | aggregate | Agrupa todos los elementos del flujo en un solo elemento, almacenando la lista de movimientos bancarios filtrados en el campo BD\_Banco para su uso posterior en bucles. (Conecta a Google Sheets HistoricoFacturas) |
| 10 | **Google Sheets HistoricoFacturas** | googleSheets | Lee datos de la hoja de cálculo de facturas (1839937135), filtrando por facturas **no punteadas** ("Punteada" no esté presente/vacía) y con "Filtro existente n8n" \= "1". |
| 11 | **Filter1** | filter | Filtra las facturas obtenidas para asegurarse de que el campo Punteada esté **vacío** (empty) y el UID **no esté vacío** (notEmpty). |
| 12 | **Edit Fields Histórico Facturas** | set | Estandariza los campos de las facturas (Fecha, Importe, Proveedor, UID, etc.) antes de la lógica de conciliación. |
| 13 | **If Recurrentes** | if | Evalúa si el Proveedor de la factura coincide con una lista extensa de proveedores recurrentes, decidiendo el camino de procesamiento. (Si es recurrente, a If Recibo; si no, a Gmail EmpresasNoAsignadas) |
| 14 | **Gmail EmpresasNoAsignadas** | gmail | (Deshabilitado) Envía una notificación por email si el proveedor de la factura **no es recurrente** (camino falso de If Recurrentes). |

---

## **Lógica de Conciliación por Factura**

### **Nivel 1: Recibo o Factura Estándar**

| \# | Nombre del Nodo | Tipo de Nodo | Función Detallada |
| :---- | :---- | :---- | :---- |
| 15 | **If Recibo** | if | Comprueba si el campo Facturas contiene las palabras "RECEIPT" o "Receipt", indicando que se trata de un recibo. (Si es recibo, a If9; si no, a If Sincronica1) |
| 16 | **If9** | if | Comprueba si el proveedor **no es** Slack o Make. (Si no es Slack/Make, a Google Sheets HistoricoFacturas23; si es Slack/Make, a If Sincronica1) |
| 17 | **Google Sheets HistoricoFacturas23** | googleSheets | Marca la factura como **conciliada** (Punteada \= "Si") en la hoja de facturas (para recibos/gastos menores). (Conecta a If Sincronica1) |
| 18 | **If Sincronica1** | if | Evalúa si el Proveedor de la factura es uno de los listados (Ahrefs, AnswerThePublic, etc.) que siguen patrones de sincronización específicos. (Si es uno de la lista, a If €; si no, a If PatronNombreSimple) |

---

### **Nivel 2: Conciliación por Divisa (€/$)**

| \# | Nombre del Nodo | Tipo de Nodo | Función Detallada |
| :---- | :---- | :---- | :---- |
| 19 | **If €** | if | Si el proveedor es de los listados en If Sincronica1, comprueba si la divisa es **Euro** ($json\['€/$'\] \= '€'). (Si es €, a If QFras€; si no, a If QFras$) |
| 20 | **If QFras€** | if | Si es Euro, comprueba si el proveedor está en la lista de facturas **únicas en €** (Ahrefs, AnswerThePublic, etc.). (Si es única, a Switch Sincronica€FraUnica; si es múltiple, a Switch Sincronica€FraMultiple) |
| 21 | **If QFras$** | if | Si es Dólar, comprueba si el proveedor está en la lista de facturas **únicas en $** (DigitalOcean, Everapi, etc.). (Si es única, a Switch Factura Unica; si es múltiple, a SwitchVariasFacturas) |

---

### **Nivel 3: Lógica por Proveedor y Conciliación Final**

El flujo se divide en ramas para manejar diferentes tipos de conciliación. El patrón general es: **Switch** (mapea proveedor), **Set** (establece datos), **Set** (extrae movimientos bancarios), **Split Out** (divide movimientos), **Filter** (busca el movimiento bancario coincidente), **Set** (prepara datos para actualización), **Wait**, **Google Sheets** (actualiza banco), **Google Drive** (mueve archivo).

#### **Rama A: Factura Única en € (Switch Sincronica€FraUnica)**

| \# | Nombre del Nodo | Tipo de Nodo | Función Detallada |
| :---- | :---- | :---- | :---- |
| 22 | **Switch Sincronica€FraUnica** | switch | Mapea el nombre del proveedor a un patrón de texto bancario para facturas únicas en €. (Ej: Ahrefs \-\> Ahrefs, Paddle \-\> PADDLE.NET\* EBNHO). (Conecta a Loop Over Items14) |
| 23 | **Loop Over Items14** | splitInBatches | Itera sobre las facturas que han coincidido en esta rama. |
| 24 | **ProveedorPersonalizado** | set | Establece el nombre estandarizado del proveedor (usando la salida del Switch o un if de respaldo), además de los datos de la factura (UID, Importe, etc.). |
| 25 | **Edit Fields LinkBD\_Banco** | set | Prepara el array de movimientos bancarios (BD\_Banco) obtenidos en el nodo Aggregate para su procesamiento. |
| 26 | **Split Out** | splitOut | Divide el array BD\_Banco en elementos separados, uno por cada movimiento bancario. |
| 27 | **Filtro Proveedores € Sincronicas Unicas** | filter | Busca el movimiento bancario que coincide con la factura, comparando: 1\) Patrón de Movimiento (contiene Proveedor), 2\) Fecha es igual, 3\) Importe es igual pero en negativo. |
| 28 | **Edit Fields** | set | Prepara el movimiento bancario coincidente con el UID de la factura, listo para actualizar el banco. (Conecta a Wait2) |

#### **Rama B: Facturas Múltiples en € (Switch Sincronica€FraMultiple)**

| \# | Nombre del Nodo | Tipo de Nodo | Función Detallada |
| :---- | :---- | :---- | :---- |
| 29 | **Switch Sincronica€FraMultiple** | switch | Mapea el proveedor para facturas múltiples en €. (Ej: DonDominio \-\> DONDOMINIO-MRDOMA). (Conecta a Loop Over Items15) |
| 30 | **Loop Over Items15** | splitInBatches | Itera sobre las facturas de esta rama. |
| 31 | **Edit Fields € Sincronicas Multiples** | set | Establece el nombre estandarizado del proveedor y los datos de la factura. |
| 32 | **Edit Fields LinkBD\_Banco4** | set | Prepara el array de movimientos bancarios (BD\_Banco). |
| 33 | **Split Out4** | splitOut | Divide el array BD\_Banco en elementos separados (movimientos bancarios). |
| 34 | **Filtro Proveedores € Sincronicas Unicas1** | filter | Busca el movimiento bancario coincidente con la factura (misma lógica que la Rama A). |
| 35 | **Edit Fields1** | set | Prepara el movimiento bancario coincidente con el UID de la factura. (Conecta a Wait2) |

#### **Rama C: Factura Única en $ (Switch Factura Unica)**

| \# | Nombre del Nodo | Tipo de Nodo | Función Detallada |
| :---- | :---- | :---- | :---- |
| 36 | **Switch Factura Unica** | switch | Mapea el proveedor a un patrón de texto bancario para facturas únicas en $. (Ej: Everapi \-\> CURRENCYAPI.COM, GitHub \-\> GITHUB, INC.). (Conecta a Loop Over Items10) |
| 37 | **Loop Over Items10** | splitInBatches | Itera sobre las facturas de esta rama. |
| 38 | **ProveedorPersonalizado1** | set | Establece el nombre estandarizado del proveedor y los datos de la factura. |
| 39 | **Edit Fields LinkBD\_Banco1** | set | Prepara el array de movimientos bancarios (BD\_Banco). |
| 40 | **Split Out1** | splitOut | Divide el array BD\_Banco en elementos separados. |
| 41 | **Filtro Proveedores $ Sincronicas Unicas** | filter | Busca el movimiento bancario, comparando: 1\) Patrón de Movimiento (contiene Proveedor), 2\) Fecha es igual. |
| 42 | **Filter NoFacturaPunteada2** | filter | Asegura que el movimiento bancario encontrado aún **no tiene factura asociada** (NombreFactura está vacía). |
| 43 | **Edit Fields2** | set | Prepara el movimiento bancario con el UID de la factura. (Conecta a Wait2) |

#### **Rama D: Facturas Múltiples en $ (SwitchVariasFacturas)**

| \# | Nombre del Nodo | Tipo de Nodo | Función Detallada |
| :---- | :---- | :---- | :---- |
| 44 | **SwitchVariasFacturas** | switch | Mapea el proveedor a un patrón para facturas múltiples en $. (Ej: Cloudflare \-\> CLOUDFLARE, OpenAI \-\> OPENAI \*CHATGPT S). (Conecta a Loop Over Items11) |
| 45 | **Loop Over Items11** | splitInBatches | Itera sobre las facturas de esta rama. |
| 46 | **Edit Fields $SincronicaMultiplesFras** | set | Establece el nombre estandarizado del proveedor y los datos de la factura. |
| 47 | **Google Sheets Fecha** | googleSheets | Busca movimientos bancarios que coincidan con la Fecha de la factura. |
| 48 | **Filter19** | filter | Filtra los movimientos bancarios devueltos, buscando aquellos con NombreFactura vacía y que contengan un patrón específico en Movimiento (OPENAI, CLOUDFLARE, WWW.MAKE.COM). |
| 49 | **Edit Fields3** | set | Prepara el movimiento bancario con el UID de la factura. (Conecta a Wait2) |

---

### **Nivel 4: Lógica por Patrón de Nombre (No Recurrente/Patrón Simple)**

| \# | Nombre del Nodo | Tipo de Nodo | Función Detallada |
| :---- | :---- | :---- | :---- |
| 50 | **If PatronNombreSimple** | if | (Camino falso de If Sincronica1) Comprueba si el proveedor **no es** MicroValles. (Si no es MicroValles, a If €1; si es MicroValles, a Switch Varios Nombres) |
| 51 | **Switch Varios Nombres** | switch | Mapea proveedores con nombres múltiples (solo tiene MicroValles \-\> MICRO VALLES SERV). (Conecta a Edit Fields MicroValles) |
| 52 | **Edit Fields MicroValles** | set | Prepara los campos de la factura para el proveedor MICRO VALLES SERV. |
| 53 | **Google Sheets HistoricoBanco42** | googleSheets | Busca movimientos bancarios que coincidan con el Importe de la factura y contengan "Recibos varios" en Más datos. |
| 54 | **Microvalles** | filter | Filtra los movimientos para que contengan MICRO VALLES SERV o NETEGES I MANT. en el campo Movimiento. |
| 55 | **Filter3** | filter | Filtra los movimientos de MicroValles. |
| 56 | **Filter2** | filter | Filtra para movimientos con NombreFactura vacía y cuya Fecha sea **posterior** a la fecha de la factura. |
| 57 | **Edit Fields12** | set | Prepara el movimiento bancario con el UID de la factura. (Conecta a Wait2) |
| 58 | **If €1** | if | Comprueba la divisa para el patrón de nombre simple. (Si es €, a If FraUnica; si no, a SwitchOtrosPatrones) |
| 59 | **If FraUnica** | if | Clasifica por patrón de factura única (Datatrans, OVH, etc.) o principio de mes (Google, Taigua). (Si es única, a If Movimientos/Mas Datos; si no, a Switch PrincipioDeMes) |
| 60 | **If Movimientos/Mas Datos** | if | Clasifica la conciliación por campo bancario: Movimiento (Datatrans, OVH, etc.) o Más datos (RicardoAlfaroPeropadre, Solidgate). (Si es Movimiento, a Switch Movimientos; si es Más datos, a Switch Mas Datos) |

#### **Rama E: Conciliación por Movimiento (Switch Movimientos)**

| \# | Nombre del Nodo | Tipo de Nodo | Función Detallada |
| :---- | :---- | :---- | :---- |
| 61 | **Switch Movimientos** | switch | Mapea el proveedor a un patrón de texto en el campo Movimiento. (Ej: Endesa \-\> ENDESA ENERGIA S., OVH \-\> OVHcloud). (Conecta a Loop Over Items16) |
| 62 | **Loop Over Items16** | splitInBatches | Itera sobre las facturas de esta rama. |
| 63 | **ProveedorPersonalizado3** | set | Establece el nombre estandarizado del proveedor y datos de la factura. |
| 64 | **Edit Fields LinkBD\_Banco3** | set | Prepara el array de movimientos bancarios. |
| 65 | **Split Out3** | splitOut | Divide el array BD\_Banco en elementos. |
| 66 | **Filtro Proveedores PrimerosDeMes1** | filter | Busca movimiento: 1\) Movimiento contiene Proveedor, 2\) NombreFactura vacía. |
| 67 | **If Datatrans/SolucionesTecnic** | if | Comprueba si el proveedor es Datatrans, FIJONOL000000, FIJO932761128 o SOLUCIONES TECNIC. (Si lo es, a Filter \+-4d; si no, a If Mismo Movimiento \+ Importe) |
| 68 | **Filter \+-4d** | filter | Si es uno de los proveedores específicos, busca el movimiento bancario en un rango de fecha de **\+/- 4 días** respecto a la fecha de la factura. (Conecta a Filter16) |
| 69 | **Filter16** | filter | Asegura que el movimiento encontrado **no tiene factura asociada** (NombreFactura vacía). |
| 70 | **If Mismo Movimiento \+ Importe** | if | (Camino falso de If Datatrans/SolucionesTecnic) Comprueba si el Movimiento bancario coincide exactamente con el Proveedor de la factura y si el Importe es el mismo. (Conecta a Filter Mismo Movimiento+Importe) |
| 71 | **Filter Mismo Movimiento+Importe** | filter | Busca movimiento: 1\) NombreFactura vacía, 2\) Importe coincide, 3\) Movimiento o Más datos contienen un patrón (OVHcloud o Ricardo Alfaro Peropadre). |
| 72 | **Edit Fields5** | set | Prepara el movimiento bancario con el UID de la factura. (Conecta a Wait2) |

#### **Rama F: Conciliación por Más Datos (Switch Mas Datos)**

| \# | Nombre del Nodo | Tipo de Nodo | Función Detallada |
| :---- | :---- | :---- | :---- |
| 73 | **Switch Mas Datos** | switch | Mapea el proveedor a un patrón de texto en el campo Más datos. (Ej: RicardoAlfaroPeropadre \-\> Ricardo Alfaro Peropadre). (Conecta a Loop Over Items23) |
| 74 | **Loop Over Items23** | splitInBatches | Itera sobre las facturas de esta rama. |
| 75 | **ProveedorPersonalizado4** | set | Establece el nombre estandarizado del proveedor y datos de la factura. |
| 76 | **Edit Fields LinkBD\_Banco9** | set | Prepara el array de movimientos bancarios. |
| 77 | **Split Out9** | splitOut | Divide el array BD\_Banco en elementos. |
| 78 | **Filtro Proveedores MasDatos** | filter | Busca movimiento: 1\) Más datos contiene Proveedor, 2\) NombreFactura vacía. |
| 79 | **If Datatrans/SolucionesTecnic2** | if | Comprueba si el proveedor es Datatrans o SOLUCIONES TECNIC (usando ProveedorPersonalizado4). (Si lo es, a Filter \+-3d2; si no, a If Mismo Movimiento \+ Importe1) |
| 80 | **Filter \+-3d2** | filter | Busca el movimiento bancario en un rango de fecha de **\+/- 4 días** respecto a la fecha de la factura. (Conecta a Filter17) |
| 81 | **Filter17** | filter | Asegura que el movimiento encontrado **no tiene factura asociada** (NombreFactura vacía). |
| 82 | **If Mismo Movimiento \+ Importe1** | if | (Camino falso de If Datatrans/SolucionesTecnic2) Comprueba si el campo Proveedor de la factura coincide con el campo Movimiento del banco. (Conecta a Filter Mismo Importe y Mes) |
| 83 | **Filter Mismo Importe y Mes** | filter | Busca movimiento: 1\) Importe coincide, 2\) el **Mes** de la fecha es el mismo. |
| 84 | **Edit Fields6** | set | Prepara el movimiento bancario con el UID de la factura. (Conecta a Wait2) |

#### **Rama G: Conciliación por Principio de Mes (Switch PrincipioDeMes)**

| \# | Nombre del Nodo | Tipo de Nodo | Función Detallada |
| :---- | :---- | :---- | :---- |
| 85 | **Switch PrincipioDeMes** | switch | Mapea el proveedor a un patrón para pagos que ocurren a principio de mes. (Ej: Google \-\> GOOGLE, Taigua \-\> Taigua). (Conecta a Loop Over Items13) |
| 86 | **Loop Over Items13** | splitInBatches | Itera sobre las facturas de esta rama. |
| 87 | **ProveedorPersonalizado2** | set | Establece el nombre estandarizado del proveedor y datos de la factura. |
| 88 | **Edit Fields LinkBD\_Banco2** | set | Prepara el array de movimientos bancarios. |
| 89 | **Split Out2** | splitOut | Divide el array BD\_Banco en elementos. |
| 90 | **Filtro Proveedores PrimerosDeMes** | filter | Busca movimiento: 1\) Movimiento contiene Proveedor, 2\) NombreFactura vacía. |
| 91 | **FilterPrimersDe Mes** | filter | Busca el movimiento bancario que coincide con las fechas de principio o fin de mes esperadas (día 1, 2, 3 del mes siguiente o día 28 del mismo mes, usando expresiones como plus(1,'months').startOf('months')). |
| 92 | **Edit Fields4** | set | Prepara el movimiento bancario con el UID de la factura. (Conecta a Wait2) |

#### **Rama H: Sin Patrón Conocido (SwitchOtrosPatrones)**

| \# | Nombre del Nodo | Tipo de Nodo | Función Detallada |
| :---- | :---- | :---- | :---- |
| 93 | **SwitchOtrosPatrones** | switch | (Camino falso de If €1) No tiene reglas definidas, el camino predeterminado (extra) se dirige a If SinPatron. |
| 94 | **If SinPatron** | if | Comprueba si el proveedor es Brevo o Sendinblue (se dirige al camino "falso"). (Conecta a If6 si el proveedor no está en la lista) |
| 95 | **If6** | if | Comprueba si el elemento de entrada **no está vacío** ($json.isEmpty() es falso), para asegurarse de que solo se envía un correo si hay un elemento para procesar. (Conecta a Gmail EmpresasNoAsignadas2) |
| 96 | **Gmail EmpresasNoAsignadas2** | gmail | Envía una notificación por email si la factura no coincidió con ningún patrón. |

---

## **Conclusión de la Conciliación**

| \# | Nombre del Nodo | Tipo de Nodo | Función Detallada |
| :---- | :---- | :---- | :---- |
| 97 | **Wait2** | wait | Introduce un retraso de 0 segundos, actuando como un punto de convergencia para todas las ramas de conciliación exitosas antes de la actualización de la hoja de cálculo bancaria. |
| 98 | **Google Sheets HistoricoBanco11** | googleSheets | **Actualiza el registro bancario** en la hoja (1963712436) insertando el UID de la factura en el campo NombreFactura, utilizando el row\_number para la coincidencia. |
| 99 | **Wait7** | wait | Introduce un retraso de 3 segundos, presumiblemente para asegurar que la actualización del Google Sheet anterior se complete. |
| 100 | **Google Drive** | googleDrive | Busca el archivo de factura en Google Drive utilizando el NombreFactura (que ahora contiene el UID). |
| 101 | **Google Drive1** | googleDrive | Mueve el archivo de factura encontrado a una carpeta de destino diferente (1QM97jihOK0Vi\_gWqwE7mnD-NXmg2eIvE), completando el proceso de conciliación y archivo. |

