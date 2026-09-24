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

# **Arquitectura Bancos**
Esta es una hoja que recoge la estructura común de todos los bancos de del grupo de empresas y su lista actual de cuentas.
Bancos:

## **ListaBancos**

### Norgenic
- **Caixabank**:
    - **EUR**: [[N_Caixa_€-AquitecturaBanco]]
    - **USD**: [[N_Caixa_$-AquitecturaBanco]]
    - **AUD**: [[N_Caixa_AUD-AquitecturaBanco]]
    - **CAD**: [[N_Caixa_CAD-AquitecturaBanco]]
    - **CHF**: [[N_Caixa_CHF-AquitecturaBanco]]
    - **DKK**: [[N_Caixa_DKK-AquitecturaBanco]]
    - **GBP**: [[N_Caixa_£-AquitecturaBanco]]
    - **NOK**: [[N_Caixa_NOK-AquitecturaBanco]]
    - **NZD**: [[N_Caixa_NZD-AquitecturaBanco]]
    - **PLN**: [[N_Caixa_PLN-AquitecturaBanco]]
    - **SEK**: [[N_Caixa_SEK-AquitecturaBanco]]
- **BBVA**:
    - **EUR**: [[N_BBVA_€-AquitecturaBanco]]
- **Sabadell**:
    - **EUR**: [[N_Sabadell_€-AquitecturaBanco]]
- **Revolut**:
    - **EUR**: [[N_Revolut-AquitecturaBanco]]
    - **USD**: [[N_Revolut-AquitecturaBanco]]
    - **AUD**: [[N_Revolut-AquitecturaBanco]]

### Taxgov
- **Caixabank**:
    - **EUR**: [[T_Caixa_€-AquitecturaBanco]]
- **BBVA**:
    - **EUR**: [[T_BBVA_€-AquitecturaBanco]]

### Worldwide
- **Caixabank**:
    - **EUR**: [[WW_Caixa_€-AquitecturaBanco]]
- **BBVA**:
    - **EUR**: [[WW_BBVA_€-AquitecturaBanco]]

### Global Document
- **Caixabank**:
    - **EUR**: [[GD_Caixa_€-AquitecturaBanco]]
- **BBVA**:
    - **EUR**: [[GD_BBVA_€-AquitecturaBanco]]


## **Arquitectura de Bancos**

### **BD's**

#### **BDB**
**Objetivo**: (DataLake?) Bases de datos que almacenan los movimientos bancarios y (opcionalmente) su relación con facturas.
**Relaciones Pipeline**: 
**Fuentes**: [[Plantilla-A1_ImportarMovimientos]] y opcionalmente **ArchivadoDeMovimientos**
**Gid**:

#### **BD_Movimientos**
**Objetivo**: (DataMart?) Funciona como GUI para [[H0_ControlHumano]] para la conciliación entre Movimientos y Facturas. Tambien funcióna como fuente de datos temporal para el Cashflow.
**Relaciones Pipeline**: [[H0_ControlHumano]], [[N_Caixa_€-Pipeline#A1]], [[N_Caixa_€-Pipeline#A2]], [[N_Caixa_€-Pipeline#C0]] (Opcional)
**Fuentes**: [[Plantilla-A1_ImportarMovimientos]], y opcionalmente **ArchivadoDeMovimientos**
**Gid**:

#### **BD_PatronesMovimientos**
**Objetivo**: Clasificar los gastos para el Cashflow y para [[N_Caixa_€-Pipeline#C0]] (Opcional)
**Relaciones Pipeline**: [[N_Caixa_€-Pipeline#A2]], [[N_Caixa_€-Pipeline#C0]], [[H0_ControlHumano]]
**Fuentes**:
**Gid**:

#### **BD_Facturas** (Opcional)
**Objetivo**: (DataLake?) Bases de datos que almacenan las facturas existentes.
**Relaciones Pipeline**: [[H0_ControlHumano]]  (Opcionales: [[N_Caixa_€-Pipeline#C0]], [[B2_Cebollón]])
**Fuentes**:
**Gid**:

#### **BD_HistorialFacturas** (Opcional)
**Objetivo**: (DataMart?) Hoja de control del estado de las facturas.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:

#### **PreCashflow**
**Objetivo**: (DataMart?) Hoja que agrupa la información relevante para el Cashflow.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:

#### **Odoo**
**Objetivo**: (DataMart?) Hoja con los movimientos pendientes de añadir a Odoo.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:



### **Helpers**  (Opcionales)
**Objetivo**: Hojas de soporte a las hojas principales.

--------------------------------------


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

----a
## 🎯 Componentes Principales

### Entrada de Datos (J)
- **J1.A**: Envío de movimientos bancarios
- **J1.B**: Envío de facturas
- **J0**: Peticiones/disparadores manuales



### Flujo H: Control Humano
[[H0_ControlHumano|H0 → ControlHumano]]
- Valida punteos
- Revisa incidencias
- Autoriza archivo de facturas
- Actualizar scripts/Workflows

[[H1_Contabilizacion]]
- Archiva facturas validadas
- Registra localización y estado

[[H2_ComprobacionCierre|H2 → ComprobacionCierre]]
- Verifica completitud de archivado
- Prepara cierre de mes
- Detecta incidencias pendientes

---
##  Propuestas de Mejora: Análisis Predictivo de Gastos

**Concepto**: Forecasting automático de próximos gastos
- Modelo ARIMA para serie temporal de gastos
- Alertas si gasto > promedio histórico

**Beneficio**: Mejor cash flow planning

**Timeline**: 2-3 meses (si hay data histórica limpia)