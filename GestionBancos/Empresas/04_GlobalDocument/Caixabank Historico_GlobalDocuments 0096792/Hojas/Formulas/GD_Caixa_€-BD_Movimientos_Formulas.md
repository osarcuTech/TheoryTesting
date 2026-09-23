---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos]
component: A2
related: 
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Listar las formulas de [[GD_Caixa_€-BD_Movimientos]]

---
## 📋 F1
=QUERY(BD_Banco!A2:F;"select *";0)

## 📋 F2
=ArrayFormula(C2:C&"'-'"&D2:D)

## 📋 F3
=ArrayFormula(TEXTO(A2:A;"yyyy/mm")) 

## 📋 F4
=ArrayFormula(BUSCARV($H$2:$H;BD_AsigCostes!$A$2:$B;2;0)) 

## 📋 F5
=ArrayFormula(BUSCARV($H$2:$H;BD_AsigCostes!$A$2:$C;3;0)) 

## 📋 F6




