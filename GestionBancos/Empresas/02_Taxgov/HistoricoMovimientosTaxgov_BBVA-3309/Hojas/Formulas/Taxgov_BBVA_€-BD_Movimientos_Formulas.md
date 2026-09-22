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
=QUERY(BD_Banco!A2:L;"select * limit "&CONTARA(BD_Banco!A2:A))

## 📋 F2
=ArrayFormula(E2:E&";"&F2:F)

## 📋 F3
=ArrayFormula(TEXTO(C2:C;"yyyy/mm"))

## 📋 F4
=ArrayFormula(BUSCARV($N2:$N;BD_AsigCostes!$A2:$B;2;0))

## 📋 F5
=ArrayFormula(BUSCARV($N2:$N;BD_AsigCostes!$A2:$C;3;0))

## 📋 F6
=MAP($G$2:$G; $E$2:$E; $A$2:$A; 
  LAMBDA(nombreEmpresaA_celda; nombreEmpresaB_celda; celdaA_check;
    SI(ESBLANCO(celdaA_check); "";
      IFNA(
        IFS(
          REGEXMATCH(nombreEmpresaA_celda;"(?i).*_Google_Ireland_Limited.*");"Google";
          REGEXMATCH(nombreEmpresaA_celda;"(?i).*MICROSOFT.*");"MICROSOFT";
          REGEXMATCH(nombreEmpresaA_celda;"(?i).*ABAC.*");"AbacAssessors";
          REGEXMATCH(nombreEmpresaA_celda;"(?i).*VIA_TRIBUT.*");"ViaTribut";
          REGEXMATCH(nombreEmpresaA_celda;"(?i).*Norgenic.*");"Norgenic";
          REGEXMATCH(nombreEmpresaA_celda;"(?i).*Zalando.*");"Zalando";
          REGEXMATCH(nombreEmpresaA_celda;"(?i).*Taxgov.*");"Taxgov";
          REGEXMATCH(nombreEmpresaB_celda;"(?i).*IMPUESTOS.*");"Impuestos";
          REGEXMATCH(nombreEmpresaB_celda;"(?i).*COM\\._POR_EMISIÓN_Y_MANT\\.DE_UNA_TARJETA_DE_DEBITO.*");"TarjetaDebito" 
        );
      "")
    )
  )
)
## 📋 F7
=SI(CONTAR.SI(G2;"*_Google_Ireland_Limited*")>0;IZQUIERDA(G2;18);" ")

## 📋 F6

## 📋 F6



