/**
 * UI/UX Micro-interactions & Performance Optimizations
 * Architecture: Vanilla JS, requestAnimationFrame for 60fps rendering
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================
    // 1. Dynamic Ambient Background (Mouse Tracking Mesh)
    // ==========================================================
    const ambientBg = document.querySelector('.ambient-background');
    let mouseX = 0;
    let mouseY = 0;
    let bgX = 0;
    let bgY = 0;

    // Track mouse coordinates
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate background fluidly
    const animateBackground = () => {
        // Easing factor for smooth trailing effect
        const ease = 0.05;
        
        bgX += (mouseX - bgX) * ease;
        bgY += (mouseY - bgY) * ease;

        // Calculate percentage based on screen size
        const xPercent = (bgX / window.innerWidth) * 100;
        const yPercent = (bgY / window.innerHeight) * 100;

        // Update the CSS radial gradients slightly based on mouse position
        if (ambientBg) {
            ambientBg.style.background = `
                radial-gradient(circle at ${xPercent * 0.5}% ${yPercent * 0.8}%, rgba(205, 92, 92, 0.08), transparent 30%),
                radial-gradient(circle at ${100 - (xPercent * 0.5)}% ${100 - (yPercent * 0.5)}%, rgba(56, 189, 248, 0.08), transparent 30%)
            `;
        }

        requestAnimationFrame(animateBackground);
    };
    
    // Initialize background animation loop
    if (window.matchMedia("(hover: hover)").matches) {
        animateBackground();
    }

    // ==========================================================
    // 2. 3D Glassmorphism Tilt Effect (Cards)
    // ==========================================================
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Only apply on desktop
            if (window.innerWidth < 992) return;

            const rect = card.getBoundingClientRect();
            
            // Get mouse position relative to the card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation amount (Max 4 degrees for subtlety)
            const rotateX = ((y - centerY) / centerY) * -4; 
            const rotateY = ((x - centerX) / centerX) * 4;

            // Apply transform (adding translateY(-8px) to maintain the hover lift from CSS)
            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
        });

        // Reset card to original state when mouse leaves
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
            card.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)'; // Restore smooth CSS transition
        });
    });
    document.addEventListener('DOMContentLoaded', () => {
  // Decode GitHub link to hide from bots
  const ghLink = document.getElementById('gh-link');
  if (ghLink) {
    const encodedUrl = "aHR0cHM6Ly9naXRodWIuY29tL3JleHJvc2hhbjAwMg==";
    ghLink.href = atob(encodedUrl); // atob() decodes the Base64 string back to your URL
  }
});

    // ==========================================================
    // 3. Smooth Scroll for "Explore" Indicator
    // ==========================================================
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const firstArtwork = document.querySelector('main.container .card');

    if (scrollIndicator && firstArtwork) {
        scrollIndicator.style.cursor = 'pointer';
        
        scrollIndicator.addEventListener('click', () => {
            // Get the position of the first artwork, offset slightly for the fixed header space
            const offsetTop = firstArtwork.getBoundingClientRect().top + window.scrollY - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================
    // 4. Optimize Image Loading Performance
    // ==========================================================
    // Ensure lazy-loaded images re-trigger AOS animations gracefully when they pop in
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.addEventListener('load', () => {
            if (typeof AOS !== 'undefined') {
                AOS.refreshHard();
            }
        });
    });

});