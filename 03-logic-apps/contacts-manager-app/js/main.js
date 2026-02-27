const filterInput = document.getElementById('filterInput');
    const groups = document.querySelectorAll('.contact-group');
    const emptyState = document.getElementById('emptyState');

    function filterNames() {
        let filterValue = filterInput.value.toUpperCase();
        let totalVisible = 0;

        groups.forEach(group => {
            let groupVisible = false;
            const rows = group.querySelectorAll('.contact-row');

            rows.forEach(row => {
                const nameText = row.textContent || row.innerText;
                if (nameText.toUpperCase().indexOf(filterValue) > -1) {
                    row.classList.remove('hidden');
                    groupVisible = true;
                    totalVisible++;
                } else {
                    row.classList.add('hidden');
                }
            });

            // Hide the entire group (including header) if no matches
            group.classList.toggle('hidden', !groupVisible);
        });

        // Toggle global empty state
        emptyState.classList.toggle('hidden', totalVisible > 0);
    }

    filterInput.addEventListener('keyup', filterNames);