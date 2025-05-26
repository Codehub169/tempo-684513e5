// static/games/game5.js - Code Breaker (Placeholder)
'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container #game-container not found for Code Breaker.');
        return;
    }
    let secretCode = '';
    let attemptsLeft = 0;
    const codeLength = 4; // Length of the code to guess

    gameContainer.innerHTML = `
        <h3 class='game-title-style'>Code Breaker</h3>
        <p class='game-text-style'>Guess the secret ${codeLength}-digit numerical code.</p>
        <input type='text' id='codebreaker-input' class='game-input-style' maxlength='${codeLength}' placeholder='Enter code...' style='margin-top:10px;'>
        <div id='codebreaker-controls' style='margin-top:10px;'>
             <button class='game-button' id='submit-guess-button' onclick='submitGuess()'>Submit Guess</button>
             <button class='game-button' onclick='generateCode()'>New Code</button>
        </div>
        <p class='game-text-style'>Attempts Left: <span id='codebreaker-attempts'></span></p>
        <div class='game-text-style' id='codebreaker-feedback' style='min-height: 3em; margin-top:10px; border: 1px solid var(--accent-3); padding: 5px;' aria-live='polite'></div>
    `;

    const attemptsElement = document.getElementById('codebreaker-attempts');
    const feedbackElement = document.getElementById('codebreaker-feedback');
    const inputElement = document.getElementById('codebreaker-input');
    const submitButtonElement = document.getElementById('submit-guess-button');

    if (!attemptsElement || !feedbackElement || !inputElement || !submitButtonElement) {
        console.error('Critical game elements not found for Code Breaker.');
        return;
    }

    function generateCode() {
        secretCode = '';
        for (let i = 0; i < codeLength; i++) {
            secretCode += Math.floor(Math.random() * 10).toString(); // Code consists of digits 0-9
        }
        attemptsLeft = 7;
        attemptsElement.textContent = attemptsLeft;
        feedbackElement.innerHTML = `A ${codeLength}-digit code has been set. You have ${attemptsLeft} attempts.`;
        feedbackElement.style.color = 'var(--text-color)';
        inputElement.value = '';
        inputElement.disabled = false;
        submitButtonElement.disabled = false;
        inputElement.focus();
    }

    window.submitGuess = function() {
        const guess = inputElement.value.trim();
        
        if (guess.length !== codeLength || !/^[0-9]+$/.test(guess)) {
            feedbackElement.innerHTML = `Invalid input. Please enter a ${codeLength}-digit number.`;
            feedbackElement.style.color = 'var(--warning-color)';
            return;
        }

        attemptsLeft--;
        attemptsElement.textContent = attemptsLeft;

        if (guess === secretCode) {
            feedbackElement.innerHTML = `CODE CRACKED! The code was ${secretCode}. You are a master cryptographer!`;
            feedbackElement.style.color = 'var(--accent-1)';
            inputElement.disabled = true;
            submitButtonElement.disabled = true; // Disable submit guess only
            return;
        }

        if (attemptsLeft <= 0) {
            feedbackElement.innerHTML = `Out of attempts! The secret code was ${secretCode}. System lockdown initiated.`;
            feedbackElement.style.color = 'var(--error-color)';
            inputElement.disabled = true;
            submitButtonElement.disabled = true;
            return;
        }

        let correctDigits = 0;
        let correctPositions = 0;
        let tempSecret = secretCode.split('');
        let tempGuess = guess.split('');

        // Check for correct digits in correct positions
        for (let i = 0; i < codeLength; i++) {
            if (tempGuess[i] === tempSecret[i]) {
                correctPositions++;
                tempSecret[i] = null; // Mark as checked to avoid double counting
                tempGuess[i] = null;  // Mark as checked
            }
        }

        // Check for correct digits in wrong positions
        for (let i = 0; i < codeLength; i++) {
            if (tempGuess[i] !== null) { // If this guess digit hasn't been matched for position
                const digitIndexInSecret = tempSecret.indexOf(tempGuess[i]);
                if (digitIndexInSecret !== -1) {
                    correctDigits++;
                    tempSecret[digitIndexInSecret] = null; // Mark as checked in secret to avoid double counting
                }
            }
        }

        feedbackElement.innerHTML = `Guess: ${guess} <br> Correct Digits in Correct Position: ${correctPositions} <br> Correct Digits in Wrong Position: ${correctDigits}`;
        feedbackElement.style.color = 'var(--info-color)';
        inputElement.value = ''; // Clear input for next guess
        inputElement.focus();
    };

    generateCode(); // Initialize the game
});
