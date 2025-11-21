// Kelvin Nacho Portfolio Main Script - Modern, Interactive, and Accessible
// @Nacho-kelvin

document.addEventListener('DOMContentLoaded', () => {
  // === Utility Shortcuts ===
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const debounce = (fn, t = 24) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), t); }; };

  // === Dynamic Year for Footer ===
  $('#year').textContent = new Date().getFullYear();

  // === Responsive Navigation with Accessibility ===
  const navToggle = $('.nav-toggle');
  const navLinks = $('#nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('nav-open');
    });
    $$('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keyup', e => {
      if (e.key === 'Escape') {
        navLinks.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // === Smooth Anchor Scrolling ===
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href.length < 2) return;
      const target = $(href);
      if (target) {
        e.preventDefault();
        const offset = $('#navbar')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + scrollY - offset - 5;
        window.scrollTo({ top, behavior: 'smooth' });
        // Accessibility: focus
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  // === Project Filter Tabs with Transitions ===
  const filters = $$('.filter-btn');
  const projectItems = $$('.project-item');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const filter = btn.dataset.filter;
      projectItems.forEach(item => {
        const match = filter === "all" || item.dataset.category === filter;
        item.style.display = match ? "block" : "none";
        item.style.opacity = match ? "1" : "0";
        item.setAttribute('aria-hidden', match ? 'false' : 'true');
      });
    });
  });

  // === Animated About Stats Numbers ===
  function animateStatNumbers() {
    $$('.number[data-count]').forEach(el => {
      if (el.dataset.animated === "1") return;
      const target = +el.dataset.count;
      const duration = 1100;
      let count = 0, step = Math.ceil(target / (duration / 20));
      const update = () => {
        count += step;
        if (count < target) {
          el.textContent = count;
          requestAnimationFrame(update);
        } else {
          el.textContent = target + "+";
          el.dataset.animated = "1";
        }
      };
      update();
    });
  }
  // Only animate on large displays & when visible
  function triggerStatsIfVisible() {
    if (window.matchMedia("(min-width: 600px)").matches) {
      const stats = $('#about .number');
      if (stats && stats.getBoundingClientRect().top < window.innerHeight - 100) {
        animateStatNumbers();
      }
    }
  }
  triggerStatsIfVisible();
  window.addEventListener('scroll', debounce(triggerStatsIfVisible, 60));

  // === Contact Form Handler ===
  const contactForm = $('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const status = contactForm.querySelector('.form-status');
      status.textContent = "Thank you! Your message was submitted.";
      contactForm.reset();
      setTimeout(() => status.textContent = "", 3500);
    });
  }

  // === Skip Link Focus Styling ===
  const skip = $('.skip-link');
  skip?.addEventListener('focus', () => skip.classList.add('focus-visible'));
  skip?.addEventListener('blur', () => skip.classList.remove('focus-visible'));

  // === Back-to-top Button (visibility) ===
  const backToTop = $('.back-to-top');
  const toggleBackToTop = () => {
    if (window.scrollY > 200) backToTop.style.display = 'block';
    else backToTop.style.display = 'none';
  };
  window.addEventListener('scroll', debounce(toggleBackToTop, 32));
  toggleBackToTop();

  // === Hero & Section Parallax Glow and Section Divider Animation ===
  // (subtle but cool effect, optional, disables on mobile)
  function animateHeroDecor() {
    if (window.innerWidth < 700) return;
    const decor = $('.hero-decor');
    const hero = $('#home');
    if (!decor || !hero) return;
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 60;
      const y = (e.clientY / window.innerHeight - 0.4) * 40;
      decor.style.transform = `translate(${x}px,${y}px) scale(1.05)`;
    });
  }
  animateHeroDecor();

  // === Card Pop Animation on Scroll ===
  function animateCardsOnScroll() {
    $$('.card-pop').forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        card.classList.add('pop-in');
      }
    });
  }
  animateCardsOnScroll();
  window.addEventListener('scroll', debounce(animateCardsOnScroll, 24));

  // === Glass Nav Style on Scroll ===
  const navbar = $('#navbar');
  function glassNav() {
    if (!navbar) return;
    if (window.scrollY > 80) {
      navbar.classList.add('nav-glass-show');
    } else {
      navbar.classList.remove('nav-glass-show');
    }
  }
  glassNav();
  window.addEventListener('scroll', debounce(glassNav, 40));
});
