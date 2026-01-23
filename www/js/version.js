// Version info
const VERSION_NUMBER = '5.0';
const BUILD_DATE = new Date(); // Or hardcode build date

// Elements
const versionLabel = document.getElementById('version-label');
const modal = document.getElementById('version-modal');
const closeBtn = document.querySelector('.close-btn');
const versionInfo = document.getElementById('version-info');

// Click version label → open modal
versionLabel.addEventListener('click', () => {
    versionInfo.innerHTML = `
        <strong>Version:</strong> ${VERSION_NUMBER} <br><br>
        <strong>Build:</strong> ${BUILD_DATE.toLocaleString()} <br><br>
        <strong>Other Info:</strong> Gravity Assist Game
    `;
    modal.style.display = 'block';
});

// Close modal when click X
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside the modal box
window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});
