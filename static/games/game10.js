// static/games/game10.js - Stealth Infiltrator
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container #game-container not found for Stealth Infiltrator.');
        return;
    }

    gameContainer.innerHTML = ''; // Clear 'Loading...'

    const title = document.createElement('h3');
    title.textContent = 'Stealth Infiltrator';
    title.className = 'game-title-style';
    gameContainer.appendChild(title);

    const statusDisplay = document.createElement('p');
    statusDisplay.className = 'game-text-style';
    statusDisplay.textContent = 'Objective: Infiltrate the mainframe. Avoid detection.';
    statusDisplay.style.minHeight = '3em'; // More space for multi-line status
    statusDisplay.style.marginBottom = '20px';
    gameContainer.appendChild(statusDisplay);

    let objectivesCompleted = 0;
    const objectiveCounter = document.createElement('p');
    objectiveCounter.className = 'game-text-style';
    objectiveCounter.textContent = `Security Layers Bypassed: ${objectivesCompleted}`;
    objectiveCounter.style.fontSize = '0.9em';
    gameContainer.appendChild(objectiveCounter);

    const actionButton = document.createElement('button');
    actionButton.textContent = 'Attempt Next Move';
    actionButton.className = 'game-button';
    actionButton.style.marginTop = '20px';
    gameContainer.appendChild(actionButton);

    const infiltrationEvents = [
        { move: 'Bypass Laser Grid', outcome: 'Successful. Grid deactivated.', success: true },
        { move: 'Disable Camera', outcome: 'Guard alerted! Increased patrol.', success: false },
        { move: 'Hack Terminal', outcome: 'Access codes acquired. New route opened.', success: true },
        { move: 'Silent Takedown', outcome: 'Guard neutralized. Sector clear.', success: true },
        { move: 'Pressure Plate Avoided', outcome: 'Almost triggered alarm! Close call.', success: false },
        { move: 'Data Spike Planted', outcome: 'Objective data acquired.', success: true }
    ];

    actionButton.addEventListener('click', () => {
        objectivesCompleted++;
        objectiveCounter.textContent = `Security Layers Bypassed: ${objectivesCompleted}`;
        const randomEvent = infiltrationEvents[Math.floor(Math.random() * infiltrationEvents.length)];
        statusDisplay.innerHTML = `Action: ${randomEvent.move}<br>Outcome: ${randomEvent.outcome}`;
        
        if (randomEvent.success) {
            statusDisplay.style.color = 'var(--success-color, #2ECC71)';
        } else {
            statusDisplay.style.color = 'var(--error-color, #E74C3C)';
        }

        if (objectivesCompleted >= 12) {
            statusDisplay.innerHTML = `Mainframe Breached! ${objectivesCompleted} layers infiltrated. Mission accomplished, ghost.`;
            statusDisplay.style.color = 'var(--accent-1, #1ABC9C)';
            actionButton.textContent = 'New Infiltration Op';
            objectivesCompleted = -1;
        }
    });
});
