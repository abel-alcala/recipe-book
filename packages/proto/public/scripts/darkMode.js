function dispatchCustomEvent(element, eventType, detail) {
    const customEvent = new CustomEvent(eventType, {
        bubbles: true,
        cancelable: true,
        detail: detail
    });
    element.dispatchEvent(customEvent);
}

document.addEventListener('DOMContentLoaded', () => {
    const darkModeLabel = document.querySelector('header label');
    const darkModeCheckbox = darkModeLabel.querySelector('input[type="checkbox"]');
    darkModeLabel.onchange = (event) => {
        event.stopPropagation();
        const isDarkMode = !darkModeCheckbox.checked;
        dispatchCustomEvent(document.body, 'darkmode:toggle', { isDarkMode });
    };

    document.body.addEventListener('darkmode:toggle', (event) => {
        if (event.detail.isDarkMode) {
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
        }
    });
});