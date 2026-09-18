## **BD's**

**NombreSpreadSheet**: Norgenic€LaCaixa-0087231
**SpreadSheet ID**: 1sZeGfiuG7Ab9jx14_-oaQZTtrhIohlx5dhYoSgZCOuw
**UbicaciónDrive**: https://drive.google.com/drive/folders/1geu4FEONN-vpnWkKFXCtAlUW5I6Vg4YU

[[N_Caixa_€-Pipeline]]

### **BDB**
**Objetivo**: (DataLake?) Bases de datos que almacenan los movimientos bancarios y (opcionalmente) su relación con facturas.
**Relaciones Pipeline**: 
**Fuentes**: [[A1_ImportarMovimientos_GS]] y opcionalmente **ArchivadoDeMovimientos**
**Gid**: 1089991841

### **BD_Movimientos**
**Objetivo**: (DataMart?) Funciona como GUI para [[H0_ControlHumano]] para la conciliación entre Movimientos y Facturas. Tambien funcióna como fuente de datos temporal para el Cashflow.
**Relaciones Pipeline**: [[H0_ControlHumano]], [[N_Caixa_€-Pipeline#A1]], [[N_Caixa_€-Pipeline#A2]], [[N_Caixa_€-Pipeline#C0]] (Opcional)
**Fuentes**: [[N_Caixa_€-Pipeline#A1]], y opcionalmente **ArchivadoDeMovimientos**
**Gid**: 1963712436

### **BD_PatronesMovimientos**
**Objetivo**: Clasificar los gastos para el Cashflow y para [[N_Caixa_€-Pipeline#C0]] (Opcional)
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: 313952240

### **BD_Facturas** (Opcional)
**Objetivo**: (DataLake?) Bases de datos que almacenan las facturas existentes.
**Relaciones Pipeline**: [[N_Caixa_€-Pipeline#B2]]  (Opcional)
**Fuentes**:
**Gid**: 1422409426

### **BD_HistorialFacturas** (Opcional)
**Objetivo**: (DataMart?) Hoja de control del estado de las facturas.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: 1839937135

### **PreCashflow**
**Objetivo**: (DataMart?) Hoja que agrupa la información relevante para el Cashflow.
**Relaciones Pipeline**: [[N_Caixa_€-Pipeline#E1]]
**Fuentes**:
**Gid**: 466432676

### **Odoo**
**Objetivo**: (DataMart?) Hoja con los movimientos pendientes de añadir a Odoo.
**Relaciones Pipeline**: [[N_Caixa_€-Pipeline#D1]]
**Fuentes**:
**Gid**: 1036215987



## **Helpers**  (Opcionales)
**Objetivo**: Hojas de soporte a las hojas principales.

### **Generales**

#### **Rangos**
**Objetivo**: Almacena el valor de last row de todas la hojas para que puedan extraerlo sin necesidad de tantos calculos.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: 81356225

#### **ContextoHoja**
**Objetivo**: Base de datos con las formulas y/o ejemplos de datos de las 5 primeras filas (la primera es el header) de todas las hojas del SpreadSheet. Funciona a modo de repositorio de formulas para un LLM o para el usuario.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: 954051395

### **A2**

#### **N€Caixa-Form_AsigCostes **
**Objetivo**: Soporte en el append a la "BD_PatronesMovimientos".
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: 760684095

### **C0**
#### **N€Caixa-PProveedores **
**Objetivo**: Simplificación de "BD_PatronesMovimientos" con solo aquello que puede contener facturas. (Potencialmente eliminable modificando C0)
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: 223389945

### **H0**

#### **FacturasFaltantes **
**Objetivo**: Soporte visual para detectar las facturas pendientes de recibir/puntear.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: 1263948712

#### **Compr.Fras.Manual **
**Objetivo**: Funcionaba para comprobar que todas las facturas hubiesen sido correctamente enviadas a ViaTribut antes de tener **C1** que lo realiza indicando donde se encuentra cada una.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: 1006113461

### **D0**

#### **PreOdoo**
**Objetivo**: Modifica la información relacionada a los movimientos para hacerlos exportables a **Odoo** mediante .
**Relaciones Pipeline**: [[N_Caixa_€-Pipeline#D0]]
**Fuentes**:
**Gid**: NULL



### **D1**

#### **ResumenPlataformas **
**Objetivo**: Control de los ingresos declarado por las distintas plataformas de pago.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: 298332810

#### **Google **
**Objetivo**: Control de las diferencias entre pagos y facturas de Google.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: 951175956

#### **Nexmo **
**Objetivo**: Control de las diferencias entre pagos y facturas de Nexmo.
**Relaciones Pipeline**: 
**Fuentes**:
**Gid**: 371603439
