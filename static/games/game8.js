// static/games/game8.js - Net Runner's Gauntlet
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.innerHTML = ''; // Clear 'Loading...' or previous content

        const title = document.createElement('h3');
        title.textContent = 'Net Runner\'s Gauntlet'; // Apostrophe correctly escaped
        title.className = 'game-title-style';

        const comingSoonText = document.createElement('p');
        comingSoonText.textContent = 'This game is currently under development. Check back soon, operative!';
        comingSoonText.className = 'game-text-style';
        comingSoonText.style.fontSize = '1.2em';

        const placeholderImage = document.createElement('img');
        placeholderImage.src = 'https://via.placeholder.com/300x200.png?text=Game+Interface+Concept';
        placeholderImage.alt = 'Game concept art';
        placeholderImage.style.marginTop = '20px';
        placeholderImage.style.border = '1px solid var(--accent-2)';
        placeholderImage.style.borderRadius = '4px';
        placeholderImage.style.maxWidth = '100%'; // Ensure image is responsive

        gameContainer.appendChild(title);
        gameContainer.appendChild(comingSoonText);
        gameContainer.appendChild(placeholderImage);
    } else {
        console.error('Game container #game-container not found for Net Runner\'s Gauntlet.');
    }
});
