# Prevensa · Planes: «Encuentra tu plan» y página de Prevención de riesgos laborales

Guía de desarrollo para los dos sitios de la web nueva donde aparecen los planes:

1. **Home › Encuentra tu plan** (`#plan`): un buscador que recomienda un plan.
2. **Servicios › Prevención de riesgos laborales**: la página del servicio, con las tarjetas de todos los planes.

Los dos usan **los mismos datos y los mismos componentes**. Si un texto de un plan cambia, cambia en los dos sitios a la vez.

- **Referencia visual:** el prototipo de la home (`proyectos/prevensa/index.html`, sección `#plan`).
- **Contenidos:** salen del documento «Planes y servicios de Integra Prevención».
- **Lo marcado [confirmar]** hay que validarlo con Prevensa antes de publicar.

---

## Índice

1. [Qué es un plan y qué no](#1-qué-es-un-plan-y-qué-no)
2. [Datos (fuente única)](#2-datos-fuente-única)
3. [Componentes](#3-componentes)
4. [Home › Encuentra tu plan](#4-home--encuentra-tu-plan)
5. [Página de Prevención de riesgos laborales](#5-página-de-prevención-de-riesgos-laborales)
6. [Enlaces y formulario de contacto](#6-enlaces-y-formulario-de-contacto)
7. [Estilos, estados y accesibilidad](#7-estilos-estados-y-accesibilidad)
8. [Pendiente de confirmar](#8-pendiente-de-confirmar)

---

## 1. Qué es un plan y qué no

| Tipo | Elementos | Cómo se muestran |
|---|---|---|
| **Planes** (modalidad principal que se contrata) | All In · Plan Autónomos · Plan Pymes · Plan Gran Empresa | Tarjeta de plan. El buscador puede recomendarlos. |
| **Servicios complementarios** (no son planes) | Especialidades · Soluciones de Gestión | Bloque aparte, con descripción breve y botón «Solicitar información». **Nunca** salen como resultado del buscador. |

---

## 2. Datos (fuente única)

Hay que guardar los planes y los servicios en **un solo archivo de datos** (JSON, CMS o similar) y leerlo desde la home y desde la página de PRL. No hay que copiar los textos a mano en cada plantilla.

### 2.1 Modelo

```ts
type Plan = {
  id: 'all-in' | 'autonomos' | 'pymes' | 'gran-empresa';
  nombre: string;          // "All In · Tarifa plana mensual"
  titular: string;         // propuesta de valor, una frase
  descripcion: string;     // 1–2 frases
  incluye: string[];       // lista completa
  destacados: string[];    // 3 puntos para la tarjeta compacta (buscador)
  disciplinas?: string[];  // solo All In
};

type ServicioComplementario = {
  id: 'especialidades' | 'soluciones-gestion';
  nombre: string;
  titular: string;
  descripcion: string;
  items: string[];         // especialidades disponibles / qué incluye
};
```

### 2.2 Planes

Los textos ya están adaptados al tono del briefing: tuteo y lenguaje cercano. Los cambios respecto al original están anotados.

#### All In · Tarifa plana mensual · `all-in`
- **Titular:** Un servicio integral para tu empresa, sin sorpresas. Y págalo como quieras.
- **Descripción:** Si no quieres sorpresas, este es tu plan. Estudiamos tu empresa a fondo y preparamos una solución integral adaptada a lo que necesitas, con una cuota mensual fija.
- **Disciplinas cubiertas:** Seguridad en el trabajo · Higiene industrial · Ergonomía y psicosociología · Medicina del trabajo
- **Incluye:**
  1. Revisión inicial del grado de implantación del sistema de gestión en tu empresa.
  2. Análisis inicial de riesgos (instalaciones, máquinas y equipos, productos químicos, procesos, puestos…) para saber qué necesitas.
  3. Un proyecto con una ruta planificada y programada.
  4. Programación de actividades anuales, empezando por lo más importante para cumplir la normativa de prevención.
  5. Te acompañamos en todo momento, con asesoramiento y apoyo en el día a día.
  6. Gestión documental en el portal online Integra Prevención.
- **Destacados (tarjeta compacta):**
  - Todas las disciplinas preventivas en un solo servicio
  - Cuota mensual fija, sin sorpresas
  - Acompañamiento en el día a día

#### Plan Autónomos · `autonomos`
- **Titular:** Prevención ágil y ajustada en costes, con garantía de cumplimiento de tus obligaciones legales y una cobertura integral anual.
- **Descripción:** Una solución para lo que necesitas en prevención de riesgos laborales y en coordinación de actividades empresariales.
- **Incluye:**
  1. Informe de evaluación de riesgos de tu puesto de trabajo.
  2. Formación en prevención de riesgos laborales.
  3. Reconocimiento médico y certificado de aptitud.
  4. Asesoramiento en coordinación de actividades empresariales (CAE).
  5. Asesoramiento jurídico-técnico.
  6. Gestión de la documentación online.
- **Destacados:**
  - Evaluación de riesgos de tu puesto
  - Formación y reconocimiento médico
  - Asesoramiento en CAE y jurídico-técnico

#### Plan Pymes · `pymes`
- **Titular:** Un servicio adaptado a las necesidades de tu empresa, especializado y con experiencia.
- **Descripción:** Una solución ágil y sencilla para la prevención de riesgos laborales de tu empresa, con la garantía de cumplir la normativa.
- **Incluye:**
  1. Revisión inicial del grado de implantación del sistema de gestión en tu empresa.
  2. Análisis inicial de riesgos (instalaciones, máquinas y equipos, productos químicos, procesos, puestos…) para saber qué necesitas.
  3. Plan de actuación anual de actividades preventivas.
  4. Formación e información para tus trabajadores y trabajadoras.
  5. Te acompañamos en todo momento, con asesoramiento y apoyo en el día a día.
  6. Gestión documental en el portal online Integra Prevención.
- **Destacados:**
  - Análisis inicial de riesgos
  - Plan anual de actividades preventivas
  - Formación para tu equipo

#### Plan Gran Empresa · `gran-empresa`
- **Titular:** Un servicio especializado y con dedicación exclusiva, un valor añadido en la gestión de seguridad y salud.
- **Descripción:** Una solución diferenciada: tu empresa entra en nuestra unidad de grandes cuentas, con atención exclusiva y especializada.
- **Incluye:**
  1. Un coordinador único para tu empresa. *(El original dice «su empresa»; lo he pasado a tú.)*
  2. Análisis inicial de riesgos (instalaciones, máquinas y equipos, productos químicos, procesos, puestos…) para saber qué necesitas.
  3. Plan de actuación anual de actividades preventivas, flexible.
  4. Formación e información continua para tus trabajadores y trabajadoras.
  5. Actividades de promoción de la salud personalizadas.
  6. Coordinación multicentro, técnica y médica.
  7. Gestión documental en el área privada Integra Prevención.
- **Destacados:**
  - Coordinador único para tu empresa
  - Coordinación multicentro, técnica y médica
  - Promoción de la salud personalizada

### 2.3 Servicios complementarios

#### Especialidades · `especialidades`
- **Titular:** Contrata solo la especialidad que necesitas.
  - **[confirmar]** El titular del documento original («Dedicación exclusiva, un valor añadido en la gestión de seguridad y salud») es casi igual que el de Gran Empresa y no describe este servicio. Parece un error de copia. Propongo este titular nuevo.
- **Descripción:** Contrata actividades sueltas para complementar el trabajo de tu servicio de prevención propio o mancomunado.
- **Especialidades disponibles:** Seguridad laboral · Higiene industrial · Ergonomía y psicología aplicada · Salud laboral
- **Iconos:** la web actual tiene una imagen por especialidad (en `wp-content/uploads/2021/05` y `/06`). En la web nueva conviene usar iconos de línea en Turquesa que encajen con el estilo del briefing, no esas imágenes.

#### Soluciones de Gestión · `soluciones-gestion`
- **Titular:** Toda la documentación de prevención de tu empresa, en un área privada.
- **Descripción:** Con Integra Prevención, la prevención llega también a quienes participan en ella sin formar parte del servicio de prevención. Toda la documentación de tu empresa, en una plataforma online.
- **Incluye:**
  1. Toda la documentación actualizada en tu área privada.
  2. Integración de tu gestión con la actividad del servicio de prevención ajeno.
  3. Consulta de evaluaciones de riesgo.
  4. Consulta de la planificación de la actividad preventiva.
  5. Consulta de la formación de tus trabajadores.
  6. Registro de entrega de equipos de protección individual.
  7. Comunicación de riesgos e incidencias.
  8. Publicación de documentación.
  9. Consulta y registro de datos de accidentes.
  10. Informes de aptitud médica.

*(En «Incluye» he desarrollado las siglas SPA y EPIs, y en el punto 9 he cambiado «cumplimentación» por «registro». El sentido es el mismo.)*

---

## 3. Componentes

Hay tres componentes, que se usan en los dos sitios.

### 3.1 `PlanCard`

Tarjeta de plan con dos variantes:

| Variante | Dónde | Contenido |
|---|---|---|
| `recomendado` | Resultado del buscador (home y PRL) | Antetítulo «Te recomendamos», nombre, titular, 3 **destacados**, botón Lima «Solicitar información →» y enlace de texto «Ver todo lo que incluye →» |
| `completa` | Rejilla de planes en la página de PRL | Nombre, titular, descripción, lista **incluye** completa (y disciplinas en All In), botón Lima «Solicitar información →» |

- **Fondo:** Petróleo en las dos variantes (es el uso que da el briefing a los fondos de tarjeta). Texto blanco, antetítulo y viñetas de check en Lima.
- **Misma altura (variante `completa`):**
  - Las cuatro tarjetas de la rejilla miden igual: auto layout vertical, alto *Fill container* y fila de altura fija (o `display:grid` con `align-items:stretch`).
  - El botón va empujado al final (`margin-top:auto`) para que los cuatro queden alineados, igual que las tarjetas de servicios.
- **Lista larga:** «Incluye» puede tener 6 o 7 puntos. En móvil se muestran los 4 primeros y el botón «Ver los N puntos» despliega el resto (`<details>` o botón con `aria-expanded`). En escritorio se ve la lista entera.

### 3.2 `ComplementaryCard`

Tarjeta de servicio complementario. Es **visualmente distinta** de la de plan para que no parezca un plan más.

- **Aspecto:** fondo blanco, borde de 1,5 px Océano y esquinas redondeadas.
- **Contenido:**
  - Nombre y titular.
  - Descripción breve.
  - Especialidades: 4 chips con icono. Soluciones de Gestión: 4 puntos de los 10 y el enlace «Ver todo».
  - Botón secundario «Solicitar información →».
- **Botón:** el documento propone dos textos, «Solicitar información» o «Infórmate». Uso **«Solicitar información»** en los dos servicios por coherencia (componentes iguales para elementos iguales, según el briefing).

### 3.3 `PlanFinder`

El buscador (sección 4). Se usa en la home y también en la página de PRL (sección 5).

---

## 4. Home › Encuentra tu plan

### 4.1 Estructura

```
[Antetítulo] Encuentra tu plan
[H2] ¿Qué plan de prevención necesita tu empresa?
[Texto] Responde dos preguntas y te decimos por dónde empezar.

┌ Preguntas (izquierda, 7/12) ┐  ┌ PlanCard "recomendado" (derecha, 5/12) ┐
└─────────────────────────────┘  └─────────────────────────────────────────┘

[Bloque] ¿Buscas algo más concreto?
  ComplementaryCard Especialidades   ComplementaryCard Soluciones de Gestión
```

En móvil, todo se apila: preguntas, tarjeta y servicios complementarios.

### 4.2 Preguntas

**1 · ¿Cómo es tu empresa?**

| Opción visible | Valor |
|---|---|
| Soy autónomo/a | `autonomo` |
| Pequeña o mediana empresa | `pyme` (por defecto) |
| Gran empresa | `gran` |

No ponemos número de trabajadores porque el documento pide no inventar umbrales. **[confirmar]** Si Prevensa da un corte (por ejemplo «hasta 249 personas»), se añade como texto secundario de la opción.

**2 · ¿Qué prefieres?**

| Opción visible | Valor |
|---|---|
| Todo incluido con una cuota mensual fija | `integral` (por defecto) |
| Un servicio adaptado a mi empresa | `adaptado` |

Si la empresa es `autonomo`, la pregunta 2 se **desactiva** porque el resultado siempre es Plan Autónomos. Se ve atenuada y aparece esta nota:

> Para autónomos tenemos un plan pensado para ti, con cobertura integral anual.

### 4.3 Reglas (cuándo cambia la tarjeta)

Se evalúan en orden y se aplica la primera que se cumpla:

| # | Condición | Resultado |
|---|---|---|
| 1 | Empresa = `autonomo` | **Plan Autónomos** |
| 2 | Prefiere = `integral` | **All In** |
| 3 | Empresa = `pyme` | **Plan Pymes** |
| 4 | Empresa = `gran` | **Plan Gran Empresa** |

| | Todo incluido, cuota fija | Adaptado a mi empresa |
|---|---|---|
| **Autónomo/a** | Plan Autónomos | Plan Autónomos |
| **Pyme** | All In | Plan Pymes |
| **Gran empresa** | All In | Plan Gran Empresa |

```js
function pickPlan(empresa, prefiere) {
  if (empresa === 'autonomo') return 'autonomos';
  if (prefiere === 'integral') return 'all-in';
  return empresa === 'gran' ? 'gran-empresa' : 'pymes';
}
```

- **Por qué este orden:** el documento dice que autónomo lleva a Autónomos, pyme a Pymes y gran empresa a Gran Empresa. Cuando se busca expresamente una solución integral con cuota fija, All In tiene prioridad.
- **[confirmar]** ¿All In es adecuado para una gran empresa que quiere cuota fija, o debe salir siempre Plan Gran Empresa? Si es lo segundo, la regla 4 pasa a ir antes que la 2, y la pregunta 2 se desactiva también para `gran`.
- **[confirmar]** ¿All In se ofrece a autónomos? Hoy no, según la regla 1.

### 4.4 Comportamiento

- La tarjeta cambia **al momento** al cambiar cualquier respuesta. No hay botón de «calcular».
- Al cargar, ya hay respuestas marcadas (Pyme + Todo incluido), así que se ve **All In** y la tarjeta nunca sale vacía.
- Al cambiar de plan, el contenido de la tarjeta entra con un fundido y un desplazamiento de 10 px (0,5 s, `cubic-bezier(.22,.8,.24,1)`). Si el plan resultante es el mismo, no se anima.
- **Especialidades y Soluciones de Gestión** van siempre visibles debajo, en el bloque «¿Buscas algo más concreto?». No dependen de las respuestas.

---

## 5. Página de Prevención de riesgos laborales

Propuesta de estructura. No hay wireframe de esta página, así que sigue el estilo de la home: fondos blanco y Hueso, foto a sangre en tarjeta redondeada y bloque final Petróleo.

| # | Sección | Contenido |
|---|---|---|
| 1 | **Hero del servicio** | Antetítulo «Servicios», H1 «Prevención de riesgos laborales», texto corto en tono cercano y foto del briefing para Prevención (dos personas revisando juntas un espacio de trabajo cuidado). Botones: «Solicitar presupuesto» (Lima) y «Ver planes» (secundario, ancla a `#planes`). |
| 2 | **Qué cubrimos** | Las 4 disciplinas preventivas (Seguridad en el trabajo, Higiene industrial, Ergonomía y psicosociología, Medicina del trabajo) en 4 bloques iguales con icono y una línea. |
| 3 | **Planes** (`#planes`) | H2 «Elige tu plan». Rejilla de 4 `PlanCard` en variante `completa`, en este orden: All In, Autónomos, Pymes, Gran Empresa. En escritorio 4 columnas (2 + 2 si no caben con la lista entera), en tablet 2 y en móvil 1. Cada tarjeta lleva un `id` para enlazar directamente: `#plan-all-in`, `#plan-autonomos`, `#plan-pymes`, `#plan-gran-empresa`. |
| 4 | **¿No sabes cuál elegir?** | El mismo `PlanFinder` de la home, con fondo Hueso. Aquí la tarjeta resultado enlaza a la tarjeta completa de su plan, más arriba en la misma página. |
| 5 | **Servicios complementarios** | H2 «Complementa tu servicio». Las 2 `ComplementaryCard` (Especialidades y Soluciones de Gestión). |
| 6 | **Llamada a la acción** | El bloque Petróleo de cierre de la home: titular, botón de presupuesto, teléfono, correo y horario. |

**[confirmar]** Si Especialidades y Soluciones de Gestión tendrán páginas propias o solo estos bloques.

### All In destacado

En la rejilla, All In puede llevar una etiqueta Lima «Todo incluido» arriba a la derecha. Es el único plan con cuota fija y el que el buscador recomienda por defecto. **[confirmar]** con Prevensa si quieren destacarlo.

---

## 6. Enlaces y formulario de contacto

| Botón | Destino |
|---|---|
| «Solicitar información» en una tarjeta de plan | `/contacto?plan=<id>` (`all-in`, `autonomos`, `pymes`, `gran-empresa`) |
| «Solicitar información» en un servicio complementario | `/contacto?servicio=<id>` (`especialidades`, `soluciones-gestion`) |
| «Ver todo lo que incluye» (buscador en la home) | `/servicios/prevencion-de-riesgos-laborales#plan-<id>` |
| «Ver todo lo que incluye» (buscador en la página de PRL) | `#plan-<id>` (desplazamiento suave dentro de la página) |

- **Formulario:** lee `plan` o `servicio` de la URL y rellena un campo «Me interesa» (desplegable visible, que el usuario puede cambiar). Si no hay parámetro, el campo queda en «Aún no lo sé».
- **Analítica (opcional):** registra un evento con el `id` al pulsar «Solicitar información», con origen `buscador`, `rejilla` o `complementario`, para saber qué plan y qué sitio generan más peticiones.
- **[confirmar]** El documento habla de contactar con «Integra Prevención». En el briefing, Integra Prevención es el nombre del portal online y la empresa es Prevensa. Los botones llevan al contacto de Prevensa salvo que nos digan otra cosa.

---

## 7. Estilos, estados y accesibilidad

**Preguntas (píldoras):**
- Cada pregunta es un `<fieldset>` con `<legend>`. Las opciones son `input type="radio"` reales, ocultos visualmente bajo la píldora.
- Así funcionan con teclado: Tab salta entre preguntas y las flechas cambian de opción.
- Medidas: 48 px de alto, radio de 8 px, borde de 1,5 px y texto en negrita.

| Estado | Estilo |
|---|---|
| Normal | Fondo blanco, borde `#6F8F96` (contraste ≥ 3:1 sobre Hueso) |
| Hover | Borde Petróleo, fondo azul muy claro `#E6F1F3` |
| Seleccionada | Fondo Petróleo `#0F5C6C`, texto blanco |
| Foco | Anillo de 2 px en Turquesa `#359FA5` |
| Desactivada | `fieldset.disabled = true`, opacidad 45 %, cursor `not-allowed` |

**Tarjeta resultado:**
- Lleva `aria-live="polite"` para que los lectores de pantalla anuncien el plan nuevo.
- El título del plan es un `<h3>`.

**Botones:** según el briefing.
- Lima con texto Petróleo para «Solicitar información» en tarjetas de plan.
- Secundario (blanco con borde Petróleo) en servicios complementarios.
- Flecha «→» en los enlaces, nunca el icono de enlace externo.

**Contraste:** texto blanco solo sobre Petróleo u Océano, nunca sobre Turquesa.

**Movimiento:** con `prefers-reduced-motion: reduce` no hay animaciones.

**Tono:** tuteo en todo el bloque. El mockup inicial trataba de usted («Responda», «su empresa»), y eso ya está corregido.

---

## 8. Pendiente de confirmar

- [ ] Umbrales de pyme y gran empresa (número de trabajadores o facturación), por si se quieren mostrar en las opciones.
- [ ] Formas de pago reales de cada plan. Solo sabemos que All In es de cuota mensual fija y que Autónomos tiene «cobertura integral anual».
- [ ] Si All In puede recomendarse a una gran empresa (regla 2) y si se ofrece a autónomos.
- [ ] Titular de Especialidades (el original parece copiado de Gran Empresa).
- [ ] Si All In va destacado en la rejilla.
- [ ] Si Especialidades y Soluciones de Gestión tienen página propia.
- [ ] Si el contacto es de Prevensa o de Integra Prevención.
- [ ] Iconos de las 4 especialidades en el estilo nuevo.
