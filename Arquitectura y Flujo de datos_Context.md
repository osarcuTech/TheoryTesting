# **Arquitectura y Flujo de datos.**

A continuación, detallo el flujo y arquitectura de datos principal del departamento financiero con los *Trigger de n8n* o **"Soft-Trigger"** (causantes del *Recálculo de una Fórmula* de Google Sheets).

Proporciono primero la imagen que facilitará la comprensión del resto de explicaciones.

Imagen del Flujo de datos de la Base de Datos o BD (PlanoDatosBD).

 

En la imagen se observa como el cambio en cualquiera de las tres hojas en la parte superior actúan como “soft-trigger” que iniciará un tratamiento de datos en cascada.

 

Imagen del documento “Flujo Datos”.

 

# **Introducción al Flujo de datos:**

El flujo de datos empieza por el envió por parte de **J1** (de forma automática o por petición J0.A/B) de Movimientos Bancarios (J1.A) o de Facturas (J1.B).

Esto inicia los workflows de procesamiento, importación y tratamiento de datos a la base de datos (BD) de los movimientos bancarios (A1: importar en BD; A2 Asignar gastos) o de las de las facturas (B1: Importar y clasificar; B2: Nombrar, registrar en BD y pre-archivar).

Estos datos actualizan **C0**, una formula que sugiere facturas a asociar a cada movimiento bancarios realizado por un proveedor.

Entonces llegamos a “**H0**” el primer “paso” que requiere el control minucioso de una persona. Este esta formado por las siguientes tareas:

\-          **Validar los punteos correctos:** Aquellos con los que se este conforme para iniciar el proceso de “facturación” indicando a **H1** las facturas a archivar.

\-          **Revisar las incidencias enviadas por los workflows:** En función de la incidencia decidiremos si:

o   **Actualizar workflows** y volver a procesar la información

o   **Actualizar las Bases de Datos** (ej: “Perfil de Proveedores”)

o   **Modificar la información de forma manual** (ej: Excepciones previstas de “outputs” en los workflows como facturas no legibles por formato).

\-          **Corrección de información faltante o errónea según H2:** H2 informa de incidencias en los archivos de control que H0 debe solucionar con o sin la asistencia de J2 (dependiendo del caso).

El resultado del trabajo de H0 se divide en lo siguiente:

\-          Una lista de facturas punteadas que H1 debe archivar para iniciar el proceso de facturación C1/C2.

\-          La actualización de unas hojas que H2 utilizará como “Control” para comprobar que todo este correcto según las necesidades de la empresa.

\-          Actualización de los informes financieros (Cashflow).

**H1** iniciara el archivo y/o envío de facturas (C1), el registro de su estado de archivado (localización, estado de contabilización, …) en BD, y el registro de la ubicación (carpeta) de cada una de ellas al informe de control “**Compr.Fras.Manual**” para que H2 lo compruebe.

**H2**: Comprobara la corrección de cada uno de los informes. En caso de incidencia informara a quien corresponda (J0.A/B; H0; H1; J2) para que rectifique la incidencia. En caso de que los informes requeridos para el cierre de mes estén correctamente procederá con el cierre de mes informado a quien lo requiera.

# **Arquitectura de datos:**

## **Flujo A:**

o   A1 Recibe movimientos bancarios y los añade el BD\_Banco,

o   A2 Clasifica los movimientos en Movimientos\_cuenta\_XXXXXXX, cuando aparece un nuevo movimiento clasificado como "Proveedores" activando el flujo AB\_C.

### **A1: Importación Bancaria (ImportarMovimientos)**

Este flujo tiene la responsabilidad crítica de transformar los datos bancarios crudos, mediante GmailMetralleta\_Context.md, en un formato normalizado dentro de BD\_Banco.  

 

Existe un riesgo operacional significativo en esta etapa: la importación de datos tabulares (CSV, TSV, etc.) es altamente sensible al delimitador y al formato de origen. Si el banco realiza un cambio menor en el formato del extracto (ej., alteración del separador de campos o de la codificación de caracteres), la automatización de la importación puede generar una "falla silenciosa", donde los datos se ingresan incorrectamente o incompletos en BD\_Banco, comprometiendo la totalidad del análisis de conciliación posterior en Movimientos\_cuenta\_XXXXXXX.  

 

### **A2: Asignación de Costos (AssignacionDeGastos)**

La automatización AssignacionDeGastos\_context.md realiza una función de inteligencia financiera: convertir una simple transacción bancaria en un elemento de gestión de costes. Asigna la transacción a las columnas I (Departamento/Centro de Coste), J (Naturaleza: Fijo/Variable) y K (Categoría Contable).

 

La base para esta asignación es, la búsqueda de patrones de proveedor.

 

??

La clasificación de costos Fijos/Variables es crucial para el análisis de margen y la determinación del punto de equilibrio operativo.  

 

La asignación a un Departamento (Columna I) es el precursor para utilizar metodologías de contabilidad de costes más sofisticadas, como el Método de Tasa Múltiple por Departamento. Este método proporciona una precisión significativamente mejor en la distribución de gastos generales, al reflejar las diferencias en el uso de recursos entre distintos centros de coste.  

¿¿

 

## **Flujo B:**

o   Nos entran facturas por correo (B1), activa el trigger. B1 Las descarga y manda a la carpeta correspondiente activando con eso el trigger de B2.

o   B2 procesa la factura nombrándola, moviéndola a una carpeta "Cuadrar" y añadiendo el UID de la factura en la base de datos "BD\_facturas". Esto activa el trigger de la fórmula O778.

#### **B2: Gestión de Facturación (Cebollón)**

El flujo Cebollón se encarga de recibir las facturas (probablemente procesando adjuntos de correo o archivos subidos) y extraer la información estructurada (ID de factura, proveedor, monto, fecha de vencimiento) para almacenarla en BD\_Facturas.

 

Este flujo es la otra mitad fundamental de la conciliación. Si Cebollón extrae, por ejemplo, el importe bruto en lugar del importe neto, o confunde la base imponible con el total a pagar, la Fórmula O778 será incapaz de encontrar una coincidencia de monto en la fase de punteo, resultando en un fallo del 100% de las sugerencias para esa factura. El HistorialFacturas, que usa una QUERY sobre BD\_Facturas, es la herramienta de seguimiento y control, utilizando la Columna M para registrar el estado de Cuentas por Pagar. El punteo bancario exitoso (validado en G) es lógicamente el paso previo necesario para que la factura avance al estado "contabilizada" en M.

 

 

## **Flujo BD:**

### **Bases de Datos:**

#### **BD\_Banco:**

Esta hoja es la fuente primaria de datos de tesorería , registrando todas las transacciones de su cuenta principal en CaixaBank (identificador XXXXXXX).

 

**Columnas, Contenido y Propósito**

\-          **Fecha, Fecha valor:** Fechas de registro y de efectividad del movimiento.

\-          **Movimiento, Más datos:**  Descripción del concepto de la transacción (ej: PAG NOMINAS, CURRENCYAPI.COM, WEB355784927 2811).

\-          **Importe:** Valor monetario de la transacción. Las salidas (pagos) se muestran como negativos, y las entradas como positivos.  

\-          **Saldo:**  Saldo de la cuenta después de cada transacción.

 

Los inputs en esta BD se transfieren mediante una formula Query a Movimientos\_cuenta\_XXXXXXX y activan A2.

Los inputs pueden darse de dos formas:

\-          **Automática** (**A1**).

\-          **Manual (H0):** Añadiendo movimientos manualmente. Casi exclusivamente para añadir movimientos anteriores a los existentes (peligroso ya que desplaza los movimientos que ya teníamos hacia abajo sin desplazar a la vez el resto de inputs “manuales” como las facturas aparejadas y tendremos que desplazarlas manualmente a su debido lugar).

#### **BD\_Facturas:**

Contiene información de las facturas gestionadas por Norgenic.  

**Columna y Propósito Clave**

\-          **UID (Identificador Único):** Es el formato de referencia para el punteo, combinando Fecha, Proveedor, Importe, Moneda y Número de factura (ej: "01/03/2025\_MailgunTechnologies\_69,00\_€\_77495581\_Norgenic").  

Los inputs en esta BD se transfieren mediante una formula Query a HistorialFacturas y actualizan automáticamente la fórmula de punteo (C0). Los inputs pueden darse de dos formas:

\-          **Automática** (**B2**).

\-          **Manual** (H0):

o   **Añadiendo facturas:** Cuando una factura no pasa correctamente la automatización B2 hemos de elegir si actualizar B2 para tenerla en cuenta (para facturas habituales) o si la añadimos manualmente (para facturas puntuales o en formatos no procesables por B2 como imágenes de facturas que no tienen texto legible por el ordenador).

o   **Modificando el nombre de facturas:** A veces el regex de B2 pasa sin incidencias pero dando un nombre incorrecto y a veces al añadir manualmente una factura podemos escribir su nombre de forma distinta a como lo tenemos archivado en carpeta (ej: añadiendo o dejando de añadir la extensión “.pdf”) haciendo que la fórmula de “Compr.Fras.Manual\!B” falle al asociarla con las facturas archivadas.

 En ambos casos tendremos que ir a la hoja “BD\_Facturas” y/o la hoja “Movimientos\_cuenta\_XXXXXXX\!G” a modificar el nombre del archivo por el que consideremos correcto.

 Es posible que también tengamos que modificar el nombre del archivo, casi exclusivamente si B2 ha sacado un resultado erróneo.

o   **Eliminando facturas:** En los casos en los que B2 nos proporcione “duplicados” (ej: comanda \+ factura) y deseemos eliminar uno de los dos (peligroso ya que desplaza las facturas que ya teníamos hacia arriba sin desplazar a la vez el resto de inputs “manuales”, como el ID o la ubicación del archivo, y tendremos que eliminarlos y desplazar los correctos a su debido lugar manualmente).

#### **PerfilProveedores (H0):**

Esta hoja define cómo se clasifican y contabilizan los pagos a proveedores, siendo cruciales para la automatización y el análisis de costes. Contiene las condiciones de emparejamiento entre facturas y movimientos. Cualquier ajuste en estas condiciones alterará la formula actualizando los emparejamientos.

En este documento solo debería hacer-se cambios cuando se añada o modifique un patrón de emparejamiento (ej: Nuevo proveedor recurrente o cambio en la representación de uno actual).

Esto se suele detectar cuando C0 indica que, para un movimiento, es incapaz de proponer una factura con los comentarios “NoProveedor” o “SinCoincidencias”).

En tales casos deberemos decidir **cómo proceder con “PerfilProveedores”:**

\-          La factura correspondiente aún nos ha de llegar y hemos de esperar o pedirla (J0.B).

\-          Modificamos “PerfilProveedores” añadiendo o modificando proveedores.

\-          Punteamos la factura manualmente sin modificar “PerfilProveedores” ya que nos es un proveedor recurrente o con un patrón que seamos capaces de automatizar.

**Columna Contenido y Uso de Fórmulas:**

\-          **Empresas:** Nombre del Proveedor (ej: Ahrefs, DigitalOcean, OVHcloud).  

\-          **Movimiento A/B/C, Mas Datos:** Contienen los textos o patrones de búsqueda que la automatización utiliza para identificar la transacción en el banco, permitiendo el punteo.  

\-          **Facturación Q/mes, Fecha Fija, Síncrona, F.Cobro, F.Fra Alerta, €/$, Patron+Minimo, Patron+Maximo, Correo/Chat; Observaciones, IVA, MatrizNombres:** Apuntes para entender el patrón.  

\-          **Función del Punteo Automático:** Los campos de fecha (Regex Fecha1A, Regex Fecha1B, Regex Fecha2A, Regex Fecha2B) para definir la tolerancia de días permitida al buscar una coincidencia entre la factura y el movimiento bancario. Esto simula una función de conciliación automática.

\-          **Importe:** Se utiliza como parámetro de las fórmulas de punteo. Por ejemplo, valores de importe (1,00) son utilizados para la conciliación.  

### **Movimientos\_cuenta\_XXXXXXX.**

La hoja Movimientos\_cuenta\_XXXXXXX es el epicentro de la inteligencia financiera. Las columnas se dividen en entradas automáticas (vía QUERY y automatizaciones) y entradas manuales de supervisión:

 

**Columna: Propósito y Tratamiento:**

\-          (A:F):

o   Datos crudos del movimiento (Fecha, Concepto, Importe, Saldo).

o   Automático (Input A1)

\-          G (NombreFactura):

o   Columna de Validación Final. El operador copia manualmente el resultado de la sugerencia de punteo (Columna O) aquí. Sirve como el registro definitivo de la conciliación.

o   Manual (H0).

\-          H (PeriodoCobro):

o   Asignación del periodo contable, fundamental para la proyección del Cash Flow (Cash Flow Forecasting).

o   Automático.

\-          (I:K):

o   Asignación de Costes (Departamento, CF Category, etc.). Reciben el output de la automatización de asignación de gastos (A2), clasificando la transacción (e.g., Proveedores, Salarios, Impuestos).

o   Automático (Input A2).

\-          L (Periodo Contabilización):

o   Periodo formal en el que el movimiento se registrará en la contabilidad general.

o   Manual (H0)

\-          M (Ubicación/Estado):

o   Indica la ubicación de cada factura punteada. Realiza un buscarV buscando las facturas de la columna G (punteo manual) en el historial de facturas (columna A) y devolviendo la ubicación (columna P). Si no se ha punteado estará en blanco, en caso contrario dirá donde se encuentra la factura.

o   Automático.

\-          O (Fórmula Sugerencia):  

o   Contiene la lógica automatizada de punteo (conciliación), que sugiere el UID de la factura correspondiente en HistorialFacturas.

o   Automático (Motor de Punteo).

#### **Triggers Movimientos\_cuenta\_XXXXXXX:**

Sus triggers pueden ser accionados por inputs tanto automáticos como manuales. La diferencia es que dependiendo del input activara distintos flujos.

##### **Automáticos:**

\-          **A1**: Actualiza la fórmula de seguimiento de proveedores especiales (ej: Google; Nexmo) \+ (**H2. Importe Coincidente**). También actualiza las formulas que muestran la información (Movimientos\_cuenta\_XXXXXXX\!A:F, Movimientos\_cuenta\_XXXXXXX\!H)

\-          **A2**: Actualiza las siguientes fórmulas y tablas dinámicas:

o   **Punteo** (C0à Movimientos\_cuenta\_XXXXXXX\!O). Al añadir “proveedores” la formula empieza a buscar coincidencias entre los movimientos y las facturas.  
 Sugiere la UID de una factura para un movimiento. De aprobarlo lo escribiremos en la columna G y moveremos la factura a la carpeta correspondiente activando al hacerlo a C1.

o   “**FacturasFaltantes\!H2**”: Al añadir “proveedores” la formula actualiza los movimientos pendientes de relacionar con facturas.

o   **Puntear plataformas**: (Movimientos\_cuenta\_XXXXXXX\!K à **ResumenPlataformas\!L à H2. Coincidentes**). La fórmula “Movimientos\_cuenta\_XXXXXXX\!K” clasifica los movimientos por plataformas. Al hacerlo activa como “soft-trigger” actualizando la fórmula de punteo de plataformas “ResumenPlataformas\!L”

o   “**CashFlowDin.Table\!**” A medida que se asignan los costes se actualiza la tabla dinámica que los refleja.

\-          **B2**: Actualiza indirectamente las siguientes fórmulas:

o   **Punteo** (C0à Movimientos\_cuenta\_XXXXXXX\!O). Al añadir/modificar facturas la fórmula empieza a buscar coincidencias entre los movimientos y las facturas.

##### **Manuales (H0):**

\-          **“Movimientos\_cuenta\_008723\!G”:** Añadiremos a la columna G la UID de la factura correspondiente a dicho movimiento bancario y moveremos la factura a la carpeta correspondiente activando al hacerlo a C1.  
 La confirmación (H0) / introducción (manual) de la UID de una factura actualiza las fórmulas:

o   “**FacturasFaltantes\!H2**”: (eliminando de las facturas faltantes la factura introducida)  à H1+\[H2. Prescindibles2\]

o   “**HistorialFacturas\!L2**” (marcando con un “si” la UID coincidente indicando que ha sido correctamente punteada y dando permiso para proceder con **C1**) y dejando por puntear las no apareadas \[H2. Prescindibles1\].

o   **“ResumenPlataformas\!L”** Lista las facturas de otras plataformas pendiente de puntear. (Incorporar con facturas pendientes).

o   **A2:** Cuando la automatización no sea capaz de asociar algún gasto H0 tratará de hacerlo.  
 En caso de no poder consultará con su superior como clasificarlo (J2), antes de seguir con el proceso de “control” en el que se revisan los distintos informes, para valorar si se puede cerrar el mes contable o no.  
 También valorarán si añadir o no la asociación a la automatización o limitar-se a gestionarla manualmente.

#### **C0: El Proceso de Punteo (Conciliación) y Clasificación**

 

 

 

La Fórmula O778 (C0) en la hoja Movimientos\_cuenta\_XXXXXXX es el componente central que intenta automatizar el punteo de las transacciones bancarias con el historial de facturas.

El sistema utiliza una lógica avanzada para el Punteo (Conciliación), que es el proceso de igualar las facturas con los movimientos reales del banco:

 

\-          **Búsqueda Automática (PerfilProveedores):** El sistema consulta PerfilProveedores mediante una formula para obtener los patrones de texto y la tolerancia de fecha e Importe para cada proveedor.

\-          **Generación y ejecución de la Query:** Luego usa esos patrones para construir una Query que busca coincidencias en HistorialFacturas.

\-          **Lógica adicional:** Por último, ejecuta una lógica adicional para limitar el ámbito de aplicación de la formula (“proveedores”), de filtrado para evitar repetidas, ...

El propósito de C0 es generar una sugerencia de punteo, buscando un ID de factura en HistorialFacturas que coincida con el movimiento bancario actual. Debido a que las descripciones de los movimientos bancarios (el concepto) son textos no estructurados y variables, el uso de expresiones regulares (REGEX) es indispensable para identificar al proveedor.  

A continuación explicaremos la función en un seguido de pasos.

##### **Paso 1: Filtro y Localización del Patrón de Proveedor**

 

Se utiliza la función REGEXMATCH  para comparar la descripción del movimiento bancario con los patrones de punteo definidos para cada proveedor, extraídos de PerfilProveedores. Por ejemplo, si el concepto bancario contiene .*\*ADYN.\**, la fórmula clasifica la transacción como Adyen.

 

La fórmula **busca el proveedor en la hoja "PerfilProveedores"** utilizando el texto del movimiento bancario (Columna C) o más datos (Columna D).

  Variables relevantes para la formula:

\-          **Rendimiento:**

o   **limiteProv**; CONTARA(PerfilProveedores\!$A:$A);

§  Busca el nº de filas de la hoja para limitar la búsqueda para mejor rendimiento.

o   **limiteFras**; INDIRECTO("HistorialFacturas\!$A$2:$R"& CONTARA(HistorialFacturas\!$A:$A));

§  Busca el rango de la hoja para limitar la búsqueda para mejor rendimiento.

o   **rangonombreA**;(PerfilProveedores\[\[\#HEADERS\],\[MatrizNombres\]\]:INDIRECTO("PerfilProveedores\!$Y$"\&limiteProv));

§  Define el rango en el que se puede encontrar el nombre del proveedor (C778) dentro de “PerfilProveedores.

o   **rangonombreMasDatos**; PerfilProveedores\[\[\#HEADERS\],\[Mas Datos\]\]:INDIRECTO("PerfilProveedores\!$E$"\&limiteProv);

§  Define el rango en el que se puede encontrar el nombre del proveedor (D778) dentro de “PerfilProveedores.

\-          **Regex:** Buscamos las filas en las que coinciden Movimiento (C778) y Mas Datos (D778).

o   **Movimiento**:

§  **nombreBanco**;SUSTITUIR($C778;"\*";"\\\*");

·         Saca el nombre para el regex eliminando elementos conflictivos mediante la formula sustituir.

§  **preNombreA**;ARRAYFORMULA(REGEXMATCH(rangonombreA; nombreBanco));

·         Busca C778 en el rango de nombres definido.

§  **nombreA**;COINCIDIR(VERDADERO; preNombreA; 0);

·         Extrae el nº de la fila que coincidió. El objetivo es para usarla como rango para encontrar los patrones del proveedor que proporcionaremos a la query.

o   **Mas Datos:**

§  **nombreMasDatos**;COINCIDIR($D778;rangonombreMasDatos;0);

·         Busca el nombre (D778) en el rango establecido y devuelve la fila de coincidencia.

 

\-          **filaRegex**;IFNA(nombreA;nombreMasDatos);

o   Mira si ha habido coincidencia al buscar fila con nombreA (Movimiento) y si no lo habido usa busca la coincidencia de fila de nombreMasDatos (Mas Datos). El objetivo es decidir que fila usar de las dos para la búsqueda de los patrones usados en la Query. **Localiza la fila exacta en PerfilProveedores donde se encuentra el proveedor.**

\-          **regexNombre**; INDIRECTO("PerfilProveedores\!Q"\&filaRegex);

o   Saca el texto proporcionado a la Query para filtrar las facturas por el nombre del proveedor. Si se encuentra la fila, se extrae el patrón de búsqueda de proveedor específico de la Columna Q de PerfilProveedores por ejemplo: (C='Endesa').

 

##### **Paso 2: Creación de la Condición de Búsqueda (QUERY)**

Este es el paso más sofisticado, donde la fórmula construye dinámicamente la cláusula WHERE para la consulta a HistorialFacturas:

\-          **textoQuery**;"select A where " & ESPACIOS(**regexNombre**&**regexMinfecha**&**regexMaxfecha**&**regexImporte**);

o   Selecciona la UID de la factura que coincida con todos los regex dentro de la formula ESPACIOS.

###### **regexNombre (Proveedor):**

\-          **Fragmento de Fórmula utilizada:**

o   **regexNombre**; INDIRECTO("PerfilProveedores\!Q"\&filaRegex);

§  **Output:** Columna Q de “PerfilProveedores”

**Lógica:** Agrega a la query “C= Nombre del proveedor ”.

**Propósito:** Garantiza que solo se busquen facturas de la empresa coincidente.

 

###### **regexMinfecha (Fecha Mínima):**

Variables de la Fórmula utilizadas:

\-          **supportMinFecha**; SI((INDIRECTO("PerfilProveedores\!S"\&filaRegex)\<\>""); (INDIRECTO("PerfilProveedores\!S"\&filaRegex)); "0");

o   Output**:** Columna S de “PerfilProveedores” (días a restar para encontrar la fecha de margen inferior)

\-          **minFechaBanco**; "'" & TEXTO(($A778+supportMinFecha); "yyyy-mm-dd") & "'";

o   Output**: Fecha mínima \=** Fecha del movimiento menos margen indicado (supportMinFecha, ej., \-15 días).

\-          **regexMinfecha**; SI((INDIRECTO("PerfilProveedores\!R"\&filaRegex)\<\>""); (INDIRECTO("PerfilProveedores\!R"\&filaRegex)\&minFechaBanco); " ");

o   Output: Regex utilizado para declarar que la fecha sea superior o igual a la fecha mínima.

**Lógica:** Agrega “and B \>= **Fecha mínima** 'YYYY-MM-DD' ” a la consulta, usando el margen de días de la Columna S respecto a la fecha del banco ($A778).

**Propósito:** Permite la conciliación flexible donde el pago se realiza entre esta fecha que indicamos como la fecha mínima y la fecha que indicaremos como fecha máxima.

###### **regexMaxfecha (Fecha Máxima):**

Variables de la Fórmula utilizadas:

\-          **supportMaxFecha**; SI((INDIRECTO("PerfilProveedores\!U"\&filaRegex)\<\>""); (INDIRECTO("PerfilProveedores\!U"\&filaRegex)); "0");

o   **Output:** Columna U de “PerfilProveedores” (días a sumar para encontrar la fecha de margen superior)

\-          **maxFechaBanco**; "'" & TEXTO(($A778+supportMaxFecha); "yyyy-mm-dd") & "'";

o   Output**: Fecha máxima \=** Fecha del movimiento menos margen indicado (supportMinFecha, ej., \+30 días).

\-          **regexMaxfecha**; SI((INDIRECTO("PerfilProveedores\!T"\&filaRegex)\<\>""); (INDIRECTO("PerfilProveedores\!T"\&filaRegex)\&maxFechaBanco); " ");

o   Output: Regex utilizado para declarar que la fecha sea inferior o igual a la fecha máxima.

**Lógica:** Agrega and “B \<= **Fecha máxima** 'YYYY-MM-DD' ” a la consulta, usando el margen de días de la Columna U.

**Propósito:** Permite la conciliación flexible donde el pago se realiza entre la fecha que indicábamos como la fecha mínima y la fecha que indicamos como fecha máxima.

 

###### **Importe:**

Variables de la Fórmula utilizadas:

\-          regexImporte;SI(VALOR(INDIRECTO("PerfilProveedores\!V" & filaRegex))=1; " and D \= "\&SUSTITUIR(SUSTITUIR(SUSTITUIR(TEXTO(ABS(-$E778);"0.00");".";";");",";".");";";"");"");

o   La Columna V contiene un Booleano (0 o 1), lo usamos como condición para saber si añadir un trozo de regex a la query con el importe del movimiento o no hacerlo.

**Lógica:** Si V=1, agrega “and D \= \[Importe Movimiento\]” si V=0 no añade nada a la formula.

**Propósito:** Permite ignorar la coincidencia de importe (V=0) cuando indicamos que hay diferencias en el importe (ej: cambios de divisas), mitigando el riesgo de fallo de conciliación, o la aplica de forma estricta (V=1) cuando así lo deseamos.

 

###### **Construcción de la Query:**

La variable **formulaQuery;QUERY(limiteFras;textoQuery);** luego ejecuta esta condición compuesta sobre el rango establecido de HistorialFacturas (variable limiteFras), devolviendo todos los UID de facturas que cumplen con el proveedor, el rango de fechas flexible y la coincidencia opcional de importe.

 

**Construcción de la Query:** La fórmula ensambla dinámicamente la cláusula WHERE para una QUERY que se ejecuta sobre HistorialFacturas:  

    textoQuery → "select A where " \+ regexNombre \+ regexMinfecha \+ regexMaxfecha \+ regexImporte

 

##### **Paso 3: Gestión de Múltiples Coincidencias y Anti-Duplicidad**

Este paso resuelve el problema crucial de los pagos recurrentes (ej., facturas mensuales idénticas de Movistar o MicroValles ), donde una simple búsqueda podría devolver múltiples coincidencias:  

**Variables implicadas:**

\-          **nCoincidencias**;CONTARA(formulaQuery);

o   Devuelve al nº de coincidencias de la Query

\-          **primeraCoincidencia**;INDICE(formulaQuery;1);

o   Devuelve la primera coincidencia de la Query

\-          **rangoPuntear**;$O$268:$O777;

o   Devuelve el rango de celdas que preceden a la celda donde se está aplicando la fórmula.

\-          **valoresNoPunteados**;FILTER(formulaQuery;ESNOD(COINCIDIR(formulaQuery; rangoPuntear; 0)));

o   Devuelve solo los valores pendientes de ser sugeridos para su asignación.

\-          **primeraNoPunteada**;INDICE(valoresNoPunteados;1);

o   Devuelve la primera propuesta de asignación entre las que nunca habían sido sugeridas.

\-          **outputQueryCondicionada**;SI(nCoincidencias\>1;primeraNoPunteada;formulaQuery);

o   Indica que solo se aplique el filtro anti duplicados cuando la Query original devuelva más de un resultado.

 

Esta sofisticada lógica de filtro (FILTER/COINCIDIR dentro de let) garantiza que, si se pagan tres facturas de Movistar de 66.55 € con tres movimientos bancarios idénticos, la fórmula sugerirá progresivamente Factura 1 para el Movimiento 1, Factura 2 para el Movimiento 2, y así sucesivamente.  

##### **Paso 4: Lógica adicional.**

 

**La fórmula comienza con un filtro estricto:** SI($J778\<\>"Proveedores";"";...)

Esto asegura que la compleja lógica de punteo solo se ejecute si la transacción ya ha sido clasificada automáticamente (a través del flujo AssignacionDeGastos) como un pago a "Proveedores" (Columna J), evitando ejecutar la lógica de conciliación para movimientos como salarios, impuestos o ingresos por ventas.

**Variables relacionadas:**

\-          noProveedor;ESNOD(filaRegex);

o   Pone en la variable “noProveedor” los casos en que filaRegex falle en encontrar una coincidencia. Separa los casos en que podemos extraer patrones para la query de los que no.

\-          sinCoincidencias;ESNOD(formulaQuery);

o   Pone en la variable “sinCoincidencias” los casos en los que se ha llegado a implementar exitosamente la Query pero que no ha habido coincidencias.

\-          letOutput;ifs(noProveedor;"NoProveedor"; sinCoincidencias;"SinCoincidencias";VERDADERO;outputQueryCondicionada)

§  Si no encuentra la fila del proveedor en vez de aplicar la Query devuelve el texto “NoProveedor”.

§  Si no encuentra coincidencias al aplicar la Query devuelve el texto “sinCoincidencias”.

§  En cualquier otro caso devuelve el resultado de la Query (outputQueryCondicionada).

o   Esto nos permite identificar la causa de la incidencia con mas facilidad en caso de producirse.

##### **Paso 5: Interacción Humano-Sistema y Conclusión**

La fórmula O778 es un ejemplo de Contabilidad de Conciliación Asistida.

\-          Si J778 no es "Proveedores", la salida es vacía (filtro de categoría).

\-          Si el REGEXMATCH falla, la salida es "NoProveedor".

\-          Si la QUERY no encuentra ninguna factura que coincida con las condiciones de Proveedor \+ Importe (opcional) \+ Rango de Fechas, la salida es "SinCoincidencias".

 

Estos **outputs de fallo** actúan como alertas automáticas, indicando al operador (H0) la necesidad de una conciliación manual.

"**SinCoincidencias**" Indica una de las siguientes cosas:

\-          Aún no nos ha llegado la factura correspondiente al cargo mediante la automatización "Cebollon" (ya sea por culpa del proveedor o por no tener los datos actualizados);

\-          Aún no se han definido los patrones del proveedor;

\-          El proveedor a enviado Información Errónea/Distinta; otros patrones que queremos gestionar manualmente como más de un movimiento por factura.  

"**NoProveedor**" Indica una de las siguientes cosas:

\-          Proveedor nuevo;

\-          Proveedor no recurrente que intencionadamente no hemos añadido porque es más eficiente hacerlo manualmente;

\-          El proveedor tiene cambios en el nombre del movimiento y hemos de actualizar el regex;

\-          Proveedores con regex complicados donde el nombre del proveedor varia (ej: proveedor-mes) por lo que no hemos creado un patrón para él.

 

**Columna G:** es donde el operador copia la sugerencia de O solo si es correcta.

Actúa como el punto de control de rigor final antes de que el movimiento sea oficialmente "Punteado" y se pueda actualizar el estado de la factura en la Columna M de HistorialFacturas (ej., "Contabilizada Mayo" ).  

Este framework de conciliación es de alta madurez, combinando la precisión del análisis de costes por proveedor (PerfilProveedores ) con la resiliencia contra fallos de formato bancario (tolerancia de fechas) y la gestión de la repetición de transacciones (anti-duplicidad en la columna O) para mantener el control sobre las Cuentas por Pagar.

### **Documentos de “Control” por H2:**

#### **HistorialFacturas:**

Esta hoja presenta un informe (“Control”) sobre todas las facturas.

Es el registro vivo de las Cuentas por Pagar (AP), alimentada por la automatización "Cebollón" a BD\_Facturas e importada en A2.

Contiene información detallada de cada factura, incluyendo un UID único, Fecha, Proveedor, Importe, su estado de punteo y su información de archivado.

**Las columnas clave son:**  

\-          **UID (Columna A):** Es la llave de búsqueda. Este identificador combina la fecha, el proveedor y el importe (ej.: "01/03/2025\_MailgunTechnologies\_69,00\_€\_77495581\_Norgenic" ), lo que lo convierte en un destino ideal para la fórmula de punteo.  

\-          **Información UID (B:D):** Aplicamos una función split por delimitador "\_" para dividir la información de A en distintas columnas.

\-          **Formulas para fechas/periodo (H:K):** Aplicamos formulas para extraer Dia/Mes/Año y encontrar el periodo de facturación al que debería pertenecer la factura. Coincidirá con la contabilidad si llega y la procesamos a tiempo.

\-          **Punteada (L):** Indica el estado de la conciliación con el movimiento bancario (ej.: Si ) buscando una coincidencia entre el UID de HistorialFacturas y la columna "G" donde ponemos el UID de las facturas que punteamos.

\-          **Seguimiento (M:P):** Mediante las automatizaciones "Reenvio" y "ComprobaciónFras" marcamos las facturas enviadas indicando su ID y la carpeta en al que se encuentran.

\-          **RegexMovimiento/RegexMasDatos:** Patrones de expresiones regulares y de búsqueda que el flujo Cebollón utiliza para etiquetar o preparar la factura para su futura conciliación con el banco.  

Sus triggers son puramente automáticos, “soft-triggers” que consisten en los siguientes:

##### **Triggers:**

\-          **“BD\_Facturas”:** Los cambios en ese documento transmiten mediante una fórmula “query” en la columna A y representan la información de las facturas en las columnas “B:K”.

\-          **FacturasPendientes**: Cuando una factura se asocia a un movimiento bancario (H0) se indica automáticamente en la columna “L”.  
 Las facturas que aún no se hayan punteado (“FacturasPendientes”) deberán ser valoradas por H2 según si son necesarias o no para la facturación de ese mes o no y si se necesitan puntear urgentemente (J0.A) o podemos esperar a que nos lleguen los movimientos bancarios con los que puntearlas.

\-          **C1/C2:** Indican la información sobre el archivo de las facturas (ej: UID del archivo, nombre de la carpeta en la que se encuentran, …) en las columnas “M:P”.

#### **FacturasFaltantes:**

Esta hoja presenta un informe sobre los cobros de proveedores (movimientos bancarios con asignación de gasto \= “proveedor”) pendientes de asignar-les una factura.

El objetivo es tener una lista de las facturas, que nos falta asociar, para saber si necesitamos pedirlas o no y cuando.

**Usa la siguiente formula:**

    \=QUERY(Movimientos\_cuenta\_XXXXXXX\!A268:J; "select A,B,C,D,E where J \= 'Proveedores' and G= ''";)

Utilizada para registrar las facturas que están pendientes de puntear o de recibir.

**Las columnas clave son:**  

 

##### **“Soft-trigger” Automático:**

\-          “**Movimientos\_cuenta\_008723\!G**”: Los cambios en esa columna se reflejan aquí añadiendo o quitando cobros de la lista. A partir de ella se ha de decidir (H2) si son necesarias para ese periodo contable o no y si requieren un punteo urgente o no con las facturas que les corresponden para saber si pedirlas (J0.B) o esperar a que nos lleguen.

#### **Compr.Fras.Manual:**

Una lista de control manual.

**Las columnas clave son:**

\-          **Registro:**

o   **Columna D**: se añaden manualmente las factura teóricamente enviadas por la empresa a los fiscalistas.

o   **Columna L:** se añaden manualmente las facturas contenidas en la carpeta "Recibidas" compartida con los fiscalistas.

o   **Columna N** se añaden manualmente las facturas contenidas en la carpeta "Contabilizadas" compartida con los fiscalistas.

o   **Columna P:** se añaden manualmente las facturas contenidas en la carpeta "Contabilizadas" compartida con los fiscalistas.

\-          **Control:**

o   **Columna A:** saca los valores únicos de facturas en Movimientos\_cuenta\_XXXXXXX\!G where Movimientos\_cuenta\_XXXXXXX\!L (Periodo Contable) \= A1.

o   **Columna H:** indica en que carpeta se encuentra cada una de las facturas indicadas en la columna D buscándolas, mediante fórmulas en otras columnas y esa, entre las facturas de las columnas previamente mencionadas "L"/"N"/"P".

o   **La columna B:** compara las facturas indicadas en la Columna A, las busca con buscarv en la columna D (facturas enviadas) y devuelve la columna H (ubicación actual) en caso de encontrarla. El objetivo es comprobar que todas las facturas que están punteadas en los movimientos bancarios se encuentran en alguna de las facturas.

##### **“Soft-triggers” automáticos ante cambios en:**

\-          Movimientos\_cuenta\_XXXXXXX\!G (Facturas Manualmente Punteadas)

\-          Movimientos\_cuenta\_XXXXXXX\!L (Periodo Contable)

#### **Proveedores Especiales:**

Son bases de datos de movimientos que requieren un tratamiento especial, como los micro pagos de Google Ads o los pagos de telecomunicaciones de Nexmo, que a menudo se consolidan para su posterior conciliación en la hoja principal de movimientos bancarios.  

Por ejemplo, aquellos que presentan varios movimientos por factura (ej: Google o Nexmo) y se ha de comprobar que sumatorio coincide con que factura y si se nos está cobrando de forma adecuada en caso de que no pueda existir coincidencia exacta en sumatorios por factura.

 

Recogen mediante fórmulas query en A2 los movimientos bancarios de proveedores que requieren especial cuidado mostrando toda su información relevante.

 

Si los importes coinciden o la diferencia es aceptable daremos el informe como aceptable y precederemos con el flujo hacia la valoración de cierre de mes. En caso contrario enviaremos una petición de revisión a nuestro superior (J2) para luego tratarlo acorde a sus sugerencias (H0).

 

##### **“Soft-trigger” automáticos ante cambios en:**

\-          Movimientos\_cuenta\_XXXXXXX\!C (Movimientos con el nombre del proveedor deseado)

#### **Plataformas (Desvinculado de Cierre):**

La hoja ResumenPlataformas, es alimentada por la clasificación de gastos Movimientos\_cuenta\_XXXXXXX\!I:K.

 

Detalla las transacciones mensuales por plataforma de pago (CheckOut, Adyen, Solid Processing), desglosando PayOuts, Fees y Otros Gastos. Es crucial para el análisis de costes variables y la eficiencia de las pasarelas de pago.  

Permite segregar y analizar los siguientes componentes por plataforma:  

\-          PayOuts: El ingreso bruto total procesado.

\-          Fees: Las comisiones cobradas por la pasarela de pago.  

\-          Otros Gastos: Cargos diversos.

 

Recoge mediante fórmulas query los movimientos bancarios de las plataformas bancarias que requieren especial cuidado.

##### **“Soft-trigger” automáticos ante cambios en:**

\-          Movimientos\_cuenta\_XXXXXXX\!K (Plataformas de pago)

 

En las columnas importadas hemos de ver los ingresos y gastos y comprobar que coinciden con la factura proporcionada por cada una de las plataformas de pago.

Este informe no tiene relación directa con el cierre de mes ya que no se da en el mismo plazo, pero sí que se ha de ir mirando e informando de su estado a nuestro superior.

Si los importes coinciden o la diferencia es aceptable daremos el informe como aceptable. En caso contrario enviaremos una petición de revisión a nuestro superior (J2) para luego tratarlo acorde a sus sugerencias (H0).

 

 

 

 

 

### **Análisis Financiero y Métricas Clave**

El diseño del ecosistema de Hojas de Cálculo, impulsado por la clasificación I-K, está específicamente orientado a producir métricas financieras de alto nivel, cruciales para la Dirección Financiera (CFO).  

 

#### **CashFlowDin.Table**  

Es una tabla dinámica que consolida los totales de los movimientos de caja, categorizados por CF in/out y CF category (ej: Bancos, Proveedores).

Los totales clasificados (CF category, CF in/out) se agregan a través de fórmulas de suma para construir el informe de Cash Flow mensual y trimestral.  

Esta hoja es la base para calcular las métricas críticas, como la liquidez y el Burn Rate. Los totales clasificados (CF category, CF in/out) se agregan a través de fórmulas de suma para construir el informe de Cash Flow mensual y trimestral.

 

Fórmulas Implícitas (Ejemplo): Las celdas en CashFlow contienen sumas complejas (SUM) que agregan el campo Importe del archivo Movimientos\_cuenta\_XXXXXXX según el PeriodoCobro y la CF category, permitiendo la vista mensual del flujo de caja.  

 

#### **CashFlow**  

Presenta una proyección mensual de la liquidez (Caja que tengo en el banco). Contiene las entradas (CFF in, CFO in) y salidas (CFF out, CFO out) de caja segregadas por mes (Ene-25 a Dic-26).  

 

#### **Cash Flow Forecasting y Burn Rate (Runway)**

La Columna H, que indica el periodo de cobro, es esencial para transformar el registro de transacciones históricas en una herramienta de gestión predictiva de la tesorería (Cash Flow Forecasting). Esta segregación temporal, combinada con la clasificación de costes I-K, permite distinguir y analizar el Cash Flow Operativo (CFO) de la actividad principal de la entidad, y el Cash Flow Financiero (CFF).

El CFO es el indicador primario de la sostenibilidad y capacidad de generación de ingresos, mientras que el CFF mide la dependencia de fuentes externas (deuda, capital).  

 

La segregación I-K también alimenta el cálculo de la Tasa de Consumo de Efectivo (Burn Rate), una métrica vital para startups y empresas en crecimiento. El Burn Rate mide la cantidad de efectivo neto que se gasta mensualmente. Este dato se utiliza para proyectar la Runway (pista de aterrizaje), que es el tiempo que la empresa puede operar antes de agotar sus reservas: Runway=Capital Disponible/Burn Rate Mensual.  

 

El monitoreo de la Runway permite a la dirección asegurarse de que se mantenga el colchón de liquidez recomendado (generalmente entre tres y seis meses de gastos operativos), mitigando el riesgo de insolvencia.  

 

### **Hojas de Gestión**

 

#### **Links**  

Mapea los procesos automatizados (flujos n8n) con sus carpetas de origen y destino en Google Drive. Esta hoja es el backbone de la infraestructura de automatización de datos.  

 

# **Recomendaciones para la Optimización de Sistemas**

 

Escalabilidad Tecnológica: Si bien la solución de Google Sheets y n8n es altamente eficiente para el tamaño actual de la entidad, el riesgo de la fragilidad de REGEX se agravará con el aumento del volumen de transacciones y la diversificación bancaria. Para garantizar la escalabilidad a largo plazo, la entidad deberá evaluar la migración a sistemas ERP o TMS (Treasury Management Systems) que integren capacidades nativas de machine learning para la conciliación de extractos, los cuales están diseñados para ser agnósticos al formato bancario y son más resilientes que las expresiones regulares.  

 

 

