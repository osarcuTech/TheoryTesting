---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos]
component: A2
related: 
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Listar las formulas de [[WW_BBVA_€-BD_Movimientos]]

---
## 📋 F1
=QUERY(BD_Banco!A2:L;"select * limit "&CONTARA(BD_Banco!A2:A))

## 📋 F2
=ArrayFormula(E2:E&"'-'"&F2:F)

## 📋 F3
=ArrayFormula(TEXTO(B2:B;"yyyy/mm"))

## 📋 F4
=ArrayFormula(BUSCARV($N2:$N;BD_AsigCostes!$A2:$B;2;0))

## 📋 F5
=ArrayFormula(BUSCARV($N2:$N;BD_AsigCostes!$A2:$C;3;0))

## 📋 F6



