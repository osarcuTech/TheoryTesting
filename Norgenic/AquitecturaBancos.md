# **Arquitectura Bancos Norgenic**
Esta es una hoja que recoge la estructura común de todos los bancos de Norgenic así como su lista actual de bancos.
Bancos:

## **ListaBancos**
- **Caixabank**:
    - **EUR**: [[N€Caixa-Aquitectura]]
    - **USD**: Pendiente de documentar
    - **AUD**: Pendiente de documentar
    - **CAD**: Pendiente de documentar
    - **CHF**: Pendiente de documentar
    - **DKK**: Pendiente de documentar
    - **GBP**: Pendiente de documentar
    - **NOK**: Pendiente de documentar
    - **NZD**: Pendiente de documentar
    - **PLN**: Pendiente de documentar
    - **SEK**: Pendiente de documentar
- **BBVA**:
    - **EUR**: Pendiente de documentar
- **Sabadell**:
    - **EUR**: Pendiente de documentar
- **Revolut**:
    - **EUR**: Pendiente de documentar
    - **USD**: Pendiente de documentar
    - **AUD**: Pendiente de documentar


## **Arquitectura de Bancos**

### **BD's**

#### **BDB**
**Objetivo**: (DataLake?) Bases de datos que almacenan los movimientos bancarios y (opcionalmente) su relación con facturas.
**Relaciones Pipeline**: 
**Fuentes**: [[A1_ImportarMovimientos_GS]] y opcionalmente **ArchivadoDeMovimientos**
**Gid**:

#### **BD_Movimientos**
**Objetivo**: (DataMart?) Funciona como GUI para [[H0_ControlHumano]] para la conciliación entre Movimientos y Facturas. Tambien funcióna como fuente de datos temporal para el Cashflow.
**Relaciones Pipeline**: [[H0_ControlHumano]], [[A1_ImportarMovimientos_GS]], [[A2_AsignacionDeGastos_Sheets_Arquitectura]], [[C0_PunteoFacturas]] (Opcional)
**Fuentes**: [[A1_ImportarMovimientos_GS]], y opcionalmente **ArchivadoDeMovimientos**
**Gid**:

#### **BD_PatronesMovimientos**
**Objetivo**: Clasificar los gastos para el Cashflow y para [[C0_PunteoFacturas]] (Opcional)
**Relaciones Pipeline**: [[A2_AsignacionDeGastos_Sheets_Arquitectura]], [[C0_PunteoFacturas]], [[H0_ControlHumano]]
**Fuentes**:
**Gid**:

#### **BD_Facturas** (Opcional)
**Objetivo**: (DataLake?) Bases de datos que almacenan las facturas existentes.
**Relaciones Pipeline**: [[H0_ControlHumano]]  (Opcionales: [[C0_PunteoFacturas]], [[B2_Cebollón]])
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
