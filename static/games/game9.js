// static/games/game9.js - Cybernetic Sorter
'use strict';
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

    const fragmentDisplay = document.createElement('p');
    fragmentDisplay.className = 'game-text-style';
    fragmentDisplay.style.minHeight = '4em'; // Increased minHeight for better display of fragment properties
    fragmentDisplay.style.marginBottom = '15px';
    fragmentDisplay.style.border = '1px dashed var(--accent-2)';
    fragmentDisplay.style.padding = '10px';
    gameContainer.appendChild(fragmentDisplay);

    const statusDisplay = document.createElement('p');
    statusDisplay.className = 'game-text-style';
    statusDisplay.style.minHeight = '2em';
    statusDisplay.setAttribute('aria-live', 'polite');
    gameContainer.appendChild(statusDisplay);

    const scoreDisplay = document.createElement('p');
    scoreDisplay.className = 'game-text-style';
    scoreDisplay.style.fontSize = '1em';
    gameContainer.appendChild(scoreDisplay);

    const livesDisplay = document.createElement('p');
    livesDisplay.className = 'game-text-style';
    livesDisplay.style.fontSize = '1em';
    gameContainer.appendChild(livesDisplay);

    const binsContainer = document.createElement('div');
    binsContainer.style.marginTop = '20px';
    binsContainer.style.display = 'flex';
    binsContainer.style.justifyContent = 'center';
    binsContainer.style.gap = '10px';
    binsContainer.style.flexWrap = 'wrap';
    gameContainer.appendChild(binsContainer);

    const restartButton = document.createElement('button');
    restartButton.className = 'game-button';
    restartButton.style.marginTop = '20px';
    restartButton.style.display = 'none';
    restartButton.onclick = startGame; // Assign event handler directly
    gameContainer.appendChild(restartButton);

    let score;
    let lives;
    let currentFragment;

    const MAX_LIVES = 3;
    const TARGET_SCORE = 100; // Points to win
    const POINTS_PER_CORRECT_SORT = 10;

    const fragmentProperties = {
        type: ['Encrypted', 'Raw Data', 'Corrupted', 'Priority'],
        size: ['Small', 'Medium', 'Large'],
        sensitivity: ['Low', 'Medium', 'High']
    };

    // Order matters for determining the 'best' bin if conditions overlap.
    // Quarantine is highest priority for Corrupted.
    // Secure Archive and Fast Processing are next.
    // General Storage is a fallback.
    const sortingBins = [
        { name: 'Quarantine', condition: (frag) => frag.type === 'Corrupted' },
        { name: 'Secure Archive', condition: (frag) => frag.type === 'Encrypted' && frag.sensitivity === 'High' },
        { name: 'Fast Processing', condition: (frag) => frag.type === 'Priority' && frag.size !== 'Large' },
        { name: 'General Storage', condition: (frag) => true } // Catches anything not meeting stricter criteria above
    ];

    function generateFragment() {
        return {
            type: fragmentProperties.type[Math.floor(Math.random() * fragmentProperties.type.length)],
            size: fragmentProperties.size[Math.floor(Math.random() * fragmentProperties.size.length)],
            sensitivity: fragmentProperties.sensitivity[Math.floor(Math.random() * fragmentProperties.sensitivity.length)]
        };
    }
    
    function determineCorrectBinName(fragment) {
        if (fragment.type === 'Corrupted') return 'Quarantine';
        if (fragment.type === 'Encrypted' && fragment.sensitivity === 'High') return 'Secure Archive';
        if (fragment.type === 'Priority' && fragment.size !== 'Large') return 'Fast Processing';
        // Fallback for all other cases, including 'Raw Data' or 'Low Sensitivity' not covered by specific rules.
        return 'General Storage'; 
    }

    function updateDisplays() {
        scoreDisplay.textContent = `Score: ${score}`;
        livesDisplay.textContent = `Integrity Checks Remaining: ${lives}`;
        livesDisplay.style.color = lives < 2 ? 'var(--error-color)' : 'var(--text-color)';
    }

    function startGame() {
        score = 0;
        lives = MAX_LIVES;
        restartButton.style.display = 'none';
        binsContainer.style.display = 'flex';
        statusDisplay.textContent = 'Initializing data stream...';
        statusDisplay.style.color = 'var(--text-color)';
        nextFragment();
    }

    function nextFragment() {
        if (score >= TARGET_SCORE) {
            winGame();
            return;
        }
        if (lives <= 0) {
            loseGame();
            return;
        }
        currentFragment = generateFragment();
        fragmentDisplay.innerHTML = `Incoming Fragment:<br>Type: <b>${currentFragment.type}</b><br>Size: <b>${currentFragment.size}</b><br>Sensitivity: <b>${currentFragment.sensitivity}</b>`;

        binsContainer.innerHTML = '';
        // Use only the defined bins for player choice, not necessarily all possible logic branches for determining correctness.
        const playerChoiceBins = [
            { name: 'Secure Archive', displayName: 'Sort to: Secure Archive' },
            { name: 'Quarantine', displayName: 'Sort to: Quarantine' },
            { name: 'Fast Processing', displayName: 'Sort to: Fast Processing' },
            { name: 'General Storage', displayName: 'Sort to: General Storage' }
        ];

        playerChoiceBins.forEach(binInfo => {
            const button = document.createElement('button');
            button.textContent = binInfo.displayName;
            button.className = 'game-button';
            button.style.minWidth = '180px';
            button.onclick = () => handleSort(binInfo.name);
            binsContainer.appendChild(button);
        });
        updateDisplays();
    }

    function handleSort(chosenBinName) {
        const correctBinName = determineCorrectBinName(currentFragment);
        const isCorrect = (chosenBinName === correctBinName);

        let outcomeMessage;
        if (isCorrect) {
            score += POINTS_PER_CORRECT_SORT;
            outcomeMessage = `Fragment sorted correctly to ${chosenBinName}.`;
            statusDisplay.style.color = 'var(--success-color)';
        } else {
            lives--;
            outcomeMessage = `Mis-sort! Fragment routed to ${chosenBinName}. Correct bin was ${correctBinName}. Integrity check failed.`;
            statusDisplay.style.color = 'var(--error-color)';
        }
        statusDisplay.textContent = outcomeMessage;

        binsContainer.innerHTML = '<p class="game-text-style">Processing...</p>';
        setTimeout(() => {
            nextFragment();
        }, 2500); // Increased delay for reading feedback
    }

    function winGame() {
        statusDisplay.textContent = `Target score reached! ${score} points. Sorting protocols mastered!`;
        statusDisplay.style.color = 'var(--accent-1)';
        binsContainer.innerHTML = ''; // Clear bins
        binsContainer.style.display = 'none';
        fragmentDisplay.innerHTML = 'All fragments processed. System stable.';
        restartButton.textContent = 'New Sorting Session';
        restartButton.style.display = 'block';
    }

    function loseGame() {
        statusDisplay.textContent = `Multiple integrity failures! System compromised. Final score: ${score}.`;
        statusDisplay.style.color = 'var(--error-color)';
        lives = 0; // Ensure lives is 0
        updateDisplays(); // Update display to show 0 lives
        binsContainer.innerHTML = ''; // Clear bins
        binsContainer.style.display = 'none';
        fragmentDisplay.innerHTML = 'System critical. Sorting offline.';
        restartButton.textContent = 'Restart Sorter';
        restartButton.style.display = 'block';
    }

    startGame();
});
