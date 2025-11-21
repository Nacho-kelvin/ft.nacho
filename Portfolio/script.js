document.addEventListener('DOMContentLoaded', () => {
    // === 1. Utilities ===
    function $(selector, ctx = document) {
        return ctx.querySelector(selector);
    }
    function $$(selector, ctx = document) {
        return Array.from(ctx.querySelectorAll(selector));
    }
    // Debounce utility to throttle scroll events
    function debounce(fn, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), wait);
        };
    }
    // Improved in-viewport check (with margin option)
    function isElementInViewport(el, margin = 0) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
            rect.top + margin >= 0 &&
            rect.left >= 0 &&
            rect.bottom - margin <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // === 2. Dynamic Footer Year ===
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // === 3. Mobile Navigation ===
    const hamburger = $('.hamburger');
    const navLinks = $('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Accessibility: close mobile nav with ESC key or after link click
        $$('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        document.addEventListener('keyup', (e) => {
            if (e.key === "Escape") {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // === 4. Smooth Anchor Scrolling (with better offset for sticky navbar) ===
    $$(`a[href^="#"]`).forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').trim();
            if (targetId.length < 2) return;
            const targetElement = $(targetId);
            if (targetElement) {
                e.preventDefault();
                // Find navbar height if sticky
                const navbar = $('#navbar');
                const offset = navbar ? navbar.offsetHeight : 0;
                const top = targetElement.getBoundingClientRect().top + window.scrollY - offset - 10;
                window.scrollTo({ top, behavior: 'smooth' });
                // Optionally, focus the target for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }
        });
    });

    // === 5. Sticky Navbar ===
    const navbar = $('#navbar');
    function handleNavbarSticky() {
        if (!navbar) return;
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255,255,255,0.95)';
            navbar.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'var(--white)';
            navbar.style.boxShadow = 'none';
        }
    }
    window.addEventListener('scroll', debounce(handleNavbarSticky, 20));
    handleNavbarSticky();

    // === 6. Animate Skill Bars ===
    const skillBars = $$('.skill-level');
    let skillBarsAnimated = false;
    function animateSkillBars() {
        if (skillBarsAnimated) return;
        skillBars.forEach(bar => {
            const level = bar?.getAttribute('data-level');
            if (level && isElementInViewport(bar, -40)) {
                bar.style.width = `${level}%`;
                bar.setAttribute('aria-valuenow', level); // Accessibility
            }
        });
        skillBarsAnimated = skillBars.every(bar => bar.style.width === `${bar.getAttribute('data-level')}%`);
    }

    // === 7. Animate Stats Counters (one-time, per element) ===
    const statNumbers = $$('.number');
    function animateStatNumber(number) {
        const target = parseInt(number.getAttribute('data-count')) || 0;
        const duration = 1200;
        let start = 0;
        const step = Math.ceil(target / (duration / 15));
        function update() {
            start += step;
            if (start < target) {
                number.textContent = `${start}`;
                requestAnimationFrame(update);
            } else {
                number.textContent = `${target}+`;
            }
        }
        update();
    }
    let statsAnimated = false;
    function animateStats() {
        if (statsAnimated) return;
        statNumbers.forEach(number => {
            if (isElementInViewport(number, -30) && !number.dataset.animated) {
                animateStatNumber(number);
                number.dataset.animated = "1";
            }
        });
        statsAnimated = statNumbers.every(number => number.dataset.animated === "1");
    }

    // Attach debounced scroll listener for both skill bars and stats
    window.addEventListener('scroll', debounce(() => {
        animateSkillBars();
        animateStats();
    }, 40));
    animateSkillBars();
    animateStats();

    // === 8. Project Filter (ARIA support) ===
    const filterButtons = $$('.filter-btn');
    const projectItems = $$('.project-item');
    if (filterButtons.length && projectItems.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.getAttribute('data-filter');
                projectItems.forEach(item => {
                    const matches = filterValue === 'all' || item.getAttribute('data-category') === filterValue;
                    item.style.display = matches ? 'block' : 'none';
                    item.setAttribute('aria-hidden', matches ? 'false' : 'true');
                });
            });
        });
    }

    // === 9. Contact Form Handler (accessibility and reset) ===
    const contactForm = $('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Normally, send data to backend here
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
});
