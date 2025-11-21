// Kelvin Nacho Portfolio Main Script - World Class, Modern, Fluid, Accessible
// @Nacho-kelvin

document.addEventListener('DOMContentLoaded', () => {
  // === Lightweight Selector Shortcuts ===
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const debounce = (fn, t = 24) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), t); }; };

  // === Set Dynamic Year in Footer ===
  $('#year').textContent = new Date().getFullYear();

  // === Responsive Navigation Menu Accessibility ===
  const navToggle = $('.nav-toggle');
  const navLinks = $('#nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('nav-open');
      // Focus first link when opening
      if (!expanded) navLinks.querySelector('a')?.focus();
    });
    $$('.nav-links a', navLinks).forEach(link => {
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
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 5;
        window.scrollTo({ top, behavior: 'smooth' });
        // Accessibility: focus for skip link or section
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  // === Skip Link Focus Styling ===
  const skip = $('.skip-link');
  skip?.addEventListener('focus', () => skip.classList.add('focus-visible'));
  skip?.addEventListener('blur', () => skip.classList.remove('focus-visible'));

  // === Project Filter Tabs ===
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
        item.style.display = match ? "" : "none";
        item.setAttribute('tabindex', match ? '0' : '-1');
        item.setAttribute('aria-hidden', match ? 'false' : 'true');
      });
    });
  });

  // === Animated Number Stats on About Section ===
  function animateStatNumbers() {
    $$('.number[data-count]').forEach(el => {
      if (el.dataset.animated === "1") return;
      const target = +el.dataset.count;
      if (isNaN(target)) return;
      const duration = 1100;
      let count = 0, step = Math.max(1, Math.ceil(target / (duration / 24)));
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
  // Animate stats when about section is scrolled into view, only on desktop
  function triggerStatsIfVisible() {
    if (window.matchMedia("(min-width: 600px)").matches) {
      const stats = $('#about .number[data-count]');
      if (stats && stats.getBoundingClientRect().top < window.innerHeight - 50) {
        animateStatNumbers();
      }
    }
  }
  window.addEventListener('scroll', debounce(triggerStatsIfVisible, 64));
  triggerStatsIfVisible();

  // === Contact Form Handler (Mock AJAX) ===
  const contactForm = $('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const status = contactForm.querySelector('.form-status');
      status.textContent = "Thank you! Your message was submitted.";
      contactForm.reset();
      setTimeout(() => status.textContent = "", 4000);
    });
  }

  // === Back-to-Top Button Visibility ===
  const backToTop = $('.back-to-top');
  function toggleBackToTop() {
    if (window.scrollY > 200) backToTop.style.display = 'block';
    else backToTop.style.display = 'none';
  }
  window.addEventListener('scroll', debounce(toggleBackToTop, 24));
  toggleBackToTop();

  // === Card Pop/Entrance Animation on Scroll ===
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

  // === Hero Section Parallax Glow Effect ===
  function animateHeroDecor() {
    if (window.innerWidth < 700) return;
    const decor = $('.hero-decor');
    if (!decor) return;
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 60;
      const y = (e.clientY / window.innerHeight - 0.4) * 40;
      decor.style.transform = `translate(${x}px,${y}px) scale(1.05)`;
    });
  }
  animateHeroDecor();

  // === Add "Glass" Effect on Navbar after Scroll ===
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
  window.addEventListener('scroll', debounce(glassNav, 32));

  // === Performance: Lazy loading images polyfill for old browsers ===
  if ('loading' in HTMLImageElement.prototype === false) {
    $$('img[loading="lazy"]').forEach(img => {
      if (!img.src) {
        img.src = img.dataset.src || img.getAttribute('src');
      }
    });
  }

  // === Accessibility: Trap focus in open nav on small screens ===
  function trapFocusWithin(element) {
    const focusableEls = element.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const first = focusableEls[0], last = focusableEls[focusableEls.length - 1];
    element.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    });
  }
  if (navLinks) trapFocusWithin(navLinks);

  // === Reduce motion for users who prefer it ===
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduce-motion');
  }

  // === Extra UI polish: Keyboard navigation for project filters ===
  filters.forEach((btn, idx) => {
    btn.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const nextIdx = e.key === 'ArrowRight' ? (idx + 1) % filters.length : (idx - 1 + filters.length) % filters.length;
        filters[nextIdx].focus();
      }
    });
  });
});
