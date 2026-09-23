
## Introducción

**NombreSpreadSheet**: Norgenic$LaCaixa-0314758
**UbicaciónDrive**: https://drive.google.com/drive/folders/1geu4FEONN-vpnWkKFXCtAlUW5I6Vg4YU

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

### **BD_Facturas** (Opcional)
**Nombre**: 
**Objetivo**: (DataLake?) Bases de datos que almacenan las facturas existentes.
**Relaciones Pipeline**: [[B2_Cebollón]]  (Opcional)
**Fuentes**:
**Gid**: NULL

### **BD_HistorialFacturas** (Opcional)
**Nombre**: 
**Objetivo**: (DataMart?) Hoja de control del estado de las facturas.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: NULL

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

### **Generales**

#### **Rangos**
**Nombre**: 
**Objetivo**: Almacena el valor de last row de todas la hojas para que puedan extraerlo sin necesidad de tantos calculos.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: NULL

#### **ContextoHoja**
**Nombre**: 
**Objetivo**: Base de datos con las formulas y/o ejemplos de datos de las 5 primeras filas (la primera es el header) de todas las hojas del SpreadSheet. Funciona a modo de repositorio de formulas para un LLM o para el usuario.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: NULL

### **A2**

#### **Form_AsigCostes **
**Nombre**: 
**Objetivo**: Soporte en el append a la "BD_PatronesMovimientos".
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: NULL

### **C0**
#### **PProveedores **
**Nombre**: 
**Objetivo**: Simplificación de "BD_PatronesMovimientos" con solo aquello que puede contener facturas. (Potencialmente eliminable modificando C0)
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: NULL

### **H0**

#### **FacturasFaltantes **
**Nombre**: 
**Objetivo**: Soporte visual para detectar las facturas pendientes de recibir/puntear.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: NULL

#### **Compr.Fras.Manual **
**Nombre**: 
**Objetivo**: Funcionaba para comprobar que todas las facturas hubiesen sido correctamente enviadas a ViaTribut antes de tener **C1** que lo realiza indicando donde se encuentra cada una.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: NULL

### **D0**

#### **PreOdoo**
**Nombre**: 
**Objetivo**: Modifica la información relacionada a los movimientos para hacerlos exportables a **Odoo** mediante .
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: NULL



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

#### **Google **
**Nombre**: 
**Objetivo**: Control de las diferencias entre pagos y facturas de Google.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: NULL

#### **Nexmo **
**Nombre**: 
**Objetivo**: Control de las diferencias entre pagos y facturas de Nexmo.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: NULL
