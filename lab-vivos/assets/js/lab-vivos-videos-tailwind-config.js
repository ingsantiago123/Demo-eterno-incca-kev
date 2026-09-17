// Configuración de Tailwind (vía CDN) para lab-vivos-videos.html. Debe
// cargarse DESPUÉS del <script src="https://cdn.tailwindcss.com"> y ANTES
// de cualquier contenido que dependa de estas utilidades personalizadas.
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        oxford: '#091E42',
        navytext: '#0F172A',
        skyaction: '#0284C7',
        skyhover: '#0EA5E9',
        cyanlight: '#38BDF8',
        cyanbg: '#E0F2FE',
        borderlight: '#BAE6FD'
      }
    }
  }
}
