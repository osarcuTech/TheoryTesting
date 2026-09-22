---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos]
component: A2
related: 
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Listar las formulas de [[Norgenic_Revolut_€-BD_Movimientos]]

---
## 📋 F1
=QUERY(BD_Banco!A:AB; "select A,B,F,G,P,T where U = 'EUR Main'")

## 📋 F2
=ArrayFormula((C2:C&"'_'"&D2:D))

## 📋 F3
=ArrayFormula(TEXTO(A2:A;"yyyy/mm"))

## 📋 F4
=ArrayFormula(BUSCARV($G2:$G;'BD_AsigCostes_€'!$A2:$B;2;0))

## 📋 F5
=ArrayFormula(BUSCARV($G2:$G;'BD_AsigCostes_€'!$A2:$C;3;0))

## 📋 F6



