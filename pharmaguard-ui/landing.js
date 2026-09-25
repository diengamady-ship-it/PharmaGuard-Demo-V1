// PharmaGuard SN — page d'accueil : apparition au défilement, compteurs, thème
(function () {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Apparition des blocs au défilement
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    document.querySelectorAll(".scroll-reveal").forEach(el => revealObserver.observe(el));

    // Barre du haut + léger parallaxe du mockup
    const topBar = document.getElementById("top-bar");
    const heroMockup = document.getElementById("hero-mockup");
    let ticking = false;

    function onScroll() {
        const y = window.scrollY;
        topBar.classList.toggle("scrolled", y > 50);
        if (!reduceMotion && heroMockup && y < window.innerHeight) {
            heroMockup.style.transform = `translateY(${y * 0.15}px)`;
        }
        ticking = false;
    }
    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    // Reflet qui suit la souris sur les cartes (thème sombre uniquement)
    document.querySelectorAll(".glass-card").forEach(card => {
        card.addEventListener("mousemove", e => {
            if (document.body.classList.contains("simple-mode")) return;
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mouse-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
            card.style.setProperty("--mouse-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
        });
        card.addEventListener("mouseleave", () => {
            card.style.setProperty("--mouse-x", "50%");
            card.style.setProperty("--mouse-y", "50%");
        });
    });

    // Compteurs animés
    const counters = document.querySelectorAll(".stat-glass-num[data-target]");
    const counterObserver = new IntersectionObserver(entries => {
        if (!entries.some(e => e.isIntersecting)) return;
        counterObserver.disconnect();
        counters.forEach(animateCounter);
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        if (reduceMotion) {
            el.textContent = target;
            return;
        }
        const start = performance.now();
        const duration = 1200;
        (function step(now) {
            const t = Math.min((now - start) / duration, 1);
            el.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target);
            if (t < 1) requestAnimationFrame(step);
        })(start);
    }

    // Thème clair / sombre (mémorisé si le navigateur le permet)
    window.setTheme = function (mode) {
        const simple = mode === "simple";
        document.body.classList.toggle("simple-mode", simple);
        document.body.classList.toggle("liquid-glass", !simple);
        document.querySelectorAll(".toggle-option").forEach(opt =>
            opt.classList.toggle("active", opt.dataset.mode === mode));
        try { localStorage.setItem("pg-theme", mode); } catch { /* stockage indisponible */ }
    };
    try {
        if (localStorage.getItem("pg-theme") === "simple") window.setTheme("simple");
    } catch { /* stockage indisponible */ }

    // Défilement doux vers les ancres internes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const id = anchor.getAttribute("href").slice(1);
        if (!id) return;
        anchor.addEventListener("click", e => {
            const target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        });
    });
})();
