---
title: 
tags: 
component: 
related: [[01_Arquitectura_General]], [[C0_PunteoFacturas]], [[Metricas_Asignacion]], [[B2_Cebollón]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Base de datos de las Facturas.

---

## 📋 Descripción de las columnas

- **Fuente**: [[B2_Cebollón]]
- **GID Hoja**: 1422409426
- **Columnas**:

### **A**
  - **Nombre**: UID
  - **Contenido**: Heredado de [[B2_Cebollón]]. UID de las facturas.
  - **Formula/s**: NULL
  - **Referencias**: [[B2_Cebollón]]; [[N€Caixa-Rangos#A]]
  - **Fuentes:**: 
  
### **B**
  - **Nombre**: 'Def_UID'
  - **Contenido**: No utilizado aún.
  - **Formula/s**: NULL
  - **Referencias**: [[B2_Cebollón]] 
  - **Fuentes:**: 
  
### **C**
  - **Nombre**: 'TipoInput'
  - **Contenido**: No utilizado aún. Puntuar los resultados de Cebollón de las siguiente forma: Éxito +1, Manual +0, Actualización -5. Promediamos los resultados para encontrar la tasa de éxito del workflow tras x meses de entrenamiento (previamente no se registraban los datos de éxito). Sacaremos el "promedio global", el "promedio por empresa" (para detectar anormalidades) y el "promedio entre empresas". 
  El "promedio global" indicará el % de trabajo automatizado(% de facturas automatizadas) mientras que el "promedio entre empresas" indica que % de empresas hemos logrado automatizar con exito (dota de el mismo peso a cada empresa sin importar el volumen de facturas para encontrar la cantidad de ellas que hemos logrado automatizar y con que exito. El objetivo es que una empresa con muchas facturas no alteres la tasa de exito/fracaso de el resto de forma significativa. Ej: Una empresa con 100 facturas automatizadas con exito tiene el mismo peso que una que siempre las entrega de forma no automatizable, dejanto el % de automatización en un 50%). Por último el "promedio por empresa" nos indicara el % de exito al automatizar las facturas de cada empresa para que valoremos formas de mejorar la tasa de exito de las que puedan automatizar-se e indentifiquemos claramente las que no (ej: Envian la factura como imagen de forma que el ordenador no puede leer el texto que contiene y, por lo tanto, no es processable por nuestra automatización o es una factura puntual para la que no es eficiente generar una automatizaciónHe s).
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes:**: 
  
### **D**
  - **Nombre**: 'Definitivo'
  - **Contenido**: No utilizado aún. Potencial intención de generar un sistema de Archivado similar al de los movimientos.
  - **Formula/s**: 
  - **Referencias**: 
  - **Fuentes:**: 
  

---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
