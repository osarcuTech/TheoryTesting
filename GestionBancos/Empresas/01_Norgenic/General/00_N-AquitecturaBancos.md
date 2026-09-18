# **Arquitectura Bancos Norgenic**
Esta es una hoja que recoge la estructura común de todos los bancos de Norgenic así como su lista actual de bancos.
Bancos:

## **ListaBancos**
- **Caixabank**:
    - **EUR**: [[N_Caixa_€-Aquitectura]]
    - **USD**: [[N_Caixa_$-Aquitectura]]
    - **AUD**: [[N_Caixa_AUD-Aquitectura]]
    - **CAD**: [[N_Caixa_CAD-Aquitectura]]
    - **CHF**: [[N_Caixa_CHF-Aquitectura]]
    - **DKK**: [[N_Caixa_DKK-Aquitectura]]
    - **GBP**: [[N_Caixa_GBP-Aquitectura]]
    - **NOK**: [[N_Caixa_NOK-Aquitectura]]
    - **NZD**: [[N_Caixa_NZD-Aquitectura]]
    - **PLN**: [[N_Caixa_PLN-Aquitectura]]
    - **SEK**: [[N_Caixa_SEK-Aquitectura]]
- **BBVA**:
    - **EUR**: [[N_BBVA_€-Aquitectura]]
- **Sabadell**:
    - **EUR**: [[N_Sabadell_€-Aquitectura]]
- **Revolut**:
    - **EUR**: [[N_Revolut-Aquitectura]]
    - **USD**: [[N_Revolut-Aquitectura]]
    - **AUD**: [[N_Revolut-Aquitectura]]


## **Arquitectura de Bancos**

### **BD's**

#### **BDB**
**Objetivo**: (DataLake?) Bases de datos que almacenan los movimientos bancarios y (opcionalmente) su relación con facturas.
**Relaciones Pipeline**: 
**Fuentes**: [[A1_ImportarMovimientos_GS]] y opcionalmente **ArchivadoDeMovimientos**
**Gid**:

#### **BD_Movimientos**
**Objetivo**: (DataMart?) Funciona como GUI para [[H0_ControlHumano]] para la conciliación entre Movimientos y Facturas. Tambien funcióna como fuente de datos temporal para el Cashflow.
**Relaciones Pipeline**: [[H0_ControlHumano]], [[N_Caixa_€-Pipeline#A1]], [[N_Caixa_€-Pipeline#A2]], [[N_Caixa_€-Pipeline#C0]] (Opcional)
**Fuentes**: [[A1_ImportarMovimientos_GS]], y opcionalmente **ArchivadoDeMovimientos**
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
