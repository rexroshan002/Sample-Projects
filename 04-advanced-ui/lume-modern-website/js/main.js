// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Dynamic Copyright Year Updater
    // This looks for the <span id="year"></span> in your footer and fills it with the current year.
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Contact Form Placeholder Logic
    // This will prevent the page from reloading when you eventually build your contact form.
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stops the default form submission
            
            // In a real app, you would send data to a server here.
            // For now, we just show a success message and clear the form.
            alert('Thank you for reaching out! Your message has been sent.');
            contactForm.reset();
        });
    }

    // 3. Smooth Scrolling for internal links (Optional nice-to-have)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId !== '#') {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

});