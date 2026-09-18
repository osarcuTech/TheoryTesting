---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos]
component: A2
related: [[wf_A2_AsignacionDeGastos]], [[A1_ImportarMovimientos_GS]], [[A1_ImportarMovimientos_WF(deprecado)]], [[C0_PunteoFacturas]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Listar las formulas de [[N€Caixa-Form_AsigCostes]]

---
## 📋 F1
=let(
rangoBanco;INDIRECTO("Movimientos_cuenta_0087231!J2:J"& LastRow_Movim_Banco);
rangoBDcostes;INDIRECTO("AsigCostes!A2:A"& lr_AsigCostes);

nuevosCostes;FILTER(rangoBanco; ESNOD(COINCIDIR(rangoBanco; rangoBDcostes; 0)));
nuevosCostesUnicos;unique(nuevosCostes);

nuevosCostesUnicos)

## 📋 F2
=let(
rango;INDIRECTO("A2:A"&lr_FormAsigCostes);
splitDescripciones;arrayformula(split(rango;"'_'";0;0));
splitDescripciones)


## 📋 F3
=let(
rango;INDIRECTO("E2:E"&lr_FormAsigCostes);
arrayformula(
ifs(
rango="Proveedores";"Out_CFO";
rango="Salarios";"Out_CFO";
rango="Impuestos";"Out_CFO";
rango="Publicidad";"Out_CFO";
rango="Bancos";"Out_CFF";
rango="Ventas";"In_CFO";
rango="Bancos";"In_CFF";
rango="Bancos_comisiones_ventas";"In_CFF";
IFNA(rango;VERDADERO)=VERDADERO;""
)
))


## 📋 F4
=ARRAYFORMULA(
let(
formulaAutomatica;"Aquí inicia la fórmula que permitirá indicar la información que tendrán los proveedores cuyos valores de 'Movimientos' o 'Mas Datos' tiendan a variar. Estos hacen imposible una asignación de valores única ya que cada entrada es nueva y la vinculamos con el concepto que le corresponde utilizando regex";


rangoMovimientos;INDIRECTO("$B2:B"&lr_FormAsigCostes);
rangoMasDatos;INDIRECTO("$C2:C"&lr_FormAsigCostes);

textoNoFacturas1;""&";"&""&";"&""&";"&""&";"&""&";"&"";

bancos;"Bancos";
webCaixa;REGEXMATCH(rangoMovimientos; "C. \d{9} \d{4}");
tWebCaixa;("Bancos_Comisiones_Ventas"&";"&"Comisiones"&";"&textoNoFacturas1);
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


formula2ImportarManual;"Esta fórmula importa los datos escritos manualmente, solo si no se ha podido generar datos automáticamente";

rangoCategory;INDIRECTO("$N2:N"&lr_FormAsigCostes);
rangoNombresConceptYregexNombre;INDIRECTO("$O2:O"&lr_FormAsigCostes);
concept;rangoNombresConceptYregexNombre;
rangoSincronico;INDIRECTO("$P2:P"&lr_FormAsigCostes);
rangoFecha1B;INDIRECTO("$Q2:Q"&lr_FormAsigCostes);
rangoFecha2B;INDIRECTO("$R2:R"&lr_FormAsigCostes);
rangoImporte;INDIRECTO("$S2:S"&lr_FormAsigCostes);


explicacionRegexNombre;"Hacemos un split de los nombres introducidos manualmente para poder usarlos individualmente para crear un texto utilizable en la formula Query. Para hacerlo divide el texto con un split; cuenta el nº de elementos y utiliza una plantilla de creación de texto u otra en función del número de nombres";
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


## 📋 F5
