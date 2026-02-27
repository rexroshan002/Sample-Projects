/**
 * ACME STUDIO — Core Scripts
 * Handles navigation, scroll effects, animations, and form feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ── 1. Header Scroll Effect ──
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      // Adds a glassmorphism shadow effect when scrolling down
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true }); // passive: true improves scroll performance
  }

  // ── 2. Mobile Navigation Toggle ──
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('main-nav');
  
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      
      // Accessibility update
      navToggle.setAttribute('aria-expanded', isOpen);
      
      // Animate hamburger icon to an 'X'
      navToggle.classList.toggle('active', isOpen);
    });
  }

  // ── 3. Scroll Reveal Animations (Intersection Observer) ──
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after animating once to improve performance
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.15, // Triggers when 15% of the element is visible
      rootMargin: "0px 0px -50px 0px" // Slightly offsets the trigger point
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ── 4. Form Submission UX Handling ──
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  
  newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // Prevents actual page reload for the demo
      e.preventDefault(); 

      const btn = this.querySelector('button[type="submit"]');
      if (!btn) return;

      // Store original button state
      const originalText = btn.textContent;
      const originalBg = btn.style.background;
      
      // Show success feedback
      btn.textContent = '✓ Subscribed!';
      btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
      btn.style.pointerEvents = 'none'; // Prevent double clicks
      
      // Reset form and button after 3 seconds
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = originalBg;
        btn.style.pointerEvents = 'auto';
        form.reset();
      }, 3000);
    });
  });

});