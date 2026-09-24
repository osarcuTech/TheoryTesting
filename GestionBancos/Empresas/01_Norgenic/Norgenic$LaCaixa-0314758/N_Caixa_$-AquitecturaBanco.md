## GestiónBancaria

### **NombreSpreadSheet**: 
BBVA Historico_GlobalDocuments 3316

### **CarpetaHistorico**:
 ![[N_Caixa_-AquitecturaArchivos#A2_Intput]]

### **CarpetaImportados**:
 ![[N_Caixa_-AquitecturaArchivos#A1_Intput]]

### **SS_ID**: 
1UJXBub3M1dkQCVcTWPwLsvuyPPZK_CiyGXdaJ5mRmRs

[[N_Caixa_$-Pipeline]]

## **BD's**

### **BDB**
**Nombre**: BD_Banco [[N_Caixa_$-BD_Banco]]
**Objetivo**: (DataLake?) Bases de datos que almacenan los movimientos bancarios y (opcionalmente) su relación con facturas.
**Relaciones Pipeline**: 
**Fuentes**: [[A1_ImportarMovimientos_GS]] y opcionalmente **ArchivadoDeMovimientos**
**Gid**: ![[N_Caixa_$-BD_Banco#Gid]]

### **BD_Movimientos**
**Nombre**: BD_Movimientos
**Objetivo**: (DataMart?) Funciona como GUI para [[H0_ControlHumano]] para la conciliación entre Movimientos y Facturas. Tambien funcióna como fuente de datos temporal para el Cashflow.
**Relaciones Pipeline**: [[H0_ControlHumano]], [[A1_ImportarMovimientos_GS]], [[A2_AsignacionDeGastos_Sheets_Arquitectura]], [[C0_PunteoFacturas]] (Opcional)
**Fuentes**: [[A1_ImportarMovimientos_GS]], y opcionalmente **ArchivadoDeMovimientos**
**Gid**: ![[N_Caixa_$-BD_Movimientos#Gid]]

### **BD_AsigCostes**
**Nombre**: BD_AsigCostes
**Objetivo**: Clasificar los gastos para el Cashflow y para [[C0_PunteoFacturas]] (Opcional)
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[N_Caixa_$-BD_AsigCostes#Gid]]

### **PreCashflow**
**Nombre**: PreCashflow
**Objetivo**: (DataMart?) Hoja que agrupa la información relevante para el Cashflow.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[N_Caixa_$-PreCashflow#Gid]]

### **Odoo**
**Nombre**: Odoo
**Objetivo**: (DataMart?) Hoja con los movimientos pendientes de añadir a Odoo.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[N_Caixa_$-Odoo#Gid]]



## **Helpers**  (Opcionales)
**Objetivo**: Hojas de soporte a las hojas principales.

### **D1**

#### **PunteoPlataformas **
**Nombre**: PunteoPlataformas
**Objetivo**: Punteo movimientos con "facturas" de plataformas de pago.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[N_Caixa_$-PunteoPlataformas#Gid]]

#### **PlataformasPendientes **
**Nombre**: PunteoPlataformas
**Objetivo**: Lista de movimientos de plataformas de pago pendientes de puntear.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[N_Caixa_$-PlataformasPendientes#Gid]]

#### **ResumenPlataformas **
**Nombre**: ResumenPlataformas
**Objetivo**: Control de los ingresos declarado por las distintas plataformas de pago.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[N_Caixa_$-ResumenPlataformas#Gid]]
