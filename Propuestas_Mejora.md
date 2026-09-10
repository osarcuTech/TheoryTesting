---
title: Propuestas de Mejora & Roadmap
tags: [mejora, optimización, roadmap, ML]
related: [[00_MOC_Norgenic_Financiera]], [[KPIs_Sistema]]
---

# Propuestas de Mejora & Roadmap

## 🎯 Iniciativas Priorizadas

### 🔴 CRÍTICO (Próximas 2 semanas)

#### 1. Mejorar Confianza de C0 (Matching)

**Problema**: Tasa de aceptación H0 solo 70%, falsos positivos 8%

**Soluciones**:
1. **Enriquecer PerfilProveedores**
   - Agregar 50+ nuevos patrones de movimientos
   - Documentar tolerancias específicas por proveedor
   - Crear reglas para proveedores con excepciones
   - Resultado esperado: +15% aceptación

2. **Implementar Scoring de Confianza**
   - Agregar columna oculta en Movimientos_cuenta con score (0-100)
   - Mostrar score a H0 para facilitar decisión
   - Alertar si score <60
   - Resultado esperado: -3% falsos positivos

3. **Validación Previa en B2**
   - Verificar campos OCR antes de registro
   - Requerirconfianza >85% para auto-registro
   - Marcar <85% como "revisión manual"
   - Resultado esperado: Mejor data en HistorialFacturas

#### 2. Reducir Errores de H1 (Archivo)

**Problema**: 2% de archivos falla al guardarse en Drive

**Soluciones**:
1. **Mejorar búsqueda de archivos**
   - Usar UID como referencia primaria
   - Implementar fallback a búsqueda por nombre
   - Agregar logging de búsqueda para debug
   
2. **Validar permisos antes de mover**
   - Verificar acceso a carpeta destino
   - Crear carpetas faltantes automáticamente
   - Reintentar 3x si falla

3. **Reporte de errores**
   - Generar reporte diario de fallos
   - Escalar manualmente si error persiste
   - Documentar resolución

#### 3. Aumentar Throughput de H0

**Problema**: Solo 85% de movimientos validados diarios, requiere 1.5 FTE

**Soluciones**:
1. **Mejorar UX de Movimientos_cuenta**
   - Agregar filtros por Departamento/Proveedor
   - Sorteo automático (sin sugerencia primero)
   - Atajos teclado (Aceptar=A, Rechazar=R, Siguiente=N)
   - Resultado esperado: -1 min/movimiento

2. **Pre-filtrado automático**
   - Solo mostrar movimientos sin validar (P vacío)
   - Ocultar archivados/procesados
   - Resultado esperado: -30% clics innecesarios

3. **Notificaciones inteligentes**
   - Alertar si hay sugerencias de baja confianza
   - Priorizar por importe (mayor primero)
   - Resultado esperado: Mejora eficiencia 10%

---

### ⚠️ IMPORTANTE (Próximas 2-4 semanas)

#### 4. Integración de Document AI / Google OCR

**Objetivo**: Mejorar OCR de B2 de 94% → 99% confianza

**Implementación**:
1. Integrar Google Document AI (Vision API)
2. Procesar PDFs con modelo entrenado
3. Extraer campos estructurados automáticamente
4. Validar confianza antes de registrar

**Beneficio**: Reducir "Metadatos incompletos" de 2% → <0.5%

**Timeline**: 2 semanas (implementación + testing)

---

#### 5. Machine Learning para Scoring Dinámico (C0)

**Objetivo**: Alcanzar 90%+ aceptación de sugerencias

**Approach**:
1. Recopilar histórico de validaciones H0 (últimos 6 meses)
   - Quién aceptó, quién rechazó, por qué
   - Crear dataset: (Mov, Factura, aceptado=0/1)

2. Entrenar modelo ML (clasificador binario)
   - Features: proveedor, importe, fecha, descripción
   - Algoritmo: Gradient Boosting (XGBoost)
   - Target: Probabilidad de aceptación

3. Integrar scores en C0
   - Usar scores como pesos en matching
   - Reranquear sugerencias por probabilidad
   - Mostrar confidence a H0

**Beneficio**: +20% aceptación, -50% revisiones manuales

**Timeline**: 3-4 semanas (recopilación + entrenamiento + integración)

**Alternativa simple (1 semana)**: 
- Usar COUNTIF para calcular % aceptación histórica por proveedor
- Implementar como scoring simple (sin ML)

---

#### 6. Automatización de H0 (Soft-Automation)

**Objetivo**: Reducir intervención manual, aumentar throughput a 100%

**Automaciones Seguras**:
1. **Auto-aceptar si score >90%**
   - Obvio match: mismo proveedor, importe exacto, fecha correcta
   - Requiere aprobación inicial del manager
   - Estimado: 40% de movimientos

2. **Auto-rechazar si score <30%**
   - Sin coincidencia clara, requerir búsqueda manual
   - No genera falsos positivos

3. **Agrupar por incidencia**
   - Identificar movimientos sin sugerencia (búsqueda manual)
   - Ofrecerlos como lote a H0 juntos
   - Mejorar eficiencia de búsqueda

**Resultado esperado**: +50% throughput, mantener calidad

**Timeline**: 1-2 semanas

---

### 📈 MEDIANO PLAZO (1 mes)

#### 7. Normalización de Proveedores

**Problema**: Mismo proveedor con múltiples nombres
- "TELEFONICA" vs "TELEFONICA ES" vs "TELEFONICASPAIN"
- "AMAZON" vs "AMAZON.ES" vs "AMAZON EU"

**Solución**:
1. Crear tabla "ProveedoresNormalizados"
   - Mapear aliases → nombre canónico
2. Aplicar normalización en B2 al procesar facturas
3. Aplicar en A2 al clasificar movimientos
4. Resultado: Mejor matching en C0

**Beneficio**: +10% cobertura de PerfilProveedores

---

#### 8. Detección de Duplicados Avanzada

**Problema**: Ocasionales duplicados pasan a BD_Banco/BD_Facturas

**Mejoras**:
1. **A1**: Usar fuzzy matching además de UID exacto
   - Detectar "TRANSFER ABC" vs "TRANSFER  ABC" (espacios)
   - Detectar "1500.50" vs "1500.5" (decimales)

2. **B2**: Validar factura antes de registrar
   - Buscar duplicados en BD_Facturas por UID
   - Alertar si ya existe

3. **H2**: Reportar duplicados en cierre mensual
   - Marcar como "A revisar"
   - Escalar a operador

---

#### 9. Auditoría Completa de Cambios

**Objetivo**: Rastreabilidad de todas las decisiones

**Implementación**:
1. Crear tabla "AuditoriaH0"
   - Timestamp, operador, movimiento, acción, nota
   - Auto-registrada en cada validación/corrección

2. Crear tabla "AuditoriaH1"
   - Timestamp, archivo, ubicación, estado, error si aplica

3. Crear tabla "AuditoriaH2"
   - Timestamp, incidencias, resoluciones, cierre

**Beneficio**: Cumplimiento normativo, debugging de issues

---

### 🚀 LARGO PLAZO (Trimestre)

#### 10. Integración Contable (Odoo) Avanzada

**Mejoras**:
1. Validación de cuentas contables en tiempo real
2. Pre-mapeo de Depto/Naturaleza → Cuenta Contable
3. Alertas si importe >límite de aprobación
4. Sincronización bidireccional (si hay correcciones en Odoo)

**Beneficio**: 0% errores de asiento contable

---

#### 11. Portal Web para Proveedores (Futuro)

**Concepto**: Auto-servicio para envío de facturas
- Portal para proveedores key
- Upload automático de facturas
- Tracking de estado de pago

**Timeline**: 3+ meses

---

#### 12. Análisis Predictivo de Gastos

**Concepto**: Forecasting automático de próximos gastos
- Modelo ARIMA para serie temporal de gastos
- Alertas si gasto > promedio histórico

**Beneficio**: Mejor cash flow planning

**Timeline**: 2-3 meses (si hay data histórica limpia)

---

## 📊 Matriz de Impacto vs Esfuerzo

```
                    IMPACTO ALTO
                         ▲
                         │
        C0_Scoring    │    DOC_AI      │ Integr_Contable
       Machine        │                │
       Learning       │    ML_C0       │
                      │   (Scoring)    │
────────────────────────────────────────────────────► ESFUERZO
  1 sem          2 sem         1 mes       3 meses
  
PRIORIDAD:
1️⃣ PerfilProveedores (CRÍTICO, bajo esfuerzo)
2️⃣ H1_Errores (CRÍTICO, bajo-medio esfuerzo)
3️⃣ H0_Throughput (CRÍTICO, medio esfuerzo)
4️⃣ DOC_AI (IMPORTANTE, medio-alto esfuerzo)
5️⃣ ML_Scoring (IMPORTANTE, alto esfuerzo)
6️⃣ Normalización_Proveedores (MEDIANO, bajo esfuerzo)
7️⃣ Auditoría (MEDIANO, medio esfuerzo)
8️⃣ Integración_Contable (LARGO PLAZO)
```

---

## 💰 ROI Estimado (Anual)

| Iniciativa | Inversión | Beneficio | ROI | Payback |
|-----------|-----------|-----------|-----|---------|
| PerfilProveedores | €2,000 | €15,000 (1 FTE menos) | 650% | 1 mes |
| H1_Errores | €1,500 | €8,000 (menos reintentos) | 433% | 1.5 mes |
| DOC_AI | €8,000 | €35,000 (tiempo B2) | 337% | 3 mes |
| ML_Scoring | €15,000 | €60,000 (tiempo H0 + calidad) | 300% | 4 mes |
| **TOTAL** | **€26,500** | **€118,000** | **345%** | **4 meses** |

---

## 🗓️ Roadmap Temporal

### Semana 1-2 (Ahora)
- ✅ Enriquecer PerfilProveedores
- ✅ Mejorar errores H1 (logging)
- ✅ Optimizar UX H0

### Semana 3-4
- 📋 Integrar Document AI (POC)
- 📋 Implementar auto-scoring simple
- 📋 Crear tabla de auditoría

### Mes 2
- 📈 ML Model para C0 (si POC OK)
- 📈 Normalización proveedores
- 📈 Integración contable mejorada

### Mes 3+
- 🚀 Portal proveedores
- 🚀 Análisis predictivo
- 🚀 Full automation + IA

---

## 🔗 Notas Relacionadas

- [[C0_PunteoFacturas]] - Mejoras C0
- [[H0_ControlHumano]] - Mejoras H0
- [[H1_ArchivoRegistro]] - Mejoras H1
- [[KPIs_Sistema]] - Métricas para medir éxito
- [[A2_AsignacionDeGastos]] - Mejoras clasificación

---

**Última actualización**: 2026-09-10
**Responsable del Roadmap**: Finance Operations Manager
**Próxima revisión**: 2026-09-24
