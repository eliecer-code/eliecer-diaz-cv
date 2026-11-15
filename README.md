# Portfolio de Eliecer Díaz

Astro, TypeScript y Tailwind CSS. Componentes de interfaces conceptuales, proyectos y enlaces SVG reutilizables. Fuentes servidas localmente mediante Fontsource.

```sh
npm install
npm run dev
npm run check
npm run build
```

La salida estática queda en `dist/`. Se puede alojar en cualquier servicio de hosting estático.

## Antes de publicar

- El CV está disponible en public/cv/hv-eliecerdiaz.pdf; reemplazar ese archivo para actualizarlo.
- Confirmar las responsabilidades laborales y añadir capturas reales de los productos. Los proyectos públicos y sus fuentes están documentados en docs/project-sources.md.
- Reemplazar las vistas conceptuales por capturas reales cuando estén disponibles.
- Añadir URL canónica y metadatos sociales definitivos al conocer el dominio.

Contacto real: GitHub eliecer-code, LinkedIn eliecerdiar y eliecer.diaz97@outlook.com.

## Partículas interactivas

Implementadas con **particles.js 2.0.0**, de Vincent Garreau (MIT), fijada en package.json. La copia original se sirve en `public/vendor/particles.js`, junto a su licencia. Se carga una sola vez como script clásico: la biblioteca usa APIs legacy incompatibles con modo estricto ESM. No depende de un CDN.

`ParticleCanvas.astro` admite `radial`, `constellation`, `magnetic-grid`, `displacement`, `timeline` y `attraction`. Cada contenedor `.particle-host` conserva sus zonas `data-particle-exclude`. `ParticlePresets.ts` configura las opciones nativas de particles.js. El adaptador utiliza las partículas, modos interactivos y dibujo de la biblioteca; organiza las posiciones iniciales y aporta seguimiento acotado por profundidad.

El manager comparte un rAF entre las instancias visibles. Se desactivan los listeners y bucles internos de la biblioteca para gestionar coordenadas desde el host sin bloquear enlaces; ResizeObserver actualiza geometría y exclusiones. Fuera del viewport o con la pestaña oculta se pausa. Reduced motion y puntero coarse activan una composición estática; una ventana estrecha con mouse mantiene interacción y usa menor densidad. DPR fijo en 1 para limitar el coste del renderizado de varias instancias.

La limpieza elimina únicamente la instancia propia de `pJSDom`, sus recursos y su canvas; no se utiliza el destructor global de la biblioteca, que afectaría a otras secciones. Se contemplan Astro, HMR y bfcache. Currículum permanece sin partículas.

### Verificación

```sh
node scripts/test-particles.mjs
npm run check
npm run build
```

Las pruebas usan el código real de particles.js en una VM con DOM/Canvas simulados para comprobar integración y ciclo de vida. No sustituyen mediciones de FPS, GPU, batería o heap en dispositivos físicos. Los presets con atracción o grid añaden comportamiento del adaptador: no son modos nativos de particles.js.
## GitHub Pages

Destino configurado: https://eliecer-code.github.io/eliecer-diaz-cv/ . La publicación se realiza desde main mediante .github/workflows/deploy.yml. Cada push ejecuta pruebas, chequeo de tipos y build antes de desplegar. En local, abrir /eliecer-diaz-cv/ .

## Actualizar proyectos

Editar src/data/projects.ts. Las vistas conceptuales se definen en SoftwarePreview.astro; cada proyecto admite enlaces de repositorio, demo y un repositorio relacionado. Mantener las descripciones respaldadas por las fuentes de docs/project-sources.md.

Preferencias: el icono de tema alterna claro/oscuro con View Transitions (onda en navegadores compatibles; instantáneo con movimiento reducido). ES/EN traduce textos y atributos de accesibilidad en cliente. Ambas preferencias se guardan localmente; el PDF descargable conserva su idioma original.
