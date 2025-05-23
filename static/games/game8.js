// static/games/game8.js - Net Runner's Gauntlet
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error("Game container #game-container not found for Net Runner's Gauntlet.");
        return;
    }

    gameContainer.innerHTML = ''; // Clear 'Loading...' or previous content

    const title = document.createElement('h3');
    title.textContent = "Net Runner's Gauntlet"; // Correctly uses apostrophe
    title.className = 'game-title-style';
    gameContainer.appendChild(title);

    const statusDisplay = document.createElement('p');
    statusDisplay.className = 'game-text-style';
    statusDisplay.style.minHeight = '2em';
    statusDisplay.style.marginBottom = '20px';
    statusDisplay.setAttribute('aria-live', 'polite');
    gameContainer.appendChild(statusDisplay);

    const runCounter = document.createElement('p');
    runCounter.className = 'game-text-style';
    runCounter.style.fontSize = '0.9em';
    runCounter.setAttribute('aria-live', 'polite');
    gameContainer.appendChild(runCounter);

    const actionButton = document.createElement('button');
    actionButton.className = 'game-button';
    actionButton.style.marginTop = '20px';
    gameContainer.appendChild(actionButton);

    const events = [
        { msg: 'Firewall bypassed! Data node accessible.', success: true },
        { msg: 'Intrusion Detected! Black ICE countermeasure activated.', success: false },
        { msg: 'Found an exploit. Gained admin privileges!', success: true },
        { msg: 'Traced! Security daemons closing in.', success: false },
        { msg: 'Data packet intercepted successfully.', success: true },
        { msg: 'Connection unstable. Packet loss detected.', success: false }
    ];

    const winRuns = 21;
    const checkpointRuns = 7;
    let runsCompleted = 0;
    let gameJustReset = true;

    function initializeGame() {
        runsCompleted = 0;
        statusDisplay.textContent = 'Prepare to run the digital gauntlet.';
        statusDisplay.style.color = 'var(--text-color)';
        runCounter.textContent = `ICE Layers Breached: ${runsCompleted}`;
        actionButton.textContent = 'Breach Next Layer';
        gameJustReset = false;
    }

    actionButton.addEventListener('click', () => {
        if (gameJustReset) {
            initializeGame();
            return;
        }

        runsCompleted++;
        runCounter.textContent = `ICE Layers Breached: ${runsCompleted}`;
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        statusDisplay.textContent = randomEvent.msg;

        if (randomEvent.success) {
            statusDisplay.style.color = 'var(--success-color, #2ECC71)';
        } else {
            statusDisplay.style.color = 'var(--error-color, #E74C3C)';
        }

        if (runsCompleted >= winRuns) {
            statusDisplay.textContent = `Gauntlet Mastered! All ${runsCompleted} layers breached. You are a true Netrunner!`;
            statusDisplay.style.color = 'var(--accent-1, #1ABC9C)'; // Ensure win message has priority color
            actionButton.textContent = 'Run Again?';
            gameJustReset = true;
        } else if (runsCompleted > 0 && runsCompleted % checkpointRuns === 0) {
            // This message will be overridden if winRuns is also a multiple of checkpointRuns (e.g. 21 and 7)
            // but that's fine as the win message is more important.
            statusDisplay.textContent = `Checkpoint reached! ${runsCompleted} layers breached. System adapting...`;
            statusDisplay.style.color = 'var(--accent-1, #1ABC9C)';
        }
    });

    initializeGame();
});
