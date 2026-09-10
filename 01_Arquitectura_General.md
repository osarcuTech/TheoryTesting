---
title: Arquitectura General del Sistema
tags: [arquitectura, flujo-datos, overview]
related: [[00_MOC_Norgenic_Financiera]], [[02_Flujo_Datos_Diagrama]]
version: "3.1"
---

# Arquitectura General del Sistema

## 📌 Descripción General

El sistema financiero de Norgenic es una plataforma integrada que automatiza:
1. **Importación de movimientos bancarios** (A1)
2. **Clasificación de gastos** (A2)
3. **Recepción y procesamiento de facturas** (B1, B2)
4. **Matching automático entre facturas y movimientos** (C0)
5. **Validación y archivado** (H0, H1, H2)

Los datos fluyen a través de **Google Sheets** como base de datos central, con orquestación en **n8n** y automatización en **Google Apps Script** y **Python**.

---

## 🎯 Componentes Principales

### Entrada de Datos (J)
- **J1.A**: Envío de movimientos bancarios
- **J1.B**: Envío de facturas
- **J0**: Peticiones/disparadores manuales

### Flujo A: Bancario
[[A1_ImportarMovimientos|A1 → ImportarMovimientos]]
- Importa movimientos del banco en BD_Banco
- Workflow: [[wf_A1_ImportarMovimientos]]
- KPIs: [[Metricas_Importacion]]

[[A2_AsignacionDeGastos|A2 → AsignacionDeGastos]]
- Clasifica gastos por Departamento/Naturaleza/Categoría
- Workflow: [[wf_A2_AsignacionDeGastos]]
- KPIs: [[Metricas_Asignacion]]

### Flujo B: Facturación
[[B1_RecepcionFacturas|B1 → RecepcionFacturas]]
- Recibe facturas por correo
- Workflow: [[wf_B1_GmailMetralleta]]
- KPIs: [[Metricas_Facturas]]

[[B2_Cebollón|B2 → Cebollón]]
- Nombra, registra en BD_Facturas y pre-archiva
- Workflow: [[wf_B2_Cebollon]]

### Flujo C: Conciliación
[[C0_PunteoFacturas|C0 → PunteoFacturas]]
- Fórmula que sugiere matching automático entre movimientos y facturas
- Trigger suave (soft-trigger) de recálculos
- Workflow: [[wf_C0_PuntearFacturas]]
- KPIs: [[Metricas_Punteo]]

### Flujo H: Control Humano
[[H0_ControlHumano|H0 → ControlHumano]]
- Valida punteos
- Revisa incidencias
- Autoriza archivo de facturas
- KPIs: [[Metricas_Control]]

[[H1_ArchivoRegistro|H1 → ArchivoRegistro]]
- Archiva facturas validadas
- Registra localización y estado
- Workflows: [[wf_C1_ReenvioFacturas]]

[[H2_ComprobacionCierre|H2 → ComprobacionCierre]]
- Verifica completitud de archivado
- Prepara cierre de mes
- Detecta incidencias pendientes
- Workflow: [[wf_C2_ComprobacionFacturas]]
- KPIs: [[Metricas_Globales]]

---

## 📊 Bases de Datos

### [[03_BDs_Principales|BD_Banco]]
- Histórico de movimientos bancarios importados
- Campos: Fecha, Fecha Valor, Movimiento, Más Datos, Importe, Saldo
- UID: Concatenación única de identificadores

### [[03_BDs_Principales|BD_Facturas]]
- Histórico de facturas recibidas y procesadas
- Campos: Proveedor, Importe, Fecha, Descripción, Estado
- Relación: Usada por C0 para matching

### Hojas Derivadas
- **Movimientos_cuenta**: Query sobre BD_Banco con clasificación
- **HistorialFacturas**: Query sobre BD_Facturas filtrada
- **AsigCostes**: Mapeo de patrones a clasificaciones (Depto/Naturaleza/Categoría)
- **PerfilProveedores**: Definiciones de reglas de matching para C0

---

## 🔄 Flujo de Datos End-to-End

```
J1.A (Movimientos) → [[A1_ImportarMovimientos|A1: Importar]] → BD_Banco
                                                    ↓
                                          [[A2_AsignacionDeGastos|A2: Clasificar]]
                                                    ↓
                                          MovimientosClasificados

J1.B (Facturas) → [[B1_RecepcionFacturas|B1: Recibir]] → BD_Facturas
                                              ↓
                                    [[B2_Cebollón|B2: Procesar]]
                                              ↓
                                    FacturasNombradas

MovimientosClasificados + FacturasNombradas → [[C0_PunteoFacturas|C0: Puntear]]
                                                    ↓
                                    Sugerencias de Matching
                                                    ↓
                                    [[H0_ControlHumano|H0: Validar]]
                                                    ↓
                                    [[H1_ArchivoRegistro|H1: Archivar]]
                                                    ↓
                                    [[H2_ComprobacionCierre|H2: Cerrar]]
```

---

## 🤖 Tecnologías Usadas

| Capa | Tecnología | Uso |
|------|-----------|-----|
| **Base de Datos** | Google Sheets | Almacenamiento y queries SQL |
| **Orquestación** | n8n | Workflows, triggers, automatización |
| **Automatización** | Google Apps Script | Importación, archivado |
| **Herramientas** | Python Scripts | Procesamiento alternativo |
| **Conectores** | Gmail, Google Drive | Entrada de datos, almacenamiento |

---

## 💡 Principios de Diseño

1. **Deduplicación**: UIDs únicos evitan duplicados
2. **Soft-Triggers**: Cambios en BD activan recálculos en cascada
3. **Control Humano**: Validación manual de sugerencias automáticas
4. **Auditoría**: Rastreo de cambios y correcciones
5. **Escalabilidad**: Fórmulas dinámicas ajustadas por volumen de datos

---

## 🔗 Notas Relacionadas

- [[02_Flujo_Datos_Diagrama]] - Diagramas Mermaid del flujo
- [[03_BDs_Principales]] - Detalles de bases de datos
- [[KPIs_Sistema]] - Métricas de cada componente
- [[Propuestas_Mejora]] - Optimizaciones en progreso

---

**Última actualización**: 2026-09-10
**Versión**: 3.1
