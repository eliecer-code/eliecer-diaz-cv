/** Public repository evidence reviewed on 2026-11-14. No inferred production metrics. */
export const projects = [
  {
    id:'gestalt-sport', title:'Gestalt Sport', variant:'club' as const, featured:true,
    description:'Administración deportiva, en una sola plataforma. Un SaaS que empieza en el voleibol y está pensado para acompañar a otros deportes.',
    tags:['ASP.NET Core','C#','PostgreSQL','React'],
    details:'Plataforma SaaS para administrar clubes deportivos, con el voleibol como punto de partida y una arquitectura pensada para otros deportes. Proyecto presentado en este portfolio; repositorio y demostración pública aún no disponibles.',
  },
  {
    id:'revit',title:'Automatización BIM para Revit',preview:'revit' as const,
    description:'Dos add-ins en C# para automatizar refuerzos de columnas y elementos de confinamiento de muros en Revit 2026.',
    tags:['C#','.NET 8','Revit API','WPF','MVVM'],
    details:'Aceros Columnas separa la lógica geométrica, la generación de estribos y la interfaz WPF. Columnas y Vigas de Muros genera columnetas y viguetas con servicios de geometría y planificación. Ambos proyectos usan .NET 8 y la API de Revit 2026. Son complementos de escritorio; requieren Revit para ejecutarse.',
    repository:'https://github.com/eliecer-code/CQEING_Aceros_Columnas',
    related:'https://github.com/eliecer-code/columnas_vigas',
  },
  {
    id:'survey-saas',title:'SaaS de encuestas',preview:'survey' as const,
    description:'Creación de encuestas y recepción de respuestas mediante enlaces públicos, con una API REST y datos asociados a cada usuario.',
    tags:['Node.js','Express','PostgreSQL','Prisma','React'],
    details:'MVP con frontend React y backend Express organizado en rutas, controladores y servicios. El modelo Prisma relaciona usuarios, encuestas, preguntas y respuestas. Incluye preguntas de valoración, selección y texto, autenticación JWT y consultas por propietario.',
    repository:'https://github.com/eliecer-code/survey-saas',
  },
  {
    id:'cv-creator',title:'Creador de CV profesional',preview:'cv' as const,
    description:'Edición y previsualización del currículum en el navegador, con plantillas y exportación a PDF.',
    tags:['React','Vite','Tailwind CSS','html2pdf.js'],
    details:'Editor con secciones de experiencia, formación y habilidades. Incluye plantillas clásica, moderna y compacta, almacenamiento local y soporte de contenido en español e inglés. La exportación usa html2pdf.js. La traducción automática puede consultar un servicio externo; no se presenta como procesamiento íntegramente local.',
    repository:'https://github.com/eliecer-code/cv-creator',demo:'https://cv-creator-five-gamma.vercel.app',
  },
  {
    id:'fungloria',title:'Fundación La Gloria',preview:'foundation' as const,
    description:'Sitio institucional que presenta la misión, los servicios y los canales de contacto de la fundación.',
    tags:['React','Vite','CSS','AOS'],
    details:'Web organizada en componentes para presentación, misión y visión, servicios, enfoque Una sola salud y contacto. Usa React, estilos CSS y animaciones AOS. El proyecto incorpora optimización de imágenes en su configuración de Vite.',
    repository:'https://github.com/eliecer-code/fungloria',demo:'https://fungloria-seven.vercel.app',
  },
];
