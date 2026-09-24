## GestiónBancaria

### **NombreSpreadSheet**: 
HistoricoMovimientosTaxgov_Caixabank-0089718

### **CarpetaHistorico**:
 ![[Taxgov_Caixabank_€-AquitecturaArchivos#A2_Intput]]

### **CarpetaImportados**:
 ![[Taxgov_Caixabank_€-AquitecturaArchivos#A1_Intput]]

### **SS_ID**: 
1T9-UEFyODMd5g_6jpbdiB7lBmAbMS-GV9PHm2hXMgHM

[[Taxgov_Caixabank_€-Pipeline]]

## **BD's**

### **BDB**
**Nombre**: 'BD_Banco'
**Objetivo**: (DataLake?) Bases de datos que almacenan los movimientos bancarios y (opcionalmente) su relación con facturas.
**Relaciones Pipeline**: 
**Fuentes**: [[A1_ImportarMovimientos_GS]] y opcionalmente **ArchivadoDeMovimientos**
**Gid**: ![[Taxgov_Caixabank_€-BD_Banco#Gid]]

### **BD_Movimientos**
**Nombre**: 'BD_Movimientos'
**Objetivo**: (DataMart?) Funciona como GUI para [[H0_ControlHumano]] para la conciliación entre Movimientos y Facturas. Tambien funcióna como fuente de datos temporal para el Cashflow.
**Relaciones Pipeline**: [[H0_ControlHumano]], [[Taxgov_Caixabank_€-Pipeline#A1]], [[Taxgov_Caixabank_€-Pipeline#A2]], [[Taxgov_Caixabank_€-Pipeline#C0]] (Opcional)
**Fuentes**: [[Taxgov_Caixabank_€-Pipeline#A1]], y opcionalmente **ArchivadoDeMovimientos**
**Gid**: ![[Taxgov_Caixabank_€-BD_Movimientos#Gid]]

### **BD_AsigCostes**
**Nombre**: 'AsigCostes'
**Objetivo**: Clasificar los gastos para el Cashflow y para [[Taxgov_Caixabank_€-Pipeline#C0]] (Opcional)
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[Taxgov_Caixabank_€-BD_AsigCostes#Gid]]

### **PreCashflow**
**Nombre**: 'PreCashflow2'
**Objetivo**: (DataMart?) Hoja que agrupa la información relevante para el Cashflow.
**Relaciones Pipeline**: [[Taxgov_Caixabank_€-Pipeline#E1]]
**Fuentes**:
**Gid**: ![[Taxgov_Caixabank_€-PreCashflow2#Gid]]

### **Odoo**
**Nombre**: 'Odoo'
**Objetivo**: (DataMart?) Hoja con los movimientos pendientes de añadir a Odoo.
**Relaciones Pipeline**: [[Taxgov_Caixabank_€-Pipeline#D1]]
**Fuentes**:
**Gid**: ![[Taxgov_Caixabank_€-Odoo#Gid]]



## **Helpers**  (Opcionales)
**Objetivo**: Hojas de soporte a las hojas principales.
NULL