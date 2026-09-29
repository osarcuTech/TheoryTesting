# Guía Técnica de Registros Financieros (Financial Entries) — Solidgate

Este documento recopila la información técnica sobre los **Registros Financieros** (*Financial Entries*) de la plataforma **Solidgate**, detallando su propósito, casos de uso, métodos de generación (API y Plataforma Hub) y la estructura de datos completa de las transacciones.

---

## 1. Resumen General

El reporte de **Registros Financieros** de Solidgate proporciona un desglose detallado a nivel de transacción de todos los registros financieros de la cuenta. Permite realizar conciliaciones precisas incluyendo marcas de tiempo (*timestamps*), montos, tarifas y referencias de liquidación (*settlement*).

---

## 2. Casos de Uso Principales

1. **Revisión de transacciones:** Permite examinar todas las operaciones que influyen en el balance operativo, como ventas (*SALE*), reembolsos (*REFUND*), contracargos (*CHARGEBACK FEE*) y devoluciones o alertas RDR.
2. **Evaluación de tarifas e impuestos:** Desglose individualizado de cada tarifa asociada a las transacciones para un control exacto de costos.
3. **Conversión de divisas:** Comparación entre los montos en la moneda original de la transacción y la moneda de pago (*payout*), calculando las tasas de cambio aplicadas.
4. **Análisis financiero avanzado:** Capacidad de segmentación por método de pago, marca de tarjeta, país geográfico del cliente, país emisor del banco, entidad legal y producto.
5. **Automatización de datos:** Extracción programada mediante API para monitoreo y reportes diarios en tiempo real.

---

## 3. Métodos de Generación del Reporte

### A. A través de la API v1 (Sincrónico/Asíncrono)

Para generar el reporte mediante la API de Solidgate (`API v1`), se utiliza el endpoint de registros financieros por rango de fechas:

- **Endpoint:** `GET /reports/financial-entries-by-date`
- **Parámetros principales:** `date_from`, `date_to`, `filter`
- **Autenticación:** Requiere el uso de las credenciales de API (`publicKey` + `secretKey`) tanto para la solicitud inicial como para la descarga.

#### Consideraciones sobre la marca de tiempo (`created_at`)
- El reporte recupera información basada en el campo `created_at`, el cual se registra en el sistema financiero de Solidgate aproximadamente **4 horas después** de ocurrida la transacción.
- *Recomendación:* Al consultar transacciones de un mes calendario (por ejemplo, del 1 al 31 de enero), conviene extender el rango de consulta ligeramente hasta la mañana del día siguiente (1 de febrero) y luego filtrar localmente por la fecha real de la transacción (`transaction_datetime_utc`).

#### Códigos de estado HTTP durante la descarga
Puesto que el reporte se procesa de forma asíncrona, la llamada de descarga (`/reports/download-financial-entries`) puede devolver:
| Código HTTP | Descripción |
| :--- | :--- |
| **200** | Fallo de autenticación (verificar credenciales de API). |
| **204** | El reporte aún se está procesando; esperar un momento antes de reintentar. |
| **302** | Redirección hacia el enlace de descarga temporal en Amazon S3. |
| **404** | Reporte no encontrado. |
| **410** | El reporte ya no está disponible o ha expirado (disponible por **30 días** posterior a su generación). |

---

### B. A través de la Plataforma Hub (Interfaz de Usuario)

1. Ingrese a la plataforma Hub de Solidgate y navegue a **Reports & Exports**.
2. Haga clic en **+ Create report** en la esquina superior derecha.
3. Complete los campos requeridos:
   - Seleccione el tipo de reporte: **Finance**.
   - Seleccione uno o varios canales (*channels*). Para cada canal se crea un archivo en vez de uno que los englobe.
   - Elija la opción de campo de fecha deseada.
   - Especifique el rango de fechas (hasta un máximo de **36 días** por consulta).
   - Personalice opcionalmente el nombre del archivo.
4. Confirme haciendo clic en **Create**.
5. Al finalizar el procesamiento, haga clic en **Download** para guardar el archivo CSV.

---

## 4. Estructura y Propiedades de los Datos

A continuación se detallan todas las propiedades que conforman un registro financiero en Solidgate:

| Campo | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Identificador único del registro financiero. | `ft_1mc2209090000_fKJScPc` |
| `order_id` | `string` | ID de la orden generado por el comercio. | `mvbcdj1335d` |
| `external_psp_order_id` | `string` | ID de la orden generado por Solidgate. | `psp_order_1samrzwv8my` |
| `transaction_id` | `string` | Identificador único de la transacción asociada. | `5019d00bb70f82cd42f...` |
| `chargeback_id` | `string` | Identificador único asociado a un contracargo (si aplica). | `148812` |
| `order_description` | `string` | Descripción del pedido en su sistema y para el procesamiento bancario. | `Premium package` |
| `created_at` | `string` | Fecha/hora en que se creó el registro en el sistema financiero de Solidgate (dentro de las 4 horas posteriores). | `2025-07-23 17:39:50` |
| `transaction_datetime_provider` | `string` | Fecha/hora en la que ocurrió la transacción en la zona horaria del proveedor. | `2025-07-23 17:39:50` |
| `transaction_datetime_utc` | `string` | Fecha/hora UTC en la que ocurrió la transacción o comisión. | `2025-07-23 17:39:50` |
| `accounting_date` | `string` | Fecha contable que determina qué liquidación o factura incluye el registro. | `2025-07-23` |
| `amount` | `integer` | Monto original de la transacción expresado en unidades menores de moneda (ej. `1020` = 10.20 EUR). | `1020` |
| `amount_in_major_units` | `number` | Monto convertido automáticamente a unidades mayores (ej. `10.20`). | `10.20` |
| `currency` | `string` | Código de 3 letras de la moneda original ([ISO 4217](https://en.wikipedia.org/wiki/ISO_4217)). | `EUR` |
| `currency_minor_units` | `integer` | Unidades menores de la moneda original. | `100` |
| `payout_amount` | `integer` | Monto de pago expresado en unidades menores de moneda. | `1020` |
| `payout_amount_in_major_units` | `number` | Monto de pago convertido a unidades mayores. | `10.20` |
| `payout_currency` | `string` | Moneda en la que se realiza el pago (ISO 4217). | `EUR` |
| `payout_currency_minor_units` | `integer` | Unidades menores de la moneda de pago. | `100` |
| `record_type_key` | `string` | Tipo de registro financiero (`SALE`, `REFUND`, `DISCOUNT FEE`, `CHARGEBACK FEE`). | `SALE` |
| `provider` | `string` | Nombre del proveedor que procesó la transacción. | `Solidgate` |
| `payment_method` | `string` | Método de pago utilizado (`card`, `network-token`, `token`, `apple-pay`, `google-pay`). | `card` |
| `card_brand` | `string` | Marca de la tarjeta utilizada (`VISA`, `Mastercard`, etc.). | `VISA` |
| `geo_country` | `string` | País del cliente en código [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3). | `USA` |
| `issuing_country` | `string` | País del banco emisor de la tarjeta en código ISO alpha-3. | `USA` |
| `legal_entity` | `string` | Entidad legal asociada con el registro financiero. | `Global Ltd.` |
| `product_id` | `string` | Identificador del producto asociado a la orden en Solidgate Billing. | `ac43b415-5522-4373-b026-a365462f9657` |
| `product_name` | `string` | Nombre del producto asociado a la orden. | `Premium subscription` |

---

## 5. Ejemplo de Registro Financiero en Formato JSON

```json
{
  "id": "ft_1mc2209090000_fKJScPc",
  "order_id": "mvbcdj1335d",
  "external_psp_order_id": "psp_order_1samrzwv8my",
  "transaction_id": "5019d00bb70f82cd42f6bc654cbdfcbd63a9b5b1dbd6a",
  "chargeback_id": "148812",
  "order_description": "Premium package",
  "created_at": "2025-07-23 17:39:50",
  "transaction_datetime_provider": "2025-07-23 17:39:50",
  "transaction_datetime_utc": "2025-07-23 17:39:50",
  "accounting_date": "2025-07-23",
  "amount": 1020,
  "amount_in_major_units": 10.20,
  "currency": "EUR",
  "payout_amount": 1020,
  "payout_amount_in_major_units": 10.20,
  "payout_currency": "EUR",
  "record_type_key": "SALE",
  "provider": "Solidgate",
  "payment_method": "card",
  "card_brand": "VISA",
  "geo_country": "USA",
  "issuing_country": "USA",
  "legal_entity": "Global Ltd.",
  "product_id": "ac43b415-5522-4373-b026-a365462f9657",
  "product_name": "Premium subscription"
}
```
