export type Language = 'es' | 'en';
const translations: Record<string, string> = {
  'Saltar al contenido':'Skip to content','Navegación principal':'Main navigation','Eliecer Díaz, inicio':'Eliecer Díaz, home',
  'Menú':'Menu','Sobre mí':'About me','Experiencia':'Experience','Proyectos':'Projects','Contacto':'Contact',
  'Ingeniero de software /':'Software engineer /','Desarrollador backend':'Backend developer','Explorar proyectos':'Explore projects',
  'Descargar CV':'Download CV','Consultar CV':'View résumé','Composición de interfaces conceptuales y código':'Composition of conceptual interfaces and code',
  'Servicio conectado':'Service connected','Una arquitectura.':'One architecture.','Muchas posibilidades.':'Many possibilities.',
  'Cliente':'Client','Interfaz → Lógica → Datos':'Interface → Logic → Data','Más allá del código':'Beyond the code','CO / INGENIERÍA DE SOFTWARE':'CO / SOFTWARE ENGINEERING',
  'Ideas claras. Soluciones sólidas.':'Clear ideas. Solid solutions.','La lógica detrás':'The logic behind','de una buena':'a great','experiencia.':'experience.',
  'Soy Eliecer Enrique Díaz Arrieta, ingeniero de Sistemas y desarrollador backend. Me interesa lo que ocurre detrás de cada interacción: la lógica, los datos y las decisiones que hacen funcionar una aplicación.':'I’m Eliecer Enrique Díaz Arrieta, a Systems Engineer and backend developer. I’m interested in what happens behind every interaction: the logic, data and decisions that make an application work.',
  'Mi especialidad es el desarrollo con C# y ASP.NET Core, las APIs REST y las bases de datos relacionales. Conecto esas piezas con interfaces web y una arquitectura pensada para evolucionar.':'I specialize in C# and ASP.NET Core development, REST APIs and relational databases. I connect those pieces with web interfaces and architecture designed to evolve.',
  'Conoce mi recorrido':'Explore my journey','Un recorrido en construcción constante.':'A journey of continuous growth.',
  'Desarrollador de software junior':'Junior software developer','Desarrollador de software':'Software developer','Desarrollador full stack':'Full stack developer',
  'Primera etapa profesional en desarrollo de software. Una base para seguir profundizando en la construcción y el mantenimiento de aplicaciones.':'My first professional stage in software development. A foundation for continuing to explore application development and maintenance.',
  'Desarrollo de software en el contexto de proyectos de ingeniería.':'Software development in the context of engineering projects.',
  'Desarrollo independiente de aplicaciones web, conectando interfaces y servicios backend.':'Independent web application development, connecting interfaces and backend services.',
  'Los detalles de responsabilidades y tecnologías de esta etapa se incorporarán con el CV completo.':'Details of responsibilities and technologies from this stage will be added with the complete résumé.',
  'Proyectos seleccionados':'Selected projects','Del problema a la aplicación.':'From problem to application.','Explorar todos los repositorios':'Explore all repositories',
  'Especialización técnica':'Technical expertise','Las herramientas detrás del trabajo.':'The tools behind the work.','Bases de datos':'Databases','Herramientas y otros':'Tools and more',
  'Currículum':'Résumé','Formación y trayectoria.':'Education and experience.','Ingeniería':'Systems','de Sistemas':'Engineering',
  'Desarrollo backend, bases de datos relacionales y aplicaciones web.':'Backend development, relational databases and web applications.',
  'Experiencia en Comsodes, CQ e Ingenieros y desarrollo freelance.':'Experience at Comsodes, CQ e Ingenieros and in freelance development.',
  'Currículum en PDF · 4,1 MB':'PDF résumé · 4.1 MB','¿Construimos':'Let’s build','algo':'something','juntos?':'together.',
  'Una idea, un proyecto o una conversación.':'An idea, a project or a conversation.','El siguiente paso empieza aquí.':'The next step starts here.',
  'Diseñado con intención. Construido con código.':'Designed with intention. Built with code.','Volver al inicio':'Back to top',
  'Vista conceptual':'Conceptual preview','Resumen':'Overview','Equipos':'Teams','Calendario':'Calendar','Administración':'Administration',
  'Espacio de trabajo':'Workspace','Tu espacio de trabajo':'Your workspace','Todo en su lugar.':'Everything in its place.','Vista general':'Overview','Actividad':'Activity','Esta semana':'This week',
  'DEL PLAN A LA ENTREGA':'FROM PLAN TO DELIVERY','DENTRO Y FUERA DE LA CANCHA':'ON AND OFF THE COURT',
  'Cada proyecto, conectado.':'Every project, connected.','Más equipo. Menos gestión.':'More teamwork. Less admin.','Organiza lo que mueve a tu equipo.':'Organize what drives your team.',
  'Proyectos en curso':'Ongoing projects','Tus equipos':'Your teams','Ver todos':'View all','Activo':'Active','En revisión':'Under review','Ver detalle':'View details',
  'Una plataforma. Todo conectado.':'One platform. Everything connected.','Equipo femenino · Sub 18':'Women’s team · Under 18','Equipo masculino · Mayores':'Men’s team · Seniors','Equipo mixto · Formación':'Mixed team · Development',
  'Gestión de proyectos':'Project management','Academia de fútbol':'Football academy','Diseño y planificación':'Design and planning','Desarrollo del proyecto':'Project development','Revisión y entrega':'Review and delivery',
  'Categoría Sub 12':'Under 12','Categoría Sub 15':'Under 15','Categoría Sub 18':'Under 18',
  'Explorar proyecto':'Explore project','VISTA CONCEPTUAL · NO ES UNA CAPTURA DEL PRODUCTO':'CONCEPTUAL PREVIEW · NOT A PRODUCT SCREENSHOT',
  'Ver sitio':'Visit website','Código en GitHub':'Code on GitHub','Columnetas y viguetas':'Tie columns and beams','Acerca del proyecto':'About the project',
  'Las funciones y tecnologías se documentan en el repositorio enlazado. La composición visual es conceptual.':'Features and technologies are documented in the linked repository. The visual composition is conceptual.',
  'Vista conceptual del proyecto. El código y la demo aún no tienen enlaces públicos en este portfolio.':'Conceptual project preview. Public code and demo links are not yet available in this portfolio.',
  'Administración deportiva, en una sola plataforma. Un SaaS que empieza en el voleibol y está pensado para acompañar a otros deportes.':'Sports administration in one platform. A SaaS starting with volleyball and designed to support other sports.',
  'Plataforma SaaS para administrar clubes deportivos, con el voleibol como punto de partida y una arquitectura pensada para otros deportes. Proyecto presentado en este portfolio; repositorio y demostración pública aún no disponibles.':'A SaaS platform for managing sports clubs, starting with volleyball and an architecture designed for other sports. A project presented in this portfolio; a public repository and demo are not yet available.',
  'Automatización BIM para Revit':'BIM automation for Revit','Dos add-ins en C# para automatizar refuerzos de columnas y elementos de confinamiento de muros en Revit 2026.':'Two C# add-ins to automate column reinforcement and wall confinement elements in Revit 2026.',
  'Aceros Columnas separa la lógica geométrica, la generación de estribos y la interfaz WPF. Columnas y Vigas de Muros genera columnetas y viguetas con servicios de geometría y planificación. Ambos proyectos usan .NET 8 y la API de Revit 2026. Son complementos de escritorio; requieren Revit para ejecutarse.':'Aceros Columnas separates geometric logic, stirrup generation and the WPF interface. Columnas y Vigas de Muros generates tie columns and beams using geometry and planning services. Both projects use .NET 8 and the Revit 2026 API. These desktop add-ins require Revit to run.',
  'SaaS de encuestas':'Survey SaaS','Creación de encuestas y recepción de respuestas mediante enlaces públicos, con una API REST y datos asociados a cada usuario.':'Survey creation and response collection through public links, with a REST API and data associated with each user.',
  'MVP con frontend React y backend Express organizado en rutas, controladores y servicios. El modelo Prisma relaciona usuarios, encuestas, preguntas y respuestas. Incluye preguntas de valoración, selección y texto, autenticación JWT y consultas por propietario.':'An MVP with a React frontend and an Express backend organized into routes, controllers and services. The Prisma model connects users, surveys, questions and responses. It includes rating, choice and text questions, JWT authentication and owner-scoped queries.',
  'Creador de CV profesional':'Professional résumé builder','Edición y previsualización del currículum en el navegador, con plantillas y exportación a PDF.':'Edit and preview a résumé in the browser, with templates and PDF export.',
  'Editor con secciones de experiencia, formación y habilidades. Incluye plantillas clásica, moderna y compacta, almacenamiento local y soporte de contenido en español e inglés. La exportación usa html2pdf.js. La traducción automática puede consultar un servicio externo; no se presenta como procesamiento íntegramente local.':'An editor with experience, education and skills sections. Includes classic, modern and compact templates, local storage and Spanish and English content support. Export uses html2pdf.js. Automatic translation may contact an external service; it is not presented as entirely local processing.',
  'Sitio institucional que presenta la misión, los servicios y los canales de contacto de la fundación.':'An institutional website presenting the foundation’s mission, services and contact channels.',
  'Web organizada en componentes para presentación, misión y visión, servicios, enfoque Una sola salud y contacto. Usa React, estilos CSS y animaciones AOS. El proyecto incorpora optimización de imágenes en su configuración de Vite.':'A component-based website covering introduction, mission and vision, services, the One Health approach and contact. Uses React, CSS and AOS animations. The project includes image optimization in its Vite configuration.',
  'Automatización BIM':'BIM automation','De la geometría al modelo.':'From geometry to model.','Interfaz WPF / MVVM':'WPF / MVVM interface','Servicios de geometría':'Geometry services','Generación con Revit API':'Generation with Revit API','C# / .NET 8 / API de Revit':'C# / .NET 8 / Revit API',
  'Encuestas':'Surveys','survey-saas · aplicación web':'survey-saas · web application','Preguntar. Escuchar. Entender.':'Ask. Listen. Understand.','Valoración':'Rating','Selección múltiple':'Multiple choice','Respuesta abierta':'Open response',
  'Tu próximo paso':'Your next step','cv-creator · editor de currículum':'cv-creator · résumé editor','Tu trayectoria, bien contada.':'Your journey, well told.','Información personal':'Personal information','Experiencia profesional':'Professional experience','Educación y habilidades':'Education and skills','Edición / Vista previa / Exportación PDF':'Editing / Preview / PDF export',
  'fungloria · sitio institucional':'fungloria · institutional website','Salvando vidas.':'Saving lives.','Nuestra misión':'Our mission','Servicios a la comunidad':'Community services','Una sola salud':'One Health','React / CSS / Animaciones AOS':'React / CSS / AOS animations',
  'Tu nombre':'Your name','Perfil profesional':'Professional profile','Formación':'Education','Selección de elementos':'Element selection','Análisis geométrico':'Geometric analysis','Generación en el modelo':'Model generation',
  'Vista de respuesta':'Response preview','¿Cómo fue tu experiencia?':'How was your experience?','Pregunta de valoración · Ejemplo':'Rating question · Example','Comprensión.':'Understanding.','Inclusión.':'Inclusion.','Esperanza.':'Hope.',
  'Idioma':'Language','Cambiar a español':'Switch to Spanish','Cambiar a inglés':'Switch to English','Cambiar tema':'Switch theme',
  'Portfolio de Eliecer Enrique Díaz Arrieta. Ingeniero de Sistemas y desarrollador backend especializado en C#, ASP.NET Core y PostgreSQL.':'Portfolio of Eliecer Enrique Díaz Arrieta. Systems Engineer and backend developer specializing in C#, ASP.NET Core and PostgreSQL.',
  'Eliecer Díaz — Desarrollador backend':'Eliecer Díaz — Backend developer','Eliecer Díaz — Ingeniería detrás de la experiencia':'Eliecer Díaz — Engineering behind the experience','Desarrollo backend, aplicaciones web y soluciones con intención.':'Backend development, web applications and solutions with intention.',
};
const storageKey = 'portfolio-language';
const textSources = new WeakMap<Text, string>();
const attributeSources = new WeakMap<Element, Map<string, string>>();
let language: Language = 'es';
let page: AbortController | undefined;
let lifecycle: AbortController | undefined;
let mountedBody: HTMLElement | undefined;
function translate(source: string): string {
  if (translations[source]) return translations[source];
  const caption = source.match(/^(\d+\s*\/\s*)(VISTA CONCEPTUAL · NO ES UNA CAPTURA DEL PRODUCTO)$/);
  if (caption) return caption[1] + translations[caption[2]];
  for (const [prefix, english] of [['Explorar ', 'Explore '], ['Ver detalles de ', 'View details of ']]) {
    if (source.startsWith(prefix)) { const title = source.slice(prefix.length); return english + (translations[title] ?? title); }
  }
  return source;
}
function savedLanguage(): Language {
  try { return localStorage.getItem(storageKey) === 'en' ? 'en' : 'es'; } catch { return 'es'; }
}
export function setLanguage(value: Language, persist = true): void {
  language = value;
  document.documentElement.lang = value;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node as Text;
    if (text.parentElement?.closest('script,style,pre,code,noscript,[data-language-control]')) continue;
    if (!textSources.has(text)) textSources.set(text, text.data);
    const original = textSources.get(text)!;
    const content = original.trim();
    text.data = value === 'en' && content ? original.replace(content, translate(content)) : original;
  }
  document.querySelectorAll('[aria-label],[title],[alt],title,meta[name="description"],meta[property^="og:"]').forEach(element => {
    let sources = attributeSources.get(element);
    if (!sources) { sources = new Map(); attributeSources.set(element, sources); }
    for (const attribute of ['aria-label', 'title', 'alt', ...(element.tagName === 'META' ? ['content'] : [])]) {
      const current = element.getAttribute(attribute);
      if (current === null) continue;
      if (!sources.has(attribute)) sources.set(attribute, current);
      const original = sources.get(attribute)!;
      element.setAttribute(attribute, value === 'en' ? translate(original) : original);
    }
    if (element.tagName === 'TITLE') {
      if (!sources.has('text')) sources.set('text', element.textContent ?? '');
      element.textContent = value === 'en' ? translate(sources.get('text')!) : sources.get('text')!;
    }
  });
  document.querySelectorAll<HTMLButtonElement>('[data-set-language]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.setLanguage === value));
  });
  if (persist) { try { localStorage.setItem(storageKey, value); } catch { /* Storage may be unavailable in private contexts. */ } }
  document.dispatchEvent(new CustomEvent('portfolio:language-change', { detail: { language: value } }));
}
function mount(): void {
  if (mountedBody === document.body && page) return;
  unmount();
  page = new AbortController(); mountedBody = document.body;
  document.querySelectorAll<HTMLButtonElement>('[data-set-language]').forEach(button => {
    button.addEventListener('click', () => setLanguage(button.dataset.setLanguage === 'en' ? 'en' : 'es'), { signal: page!.signal });
  });
  setLanguage(savedLanguage(), false);
}
function unmount(): void { page?.abort(); page = undefined; mountedBody = undefined; }
export function initLanguage(): void {
  if (!lifecycle) {
    lifecycle = new AbortController(); const { signal } = lifecycle;
    document.addEventListener('astro:page-load', mount, { signal });
    document.addEventListener('astro:before-swap', unmount, { signal });
    window.addEventListener('pagehide', unmount, { signal });
    window.addEventListener('pageshow', mount, { signal });
    window.addEventListener('storage', event => { if (event.key === storageKey) setLanguage(savedLanguage(), false); }, { signal });
  }
  mount();
}
export function destroyLanguage(): void { unmount(); lifecycle?.abort(); lifecycle = undefined; }
export function getLanguage(): Language { return language; }
if (import.meta.hot) import.meta.hot.dispose(destroyLanguage);
