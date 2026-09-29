# Guía Técnica del Reporte de Órdenes (Orders Report) — Solidgate

Este documento proporciona la especificación técnica completa y la guía de interpretación para el **Reporte de Órdenes** (*Orders Report / DL-Ordenes*) de la plataforma **Solidgate**, elaborado a partir de la estructura de datos del archivo fuente `DL-Ordenes.csv`.

---

## 1. Resumen General

El **Reporte de Órdenes** de Solidgate ofrece una vista detallada a nivel operacional del ciclo de vida de cada transacción comercial. A diferencia del reporte de **Registros Financieros** (*Financial Entries*) —el cual se centra en los movimientos contables, tarifas y balances operacionales—, el Reporte de Órdenes consolida los atributos del cliente, detalles técnicos de la solicitud, identificadores de pasarela y estados operacionales (`order_status`, `order_type`, `order_is_secured`).

Este reporte es la herramienta principal para la gestión diaria de ventas, atención al cliente, prevención de fraudes y auditoría transaccional.

---

## 2. Casos de Uso Principales

1. **Monitoreo del Ciclo de Vida de la Orden:** Trazabilidad completa desde la autorización o cobro inicial (`order_created_at`) hasta cambios de estado posteriores (`order_updated_at`), como la aplicación de reembolsos (*refunded*) o cancelaciones.
2. **Gestión de Soporte y Atención al Cliente:** Localización rápida de transacciones mediante datos de identificación del usuario (correo electrónico, nombre, apellido, ID de cuenta y descripción del pedido).
3. **Análisis de Fraude y Autenticación Segura:** Evaluación de parámetros de seguridad como autenticación 3D Secure (`order_is_secured`), indicadores de fraude (`order_fraudulent`), país de ubicación geolocalizada (`order_geo_country`) y direcciones IP (`order_ip_address`).
4. **Conciliación Múltiple entre Pasarelas:** Identificación cruzada mediante la relación entre el ID de orden del comercio (`order_id`), el ID de orden en Solidgate (`psp_order_id`) y el ID del proveedor/adquirente (`provider_payment_id`).
5. **Auditoría de Procesamiento Financiero:** Verificación de consistencia entre el monto solicitado por la orden (`order_amount`), el monto efectivamente procesado por el adquirente (`processing_amount`) y el monto liquidado final (`settled_amount`).

---

## 3. Métodos de Generación del Reporte

### A. A través de la Plataforma Hub (Interfaz de Usuario)

1. Ingrese a la consola **Solidgate Hub** y navegue a la sección **Reports & Exports** (o la pestaña **Orders**).
2. Haga clic en **+ Create Report** / **Export**.
3. Configure los filtros requeridos:
   - **Rango de fechas:** Defina el período de consulta (basado en la fecha de creación de la orden `order_created_at` o la fecha de actualización `order_updated_at`).
   - **Comercio / MID:** Seleccione uno o varios Merchant IDs (`mid`).
   - **Estados de la orden:** Filtre por estados específicos (ej. `refunded`, `settled`, `declined`, `processing`).
4. Haga clic en **Generate / Download** para obtener el archivo de exportación en formato CSV (nombrado típicamente como `DL-Ordenes.csv`).

### B. A través de la API v1 (Integración Programática)

Para consultar información de órdenes de forma automatizada, Solidgate provee endpoints de consulta de órdenes:

- **Endpoint de consulta de orden:** `GET /v1/order/{order_id}` o `POST /v1/orders/check`
- **Endpoint de reportes asíncronos:** `GET /reports/orders-by-date`
- **Autenticación:** Requiere cabeceras firmadas mediante las llaves API (`publicKey` y `secretKey`).

---

## 4. Estructura y Especificación de Campos (Diccionario de Datos)

A continuación se detallan los **28 campos** que conforman la estructura del reporte de órdenes `DL-Ordenes.csv`:

| Campo | Tipo | Descripción | Ejemplo (Muestra CSV) |
| :--- | :--- | :--- | :--- |
| `Source.Name` | `string` | Nombre del archivo fuente u origen del reporte exportado. | `2025-05_tfn_norgenic.csv` |
| `order_id` | `string` | Identificador único de la orden generado por el comercio. | `TFNG3QDFKT0FUQ0MEHQQMMXMCHH6-677bc237ae52e` |
| `order_status` | `string` | Estado actual de la orden en Solidgate (`refunded`, `settled`, `declined`, `processing`). | `refunded` |
| `order_type` | `string` | Tipo de transacción o flujo de procesamiento (`auth`, `charge`, `google-pay`, `apple-pay`). | `auth` |
| `order_amount` | `integer` | Monto total de la orden expresado en **unidades menores** de la moneda (ej. `8500` = 85.00 AUD). | `8500` |
| `order_currency` | `string` | Código de 3 letras de la moneda del pedido ([ISO 4217](https://en.wikipedia.org/wiki/ISO_4217)). | `AUD` |
| `order_description` | `string` | Descripción o concepto del pedido configurado por el comercio. | `TFNG3QDFKT0FUQ0MEHQQMMXMCHH6` |
| `order_customer_account_id` | `string` | Identificador único del cliente en la plataforma del comercio (si aplica). | `usr_10293` |
| `order_customer_email` | `string` | Correo electrónico del cliente comprador. | `martinashred@gmail.com` |
| `order_customer_first_name` | `string` | Nombre de pila del cliente. | `Martina` |
| `order_customer_last_name` | `string` | Apellido del cliente. | `Buriankova` |
| `order_geo_country` | `string` | Código de país geográfico del comprador ([ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3)). | `USA` |
| `order_ip_address` | `string` | Dirección IP del cliente registrada al realizar la transacción (IPv4 o IPv6). | `185.218.127.17` |
| `order_error_code` | `string` | Código de error devuelto si la orden fue rechazada o falló (si aplica). | `30001_card_declined` |
| `order_platform` | `string` | Plataforma o canal donde se originó la orden (`WEB`, `MOBILE`, `API`). | `WEB` |
| `order_fraudulent` | `string/boolean` | Indicador de si la orden fue marcada como fraudulenta (`VERDADERO` / `FALSO`). | `FALSO` |
| `order_is_secured` | `string/boolean` | Indica si la orden utilizó autenticación 3D Secure / 3DS (`VERDADERO` / `FALSO`). | `FALSO` |
| `order_created_at` | `string` | Fecha y hora de creación de la orden en formato `DD/MM/YYYY HH:MM`. | `20/01/2025 3:51` |
| `order_updated_at` | `string` | Fecha y hora de la última actualización de estado de la orden. | `13/05/2025 7:53` |
| `mid` | `string` | Identificador del comercio en Solidgate (Merchant ID). | `0b19f0c4-51bf-4b39-a84a-7b033a848e41` |
| `traffic_source` | `string` | Canal o campaña publicitaria que originó el tráfico (si aplica). | `google_ads` |
| `processing_amount` | `integer` | Monto procesado por el adquirente bancario expresado en unidades menores. | `9900` |
| `processing_currency` | `string` | Moneda en la que se procesó la transacción ante el adquirente (ISO 4217). | `USD` |
| `psp_order_id` | `string` | Identificador único de la orden generado internamente por Solidgate PSP. | `756233207678dc84865951` |
| `provider_payment_id` | `string` | Identificador de pago devuelto por el procesador bancario o pasarela adquirente. | `FTN7VH7SJBGFFVF3` |
| `order_metadata` | `string/json` | Objeto JSON o metadatos personalizados adjuntos a la orden. | `{"plan_id": "monthly_pro"}` |
| `payment_type` | `string` | Instrumento o método de pago específico (`card`, `google-pay`, `apple-pay`). | `google-pay` |
| `settled_amount` | `integer` | Monto final efectivamente liquidado al comercio en unidades menores. | `9900` |

---

## 5. Ejemplo de Registro de Órdenes en Formato JSON

Basado en la muestra de datos extraída de `DL-Ordenes.csv`, a continuación se presenta la representación equivalente en objeto JSON:

```json
{
  "source_name": "2025-05_itin_norgenic.csv",
  "order_id": "ITIN4JWS8AKZ7LSONODUHNL4TPNUD-678dc7ac1a58d",
  "order_status": "refunded",
  "order_type": "auth",
  "order_amount": 9900,
  "order_currency": "USD",
  "order_description": "ITIN4JWS8AKZ7LSONODUHNL4TPNUD",
  "order_customer": {
    "account_id": null,
    "email": "martinashred@gmail.com",
    "first_name": "Martina",
    "last_name": "Buriankova",
    "geo_country": "USA",
    "ip_address": "185.218.127.17"
  },
  "order_security": {
    "error_code": null,
    "platform": "WEB",
    "fraudulent": false,
    "is_secured": false
  },
  "timestamps": {
    "created_at": "2025-01-20 03:51:00",
    "updated_at": "2025-05-13 07:53:00"
  },
  "processing_details": {
    "mid": "0b19f0c4-51bf-4b39-a84a-7b033a848e41",
    "traffic_source": null,
    "processing_amount": 9900,
    "processing_currency": "USD",
    "psp_order_id": "756233207678dc84865951",
    "provider_payment_id": "FTN7VH7SJBGFFVF3",
    "payment_type": null,
    "settled_amount": 9900,
    "order_metadata": null
  }
}
```

---

## 6. Observaciones Técnicas y Análisis de la Muestra (`DL-Ordenes.csv`)

1. **Manejo de Unidades Menores (*Minor Units*):**
   - Los campos `order_amount`, `processing_amount` y `settled_amount` están expresados en números enteros correspondientes a unidades menores de la moneda. Por ejemplo, `9900` con moneda `USD` representa **$99.00 USD**, mientras que `8500` con moneda `AUD` representa **$85.00 AUD**.

2. **Diferencia entre Marcas de Tiempo (`created_at` vs `updated_at`):**
   - En la muestra de transacciones analizadas, se observa que las órdenes fueron creadas en fechas anteriores (ej. enero, febrero o marzo de 2025) y sus estados fueron actualizados posteriormente (ej. mayo, junio o julio de 2025). Esto se debe a que la muestra corresponde a órdenes en estado `refunded`, reflejando la fecha en la que se efectuó la devolución.

3. **Autenticación y Seguridad:**
   - El campo `order_is_secured` indica si la transacción superó el protocolo 3D Secure (`VERDADERO` / `FALSO`). La columna `order_fraudulent` señala si el sistema Antifraude de Solidgate marcó la orden como riesgosa.

4. **Trazabilidad con el Reporte de Registros Financieros (*Financial Entries*):**
   - Para conciliar las ventas y reembolsos del Reporte de Órdenes con el balance financiero contable, utilice el campo `order_id` o `psp_order_id` como clave primaria de cruce (*JOIN*) entre ambos reportes.
