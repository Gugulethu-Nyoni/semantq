let isDarkMode = false;
const themeToggle = document.getElementById('theme-toggle');
const bodyElement = document.body;

themeToggle.addEventListener('click', toggleTheme);

function toggleTheme(
) {
    isDarkMode = !isDarkMode;

    if (isDarkMode) {
        bodyElement.classList.add('dark-mode');
        themeToggle.innerHTML="Light Theme";
    } else {
        bodyElement.classList.remove('dark-mode');
    }
}
