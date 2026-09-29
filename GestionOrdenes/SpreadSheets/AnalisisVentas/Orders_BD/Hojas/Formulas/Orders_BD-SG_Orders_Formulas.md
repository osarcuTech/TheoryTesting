---
title: 
tags: 
component: 
related: 
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Listar las formulas de [[Orders_BD-SG_Orders]]

---
## 📋 F1
=BUSCARV(G2;MID!$B$2:$C;2)

## 📋 F2
=SI(H2="Norgenic_sandbox";"Test"; REGEXEXTRACT(A2;"^(?:ABN|ACA|ITIN|TFN|UKPA|UTF|SRVITIN|NZBC)"))

## 📋 F3
=--(REGEXREPLACE(D2;"\.";","))

## 📋 F4
=FECHA(
INDICE(ArrayFormula(SPLIT(SPLIT(B2;" ");"/"));3);
INDICE(ArrayFormula(SPLIT(SPLIT(B2;" ");"/"));2);
INDICE(ArrayFormula(SPLIT(SPLIT(B2;" ");"/"));1)
)

## 📋 F5
=FECHA(
INDICE(ArrayFormula(SPLIT(SPLIT(C2;" ");"/"));3);
INDICE(ArrayFormula(SPLIT(SPLIT(C2;" ");"/"));2);
INDICE(ArrayFormula(SPLIT(SPLIT(C2;" ");"/"));1)
)

## 📋 F6
=SUSTITUIR(SUSTITUIR(P2;"/";"-");"-";"/")&";"&I2&";"&J2

## 📋 F7
=SI(K2="revolut";QUERY(RevolutOrders!$A$2:$K;"select A where (K ='"&$R2&"' and A contains 'psp_')";0);"")

## 📋 F8
=SI(Y($K2="revolut";$F2="refunded");(QUERY(RevolutOrders!$A$2:$K;"select F where A ='"&$S2&"'";0));"")

## 📋 F9


