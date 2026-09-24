## GestiónBancaria

### **NombreSpreadSheet**: 
Caixabank Historico_GlobalDocuments 0096792

### **CarpetaHistorico**:
 ![[GD_Caixa_€-AquitecturaArchivos#A2_Intput]]

### **CarpetaImportados**:
 ![[GD_Caixa_€-AquitecturaArchivos#A1_Intput]]

### **SS_ID**: 
12SdzO29iKwuZjaLLeCdbe0Kqb_b9tLRhmsZ9RRsmgF8

[[GD_Caixa_€-Pipeline]]

## **BD's**

### **BDB**
**Nombre**: 'BD_Banco'
**Objetivo**: (DataLake?) Bases de datos que almacenan los movimientos bancarios y (opcionalmente) su relación con facturas.
**Relaciones Pipeline**: 
**Fuentes**: [[A1_ImportarMovimientos_GS]] y opcionalmente **ArchivadoDeMovimientos**
**Gid**: ![[GD_Caixa_€-BD_Banco#Gid]]

### **BD_Movimientos**
**Nombre**: 'BD_Movimientos'
**Objetivo**: (DataMart?) Funciona como GUI para [[H0_ControlHumano]] para la conciliación entre Movimientos y Facturas. Tambien funcióna como fuente de datos temporal para el Cashflow.
**Relaciones Pipeline**: [[H0_ControlHumano]], [[GD_Caixa_€-Pipeline#A1]], [[GD_Caixa_€-Pipeline#A2]], [[GD_Caixa_€-Pipeline#C0]] (Opcional)
**Fuentes**: [[GD_Caixa_€-Pipeline#A1]], y opcionalmente **ArchivadoDeMovimientos**
**Gid**: ![[GD_Caixa_€-BD_Movimientos#Gid]]

### **BD_AsigCostes**
**Nombre**: 'AsigCostes'
**Objetivo**: Clasificar los gastos para el Cashflow y para [[GD_Caixa_€-Pipeline#C0]] (Opcional)
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[GD_Caixa_€-BD_AsigCostes#Gid]]


### **PreCashflow**
**Nombre**: 'PreCashflow2'
**Objetivo**: (DataMart?) Hoja que agrupa la información relevante para el Cashflow.
**Relaciones Pipeline**: [[GD_Caixa_€-Pipeline#E1]]
**Fuentes**:
**Gid**: ![[GD_Caixa_€-PreCashflow2#Gid]]

### **Odoo**
**Nombre**: 'Odoo'
**Objetivo**: (DataMart?) Hoja con los movimientos pendientes de añadir a Odoo.
**Relaciones Pipeline**: [[GD_Caixa_€-Pipeline#D1]]
**Fuentes**:
**Gid**: ![[GD_Caixa_€-Odoo#Gid]]



## **Helpers**  (Opcionales)
**Objetivo**: Hojas de soporte a las hojas principales.
NULL