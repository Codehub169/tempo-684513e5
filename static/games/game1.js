// static/games/game1.js - Glitch Clicker
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.innerHTML = ''; // Clear 'Loading...' message or previous game

        // Game state
        let score = 0;

        // Create game elements
        const gameTitle = document.createElement('h3');
        gameTitle.textContent = 'Glitch Clicker';
        gameTitle.className = 'game-title-style'; // Use class from main.css

        const scoreDisplay = document.createElement('p');
        scoreDisplay.textContent = `ERR_COUNT: ${score}`;
        scoreDisplay.className = 'game-text-style';
        scoreDisplay.style.fontSize = '1.8em'; // Custom size for this game's score
        scoreDisplay.style.marginBottom = '30px';

        const clickButton = document.createElement('button');
        clickButton.textContent = 'INITIATE GLITCH';
        clickButton.className = 'game-button'; // Use class from main.css
        clickButton.style.padding = '20px 40px'; // Larger button for this game
        clickButton.style.fontSize = '1em';

        const rootStyles = getComputedStyle(document.documentElement);
        const colorChoices = [
            rootStyles.getPropertyValue('--accent-1').trim() || '#1ABC9C',
            rootStyles.getPropertyValue('--accent-2').trim() || '#3498DB',
            rootStyles.getPropertyValue('--highlight-color').trim() || '#F1C40F'
        ];

        // Click event handler
        clickButton.addEventListener('click', () => {
            score++;
            scoreDisplay.textContent = `ERR_COUNT: ${score}`;
            
            // Visual feedback for click
            const feedback = document.createElement('div');
            feedback.textContent = `+${Math.floor(Math.random() * 5) + 1} SYN_ERR`;
            feedback.style.position = 'absolute';
            const randomX = Math.random() * 60 + 20; // % from left
            const randomY = Math.random() * 40 + 20; // % from top
            feedback.style.left = `${randomX}%`;
            feedback.style.top = `${randomY}%`;
            feedback.style.color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
            feedback.style.fontSize = `${Math.random() * 1 + 1}em`; // Random size
            feedback.style.fontFamily = '"Roboto Mono", monospace'; // Correctly quote font name with spaces
            feedback.style.opacity = '1';
            feedback.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
            feedback.style.pointerEvents = 'none'; // Prevent interaction
            feedback.style.textShadow = '0 0 5px currentColor';
            gameContainer.appendChild(feedback);

            // Animate feedback using requestAnimationFrame for smoother visuals
            requestAnimationFrame(() => {
                feedback.style.opacity = '0';
                feedback.style.transform = `translate(${Math.random()*40-20}px, -50px) scale(0.5) rotate(${Math.random()*60-30}deg)`;
            });

            setTimeout(() => {
                if (feedback.parentNode) { // Check if still in DOM before removing
                    feedback.remove();
                }
            }, 700); // Corresponds to the transition duration
        });

        // Assemble game in container
        const wrapperDiv = document.createElement('div');
        wrapperDiv.style.display = 'flex';
        wrapperDiv.style.flexDirection = 'column';
        wrapperDiv.style.alignItems = 'center';
        wrapperDiv.style.justifyContent = 'center';
        wrapperDiv.style.height = '100%';
        wrapperDiv.style.textAlign = 'center'; // Ensures text within elements like <p> is centered if not overridden by specific styles

        wrapperDiv.appendChild(gameTitle);
        wrapperDiv.appendChild(scoreDisplay);
        wrapperDiv.appendChild(clickButton);
        gameContainer.appendChild(wrapperDiv);

    } else {
        console.error('Game container #game-container not found for Glitch Clicker.');
    }
});
