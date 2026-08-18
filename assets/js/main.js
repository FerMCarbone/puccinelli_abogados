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
const STUDY_EMAIL = 'info@puccinelliabogados.com.ar';

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
