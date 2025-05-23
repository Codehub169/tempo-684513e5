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
    title.textContent = 'Memory Matrix';
    title.className = 'game-title-style';
    wrapper.appendChild(title);

    const movesDisplay = document.createElement('p');
    movesDisplay.className = 'game-text-style';
    movesDisplay.style.fontSize = '1.2em';
    let moves = 0;
    movesDisplay.textContent = `Moves: ${moves}`;
    wrapper.appendChild(movesDisplay);

    const gameGrid = document.createElement('div');
    gameGrid.style.display = 'grid';
    gameGrid.style.gridTemplateColumns = 'repeat(4, 1fr)'; // 4x4 grid
    gameGrid.style.gap = '10px';
    gameGrid.style.maxWidth = '400px';
    gameGrid.style.margin = '20px auto';
    wrapper.appendChild(gameGrid);

    // Cyberpunk themed symbols (using Unicode or simple characters)
    const symbols = ['⚡', '⚙️', '🔗', '💾', '📡', '💡', '☣️', '⚛️'];
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let canFlip = true;

    function createBoard() {
        moves = 0;
        matchedPairs = 0;
        movesDisplay.textContent = `Moves: ${moves}`;
        gameGrid.innerHTML = '';
        cards = [];
        flippedCards = [];
        canFlip = true;

        let cardValues = [...symbols, ...symbols]; // Duplicate symbols for pairs
        cardValues.sort(() => 0.5 - Math.random()); // Shuffle

        for (let i = 0; i < 16; i++) {
            const card = document.createElement('div');
            card.classList.add('matrix-card');
            card.dataset.value = cardValues[i];
            card.dataset.index = i.toString();
            card.style.width = '80px';
            card.style.height = '80px';
            card.style.backgroundColor = 'var(--accent-2)';
            card.style.border = '2px solid var(--accent-3)';
            card.style.borderRadius = '5px';
            card.style.display = 'flex';
            card.style.justifyContent = 'center';
            card.style.alignItems = 'center';
            card.style.fontSize = '2.5em';
            card.style.cursor = 'pointer';
            card.style.color = 'transparent'; // Hide symbol initially
            card.style.userSelect = 'none';
            card.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
            
            // Inner span for the symbol, helps with reveal animation
            const cardSymbol = document.createElement('span');
            cardSymbol.textContent = cardValues[i];
            cardSymbol.style.opacity = '0';
            cardSymbol.style.transition = 'opacity 0.3s ease';
            card.appendChild(cardSymbol);

            card.addEventListener('click', handleCardClick);
            gameGrid.appendChild(card);
            cards.push(card);
        }
    }

    function handleCardClick(event) {
        if (!canFlip) return;
        const clickedCard = event.currentTarget;

        if (flippedCards.length < 2 && !clickedCard.classList.contains('flipped') && !clickedCard.classList.contains('matched')) {
            flipCard(clickedCard);
            flippedCards.push(clickedCard);

            if (flippedCards.length === 2) {
                canFlip = false;
                moves++;
                movesDisplay.textContent = `Moves: ${moves}`;
                checkForMatch();
            }
        }
    }

    function flipCard(card) {
        card.classList.add('flipped');
        card.style.backgroundColor = 'var(--accent-1)';
        card.style.transform = 'rotateY(180deg)';
        card.querySelector('span').style.opacity = '1';
        card.style.color = '#1A1A2E'; // Show symbol by changing color
    }

    function unflipCards(card1, card2) {
        setTimeout(() => {
            [card1, card2].forEach(card => {
                if (!card.classList.contains('matched')) {
                    card.classList.remove('flipped');
                    card.style.backgroundColor = 'var(--accent-2)';
                    card.style.transform = 'rotateY(0deg)';
                    card.querySelector('span').style.opacity = '0';
                    card.style.color = 'transparent';
                }
            });
            canFlip = true;
        }, 1000);
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.value === card2.dataset.value) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            canFlip = true; // Allow next flip immediately for matched pair
            if (matchedPairs === symbols.length) {
                endGame();
            }
        } else {
            unflipCards(card1, card2);
        }
        flippedCards = [];
    }

    function endGame() {
        canFlip = false;
        setTimeout(() => {
            const endMessage = document.createElement('p');
            endMessage.className = 'game-text-style';
            endMessage.style.fontSize = '1.5em';
            endMessage.style.color = 'var(--accent-1)';
            endMessage.textContent = `Matrix Decrypted! Total Moves: ${moves}`;
            wrapper.appendChild(endMessage);

            restartButton.style.display = 'inline-block'; // Show restart button
        }, 500);
    }

    const restartButton = document.createElement('button');
    restartButton.textContent = 'New Matrix Challenge';
    restartButton.className = 'game-button';
    restartButton.style.marginTop = '20px';
    restartButton.addEventListener('click', () => {
        wrapper.querySelectorAll('p.game-text-style').forEach(p => {
            if(p !== movesDisplay) p.remove(); // Remove old end messages
        });
        createBoard();
    });
    wrapper.appendChild(restartButton);

    gameContainer.appendChild(wrapper);
    createBoard(); // Initialize the first game

    console.log('Memory Matrix loaded.');
});
