// Configuración de Tailwind (vía CDN) para index.html. Debe cargarse
// DESPUÉS del <script src="https://cdn.tailwindcss.com"> y ANTES de
// cualquier contenido que dependa de estas utilidades personalizadas.
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "tertiary-fixed-dim": "#e4c454",
        "surface-container-lowest": "#ffffff",
        "outline": "#747684",
        "primary-container": "#0b349d",
        "on-secondary": "#ffffff",
        "on-surface-variant": "#444653",
        "on-tertiary-fixed": "#231b00",
        "on-tertiary-container": "#4d3e00",
        "surface-tint": "#3856be",
        "on-surface": "#0f1742",
        "surface-dim": "#d3d8ff",
        "primary": "#002071",
        "outline-variant": "#c4c5d5",
        "tertiary-fixed": "#ffe17b",
        "surface-container-low": "#f4f2ff",
        "secondary-fixed": "#d5e3ff",
        "surface-container-highest": "#dee0ff",
        "error": "#ba1a1a",
        "on-secondary-fixed": "#001b3c",
        "on-primary-fixed-variant": "#193da5",
        "secondary-fixed-dim": "#a8c8ff",
        "on-primary": "#ffffff",
        "surface": "#fbf8ff",
        "on-tertiary-fixed-variant": "#564500",
        "on-tertiary": "#ffffff",
        "surface-container": "#ececff",
        "on-primary-container": "#90a6ff",
        "inverse-surface": "#252d58",
        "inverse-primary": "#b7c4ff",
        "primary-fixed-dim": "#b7c4ff",
        "background": "#fbf8ff",
        "surface-variant": "#dee0ff",
        "on-background": "#0f1742",
        "secondary-container": "#0074dc",
        "surface-container-high": "#e5e6ff",
        "inverse-on-surface": "#f0efff",
        "secondary": "#005bb0",
        "error-container": "#ffdad6",
        "on-primary-fixed": "#001551",
        "primary-fixed": "#dce1ff",
        "on-secondary-container": "#fefcff",
        "tertiary": "#715c00",
        "on-secondary-fixed-variant": "#00468a",
        "on-error": "#ffffff",
        "tertiary-container": "#c7a93b",
        "on-error-container": "#93000a",
        "surface-bright": "#fbf8ff"
      },
      "borderRadius": {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      "fontFamily": {
        "headline": ["Outfit", "sans-serif"],
        "body": ["Roboto Flex", "sans-serif"],
        "code-num": ["Roboto Flex", "monospace"]
      }
    }
  }
}
