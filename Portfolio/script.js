// Portfolio Main Script by Nacho Kelvin
// Improved for professionalism, structure, maintainability, and accessibility

document.addEventListener('DOMContentLoaded', () => {
    // === 1. Utilities ===
    const $ = (selector, ctx = document) => ctx.querySelector(selector);
    const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));
    const debounce = (fn, wait = 20) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), wait);
        };
    };
    const isElementInViewport = (el, margin = 0) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
            rect.top + margin >= 0 &&
            rect.left >= 0 &&
            rect.bottom - margin <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // === 2. Dynamic Footer Year ===
    const setFooterYear = () => {
        const yearEl = $('#year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    };

    // === 3. Mobile Navigation ===
    const setupMobileNavigation = () => {
        const hamburger = $('.hamburger');
        const navLinks = $('.nav-links');

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
                hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
            });

            $$('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                });
            });

            document.addEventListener('keyup', (e) => {
                if (e.key === 'Escape') {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        }
    };

    // === 4. Smooth Anchor Scrolling ===
    const setupSmoothScrolling = () => {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href').trim();
                if (targetId.length < 2) return;
                const targetElement = $(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const navbar = $('#navbar');
                    const offset = navbar ? navbar.offsetHeight : 0;
                    const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - offset - 10;
                    window.scrollTo({ top: targetTop, behavior: 'smooth' });

                    // Accessibility: focus target element
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus({ preventScroll: true });
                }
            });
        });
    };

    // === 5. Sticky Navbar ===
    const setupStickyNavbar = () => {
        const navbar = $('#navbar');
        if (!navbar) return;

        const handleNavbarSticky = () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255,255,255,0.95)';
                navbar.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
            } else {
                navbar.style.background = 'var(--white)';
                navbar.style.boxShadow = 'none';
            }
        };

        window.addEventListener('scroll', debounce(handleNavbarSticky, 20));
        handleNavbarSticky();
    };

    // === 6. Animate Skill Bars ===
    const animateSkillBars = (() => {
        const skillBars = $$('.skill-level');
        let animated = false;

        return () => {
            if (animated) return;
            let allAnimated = true;
            skillBars.forEach(bar => {
                const level = bar?.getAttribute('data-level');
                if (
                    level &&
                    isElementInViewport(bar, -40) &&
                    bar.style.width !== `${level}%`
                ) {
                    bar.style.width = `${level}%`;
                    bar.setAttribute('aria-valuenow', level);
                }
                if (bar.style.width !== `${bar.getAttribute('data-level')}%`) {
                    allAnimated = false;
                }
            });
            if (allAnimated) animated = true;
        };
    })();

    // === 7. Animate Stats Counters ===
    const animateStatsNumbers = (() => {
        const statNumbers = $$('.number');
        let statsAnimated = false;

        function animateStatNumber(number) {
            const target = parseInt(number.getAttribute('data-count'), 10) || 0;
            const duration = 1200;
            let start = 0;
            const step = Math.ceil(target / (duration / 15));

            const update = () => {
                start += step;
                if (start < target) {
                    number.textContent = `${start}`;
                    requestAnimationFrame(update);
                } else {
                    number.textContent = `${target}+`;
                }
            };
            update();
        }

        return () => {
            if (statsAnimated) return;
            let allAnimated = true;
            statNumbers.forEach(number => {
                if (isElementInViewport(number, -30) && !number.dataset.animated) {
                    animateStatNumber(number);
                    number.dataset.animated = "1";
                }
                if (number.dataset.animated !== "1") {
                    allAnimated = false;
                }
            });
            if (allAnimated) statsAnimated = true;
        };
    })();

    // === 8. Project Filter with ARIA support ===
    const setupProjectFilter = () => {
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
    };

    // === 9. Contact Form Handler ===
    const setupContactForm = () => {
        const contactForm = $('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                // In production, send the data to your backend here.
                alert('Thank you for your message! I will get back to you soon.');
                this.reset();
            });
        }
    };

    // === 10. Init Section: Modular, Maintainable ===
    setFooterYear();
    setupMobileNavigation();
    setupSmoothScrolling();
    setupStickyNavbar();
    setupProjectFilter();
    setupContactForm();

    // Attach debounced scroll listener for both skill bars and stats
    const onScroll = debounce(() => {
        animateSkillBars();
        animateStatsNumbers();
    }, 40);
    window.addEventListener('scroll', onScroll);
    // Initial animation check (in case in view on load)
    animateSkillBars();
    animateStatsNumbers();

    // Optional: Lazy loading images can be handled here as well for further professionalism.
});
