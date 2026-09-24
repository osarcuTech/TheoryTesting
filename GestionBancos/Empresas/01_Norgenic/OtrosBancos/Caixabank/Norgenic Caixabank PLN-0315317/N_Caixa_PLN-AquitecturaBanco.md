## GestiónBancaria

### **NombreSpreadSheet**: 
BBVA Historico_GlobalDocuments 3316

### **CarpetaHistorico**:
 ![[N_Caixa_PLN-AquitecturaArchivos#A2_Intput]]

### **CarpetaImportados**:
 ![[N_Caixa_PLN-AquitecturaArchivos#A1_Intput]]

### **SS_ID**: 
1VZCd6dUUpvCo4IVEqxmrc0oSBeAnim-7JwpTb3QlYYs

[[N_Caixa_PLN-Pipeline]]

## **BD's**

### **BDB**
**Nombre**: 'BD_Banco'
**Objetivo**: (DataLake?) Bases de datos que almacenan los movimientos bancarios y (opcionalmente) su relación con facturas.
**Relaciones Pipeline**: 
**Fuentes**: [[A1_ImportarMovimientos_GS]] y opcionalmente **ArchivadoDeMovimientos**
**Gid**: ![[N_Caixa_PLN-BD_Banco#Gid]]

### **BD_Movimientos**
**Nombre**: 'BD_Movimientos'
**Objetivo**: (DataMart?) Funciona como GUI para [[H0_ControlHumano]] para la conciliación entre Movimientos y Facturas. Tambien funcióna como fuente de datos temporal para el Cashflow.
**Relaciones Pipeline**: [[H0_ControlHumano]], [[N_Caixa_PLN-Pipeline#A1]], [[N_Caixa_PLN-Pipeline#A2]], [[N_Caixa_PLN-Pipeline#C0]] (Opcional)
**Fuentes**: [[N_Caixa_PLN-Pipeline#A1]], y opcionalmente **ArchivadoDeMovimientos**
**Gid**: ![[N_Caixa_PLN-BD_Movimientos#Gid]]

### **BD_AsigCostes**
**Nombre**: 'AsigCostes'
**Objetivo**: Clasificar los gastos para el Cashflow y para [[N_Caixa_PLN-Pipeline#C0]] (Opcional)
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[N_Caixa_PLN-BD_AsigCostes#Gid]]

### **PreCashflow**
**Nombre**: 'PreCashflow2'
**Objetivo**: (DataMart?) Hoja que agrupa la información relevante para el Cashflow.
**Relaciones Pipeline**: [[N_Caixa_PLN-Pipeline#E1]]
**Fuentes**:
**Gid**: ![[N_Caixa_PLN-PreCashflow2#Gid]]

### **Odoo**
**Nombre**: 'Odoo'
**Objetivo**: (DataMart?) Hoja con los movimientos pendientes de añadir a Odoo.
**Relaciones Pipeline**: [[N_Caixa_PLN-Pipeline#D1]]
**Fuentes**:
**Gid**: ![[N_Caixa_PLN-Odoo#Gid]]



## **Helpers**  (Opcionales)
**Objetivo**: Hojas de soporte a las hojas principales.
NULL