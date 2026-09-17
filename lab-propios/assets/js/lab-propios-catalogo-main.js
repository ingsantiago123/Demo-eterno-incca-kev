// lab-propios-catalogo-main.js — lab-propios-catalogo.html (catálogo + ficha técnica)
// JavaScript interactivo (Filtro por categoría + Modal dinámico)

// Datos concisos de cada laboratorio propio
const labsData = [
  {
    title: "Laboratorio de Redes Cisco & Clúster de Servidores",
    category: "Redes & Sistemas",
    categoryKey: "sistemas",
    location: "Edificio Central • Sala 402",
    description: "Espacio especializado para el diseño, simulación y despliegue físico de infraestructuras de red corporativa, enrutamiento dinámico multihoming (BGP, OSPF) y auditoría de seguridad perimetral sobre enlaces reales.",
    equipment: ["Racks Cisco Catalyst 2960", "Routers Cisco 2901", "Servidores Blade ProLiant", "Analizador de paquetes Wireshark Tap", "Patch panels categoría 6A"],
    capacity: "24 Estudiantes",
    career: "Ing. Sistemas"
  },
  {
    title: "Banco de Desarrollo FPGA & Sistemas Embebidos IoT",
    category: "IoT & Microelectrónica",
    categoryKey: "sistemas",
    location: "Edificio Tecnológico • Sala 305",
    description: "Laboratorio destinado a la síntesis digital en hardware con lógica programable FPGA, programación en VHDL/Verilog y desarrollo de nodos sensoriales inalámbricos de bajo consumo energético.",
    equipment: ["Tarjetas Xilinx Artix-7", "Analizadores Lógicos 16 canales", "Kits ARM Cortex-M4", "Osciloscopios USB Mixed Signal", "Bancos de soldadura SMD con control térmico"],
    capacity: "18 Estudiantes",
    career: "Sistemas y Electrónica"
  },
  {
    title: "Túnel Aerodinámico & Banco de Termodinámica",
    category: "Mecánica de Fluidos",
    categoryKey: "mecanica",
    location: "Nave Mecánica • Edificio C",
    description: "Permite la experimentación cuantitativa de sustentación y arrastre sobre perfiles aerodinámicos a escala, cálculo de coeficientes de transferencia de calor y modelación de flujo subsónico continuo.",
    equipment: ["Túnel subsónico instrumentado", "Sonda Pitot diferencial digital", "Intercambiador de calor tubos y coraza", "Sensores de presión piezorresistivos", "Anemómetro de hilo caliente"],
    capacity: "16 Estudiantes",
    career: "Ing. Mecánica"
  },
  {
    title: "Planta Piloto CNC & Ensayo Universal de Materiales",
    category: "Mecanizado & Ensayos",
    categoryKey: "mecanica",
    location: "Taller Industrial • Sala 101",
    description: "Centro de manufactura computarizada para mecanizado de piezas de alta precisión y evaluación destructiva de propiedades mecánicas: tracción, compresión, torsión y resiliencia de metales y polímeros.",
    equipment: ["Centro de Mecanizado CNC 3 ejes", "Torno CNC con control numérico", "Máquina Universal de Ensayos 100kN", "Durómetro Rockwell digital", "Proyectores de perfiles ópticos"],
    capacity: "20 Estudiantes",
    career: "Mecánica e Industrial"
  },
  {
    title: "Laboratorio de Alta Frecuencia & Electrónica de Potencia",
    category: "Osciloscopía & RF",
    categoryKey: "electronica",
    location: "Edificio Central • Sala 204",
    description: "Área de análisis y calibración de circuitos de conmutación de alta eficiencia energética (inversores, convertidores DC-DC) y medición de parámetros electromagnéticos en guías de onda y líneas de transmisión.",
    equipment: ["Osciloscopios 200MHz 4 canales", "Generadores de formas de onda arbitrarias", "Analizador de espectros RF hasta 3GHz", "Fuentes DC triples programables", "Puente RLC de precisión"],
    capacity: "20 Estudiantes",
    career: "Ing. Electrónica"
  },
  {
    title: "Laboratorio de Biorreactores & Bioprocesos Celulares",
    category: "Microbiología & Bioprocesos",
    categoryKey: "biologia",
    location: "Laboratorios Húmedos • Sala B-12",
    description: "Ambiente controlado para la cinética de crecimiento microbiano, fermentación automatizada, control estricto de parámetros fisicoquímicos en biomasa y formulación de bioensayos ambientales.",
    equipment: ["Biorreactores automatizados de 5L", "Cabina de bioseguridad Clase II A2", "Microscopios trinoculares con epifluorescencia", "Autoclave digital vertical", "Incubadora con agitación orbital"],
    capacity: "22 Estudiantes",
    career: "Biología y Ciencias"
  }
];

// Filtrar por categoría
function filterCategory(cat, btn) {
  document.querySelectorAll('.category-btn').forEach(b => {
    b.classList.remove('bg-black', 'text-white');
    b.classList.add('bg-white', 'text-black');
  });
  btn.classList.add('bg-black', 'text-white');
  btn.classList.remove('bg-white', 'text-black');

  const cards = document.querySelectorAll('.lab-card');
  cards.forEach(card => {
    const itemCat = card.getAttribute('data-category');
    if (cat === 'all' || itemCat === cat) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Modal popup control
function openLabModal(index) {
  const data = labsData[index];
  if (!data) return;

  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalCategoryBadge').textContent = data.category;
  document.getElementById('modalLocationText').textContent = data.location;
  document.getElementById('modalDescription').textContent = data.description;
  document.getElementById('modalCapacidad').textContent = data.capacity;
  document.getElementById('modalCarrera').textContent = data.career;

  // Render equipment chips con estilo wireframe
  const eqContainer = document.getElementById('modalEquipmentList');
  eqContainer.innerHTML = '';
  data.equipment.forEach(item => {
    const chip = document.createElement('span');
    chip.className = 'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-black border-2 border-black';
    chip.textContent = item;
    eqContainer.appendChild(chip);
  });

  const modal = document.getElementById('labModal');
  modal.classList.remove('hidden-modal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLabModal() {
  const modal = document.getElementById('labModal');
  modal.classList.add('hidden-modal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Cerrar al dar click en backdrop
document.getElementById('labModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeLabModal();
  }
});

// Cerrar con Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeLabModal();
  }
});
