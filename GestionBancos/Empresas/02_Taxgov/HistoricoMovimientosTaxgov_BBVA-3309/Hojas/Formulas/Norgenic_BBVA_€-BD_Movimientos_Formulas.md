---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos]
component: A2
related: 
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Listar las formulas de [[Norgenic_BBVA_€-BD_Movimientos]]

---
## 📋 F1
=query(BD_Banco!A:K)

## 📋 F2
=ArrayFormula(D2:D&"'-'"&E2:E)

## 📋 F3
=ArrayFormula(TEXTO(B2:B;"yyyy/mm"))

## 📋 F4
=ArrayFormula(BUSCARV($L2:$L;BD_AsigCostes!$A:$B;2;0)) 

## 📋 F5
=ArrayFormula(BUSCARV($L2:$L;BD_AsigCostes!$A:$C;3;0)) 

## 📋 F6



