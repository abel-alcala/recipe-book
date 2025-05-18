document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('darkmode:toggle', (event) => {
        if (event.detail.isDarkMode) {
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
        }
    });
});