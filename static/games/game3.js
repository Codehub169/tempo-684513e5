document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Error: Game container #game-container not found.');
        return;
    }

    gameContainer.innerHTML = ''; // Clear previous content

    const wrapper = document.createElement('div');
    wrapper.style.textAlign = 'center';

    const title = document.createElement('h2');
    title.textContent = 'Data Stream Defender';
    title.className = 'game-title-style';
    wrapper.appendChild(title);

    const scoreDisplay = document.createElement('p');
    scoreDisplay.className = 'game-text-style';
    scoreDisplay.style.fontSize = '1.5em';
    let score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    wrapper.appendChild(scoreDisplay);

    const gameArea = document.createElement('div');
    gameArea.style.width = '90%';
    gameArea.style.maxWidth = '600px';
    gameArea.style.height = '300px';
    gameArea.style.border = '2px solid var(--accent-3)';
    gameArea.style.margin = '20px auto';
    gameArea.style.position = 'relative';
    gameArea.style.overflow = 'hidden';
    gameArea.style.backgroundColor = 'rgba(0,0,0,0.2)';
    wrapper.appendChild(gameArea);

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.className = 'game-input-style';
    inputField.placeholder = 'Type words here...';
    inputField.style.marginTop = '10px';
    inputField.setAttribute('autocomplete', 'off');
    inputField.setAttribute('autocorrect', 'off');
    inputField.setAttribute('autocapitalize', 'off');
    inputField.setAttribute('spellcheck', 'false');
    wrapper.appendChild(inputField);

    const words = ['cyber', 'glitch', 'matrix', 'neon', 'hacker', 'protocol', 'system', 'virus', 'network', 'stream', 'data', 'code', 'byte', 'script'];
    let activeWords = [];
    let gameInterval;
    let wordSpeed = 2000; // Time in ms for a word to cross the screen
    let spawnIntervalTime = 2500;

    function spawnWord() {
        const wordText = words[Math.floor(Math.random() * words.length)];
        const wordElement = document.createElement('span');
        wordElement.textContent = wordText;
        wordElement.className = 'game-text-style';
        wordElement.style.position = 'absolute';
        wordElement.style.whiteSpace = 'nowrap';
        wordElement.style.color = 'var(--accent-1)';
        wordElement.style.left = Math.random() * (gameArea.offsetWidth - wordElement.offsetWidth - 20) + 10 + 'px';
        wordElement.style.top = '-30px'; // Start above the game area
        wordElement.dataset.text = wordText;

        gameArea.appendChild(wordElement);
        activeWords.push(wordElement);

        let fallStartTime = Date.now();
        function fall() {
            const elapsedTime = Date.now() - fallStartTime;
            const progress = elapsedTime / wordSpeed;
            wordElement.style.top = progress * (gameArea.offsetHeight + 30) - 30 + 'px';

            if (parseFloat(wordElement.style.top) < gameArea.offsetHeight) {
                requestAnimationFrame(fall);
            } else {
                wordElement.remove();
                activeWords = activeWords.filter(w => w !== wordElement);
                // Optional: Penalize for missed word
            }
        }
        requestAnimationFrame(fall);
    }

    inputField.addEventListener('input', (e) => {
        const typedValue = e.target.value.trim();
        if (typedValue === '') return;

        for (let i = 0; i < activeWords.length; i++) {
            const wordObj = activeWords[i];
            if (wordObj.dataset.text.toLowerCase() === typedValue.toLowerCase()) {
                wordObj.remove();
                activeWords.splice(i, 1);
                score += wordObj.dataset.text.length;
                scoreDisplay.textContent = `Score: ${score}`;
                e.target.value = ''; // Clear input

                // Increase difficulty slightly
                if (score > 0 && score % 50 === 0) {
                    wordSpeed = Math.max(1000, wordSpeed * 0.95);
                    spawnIntervalTime = Math.max(1000, spawnIntervalTime * 0.95);
                    clearInterval(gameInterval);
                    gameInterval = setInterval(spawnWord, spawnIntervalTime);
                }
                break;
            }
        }
    });

    function startGame() {
        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        activeWords.forEach(word => word.remove());
        activeWords = [];
        inputField.value = '';
        inputField.focus();
        wordSpeed = 2000;
        spawnIntervalTime = 2500;
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(spawnWord, spawnIntervalTime);
        spawnWord(); // Spawn first word immediately
    }

    const startButton = document.createElement('button');
    startButton.textContent = 'Start Defender Protocol';
    startButton.className = 'game-button';
    startButton.style.marginTop = '15px';
    startButton.addEventListener('click', startGame);
    wrapper.appendChild(startButton);

    gameContainer.appendChild(wrapper);
    console.log('Data Stream Defender loaded.');
});
