---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos]
component: A2
related: 
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Listar las formulas de [[Norgenic_Sabadell_€-BD_Movimientos]]

---
## 📋 F1
=QUERY(BD_Banco!A:G)

## 📋 F2
=ArrayFormula(TEXTO(A2:A;"yyyy/mm"))

## 📋 F3
=ArrayFormula(BUSCARV($B2:$B;BD_AsigCostes!$A2:$B;2;0))

## 📋 F4
=ArrayFormula(BUSCARV($B2:$B;BD_AsigCostes!$A2:$C;3;0))

## 📋 F5




