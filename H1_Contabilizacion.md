---
title: H1 — Archivo y Registro de Facturas
tags: [H1, archivo, registro, n8n]
component: H1
related: [[01_Arquitectura_General]], [[wf_C1_ReenvioFras_context]], [[wf_C2_ComprobFras_Context]], [[H0_ControlHumano]], [[H2_ComprobacionCierre]]
---

# H1 — Archivo y Registro de Facturas

## 🎯 Objetivo

Mover las facturas validadas validadas por [[H0_ControlHumano|H0]] hacia su carpeta temporal para su tratamiento por [[wf_C1_ReenvioFras_context]]. Comprobar que el workflow las ha procesado correctamente: Mirando la columna de registro [[N€Caixa-Movimientos_cuenta_0087231#T]] y mirando que no haya documentos en nuestras carpetas Temporales de Drive("Cuadrar" y "MesActual").

---

## 📋 Descripción del Proceso
Toda las factura en la carpeta que lista [[wf_C1_ReenvioFras_context]] al princio son las aprobadas por [[H0_ControlHumano]], el flujo se limita a:
- Mover las facturas de la carpeta de drive "Cuadrar" a la del "Mes correspondientes".
- Ejecutar (y comprobar su correcta ejecución) el siguiente workflow de n8n [[wf_C1_ReenvioFras_context]].
El workflow mueve las facturas de una carpeta temporal (mes en curso) a la definitiva (EnviadasViaTribut), envia una copia a la carpeta con el nombre de mes coincidente de ViaTribut, y escribe el ID de la copia en [[N€Caixa-Movimientos_cuenta_0087231#T]].

El resto se ha eliminado por estar incorrecto!!!!!: