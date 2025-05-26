// static/games/game10.js - Stealth Infiltrator
'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container #game-container not found for Stealth Infiltrator.');
        return;
    }

    let playerPosition = { x: 0, y: 0 };
    let targetPosition = { x: 4, y: 4 };
    let guardPositions = []; // Will be initialized in initializeGame
    let guardMoveIndices = []; // Will be initialized in initializeGame
    let detectionLevel = 0;
    let moves = 0;
    const gridSize = 5;
    const MAX_DETECTION = 100;
    const DETECTION_PER_SIGHTING = 25;
    const DETECTION_PER_COLLISION = 50;

    // Initial HTML structure
    gameContainer.innerHTML = `
        <h3 class='game-title-style'>Stealth Infiltrator</h3>
        <p class='game-text-style'>Evade guards, bypass security, and reach your objective (T). Watch your detection level!</p>
        <div id='si-grid-container' style='display: grid; grid-template-columns: repeat(${gridSize}, 40px); grid-template-rows: repeat(${gridSize}, 40px); gap: 2px; margin: 20px auto; width: ${gridSize * 40 + (gridSize - 1) * 2}px; border: 1px solid var(--accent-2); background-color: var(--primary-bg);'></div>
        <p class='game-text-style'>Moves: <span id='si-moves'>0</span> | Detection: <span id='si-detection'>0</span>%</p>
        <div id='si-controls' style='margin-top: 15px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;'>
            <button class='game-button si-control' data-dir='N'>Move North</button>
            <button class='game-button si-control' data-dir='S'>Move South</button>
            <button class='game-button si-control' data-dir='E'>Move East</button>
            <button class='game-button si-control' data-dir='W'>Move West</button>
            <button class='game-button si-control' data-dir='WAIT'>Wait</button>
        </div>
        <p class='game-text-style' id='si-feedback' style='min-height: 1.2em; margin-top:10px;' aria-live='polite'></p>
        <button id='si-restart-button' class='game-button' style='margin-top:10px; display:none;'>Restart Infiltration</button>
    `;

    const gridContainer = document.getElementById('si-grid-container');
    const movesDisplay = document.getElementById('si-moves');
    const detectionDisplay = document.getElementById('si-detection');
    const feedbackDisplay = document.getElementById('si-feedback');
    const restartButton = document.getElementById('si-restart-button');
    const controlButtons = document.querySelectorAll('.si-control');

    if (!gridContainer || !movesDisplay || !detectionDisplay || !feedbackDisplay || !restartButton || controlButtons.length === 0) {
        console.error('Critical game elements not found for Stealth Infiltrator.');
        gameContainer.innerHTML = '<p class="game-text-style" style="color: var(--error-color);">Error: Critical game elements missing. Cannot load Stealth Infiltrator.</p>';
        return;
    }

    function drawGrid() {
        gridContainer.innerHTML = '';
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = document.createElement('div');
                cell.style.width = '40px';
                cell.style.height = '40px';
                cell.style.border = '1px solid var(--accent-3)';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontSize = '1.2em';
                cell.style.color = 'var(--text-color)';
                cell.style.boxSizing = 'border-box';

                if (r === playerPosition.y && c === playerPosition.x) {
                    cell.textContent = 'P';
                    cell.style.backgroundColor = 'var(--player-color, var(--accent-1))';
                } else if (r === targetPosition.y && c === targetPosition.x) {
                    cell.textContent = 'T';
                    cell.style.backgroundColor = 'var(--target-color, var(--success-color))';
                } else if (guardPositions.some(g => g.y === r && g.x === c)) {
                    cell.textContent = 'G';
                    cell.style.backgroundColor = 'var(--guard-color, var(--error-color))';
                } else {
                    cell.style.backgroundColor = 'var(--background-color-secondary, var(--background-color))';
                }
                gridContainer.appendChild(cell);
            }
        }
    }

    function movePlayer(dx, dy) {
        const newX = playerPosition.x + dx;
        const newY = playerPosition.y + dy;

        if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
            playerPosition.x = newX;
            playerPosition.y = newY;
            return true;
        }   
        return false;
    }

    function moveGuards() {
        guardPositions.forEach((guard, index) => {
            const path = guard.path;
            if (!path || path.length === 0) return; // Should not happen with initialization logic
            
            const currentMoveDir = path[guardMoveIndices[index] % path.length];
            let dx = 0, dy = 0;
            switch(currentMoveDir) {
                case 'N': dy = -1; break;
                case 'S': dy = 1; break;
                case 'E': dx = 1; break;
                case 'W': dx = -1; break;
            }
            
            const newX = guard.x + dx;
            const newY = guard.y + dy;

            // Guards can only move to valid, unoccupied (by other guards or target) cells
            // Player collision is handled by detection, not movement blocking for guards.
            const isTargetCell = newX === targetPosition.x && newY === targetPosition.y;
            const isOtherGuardCell = guardPositions.some((otherGuard, otherIndex) => 
                index !== otherIndex && otherGuard.x === newX && otherGuard.y === newY
            );

            if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize && !isTargetCell && !isOtherGuardCell) {
                guard.x = newX;
                guard.y = newY;
            }
            guardMoveIndices[index]++;
        });
    }

    function checkDetection() {
        let detectedThisTurn = false;
        let collidedThisTurn = false;

        guardPositions.forEach(guard => {
            if (guard.x === playerPosition.x && guard.y === playerPosition.y) {
                collidedThisTurn = true;
                return; // Collision is highest priority detection
            }
            // Line of sight (horizontal/vertical) or adjacent (includes diagonals)
            if (guard.x === playerPosition.x || guard.y === playerPosition.y || 
                (Math.abs(guard.x - playerPosition.x) <= 1 && Math.abs(guard.y - playerPosition.y) <= 1)) {
                detectedThisTurn = true;
            }
        });

        if (collidedThisTurn) {
            detectionLevel += DETECTION_PER_COLLISION;
            feedbackDisplay.textContent = 'Collision with guard! Major detection increase!';
            feedbackDisplay.style.color = 'var(--error-color)';
        } else if (detectedThisTurn) {
            detectionLevel += DETECTION_PER_SIGHTING;
            feedbackDisplay.textContent = 'Spotted by a guard! Detection increased.';
            feedbackDisplay.style.color = 'var(--warning-color, var(--highlight-color))';
        } else if (feedbackDisplay.textContent.startsWith('Spotted')) { // If previously spotted but not now
             feedbackDisplay.textContent = 'Clear for now...';
             feedbackDisplay.style.color = 'var(--success-color)';
        }
        // If feedback was not set by detection, it remains as set by player action or empty.

        detectionLevel = Math.min(MAX_DETECTION, detectionLevel);
        detectionDisplay.textContent = detectionLevel + '%';
        detectionDisplay.style.color = detectionLevel > 75 ? 'var(--error-color)' : (detectionLevel > 40 ? 'var(--warning-color, var(--highlight-color))' : 'var(--text-color)');
    }

    function gameTurn(playerAction) {
        moves++;
        movesDisplay.textContent = moves;
        // Clear feedback from previous turn's detection, but keep player action feedback if any.
        if (!feedbackDisplay.textContent || feedbackDisplay.textContent.startsWith('Spotted') || feedbackDisplay.textContent.startsWith('Clear for now')) {
            feedbackDisplay.textContent = ''; 
        }

        if (playerAction !== 'WAIT') {
            let dx = 0, dy = 0;
            if (playerAction === 'N') dy = -1;
            if (playerAction === 'S') dy = 1;
            if (playerAction === 'E') dx = 1;
            if (playerAction === 'W') dx = -1;
            
            if(!movePlayer(dx, dy)) {
                feedbackDisplay.textContent = 'Cannot move out of bounds.';
                feedbackDisplay.style.color = 'var(--warning-color, var(--highlight-color))';
                moves--; // Don't count invalid move
                movesDisplay.textContent = moves;
                return; // Don't proceed if move is invalid
            }
        } else {
            feedbackDisplay.textContent = 'Player waits... observing patterns.';
            feedbackDisplay.style.color = 'var(--info-color, var(--accent-2))';
        }

        moveGuards();
        drawGrid();
        checkDetection(); // This might override feedbackDisplay text.

        if (playerPosition.x === targetPosition.x && playerPosition.y === targetPosition.y) {
            endGame(true);
        } else if (detectionLevel >= MAX_DETECTION) {
            endGame(false);
        }
    }

    function endGame(win) {
        controlButtons.forEach(b => b.disabled = true);
        restartButton.style.display = 'inline-block';
        if (win) {
            feedbackDisplay.textContent = `Objective Reached in ${moves} moves! Detection: ${detectionLevel}%. Master Infiltrator!`;
            feedbackDisplay.style.color = 'var(--accent-1)';
        } else {
            feedbackDisplay.textContent = `Infiltration Failed! Detection reached ${MAX_DETECTION}% in ${moves} moves.`;
            feedbackDisplay.style.color = 'var(--error-color)';
        }
    }

    function initializeGame() {
        playerPosition = { x: 0, y: 0 };
        
        do {
            targetPosition = { 
                x: Math.floor(Math.random() * (gridSize -1)) + 1, 
                y: Math.floor(Math.random() * (gridSize -1)) + 1 
            };
        } while (targetPosition.x === playerPosition.x && targetPosition.y === playerPosition.y);

        guardPositions = [
            { x: 0, y: 0, path: ['N','S','E','W'].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random()*2)+2) }, 
            { x: 0, y: 0, path: ['E','W','N','S'].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random()*2)+2) }
        ];
        
        guardMoveIndices = guardPositions.map(() => 0);

        guardPositions.forEach(g => {
            do {
                g.x = Math.floor(Math.random() * gridSize);
                g.y = Math.floor(Math.random() * gridSize);
            } while((g.x === playerPosition.x && g.y === playerPosition.y) || 
                    (g.x === targetPosition.x && g.y === targetPosition.y) ||
                     guardPositions.some(otherG => otherG !== g && otherG.x === g.x && otherG.y === g.y) // Avoid guards starting on same spot
                   );
            if(!g.path || g.path.length === 0) g.path = ['N', 'S']; // Ensure guards have a path
        });

        detectionLevel = 0;
        moves = 0;
        movesDisplay.textContent = moves;
        detectionDisplay.textContent = detectionLevel + '%';
        detectionDisplay.style.color = 'var(--text-color)';
        feedbackDisplay.textContent = 'Infiltration initiated. Good luck.';
        feedbackDisplay.style.color = 'var(--info-color, var(--accent-2))';
        controlButtons.forEach(b => b.disabled = false);
        restartButton.style.display = 'none';
        drawGrid();
    }

    controlButtons.forEach(button => {
        button.addEventListener('click', (e) => gameTurn(e.target.dataset.dir));
    });
    restartButton.addEventListener('click', initializeGame);

    initializeGame();
});
