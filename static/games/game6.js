// static/games/game6.js - System Shock Sequence
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container #game-container not found for System Shock Sequence.');
        return;
    }

    gameContainer.innerHTML = ''; // Clear 'Loading...' or previous game

    const title = document.createElement('h3');
    title.textContent = 'System Shock Sequence';
    title.className = 'game-title-style';
    gameContainer.appendChild(title);

    const statusDisplay = document.createElement('p');
    statusDisplay.className = 'game-text-style';
    statusDisplay.textContent = 'Press Start to begin.';
    statusDisplay.style.minHeight = '2em';
    statusDisplay.setAttribute('aria-live', 'polite'); // Accessibility: announce changes
    gameContainer.appendChild(statusDisplay);

    const sequenceButtonsContainer = document.createElement('div');
    sequenceButtonsContainer.style.display = 'grid';
    sequenceButtonsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    sequenceButtonsContainer.style.gap = '15px';
    sequenceButtonsContainer.style.maxWidth = '220px';
    sequenceButtonsContainer.style.margin = '20px auto';
    gameContainer.appendChild(sequenceButtonsContainer);

    const colors = ['var(--accent-1)', 'var(--accent-2)', 'var(--highlight-color)', 'var(--error-color)'];
    const buttons = [];
    for (let i = 0; i < 4; i++) {
        const button = document.createElement('button');
        button.className = 'game-button sequence-button';
        button.style.backgroundColor = colors[i];
        button.style.width = '100px';
        button.style.height = '100px';
        button.style.opacity = '0.7';
        button.style.transition = 'opacity 0.2s ease';
        button.dataset.index = i.toString(); // Store index as string for dataset
        button.setAttribute('aria-label', `Sequence button ${i + 1}`);
        button.addEventListener('click', () => handlePlayerInput(i));
        sequenceButtonsContainer.appendChild(button);
        buttons.push(button);
    }

    const startButton = document.createElement('button');
    startButton.textContent = 'Start Sequence';
    startButton.className = 'game-button';
    startButton.addEventListener('click', startGame);
    gameContainer.appendChild(startButton);

    let sequence = [];
    let playerSequence = [];
    let level = 0;
    let canPlayerClick = false;
    const flashDuration = 400;
    const interFlashDelay = 200;
    const maxLevel = 20;

    function startGame() {
        sequence = [];
        playerSequence = [];
        level = 0;
        startButton.style.display = 'none';
        nextRound();
    }

    function nextRound() {
        level++;
        playerSequence = [];
        canPlayerClick = false;
        statusDisplay.textContent = `Level: ${level} - Watch...`;
        sequence.push(Math.floor(Math.random() * buttons.length)); // Use buttons.length for flexibility
        playSequence();
    }

    async function playSequence() {
        await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause
        for (let i = 0; i < sequence.length; i++) {
            await flashButton(sequence[i]);
            if (i < sequence.length - 1) { // Avoid delay after last flash in sequence playback
                 await new Promise(resolve => setTimeout(resolve, interFlashDelay));
            }
        }
        canPlayerClick = true;
        statusDisplay.textContent = `Level: ${level} - Your turn...`;
    }

    function flashButton(index) {
        return new Promise(resolve => {
            const buttonToFlash = buttons[index];
            if (!buttonToFlash) {
                console.error(`Button with index ${index} not found for flashing.`);
                resolve(); // Resolve promise even if button not found to prevent hang
                return;
            }
            buttonToFlash.style.opacity = '1';
            // Sound effect could be added here
            setTimeout(() => {
                buttonToFlash.style.opacity = '0.7';
                resolve();
            }, flashDuration);
        });
    }

    async function handlePlayerInput(index) {
        if (!canPlayerClick) return;

        await flashButton(index);
        playerSequence.push(index);

        const currentStep = playerSequence.length - 1;
        if (playerSequence[currentStep] !== sequence[currentStep]) {
            gameOver();
            return;
        }

        if (playerSequence.length === sequence.length) {
            canPlayerClick = false;
            if (level >= maxLevel) {
                gameWin();
            } else {
                setTimeout(nextRound, 1000); // Delay before next round
            }
        }
    }

    function gameOver() {
        statusDisplay.textContent = `Game Over! You reached Level ${level}.`;
        canPlayerClick = false;
        startButton.textContent = 'Retry Sequence';
        startButton.style.display = 'block';
    }
    
    function gameWin() {
        statusDisplay.textContent = `SYSTEM MASTERED! You completed all ${level} levels!`;
        canPlayerClick = false;
        startButton.textContent = 'Play Again';
        startButton.style.display = 'block';
    }
});
