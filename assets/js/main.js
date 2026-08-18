document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.getElementById('menuToggle');
const navMobile = document.getElementById('navMobile');

menuToggle.addEventListener('click', () => {
  const isOpen = navMobile.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navMobile.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling;
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    answer.hidden = isOpen;
    button.querySelector('.faq-sign').textContent = isOpen ? '+' : '−';
  });
});

const contactForm = document.getElementById('contactForm');
const formSent = document.getElementById('formSent');
const STUDY_EMAIL = 'puccinelliabogados@gmail.com';

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(contactForm);
  const nombre = (data.get('nombre') || '').toString().trim();
  const telefono = (data.get('telefono') || '').toString().trim();
  const area = (data.get('area') || '').toString().trim();
  const mensaje = (data.get('mensaje') || '').toString().trim();

  const subject = `Consulta legal — ${area} — ${nombre}`;
  const body = [
    `Nombre y apellido: ${nombre}`,
    `Teléfono: ${telefono}`,
    `Área legal: ${area}`,
    '',
    'Mensaje:',
    mensaje,
  ].join('\n');

  const mailtoUrl = `mailto:${STUDY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;

  contactForm.hidden = true;
  formSent.hidden = false;
});

function setupCarousel(trackId, prevId, nextId, dotsId) {
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);
  if (!track) return;

  const cards = [...track.children];
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir a la reseña ${i + 1}`);
    dot.addEventListener('click', () => {
      cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });
    dotsContainer.appendChild(dot);
  });
  const dots = [...dotsContainer.children];

  function updateActiveDot() {
    const trackLeft = track.getBoundingClientRect().left;
    let closestIndex = 0;
    let closestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === closestIndex));
  }

  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveDot, 100);
  });

  function scrollByCards(direction) {
    const cardWidth = cards[0].getBoundingClientRect().width + 24;
    track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  }
  prevBtn.addEventListener('click', () => scrollByCards(-1));
  nextBtn.addEventListener('click', () => scrollByCards(1));
}

setupCarousel('testimoniosTrack', 'testimoniosPrev', 'testimoniosNext', 'testimoniosDots');
