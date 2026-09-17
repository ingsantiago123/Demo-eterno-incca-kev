// index-main.js — index.html (landing principal)
// Extraído tal cual del <script> inline original: sistema de tilt 3D,
// constelación de partículas en canvas, e interacción de tabs de filtro.

// --- 0. Único punto de carga de datos de todo el sitio ---
// Este es el ÚNICO fetch() de toda la experiencia de "Laboratorios
// Externos". Lee Datos/General-labs.json UNA sola vez, lo deja completo en
// window.name de esta pestaña, y recién ahí navega a visor/index.html. A
// partir de ese momento, visor/index.html, visor/programa.html y
// visor/catalogo.html leen y derivan todo de ese mismo window.name — ninguno
// vuelve a tocar la red ni abre ningún otro archivo de Datos/. Es el mismo
// mecanismo que demuestra visor/prueba.html con un <iframe name='{...}'>,
// solo que acá el JSON es el real (no uno escrito a mano) y en vez de un
// iframe se usa una navegación normal (window.name sobrevive igual).
const linkExternos = document.getElementById('entrarLaboratoriosExternos');
if (linkExternos) {
  linkExternos.addEventListener('click', function (e) {
    e.preventDefault();
    const destino = linkExternos.getAttribute('href');
    fetch('Datos/General-labs.json')
      .then(res => res.json())
      .then(laboratorios => {
        window.name = JSON.stringify(laboratorios);
        window.location.href = destino;
      })
      .catch(err => {
        console.error('Error cargando Datos/General-labs.json:', err);
        alert('No se pudieron cargar los laboratorios externos. Verificá que la página se esté sirviendo desde un servidor local.');
      });
  });
}

// --- 1. Interactive 3D Card Tilt System ---
const cards = document.querySelectorAll('.tilt-card');

cards.forEach(card => {
  const parent = card.parentElement;

  parent.addEventListener('mousemove', (e) => {
    const rect = parent.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg
    const rotateY = ((x - centerX) / centerX) * 9;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  parent.addEventListener('mouseleave', () => {
    card.style.transform = `rotateX(0deg) rotateY(0deg) translateY(0px)`;
  });
});

// --- 2. Floating Particle Constellation Canvas with Mouse Waves ---
const canvas = document.getElementById('constellationCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
let mouse = { x: null, y: null, radius: 140 };

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.baseRadius = Math.random() * 2 + 1;
    this.radius = this.baseRadius;
    this.vx = (Math.random() - 0.5) * 0.7;
    this.vy = (Math.random() - 0.5) * 0.7;
    this.color = Math.random() > 0.4 ? 'rgba(0, 116, 220, ' : 'rgba(199, 169, 59, ';
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    // Mouse proximity reaction
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 3;
        this.y -= (dy / dist) * force * 3;
        this.radius = this.baseRadius + force * 2.5;
      } else {
        this.radius = this.baseRadius;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `${this.color}${this.opacity})`;
    ctx.fill();
  }
}

const particleCount = Math.min(Math.floor(window.innerWidth / 18), 75);
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);

  // Connect lines within threshold
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 110) {
        const alpha = (1 - dist / 110) * 0.18;
        ctx.strokeStyle = `rgba(56, 86, 190, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

// --- 3. Filter Tabs Interaction ---
const filterTabs = document.querySelectorAll('.filter-tab');
const cardContainers = document.querySelectorAll('.card-perspective');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => {
      t.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm', 'font-bold');
      t.classList.add('text-on-surface-variant', 'font-medium');
    });
    tab.classList.add('bg-primary', 'text-on-primary', 'shadow-sm', 'font-bold');
    tab.classList.remove('text-on-surface-variant', 'font-medium');

    const filter = tab.getAttribute('data-filter');
    cardContainers.forEach(c => {
      const cat = c.getAttribute('data-category');
      if (filter === 'all' || filter === cat) {
        c.style.display = 'block';
        setTimeout(() => {
          c.style.opacity = '1';
          c.style.transform = 'scale(1)';
        }, 50);
      } else {
        c.style.opacity = '0';
        c.style.transform = 'scale(0.95)';
        setTimeout(() => {
          c.style.display = 'none';
        }, 200);
      }
    });
  });
});
