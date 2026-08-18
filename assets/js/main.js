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
const formError = document.getElementById('formError');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(contactForm);
  const nombre = (data.get('nombre') || '').toString().trim();
  const area = (data.get('area') || '').toString().trim();
  data.set('subject', `Consulta legal — ${area} — ${nombre}`);

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';
  formError.hidden = true;

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data,
    });
    const result = await response.json();

    if (result.success) {
      contactForm.hidden = true;
      formSent.hidden = false;
    } else {
      throw new Error(result.message || 'Error al enviar');
    }
  } catch (err) {
    formError.hidden = false;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
});

function setupCarousel(trackId, prevId, nextId, dotsId) {
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);
  if (!track) return;

  const cards = [...track.children];
  let dots = [];

  function cardsPerView() {
    const cardWidth = cards[0].getBoundingClientRect().width + 24;
    return Math.max(1, Math.round((track.clientWidth + 24) / cardWidth));
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const reachable = Math.max(1, cards.length - cardsPerView() + 1);
    for (let i = 0; i < reachable; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Ir a la reseña ${i + 1}`);
      dot.addEventListener('click', () => {
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        restartAuto();
      });
      dotsContainer.appendChild(dot);
    }
    dots = [...dotsContainer.children];
    updateActiveDot();
  }

  function updateActiveDot() {
    const trackLeft = track.getBoundingClientRect().left;
    const maxIndex = dots.length - 1;
    let closestIndex = 0;
    let closestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });
    closestIndex = Math.min(closestIndex, maxIndex);
    dots.forEach((d, i) => d.classList.toggle('active', i === closestIndex));
  }

  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveDot, 100);
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(buildDots, 150);
  });

  function scrollByCards(direction) {
    const cardWidth = cards[0].getBoundingClientRect().width + 24;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (direction > 0 && track.scrollLeft >= maxScroll - 4) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  }

  const AUTO_ADVANCE_MS = 3500;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let autoTimer = null;

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function startAuto() {
    if (reducedMotion || autoTimer) return;
    autoTimer = setInterval(() => scrollByCards(1), AUTO_ADVANCE_MS);
  }

  function restartAuto() {
    stopAuto();
    startAuto();
  }

  prevBtn.addEventListener('click', () => { scrollByCards(-1); restartAuto(); });
  nextBtn.addEventListener('click', () => { scrollByCards(1); restartAuto(); });

  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);
  track.addEventListener('touchstart', stopAuto, { passive: true });
  track.addEventListener('touchend', startAuto);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAuto();
    } else {
      startAuto();
    }
  });

  buildDots();
  startAuto();

  return { restartAuto };
}

(function setupScrollReveal() {
  const selector = [
    'h2',
    '.area-card',
    '.testimonio-card',
    '.value',
    '.why-item',
    '.team-member',
    '.faq-item',
    '.proceso-list > li',
    '.nosotros-grid > div',
    '.proceso-grid > div',
    '.contacto-grid > div',
  ].join(', ');
  const els = [...document.querySelectorAll(selector)];

  try {
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      return;
    }

    els.forEach((el) => el.classList.add('reveal'));

    const siblingCount = new Map();
    els.forEach((el) => {
      const parent = el.parentElement;
      const idx = siblingCount.get(parent) || 0;
      el.style.setProperty('--reveal-i', Math.min(idx, 5));
      siblingCount.set(parent, idx + 1);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach((el) => observer.observe(el));
  } catch (err) {
    els.forEach((el) => el.classList.add('revealed'));
  }
})();

setupCarousel('testimoniosTrack', 'testimoniosPrev', 'testimoniosNext', 'testimoniosDots');
