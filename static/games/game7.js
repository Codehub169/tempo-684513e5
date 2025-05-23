// static/games/game7.js - Drone Escape
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container #game-container not found for Drone Escape.');
        return;
    }

    gameContainer.innerHTML = ''; // Clear 'Loading...' or previous content

    const title = document.createElement('h3');
    title.textContent = 'Drone Escape';
    title.className = 'game-title-style';
    gameContainer.appendChild(title);

    const statusDisplay = document.createElement('p');
    statusDisplay.className = 'game-text-style';
    statusDisplay.style.minHeight = '2em';
    statusDisplay.style.marginBottom = '20px';
    statusDisplay.setAttribute('aria-live', 'polite');
    gameContainer.appendChild(statusDisplay);

    const attemptCounter = document.createElement('p');
    attemptCounter.className = 'game-text-style';
    attemptCounter.style.fontSize = '0.9em';
    attemptCounter.setAttribute('aria-live', 'polite');
    gameContainer.appendChild(attemptCounter);

    const actionButton = document.createElement('button');
    actionButton.className = 'game-button';
    actionButton.style.marginTop = '20px';
    gameContainer.appendChild(actionButton);

    const outcomes = [
        { msg: 'Narrowly avoided security patrol!', success: true },
        { msg: 'Drone grazed by laser grid! Minor damage.', success: false },
        { msg: 'Successful maneuver through debris field!', success: true },
        { msg: 'EMP blast nearby! Systems temporarily offline.', success: false },
        { msg: 'Stealth systems engaged. Undetected.', success: true },
        { msg: 'Signal jammed! Rerouting...', success: false }
    ];
    
    const maxAttempts = 10;
    let escapeAttempts = 0;
    let gameJustReset = true; // Start in a state that requires initialization

    function initializeGame() {
        escapeAttempts = 0;
        statusDisplay.textContent = 'Initiate drone evasion protocol.';
        statusDisplay.style.color = 'var(--text-color)'; // Reset to default text color
        attemptCounter.textContent = `Evasion Attempts: ${escapeAttempts}`;
        actionButton.textContent = 'Evade!';
        gameJustReset = false;
    }

    actionButton.addEventListener('click', () => {
        if (gameJustReset) {
            initializeGame();
            return; // This click was to (re)start, next click is an attempt
        }

        escapeAttempts++;
        attemptCounter.textContent = `Evasion Attempts: ${escapeAttempts}`;
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        statusDisplay.textContent = randomOutcome.msg;

        if (randomOutcome.success) {
            statusDisplay.style.color = 'var(--success-color, #2ECC71)';
        } else {
            statusDisplay.style.color = 'var(--highlight-color, #F1C40F)';
        }

        if (escapeAttempts >= maxAttempts) {
            statusDisplay.textContent = `Drone reached extraction point after ${escapeAttempts} attempts! System clear.`;
            statusDisplay.style.color = 'var(--accent-1, #1ABC9C)';
            actionButton.textContent = 'Re-Deploy Drone';
            gameJustReset = true; // Next click will reset the game
        }
    });

    initializeGame(); // Set up the game for the first play
});
