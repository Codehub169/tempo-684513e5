// static/games/game9.js - Cybernetic Sorter
'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container #game-container not found for Cybernetic Sorter.');
        return;
    }

    let score = 0;
    let fragmentsProcessed = 0;
    let timerId = null;
    let currentFragment = null;
    let timeLeft = 0;

    const FRAGMENTS_TO_PROCESS = 15;
    const TIMEOUT_PENALTY = 5;
    const VOLATILE_CORRECT_BONUS = 20;
    const VOLATILE_MISHANDLE_PENALTY_FACTOR = 1; // Multiplies the fragment's negative value

    const fragmentTypes = [
        { type: 'Alpha', color: 'var(--accent-1)', category: 'A', value: 10 },
        { type: 'Beta', color: 'var(--accent-2)', category: 'B', value: 10 },
        { type: 'Gamma', color: 'var(--highlight-color)', category: 'A', value: 15 },
        { type: 'Delta', color: 'var(--success-color)', category: 'B', value: 15 },
        { type: 'Omega', color: 'var(--error-color)', category: 'SPECIAL', value: -25, special: 'volatile' }
    ];

    const categories = {
        'A': { name: 'System Core Data', buttonLabel: 'Sort to Core (A)' },
        'B': { name: 'Network Packets', buttonLabel: 'Sort to Network (B)' },
        'SPECIAL': { name: 'Volatile Fragments', buttonLabel: 'Handle Volatile'}
    };

    // Initial HTML structure
    gameContainer.innerHTML = `
        <h3 class='game-title-style'>Cybernetic Sorter</h3>
        <p class='game-text-style'>Rapidly categorize incoming data fragments. Beware of 'Volatile' fragments!</p>
        <div id='cs-fragment-display' style='width: 100px; height: 100px; border: 2px solid white; margin: 20px auto; display: flex; align-items: center; justify-content: center; font-size: 1.5em; transition: background-color 0.3s, border-color 0.3s;'></div>
        <p class='game-text-style'>Time Left: <span id='cs-timer'>0</span>s</p>
        <div id='cs-buttons' style='margin-top: 15px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;'></div>
        <p class='game-text-style'>Score: <span id='cs-score'>0</span> | Processed: <span id='cs-processed'>0</span>/${FRAGMENTS_TO_PROCESS}</p>
        <p class='game-text-style' id='cs-feedback' style='min-height: 1.2em; margin-top:10px;' aria-live='polite'></p>
        <button id='cs-start-button' class='game-button' style='margin-top:10px;'>Start Sorting</button>
    `;

    const fragmentDisplay = document.getElementById('cs-fragment-display');
    const timerDisplay = document.getElementById('cs-timer');
    const buttonsContainer = document.getElementById('cs-buttons');
    const scoreDisplay = document.getElementById('cs-score');
    const processedDisplay = document.getElementById('cs-processed');
    const feedbackDisplay = document.getElementById('cs-feedback');
    const startButton = document.getElementById('cs-start-button');

    if (!fragmentDisplay || !timerDisplay || !buttonsContainer || !scoreDisplay || !processedDisplay || !feedbackDisplay || !startButton) {
        console.error('Critical game elements not found for Cybernetic Sorter.');
        return;
    }
    
    function handleSort(selectedCategory) {
        clearInterval(timerId);
        fragmentsProcessed++;
        processedDisplay.textContent = `${fragmentsProcessed}/${FRAGMENTS_TO_PROCESS}`;
        let correctSort = false;

        if (selectedCategory === 'TIMEOUT') {
            feedbackDisplay.textContent = `Timeout! Fragment ${currentFragment.type} lost.`;
            feedbackDisplay.style.color = 'var(--error-color)';
            score -= TIMEOUT_PENALTY;
        } else if (currentFragment.special === 'volatile') {
            if (selectedCategory === 'SPECIAL') {
                feedbackDisplay.textContent = `Volatile fragment ${currentFragment.type} handled correctly!`;
                feedbackDisplay.style.color = 'var(--success-color)';
                score += VOLATILE_CORRECT_BONUS;
                correctSort = true;
            } else {
                feedbackDisplay.textContent = `Volatile fragment ${currentFragment.type} mis-handled! System shock!`;
                feedbackDisplay.style.color = 'var(--error-color)';
                // currentFragment.value is negative, so adding it applies a penalty.
                score += currentFragment.value * VOLATILE_MISHANDLE_PENALTY_FACTOR;
            }
        } else if (selectedCategory === currentFragment.category) {
            feedbackDisplay.textContent = `Correct! ${currentFragment.type} sorted to ${categories[currentFragment.category].name}.`;
            feedbackDisplay.style.color = 'var(--success-color)';
            score += currentFragment.value;
            correctSort = true;
        } else {
            feedbackDisplay.textContent = `Incorrect! ${currentFragment.type} belongs to ${categories[currentFragment.category].name}.`;
            feedbackDisplay.style.color = 'var(--error-color)';
            score -= Math.floor(currentFragment.value / 2); // Penalty for mis-sort
        }
        
        scoreDisplay.textContent = score;

        if (fragmentsProcessed >= FRAGMENTS_TO_PROCESS) {
            endGame();
        } else {
            // Disable buttons briefly while feedback is shown
            buttonsContainer.querySelectorAll('.game-button').forEach(btn => btn.disabled = true);
            setTimeout(() => {
                buttonsContainer.querySelectorAll('.game-button').forEach(btn => btn.disabled = false);
                nextFragment();
            }, correctSort ? 700 : 1800); // Faster if correct, longer to read error
        }
    }

    function generateButtons() {
        buttonsContainer.innerHTML = '';
        Object.keys(categories).forEach(catKey => {
            const button = document.createElement('button');
            button.className = 'game-button';
            button.textContent = categories[catKey].buttonLabel;
            button.addEventListener('click', () => handleSort(catKey));
            buttonsContainer.appendChild(button);
        });
    }

    function nextFragment() {
        if (timerId) clearInterval(timerId);
        currentFragment = fragmentTypes[Math.floor(Math.random() * fragmentTypes.length)];
        
        // Display first 3 letters, uppercase
        fragmentDisplay.textContent = currentFragment.type.substring(0,3).toUpperCase(); 
        fragmentDisplay.style.backgroundColor = currentFragment.color;
        fragmentDisplay.style.borderColor = currentFragment.special === 'volatile' ? 'var(--highlight-color)' : 'var(--primary-text)';
        fragmentDisplay.style.color = currentFragment.special === 'volatile' ? 'var(--primary-bg)' : 'var(--primary-text)';

        timeLeft = currentFragment.special === 'volatile' ? 3 : 5; // Less time for volatile
        timerDisplay.textContent = timeLeft + 's';
        timerDisplay.style.color = 'var(--text-color)';

        timerId = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft + 's';
            if (timeLeft <= 2) {
                timerDisplay.style.color = 'var(--error-color)';
            }
            if (timeLeft <= 0) {
                handleSort('TIMEOUT');
            }
        }, 1000);
    }

    function startGame() {
        score = 0;
        fragmentsProcessed = 0;
        scoreDisplay.textContent = score;
        processedDisplay.textContent = `${fragmentsProcessed}/${FRAGMENTS_TO_PROCESS}`;
        feedbackDisplay.textContent = 'Initializing sort sequence...';
        startButton.style.display = 'none';
        buttonsContainer.style.display = 'flex';
        generateButtons();
        nextFragment();
    }

    function endGame() {
        clearInterval(timerId);
        fragmentDisplay.textContent = 'END';
        fragmentDisplay.style.backgroundColor = 'var(--background-color)';
        fragmentDisplay.style.borderColor = 'var(--text-color)';
        fragmentDisplay.style.color = 'var(--text-color)';
        timerDisplay.textContent = '0s';
        buttonsContainer.style.display = 'none';
        feedbackDisplay.textContent = `Sorting Complete! Final Score: ${score}. Processed: ${fragmentsProcessed}.`;
        feedbackDisplay.style.color = score > (FRAGMENTS_TO_PROCESS * 5) ? 'var(--accent-1)' : 'var(--info-color, var(--accent-2))'; // Adjusted win condition display
        startButton.textContent = 'Restart Sorter';
        startButton.style.display = 'inline-block';
    }
    
    buttonsContainer.style.display = 'none'; // Hide buttons initially
    startButton.addEventListener('click', startGame);
});
