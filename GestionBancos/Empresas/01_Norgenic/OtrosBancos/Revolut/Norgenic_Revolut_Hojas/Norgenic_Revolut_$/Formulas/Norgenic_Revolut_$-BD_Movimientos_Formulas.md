---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos]
component: A2
related: 
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Listar las formulas de [[Norgenic_Revolut_$-BD_Movimientos]]

---
## 📋 F1
=QUERY(BD_Banco!A:AB; "select A,B,F,G,P,T where U = 'USD Main'")

## 📋 F2
=ArrayFormula((C2:C&"'_'"&D2:D))

## 📋 F3
=ArrayFormula(TEXTO(A2:A;"yyyy/mm"))

## 📋 F4
=ArrayFormula(BUSCARV($G2:$G;'BD_AsigCostes_$'!$A2:$B;2;0))

## 📋 F5
=ArrayFormula(BUSCARV($G2:$G;'BD_AsigCostes_$'!$A2:$C;3;0))

## 📋 F6
=IFNA(INDICE(GOOGLEFINANCE("CURRENCY:USDEUR";"price";B117);2;2);K95)

## 📋 F7
Primera fila:
=E2*K2

Resto de filas:
=(F3*K3)-(F2*K2)

## 📋 F8



