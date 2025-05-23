// static/games/game2.js - Code Breaker
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.innerHTML = ''; // Clear 'Loading...' or previous game

        // Game state variables
        let targetNumber;
        let attempts;
        const maxAttempts = 7;

        // Create game elements
        const gameTitle = document.createElement('h3');
        gameTitle.textContent = 'Code Breaker Protocol';
        gameTitle.className = 'game-title-style';

        const instructions = document.createElement('p');
        instructions.className = 'game-text-style';
        instructions.style.marginBottom = '15px';

        const inputField = document.createElement('input');
        inputField.type = 'number';
        inputField.placeholder = 'Enter Sequence (1-100)';
        inputField.className = 'game-input-style';
        inputField.setAttribute('min', '1');
        inputField.setAttribute('max', '100');

        const guessButton = document.createElement('button');
        guessButton.className = 'game-button';

        const feedbackMessage = document.createElement('p');
        feedbackMessage.className = 'game-text-style';
        feedbackMessage.style.minHeight = '2em'; // Reserve space for messages
        feedbackMessage.style.marginTop = '15px';
        feedbackMessage.style.fontWeight = 'bold';

        const attemptsDisplay = document.createElement('p');
        attemptsDisplay.className = 'game-text-style';
        attemptsDisplay.style.fontSize = '0.9em';
        attemptsDisplay.style.color = '#A0A0A0';

        function startGame() {
            targetNumber = Math.floor(Math.random() * 100) + 1;
            attempts = 0;
            instructions.innerHTML = `Targeting encrypted node...<br>Guess the master key (1-100). You have <strong>${maxAttempts}</strong> attempts.`;
            feedbackMessage.textContent = 'Awaiting your input, operative...';
            feedbackMessage.style.color = '#53B8BB';
            inputField.value = '';
            inputField.disabled = false;
            guessButton.disabled = false;
            guessButton.textContent = 'Transmit Guess';
            guessButton.onclick = handleGuess; // Set to guess handler
            updateAttemptsDisplay();
            inputField.focus();
        }

        function updateAttemptsDisplay() {
            attemptsDisplay.textContent = `Attempts Remaining: [ ${maxAttempts - attempts} ]`;
        }

        function handleGuess() {
            if (inputField.disabled) return; // Prevent guess if game over

            const guess = parseInt(inputField.value);
            if (isNaN(guess) || guess < 1 || guess > 100) {
                feedbackMessage.textContent = 'SYSTEM_ERROR: Invalid input. Sequence must be 1-100.';
                feedbackMessage.style.color = '#E94560'; // Neon Pink for error
                inputField.value = '';
                inputField.focus();
                return;
            }

            attempts++;
            updateAttemptsDisplay();

            if (guess === targetNumber) {
                feedbackMessage.innerHTML = `NODE_CRACKED!<br>Sequence ${targetNumber} confirmed. Access granted in ${attempts} attempts.`;
                feedbackMessage.style.color = '#39FF14'; // Neon Green for success
                endGame(true);
            } else if (attempts >= maxAttempts) {
                feedbackMessage.innerHTML = `CONNECTION_LOST.<br>Master key was ${targetNumber}. Security protocols engaged.`;
                feedbackMessage.style.color = '#E94560';
                endGame(false);
            } else if (guess < targetNumber) {
                feedbackMessage.textContent = 'Signal too weak... Target sequence is higher.';
                feedbackMessage.style.color = '#FFFF00'; // Yellow for hint
            } else {
                feedbackMessage.textContent = 'Signal too strong... Target sequence is lower.';
                feedbackMessage.style.color = '#FFFF00';
            }
            inputField.value = '';
            inputField.focus();
        }

        function endGame(won) {
            inputField.disabled = true;
            // guessButton.disabled = true; // Keep enabled for restart
            guessButton.textContent = won ? 'Re-initialize Protocol?' : 'Retry Connection?';
            guessButton.onclick = startGame; // Re-purpose button to restart
        }
        
        // Event listener for Enter key on input field
        inputField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission if it's in a form
                handleGuess();
            }
        });

        // Assemble game elements
        const wrapperDiv = document.createElement('div');
        wrapperDiv.style.display = 'flex';
        wrapperDiv.style.flexDirection = 'column';
        wrapperDiv.style.alignItems = 'center';
        wrapperDiv.style.justifyContent = 'center';
        wrapperDiv.style.height = '100%';
        wrapperDiv.style.width = '100%';
        wrapperDiv.style.textAlign = 'center';

        wrapperDiv.appendChild(gameTitle);
        wrapperDiv.appendChild(instructions);
        wrapperDiv.appendChild(inputField);
        wrapperDiv.appendChild(guessButton);
        wrapperDiv.appendChild(feedbackMessage);
        wrapperDiv.appendChild(attemptsDisplay);
        
        gameContainer.appendChild(wrapperDiv);

        startGame(); // Initialize and start the game

    } else {
        console.error('Game container #game-container not found for Code Breaker.');
    }
});
