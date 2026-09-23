## Introducción

**NombreSpreadSheet**: NorgenicRevolut
**UbicaciónDrive**: https://drive.google.com/drive/folders/1A14_27QxTht3Al2jKXx4EIciafTJb8AO

### **SS_ID**: 
1EesFEFgBtNfL-ODI50CKTk0le7rVaKCRCZvxUVeiYUA

[[Norgenic_Revolut-Pipeline]]

### **BDB**
**Nombre**: 'BD_Banco'
**Objetivo**: (DataLake?) Bases de datos que almacenan los movimientos bancarios y (opcionalmente) su relación con facturas.
**Relaciones Pipeline**: 
**Fuentes**: [[A1_ImportarMovimientos_GS]] y opcionalmente **ArchivadoDeMovimientos**
**Gid**: ![[Norgenic_Revolut-BD_Banco#Gid]]

### **BD_Movimientos**
**Nombre**: 'BD_Movimientos'
**Objetivo**: (DataMart?) Funciona como GUI para [[H0_ControlHumano]] para la conciliación entre Movimientos y Facturas. Tambien funcióna como fuente de datos temporal para el Cashflow.
**Relaciones Pipeline**: [[H0_ControlHumano]], [[Norgenic_Revolut-Pipeline#A1]], [[Norgenic_Revolut-Pipeline#A2]], [[Norgenic_Revolut-Pipeline#C0]] (Opcional)
**Fuentes**: [[Norgenic_Revolut-Pipeline#A1]], y opcionalmente **ArchivadoDeMovimientos**
**Gid**: ![[Norgenic_Revolut-BD_Movimientos#Gid]]

### **BD_AsigCostes**
**Nombre**: 'AsigCostes'
**Objetivo**: Clasificar los gastos para el Cashflow y para [[Norgenic_Revolut-Pipeline#C0]] (Opcional)
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[Norgenic_Revolut-BD_AsigCostes#Gid]]

### **BD_Facturas** (Opcional)
**Nombre**: 'BD_Facturas'
**Objetivo**: (DataLake?) Bases de datos que almacenan las facturas existentes.
**Relaciones Pipeline**: [[Norgenic_Revolut-Pipeline#B2]]  (Opcional)
**Fuentes**:
**Gid**: ![[Norgenic_Revolut-BD_Facturas#Gid]]

### **BD_HistorialFacturas** (Opcional)
**Nombre**: 'BD_HistorialFacturas'
**Objetivo**: (DataMart?) Hoja de control del estado de las facturas.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[Norgenic_Revolut-BD_HistorialFacturas#Gid]]

### **PreCashflow**
**Nombre**: 'PreCashflow2'
**Objetivo**: (DataMart?) Hoja que agrupa la información relevante para el Cashflow.
**Relaciones Pipeline**: [[Norgenic_Revolut-Pipeline#E1]]
**Fuentes**:
**Gid**: ![[Norgenic_Revolut-PreCashflow2#Gid]]

### **Odoo**
**Nombre**: 'Odoo'
**Objetivo**: (DataMart?) Hoja con los movimientos pendientes de añadir a Odoo.
**Relaciones Pipeline**: [[Norgenic_Revolut-Pipeline#D1]]
**Fuentes**:
**Gid**: ![[Norgenic_Revolut-Odoo#Gid]]



## **Helpers**  (Opcionales)
**Objetivo**: Hojas de soporte a las hojas principales.

### **Generales**

#### **Rangos**
**Nombre**: 'Rangos'
**Objetivo**: Almacena el valor de last row de todas la hojas para que puedan extraerlo sin necesidad de tantos calculos.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[Norgenic_Revolut-Rangos#Gid]]

#### **ContextoHoja**
**Nombre**: 'ContextoHoja'
**Objetivo**: Base de datos con las formulas y/o ejemplos de datos de las 5 primeras filas (la primera es el header) de todas las hojas del SpreadSheet. Funciona a modo de repositorio de formulas para un LLM o para el usuario.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[Norgenic_Revolut-ContextoHoja#Gid]]

### **A2**

#### **Form_AsigCostes **
**Nombre**: 'Form_AsigCostes'
**Objetivo**: Soporte en el append a la "BD_PatronesMovimientos".
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[Norgenic_Revolut-Form_AsigCostes#Gid]]

### **C0**
#### **PProveedores **
**Nombre**: 'PProveedores'
**Objetivo**: Simplificación de "BD_PatronesMovimientos" con solo aquello que puede contener facturas. (Potencialmente eliminable modificando C0)
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[Norgenic_Revolut-PProveedores#Gid]]

### **H0**

#### **FacturasFaltantes **
**Nombre**: 'FacturasFaltantes'
**Objetivo**: Soporte visual para detectar las facturas pendientes de recibir/puntear.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[Norgenic_Revolut-FacturasFaltantes#Gid]]

#### **Compr.Fras.Manual **
**Nombre**: 'Compr.Fras.Manual'
**Objetivo**: Funcionaba para comprobar que todas las facturas hubiesen sido correctamente enviadas a ViaTribut antes de tener **C1** que lo realiza indicando donde se encuentra cada una.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[Norgenic_Revolut-Compr.Fras.Manual#Gid]]

### **D0**

#### **PreOdoo**
**Nombre**: 
**Objetivo**: Modifica la información relacionada a los movimientos para hacerlos exportables a **Odoo** mediante .
**Relaciones Pipeline**: [[Norgenic_Revolut-Pipeline#D0]]
**Fuentes**:
**Gid**: NULL



### **D1**

#### **ResumenPlataformas **
**Nombre**: 'ResumenPlataformas'
**Objetivo**: Control de los ingresos declarado por las distintas plataformas de pago.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[Norgenic_Revolut-ResumenPlataformas#Gid]]

#### **Google **
**Nombre**: 'Google'
**Objetivo**: Control de las diferencias entre pagos y facturas de Google.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[Norgenic_Revolut-Google#Gid]]

#### **Nexmo **
**Nombre**: 'Nexmo'
**Objetivo**: Control de las diferencias entre pagos y facturas de Nexmo.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: ![[Norgenic_Revolut-Nexmo#Gid]]
