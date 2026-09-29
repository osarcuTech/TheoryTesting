# Guía de Códigos de Razón de Contracargos (Chargeback Reason Codes) — Solidgate

Este documento proporciona una referencia técnica y operacional sobre los **Códigos de Razón de Contracargos** (*Chargeback Reason Codes*) de las principales redes de tarjetas de pago (Visa, Mastercard, American Express, Discover, Diners Club, JCB, RuPay, ELO y UnionPay) documentados en la plataforma **Solidgate**. Incluye la clasificación de disputas, causas comunes, plazos de respuesta y estrategias preventivas.

---

## 1. Conceptos Fundamentales de Contracargos

### ¿Qué es un Código de Razón de Contracargo?
Un código de razón es un identificador alfanumérico (generalmente de 2 a 4 caracteres) emitido por el banco emisor (*issuing bank*) cuando un tarjetahabiente inicia una disputa sobre un cobro con tarjeta de crédito o débito [10]. Los bancos utilizan estos códigos para estandarizar la justificación del cliente en una categoría formal que el comercio (*merchant*) pueda entender y responder [10].

### Elementos Clave de la Disputa:
1. **Derecho de Representación (*Representment*):** Los comercios tienen derecho a refutar un contracargo presentando evidencias documentales sólidas que demuestren la validez de la transacción [11].
2. **Dinámica de Códigos:** El código de razón inicial puede cambiar durante el proceso de disputa si se presenta evidencia adicional [11].
3. **Plazos Límite (*Time Limits*):** Las redes imponen límites temporales para que el cliente inicie el contracargo (habitualmente entre **60 y 120 días** desde la fecha de la transacción) [12] y plazos estrictos para que el comercio responda (típicamente **20 días** calendario para el adquirente/comercio) [21, 26, 48, 87].

---

## 2. Categorías Universales de Disputa y Mejores Prácticas

La gran mayoría de las disputas se agrupan en cuatro categorías principales [13]:

### A. Fraude (*Fraud*)
- **Causas comunes:** Transacciones no autorizadas con tarjetas robadas, clonadas o datos de cuenta comprometidos; descriptores de facturación confusos [14, 15, 24].
- **Medidas preventivas:**
  - Implementar autenticación fuerte como **3D Secure** (3DS) [14].
  - Utilizar verificación de dirección (**AVS**) y código de seguridad (**CVV/CVC**) [14].
  - Utilizar terminales compatibles con **EMV** (Chip y PIN / Chip y Firma) para ventas físicas [14].
  - Mantener un **descriptor de cobro claro** con nombre del negocio y teléfono o sitio web [15].
  - Monitorear el índice de fraude para no sobrepasar los umbrales de los programas de monitoreo de las redes (ej. VAMP de Visa) [15, 25].

### B. Autorización (*Authorization*)
- **Causas comunes:** Procesar transacciones sin solicitar autorización, ignorar o forzar cobros tras una respuesta de denegación (*Decline*), o alterar el monto autorizado sin consentimiento [16, 27].
- **Medidas preventivas:**
  - Solicitar autorización para el 100% de las operaciones [16].
  - **Nunca forzar** una transacción que fue rechazada [16].
  - Liquidar (*settle*) las transacciones dentro de los plazos normativos (7 a 30 días) [16, 58].

### C. Errores de Procesamiento (*Processing Errors*)
- **Causas comunes:** Cobros duplicados por envíos de lotes repetidos, moneda o tipo de cambio incorrecto, errores de cálculo manual o presentación tardía (*Late Presentment*) [18, 30, 34].
- **Medidas preventivas:**
  - Enviar lotes de transacciones una sola vez [35].
  - Anular o reembolsar de inmediato cualquier cobro duplicado o cuando el cliente cambie de método de pago [18, 35].
  - Confirmar códigos de moneda antes de enviar la liquidación [18].

### D. Disputas de Clientes (*Customer Disputes*)
- **Causas comunes:** Producto o servicio no recibido, mercancía defectuosa o no coincidente con la descripción, suscripciones recurrentes cobradas tras solicitud de cancelación, créditos prometidos no aplicados [19, 38, 39, 41].
- **Medidas preventivas:**
  - Exponer claramente las políticas de devolución y cancelación antes del pago [19].
  - **No cobrar antes del envío** de la mercancía [19].
  - Conservar pruebas de entrega, facturas y registros de comunicación con el cliente [19].

---

## 3. Catálogo de Códigos de Razón por Red de Tarjetas

### 3.1. Visa
Visa clasifica sus códigos mediante una estructura numérica de dos dígitos principales + punto + dígito secundario [20]:

| Categoría | Código | Nombre / Descripción | Plazo Cliente | Plazo Comercio |
| :--- | :--- | :--- | :--- | :--- |
| **10. Fraude** [20] | **10.1** | EMV Liability Shift Counterfeit Fraud (Falsificación por chip no leído) [21] | 120 días [21] | 20 días [21] |
| | **10.2** | EMV Liability Shift Non-Counterfeit Fraud (Falta de verificación PIN) [22] | 120 días [21] | 20 días [21] |
| | **10.3** | Fraud – Card-Present Environment (Transacción manual/unattended en presencia) [23] | 120 días [21] | 20 días [21] |
| | **10.4** | Fraud – Card-Absent Environment (Transacción no autorizada en e-commerce/MOTO) [24] | 120 días [21] | 20 días [21] |
| | **10.5** | Visa Fraud Monitoring Program / VAMP (Notificación de programa de riesgo) [25] | N/A | 20 días |
| **11. Autorización** [20] | **11.1** | Card Recovery Bulletin (Procesamiento sobre cuenta en boletín) [26] | 75 días [26] | 20 días [26] |
| | **11.2** | Declined Authorization (Comercio completó transacción rechazada) [27] | 75 días [26] | 20 días [26] |
| | **11.3** | No Authorization (Falta de autorización previa o propina agregada sin re-autorizar) [28] | 75 días [26] | 20 días [26] |
| **12. Errores** [20] | **12.1** | Late Presentment (Presentación fuera del plazo permitido) [29] | 120 días [29] | 20 días [29] |
| | **12.2** | Incorrect Transaction Code (Error en código o cobro procesado como abono) [31] | 120 días [29] | 20 días [29] |
| | **12.3** | Incorrect Currency (Error en moneda o conversión DCC sin consentimiento) [31] | 120 días [29] | 20 días [29] |
| | **12.4** | Incorrect Account Number (Número de cuenta erróneo o ajuste extemporáneo) [32] | 120 días [29] | 20 días [29] |
| | **12.5** | Incorrect Amount (Monto cobrado difiere del acordado) [33] | 120 días [29] | 20 días [29] |
| | **12.6.1** | Duplicate Processing (Procesamiento duplicado por lote o sistema) [34] | 120 días [29] | 20 días [29] |
| | **12.6.2** | Paid By Other Means (Cobro duplicado cuando se pagó por otro medio) [35] | 120 días [29] | 20 días [29] |
| | **12.7** | Invalid Data (Datos requeridos erróneos en solicitud de autorización) [36] | 75 días [29] | 20 días [29] |
| **13. Disputas** [20] | **13.1** | Merchandise/Services Not Received (Mercancía o servicio no entregado) [37] | 120 días [37] | 20 días [37] |
| | **13.2** | Cancelled Recurring (Cobro recurrente posterior a cancelación) [38] | 120 días [37] | 20 días [37] |
| | **13.3** | Not as Described or Defective (Producto defectuoso o diferente) [39] | 120 días [37] | 20 días [37] |
| | **13.4** | Counterfeit Merchandise (Mercancía identificada como falsa) [40] | 120 días [37] | 20 días [37] |
| | **13.5** | Misrepresentation (Términos de venta tergiversados o falsos) [40] | 120 días [37] | 20 días [37] |
| | **13.6** | Credit Not Processed (Reembolso prometido/autorizado no aplicado) [41] | 120 días [37] | 20 días [37] |
| | **13.7** | Cancelled Merchandise/Services (Mercancía devuelta sin reembolso) [43] | 120 días [37] | 20 días [37] |
| | **13.8** | Original Credit Transaction Not Accepted (OCT rechazada por emisor/cliente) [45] | 120 días [37] | 20 días [37] |
| | **13.9** | Non-Receipt of Cash or Load Transaction Value (Fallo en cajero ATM o carga) [46] | 120 días [37] | 20 días [37] |

---

### 3.2. Mastercard
Mastercard utiliza códigos numéricos de 4 dígitos (con prefijo `48` para contracargos iniciales) [47]:

- **Fraude:**
  - `4837`: *No Cardholder Authorization* (Sin autorización del titular) [48].
  - `4840`: *Fraudulent Processing of Transactions* (Transacciones fraudulentas múltiples) [49].
  - `4849`: *Questionable Merchant Activity* (Comercio en boletín de seguridad GMAP/SAFE) [49].
  - `4863`: *Cardholder Does Not Recognize - Potential Fraud* (Descriptor no reconocido) [50].
  - `4870`: *Chip Liability Shift* (Transacción counterfeit en terminal sin EMV) [51].
  - `4871`: *Chip/PIN Liability Shift* (Transacción sin soporte de PIN) [52].

- **Autorización:**
  - `4807`: *Warning Bulletin File* (En consolidación con 4808) [54].
  - `4808`: *Authorization-Related Chargeback* (Falta de autorización, expiración de plazo de 7 a 30 días, múltiples reintentos o fallos en terminal CAT 3) [55, 57, 58, 60].
  - `4812`: *Account Number Not On File* (Número de cuenta inexistente) [61].

- **Error en Punto de Interacción (*Point of Interaction Error*):**
  - `4834`: *Point-of-Interaction Error* (Procesamiento duplicado, monto diferente, presentación tardía >30 días, conversión dinámica de moneda sin consentimiento, fallos ATM, cargos por daño sin aprobación) [63, 64, 65, 66, 68, 70].
  - `4850`: *Installment Billing Dispute* (Errores en cobros a cuotas) [71].
  - `4999`: *Domestic Chargeback Dispute* (Disputas domésticas específicas en Europa) [72].

- **Disputas de Clientes:**
  - `4841`: *Cancelled Recurring or Digital Goods* (Cobro recurrente cancelado) [74].
  - `4853`: *Cardholder Dispute* (Código sombrilla que abarca: bienes/servicios no provistos, cargos adicionales/no-show, crédito no procesado, mercancía defectuosa/diferente, bienes digitales <=$25 sin controles, mercancía falsa o compra no completada) [75, 76, 78, 79, 80, 81, 83, 84].
  - `4854`: *Not Elsewhere Classified* (Reclamos no clasificados en EE.UU.) [85].

---

### 3.3. American Express (Amex)
American Express utiliza una letra según la categoría seguida de dos dígitos [86]:

- **F - Fraude:** `FR2` (Fraud Full Recourse) [87], `FR4` (Immediate Chargeback Program) [89], `FR6` (Partial Immediate Chargeback) [90], `F10` (Missing Imprint) [91], `F14` (Missing Signature) [93], `F24` (No Cardmember Authorization) [94], `F29` (Card Not Present Fraud) [95], `F30` (EMV Counterfeit) [97], `F31` (EMV Lost/Stolen) [98].
- **A - Autorización:** `A01` (Charge Amount Exceeds Authorization) [100], `A02` (No Valid Authorization) [101], `A08` (Authorization Approval Expired) [103].
- **P - Errores de Procesamiento:** `P01` (Unassigned Card Number) [105], `P03` (Credit Processed as Charge) [106], `P04` (Charge Processed as Credit) [107], `P05` (Incorrect Charge Amount) [108], `P07` (Late Submission >180 días) [110], `P08` (Duplicate Charge) [111], `P22` (Non-Matching Card Number) [112], `P23` (Currency Discrepancy) [113].
- **M / R - Inconsultos y Documentación:** `M01` (Chargeback Authorization) [115], `M10` (Vehicle Rental - Capital Damages) [116], `M49` (Vehicle Rental - Theft/Loss) [117], `R03` (Insufficient Reply) [118], `R13` (No Reply within 20 days) [119].
- **C - Disputas de Clientes:** `C02` (Credit Not Processed) [120], `C04` (Goods/Services Returned/Refused) [121], `C05` (Goods/Services Cancelled) [122], `C08` (Goods/Services Not Received) [123], `C14` (Paid by Other Means) [124], `C18` (No Show or Card Deposit Cancelled) [125], `C28` (Cancelled Recurring Billing) [126], `C31` (Goods/Services Not as Described) [127], `C32` (Goods/Services Damaged or Defective) [129].

---

### 3.4. Discover
Discover utiliza códigos alfabéticos (ej. `UA01`, `NA`, `LP`) o equivalentes numéricos (ej. `7010`) [130]:
- **Fraude:** `UA01`/`7010` (Card Present Fraud) [131], `UA02`/`7030` (Card Not Present Fraud) [132], `UA05`/`4866` (Chip Counterfeit) [133], `UA06`/`4867` (Chip and PIN) [134], `UA10`/`UA11` (Petición de recibo por fraude) [136, 137].
- **Autorización:** `AT`/`4863` (Authorization Noncompliance) [138], `DA` (Declined Authorization) [139], `EX` (Expired Card) [140], `NA` (No Authorization) [141].
- **Errores y Otros:** `IN`/`4753` (Invalid Card Number) [142], `LP`/`4542` (Late Presentment) [143], `NC` (Not Classified) [145].
- **Disputas de Clientes:** `05`/`4762` (Good Faith Investigation) [147], `AA`/`4752` (Does Not Recognize) [148], `AP`/`4541` (Recurring Payments) [150], `AW`/`4586` (Altered Amount) [151], `CD`/`4550` (Credit Posted as Card Sale) [152], `DP`/`4534` (Duplicate Processing) [153], `IC`/`4502` (Illegible Sales Data) [155], `NF`/`4864` (Non-Receipt Cash ATM) [156], `PM`/`4865` (Paid by Other Means) [157], `RG`/`4755` (Non-Receipt Goods/Services) [158], `RM`/`4553` (Disputes Quality) [159], `RN2`/`8002` (Credit Not Processed) [160], `DC` (Dispute Compliance) [161].

---

### 3.5. Resumen de Redes Adicionales (Diners, JCB, RuPay, ELO, UnionPay)

| Red de Tarjeta | Código Destacado | Tipo de Disputa | Descripción Breve |
| :--- | :--- | :--- | :--- |
| **Diners Club** [162] | `C41` / `C42` | Fraude | Fraude en ambiente presente (`C41`) o no presente (`C42`) [163]. |
| | `B25` / `B27` | Errores | Cargo duplicado (`B25`) o moneda incorrecta (`B27`) [167, 168]. |
| | `D62` / `D69` | Disputa | No recepción de bienes (`D62`) o recurrencia cancelada (`D69`) [169, 170]. |
| **JCB** [171] | `526` / `546` | Fraude | Sin firma (`526`) o compra no autorizada (`546`) [172, 174]. |
| | `522` / `512` | Aut. / Error | Procesado tras denegación (`522`) o procesamiento duplicado (`512`) [176, 179]. |
| | `502` / `544` | Disputa | Mercancía defectuosa/no llegada (`502`) o recurrencia cancelada (`544`) [182, 184]. |
| **RuPay** [185] | `1142` | Fraude | Fraude en transacciones sin tarjeta presente (CNP) [186]. |
| | `1084` / `1061` | Error / Disputa| Procesamiento duplicado (`1084`) o crédito no aplicado (`1061`) [192]. |
| **ELO** [200] | `71` / `83` | Fraude | Sin autorización obtenida (`71`) o fraude en tarjeta ausente (`83`) [201]. |
| | `82` / `53` | Error / Disputa| Procesamiento duplicado (`82`) o mercancía defectuosa (`53`) [204, 207]. |
| **UnionPay** [207] | `4515` / `4562` | Fraude | Titular niega la transacción (`4515`) o tarjeta falsificada (`4562`) [208, 209]. |
| | `4512` / `4502` | Error / Disputa| Procesamiento duplicado (`4512`) o bienes no recibidos (`4502`) [211, 214]. |

---

## 4. Estrategias de Respuesta y Evidencias de Representación (*Representment*)

Para defender con éxito un contracargo, el comercio debe enviar un expediente de disputa en un plazo menor a **20 días calendario** [21, 26, 48, 87]. A continuación se resumen las pruebas requeridas según el tipo de reclamo:

1. **En reclamos por Fraude e-commerce (CNP):**
   - Comprobante de autenticación **3D Secure** (cavv/eci).
   - Coincidencia de **AVS** (dirección de facturación) y **CVV**.
   - Prueba de entrega firmada en la dirección de facturación verificada [24, 96, 132].
2. **En reclamos por Bienes/Servicios No Recibidos:**
   - Número de seguimiento de la empresa de transporte (*tracking number*) y confirmación de entrega (*proof of delivery*).
   - Aceptación expresa de los términos de envío y entrega por parte del cliente [38, 124, 158].
3. **En reclamos por Cancelación de Recurrencia:**
   - Logs del sistema que demuestren que el cobro ocurrió antes de la fecha/hora de solicitud de cancelación.
   - Evidencia de que el cliente no canceló dentro del plazo mínimo estipulado (ej. 15 días antes) en la política aceptada [44, 127, 151].
4. **En reclamos por Cobros Duplicados o Pagados por Otro Medio:**
   - Recibos separados que demuestren que corresponden a dos pedidos/servicios distintos solicitados por el cliente.
   - O bien, evidencia de que ya se había emitido un reembolso previo para corregir el duplicado [35, 70, 111, 154].

---
