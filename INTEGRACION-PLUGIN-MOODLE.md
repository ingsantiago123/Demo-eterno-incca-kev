# Integración con el plugin de Moodle — contrato de datos

Este documento es para quien actualice el plugin de Moodle que alimenta este
sitio. No explica el código del visor (eso ya está en
[visor/README.md](visor/README.md) y [visor-instrucciones.md](visor-instrucciones.md)) —
explica **qué forma de datos tiene que producir el plugin** para que el sitio
siga funcionando, y qué cambió con la llegada de "Laboratorios Vivos".

## 1. Cómo se hacía antes

Un solo archivo, [`Datos/General-labs.json`](Datos/General-labs.json): un
array plano de objetos, **todos implícitamente "Laboratorios Externos"**,
con claves en español calcadas de una hoja de cálculo (`"Nombre del
Laboratorio"`, `"Programa(s)"`, `"Aplica a"`, etc.). Ningún objeto decía qué
tipo de laboratorio era porque solo existía un tipo.

```json
{
  "No.": 1,
  "Nombre del Laboratorio": "Flotabilidad: Intro",
  "Categoría": "Movimiento",
  "Origen / Plataforma": "PhET",
  "Aplica a": "Transversal",
  "Programa(s)": "Ingeniería Mecánica, Ingeniería Electrónica",
  "Materias": "Física Mecánica (Ing. Mecánica, Electrónica)",
  "Descripción ": "Simulación de flotabilidad...",
  "Compatible con Moodle": "Si",
  "Costo": "Gratuito / $0",
  "Link del Recurso": "https://phet.colorado.edu/...",
  "imagen": "https://phet.colorado.edu/.../buoyancy-basics-900.png"
}
```

⚠️ **Trampa a tener en cuenta si el plugin genera este archivo:** la clave de
la descripción es literalmente `"Descripción "` **con un espacio al final**.
Si el plugin la genera sin ese espacio, el visor no rompe (cae al
placeholder "Descripción no disponible."), pero la descripción real
desaparece en silencio.

El flujo era: el plugin (o lo que sea que arme este archivo) solo tenía que
producir esa lista de objetos. El sitio hacía **un único `fetch()`** a ese
archivo, lo volcaba entero a `window.name`, y de ahí en más todo el visor
(`visor/index.html` → `programa.html` → `catalogo.html`) lo leía sin volver
a tocar la red.

## 2. Cómo se hace ahora: el flag `tipo`

Se agregó una propiedad **opcional** `"tipo"` a cada objeto del array, con
tres valores posibles:

| `tipo` | Qué representa | Estado en el sitio |
|---|---|---|
| `"externo"` | Recurso de una plataforma aliada (PhET, CircuitVerse, etc.) | Activo — catálogo funcionando |
| `"vivo"` | Práctica de laboratorio grabada en video | Activo — catálogo + página de video funcionando |
| `"propio"` | Aplicativo desarrollado por la universidad | El flag ya se reconoce en los datos, pero **todavía no tiene pantalla propia** — la tarjeta "Laboratorios Propios" sigue mostrando "Próximamente" sin importar cuántos ítems `propio` traiga el array |
| *(sin `tipo`)* | — | **Retrocompatible**: se trata como `"externo"` automáticamente. Los 132 laboratorios reales de hoy no tienen `tipo` y van a seguir funcionando exactamente igual sin que el plugin tenga que tocarlos |

Es decir: **no hace falta re-etiquetar los laboratorios externos que ya
existen.** Alcanza con que los objetos *nuevos* (los vivos, y a futuro los
propios) traigan `"tipo"` explícito. El array sigue siendo uno solo, con
todos los laboratorios mezclados adentro — la separación por colección
(Externos / Vivos / Propios) la hace el sitio, no el plugin.

## 3. Qué campos necesita un objeto `"tipo": "vivo"`

A diferencia de los externos (que reusan las columnas viejas de la hoja de
cálculo), los ítems `vivo` usan un esquema nuevo y más simple, en inglés de
nombres de campo pero valores en español:

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| `tipo` | string | **sí**, literal `"vivo"` | Sin esto, el objeto no se reconoce como video |
| `item` | número | recomendado | Número de práctica, se muestra como "Práctica N°" / "#N". Si falta, el sitio numera por posición |
| `nombre` | string | sí | Título de la tarjeta y de la página del video |
| `programa` | string | sí | Un solo programa académico (si el video aplica a más de uno, hoy solo se toma el primero — ver §5) |
| `materia` | string | sí | Materia asociada, se usa también como categoría para filtrar |
| `transversalidad` | string | sí | Literal `"Transversal"` o `"Específico"` — cualquier otro valor se muestra tal cual pero no activa el badge "Transversal" |
| `descripcion` | string | sí | Texto completo, se muestra en la tarjeta (recortado) y en la página del video (completo) |
| `videoUrl` | string (URL de Drive) | sí | Ver §4 — si viene vacío, la página muestra "Video no disponible" en vez de romper |
| `docenteFuente` | string | sí | Docente o fuente de la grabación, se muestra como crédito |

Ejemplo completo:

```json
{
  "tipo": "vivo",
  "item": 1,
  "nombre": "Circuito Rectificador de Media Onda",
  "programa": "Ingeniería Electrónica",
  "materia": "Circuitos Eléctricos I",
  "transversalidad": "Específico",
  "descripcion": "Laboratorio en vivo donde la docente arma y prueba con componentes reales un circuito rectificador de media onda...",
  "videoUrl": "https://drive.google.com/file/d/1qKADcM2iptO2HkiOD9oNfznOgCaws3wy/view?usp=drivesdk",
  "docenteFuente": "Docente de Circuitos Eléctricos - Ing. Electrónica"
}
```

## 4. El link de video: requisito de permisos en Drive

El sitio toma **cualquier** link de "compartir" de Google Drive
(`.../file/d/ID/view`, `.../file/d/ID/view?usp=drivesdk`, etc.) y lo
convierte solo internamente a la variante embebible `.../file/d/ID/preview`
para meterlo en un `<iframe>`. Esa conversión ya está resuelta en el
código — el plugin **no tiene que transformar nada**, solo pegar el link tal
cual lo da Drive.

Lo único que el plugin (o quien suba los videos) tiene que garantizar es el
**permiso de uso compartido** de cada archivo en Drive: tiene que estar en
*"Cualquier persona con el enlace"* (rol Lector alcanza). Si el archivo
sigue en modo privado o restringido al dominio, el `<iframe>` va a mostrar
la pantalla de login de Google en vez del video — no es un bug del sitio, es
el archivo de Drive el que hay que revisar.

## 5. Cosas a tener en cuenta al adaptar los datos

- **Un array, todos los tipos mezclados** — el plugin sigue produciendo
  (o el sitio sigue leyendo) un único array en `Datos/General-labs.json`.
  No hay archivos separados por colección.
- **`programa` es un solo valor por ítem** (a diferencia de `"Programa(s)"`
  en los externos viejos, que trae varios separados por coma). Si un mismo
  video vivo aplica a dos programas hoy, hay que duplicar el objeto una vez
  por programa (mismo `item`, mismo `videoUrl`, distinto `programa`) — el
  sitio no soporta todavía "un video, varios programas" en un solo objeto.
- **`item` no tiene que ser único en todo el archivo**, solo sirve como
  número de práctica visible. La identidad real la arma el sitio
  combinando tipo + posición.
- **Cualquier campo vacío o ausente cae a un placeholder genérico** (nunca
  rompe la página ni la deja en blanco) — así que si el plugin todavía no
  tiene algún dato listo (por ejemplo, `docenteFuente` sin confirmar todavía)
  se puede mandar `""` sin problema.
- **No hace falta cambiar nada del lado del sitio** para que el plugin
  empiece a mandar `vivo`s reales: basta con que
  `Datos/General-labs.json` incluya esos objetos con `tipo: "vivo"` la
  próxima vez que el plugin regenere el archivo.

## 6. Cómo probarlo antes de mandarlo a producción

Este repo trae un banco de pruebas local, `visor/prueba.html` (no se sube al
repo remoto — está en `.gitignore` a propósito, es solo para desarrollo). Se
abre con Live Server y simula exactamente lo que el plugin tiene que
producir: un `<iframe>` con el array completo (JSON válido, escapado como
atributo HTML) en su `name`. Es la forma más rápida de validar un lote nuevo
de datos sin tocar el archivo real ni depender de que el plugin ya esté
desplegado.
