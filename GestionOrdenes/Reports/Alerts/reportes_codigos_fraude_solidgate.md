# Guía Técnica de Códigos de Razón de Fraude (Fraud Reason Codes) — Solidgate

Este documento contiene la especificación técnica de los **Códigos de Razón de Fraude** (*Fraud Reason Codes*) utilizados en la plataforma **Solidgate** para categorizar y notificar transacciones no autorizadas o fraudulentas procedentes de las redes de tarjetas **Visa** y **Mastercard**.

---

## 1. Resumen General y Propósito

Los **códigos de razón de fraude** sirven para clasificar y reportar pagos no autorizados o sospechosos. Son emitidos por los bancos emisores hacia las redes de tarjetas (a través de alertas como TC40 en Visa o SAFE en Mastercard) para:

- **Categorizar el tipo de fraude:** Identificar la naturaleza del incidente (tarjeta perdida, robada, clonada, suplantación de identidad, engaño al titular, etc.).
- **Evaluar patrones de riesgo:** Permitir a comercios e instituciones financieras monitorear métricas de seguridad y ajustar reglas de prevención.
- **Informativo no disputable:** A diferencia de los contracargos (*chargebacks*), las notificaciones de fraude (*fraud notifications*) son registros de advertencia sobre actividad fraudulenta y **no admiten proceso de disputa o representación**.

---

## 2. Códigos de Fraude de Visa

Lista de códigos de razón de fraude definidos por Visa:

| Código | Nombre de la Categoría | Descripción Técnica |
| :--- | :--- | :--- |
| **0** | Card reported lost | Transacción no autorizada realizada con una tarjeta reportada como **perdida** por el titular. |
| **1** | Card reported stolen | Transacción no autorizada realizada con una tarjeta reportada como **robada** por el titular. |
| **2** | Not received as issued (NRI) | Transacción no autorizada con una tarjeta que fue **interceptada** antes de que el titular la recibiera. |
| **3** | Fraudulent application | Pago fraudulento realizado con una tarjeta obtenida mediante una **solicitud con nombre o identificación falsa**. |
| **4** | Issuer counterfeit | Pago fraudulento realizado mediante el uso de una tarjeta **alterada o reproducida ilegalmente** (clonada). |
| **5** | Miscellaneous | Cualquier motivo de fraude no clasificado en los otros códigos. |
| **6** | Fraudulent use of account number | Pago fraudulento por uso no autorizado de los datos de la cuenta (tarjeta no presente / e-commerce, teléfono o correo) sin la tarjeta física. |
| **9** | Acquirer reported counterfeit | Transacción no autorizada relacionada con **colusión** entre un comercio y el adquirente. |
| **A** | Incorrect processing | Fraude posibilitado por un **procesamiento incorrecto** o la falta de validación de elementos de seguridad (ej. falta de validación de criptograma EMV). |
| **B** | Account or credentials takeover | Transacción realizada por un tercero que tomó el control de una cuenta existente (**Account Takeover - ATO**) o mediante credenciales robadas (ej. billeteras digitales). |
| **C** | Merchant misrepresentation | Fraude resultante de engaño deliberado del comercio al cliente (bienes/servicios no entregados según lo prometido, cobros excesivos o no pactados). |
| **D** | Manipulation of account holder | Fraude resultante de **manipulación/ingeniería social** al titular para completar una transacción creyendo que es legítima (ej. estafas de ayuda o beneficiarios falsos). |

---

## 3. Códigos de Fraude de Mastercard

Lista de códigos de razón de fraude definidos por Mastercard:

| Código | Nombre de la Categoría | Descripción Técnica |
| :--- | :--- | :--- |
| **0** | Card reported lost | Transacción no autorizada realizada con una tarjeta reportada como **perdida** por el titular. |
| **1** | Card reported stolen | Transacción no autorizada realizada con una tarjeta reportada como **robada** por el titular. |
| **2** | Never received issue | Transacción no autorizada con una tarjeta **interceptada** antes de llegar al titular legítimo. |
| **3** | Fraudulent application | Pago realizado con una tarjeta emitida mediante una **solicitud fraudulenta o falsa identidad**. |
| **4** | Counterfeit card fraud | Pago fraudulento utilizando una tarjeta **falsificada, clonada o alterada**. |
| **5** | Account takeover fraud | Fraude por **toma de control de cuenta (ATO)** o uso no autorizado de credenciales en billeteras digitales. |
| **6** | Card not present fraud | Uso no autorizado de la información de la tarjeta en transacciones donde la tarjeta no está físicamente presente (e-commerce). |
| **7** | Multiple imprint fraud | Transacciones adicionales no autorizadas realizadas por el comercio tras un cobro legítimo en punto de venta (POS). |
| **51** | Acquirer fraud | **Colusión** entre un titular de tarjeta y un comercio bajo programas de fraude adquirente. |
| **55** | Modification of payment order | Transacciones no autorizadas derivadas de la pérdida, robo o mal uso de datos de pago o tarjetas. |
| **56** | Manipulation of cardholder | Transacción completada por el pagador tras ser **manipulado por un estafador** (ingeniería social). |

---

## 4. Visualización de Códigos en la Plataforma Hub

Para consultar las notificaciones de fraude y sus códigos asociados dentro de la plataforma de Solidgate:

1. Ingrese al panel **Solidgate Hub**.
2. Diríjase a **Risk management** > **Fraud notifications**.
3. Ubique la notificación de fraude correspondiente.
4. En la columna **Reason code**, coloque el cursor sobre el código para desplegar la descripción detallada del motivo.

---

## 5. Ejemplo de Estructura JSON para Notificaciones de Fraude

```json
{
  "id": "fn_9a8b7c6d5e_2025",
  "order_id": "ORD-2025-99812",
  "card_network": "VISA",
  "fraud_code": "B",
  "fraud_reason": "Account or credentials takeover",
  "amount": 9900,
  "currency": "USD",
  "notification_date": "2025-08-14 10:15:00",
  "status": "NOTIFIABLE_ONLY",
  "disputable": false
}
```
