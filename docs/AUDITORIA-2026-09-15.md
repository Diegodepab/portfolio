# Auditoría del portafolio

Fecha: 15 de septiembre de 2026. Código revisado: `3ff6a4f`.

## Conclusión

El portafolio tiene una identidad visual coherente y buenas defensas para sus efectos gráficos. Sin embargo, la carga móvil necesita mejorar y hay fallos reproducibles en el tour móvil y en la recuperación ante errores de descarga. Priorizaría esas correcciones antes de añadir más efectos.

La dirección visual propuesta es conservar la estética oscura, la tipografía y la personalización Pokémon; dar más protagonismo a los proyectos, simplificar la portada móvil y concentrar el movimiento en interacciones concretas.

No se puede garantizar ausencia de lag o fallos en todos los dispositivos futuros. Sí se pueden establecer límites de rendimiento, recuperación ante errores y comprobaciones que impidan publicar regresiones.

Esta entrega es una auditoría: no modifica el código de la aplicación.

## 1. Qué se ha comprobado

- `npm run check`: lint correcto, **34 tests unitarios correctos**, TypeScript y build correctos.
- **11 tests de navegador correctos**, usando Chrome instalado con una configuración temporal. Incluyen pérdida de contexto gráfico, pestañas ocultas y preferencias de movimiento reducido.
- Lighthouse sobre el build local de producción: **tres ejecuciones por perfil**, sin ejecutar otros tests de navegador simultáneamente.
- Inspección de portada y explorador a 320, 390, 768 y 1440 px; capturas de secciones, apertura/cierre del chat y del tour.
- Simulación de fallo de descarga de una ruta y de dispositivo con 2 GB de memoria declarada.
- Prueba breve de cadencia por sección con CPU ralentizada ×4.
- `npm audit --omit=dev`: **0 vulnerabilidades conocidas reportadas en dependencias de producción** en el momento de la consulta.

### Resultados de carga

| Métrica | Escritorio | Móvil simulado |
| --- | ---: | ---: |
| Lighthouse Performance, mediana | **99/100** | **69/100** |
| Rango de puntuaciones | 98–100 | 66–70 |
| LCP, mediana: aparición del contenido principal | 0,69 s | **3,40 s** |
| TBT, mediana: tiempo de bloqueo acumulado | 91 ms | **733 ms** |
| CLS: cambios inesperados de distribución | 0 | 0 |
| Accesibilidad automática | 97–100 | 100 |

Los resultados proceden de Chrome Headless 152 en Linux y del throttling simulado de Lighthouse. No son mediciones de visitantes reales ni una certificación de accesibilidad. Las paletas pueden variar entre ejecuciones. El servidor local tampoco reproduce las cabeceras, CDN ni funciones de Vercel; sus advertencias de caché no se atribuyen al despliegue.

La prueba breve de ejecución obtuvo intervalos medianos de unos 16,7 ms entre callbacks de animación y percentiles 95 de 16,7–16,8 ms. Se observaron tareas de arranque de hasta 334 ms. Esto orienta la prioridad hacia la carga inicial; no demuestra ausencia de tirones durante sesiones largas, todas las transiciones o en GPU de móviles reales.

### Aspectos que conviene conservar

- Imágenes WebP con `srcSet`, tamaños declarados y versiones de miniaturas.
- Fuentes locales variables y preload de Inter; el build transforma correctamente su ruta.
- Carga diferida de rutas, ventana del chat y motores gráficos.
- Botones metálicos con alternativa CSS funcional sin WebGL.
- Observación compartida de visibilidad y separación de lecturas/escrituras del DOM.
- Pausa de varios motores fuera de pantalla y en pestañas ocultas.
- Base semántica, etiquetas de formularios y soporte de idiomas.

## 2. Hallazgos prioritarios

P1: siguiente bloque de trabajo. P2: endurecimiento y calidad después de resolver P1. Las estimaciones de esfuerzo son relativas, no compromisos de plazo.

### P1 · 1. La carga móvil bloquea demasiado el hilo principal

**Evidencia:** LCP mediano de 3,40 s y TBT mediano de 733 ms. En la primera ejecución móvil, Lighthouse atribuye aproximadamente 3,6 s a evaluación de scripts y 0,82 s a estilos/layout, con sus condiciones simuladas. El build genera unos 197 kB gzip entre los chunks iniciales de JavaScript. El CSS principal ocupa 133,6 kB sin comprimir y 23,2 kB gzip.

**Dónde:** `src/App.tsx`, `src/performance/useVisualEffects.ts`, `src/performance/effectsStore.ts`, `src/components/sections/HeroCollage.tsx`, `vite.config.ts`.

**Mejora:** perfilar el arranque por componente y diferir la inicialización de decoración y contenido interactivo bajo el primer viewport. `HomePage` monta todas las secciones y `useEffectVisibility` empieza con `intersects=true`: los efectos pueden activarse antes de conocer su visibilidad. Empezar las decoraciones sin activar hasta recibir esa información evita trabajo especulativo. Reservar espacio para que la carga diferida no introduzca saltos.

Lighthouse identifica como LCP la fotografía principal del paisaje. Actualmente se descubre después de ejecutar React y no tiene prioridad alta. Añadir descubrimiento anticipado y `fetchPriority` a la imagen correcta según el diseño definitivo; no precargar todas las fotografías. Revisar `sizes` y compresión: la auditoría estima unos 39 KiB recuperables en imágenes en una ejecución móvil.

**Validación:** repetir tres o más mediciones móviles comparables, comprobar tareas largas y conservar CLS cercano a cero. No atribuir todo el bloqueo a una biblioteca sin un perfil de CPU por componente.

**Esfuerzo:** medio.

### P1 · 2. El tour queda fuera de pantalla en móvil

**Reproducido:** a 390 × 900 px, abrir el avatar muestra un diálogo con `x=195` y ancho 320 px: su extremo derecho llega a 515 px. El botón de cierre queda fuera del viewport y el intento de pulsarlo falla. Se reprodujo en dos recorridos de inspección.

**Dónde:** `src/components/ui/AvatarGuide.css:9`, `src/components/ui/AvatarGuide.tsx`, `src/hooks/useTour.ts:231`.

**Mejora:** limitar el ancho al espacio disponible y recalcular la posición después de montar el contenido del portal. Una alternativa visual adecuada en móvil es un panel inferior con altura limitada, desplazamiento interno y cierre siempre visible. Verificar cambios de tamaño y teclado virtual.

**Validación:** completar, avanzar y cerrar el tour a 320/390 px, en español e inglés, con y sin movimiento reducido; todas las acciones deben quedar dentro de pantalla.

**Esfuerzo:** pequeño/medio.

### P1 · 3. Un fallo de descarga puede dejar toda la web en blanco

**Reproducido:** bloquear la descarga de `ProjectsPage-*.js` y abrir `/projects` produce `Failed to fetch dynamically imported module`; `#root` queda con cero hijos y el cuerpo sin texto.

**Dónde:** `src/App.tsx:132`, `src/main.tsx`. Hay una protección local para transiciones de píxeles, pero no una frontera de errores para las rutas.

**Mejora:** añadir una frontera de errores que mantenga navegación y contacto, con un mensaje legible y una acción de recuperación. Tratar también los errores de carga de chunks de Vite, con reintento o recarga controlada que no genere un bucle. Contemplar una pestaña abierta durante un nuevo despliegue.

`Suspense` cubre la espera de carga; se necesita una frontera de errores para los fallos de renderizado/carga que llegan a React. [Referencia de React](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary).

**Validación:** abortar un chunk, simular un recurso antiguo y navegar con conectividad intermitente. La interfaz debe ofrecer recuperación y conservar acceso al contacto.

**Esfuerzo:** pequeño/medio.

### P1 · 4. El modo reducido no detiene todas las decoraciones

**Reproducido:** declarando `deviceMemory=2`, la web elige `data-effects=reduced` por `limited-device`, pero el canvas de partículas de «Sobre mí» sigue ejecutando **61 borrados/dibujos en un segundo**.

**Dónde:** `src/components/ui/AntsCursor.tsx:24`. Este componente usa `visible && !reducedMotion` e ignora la calidad reducida por recursos o rendimiento.

**Mejora:** hacer que las partículas obedezcan el estado `active` compartido. Revisar el resto de efectos para que todos respeten calidad, visibilidad y preferencias. Inicializar sin animación hasta completar la evaluación de capacidades.

Además, `FrameBudget` (`src/performance/policy.ts:35`) solo considera lentos los intervalos superiores a 50 ms. Una página sostenida a 25–30 FPS no activa esa defensa; el test actual acepta explícitamente 30 Hz. Es una política deliberada, pero insuficiente como objetivo de fluidez a 60 Hz. Ajustarla con respecto a la cadencia disponible, tolerando picos aislados y evitando confundir el límite intencional de 15 FPS de un shader con la fluidez de toda la página.

**Validación:** contar trabajo de canvas después de reducir calidad y medir cadencia durante scroll y transiciones. Añadir un control persistente «Reducir efectos» puede complementar la detección automática.

**Esfuerzo:** pequeño para partículas; medio para calibrar la política.

### P1 · 5. Las imágenes pueden quedar obsoletas durante un año

**Confirmado por configuración:** `vercel.json:27` aplica `max-age=31536000, immutable` a `/images`, `/pokemon` y `/education`, aunque sus archivos tienen nombres estables. Actualizar una imagen conservando la URL puede dejar a visitantes recurrentes con la versión anterior.

**Mejora:** incorporar una huella del contenido a los nombres o versionar URLs desde el manifiesto. Para recursos sin versionar, usar una política de revalidación adecuada. Mantener la caché larga de los assets con hash de Vite.

La recomendación de caché inmutable depende de que la URL cambie cuando cambia el contenido. [Referencia de MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control).

**Validación:** actualizar una imagen y comprobarla desde un navegador con caché previa, sin pedir al visitante que la borre.

**Esfuerzo:** pequeño/medio.

### P1 · 6. CI no protege los recorridos ni el rendimiento

**Confirmado:** `.github/workflows/ci.yml` solo ejecuta `npm run check`. Los tests de navegador y los scripts de rendimiento existen, pero no forman parte de esa puerta de calidad. Los 11 tests de navegador actuales pasan aun existiendo el fallo del tour móvil.

**Mejora:** incorporar pruebas de navegación, tour móvil, contacto simulado, carga fallida y modo reducido; instalar navegadores de forma reproducible. Añadir presupuestos de tamaño y mediciones de rendimiento con varias ejecuciones. Cubrir WebKit y al menos un móvil real antes de cambios gráficos relevantes.

**Validación:** demostrar que una regresión deliberada de estos casos hace fallar CI. Publicar informes como artefactos vinculados al commit.

**Esfuerzo:** medio.

## 3. Robustez, accesibilidad y mantenimiento

| Prioridad | Hallazgo y evidencia | Mejora concreta |
| --- | --- | --- |
| P2 | `Contact.tsx:39` hace `fetch` sin timeout. Si una respuesta HTTP correcta contiene JSON inválido, el parseo devuelve `null`, se acepta como éxito y se limpia el formulario. Confirmado por lectura del código, sin enviar mensajes. | Timeout/cancelación, validar explícitamente la respuesta de éxito y conservar los datos ante errores. Ofrecer enlace directo al correo junto al formulario. Probar respuestas inválidas y red interrumpida mediante mocks. |
| P2 | `useChat.ts` no limpia su petición ni los temporizadores al desmontarse. `ChatWindow` se desmonta al cerrar; sus respuestas heurísticas programan navegación. | Abortar peticiones y cancelar temporizadores al cerrar/desmontar/limpiar conversación. Una navegación diferida no debería suceder después de cerrar el chat. Revisar también el scroll suave en cada token de respuesta. |
| P2 | `api/chat.ts:28` limita peticiones con un `Map` local sin eliminación de entradas antiguas; las instancias no comparten memoria. | Verificar la protección efectiva en Vercel Firewall o un contador compartido con expiración. Limitar el tamaño del mapa si se conserva. Cancelar el streaming al desconectar el cliente y alinear timeout/reintentos con `maxDuration`. No se ha inspeccionado el panel de Vercel. |
| P2 | Una ejecución de Lighthouse detecta contraste **3,98:1** en el selector de idioma, inferior al 4,5:1 esperado para su texto. También informa discrepancias entre texto visible y nombre accesible en proyectos y avatar. | Comprobar cada paleta contra el fondo real de cada componente, incluidos estados activos. Usar etiquetas accesibles que incluyan el texto visible. No basta con corregir el acento contra un único fondo. |
| P2 | Tras cerrar el chat con Escape, el foco queda en `body`, reproducido en escritorio y móvil. | Devolver foco al activador cuando vuelva a montarse. El chat se declara no modal: revisar su recorrido de teclado sin imponer automáticamente un bloqueo modal. |
| P2 | `public/sitemap.xml:82` anuncia `/projects/circlescope`, pero el ID del proyecto es `instagram-epic-tool`. Se confirmó que la URL del sitemap acaba en `/projects`. | Generar sitemap a partir de los datos y mantener un alias/redirección si cambia un slug. Unificar el dominio canónico: README, sitemap y metadatos usan estrategias distintas. |
| P2 | El HTML inicial es una carcasa vacía y los metadatos de cada proyecto se incorporan con JavaScript. | Prerenderizar rutas públicas y sus metadatos, incluida una imagen social con URL absoluta. Verificar cómo se comparten los proyectos y cómo responde una URL inexistente en el despliegue. No hace falta migrar de framework para empezar. |
| P2 | `ProjectDetailPage.tsx` carga los medios del caso de estudio sin `loading=lazy`; incluye un iframe de YouTube directo. | Reservar dimensiones y diferir imágenes fuera de pantalla. Usar una portada de vídeo que cargue el reproductor al pulsar. Medir esas rutas, además de la portada. |
| P2 | `ProjectOrrery.tsx:95` usa `<a href>` interno en una aplicación con router. | Usar navegación del router para evitar recargar el documento. Pausar cambios de destino mientras un enlace tiene foco o se está usando. |

### Limpieza posterior de bajo coste

- Consolidar metadatos de proyectos: IDs, representación visual, accesos del orrery y sitemap aparecen en varios lugares.
- Revisar dependencias duplicadas: se declaran fuentes estáticas y variables, aunque el CSS activo usa las variables. La declaración duplicada no implica que se descarguen ambas.
- `screenshot.mjs` importa Puppeteer sin declararlo y escribe en una ruta personal ajena al repositorio. Sustituirlo por el flujo Playwright existente.
- Corregir afirmaciones absolutas de `AgentReady.md` sobre «maximum speed» y el README que describe los efectos como libres de bibliotecas WebGL pesadas: existe un chunk diferido `three-vendor` de 582 kB, 148 kB gzip. **No es carga inicial** y no se le atribuye el TBT inicial medido.
- Separar datos de contenido de reglas del asistente, y reducir CSS muy concentrado por componente cuando se edite cada área.

## 4. Propuesta visual

Estas son decisiones de diseño recomendadas a partir de las capturas, no defectos funcionales ni resultados de un estudio de usuarios.

### Portada con una propuesta más concreta

El titular «Soy desarrollador de software» ocupa tres líneas grandes en escritorio y móvil. Comunica el puesto, pero poco de lo que distingue tu trabajo. Propuesta de texto, basada en el contenido existente:

> Diego De Pablo  
> Desarrollo software, infraestructura e IA aplicada.  
> Aplicaciones full-stack, espacios de datos y despliegues con Kubernetes.  
> **Ver proyectos** · Contactar

Conservar el nombre dominante, ajustar la escala del segundo titular y usar una descripción breve. En móvil, buscar que propuesta y acciones queden claramente en la primera pantalla.

### Un elemento visual principal

La composición actual combina dos paisajes, retrato, red de fondo, botón metálico, avatar y Pokémon. La paleta los unifica, pero hay varios focos compitiendo por atención.

Mantendría un retrato y una demostración visual relevante de un proyecto. Una captura real o un diagrama estático puede mostrar mejor tu trabajo. Los paisajes pueden pasar a «Sobre mí». En la inspección a 390 px, la portada completa mide unos **1181 px de alto**: compactar el collage acorta la distancia hasta la experiencia y los proyectos.

### Mostrar el trabajo antes

Orden propuesto: **portada → dos proyectos destacados → experiencia → sobre mí y formación → contacto**.

Las tarjetas actuales ya tienen buen acabado. Mejoraría su contenido con una estructura consistente: problema, contribución personal y resultado verificable; una imagen relevante y tres o cuatro tecnologías principales. No inventar métricas. Conservar las tecnologías restantes en el detalle.

El texto actual de introducción a proyectos habla de un «sistema adaptable de tres colores». Cambiarlo por lo que ofrecen los proyectos: productos, investigación, infraestructura y problemas resueltos.

### Movimiento con una función clara

- Elegir un efecto protagonista por zona visible.
- Usar transiciones breves de opacidad y desplazamiento para estados, hover y navegación.
- Mantener una composición estática cuidada cuando se reducen los efectos.
- Reservar transiciones de píxeles para interacciones puntuales o dispositivos adecuados; evaluar si justifican el motor diferido.
- Ofrecer una pausa accesible para galerías automáticas cuando sea necesaria; no depender solo de la preferencia del sistema.

### Personalización con continuidad

Conservar Pokémon como detalle distintivo. Establecer una paleta inicial reconocible y guardar la elegida evita que cada visita cambie la identidad visual. Validar contraste y estados de todos los temas. La paleta azul de las capturas ofrece una base coherente para desarrollar esta dirección.

### Contacto y controles flotantes

El formulario móvil tiene buen ancho y etiquetas claras. Añadir correo visible y reducir pasos innecesarios facilita el contacto. En la captura de contacto, el avatar queda muy cerca del extremo derecho del botón de envío: reservar separación para que los controles no compitan ni se solapen en distintas alturas de pantalla.

## 5. Orden de implementación y criterios de aceptación

### Bloque 1 — Corregir fallos y establecer la referencia

1. Tour móvil y recuperación ante chunks fallidos.
2. Partículas que ignoran la calidad reducida.
3. Versionado de imágenes y validación del formulario.
4. Pruebas de esos casos en CI.

### Bloque 2 — Reducir la carga inicial

1. Perfil de CPU del arranque y activación por visibilidad.
2. Descubrimiento/prioridad de la imagen principal y ajustes de tamaños.
3. Revisar el uso inicial de Motion, CSS y contenido de secciones.
4. Repetir mediciones y ajustar la política de efectos con evidencia.

### Bloque 3 — Afinar diseño y mantenimiento

1. Portada móvil compacta y jerarquía de proyectos.
2. Casos de estudio con evidencia visual real.
3. Paleta persistente y contraste por componente.
4. Metadatos prerenderizados, sitemap generado y ciclo de vida del chat.

### Objetivos verificables

| Área | Criterio propuesto |
| --- | --- |
| Experiencia real | LCP ≤ 2,5 s, INP ≤ 200 ms y CLS ≤ 0,1 en el percentil 75, separados por móvil/escritorio. |
| Laboratorio móvil | Mediana de Lighthouse Performance ≥ 90 y TBT ≤ 200 ms bajo una configuración fija; umbrales internos propuestos. |
| Animación | Cadencia próxima a la pantalla objetivo; sin caídas sostenidas al hacer scroll, cambiar galería, abrir chat o recorrer proyectos. Probar hardware real. |
| Recursos | Registrar el peso inicial y fijar un presupuesto revisable; ningún motor decorativo pesado debe aparecer por accidente en la carga crítica. |
| Recuperación | Fallar una descarga nunca deja una pantalla sin navegación o una acción de recuperación. |
| Móvil y teclado | Tour completo y cierre accesible a 320/390 px; foco recuperado al cerrar chat; controles sin recortes. |
| Publicación | CI ejecuta los recorridos críticos y conserva resultados asociados al commit. |

Los umbrales de experiencia real siguen [Core Web Vitals](https://web.dev/articles/vitals). TBT es una medida de laboratorio y **no sustituye a INP**. Incorporar medición de visitantes permite detectar regresiones que una máquina de pruebas no reproduce.

## 6. Evidencias y límites

Los artefactos están en `artifacts/audit-2026-09-15/`, excluidos de Git por la configuración existente:

- `lighthouse/summary.json` y seis informes HTML/JSON con trazas.
- `inspection.json`: dimensiones, errores y fallo de descarga de ruta.
- `runtime.json`: actividad de partículas y prueba breve con CPU ×4.
- `dependency-audit.json`: consulta de vulnerabilidades de producción.
- `home-*.png`, `tour-390.png`, capturas de secciones y explorador.
- `inspect.mjs`, `runtime.mjs` y configuración temporal de Playwright para reproducir la inspección.

No se ha validado Safari/WebKit en esta máquina, un teléfono físico, la entrega real del formulario, respuestas reales de Groq, el panel de Vercel, cabeceras de producción ni todos los enlaces externos. No se enviaron mensajes ni se modificaron servicios externos. El cero de vulnerabilidades corresponde únicamente a lo que reportó npm para producción en esta fecha.

Para repetir las mediciones: compilar, servir `dist` con `node scripts/serve.mjs` y ejecutar `PERF_RUNS=3 PERF_OUTPUT=artifacts/audit-2026-09-15/lighthouse node scripts/performance.mjs`. Elegir otra carpeta al comparar cambios para conservar esta referencia. El script usa `/usr/bin/google-chrome` por defecto; permite cambiarlo con `CHROME_PATH`.
