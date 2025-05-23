// static/games/game9.js - Cybernetic Sorter
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container #game-container not found for Cybernetic Sorter.');
        return;
    }

    gameContainer.innerHTML = ''; // Clear 'Loading...'

    const title = document.createElement('h3');
    title.textContent = 'Cybernetic Sorter';
    title.className = 'game-title-style';
    gameContainer.appendChild(title);

    const statusDisplay = document.createElement('p');
    statusDisplay.className = 'game-text-style';
    statusDisplay.style.minHeight = '2em';
    statusDisplay.style.marginBottom = '20px';
    statusDisplay.setAttribute('aria-live', 'polite');
    gameContainer.appendChild(statusDisplay);

    const fragmentCounter = document.createElement('p');
    fragmentCounter.className = 'game-text-style';
    fragmentCounter.style.fontSize = '0.9em';
    fragmentCounter.setAttribute('aria-live', 'polite');
    gameContainer.appendChild(fragmentCounter);

    const actionButton = document.createElement('button');
    actionButton.className = 'game-button';
    actionButton.style.marginTop = '20px';
    gameContainer.appendChild(actionButton);

    const fragmentTypes = [
        { type: 'Alpha', msg: 'Alpha fragment sorted to secure sector.', success: true },
        { type: 'Beta', msg: 'Beta fragment routed to archive.', success: true },
        { type: 'Gamma', msg: 'Gamma fragment flagged for corruption!', success: false },
        { type: 'Delta', msg: 'Delta fragment processed successfully.', success: true },
        { type: 'Omega', msg: 'Omega fragment critical! System overload imminent.', success: false }
    ];

    const winFragments = 15;
    let fragmentsSorted = 0;
    let gameJustReset = true;

    function initializeGame() {
        fragmentsSorted = 0;
        statusDisplay.textContent = 'Data fragments incoming. Prepare for sorting.';
        statusDisplay.style.color = 'var(--text-color)';
        fragmentCounter.textContent = `Fragments Processed: ${fragmentsSorted}`;
        actionButton.textContent = 'Sort Next Fragment';
        gameJustReset = false;
    }

    actionButton.addEventListener('click', () => {
        if (gameJustReset) {
            initializeGame();
            return;
        }

        fragmentsSorted++;
        fragmentCounter.textContent = `Fragments Processed: ${fragmentsSorted}`;
        const randomFragment = fragmentTypes[Math.floor(Math.random() * fragmentTypes.length)];
        statusDisplay.textContent = `Incoming: ${randomFragment.type}. Result: ${randomFragment.msg}`;
        
        if (randomFragment.success) {
            statusDisplay.style.color = 'var(--success-color, #2ECC71)';
        } else {
            statusDisplay.style.color = 'var(--error-color, #E74C3C)';
        }

        if (fragmentsSorted >= winFragments) {
            statusDisplay.textContent = `Buffer capacity reached! ${fragmentsSorted} fragments sorted. Efficiency optimal.`;
            statusDisplay.style.color = 'var(--accent-1, #1ABC9C)';
            actionButton.textContent = 'Restart Sorter';
            gameJustReset = true;
        }
    });

    initializeGame();
});
