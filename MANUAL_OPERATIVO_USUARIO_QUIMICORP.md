# MANUAL DE OPERACIÓN ESTÁNDAR Y POLÍTICAS DE CUMPLIMIENTO CORPORATIVO
## ERP INDUSTRIAL QUIMICORP PERÚ S.A.C.
**Dirigido a:** Área de Asistencia Administrativa, Producción, Almacén y Control de Calidad  
**Aprobado por:** Gerencia General & Dirección de Operaciones  
**Versión de Documento:** 2.4 — Edición Operativa de Usuario  
**Carácter:** Normativo, Obligatorio y de Cumplimiento Contractual  

---

## 1. INTRODUCCIÓN Y MARCO DE CUMPLIMIENTO CORPORATIVO

El presente manual establece las normas operativas, principios de integridad de datos y directivas de control interno que rigen el uso del software empresarial de **QUIMICORP PERÚ S.A.C.**

El ERP de Quimicorp no es un procesador de textos ni una hoja de cálculo abierta donde se escribe libremente sin consecuencias; es un **sistema industrial metrológico y contable en tiempo real**. Cada información ingresada alimenta de forma inmediata los costos de fabricación, los balances de stock en almacén, las compras a distribuidores y las declaraciones tributarias ante SUNAT.

Por lo tanto, la exactitud en el llenado de información es una **responsabilidad laboral directa** de cada usuario con acceso al sistema.

---

## 2. ARQUITECTURA DE DATOS PARA EL USUARIO: EL POR QUÉ DE LOS IDENTIFICADORES (ID) Y LA ORTOGRAFÍA

Una de las quejas o confusiones más recurrentes en el área operativa es: *"El sistema no reconoce mi fórmula"* o *"El sistema no encuentra el químico que quiero cotizar"*. A continuación se explica con total claridad la causa raíz de este fenómeno.

### 2.1. ¿Por qué todo insumo, cliente y fórmula debe tener un ID Legítimo?

En el mundo físico, los seres humanos nos identificamos de forma legal e inequívoca mediante un número de DNI. Dos personas pueden llamarse "Carlos Mendoza", pero ante el Estado, sus DNIs son únicos y jamás se confunden.

En el ERP de Quimicorp ocurre exactamente lo mismo:
1. **Identidad Digital Única (ID):** Cada materia prima (ej. *Texapon 70%*, *Soda Cáustica*, *Fragancia Tutti Frutti*) tiene asignado en la base de datos un **código digital único (ID)**.
2. **Relación Inquebrantable:** Cuando Producción formula un lote o Administración emite una Orden de Compra, el sistema no enlaza palabras sueltas; **enlaza el ID legítimo del catálogo**.
3. **Cálculo de Costos y Stock:** Gracias a ese ID, el sistema sabe exactamente cuántos kilos quedan en el tanque, cuánto costó el gramo al comprarlo y cómo descontarlo en el Kardex al fabricar.

### 2.2. La Discordancia Léxica: Nombre Químico Oficial vs. Jergas o Apodos

El software **rechaza categóricamente o no encuentra los registros** cuando el operador comete **errores ortográficos o utiliza jergas coloquiales**.

#### Ejemplos de Discordancia Provocada por el Usuario:

| Lo que está registrado formalmente en el Catálogo | Lo que el operador intenta escribir en el sistema | Resultado en el ERP | Consecuencia en Planta |
| :--- | :--- | :--- | :--- |
| **SODA CÁUSTICA ESCAMAS 99%** | *"soda"*, *"la cáustica"*, *"sosa"* | ❌ **No encontrado** | No se puede cotizar ni formular. El usuario cree falsamente que el sistema falló. |
| **FRAGANCIA TUTTI FRUTTI** | *"tuti fruti"*, *"tutifrutti"*, *"fruta dulce"* | ❌ **No encontrado** | Descuadre de inventario y bloqueo de la orden. |
| **TEXAPON N70 (LAURIL ÉTER SULFATO)** | *"jabon liquido base"*, *"texapon 70"*, *"el espumante"* | ❌ **No encontrado** | Alerta en el reactor: insumo inexistente. |
| **ÁCIDO SULFÓNICO LINEAL 90%** | *"sulfonico"*, *"acido sulf"* | ❌ **No encontrado** | Error en hoja de pesaje y QA. |

> [!CAUTION]
> **El sistema NO lee el pensamiento del usuario.** Si el catálogo maestro tiene registrado el insumo con su nombre oficial y el operador escribe un apodo o comete faltas de ortografía (omisión de letras, errores tipográficos o nombres callejeros), el motor de búsqueda no encontrará el ID correspondiente. Esto no es un error informático; es una **negligencia en la entrada de datos**.

### 2.3. La Regla de Oro: "Registro Único en Catálogo" y Selección Asistida

Para evitar duplicidades, caos contable y compras fantasmas:
1. **Registro por Única Vez:** Cada insumo químico se crea una sola vez en el catálogo corporativo con su denominación comercial estándar y especificación de pureza.
2. **Uso Obligatorio del Buscador Inteligente:** Los formularios de Órdenes de Compra, Cotizaciones y Fórmulas cuentan con **desplegables inteligentes**. El usuario debe escribir las primeras letras del nombre oficial y **hacer clic en el insumo listado**, asegurando así que se capture su ID legítimo.
3. **Prohibición de Inventar Textos Libres:** Si un insumo no aparece en el buscador, no se debe forzar una escritura libre con apodos. El procedimiento correcto es solicitar al Administrador o a Gerencia el alta oficial del insumo en el catálogo maestro.

---

## 3. SISTEMA DE MONITOREO EN TIEMPO REAL: CERO EXCUSAS DE "EL SISTEMA NO FUNCIONA"

Es común en ambientes de oficina y planta que, ante un error propio de digitación o una distracción, se recurra a la afirmación: *"El sistema está fallando, no me deja guardar"*. En Quimicorp, esta excusa carece de validez gracias a nuestra infraestructura de monitoreo empresarial.

### 3.1. Telemetría 24/7 y Monitoreo Activo (Sentry & Logs Inmutables)

El ERP Quimicorp cuenta con un sistema de auditoría telemétrica avanzada (**Sentry Enterprise** y registro transaccional en PostgreSQL):

1. **Grabación de Eventos en Milisegundos:** Cada clic, cada tecla pulsada, cada intento de envío de formulario y cada respuesta del servidor queda registrada con:
   * **Nombre y correo del usuario** autenticado.
   * **Dirección IP** y dispositivo desde donde se conectó.
   * **Fecha, hora exacta, minutos y segundos**.
   * **Datos exactos que el usuario escribió** en cada casilla antes de presionar el botón.
2. **Detección Inmediata de Negligencia:** Cuando un usuario afirma que *"el sistema no funcionó"*, el equipo de Sistemas y Gerencia revisa la telemetría en segundos. El registro revela con precisión matemática:
   * *"El usuario ingresó cantidad '1' con unidad 'GR' a un precio de S/ 95.00 para 1 Kilo de fragancia."*
   * *"El usuario intentó guardar un proveedor dejando el campo RUC vacío."*
   * *"El usuario intentó registrar una fórmula escribiendo un nombre no catalogado."*

### 3.2. La Diferencia entre una "Falla de Sistema" y una "Validación de Seguridad"

* **Una Falla de Sistema (Bug / Caída):** Ocurre cuando el servidor se desconecta y la pantalla muestra un error crítico `500 Server Error`. Esto genera una alarma técnica inmediata que Sistemas atiende en minutos.
* **Una Validación de Seguridad (Rechazo Correcto):** Ocurre cuando el sistema muestra un mensaje de alerta en amarillo o rojo (por ejemplo: *"Has alcanzado el límite de 2 ediciones permitidas"*, *"La cantidad debe ser mayor a cero"*, *"Unidad en Gramos pero precio de Kilo"*).
  * En este caso, **el sistema funcionó de manera PERFECTA**, porque impidió que el descuido de un colaborador destruyera la contabilidad de la empresa o generara pérdidas económicas en almacén.

---

## 4. POLÍTICAS DE SEGURIDAD Y PREVENCIÓN DE FRAUDE (NIVEL CONTRACTUAL)

Por qué los roles de **Asistente Administrativo** y **Operario de Producción** tienen accesos estrictamente delimitados y **prohibición total de manipular valores financieros o realizar eliminaciones masivas**.

### 4.1. El Principio de Segregación de Funciones (Segregation of Duties - SoD)

En auditoría corporativa y normatividad tributaria internacional, ninguna persona que elabore o digite una orden debe tener la facultad de aprobar pagos, alterar precios base o modificar cuentas bancarias libremente. Permitir esto abre la puerta a:
1. **Fraudes por Alteración de Precios:** Un asistente podría pactar con un proveedor corrupto ingresar insumos a precios inflados o registrar facturas por insumos que nunca llegaron.
2. **Desvío de Fondos:** Modificar el número de cuenta bancaria o RUC de un proveedor justo antes de la transferencia.
3. **Destrucción de Evidencia:** Eliminar u ocultar órdenes de compra o fórmulas erróneas para que Gerencia no detecte pérdidas operativas.

### 4.2. El Límite Estricto de 2 Ediciones para Asistentes en Órdenes de Compra

El sistema aplica de manera inquebrantable la siguiente regla de negocio:

* **Asistente Administrativo / Almacén:** Puede editar una orden de compra pendiente un **MÁXIMO DE 2 VECES**.
  * *1ra Edición:* Para corregir un error menor de tipeo o ajustar la fecha estimada de entrega.
  * *2da Edición:* Oportunidad final de subsanación.
  * *3er Intento:* **BLOQUEO AUTOMÁTICO.** El sistema rechaza la edición con el mensaje:
    > *"Has alcanzado el límite máximo de 2 ediciones permitidas para tu rol en esta Orden de Compra. Comunícate con Gerencia o Administración para autorizar cambios adicionales."*
* **Gerencia General / Dirección:** Tiene **ediciones ilimitadas** para auditar, autorizar y rectificar cualquier operación que requiera revisión superior.

> [!IMPORTANT]
> **Protección Legal para el Colaborador:** Estas restricciones no son solo para proteger el patrimonio de Quimicorp; **protegen al propio trabajador**. Al estar limitado por sistema, el asistente queda legalmente exento de sospechas de colusión, manipulación contable o fraude ante revisiones de auditoría interna o fiscalizaciones de SUNAT.

---

## 5. GUÍA PRÁCTICA PASO A PASO: ÁREA DE ASISTENCIA ADMINISTRATIVA

### 5.1. Emisión de Órdenes de Compra (Módulo: `/administracion/ordenes`)

1. **Paso 1: Búsqueda del Proveedor:**
   * Utilizar el buscador de proveedores escribiendo la Razón Social o el RUC de 11 dígitos.
   * Seleccionar el proveedor de la lista desplegable. Esto carga de inmediato su condición de pago y su homologación.
2. **Paso 2: Selección de Insumos (Materia Prima):**
   * Escribir el nombre oficial en el buscador de insumos.
   * Seleccionar el insumo listado. **Nunca inventar nombres abreviados ni omitir detalles de catálogo.**
3. **Paso 3: Alerta Metrológica Crítica (KILOGRAMOS vs. GRAMOS):**
   * **CUIDADO EXTREMO:** El sistema alertará en color ámbar si seleccionas `GR` (Gramos) y colocas una cantidad baja (ej. 1 a 10) con un costo elevado.
   * *Caso Real de Error:* Colocar `1 GR` a `S/ 95.00`. Para el sistema, un gramo vale S/ 95, lo que significaría que el Kilo costaría **S/ 95,000.00**. Esto paraliza el Kardex.
   * *Forma Correcta:* Si se compra un kilo, la unidad DEBE ser `KG` y la cantidad `1`. Si se compra a granel fraccionado, verificar si la presentación es `GR`, `KG`, `LT` o `GAL`.
4. **Paso 4: Verificación del Total Estimado:**
   * Revisar el cuadro verde del Total Estimado de la Orden antes de presionar *"Emitir Orden de Compra"*.
   * Si el monto total no coincide al centavo con la proforma física o digital del proveedor, **no emitas la orden**. Revisa la cantidad y el precio unitario pactado.

### 5.2. Corrección de Órdenes Pendientes

* Si detectas un error tras la emisión, pulsa el botón **"Editar OC"**.
* El sistema te indicará cuántas ediciones te quedan disponibles (`Edición 1 de 2`).
* Corrige la unidad o la cantidad, redacta el motivo de la corrección en el campo de notas y guarda los cambios.
* Recuerda que una vez que Almacén presione **"Ingresar a Kardex"**, la orden pasa a estado `RECIBIDO` y **nadie en la empresa podrá editarla**, ya que el stock real habrá ingresado a la contabilidad de planta.

---

## 6. GUÍA PRÁCTICA PASO A PASO: ÁREA DE PRODUCCIÓN & ALMACÉN

### 6.1. Sistema Maestro de Fórmulas y Variantes de Clientes

1. **Inmutabilidad de la Receta Industrial:**
   * Las fórmulas maestras son propiedad intelectual y técnica de Quimicorp. Los porcentajes de materias primas deben sumar con exactitud matemática el **100.00%** o el peso exacto del Batch en Kilogramos.
   * Los operadores de reactor no deben alterar los componentes de una fórmula sin la orden de producción formalmente emitida y aprobada por QA.
2. **Dosificación y Balanzas en Planta:**
   * El pesaje en planta opera con una precisión de hasta 4 decimales ($0.0001\text{ kg}$).
   * Cualquier ajuste fino (adición extra de fragancia, colorante, espesante o neutralizante para corregir pH o viscosidad) debe ser registrado en el módulo de **Ajuste Fino**, asociando el insumo con su ID de catálogo para que el Kardex descuente la merma correspondiente.

### 6.2. Recepción de Mercadería y Control de Stock

1. **Cotejo Físico vs. Digital:**
   * Al recibir la materia prima en puerta de fábrica, el encargado de almacén debe contrastar la Guía de Remisión física del transportista contra la Orden de Compra en pantalla.
   * Si la orden dice `100 KG` pero el proveedor trajo `90 KG`, **no se debe recibir la orden completa**. Se debe coordinar con Administración para emitir la corrección antes de alimentar el Kardex.
2. **Ingreso a Kardex:**
   * Al pulsar *"Ingresar a Kardex"*, el insumo se convierte automáticamente en stock disponible para fabricación en los tanques y reactores.

### 6.3. Asistencia Biométrica y Asignación de Roles

1. **Marcación con Huella Digital:**
   * Las marcaciones en el dispositivo ZKTeco son transmitidas al instante mediante un servicio automatizado.
   * Cada trabajador debe marcar: Ingreso, Salida a Refrigerio, Retorno de Refrigerio y Salida Final.
   * El sistema calcula de forma estricta los minutos de tardanza en base a la tolerancia reglamentaria de 15 minutos de su turno.
2. **Asignación Exclusiva de Roles por Gerencia General:**
   * Ningún jefe de planta ni asistente administrativo tiene privilegios para modificar su propio cargo, su turno ni sus roles en el sistema.
   * Únicamente la **Gerencia General** cuenta con los botones de acción para asignar si un colaborador es `OPERARIO`, `SUPERVISOR DE PLANTA` o reasignar sus facultades en el ERP.

---

## 7. DECÁLOGO DE BUENAS PRÁCTICAS Y RESOLUCIÓN DE INCIDENCIAS

### 7.1. Matriz de Auditoría: Lo que el Usuario dice vs. Lo que Registra el Sistema

| Lo que el colaborador manifiesta | Lo que realmente ocurrió y registra Sentry / Base de Datos | Solución Operativa Inmediata |
| :--- | :--- | :--- |
| *"El sistema no me deja guardar la orden de compra."* | El usuario dejó el campo de precio unitario en blanco o ingresó texto en una casilla numérica. | Colocar números válidos mayores a cero y verificar que no existan campos obligatorios vacíos. |
| *"El sistema borró mi fórmula o no la reconoce."* | El usuario escribió el nombre con faltas ortográficas o inventó una sigla que no existe en el catálogo. | Buscar el insumo en el selector escribiendo sus primeras 3 letras y haciendo clic en el resultado del catálogo. |
| *"El botón de guardar se bloqueó y ya no puedo editar."* | El colaborador ya utilizó sus **2 oportunidades de edición permitidas** para su rol. | Solicitar formalmente a Gerencia General o Administración Superior la revisión y modificación autorizada. |
| *"Se descuadró el costo del lote en miles de soles."* | El operador colocó unidad `GR` (Gramos) en vez de `KG` (Kilos) al comprar el insumo a granel. | Revisar siempre la unidad de medida antes de emitir cualquier documento. Si cuesta S/ 90 el kilo, la unidad DEBE ser `KG`. |
| *"La huella no marcó mi hora de ingreso."* | El colaborador colocó el dedo húmedo o fuera del sensor, o no esperó la confirmación auditiva del equipo biométrico. | Marcar con el dedo seco y centrado. Si persiste, el Administrador debe verificar la conectividad de red del equipo ZKTeco. |

---

### 7.2. Lista de Chequeo Obligatoria (Checklist de 5 Pasos antes de Emitir)

Antes de hacer clic en **"Emitir Orden de Compra"**, **"Crear Lote"** o **"Guardar Fórmula"**, todo colaborador debe ejecutar mentalmente este control:

1. [ ] **¿Seleccioné el insumo desde la lista desplegable?** (Verifiqué que no sea un texto inventado).
2. [ ] **¿La unidad de medida es la correcta?** (Confirmé si es Kilo `KG`, Gramo `GR`, Litro `LT`, Galón `GAL` o Envase `UND`).
3. [ ] **¿El precio unitario corresponde a la unidad seleccionada?** (Evitar pagar precio de Kilo por un Gramo).
4. [ ] **¿El total estimado en pantalla coincide exactamente con la proforma física?**
5. [ ] **¿El motivo o las observaciones son claras y profesionales?** (Evitar frases coloquiales; utilizar lenguaje técnico y comercial).

---

## 8. DISPOSICIONES FINALES Y SANCIONES

1. **Carácter Vinculante:** El desconocimiento de este manual no exime de responsabilidad laboral ni administrativa a ningún miembro de la organización.
2. **Reincidencia en Negligencias de Tipeo:** La reiteración de errores graves en unidades (ej. confundir Gramos con Kilos) o la insistencia injustificada en atribuir al software fallas causadas por digitación deficiente será tipificada como **falta de diligencia operativa**, elevándose el informe correspondiente a Recursos Humanos con la evidencia telemétrica de Sentry.
3. **Auditoría Continua:** Gerencia General realiza inspecciones periódicas de los registros de modificaciones. Cualquier intento deliberado de evadir los límites de edición o de ingresar datos fraudulentos dará lugar a las acciones contractuales y legales pertinentes.

---
*QUIMICORP PERÚ S.A.C. — Dirección de Operaciones & Tecnología de la Información*
