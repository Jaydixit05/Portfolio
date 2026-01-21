// Script.js for Interactivity
console.log("Welcome to Jay Dixit's");

document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);
});

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeString = `${hours}:${minutes} ${ampm}`;
    const clockElement = document.getElementById('taskbar-clock');
    if (clockElement) {
        clockElement.innerText = timeString;
    }
}
