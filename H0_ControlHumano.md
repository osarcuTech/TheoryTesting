---
title: H0 — Control Humano (Validación)
tags: [H0, control, validación, manual]
component: H0
related: [[01_Arquitectura_General]], [[C0_PunteoFacturas]], [[H1_Contabilizacion]], [[H2_ComprobacionCierre]], [[03_BDs_Principales]]
---

# H0 — Control Humano (Validación)

## 🎯 Objetivos

- **H0.A2**: Supervisión manual de [[A2_AsignacionDeGastos_Sheets_Arquitectura]] 
- **H0.C0**: Supervisión manual de [[C0_PunteoFacturas|C0]]. Toma la decision si validar cada punteo propuesto, entrar-lo manualmente y/o toma decisiones sobre incidencias.
- **H0.C1**: Una vez considera que todo lo que podia hacer se ha hecho autoriza el paso a [[H1_Contabilizacion|H1]].

Es el **corazón de calidad** del sistema: decide qué se archiva, qué requiere corrección, y qué es excepción.

---

## 📋 Descripción del Proceso

### Tareas Principales de H0

#### 1️⃣ Validar Punteos Correctos
**Entrada**: Hoja [[N€Caixa-Movimientos_cuenta_0087231]] con columnas O, P, Q, R.
- Columna O: Sugerencia automática de C0 [[N€Caixa-Movimientos_cuenta_0087231#O]]
- Columna P: Checkbox para aceptar/rechazar [[N€Caixa-Movimientos_cuenta_0087231#P]]
- Columna Q: Override manual (si rechaza sugerencia) [[N€Caixa-Movimientos_cuenta_0087231#Q]]
- Columna R: Entrada manual del periodo contable de las facturas ya que puede no coincidier con el de cobro [[N€Caixa-Movimientos_cuenta_0087231#R]].

**Proceso**:
- Revisar cada fila con L = N/A. Patrón de movimiento pendiente de asígnació. --> Actualizar [[N€Caixa-Form_AsigCostes|A2.0]] y [[N€Caixa-AsigCostes|A2.1]].
- Revisar cada fila con O = vacío & L = 'Proveedores'. Factura no registrada, buscar si la tentemos.
   - SÍ → Detectar fuente del error. Alternativas:
      - Fallo en el trigger: Cuando no se ha movido de las carpetas temporales "Facturación" --> Volver a ejecutar.
      - Fallo en workflows: Cuando nos llega a la carpeta "Información Faltante" (Causa: Nuevo proveedor/PatrónRegex) --> Modificar REGEX de [[B2_Cebollón]] y volver a procesar la factura.
   - NO → Pedirla.
- Revisar cada fila con O ≠ vacío
   - Comparar movimiento bancario vs factura sugerida
      - ¿Coinciden cantidad, fecha, proveedor?
         - SÍ → Marcar P = TRUE
         - NO → ¿Es problema de [[B2_Cebollón]] (Error silencioso: String incorrecto)?
            - SÍ → ¿Corre prisa la contabilización de la factura?:
                  - SÍ → Ingresar factura correcta en Q (aplazando Modificar REGEX de [[B2_Cebollón]] y volver a procesar la factura)
                  - NO → Modificar REGEX de [[B2_Cebollón]] y volver a procesar la factura.
            - NO → Alternativas:
                  - Modificar patrón de [[N€Caixa-AsigCostes]]
                  - Ingresar factura correcta en Q

**Salida**: Columna P marcada con validaciones

#### 2️⃣ Revisar Incidencias
**Tipos de Incidencias**:
- Factura faltante (movimiento sin sugerencia)
- Movimiento faltante (pedir movimientos actualizados)
- Importe inconsistente (revisar si es la factura correcta y en caso negativo conseguir la correcta o modificar cebollón para que la saque de forma correcta)
- Movimiento no asignado (N/A) pero reconocido --> [[A2_AsignacionDeGastos_Sheets_Arquitectura]]
- Movimiento no reconocido (preguntar por la correcta asignación de este para poder ponerla en [[N€Caixa-AsigCostes|A2.1]])


#### 3️⃣ Actualizar Bases de Datos
Según incidencias, H0 actualiza:

- **Form_AsigCostes**: Correcciones de clasificación.
- **AsigCostes**: Correcciones de clasificación.
- **HistorialFacturas**: Correcciones de importe/fecha/proveedor

#### 4️⃣ Autorizar Archivo
Una vez validados todos los punteos:
- Generar lista de facturas pendientes a recibir.
- Verificar completitud (todas con factura asignada)
- Marcar como "Listo para H1"
- Trigger automático de [[H1_Contabilizacion|H1]]

---

## 🐛 Escaladas & Excepciones

### Casos que requieren Escalada a Manager

1. **Movimiento desconocido** (patrón anómalo)
   - Riesgo: Fraude potencial
   - Acción: Reportar a Manager
2. **Movimientos/Facturas faltantes**
   - Acción: Pedir a Manager


---


## 📋 Standard Operating Procedure (SOP)  ¡¡¡Rehacer!!!

## 🔗 Notas Relacionadas

- **Entrada**: [[A2_AsignacionDeGastos_Sheets_Arquitectura]] (Movimientos classificados), [[C0_PunteoFacturas]] (sugerencias), [[B2_Cebollón]] (facturas)
- **Salida**: [[H1_Contabilizacion]] (archivado), [[H2_ComprobacionCierre]] (verificación)
- **Datos**: [[03_BDs_Principales]] (bases modificadas)
- **Escaladas**: [[Propuestas_Mejora#H0_Automatización]]

---

**Última actualización**: 2026-09-10
**Estado**: Activo (requiere atención diaria)
**Impacto**: ⭐⭐⭐⭐⭐ (Crítico - filtro de calidad)
**Personal Requerido**: 1-2 FTE (tiempo completo)
