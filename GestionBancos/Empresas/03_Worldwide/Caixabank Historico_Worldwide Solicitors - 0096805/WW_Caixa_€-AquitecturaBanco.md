## GestiónBancaria

### **NombreSpreadSheet**: 
Caixabank Historico_Worldwide Solicitors - 0096805

### **CarpetaHistorico**:
 ![[WW_Caixa_€-AquitecturaArchivos#A2_Intput]]

### **CarpetaImportados**:
 ![[WW_Caixa_€-AquitecturaArchivos#A1_Intput]]

### **SS_ID**: 
1BYzMPwRmZyaBawt6KcSyO-yH8jMnmnb_A2FWpf_b-Ic

[[WW_Caixa_€-Pipeline]]

## **BD's**

### **BDB**
**Nombre**: 'BD_Banco'
**Objetivo**: (DataLake?) Bases de datos que almacenan los movimientos bancarios y (opcionalmente) su relación con facturas.
**Relaciones Pipeline**: 
**Fuentes**: [[A1_ImportarMovimientos_GS]] y opcionalmente **ArchivadoDeMovimientos**
**Gid**: ![[WW_Caixa_€-BD_Banco#Gid]]

### **BD_Movimientos**
**Nombre**: 'BD_Movimientos'
**Objetivo**: (DataMart?) Funciona como GUI para [[H0_ControlHumano]] para la conciliación entre Movimientos y Facturas. Tambien funcióna como fuente de datos temporal para el Cashflow.
**Relaciones Pipeline**: [[H0_ControlHumano]], [[WW_Caixa_€-Pipeline#A1]], [[WW_Caixa_€-Pipeline#A2]], [[WW_Caixa_€-Pipeline#C0]] (Opcional)
**Fuentes**: [[WW_Caixa_€-Pipeline#A1]], y opcionalmente **ArchivadoDeMovimientos**
**Gid**: ![[WW_Caixa_€-BD_Movimientos#Gid]]

### **BD_AsigCostes**
**Nombre**: 'AsigCostes'
**Objetivo**: Clasificar los gastos para el Cashflow y para [[WW_Caixa_€-Pipeline#C0]] (Opcional)
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[WW_Caixa_€-BD_AsigCostes#Gid]]

### **PreCashflow**
**Nombre**: 'PreCashflow2'
**Objetivo**: (DataMart?) Hoja que agrupa la información relevante para el Cashflow.
**Relaciones Pipeline**: [[WW_Caixa_€-Pipeline#E1]]
**Fuentes**:
**Gid**: ![[WW_Caixa_€-PreCashflow2#Gid]]

### **Odoo**
**Nombre**: 'Odoo'
**Objetivo**: (DataMart?) Hoja con los movimientos pendientes de añadir a Odoo.
**Relaciones Pipeline**: [[WW_Caixa_€-Pipeline#D1]]
**Fuentes**:
**Gid**: ![[WW_Caixa_€-Odoo#Gid]]



## **Helpers**  (Opcionales)
**Objetivo**: Hojas de soporte a las hojas principales.

### **D1**

#### **Google **
**Nombre**: 'Google'
**Objetivo**: Control de las diferencias entre pagos y facturas de Google.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[WW_Caixa_€-Google#Gid]]
