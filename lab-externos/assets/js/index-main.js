// index-main.js — "anfitrión" del selector de programa (lab-externos/index-lab-externos.html)
//
// Esta pantalla es un anfitrión independiente, con su propio fetch() a
// Datos/Programas.json y Datos/General-labs.json — "por su propio json",
// igual que cualquier otra colección (Vivos, Propios, cuando existan). No
// depende de lo que haya hecho visor/index.html (pantalla 1) antes: se llega
// acá por un link normal, sin nada precargado en window.name.
//
// Donde SÍ aplica el patrón de visor-instrucciones.md es en el siguiente
// salto: al elegir un programa, arma el JSON con el contrato de datos del
// visor y lo deja en window.name antes de navegar a ../visor/catalogo.html
// — ese archivo (el "visor puro") no vuelve a tocar la red.

// Íconos representativos por programa (fallback genérico si no hay coincidencia)
const ICONOS_PROGRAMA = {
  'Administración de Empresas': 'fa-briefcase',
  'Biología': 'fa-dna',
  'Contaduría Pública': 'fa-file-invoice-dollar',
  'Cultura Física y Deporte': 'fa-person-running',
  'Derecho': 'fa-scale-balanced',
  'Esp. Gestión Agroindustrial': 'fa-seedling',
  'Esp. Gestión Ambiental': 'fa-leaf',
  'Esp. Gestión de la Producción Sostenible': 'fa-recycle',
  'Ingeniería de Alimentos': 'fa-utensils',
  'Ingeniería de Sistemas': 'fa-cloud-nodes',
  'Ingeniería Electrónica': 'fa-microchip',
  'Ingeniería Industrial': 'fa-industry',
  'Ingeniería Mecánica': 'fa-cubes-stacked',
  'Música': 'fa-music'
};
const ICONO_DEFAULT = 'fa-flask-vial';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function construirTarjetaPrograma(programa, laboratorios) {
  const icono = ICONOS_PROGRAMA[programa] || ICONO_DEFAULT;

  // Orígenes / plataformas únicos de los laboratorios de este programa
  const origenes = [];
  laboratorios.forEach(lab => {
    const origen = (lab['Origen / Plataforma'] || '').trim();
    if (origen && !origenes.includes(origen)) origenes.push(origen);
  });
  const textoOrigenes = origenes.length
    ? `En este programa puedes encontrar laboratorios de: ${origenes.join(', ')}. Entra para descubrir qué ofrecemos.`
    : 'Próximamente encontrarás aquí laboratorios externos disponibles para este programa.';

  const totalLabs = laboratorios.length;
  const textoConteo = `${totalLabs} Laboratorio${totalLabs === 1 ? '' : 's'} Disponible${totalLabs === 1 ? '' : 's'}`;

  return `
      <div class="bg-white border-2 border-black rounded-xl p-6 flex flex-col justify-between text-black transition-none">
        <div>
          <div class="flex items-center justify-between mb-5">
            <div class="w-12 h-12 rounded-lg bg-white border-2 border-black text-black flex items-center justify-center text-xl">
              <i class="fa-solid ${icono}"></i>
            </div>
            <span class="px-3 py-1 rounded-md bg-white border-2 border-black text-black text-xs font-bold uppercase">Programas</span>
          </div>
          <h2 class="text-xl font-bold text-black mb-2">${escapeHtml(programa)}</h2>
          <p class="text-black text-sm leading-relaxed mb-6 font-normal">${escapeHtml(textoOrigenes)}</p>
        </div>
        <div class="pt-4 border-t-2 border-black flex items-center justify-between text-xs">
          <div class="flex items-center gap-2 text-black font-semibold"><i class="fa-solid fa-flask-vial"></i><span>${textoConteo}</span></div>
          <a class="inline-flex items-center gap-1.5 font-bold text-black hover:underline" href="../visor/catalogo.html" data-programa="${escapeHtml(programa)}"><span>Ingresar</span><i class="fa-solid fa-chevron-right text-[11px]"></i></a>
        </div>
      </div>`;
}

// Convierte los labs (tal cual vienen de General-labs.json) al contrato de
// datos del visor (ver lab-externos/visor/README.md): objeto raíz + items[]
// tipados. Esto es lo único que el visor recibe — nunca ve el JSON crudo.
function construirPayloadVisor(programa, laboratorios) {
  return {
    titulo: `Laboratorios de ${programa}`,
    subtitulo: 'Red de Convenios & Plataformas Externas',
    descripcion: '',
    volver_url: '../lab-externos/index-lab-externos.html',
    items: laboratorios.map((lab, idx) => ({
      // Number.isFinite (no solo != null): si "No." llegara vacío o con un
      // valor no numérico, cada item igual necesita un id único dentro de
      // ESTE payload (basta con eso, no tiene que ser único en todo el JSON).
      id: `lab-${Number.isFinite(lab['No.']) ? lab['No.'] : idx + 1}`,
      tipo: 'laboratorio',
      visible: true,
      orden: idx,
      nombre: lab['Nombre del Laboratorio'] || '',
      categoria: lab['Categoría'] || '',
      origen: lab['Origen / Plataforma'] || '',
      aplicaA: lab['Aplica a'] || '',
      descripcion: lab['Descripción '] || '',
      materias: lab['Materias'] || '',
      modalidad: lab['Compatible con Moodle'] || '',
      costo: lab['Costo'] || '',
      link: lab['Link del Recurso'] || '',
      imagen: lab['imagen'] || ''
    }))
  };
}

async function cargarProgramas() {
  const grid = document.getElementById('programsGrid');
  try {
    const [programasRes, labsRes] = await Promise.all([
      fetch('../Datos/Programas.json'),
      fetch('../Datos/General-labs.json')
    ]);
    const programas = await programasRes.json();
    const laboratorios = await labsRes.json();

    // Labs por programa, calculados una sola vez y reutilizados tanto para
    // pintar la tarjeta como para armar el payload del visor al hacer click.
    const labsPorPrograma = new Map();
    programas.forEach(programa => {
      const labsDelPrograma = laboratorios.filter(lab => {
        const lista = (lab['Programa(s)'] || '')
          .split(/[,;]/)
          .map(p => p.trim());
        return lista.includes(programa);
      });
      labsPorPrograma.set(programa, labsDelPrograma);
    });

    grid.innerHTML = programas
      .map(programa => construirTarjetaPrograma(programa, labsPorPrograma.get(programa) || []))
      .join('');

    // Antes de que el navegador siga el link "Ingresar", dejamos el JSON del
    // programa elegido en window.name de ESTA misma pestaña. Al navegar a
    // ../visor/catalogo.html, ese valor persiste (window.name sobrevive a la
    // navegación dentro del mismo frame) y el visor lo lee sin volver a pedir
    // nada por red.
    grid.querySelectorAll('a[data-programa]').forEach(enlace => {
      enlace.addEventListener('click', () => {
        const programa = enlace.getAttribute('data-programa');
        const laboratorios = labsPorPrograma.get(programa) || [];
        window.name = JSON.stringify(construirPayloadVisor(programa, laboratorios));
      });
    });
  } catch (err) {
    console.error('Error cargando datos de programas/laboratorios:', err);
    grid.innerHTML = '<p class="col-span-full text-center text-black font-semibold text-sm py-8">No se pudieron cargar los programas. Verifica que la página se esté sirviendo desde un servidor local.</p>';
  }
}

cargarProgramas();
