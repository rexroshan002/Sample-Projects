/**
 * REX ROSHAN INTERFACE LOGIC
 * Manages Dark Mode Persistence and Animation Performance
 */

document.addEventListener('DOMContentLoaded', () => {
    const modeSwitch = document.querySelector('.mode-switch');
    const html = document.documentElement;

    // 1. Dark Mode Toggle
    modeSwitch.addEventListener('click', () => {
        const isDark = html.classList.toggle('dark');
        modeSwitch.setAttribute('aria-pressed', isDark);
        
        // Micro-interaction: Button scale effect
        modeSwitch.style.transform = "scale(0.9)";
        setTimeout(() => modeSwitch.style.transform = "scale(1)", 100);
    });

    // 2. Intersection Observer for Scroll Reveals
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0) scale(1)";
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial State for Reveal Animation
    document.querySelectorAll('.box').forEach(box => {
        box.style.opacity = "0";
        box.style.transform = "translateY(50px) scale(0.95)";
        box.style.transition = "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
        revealObserver.observe(box);
    });
});