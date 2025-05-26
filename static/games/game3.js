// static/games/game3.js - Alien Translator
'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container #game-container not found for Alien Translator.');
        return;
    }

    const alienDictionary = [
        { alien: "Xylar", translation: "greetings" },
        { alien: "Gleepglorp", translation: "friend" },
        { alien: "Zzzrrt", translation: "danger" },
        { alien: "Floopy", translation: "water" },
        { alien: "Wumbus", translation: "food" },
        { alien: "Plargon", translation: "help" },
        { alien: "Kriznit", translation: "yes" },
        { alien: "Vorp", translation: "no" },
        { alien: "Shmool", translation: "trade" },
        { alien: "Zorp", translation: "star" },
        { alien: "Blorf", translation: "power" },
        { alien: "Squee", translation: "portal" }
    ];

    if (alienDictionary.length === 0) {
        gameContainer.innerHTML = "<p class='game-text-style' style='color: var(--error-color);'>Error: Alien dictionary is empty. Cannot start game.</p>";
        console.error('Alien dictionary is empty for Alien Translator. Game cannot start.');
        return;
    }

    let currentTranslationPair = {};
    let score = 0;

    gameContainer.innerHTML = `
        <h3 class='game-title-style'>Alien Translator</h3>
        <p class='game-text-style'>Translate the alien word displayed below.</p>
        <p class='game-text-style'>Alien Word: <span id='alien-word-display' style='font-style:italic; color: var(--accent-2);'></span></p>
        <input type='text' id='translation-input' class='game-input-style' placeholder='Enter translation...' style='margin-top:10px;'>
        <button class='game-button' id='submit-translation-button' style='margin-left:10px;'>Translate</button>
        <p class='game-text-style'>Score: <span id='translator-score'>0</span></p>
        <p class='game-text-style' id='translation-status' style='min-height: 2.5em; margin-top:10px;'></p>
    `;

    const alienWordDisplayElement = document.getElementById('alien-word-display');
    const translationInputElement = document.getElementById('translation-input');
    const translationStatusElement = document.getElementById('translation-status');
    const translatorScoreElement = document.getElementById('translator-score');
    const submitButton = document.getElementById('submit-translation-button');

    if (!alienWordDisplayElement || !translationInputElement || !translationStatusElement || !translatorScoreElement || !submitButton) {
        console.error('Critical game elements not found for Alien Translator.');
        // Clear the game container and show an error message if essential elements are missing after setting innerHTML
        gameContainer.innerHTML = "<p class='game-text-style' style='color: var(--error-color);'>Error: Failed to load game elements. Please try reloading.</p>";
        return;
    }

    function newWord() {
        currentTranslationPair = alienDictionary[Math.floor(Math.random() * alienDictionary.length)];
        alienWordDisplayElement.textContent = currentTranslationPair.alien;
        translationInputElement.value = '';
        translationStatusElement.textContent = '';
        translationStatusElement.style.color = 'var(--text-color)'; // Reset color
        translationInputElement.focus();
        submitButton.disabled = false;
    }

    function handleSubmit() {
        const userInput = translationInputElement.value.trim().toLowerCase();
        submitButton.disabled = true; // Disable button during feedback

        if (userInput === currentTranslationPair.translation.toLowerCase()) {
            score++;
            translationStatusElement.innerHTML = `Correct! <br>'${currentTranslationPair.alien}' means '${currentTranslationPair.translation}'.`;
            translationStatusElement.style.color = 'var(--success-color)';
        } else {
            score = Math.max(0, score - 1);
            translationStatusElement.innerHTML = `Incorrect. <br>'${currentTranslationPair.alien}' actually means '${currentTranslationPair.translation}'.`;
            translationStatusElement.style.color = 'var(--error-color)';
        }
        translatorScoreElement.textContent = score;
        setTimeout(newWord, 2000); // Load a new word after a short delay
    }

    submitButton.addEventListener('click', handleSubmit);
    // Add event listener for Enter key on input field
    translationInputElement.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission if wrapped in a form
            if (!submitButton.disabled) { // Only submit if button is not already disabled
                 handleSubmit();
            }
        }
    });

    newWord(); // Initialize with the first word
});
