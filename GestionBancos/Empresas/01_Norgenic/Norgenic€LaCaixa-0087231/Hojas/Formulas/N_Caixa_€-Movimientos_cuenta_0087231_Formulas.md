---

---

# ''

## 🎯 Objetivo

Listar las formulas de [[N_Caixa_€-Movimientos_cuenta_0087231]]

---
## 📋 F1
=let(
rangoValidación;INDIRECTO("P2:P"&LastRow_Movim_Banco);
rangoSugerencias;INDIRECTO("O2:O"&LastRow_Movim_Banco);
rangoFrasManuales;INDIRECTO("Q2:Q"&LastRow_Movim_Banco);
formula;ARRAYFORMULA(SI(rangoValidación=VERDADERO;rangoSugerencias;rangoFrasManuales));
eFormula;"Si damos tick en la columna P devuelve la sugerencia de CO de la columna O, en caso contrario devuelve lo que hayamos introducido manualmente en la columna Q";

formula
)
[[N_Caixa_€-Rangos]];

## 📋 F2
=let(
lastRow;LastRow_Movim_Banco;
ArrayFormula(DERECHA($B2:INDICE(B:B;lastRow);7)))


[[N_Caixa_€-Rangos]]


## 📋 F3
=let(
rangoMovimientos;INDIRECTO("D2:D"&LastRow_Movim_Banco);
rangoMasDatos;INDIRECTO("E2:E"&LastRow_Movim_Banco);
MAP(rangoMovimientos; rangoMasDatos; LAMBDA(mov; mas; TEXTJOIN("'_'"; 0; mov; mas)))
)


## 📋 F4
=ARRAYFORMULA(
  LET(
    rangoDescripcion; INDIRECTO("AsigCostes!A2:E" & lr_AsigCostes);
    rangoValorBusqueda;INDIRECTO("Movimientos_cuenta_0087231!J2:J" & LastRow_Movim_Banco);
    a; BUSCARV(rangoValorBusqueda; rangoDescripcion; 4; 0);
    b; BUSCARV(rangoValorBusqueda; rangoDescripcion; 5; 0);
    hacerSplit;HSTACK(a; b);
explicacion;"Busca una coincidencia de 'DescripciónMovimiento' mediante buscarV (entre el valor de esta Hoja 'rangoValorBusqueda' y la hoja 'AsigCostes' en su rango 'rangoDescripcion' ) y devuelve 'CF in/out' (a) y 'CF category' (b) luego hace un 'split' para separarlo en dos columnas";
    hacerSplit
  )
)

## 📋 F5
=let(
lastRow;LastRow_Movim_Banco;
limiteFras; INDIRECTO("$E2:$E"& lastRow);
limiteCategory; INDIRECTO("$L2:$L"& lastRow);
ArrayFormula(SI(limiteCategory="Bancos";IFNA(IFS(limiteFras="Solid Processing Limited";"SolidProcessing";limiteFras="GTWS Tech Limited";"Adyen";limiteFras="CHASDEFXXXX-CHECKOUT SAS";"CheckOut";limiteFras="GTWS TECH LIMITED  SOLIDGATE";"SOLIDGATE");"OtherBancs");""))
)

## 📋 F6
=let(
fecha;INDIRECTO("B2:B"&LastRow_Movim_Banco);
fechaValor;INDIRECTO("C2:C"&LastRow_Movim_Banco);
rangoMovimientos;INDIRECTO("D2:D"&LastRow_Movim_Banco);
rangoMasDatos;INDIRECTO("E2:E"&LastRow_Movim_Banco);
importe;INDIRECTO("F2:F"&LastRow_Movim_Banco);
saldo;INDIRECTO("G2:G"&LastRow_Movim_Banco);
factura;INDIRECTO("H2:H"&LastRow_Movim_Banco);
formulaEjemplo;TEXTJOIN("'_'";0;$B3;$C3;$D3;$E3;$F3;$G3;$H3);

MAP(fecha; fechaValor; rangoMovimientos; rangoMasDatos; importe; saldo;factura; LAMBDA(f; fV; mov; mas; i; s; fra; TEXTJOIN("'_'"; 0; f; fV; mov; mas; i; s; fra)))
)

## 📋 F7
=SI($L2<>"Proveedores";"";
Let(
rangos;;
ref_Rangos_PProveedores_Descripcion;INDIRECTO("PProveedores!$A$1:$A"&lr_PProveedores);
limiteFras;INDIRECTO("HistorialFacturas!$A$2:$D"& LastRow_Hist_Fras);

encontrarFila;
let(
 filaCoincidente;COINCIDIR($J2;ref_Rangos_PProveedores_Descripcion;0);
filaCoincidente);
eEncontrarFila;"Buscamos el valore del texto en la columna I (que contiene la concatenación de Movimientos y MasDatos) en la Hoja PProveedores y sacamos con coincidir la fila de coincidencia";

buscarTextoQuery;"";

buscarTextoNombre;INDIRECTO("PProveedores!E"&encontrarFila);
eBuscarTextoNombre;"Devuelve un texto tipo (C= 'Google' )";

buscarTextoMinFecha;INDIRECTO("PProveedores!F"&encontrarFila);
ebuscarTextoMinFecha;"Devuelve un texto tipo 'and B = date '";

buscarTextoNumeroMinFecha;INDIRECTO("PProveedores!G"&encontrarFila);
ebuscarTextoNumeroMinFecha;"Devuelve un texto tipo -7 '";


buscarTextoMaxFecha;INDIRECTO("PProveedores!H"&encontrarFila);
ebuscarTextoMaxFecha;"Devuelve un texto tipo 'and B <= date '";

buscarTextoNumeroMaxFecha;INDIRECTO("PProveedores!I"&encontrarFila);
ebuscarTextoNumeroMaxFecha;"Devuelve un texto tipo 15 '";

buscarTextoImporte;INDIRECTO("PProveedores!J"&encontrarFila);
ebuscarTextoImporte;"Devuelve un texto booleano 0 / 1 para decidir si se ha de comprobar el importe o no";


crearTextoQuery;"";
supportFechas;"Busca el número que se sumara o restara a la fecha y si esta vacío devuelve 0 para no sumar ni restar.";
supportMinFecha; SI(buscarTextoNumeroMinFecha<>""; buscarTextoNumeroMinFecha; "0");
supportMaxFecha; SI(buscarTextoNumeroMaxFecha<>""; buscarTextoNumeroMaxFecha; "0");

rangoFechas;"Establecemos el rango de fechas sumando los nomeros minimos y maximos a la fecha segun el banco para tener un rango de busqueda en vez de una fecha fija. Ej:7 + -5 Y 7 + 8 dando un rango de fechas entre el dia 2 (fecha minima) y el 15 (fecha maxima)";
minFechaBanco; "'" & TEXTO(($B2+supportMinFecha); "yyyy-mm-dd") & "'";
maxFechaBanco; "'" & TEXTO(($B2+supportMaxFecha); "yyyy-mm-dd") & "'";

eRegexFecha;"Si buscarTextoMinFecha no está vacío (ej: 'and B >= date ' ) devuelve esto más la fecha generada al sumar el rango. Creamos dos pedazos de query para generar la parte de la query que indica la fecha. Primero generamos regexMinfecha (ej: and B >= date 02/MM/YYYY') y luego regexMaxfecha (ej: and B <= date 21/MM/YYYY')";
regexMinfecha; SI((buscarTextoMinFecha<>""); (buscarTextoMinFecha & minFechaBanco); " ");
regexMaxfecha; SI((buscarTextoMaxFecha<>""); (buscarTextoMaxFecha & maxFechaBanco); " ");

regexImporte;SI(VALOR(buscarTextoImporte)=1; " and D = "&SUSTITUIR(SUSTITUIR(SUSTITUIR(TEXTO(ABS(-$F2);"0.00");".";";");",";".");";";"");"");
textoQuery;"select A where " & ESPACIOS(buscarTextoNombre&regexMinfecha&regexMaxfecha&regexImporte);
eTextoQuery;"Devuelve un texto utilizable por la formula query para buscar entre las facturas. Ejemplo: select A where (C= 'Everapi' or C= 'CURRENCYAPI.COM' ) and B = date '2024-11-28'";

ejecucionQuery;"Usamos la query en el rango de nuestro historial de facturas (limiteFras) usando el texto de selección previo (textoQuery)";
formulaQuery;QUERY(limiteFras;textoQuery);

logicaRestrictiva;"Aplicamos una lógica para que solo nos devuelva el primer resultado que no haya sido usado previamente";
nCoincidencias;CONTARA(formulaQuery);
primeraCoincidencia;INDICE(formulaQuery;1);
rangoPuntear;$O$1:$O1;
rangoPuntear_archivado; INDIRECTO("BD_Banco!K$2:K"&lr_BdBanco);
rangoPuntear_total; VSTACK(rangoPuntear;rangoPuntear_archivado);
eRangoPuntear_total;"Concatena los rangos donde aparecen los nombres de las facturas punteadas con exito de ambas hojas";

valoresNoPunteados;FILTER(formulaQuery;ESNOD(COINCIDIR(formulaQuery; rangoPuntear_total; 0)));
primeraNoPunteada;INDICE(valoresNoPunteados;1);

outputQueryCondicionada;SI(nCoincidencias>1;primeraNoPunteada;formulaQuery);

noProveedor;ESNOD(encontrarFila);
sinCoincidencias;ESNOD(formulaQuery);

letOutput;ifs(noProveedor;"NoProveedor"; sinCoincidencias;"SinCoincidencias";VERDADERO;outputQueryCondicionada);



letOutput)
)



## 📋 F5
## 📋 F5
## 📋 F5
## 📋 F5
