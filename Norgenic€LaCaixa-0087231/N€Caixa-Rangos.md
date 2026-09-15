---
title: 
tags: 
component: 
related: [[01_Arquitectura_General]], [[A1_ImportarMovimientos_GS]], [[A1_ImportarMovimientos_WF(Deprecado)]], [[wf_A2_AsignacionDeGastos]], [[A2_AsignacionDeGastos]], [[C0_PunteoFacturas]], [[Metricas_Asignacion]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

El objetivo de esta hoja es poner el "LasRow" de cada una de las hojas con formulas como "Intervalo con nombre" para su uso en el resto de hojas.

---

## 📋 Descripción de las columnas

- **Fuente**: `A1`
- **GID Hoja**: 81356225
- **Columnas**:
  - **A: Sheet's**:
    - **Contenido**: Nombre de las Hojas de interes (ej: Movimientos_cuenta_0087231; HistorialFacturas).
    - **Formula/s**: NULL
    - **Referencias**: 
  - **B: 'Columna'**:
    - **Contenido**: Columna seleccionada para medir el las Row (A).
    - **Formula/s**: NULL
    - **Referencias**:  
  - **C: 'LastRow'**:
    - **Contenido**: Ultima fila con datos de cada una de las hojas.
    - **Formula/s**: =let(
                          nombreHoja;A2;
                          eNombreHoja;"Nombre de la hoja de la que queremos encontrar la última fila para limitar el rango en las fórmulas que utilizamos en esta";
                          columnaControl;B2;
                          eColumnaCOntrol;"Columna de la hoja que no estará vacía nunca a menos que el resto de columnas también lo este";
                          rangoHoja;INDIRECTO(nombreHoja&"!"&columnaControl&":"&columnaControl);
                          eRangoHoja;"Gracias a la función Indirecto creamos un rango dinámico que depende del contenido de otras celdas. El texto que transformara en rango sigue el siguiente patrón: NombreHoja + ! + Rango Hoja. Ej: 'Hoja1!C:C' ";
                          lastRow;CONTARA(rangoHoja);
                          eLastRow;"busca la última fila rellena en el rango proporcionado, encontrando así la ultima fila que nos puede interesar mirar al ejecutar formulas";
                          LastRow)
    - **Referencias**: 

---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
