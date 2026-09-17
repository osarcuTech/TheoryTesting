---
title: A2 — Asignación de Gastos
tags: [A2, clasificación, gastos]
component: A2.2
related: [[N€Caixa-AsigCostes]], [[N€Caixa-Movimientos_cuenta_0087231#O]]
---

# A2 — Asignación de Gastos

## 🎯 Objetivo

Crear una base de datos permanente de patrones de movimiento, su significado, implicaciones y formas de tratarlos.
---

## 📋 Descripción de las columnas

- **GID Hoja**: 223389945


### **A**
  - **Nombre**: Descripcion.
  - **Contenido**: 
  - **Formula/s**: =QUERY(INDIRECTO("AsigCostes!A1:M"& lr_AsigCostes); "select A,B,C,F,G,H,I,J,K,L,M where E = 'Proveedores' and (F<> 'Puntuales' and F<>'Anuales' and F<>'?' and F<>'Devo?' and F<>'Devoluciones')";1)
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-AsigCostes]]

### **B**
  - **Nombre**: Movimientos.
  - **Contenido**: .
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-PProveedores#A]], [[N€Caixa-AsigCostes#B]]

### **C**
  - **Nombre**: Más datos.
  - **Contenido**: .
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-PProveedores#A]], [[N€Caixa-AsigCostes#C]]

### **D**
  - **Nombre**: Concepto.
  - **Contenido**: .
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-PProveedores#A]], [[N€Caixa-AsigCostes#F]]

### **E**
  - **Nombre**: RegexNombre.
  - **Contenido**: .
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-PProveedores#A]], [[N€Caixa-AsigCostes#G]]

### **F**
  - **Nombre**: 'Regex Fecha1A'.
  - **Contenido**: .
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-PProveedores#A]], [[N€Caixa-AsigCostes#H]]

### **G**
  - **Nombre**: 'Regex Fecha1B'.
  - **Contenido**: .
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-PProveedores#A]], [[N€Caixa-AsigCostes#I]]

### **H**
  - **Nombre**: 'Regex Fecha2A'.
  - **Contenido**: .
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-PProveedores#A]], [[N€Caixa-AsigCostes#J]]

### **I**
  - **Nombre**: 'Regex Fecha2B'.
  - **Contenido**: .
  - **Formula/s**: NULL
  - **Referencias**: 
  - **Fuentes**: [[N€Caixa-PProveedores#A]], [[N€Caixa-AsigCostes#K]]

### **J**
  - **Nombre**: 'Importe'.
  - **Contenido**: .
  - **Formula/s**: NULL
  - **Referencias**:  
  - **Fuentes**: [[N€Caixa-PProveedores#A]], [[N€Caixa-AsigCostes#L]]

### **K**
  - **Nombre**: 'Observaciones'.
  - **Contenido**: .
  - **Formula/s**: NULL
  - **Referencias**:  
  - **Fuentes**: [[N€Caixa-PProveedores#A]], [[N€Caixa-AsigCostes#M]]


---

**Última actualización**: 2026-09-10
**Estado**: Activo
**Impacto**: ⭐⭐⭐ (Alto)
