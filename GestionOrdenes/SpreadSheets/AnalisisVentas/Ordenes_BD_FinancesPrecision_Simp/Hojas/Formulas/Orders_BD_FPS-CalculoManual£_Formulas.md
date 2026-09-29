---
title: 
tags: 
component: 
related: 
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Listar las formulas de [[Orders_BD_FPS-CalculoManual£]]

---
## 📋 F1
(Empieza en E5)
=F4+1

## 📋 F2
(Empieza en E5)
=E5+6

## 📋 F3
=SI.ERROR(INDICE(QUERY(SG_Finances!$A$2:$F;"select sum(B) where C='GBP' and F= 'SALE' and A >= date '"&TEXTO($E3;"yyyy-mm-dd")&"' and A<= date '"&TEXTO($F3;"yyyy-mm-dd")&"'");2);0)

## 📋 F4
=SI.ERROR(INDICE(QUERY(SG_Finances!$A$2:$F;"select sum(B) where C='GBP' and F= 'REFUND' and A >= date '"&TEXTO($E3;"yyyy-mm-dd")&"' and A <= date '"&TEXTO($F3;"yyyy-mm-dd")&"'");2);0)

## 📋 F5
=SI.ERROR(INDICE(QUERY(SG_Finances!$A$2:$F;"select sum(B) where C='GBP' and (F= 'RDR' or F= 'RDR_REVERSED' or F= 'CHARGEBACK' or F= 'CHARGEBACK_REVERSED') and A >= date '"&TEXTO($E3;"yyyy-mm-dd")&"' and A<= date '"&TEXTO($F3;"yyyy-mm-dd")&"'");2);0)

## 📋 F6
- Row 1: =PROMEDIO(J3:J)         Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD_FPS-CalculoManual£#J]]
    - Row +3: =B3-G3

## 📋 F7
- Row 1: =PROMEDIO(K3:K)         Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD_FPS-CalculoManual£#K]]
    - Row +3: =C3-(H3*(-1))

## 📋 F8
- Row 1: =PROMEDIO(L3:L)         Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD_FPS-CalculoManual£#L]]
    - Row +3: =D3-(I3*(-1))

## 📋 F9
