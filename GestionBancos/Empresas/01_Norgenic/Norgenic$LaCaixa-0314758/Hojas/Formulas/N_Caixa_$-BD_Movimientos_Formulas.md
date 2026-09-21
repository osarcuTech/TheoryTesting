---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos]
component: A2
related: 
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Listar las formulas de [[N_Caixa_$-BD_Movimientos]]

---
## 📋 F1
=Query(BD_Banco!A2:G;"select * Limit "&CONTARA(BD_Banco!A2:A))

## 📋 F2
=IFS(
E2="ABKL-CY_SOLID_PROCESSING_LIMITED";"SolidProcessing";
E2="ADYB-NL_GTWS_Tech_Limited";"Adyen";
E2="CHAS-DE_CHECKOUT_SAS";"CheckOut";E2="CHAS-DE CHECKOUT SAS";"CheckOut";E2="CHECKOUT_SAS";"ComisionCaixa-CheckOut";E2="CHECKOUT SAS";"ComisionCaixa-CheckOut";
E2="GTWS_Tech_Limited";"SOLIDGATE";E2="GTWS TECH LIMITED  SOLIDGATE";"SOLIDGATE";
D2="MANTENIMIENTO";"Addon";D2="INTERES.DESCUBIERTO";"Addon";D2="COM. TPV ADDON P.";"Addon";D2="8633720003147";"Ventas/Devos";D2="VENTA DIVISAS";"Transf.Cuenta€";REGEXMATCH(D2;"LIQ OP");"Transf.Cuenta€")

## 📋 F3
=ArrayFormula(CONCAT(D2:D;E2:E))

## 📋 F4
=ArrayFormula(TEXTO(B2:B;"yyyy/mm"))

## 📋 F5
=ArrayFormula(BUSCARV($I2:$I;BD_AsigCostes!$A2:$B;2;0))


## 📋 F6
=ArrayFormula(BUSCARV($I2:$I;BD_AsigCostes!$A2:$C;3;0))

## 📋 F7
=IFNA(INDICE(GOOGLEFINANCE("CURRENCY:USDEUR";"price";B659);2;2);N658)

## 📋 F8
Primera fila:
=G2*N2

Siguientes filas, para tener en cuenta la diferencia en tipos de cambio entre fechas:
=(G3*N3)-(G2*N2) ; 

## 📋 F9


