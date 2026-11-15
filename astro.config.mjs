import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  site: 'https://eliecer-code.github.io',
  base: '/eliecer-diaz-cv/',
  vite:{plugins:[tailwindcss()]},
});
