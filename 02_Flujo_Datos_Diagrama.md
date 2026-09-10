---
title: Flujo de Datos — Diagramas Detallados
tags: [diagrama, flujo, mermaid]
related: [[01_Arquitectura_General]], [[00_MOC_Norgenic_Financiera]]
---

# Flujo de Datos — Diagramas Detallados

## 🖼️ Diagrama 1: Flujo de Datos de la BD (Reconstrucción)

Las tres hojas superiores actúan como "soft-trigger" que inician un tratamiento de datos en cascada.

```mermaid
flowchart TD
    J1[J1: Envío Movimientos/Facturas] -->|J1.A Mov. Bancarios| A1[A1: Importar en BD_Banco]
    J1 -->|J1.B Facturas| B1[B1: Recepción por correo]

    A1 --> A2[A2: Asignar Gastos]
    B1 --> B2[B2: Nombrar / Registrar BD_Facturas / Pre-archivar]

    A2 -->|Movimiento clasificado 'Proveedores'| C0{{C0: Fórmula de Punteo}}
    B2 --> C0

    C0 --> H0[H0: Control humano — validar punteos / revisar incidencias]

    H0 -->|Facturas a archivar| H1[H1: Archivar / Enviar Facturas C1/C2]
    H0 -->|Actualiza| Cashflow[Informes Cashflow]
    H0 -->|Actualiza hojas de control| H2[H2: Comprobación de informes]

    H1 -->|Registro ubicación| H2
    H2 -->|Incidencia| J0["J0.A/B, H0, H1, J2<br/>(Escalada)"]
    H2 -->|OK| Cierre[Cierre de mes]
```

---

## 🖼️ Diagrama 2: Flujo de Datos — Arquitectura Flujo A / Flujo B

Separación clara entre procesamiento bancario y facturación, convergentes en C0.

```mermaid
flowchart LR
    subgraph FlujoA["📊 Flujo A — Bancario"]
        A1[A1: ImportarMovimientos<br/>Apps Script + Drive] --> BDBanco[(BD_Banco)]
        BDBanco -->|Query| MovCuenta[Movimientos_cuenta]
        MovCuenta --> A2[A2: AsignacionDeGastos]
        A2 -->|Clasifica 'Proveedores'| AB_C[[Trigger AB_C]]
    end

    subgraph FlujoB["📨 Flujo B — Facturación"]
        B1[B1: Recepción correo] --> B2[B2: Cebollón]
        B2 --> BDFacturas[(BD_Facturas)]
        BDFacturas -->|Query| HistFras[HistorialFacturas]
    end

    subgraph FlujoC["🎯 Flujo C — Conciliación"]
        C0{{C0: Autopunteo}}
        C0 -->|Sugerencia col. O| MovCuenta
    end

    AB_C --> C0
    HistFras --> C0
    MovCuenta -->|Columna J| C0
```

---

## 🖼️ Diagrama 3: Estados de una Factura

Ciclo de vida completo de una factura desde recepción hasta archivo.

```mermaid
flowchart TD
    Recibida["📩 Factura Recibida<br/>(Gmail)"]
    
    Recibida --> B1["B1: Descarga<br/>+ Extrae Metadatos"]
    
    B1 --> B2Proc["B2: Procesa OCR<br/>+ Nombra<br/>+ Registra BD"]
    
    B2Proc -->|Completa| B2OK["✅ Factura Procesada<br/>(Listo para matching)"]
    B2Proc -->|Incompleta| B2Error["❌ Error OCR<br/>(Requiere manual)"]
    
    B2Error -->|H0 Corrige| B2OK
    
    B2OK -->|Crea sugerencia| C0["C0: Punteo<br/>(Matching)"]
    
    C0 -->|Sugiere| H0Rev["H0: Validación<br/>(Aceptar/Rechazar)"]
    
    H0Rev -->|Aceptada| H0OK["✅ Validada<br/>(Listo para archivo)"]
    H0Rev -->|Rechazada| H0Fix["🔧 Corregida<br/>(Nueva validación)"]
    
    H0Fix --> H0OK
    
    H0OK --> H1["H1: Archivo<br/>(Mueve a Drive destino<br/>+ Registra ruta<br/>+ Genera comprobante)"]
    
    H1 -->|Exitoso| H1OK["📂 Archivada<br/>(En Drive definitivo)"]
    H1 -->|Falla| H1Error["⚠️ Error Archivo<br/>(Requiere reintentos)"]
    
    H1Error --> H1
    
    H1OK --> H2["H2: Comprobación<br/>(Verifica completitud)"]
    
    H2 -->|OK| Cerrada["✅ Cerrada<br/>(Ciclo completo)"]
    H2 -->|Incidencia| Escalada["🚨 Escalada<br/>(Requiere resolución)"]
    
    Escalada -.-> H0Rev
```

---

## 🖼️ Diagrama 4: Estados de un Movimiento Bancario

Paralelo al ciclo de factura, pero desde la perspectiva del movimiento.

```mermaid
flowchart TD
    Importado["💳 Movimiento Importado<br/>(Banco)"]
    
    Importado --> A1["A1: Importar BD<br/>(Deduplicar por UID)"]
    
    A1 -->|Nueva| A1OK["✅ Registrado<br/>(En BD_Banco)"]
    A1 -->|Duplicado| A1Dup["🔄 Duplicado<br/>(Descartado)"]
    
    A1OK --> A2["A2: Clasificar<br/>(Depto/Naturaleza/Cat)"]
    
    A2 -->|Coincide regla| A2OK["✅ Clasificado<br/>(Listo para matching)"]
    A2 -->|Sin regla| A2Manual["🔧 Pendiente Manual<br/>(H0 debe clasificar)"]
    
    A2Manual -.->|H0 Clasifica| A2OK
    
    A2OK --> C0["C0: Matching<br/>(Busca factura)"]
    
    C0 -->|Encuentra| C0OK["💡 Sugerencia<br/>(Propone factura)"]
    C0 -->|No encuentra| C0Empty["❓ Sin sugerencia<br/>(Requiere búsqueda manual)"]
    
    C0OK --> H0Val["H0: Validar<br/>(¿Correcto?)"]
    C0Empty --> H0Man["H0: Búsqueda Manual<br/>(Localizar factura)"]
    
    H0Val -->|Aceptado| H0OK["✅ Validado<br/>(Listo para cierre)"]
    H0Val -->|Rechazado| H0Fix["🔧 Corregir<br/>(Nueva factura)"]
    
    H0Man --> H0OK
    H0Fix --> H0OK
    
    H0OK --> H2["H2: Comprobación<br/>(Verificar consistencia)"]
    
    H2 -->|OK| Cerrado["✅ Cerrado<br/>(Ciclo completo)"]
    H2 -->|Incidencia| Escalada["🚨 Escalada<br/>(Requiere revisión)"]
    
    Escalada -.-> H0Val
```

---

## 🖼️ Diagrama 5: Flujo de Decisiones en H0 (Control Humano)

Detalle de la lógica de decisión que ejecuta H0.

```mermaid
flowchart TD
    Input["Movimiento + Sugerencia<br/>de C0"]
    
    Input --> Q1{"¿Hay<br/>sugerencia O?"}
    
    Q1 -->|NO| Q1N["Búsqueda Manual"]
    Q1 -->|SÍ| Q2
    
    Q2{"¿Proveedor<br/>coincide?"}
    Q2 -->|NO| Q2N["❌ Rechazar"]
    Q2 -->|SÍ| Q3
    
    Q3{"¿Importe<br/>±5%?"}
    Q3 -->|NO| Q3N["❌ Revisar diferencia"]
    Q3 -->|SÍ| Q4
    
    Q4{"¿Fecha<br/>±30 días?"}
    Q4 -->|NO| Q4N["❌ Revisar fecha"]
    Q4 -->|SÍ| Q5
    
    Q5["✅ ACEPTAR"]
    
    Q1N -->|Encuentra| Q1Y["Q = factura"]
    Q1N -->|No encuentra| Q1N2["Q = vacío<br/>(Incidencia)"]
    
    Q2N -.-> Q1N
    Q3N -.-> Q1N
    Q4N -.-> Q1N
    
    Q1Y --> Q5
    Q1N2 --> Q5
    
    Q5 --> Output["P = TRUE<br/>o Q = valor"]
```

---

## 🖼️ Diagrama 6: Triggers y Cascadas (Soft-Triggers)

Cómo los cambios en una hoja disparan cálculos en cascada.

```mermaid
flowchart TD
    DB["📊 BD_Banco<br/>(cambio en fila)"]
    
    DB -->|Trigger| MC["Movimientos_cuenta<br/>(Query se actualiza)"]
    
    MC -->|Soft-trigger| A2["A2: Recálculo<br/>Clasificación"]
    A2 -->|Actualiza Col. I| MC
    
    MC -->|Soft-trigger| C0["C0: Recálculo<br/>Matching"]
    C0 -->|Actualiza Col. O| MC
    
    DBF["📊 BD_Facturas<br/>(cambio en fila)"]
    
    DBF -->|Trigger| HF["HistorialFacturas<br/>(Query se actualiza)"]
    
    HF -->|Soft-trigger| C0
    
    C0 -->|Nueva sugerencia| H0["H0: Notificación<br/>(Revisar)"]
    
    H0 -->|Valida P| MC
    
    MC -->|Filtro P=TRUE| H1["H1: Archivado<br/>(Prepara lista)"]
    
    H1 -->|Archivo completado| H2["H2: Comprobación<br/>(Verifica)"]
    
    H2 -->|Reporte| Manager["📋 Finance Manager<br/>(Cierre mensual)"]
```

---

## 🔗 Notas Relacionadas

- [[01_Arquitectura_General]] - Overview arquitectura
- [[A1_ImportarMovimientos]] - Detalle Flujo A inicial
- [[B1_RecepcionFacturas]] - Detalle Flujo B inicial
- [[C0_PunteoFacturas]] - Detalle Flujo C matching
- [[H0_ControlHumano]] - Detalle control y decisiones
- [[H1_ArchivoRegistro]] - Detalle archivo
- [[H2_ComprobacionCierre]] - Detalle cierre

---

**Última actualización**: 2026-09-10
**Versión**: 3.1
