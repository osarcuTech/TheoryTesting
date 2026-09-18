## **BD's**

### **BDB**
**Objetivo**: (DataLake?) Bases de datos que almacenan los movimientos bancarios y (opcionalmente) su relación con facturas.
**Relaciones Pipeline**: 
**Fuentes**: [[A1_ImportarMovimientos_GS]] y opcionalmente **ArchivadoDeMovimientos**
**Gid**:

### **BD_Movimientos**
**Objetivo**: (DataMart?) Funciona como GUI para [[H0_ControlHumano]] para la conciliación entre Movimientos y Facturas. Tambien funcióna como fuente de datos temporal para el Cashflow.
**Relaciones Pipeline**: [[H0_ControlHumano]], [[A1_ImportarMovimientos_GS]], [[A2_AsignacionDeGastos_Sheets_Arquitectura]], [[C0_PunteoFacturas]] (Opcional)
**Fuentes**: [[A1_ImportarMovimientos_GS]], y opcionalmente **ArchivadoDeMovimientos**
**Gid**:

### **BD_PatronesMovimientos**
**Objetivo**: Clasificar los gastos para el Cashflow y para [[C0_PunteoFacturas]] (Opcional)
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:

### **BD_Facturas** (Opcional)
**Objetivo**: (DataLake?) Bases de datos que almacenan las facturas existentes.
**Relaciones Pipeline**: [[B2_Cebollón]]  (Opcional)
**Fuentes**:
**Gid**:

### **BD_HistorialFacturas** (Opcional)
**Objetivo**: (DataMart?) Hoja de control del estado de las facturas.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:

### **PreCashflow**
**Objetivo**: (DataMart?) Hoja que agrupa la información relevante para el Cashflow.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:

### **Odoo**
**Objetivo**: (DataMart?) Hoja con los movimientos pendientes de añadir a Odoo.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:



## **Helpers**  (Opcionales)
**Objetivo**: Hojas de soporte a las hojas principales.

### **Generales**

#### **N€Caixa-Rangos**
**Objetivo**: Almacena el valor de last row de todas la hojas para que puedan extraerlo sin necesidad de tantos calculos.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:

#### **ContextoHoja**
**Objetivo**: Base de datos con las formulas y/o ejemplos de datos de las 5 primeras filas (la primera es el header) de todas las hojas del SpreadSheet. Funciona a modo de repositorio de formulas para un LLM o para el usuario.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:

### **A2**

#### **N€Caixa-Form_AsigCostes **
**Objetivo**: Soporte en el append a la "BD_PatronesMovimientos".
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:

### **C0**
#### **N€Caixa-PProveedores **
**Objetivo**: Simplificación de "BD_PatronesMovimientos" con solo aquello que puede contener facturas. (Potencialmente eliminable modificando C0)
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:

### **H0**

#### **FacturasFaltantes **
**Objetivo**: Soporte visual para detectar las facturas pendientes de recibir/puntear.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:

#### **Compr.Fras.Manual **
**Objetivo**: Funcionaba para comprobar que todas las facturas hubiesen sido correctamente enviadas a ViaTribut antes de tener **C1** que lo realiza indicando donde se encuentra cada una.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:

### **D0**

#### **PreOdoo**
**Objetivo**: Modifica la información relacionada a los movimientos para hacerlos exportables a **Odoo** mediante .
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:



### **D1**

#### **ResumenPlataformas **
**Objetivo**: Control de los ingresos declarado por las distintas plataformas de pago.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:

#### **Google **
**Objetivo**: Control de las diferencias entre pagos y facturas de Google.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:

#### **Nexmo **
**Objetivo**: Control de las diferencias entre pagos y facturas de Nexmo.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**:
