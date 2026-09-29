---
title: 
tags: 
component: 
related: 
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Listar las formulas de [[Orders_BD-CalculoManual€]]

---
## 📋 F1
=IZQUIERDA(A3;10)

## 📋 F2
=G3-6

## 📋 F3
=REGEXREPLACE(B3;"/";"-")-1

## 📋 F4
=INDICE(QUERY(SG_Orders!$K$2:$P;"select sum(M) where K='Checkout' AND (L='TFN' or L='ACA') and P >= date '"&TEXTO($F3;"yyyy-mm-dd")&"' and P<= date '"&TEXTO($G3;"yyyy-mm-dd")&"'");2)

## 📋 F5
=SI.ERROR(INDICE(QUERY(SG_Orders!$K$2:$P;"select sum(M) where K='Checkout' AND (L = 'UKPA') and P >= date '"&TEXTO($F3;"yyyy-mm-dd")&"' and P<= date '"&TEXTO($G3;"yyyy-mm-dd")&"' and P<= date '"&TEXTO(("28/4/2026");"yyyy-mm-dd")&"'");2);0)

## 📋 F6
=INDICE(QUERY(SG_Orders!$F$2:$Q;"select sum(M) where K='Checkout' AND L='TFN' and F= 'refunded' and Q >= date '"&TEXTO($F3;"yyyy-mm-dd")&"' and Q<= date '"&TEXTO($G3;"yyyy-mm-dd")&"'");2)

## 📋 F7
=SI.ERROR(INDICE(QUERY(SG_Orders!$F$2:$Q;"select sum(M) where K='Checkout' AND (L = 'UKPA') and F= 'refunded' and Q >= date '"&TEXTO($F3;"yyyy-mm-dd")&"' and Q<= date '"&TEXTO($G3;"yyyy-mm-dd")&"' and P<= date '"&TEXTO(("28/4/2026");"yyyy-mm-dd")&"'");2);0)

## 📋 F8
    - Row 1: =PROMEDIO(P3:P)        Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD-CalculoManual€#P]]
    - Row +3: 
        =let(
        TipoAUD;$L3;
        TipoGBP;$M3;
        TFN;$H3*SI(TipoAUD;(1/(REDONDEAR(TipoAUD;1)));0);
        GBP;$I3*SI(TipoGBP;(1/(REDONDEAR(TipoGBP;1)));0);
        suma;TFN+GBP;
        diferencia;$C3-suma;
        diferencia)

## 📋 F9
    - Row 1: =PROMEDIO(Q3:Q)        Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD-CalculoManual€#Q]]
    - Row +3: 
        =let(
        TipoAUD;$N3;
        TipoGBP;$O3;
        TFN;$H3*SI(TipoAUD;(1/(REDONDEAR(TipoAUD;1)));0);
        GBP;$I3*SI(TipoGBP;(1/(REDONDEAR(TipoGBP;1)));0);
        suma;TFN+GBP;
        diferencia;$C3-suma;
        diferencia)

## 📋 F10
    - Row 1: =PROMEDIO(R3:R)        Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD-CalculoManual€#R]]
    - Row +3: 
        =let(
        TipoAUD;$L3;
        TipoGBP;$M3;
        TFN;$H3*SI(TipoAUD;(1/(REDONDEAR(TipoAUD;2)));0);
        GBP;$I3*SI(TipoGBP;(1/(REDONDEAR(TipoGBP;2)));0);
        suma;TFN+GBP;
        diferencia;$C3-suma;
        diferencia)

## 📋 F11
    - Row 1: =PROMEDIO(S3:S)        Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD-CalculoManual€#S]]
    - Row +3: 
        =let(
        TipoAUD;$N3;
        TipoGBP;$O3;
        TFN;$H3*SI(TipoAUD;(1/(REDONDEAR(TipoAUD;2)));0);
        GBP;$I3*SI(TipoGBP;(1/(REDONDEAR(TipoGBP;2)));0);
        suma;TFN+GBP;
        diferencia;$C3-suma;
        diferencia)

## 📋 F12
    - Row 1: =PROMEDIO(T3:T)        Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD-CalculoManual€#T]]
    - Row +3: 
        =Let(
        VentasSettlement;$C3;
        TipoAUD;$L3;
        TipoGBP;$M3;
        VentasAUD;$H3*SI(TipoAUD;(1/TipoAUD);0);
        VentasGBP;$I3*SI(TipoGBP;(1/TipoGBP);0);
        diferencia;VentasSettlement-(VentasAUD+VentasGBP);
        diferencia)

## 📋 F13
    - Row 1: =PROMEDIO(U3:U)        Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD-CalculoManual€#U]]
    - Row +3: 
        =Let(
        VentasSettlement;$C3;
        TipoAUD;$N3;
        TipoGBP;$O3;
        VentasAUD;$H3*SI(TipoAUD;(1/TipoAUD);0);
        VentasGBP;$I3*SI(TipoGBP;(1/TipoGBP);0);
        diferencia;VentasSettlement-(VentasAUD+VentasGBP);
        diferencia)

## 📋 F14
    - Row 1: =PROMEDIO(V3:V)        Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD-CalculoManual€#V]]
    - Row +3: 
        =let(
        TipoAUD;$L3;
        TipoGBP;$M3;
        TFN;$H3*SI(TipoAUD;(1/(REDONDEAR.MAS(TipoAUD;1)));0);
        GBP;$I3*SI(TipoGBP;(1/(REDONDEAR.MAS(TipoGBP;1)));0);
        suma;TFN+GBP;
        diferencia;$C3-suma;
        diferencia)

## 📋 F15
    - Row 1: =PROMEDIO(W3:W)        Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD-CalculoManual€#W]]
    - Row +3: 
        =let(
        TipoAUD;$N3;
        TipoGBP;$O3;
        TFN;$H3*SI(TipoAUD;(1/(REDONDEAR.MAS(TipoAUD;1)));0);
        GBP;$I3*SI(TipoGBP;(1/(REDONDEAR.MAS(TipoGBP;1)));0);
        suma;TFN+GBP;
        diferencia;$C3-suma;
        diferencia)

## 📋 F16
    - Row 1: =PROMEDIO(X3:X)        Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD-CalculoManual€#X]]
    - Row +3: 
        =let(
        TipoAUD;$L3;
        TipoGBP;$M3;
        TFN;$J3*SI(TipoAUD;(1/(REDONDEAR.MAS(TipoAUD;1)));0);
        GBP;$K3*SI(TipoGBP;(1/(REDONDEAR.MAS(TipoGBP;1)));0);
        suma;TFN+GBP;
        diferencia;$D3-suma;
        diferencia)

## 📋 F17
    - Row 1: =PROMEDIO(Y3:Y)        Sirve para medir el rendimiento de la formula en row +3. Cuanto mas cerca de 0 mas preciso. 
    - Row 2: Header [[Orders_BD-CalculoManual€#Y]]
    - Row +3: 
        =let(
        TipoAUD;$N3;
        TipoGBP;$O3;
        TFN;$J3*SI(TipoAUD;(1/(REDONDEAR.MAS(TipoAUD;1)));0);
        GBP;$K3*SI(TipoGBP;(1/(REDONDEAR.MAS(TipoGBP;1)));0);
        suma;TFN+GBP;
        diferencia;$D3-suma;
        diferencia)

## 📋 F18



## 📋 F19
 =let(
tfn;(99*0)+(0*0);
ukpa;(149*0)+(156*0);
eur;(tfn/L3)+(ukpa/M3);
eur
)


## 📋 F20


