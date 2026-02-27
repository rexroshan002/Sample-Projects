document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. Smooth Scroll for Hero Button
       ========================================= */
    const exploreBtn = document.querySelector('.btn-primary');
    const targetSection = document.querySelector('#section-a');

    if (exploreBtn && targetSection) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent standard jump
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    /* =========================================
       2. Intersection Observer (Scroll Reveal)
       ========================================= */
    // Select all elements we want to animate on scroll
    const revealElements = document.querySelectorAll('.glass-panel, .glass-card');

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the very bottom
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return; // If not in view, do nothing
            } else {
                // Add the 'visible' class to trigger the CSS animation
                entry.target.classList.add('reveal-visible');
                // Stop observing once revealed to keep it visible
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Apply the observer to each element
    revealElements.forEach(el => {
        // Add a base class to hide them initially via JS so it degrades gracefully if JS is off
        el.classList.add('reveal-hidden');
        revealOnScroll.observe(el);
    });
});