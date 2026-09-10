---
title: Cómo Usar Este Vault en Obsidian
tags: [guía, obsidian, navegación]
---

# Cómo Usar Este Vault en Obsidian

## 🎯 Inicio Rápido

1. **Descarga Obsidian**: [obsidian.md](https://obsidian.md)
2. **Abre este directorio como Vault**:
   - File → Open Vault → Selecciona `/TheoryTesting/`
3. **Comienza en [[00_MOC_Norgenic_Financiera|MOC Principal]]**

---

## 📍 Estructura de Navegación

```
00_MOC_Norgenic_Financiera (START HERE)
├─ 01_Arquitectura_General
│  └─ 02_Flujo_Datos_Diagrama
├─ A1_ImportarMovimientos
├─ A2_AsignacionDeGastos
├─ B1_RecepcionFacturas
├─ B2_Cebollón
├─ C0_PunteoFacturas
├─ H0_ControlHumano
├─ H1_ArchivoRegistro
├─ H2_ComprobacionCierre
├─ 03_BDs_Principales
├─ KPIs_Sistema
├─ Formulas_Google_Sheets
├─ Workflows_n8n_Referencia
├─ Propuestas_Mejora
└─ (este archivo)
```

---

## 🔍 Cómo Buscar Información

### Búsqueda por Tema

**¿Quiero entender el flujo general?**
→ [[01_Arquitectura_General]] → [[02_Flujo_Datos_Diagrama]]

**¿Quiero profundizar en un componente (ej: A1)?**
→ [[A1_ImportarMovimientos]]

**¿Quiero ver un diagrama visual?**
→ [[02_Flujo_Datos_Diagrama]]

**¿Quiero entender cómo funciona el matching?**
→ [[C0_PunteoFacturas]]

**¿Quiero saber qué KPIs medir?**
→ [[KPIs_Sistema]]

**¿Quiero ver cómo se escriben las fórmulas?**
→ [[Formulas_Google_Sheets]]

**¿Quiero conocer los workflows de n8n?**
→ [[Workflows_n8n_Referencia]]

---

## 🔗 Características de Obsidian para Este Vault

### Wiki Links (Navegación)

Todos los documentos usan `[[wiki-links]]` para conectar notas:

```
[[A1_ImportarMovimientos]] → Haz click para ir a A1
```

### Backlinks

Panel derecho muestra "Backlinks":
- Qué notas refieren a la nota actual
- Útil para entender relaciones

### Graph View

Haz click en icono de "Graph" para ver mapa visual de todas las notas y conexiones.

### Search

Presiona `Ctrl+Shift+F` para buscar en todo el vault:
- Busca "KPI" para encontrar todas referencias a métricas
- Busca "error" para ver issues mencionados
- Busca "mejora" para ver propuestas

### Tags

Haz click en un tag (ej: `#architecture`, `#workflow`) para ver todas las notas con ese tag.

---

## 💡 Tips de Uso

### Para Gerentes/Finance

1. Lee [[01_Arquitectura_General]] para entender el sistema
2. Ve a [[KPIs_Sistema]] para ver métricas clave
3. Consulta [[Propuestas_Mejora]] para roadmap
4. Usa Search para encontrar referencias a problemas específicos

### Para Operadores (H0)

1. Lee [[H0_ControlHumano]] para entender tareas
2. Abre [[C0_PunteoFacturas]] para entender sugerencias
3. Si hay error, busca en [[Propuestas_Mejora]] solución

### Para Desarrolladores (Devops/n8n)

1. Lee [[01_Arquitectura_General]] para contexto
2. Ve a componente específico (ej: [[A1_ImportarMovimientos]])
3. Consulta [[Workflows_n8n_Referencia]] para detalles técnicos
4. Revisa [[Formulas_Google_Sheets]] para fórmulas

### Para Auditores/Compliance

1. Lee [[H0_ControlHumano]] para flujo de validación
2. Consulta [[H2_ComprobacionCierre]] para cierre de mes
3. Busca "auditoría" para requisitos de registro
4. Ve a [[Propuestas_Mejora]] para mejoras planeadas

---

## 📝 Mantenimiento del Vault

### Cómo Agregar Nueva Información

1. **Para componente nuevo**: Crear nota con nombre `[CÓDIGO]_[Nombre].md`
   - Ejemplo: `D1_ImportacionAlternativa.md`
   - Agregar front-matter: `tags`, `related`, `component`
   - Vincular desde [[00_MOC_Norgenic_Financiera]]

2. **Para actualizar existente**: 
   - Editar nota directamente
   - Cambiar campo `updated` en front-matter
   - Obsidian mantendrá links automáticamente

3. **Para revisar cambios**:
   - Obsidian integra con Git si el vault es repositorio
   - Ver historial: Haz click en nota → "Revision history"

### Convenciones

- **Nombres**: 
  - MOCs: `00_MOC_...`
  - Componentes: `[LETRA][NÚMERO]_...`
  - Temas: `[TemaCompleto_SinEspacios].md`

- **Front-matter**:
  ```yaml
  ---
  title: Título del documento
  tags: [tag1, tag2]
  related: [[OtraNota1]], [[OtraNota2]]
  ---
  ```

- **Links internos**: Siempre usa `[[nota]]` para referencias
- **Actualización**: Agregar fecha en campo `updated: YYYY-MM-DD`

---

## 🚀 Opciones Avanzadas

### Plugins Recomendados para Obsidian

1. **Dataview**: Crear vistas dinámicas de notas
2. **Calendar**: Ver notas con fechas (útil para roadmap)
3. **Excalidraw**: Dibujar diagramas en notas
4. **Git**: Sincronizar cambios con repositorio
5. **Review**: Programar revisiones periódicas de notas

### Atajos de Teclado Útiles

| Atajo | Acción |
|-------|--------|
| `Ctrl+K` | Crear link a otra nota |
| `Ctrl+Shift+F` | Buscar en todo el vault |
| `Ctrl+P` | Paleta de comandos |
| `Ctrl+,` | Configuración |

### Exportar a Otros Formatos

- **PDF**: Nota → Exportar → PDF
- **HTML**: Nota → Exportar → HTML
- **Markdown**: Directamente editable en cualquier editor

---

## 📞 Soporte & Preguntas

**¿No encuentras algo?**
1. Usa Search (`Ctrl+Shift+F`)
2. Revisa Graph View para conexiones
3. Consulta MOC principal
4. Pregunta a Finance Operations Manager

**¿Hay error o información desactualizada?**
- Edita directamente (Obsidian lo guarda)
- O notifica a Finance Operations Manager para revisión

---

## 📊 Resumen de Documentos

| Documento | Tipo | Uso |
|-----------|------|-----|
| 00_MOC_Norgenic_Financiera | Index | Punto de entrada |
| 01_Arquitectura_General | Overview | Entender sistema |
| 02_Flujo_Datos_Diagrama | Visual | Ver flujos |
| A1-H2 | Component | Entender cada paso |
| 03_BDs_Principales | Reference | Estructura de datos |
| KPIs_Sistema | Metrics | Ver rendimiento |
| Formulas_Google_Sheets | Technical | Implementación |
| Workflows_n8n_Referencia | Technical | Procesos automatizados |
| Propuestas_Mejora | Strategic | Roadmap futuro |
| (este archivo) | Guide | Usar Obsidian |

---

**Última actualización**: 2026-09-10
**Obsidian versión mínima**: 1.3+
**Licencia**: Norgenic Finance
