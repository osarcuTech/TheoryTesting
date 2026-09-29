---
title: 
tags: 
component: 
related: 
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Listar las formulas de [[Orders_BD-CalculoManual$]]

---
## 📋 F1
(Empieza en E4)
=F3+1

## 📋 F2
(Empieza en E4)
=E4+6

## 📋 F3
=INDICE(QUERY(SG_Orders!$K$2:$P;"select sum(M) where K='Checkout' AND (L = 'ITIN' or L = 'SRVITIN' or L='UTF') and P >= date '"&TEXTO($E3;"yyyy-mm-dd")&"' and P<= date '"&TEXTO($F3;"yyyy-mm-dd")&"'");2)

## 📋 F4
=SI.ERROR(INDICE(QUERY(SG_Orders!$F$2:$Q;"select sum(M) where K='Checkout' AND (L = 'ITIN' or L = 'SRVITIN' or L='UTF') and F= 'refunded' and Q >= date '"&TEXTO($E3;"yyyy-mm-dd")&"' and Q<= date '"&TEXTO($F3;"yyyy-mm-dd")&"'");2);0)

## 📋 F5
- Row 1: =PROMEDIO(I3:I)         Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD-CalculoManual$#I]]
    - Row +3: =B3-G3

## 📋 F6
- Row 1: =PROMEDIO(J3:J)         Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD-CalculoManual$#J]]
    - Row +3: =C3-H3

## 📋 F7
