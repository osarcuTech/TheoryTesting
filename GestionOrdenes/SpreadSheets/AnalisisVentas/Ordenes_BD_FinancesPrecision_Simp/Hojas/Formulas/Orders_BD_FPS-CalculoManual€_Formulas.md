---
title: 
tags: 
component: 
related: 
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Listar las formulas de [[Orders_BD_FPS-CalculoManual€]]

---
## 📋 F1
=IZQUIERDA(A3;10)

## 📋 F2
=G3-6

## 📋 F3
=REGEXREPLACE(B3;"/";"-")-1

## 📋 F4
=SI.ERROR(INDICE(QUERY(SG_Finances!$A$2:$F;"select sum(D) where E='EUR' and (C<>'GBP' or A<= date '"&TEXTO(("28/4/2026");"yyyy-mm-dd")&"') and F= 'SALE' and A >= date '"&TEXTO($F3;"yyyy-mm-dd")&"' and A<= date '"&TEXTO($G3;"yyyy-mm-dd")&"'");2);0)

## 📋 F5
=SI.ERROR(INDICE(QUERY(SG_Finances!$A$2:$F;"select sum(D) where E='EUR' and (C<>'GBP' or A<= date '"&TEXTO(("28/4/2026");"yyyy-mm-dd")&"') and F= 'REFUND' and A >= date '"&TEXTO($F3;"yyyy-mm-dd")&"' and A<= date '"&TEXTO($G3;"yyyy-mm-dd")&"'");2);0)

## 📋 F6
=SI.ERROR(INDICE(QUERY(SG_Finances!$A$2:$F;"select sum(D) where E='EUR' and (C<>'GBP' or A<= date '"&TEXTO(("28/4/2026");"yyyy-mm-dd")&"') and (F= 'RDR' or F= 'RDR_REVERSED' or F= 'CHARGEBACK' or F= 'CHARGEBACK_REVERSED') and A >= date '"&TEXTO($F3;"yyyy-mm-dd")&"' and A<= date '"&TEXTO($G3;"yyyy-mm-dd")&"'");2);0)

## 📋 F7
    - Row 1: =PROMEDIO(K3:K)        Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD_FPS-CalculoManual€#K]]
    - Row +3: =C3-H3
## 📋 F8
    - Row 1: =PROMEDIO(L3:L)        Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD_FPS-CalculoManual€#L]]
    - Row +3: =D3-(I3*(-1))

## 📋 F9
    - Row 1: =PROMEDIO(M3:M)        Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD_FPS-CalculoManual€#M]]
    - Row +3: =E3-(J3*(-1))

## 📋 F10
    