/* ================================================
   PROGRESSIEF BAARN — JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navigatie scrollschaduw ─────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('gescrolld', window.scrollY > 12);
    });
  }

  /* ── Mobiel nav menu ─────────────────────────── */
  const navKnop = document.querySelector('.nav-knop');
  const navMenu = document.querySelector('.nav-menu');
  if (navKnop && navMenu) {
    navKnop.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navKnop.classList.toggle('open');
    });
    // Sluit bij klikken buiten nav
    document.addEventListener('click', (e) => {
      if (!navKnop.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        navKnop.classList.remove('open');
      }
    });
  }

  /* ── Actieve navigatielink ───────────────────── */
  const huidigePagina = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === huidigePagina || (huidigePagina === '' && href === 'index.html')) {
      link.classList.add('actief');
    }
  });

  /* ── Tab navigatie (Mensen pagina) ──────────── */
  const tabKnoppen = document.querySelectorAll('.tab-knop');
  const tabInhouden = document.querySelectorAll('.tab-inhoud');

  tabKnoppen.forEach(knop => {
    knop.addEventListener('click', () => {
      const doel = knop.dataset.tab;
      tabKnoppen.forEach(k => k.classList.remove('actief'));
      tabInhouden.forEach(t => t.classList.remove('actief'));
      knop.classList.add('actief');
      const doelEl = document.getElementById(doel);
      if (doelEl) doelEl.classList.add('actief');
    });
  });

  /* ── Filter knoppen (Nieuws pagina) ─────────── */
  const filterKnoppen = document.querySelectorAll('.filter-knop');
  filterKnoppen.forEach(knop => {
    knop.addEventListener('click', () => {
      filterKnoppen.forEach(k => k.classList.remove('actief'));
      knop.classList.add('actief');
      const filter = knop.dataset.filter;
      document.querySelectorAll('.nieuws-kaart[data-categorie]').forEach(kaart => {
        if (filter === 'all' || kaart.dataset.categorie === filter) {
          kaart.style.display = '';
        } else {
          kaart.style.display = 'none';
        }
      });
    });
  });

  /* ── Contactformulier ────────────────────────── */
  const contactFormulier = document.getElementById('contactFormulier');
  if (contactFormulier) {
    contactFormulier.addEventListener('submit', (e) => {
      e.preventDefault();
      const verzendKnop = contactFormulier.querySelector('[type="submit"]');
      const origineelLabel = verzendKnop.textContent;
      verzendKnop.textContent = 'Versturen…';
      verzendKnop.disabled = true;

      setTimeout(() => {
        const melding = document.querySelector('.melding-succes');
        if (melding) melding.style.display = 'block';
        verzendKnop.textContent = '✓ Verstuurd!';
        verzendKnop.style.background = 'var(--donker)';

        setTimeout(() => {
          contactFormulier.reset();
          verzendKnop.textContent = origineelLabel;
          verzendKnop.disabled = false;
          verzendKnop.style.background = '';
          if (melding) melding.style.display = 'none';
        }, 4000);
      }, 1600);
    });
  }

  /* ── Scroll-animaties ────────────────────────── */
  const fadeElemens = document.querySelectorAll(
    '.nieuws-kaart, .persoon-kaart, .dossier-kaart, ' +
    '.persoon-kaart-volledig, .dossier-volledig-kaart, ' +
    '.stat-kaart, .contact-item'
  );

  const waarnemer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('zichtbaar');
        }, i * 60);
        waarnemer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  fadeElemens.forEach(el => {
    el.classList.add('fade-omhoog');
    waarnemer.observe(el);
  });

  /* ── Getal-teller animatie ────────────────────── */
  function animeerTeller(el, eindwaarde, duur = 1200) {
    const start = performance.now();
    const update = (nu) => {
      const verstreken = nu - start;
      const voortgang = Math.min(verstreken / duur, 1);
      const ease = 1 - Math.pow(1 - voortgang, 3);
      el.textContent = Math.round(ease * eindwaarde);
      if (voortgang < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const tellerWaarnemer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const eindwaarde = parseInt(el.dataset.teller);
        if (!isNaN(eindwaarde)) animeerTeller(el, eindwaarde);
        tellerWaarnemer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-teller]').forEach(el => {
    tellerWaarnemer.observe(el);
  });

});
