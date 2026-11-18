# Prevensa · «Encuentra tu plan»: lógica y contenido

Especificación para desarrollo del bloque «Encuentra tu plan» de la home. La referencia visual es el prototipo (`proyectos/prevensa/index.html`, sección `#plan`).

Los textos de los planes salen de la web actual (servicios › seguridad y salud laboral). Lo marcado **[confirmar]** está pendiente de validar con Prevensa antes de publicar.

---

## 1. Cómo funciona

El bloque tiene dos preguntas a la izquierda y una tarjeta de recomendación a la derecha. La tarjeta cambia **al momento**, cada vez que el usuario cambia una respuesta. No hay botón de «calcular» ni de enviar.

- Al cargar la página ya hay respuestas marcadas por defecto: **Pyme** y **Cuota mensual fija**. Así la tarjeta nunca sale vacía y muestra **All In**.
- La pregunta 2 solo tiene sentido para autónomos y pymes. Si el usuario elige *Gran empresa* o *Servicio propio o mancomunado*, la pregunta 2 se **desactiva**: se ve atenuada, no se puede pulsar y aparece una nota debajo. Al volver a *Autónomo/a* o *Pyme* se reactiva y conserva la opción que estuviera marcada.

### Pregunta 1 · ¿Cómo es tu empresa?

| Opción (texto visible) | Valor |
|---|---|
| Soy autónomo/a | `autonomo` |
| Pyme · hasta 249 personas | `pyme` (por defecto) |
| Gran empresa · 250 o más | `gran` |
| Ya tengo servicio de prevención propio o mancomunado | `propio` |

**[confirmar]** El corte entre pyme y gran empresa en 250 personas es la definición europea de pyme. Hay que confirmar con Prevensa si sus planes usan ese mismo umbral u otro.

### Pregunta 2 · ¿Cómo prefieres pagar?

| Opción (texto visible) | Valor |
|---|---|
| Cuota mensual fija | `mensual` (por defecto) |
| Pago anual | `anual` |

Texto de la nota cuando la pregunta está desactivada:

> Para este caso preparamos un presupuesto a medida, así que no hace falta elegir forma de pago.

---

## 2. Cuándo cambia la tarjeta (reglas)

Las reglas se evalúan en este orden y se aplica la primera que se cumpla:

| # | Si… | Tarjeta |
|---|---|---|
| 1 | Empresa = `gran` | **Plan Gran empresa** (sin importar la pregunta 2) |
| 2 | Empresa = `propio` | **Especialidades** (sin importar la pregunta 2) |
| 3 | Pago = `mensual` (autónomo o pyme) | **All In · Tarifa plana mensual** |
| 4 | Empresa = `autonomo` y pago = `anual` | **Plan Autónomos** |
| 5 | Empresa = `pyme` y pago = `anual` | **Plan Pymes** |

Tabla completa de combinaciones:

| | Cuota mensual fija | Pago anual |
|---|---|---|
| **Soy autónomo/a** | All In | Plan Autónomos |
| **Pyme** | All In | Plan Pymes |
| **Gran empresa** | Plan Gran empresa | Plan Gran empresa |
| **Servicio propio o mancomunado** | Especialidades | Especialidades |

Equivalente en código:

```js
function pickPlan(tipo, pago) {
  if (tipo === 'gran')   return 'gran-empresa';
  if (tipo === 'propio') return 'especialidades';
  if (pago === 'mensual') return 'all-in';
  return tipo === 'autonomo' ? 'autonomos' : 'pymes';
}
```

**[confirmar]**
- ¿All In está disponible para autónomos o solo para empresas con plantilla?
- ¿Gran empresa puede pagar con cuota mensual? Si es así, se quita la regla 1 de la desactivación y se decide qué tarjeta mostrar.
- El Plan Autónomos y el Plan Pymes, ¿se pagan de forma anual? El texto de Autónomos habla de «cobertura integral anual»; el de Pymes no dice nada.

**Soluciones de Gestión (Integra Prevención)** no sale como resultado, porque no depende del tamaño de la empresa ni de cómo paga. Es un complemento para cualquier plan, así que va como enlace fijo al pie de todas las tarjetas (ver punto 3).

---

## 3. Contenido de cada tarjeta

Todas las tarjetas tienen la misma estructura, en este orden:

1. Antetítulo fijo: **Te recomendamos**
2. Título del plan
3. Descripción (texto oficial de la web, adaptado al tuteo cuando hace falta)
4. Tres puntos clave (los he sacado de la descripción oficial; **[confirmar]** que Prevensa está de acuerdo o que los sustituye por los suyos)
5. Botón Lima: **Solicitar más información →**, que lleva a la petición de presupuesto con el plan ya indicado (ver punto 4)
6. Línea fija de complemento: *¿Quieres implicar en la prevención a toda tu plantilla?* **Conoce Integra Prevención →**

### All In · Tarifa plana mensual · `all-in`
- **Descripción:** Un servicio integral para tu empresa, sin sorpresas. Y págalo como quieras.
- **Puntos clave:**
  - Todo incluido en un único servicio
  - Una cuota fija al mes, sin imprevistos
  - Tú eliges cómo pagar

### Plan Autónomos · `autonomos`
- **Descripción:** Prevención ágil y ajustada en costes, con garantía de cumplimiento de tus obligaciones legales y una cobertura integral anual.
- **Puntos clave:**
  - Prevención ágil y ajustada en costes
  - Cumplimiento de tus obligaciones legales garantizado
  - Cobertura integral durante todo el año

### Plan Pymes · `pymes`
- **Descripción:** Un servicio adaptado a las necesidades de tu empresa, especializado y con experiencia.
- **Puntos clave:**
  - Adaptado a las necesidades de tu empresa
  - Equipo técnico especializado
  - 25 años de experiencia en prevención

### Plan Gran empresa · `gran-empresa`
- **Descripción:** Un servicio especializado y con dedicación exclusiva, un valor añadido en la gestión de seguridad y salud.
- **Puntos clave:**
  - Dedicación exclusiva a tu organización
  - Equipo especializado
  - Valor añadido en la gestión de seguridad y salud

### Especialidades · `especialidades`
- **Descripción:** Contrata solo las actividades que necesites para complementar el trabajo de tu servicio de prevención propio o mancomunado.
  - Texto original de la web: *«Posibilita la contratación de actividades aisladas complementando de esta manera la actividad desarrollada por servicios de prevención propios o mancomunados.»* Lo he pasado a tú y a un lenguaje más directo, como pide el briefing.
- **Puntos clave:**
  - Actividades preventivas sueltas, a la carta
  - Complementa tu servicio propio o mancomunado
  - Sin cambiar tu organización actual

### Complemento fijo · Integra Prevención (Soluciones de Gestión)
- **Texto:** ¿Quieres implicar en la prevención a toda tu plantilla? **Conoce Integra Prevención →**
- **Destino:** la página de Soluciones de Gestión / Integra Prevención.
- **Por qué este texto:** la web lo describe como «una integración de la prevención con aquellas personas que no perteneciendo al servicio de prevención participan en ella».

---

## 4. Detalles de implementación

- **Botón «Solicitar más información»:** lleva al formulario de presupuesto con el plan como parámetro, por ejemplo `/contacto?plan=all-in`. El formulario puede leerlo para rellenar un campo oculto o un desplegable de «Plan de interés». Los valores son las claves de cada plan: `all-in`, `autonomos`, `pymes`, `gran-empresa` y `especialidades`.
- **Animación al cambiar de plan:** el contenido de la tarjeta entra con un fundido y un desplazamiento de 10 px (0,5 s, curva `cubic-bezier(.22,.8,.24,1)`). No se anima si el plan no cambia, por ejemplo al cambiar el pago de una gran empresa.
- **Accesibilidad:**
  - Cada pregunta es un `<fieldset>` con su `<legend>` y las opciones son `input type="radio"` reales, ocultos visualmente bajo las píldoras. Así funcionan con teclado: Tab para moverse entre preguntas y flechas para cambiar de opción.
  - La pregunta 2 desactivada usa `fieldset.disabled = true`.
  - La tarjeta tiene `aria-live="polite"` para que los lectores de pantalla anuncien el plan nuevo.
  - Foco visible: anillo de 2 px en Turquesa.
  - Con `prefers-reduced-motion` no hay animación.
- **Estilos de las píldoras (según el briefing):**
  - 48 px de alto, radio de 8 px, borde de 1,5 px.
  - Sin seleccionar: fondo blanco, borde `#6F8F96` (contraste ≥ 3:1 sobre Hueso).
  - Hover: borde Petróleo y fondo azul muy claro.
  - Seleccionada: fondo Petróleo y texto blanco.
- **Analítica (opcional):** registrar un evento con el plan mostrado cuando el usuario pulse «Solicitar más información», para saber qué plan genera más peticiones.

---

## 5. Pendiente de confirmar con Prevensa

- [ ] Umbral pyme / gran empresa (propuesta: 250 personas).
- [ ] Si All In aplica también a autónomos.
- [ ] Si Gran empresa y Especialidades admiten cuota mensual.
- [ ] Si Autónomos y Pymes son de pago anual.
- [ ] Los tres puntos clave de cada plan.
- [ ] URL de destino de cada plan e Integra Prevención en la web nueva.
