## GestiónBancaria

### **NombreSpreadSheet**: 
BBVA Historico_GlobalDocuments 3316

### **CarpetaHistorico**:
 ![[Norgenic_BBVA_€-AquitecturaArchivos#A2_Intput]]

### **CarpetaImportados**:
 ![[Norgenic_BBVA_€-AquitecturaArchivos#A1_Intput]]

### **SS_ID**: 
1wpnUpQF14bW9AA35ib62qhJNb4ZiQKtmupPaim3V6Uo

[[Norgenic_BBVA_€-Pipeline]]

### **BDB**
**Nombre**: 'BD_Banco'
**Objetivo**: (DataLake?) Bases de datos que almacenan los movimientos bancarios y (opcionalmente) su relación con facturas.
**Relaciones Pipeline**: 
**Fuentes**: [[A1_ImportarMovimientos_GS]] y opcionalmente **ArchivadoDeMovimientos**
**Gid**: ![[Norgenic_BBVA_€-BD_Banco#Gid]]

### **BD_Movimientos**
**Nombre**: 'BD_Movimientos'
**Objetivo**: (DataMart?) Funciona como GUI para [[H0_ControlHumano]] para la conciliación entre Movimientos y Facturas. Tambien funcióna como fuente de datos temporal para el Cashflow.
**Relaciones Pipeline**: [[H0_ControlHumano]], [[Norgenic_BBVA_€-Pipeline#A1]], [[Norgenic_BBVA_€-Pipeline#A2]], [[Norgenic_BBVA_€-Pipeline#C0]] (Opcional)
**Fuentes**: [[Norgenic_BBVA_€-Pipeline#A1]], y opcionalmente **ArchivadoDeMovimientos**
**Gid**: ![[Norgenic_BBVA_€-BD_Movimientos#Gid]]

### **BD_AsigCostes**
**Nombre**: 'AsigCostes'
**Objetivo**: Clasificar los gastos para el Cashflow y para [[Norgenic_BBVA_€-Pipeline#C0]] (Opcional)
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[Norgenic_BBVA_€-BD_AsigCostes#Gid]]

### **PreCashflow**
**Nombre**: 'PreCashflow2'
**Objetivo**: (DataMart?) Hoja que agrupa la información relevante para el Cashflow.
**Relaciones Pipeline**: [[Norgenic_BBVA_€-Pipeline#E1]]
**Fuentes**:
**Gid**: ![[Norgenic_BBVA_€-PreCashflow2#Gid]]

### **Odoo**
**Nombre**: 'Odoo'
**Objetivo**: (DataMart?) Hoja con los movimientos pendientes de añadir a Odoo.
**Relaciones Pipeline**: [[Norgenic_BBVA_€-Pipeline#D1]]
**Fuentes**:
**Gid**: ![[Norgenic_BBVA_€-Odoo#Gid]]



## **Helpers**  (Opcionales)
**Objetivo**: Hojas de soporte a las hojas principales.

### **D0**

#### **PreOdoo**
**Nombre**: 
**Objetivo**: Modifica la información relacionada a los movimientos para hacerlos exportables a **Odoo** mediante .
**Relaciones Pipeline**: [[Norgenic_BBVA_€-Pipeline#D0]]
**Fuentes**:
**Gid**: ![[Norgenic_BBVA_€-PreOdoo#Gid]]
