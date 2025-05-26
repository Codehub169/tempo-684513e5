// static/games/game3.js - Alien Translator (Placeholder)
'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container #game-container not found for Alien Translator.');
        return;
    }

    const alienWords = ['Xylar', 'Gleepglorp', 'Zzzrrt', 'Floopy', 'Wumbus'];
    let currentAlienWord = '';
    let score = 0;

    // HTML structure is set first, then elements are cached.
    gameContainer.innerHTML = `
        <h3 class='game-title-style'>Alien Translator</h3>
        <p class='game-text-style'>Translate the alien word. Hint: They all mean 'hello' for now.</p>
        <p class='game-text-style'>Alien Word: <span id='alien-word-display' style='font-style:italic; color: var(--accent-2);'></span></p>
        <input type='text' id='translation-input' class='game-input-style' placeholder='Enter translation...' style='margin-top:10px;'>
        <button class='game-button' onclick='submitTranslation()' style='margin-left:10px;'>Translate</button>
        <p class='game-text-style'>Score: <span id='translator-score'>0</span></p>
        <p class='game-text-style' id='translation-status' style='min-height: 1em; margin-top:10px;'></p>
    `;

    const alienWordDisplayElement = document.getElementById('alien-word-display');
    const translationInputElement = document.getElementById('translation-input');
    const translationStatusElement = document.getElementById('translation-status');
    const translatorScoreElement = document.getElementById('translator-score');

    if (!alienWordDisplayElement || !translationInputElement || !translationStatusElement || !translatorScoreElement) {
        console.error('Critical game elements not found for Alien Translator.');
        return;
    }

    function newWord() {
        currentAlienWord = alienWords[Math.floor(Math.random() * alienWords.length)];
        alienWordDisplayElement.textContent = currentAlienWord;
        translationInputElement.value = '';
        translationStatusElement.textContent = '';
        translationInputElement.focus(); // Focus input for new word
    }

    window.submitTranslation = function() {
        const userInput = translationInputElement.value.trim().toLowerCase();
        if (userInput === 'hello') {
            score++;
            translationStatusElement.textContent = 'Correct! The aliens greet you back.';
            translationStatusElement.style.color = 'var(--success-color)';
        } else {
            score = Math.max(0, score - 1); // Lose a point for wrong answer, but not below 0
            translationStatusElement.textContent = 'Incorrect. Try again or a new word.';
            translationStatusElement.style.color = 'var(--error-color)';
        }
        translatorScoreElement.textContent = score;
        setTimeout(newWord, 1500); // Load a new word after a short delay
    };

    newWord(); // Initialize with the first word
});
