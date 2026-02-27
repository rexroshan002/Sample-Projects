document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            // If the user clicks the link button, let it happen
            if (e.target.tagName === 'A') return;

            // Otherwise, toggle the accordion for mobile/tap
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
});