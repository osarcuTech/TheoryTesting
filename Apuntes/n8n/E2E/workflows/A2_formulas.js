/*  */

/* Formula (AsigCostes!A) Movimiento
=let(queryCostes;QUERY(INDIRECTO("Movimientos_cuenta_0087231!A2:D"& LastRow_Movim_Banco); "select C,D";);unique(queryCostes))
*/

/* Formula (AsigCostes!C) CF in/out 
=let(
rango;INDIRECTO("D2:D"&lr_AsigCostes);
arrayformula(
ifs(
rango="Proveedores";"Out_CFO";
rango="Salarios";"Out_CFO";
rango="Impuestos";"Out_CFO";
rango="Publicidad";"Out_CFO";
rango="Bancos";"Out_CFF";
rango="Ventas";"In_CFO";
rango="Bancos";"In_CFF";
IFNA(rango;VERDADERO)=VERDADERO;""
)
))
*/


/* Formula (AsigCostes!D) Patron_CF_Category

=ARRAYFORMULA(
let(
formulaAutomatica;"Aquí inicia la formula que permetira indicar la información que tendran los proveedores cuyos valores de 'Movimientos' o 'Mas Datos' tiendan a variar. Estos hacen imposible una asignación de valores unica ya que cada entrada es nueva y la vinculamos con el concepto que le coresponde utilizando regex";


rangoMovimientos;INDIRECTO("$A2:A"&lr_AsigCostes);
rangoMasDatos;INDIRECTO("$B2:B"&lr_AsigCostes);

textoNoFacturas1;""&";"&""&";"&""&";"&""&";"&""&";"&"";

bancos;"Bancos";
webCaixa;REGEXMATCH(rangoMovimientos; "C. \d{9} \d{4}");
tWebCaixa;("Bancos"&";"&"Comisiones"&";"&textoNoFacturas1);
addon;REGEXMATCH(rangoMovimientos; "ADDON");
tAddon;("Bancos"&";"&"Addon"&";"&textoNoFacturas1);
compraDivisas;REGEXMATCH(rangoMovimientos;"COMPRA DIVISAS");
tCompraDivisas;("Bancos"&";"&"CompraDivisas"&";"&textoNoFacturas1);
regTarjeta;REGEXMATCH(rangoMovimientos;"REGUL.OP.TARJETA");
tRegTarjeta;("Bancos"&";"&"TarjetaAddon"&";"&textoNoFacturas1);
cancelRegTarjeta;REGEXMATCH(rangoMovimientos;"ANUL.REGUL.OP.TARJ.");
tCancelRegTarjeta;("Bancos"&";"&"cTarjetaAddon"&";"&textoNoFacturas1);

Impuestos;"Impuestos";
Sociedades;REGEXMATCH(rangoMovimientos; "SOCIEDADES.MOD");
tSociedades;("Impuestos"&";"&"Sociedades"&";"&textoNoFacturas1);
IRPF;REGEXMATCH(rangoMovimientos; "I.R.P.F. MOD.");
tIRPF;("Impuestos"&";"&"IRPF"&";"&textoNoFacturas1);
AEAT;REGEXMATCH(rangoMovimientos; "IMPUESTOS AEAT");
tAEAT;("Impuestos"&";"&"AEAT"&";"&textoNoFacturas1);
Sociedades2;REGEXMATCH(rangoMovimientos; "FIN \d{13}");
tSociedades2;("Impuestos"&";"&"Sociedades(Fraccionamiento)"&";"&textoNoFacturas1);

Salarios;"Salarios";
nominas;REGEXMATCH(rangoMovimientos; "PAG NOMINAS");
tNominas;("Salarios"&";"&"Nominas"&";"&textoNoFacturas1);

Ventas;"Ventas";
ventasCaixa;REGEXMATCH(rangoMovimientos; "WEB\d+ \d+");
tVentasCaixa;("Ventas"&";"&"Ventas"&";"&textoNoFacturas1);

Proveedores;"Proveedores";
movistar1;REGEXMATCH(rangoMovimientos; "FIJO932761128");
tMovistar1;(Proveedores&";"&"FIJO932761128"&";"&"(C='FIJO932761128' or C='Movistar') "&";"&"and B >= date "&";"&"-7"&";"&"and B <= date "&";"&"7"&";"&"1");
movistar2;REGEXMATCH(rangoMovimientos; "FIJONOL000000");
tMovistar2;(Proveedores&";"&"FIJONOL000000"&";"&"(C='FIJONOL000000' or C='Movistar') "&";"&"and B >= date "&";"&"-7"&";"&"and B <= date "&";"&"7"&";"&"1");
linkedIn;REGEXMATCH(rangoMovimientos; "LinkedIn *");
tLinkedIn;(Proveedores&";"&"LinkedIn"&";"&"(C='LinkedIn') "&";"&"and B = date " &";"& "" &";"& "" &";"& "" &";"& "1");
ricardoAlfaro;REGEXMATCH(rangoMasDatos; "Ricardo Alfaro Peropadre");
tRicardoAlfaro;(Proveedores&";"&"Ricardo Alfaro Peropadre"&";"&"(C ='RicardoAlfaroPeropadre') "&";"&"and B >= date "&";"&"-20"&";"&"and B <= date "&";"&"0"&";"&"1");
coremind;REGEXMATCH(rangoMasDatos; "Coremind Ventures SL");
tCoremind;(Proveedores&";"&"Coremind Ventures SL"&";"&"(C='Coremind') "&";"&"and B >= date "&";"&"-30"&";"&"and B <= date "&";"&"0"&";"&"1");


asignacion;IFS(
movistar1;tMovistar1;movistar2;tMovistar2;ricardoAlfaro;tRicardoAlfaro;coremind;tCoremind;linkedIn;tLinkedIn;
webCaixa;tWebCaixa;addon;tAddon;compraDivisas;tCompraDivisas;regTarjeta;tRegTarjeta;cancelRegTarjeta;tCancelRegTarjeta;
ventasCaixa;tVentasCaixa;
AEAT;tAEAT;IRPF;tIRPF;Sociedades;tSociedades;Sociedades2;tSociedades2;
nominas;tNominas
);
outputF1;asignacion;
outputAutomatico;split(asignacion;";");


formula2ImportarManual;"Esta formula importa los datos escritos manualmente, solo si no se ha podido generar datos automaticamente";

rangoCategory;$M2:M750;
rangoNombresConceptYregexNombre;$N2:N750;
concept;rangoNombresConceptYregexNombre;
rangoSincronico;$O2:O750;
rangoFecha1B;$P2:P750;
rangoFecha2B;$Q2:Q750;
rangoImporte;$R2:R750;
rangoSugerAuto;"$U2:U750";

explicacionRegexNombre;"Hacemos un split de los nombres introducidos manualmente para poder usarlos individualmente para crear un texto utilizable en la formula Query. Para hacerlo divide el texto con un split; cuenta el nº de elementos y utiliza una plantilla de creación de texto u otra en función del numero de nombres";
explicacionRegexNombre2;"El problema radica en cómo se procesa rangoNombresConceptYregexNombre (tu concept). Funciones como SPLIT, TRANSPONER, CONTARA e INDICE no se aplican automáticamente fila por fila en un contexto de array dentro de LET; en su lugar, tratan el rango entero como un bloque único, lo que hace que b, length y conditionText (y por ende regexNombre) se calculen solo basado en el primer valor (o en un agregado de todo el rango), ignorando las variaciones en filas subsiguientes. Esto causa el 'arrastre' del regexNombre de la primera línea.
Recomendación para solucionarlo
Envuelve el procesamiento de regexNombre en una función que itere fila por fila, como MAP combinada con LAMBDA. Esto fuerza una evaluación individual para cada elemento de rangoNombresConceptYregexNombre, generando un array de regexNombre correcto.";
regexNombre; MAP(rangoNombresConceptYregexNombre; LAMBDA(concept;
      LET(
        spread; SPLIT(concept; "/");
        b; TRANSPONER(spread);
        length; CONTARA(b);
        textoQuery1; "(C= '" & INDICE(b; 1) & "' )";
        textoQuery2; "(C= '" & INDICE(b; 1) & "' or C= '" & INDICE(b; 2) & "' ) ";
        conditionText; SI(length < 2; textoQuery1; textoQuery2);
        conditionText
      )
    ));

RegexFecha1A;SI(rangoSincronico=VERDADERO;"and B = date ";"and B >= date ");
RegexFecha1B;rangoFecha1B;
RegexFecha2A;SI(rangoSincronico=VERDADERO;"";"and B <= date ");
RegexFecha2B;rangoFecha2B;
Importe;SI(rangoImporte=VERDADERO;1;0);

textoNoFacturas;"" &";"& "" &";"& "" &";"& "" &";"& "" &";"& "";
textoFacturas;regexNombre &";"& RegexFecha1A &";"& RegexFecha1B &";"& RegexFecha2A &";"& RegexFecha2B &";"& Importe;
patronNF;(SI(rangoCategory<>"";rangoCategory;"-") & ";" & SI(concept<>"";concept;"-") & ";" & textoNoFacturas);
patronF; (SI(rangoCategory<>"";rangoCategory;"-") & ";" & SI(concept<>"";concept;"-") & ";" & textoFacturas);

ifPatron;SI(rangoCategory="Proveedores";patronF;patronNF);
outputF2;ifPatron;
output2;split(ifPatron;";";FALSO;FALSO);

finFormula2;"";

f;IFNA(outputAutomatico;output2);

logicaFormulaPadre;"Si formula1 no consigue generar resultados usamos formula2";
logicaFpadre;IFNA(outputF1;outputF2);
fPadre;split(logicaFpadre;";";FALSO;FALSO);


fPadre))
*/



/* Movimientos_cuenta_0087231!O

=SI($J2<>"Proveedores";"";
Let(
rangos;;
ref_Rangos_PProveedores_Movimientos;INDIRECTO("PProveedores!$A$1:$A"&lr_PProveedores);
ref_Rangos_PProveedores_MasDatos;INDIRECTO("PProveedores!$B$1:$B"&lr_PProveedores);
limiteFras;INDIRECTO("HistorialFacturas!$A$2:$D"& LastRow_Hist_Fras);

encontrarFila;
let(
 arrayBooleanosCoincidenciaMovimiento; arrayformula($C2 = ref_Rangos_PProveedores_Movimientos);
 arrayBooleanosCoincidenciaMasDatos; arrayformula($D2 = ref_Rangos_PProveedores_MasDatos);
 arrayBooleanosDobleCoincidencia; ArrayFormula(arrayBooleanosCoincidenciaMovimiento * arrayBooleanosCoincidenciaMasDatos);
 filaCoincidente;COINCIDIR(1;arrayBooleanosDobleCoincidencia;0);
filaCoincidente);
eEncontrarFila;"Sacamos el array de coincidencias de Movimientos, Mas datos, Multiplicamos los arrays para tener un array en los que solo las dobe coincidencias dan 1 en 'arrayBooleanosDobleCoincidencia' y buscamos en que fila se encuentra la doble coincidencia (1) en 'filaCoincidente' obteniendo así un único numero como 15 que es la fila en la que se encuentra la doble coincidencia";

buscarTextoQuery;"";

buscarTextoNombre;INDIRECTO("PProveedores!D"&encontrarFila);
eBuscarTextoNombre;"Devuelve un texto tipo (C= 'Google' )";

buscarTextoMinFecha;INDIRECTO("PProveedores!E"&encontrarFila);
ebuscarTextoMinFecha;"Devuelve un texto tipo 'and B = date '";

buscarTextoNumeroMinFecha;INDIRECTO("PProveedores!F"&encontrarFila);
ebuscarTextoNumeroMinFecha;"Devuelve un texto tipo -7 '";


buscarTextoMaxFecha;INDIRECTO("PProveedores!G"&encontrarFila);
ebuscarTextoMaxFecha;"Devuelve un texto tipo 'and B <= date '";

buscarTextoNumeroMaxFecha;INDIRECTO("PProveedores!H"&encontrarFila);
ebuscarTextoNumeroMaxFecha;"Devuelve un texto tipo 15 '";

buscarTextoImporte;INDIRECTO("PProveedores!I"&encontrarFila);
ebuscarTextoImporte;"Devuelve un texto booleano 0 / 1 para decidir si se ha de comprobar el importe o no";


crearTextoQuery;"";
supportFechas;"Busca el numero que se sumara o restara a la fecha y si esta vacio devuelve 0 para no sumar ni restar.";
supportMinFecha; SI(buscarTextoNumeroMinFecha<>""; buscarTextoNumeroMinFecha; "0");
supportMaxFecha; SI(buscarTextoNumeroMaxFecha<>""; buscarTextoNumeroMaxFecha; "0");

rangoFechas;"Establecemos el rango de fechas sumando los nomeros minimos y maximos a la fecha segun el banco para tener un rango de busqueda en vez de una fecha fija. Ej:7 + -5 Y 7 + 8 dando un rango de fechas entre el dia 2 (fecha minima) y el 15 (fecha maxima)";
minFechaBanco; "'" & TEXTO(($A2+supportMinFecha); "yyyy-mm-dd") & "'";
maxFechaBanco; "'" & TEXTO(($A2+supportMaxFecha); "yyyy-mm-dd") & "'";

eRegexFecha;"Si buscarTextoMinFecha no esta vacio (ej: 'and B >= date ' ) devuelve esto mas la fecha generada al sumar el rango. Creamos dos pedazos de query para generar la parte de la query que indica la fecha. Primero generamos regexMinfecha (ej: and B >= date 02/MM/YYYY') y luego regexMaxfecha (ej: and B <= date 21/MM/YYYY')";
regexMinfecha; SI((buscarTextoMinFecha<>""); (buscarTextoMinFecha & minFechaBanco); " ");
regexMaxfecha; SI((buscarTextoMaxFecha<>""); (buscarTextoMaxFecha & maxFechaBanco); " ");

regexImporte;SI(VALOR(buscarTextoImporte)=1; " and D = "&SUSTITUIR(SUSTITUIR(SUSTITUIR(TEXTO(ABS(-$E2);"0.00");".";";");",";".");";";"");"");
textoQuery;"select A where " & ESPACIOS(buscarTextoNombre&regexMinfecha&regexMaxfecha&regexImporte);
eTextoQuery;"Devuelve un texto utilizable por la formula query para buscar entre las facturas. Ejemplo: select A where (C= 'Everapi' or C= 'CURRENCYAPI.COM' ) and B = date '2024-11-28'";

ejecucionQuery;"Usamos la query en el rango de nuestro historial de flacturas (limiteFras) usando el texto de seleccion previo (textoQuery)";
formulaQuery;QUERY(limiteFras;textoQuery);

logicaRestrictiva;"Aplicamos una logica para que solo nos devuelva el primer resultado que no haya sido usado previamente";
nCoincidencias;CONTARA(formulaQuery);
primeraCoincidencia;INDICE(formulaQuery;1);
rangoPuntear;$O$1:$O1;

valoresNoPunteados;FILTER(formulaQuery;ESNOD(COINCIDIR(formulaQuery; rangoPuntear; 0)));
primeraNoPunteada;INDICE(valoresNoPunteados;1);

outputQueryCondicionada;SI(nCoincidencias>1;primeraNoPunteada;formulaQuery);

noProveedor;ESNOD(encontrarFila);
sinCoincidencias;ESNOD(formulaQuery);

letOutput;ifs(noProveedor;"NoProveedor"; sinCoincidencias;"SinCoincidencias";VERDADERO;outputQueryCondicionada);



letOutput)
)
*/