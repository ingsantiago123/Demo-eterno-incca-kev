// Configuración de Tailwind (vía CDN) para lab-vivos-index.html. Debe
// cargarse DESPUÉS del <script src="https://cdn.tailwindcss.com"> y ANTES
// de cualquier contenido que dependa de estas utilidades personalizadas.
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif']
      }
    }
  }
}
