# Guía Técnica de Reporte de Alertas de Prevención (Prevention Alerts) — Solidgate

Este documento proporciona la especificación técnica y operativa del reporte de **Alertas de Prevención** (*Prevention Alerts*) de la plataforma **Solidgate**, detallando sus propósitos, métodos de extracción (API v1 y Hub), diccionario de campos y ejemplos de estructura de datos.

---

## 1. Resumen General

El reporte de **Alertas de Prevención** de Solidgate ofrece una visión integral de las alertas de disputas tempranas emitidas por proveedores y redes de tarjetas (como Ethoca o Verifi). Su objetivo principal es permitir a los comercios actuar de forma proactiva ante reclamos de clientes antes de que estos se conviertan en contracargos formalizados (*chargebacks*), maximizando la tasa de prevención de disputas.

---

## 2. Casos de Uso e Impacto Operativo

1. **Prevención Efectiva de Contracargos:** Recepción de notificaciones tempranas de disputas para emitir reembolsos (*refunds*) a tiempo y evitar penalizaciones de las redes de pago.
2. **Atención al Cliente y Solución de Disputas:** Seguimiento del estado de resolución (*outcome*) de cada reclamo en tiempo real.
3. **Monitoreo de Proveedores de Alertas:** Identificación de las redes de prevención originarias (`ethoca`, entre otras) y análisis de su nivel de efectividad.
4. **Protección de Métricas de Riesgo:** Mantenimiento de los índices de disputas por debajo de los umbrales de los programas de monitoreo de Visa, Mastercard y PayPal.

---

## 3. Métodos de Generación del Reporte

### A. A través de la API v1 (Sincrónico/Asíncrono)

Para solicitar el reporte mediante la API de Solidgate (`API v1`), se utiliza el endpoint específico para alertas de prevención:

- **Endpoint:** `GET /reports/prevention-alerts-by-date`
- **Parámetros principales:** `date_from`, `date_to` (el filtrado por defecto utiliza la marca de tiempo `created_at`).
- **Autenticación:** Requiere credenciales válidas de la API (`publicKey` + `secretKey`).

#### Códigos de Estado HTTP en la Descarga (`report_url`)
Puesto que la generación es asíncrona, las peticiones de descarga pueden retornar:

| Código HTTP | Descripción y Acción Requerida |
| :--- | :--- |
| **200** | Fallo de autenticación. Verifique sus llaves de API (`publicKey` y `secretKey`). |
| **204** | El reporte aún se está procesando. Aguarde un momento antes de reintentar. |
| **302** | Redirección exitosa hacia el enlace temporal de descarga en Amazon S3. |
| **404** | Reporte no encontrado. |
| **410** | Reporte no disponible o expirado. Los archivos generados están disponibles por **30 días**. |

---

### B. A través de la Plataforma Hub (Interfaz de Usuario)

1. Ingrese a la plataforma Hub de Solidgate y navegue a **Reports and exports**.
2. En la esquina superior derecha, haga clic en **+ Create report**.
3. Complete los campos requeridos:
   - Tipo de reporte: Seleccione **Alerts**.
   - Canales: Seleccione uno o varios canales.
   - Rango de fechas: Defina un rango de hasta un máximo de **36 días**.
   - Nombre del archivo: Modifique opcionalmente el nombre generado automáticamente.
4. Haga clic en **Create**.
5. Al finalizar el procesamiento, haga clic en **Download** para obtener el archivo CSV.

---

## 4. Estructura de Datos y Propiedades del Reporte

A continuación se describen todas las propiedades que conforman un registro de alerta de prevención:

| Campo | Tipo | Longitud / Patrón | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | 36 | Identificador único asignado a cada alerta generada. | `83b19018-cbc4-4df0-899a-dda84fd2705e` |
| `order_id` | `string` | 255 | Identificador de la orden definido por el comercio. | `923bb4e6-4a5f-41ec-81fb-28eb8a152e55` |
| `amount` | `integer` | — | Monto especificado en la alerta (en unidades menores de moneda). | `200` |
| `currency` | `string` | 3 | Código ISO 4217 de 3 letras correspondiente a la moneda. | `EUR` |
| `provider_name` | `string` | — | Nombre del proveedor que emitió la alerta. | `ethoca` |
| `alert_date` | `string` | `YYYY-MM-DD HH:MM:SS` | Fecha y hora en la que la alerta fue creada por el proveedor. | `2025-11-25 11:01:03` |
| `alert_type` | `string` | — | Tipo o categoría de la alerta recibida. | `init-refund` |
| `outcome` | `string` | — | Estado o respuesta asignada al procesamiento de la alerta. | `reversed` |
| `payment_method` | `string` | — | Método de pago utilizado en la transacción original. | `paypal-vault` |
| `created_at` | `string` | `YYYY-MM-DD HH:MM:SS` | Fecha y hora en que la alerta fue registrada en Solidgate. | `2025-11-25 11:11:03` |
| `updated_at` | `string` | `YYYY-MM-DD HH:MM:SS` | Fecha y hora de la última actualización de la alerta. | `2025-11-25 11:12:03` |

---

### Tipos de Alerta (`alert_type`)

- **`inquiry`**: Solicitud de información (*inquiry*) del banco emisor emparejada con los datos de transacción del comercio.
- **`init-refund`**: Notificación al comercio que inicia un reembolso automático para prevenir el contracargo.
- **`resolved`**: Notificación de disputa resuelta, acreditando automáticamente los fondos al tarjetahabiente.
- **`prevented`**: Confirmación de disputa prevenida exitosamente a partir de un *inquiry* previo.

---

### Estados de Resultado (`outcome`)

- **`reversed`**: La transacción fue reembolsada exitosamente tras recibir la alerta.
- **`previously-reversed`**: La transacción ya había sido reembolsada con anterioridad a la alerta.
- **`duplicate`**: Alerta duplicada que ya había sido procesada.
- **`decline`**: La transacción asociada a la alerta no fue exitosa o fue rechazada.
- **`reverse-error`**: Error al intentar ejecutar el reembolso automático.
- **`not-found`**: Transacción no encontrada en el sistema.
- **`acknowledged`**: El comercio reconoció la alerta pero decidió no efectuar el reembolso.
- **`pending`**: Estado temporal de espera (se recomienda dar respuesta dentro de las primeras 24 horas).
- **`shipped`**: Aplica a bienes físicos que ya fueron enviados al cliente.

---

## 5. Ejemplo de Registro en Formato JSON

```json
{
  "id": "83b19018-cbc4-4df0-899a-dda84fd2705e",
  "order_id": "923bb4e6-4a5f-41ec-81fb-28eb8a152e55",
  "amount": 200,
  "currency": "EUR",
  "provider_name": "ethoca",
  "alert_date": "2025-11-25 11:01:03",
  "alert_type": "init-refund",
  "outcome": "reversed",
  "payment_method": "paypal-vault",
  "created_at": "2025-11-25 11:11:03",
  "updated_at": "2025-11-25 11:12:03"
}
```
