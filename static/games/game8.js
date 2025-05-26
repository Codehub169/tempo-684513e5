// static/games/game8.js - Net Runner's Gauntlet
'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error("Game container #game-container not found for Net Runner's Gauntlet.");
        return;
    }

    gameContainer.innerHTML = ''; // Clear 'Loading...' or previous content

    const title = document.createElement('h3');
    title.textContent = "Net Runner's Gauntlet";
    title.className = 'game-title-style';
    gameContainer.appendChild(title);

    const iceDisplay = document.createElement('p');
    iceDisplay.id = 'nrg-ice-display';
    iceDisplay.className = 'game-text-style';
    iceDisplay.style.minHeight = '3em';
    iceDisplay.style.marginBottom = '15px';
    gameContainer.appendChild(iceDisplay);

    const statusDisplay = document.createElement('p');
    statusDisplay.id = 'nrg-status-display';
    statusDisplay.className = 'game-text-style';
    statusDisplay.style.minHeight = '2em'; // Adjusted for potentially longer messages
    statusDisplay.setAttribute('aria-live', 'polite');
    gameContainer.appendChild(statusDisplay);

    const alertDisplay = document.createElement('p');
    alertDisplay.id = 'nrg-alert-display';
    alertDisplay.className = 'game-text-style';
    alertDisplay.style.fontSize = '1em';
    gameContainer.appendChild(alertDisplay);

    const dataDisplay = document.createElement('p');
    dataDisplay.id = 'nrg-data-display';
    dataDisplay.className = 'game-text-style';
    dataDisplay.style.fontSize = '1em';
    gameContainer.appendChild(dataDisplay);

    const actionsContainer = document.createElement('div');
    actionsContainer.id = 'nrg-actions-container';
    actionsContainer.style.marginTop = '20px';
    actionsContainer.style.display = 'flex';
    actionsContainer.style.justifyContent = 'center';
    actionsContainer.style.gap = '10px';
    actionsContainer.style.flexWrap = 'wrap';
    gameContainer.appendChild(actionsContainer);

    const restartButton = document.createElement('button');
    restartButton.id = 'nrg-restart-button';
    restartButton.className = 'game-button';
    restartButton.style.marginTop = '20px';
    restartButton.style.display = 'none';
    restartButton.onclick = startGame; // Assign directly
    gameContainer.appendChild(restartButton);

    let alertLevel;
    let dataAcquired;
    let currentICE;

    const MAX_ALERT = 100;
    const TARGET_DATA = 50;

    const iceTypes = [
        { name: 'Standard Firewall', strength: 3, weakness: 'BruteForce', data: 5, alertOnFail: 20 },
        { name: 'Tracer Daemon', strength: 5, weakness: 'StealthScript', data: 8, alertOnFail: 30 },
        { name: 'Black ICE Mk.II', strength: 7, weakness: 'ExploitAlpha', data: 12, alertOnFail: 25 },
        { name: 'Honeypot Trap', strength: 2, weakness: 'BypassRoutine', data: 3, alertOnFail: 15, special: 'dataStealOnFail' }
    ];

    const actions = [
        { name: 'BruteForce', baseSuccess: 0.6, alertOnSuccess: 5 },
        { name: 'StealthScript', baseSuccess: 0.5, alertOnSuccess: 2 },
        { name: 'ExploitAlpha', baseSuccess: 0.4, alertOnSuccess: 10 }, // More effective but riskier if not weakness
        { name: 'BypassRoutine', baseSuccess: 0.7, alertOnSuccess: 3 }
    ];

    function updateDisplays() {
        alertDisplay.textContent = `System Alert: ${alertLevel}%`;
        dataDisplay.textContent = `Data Acquired: ${dataAcquired} TB`;
        alertDisplay.style.color = alertLevel > 70 ? 'var(--error-color)' : (alertLevel > 40 ? 'var(--warning-color)' : 'var(--text-color)');
    }

    function startGame() {
        alertLevel = 0;
        dataAcquired = 0;
        restartButton.style.display = 'none';
        actionsContainer.style.display = 'flex';
        statusDisplay.textContent = 'Preparing for network intrusion...';
        statusDisplay.style.color = 'var(--text-color)';
        nextEncounter();
    }

    function nextEncounter() {
        updateDisplays();
        if (dataAcquired >= TARGET_DATA) {
            winGame();
            return;
        }
        if (alertLevel >= MAX_ALERT) {
            loseGame();
            return;
        }
        currentICE = iceTypes[Math.floor(Math.random() * iceTypes.length)];
        iceDisplay.textContent = `Encountered: ${currentICE.name} (Strength: ${currentICE.strength})`;
        
        actionsContainer.innerHTML = '';
        actions.forEach(action => {
            const button = document.createElement('button');
            button.textContent = action.name;
            button.className = 'game-button';
            button.onclick = () => handleAction(action);
            actionsContainer.appendChild(button);
        });
    }

    function handleAction(action) {
        let successChance = action.baseSuccess;
        if (currentICE.weakness === action.name) {
            successChance += 0.3; // Bonus for hitting weakness
        }
        successChance -= currentICE.strength * 0.05; // ICE strength reduces success
        successChance = Math.max(0.1, Math.min(0.95, successChance)); // Clamp probability

        let outcomeMessage;
        if (Math.random() < successChance) { // Success
            dataAcquired += currentICE.data;
            alertLevel += action.alertOnSuccess;
            outcomeMessage = `${action.name} successful against ${currentICE.name}! Acquired ${currentICE.data}TB data.`;
            statusDisplay.style.color = 'var(--success-color)';
        } else { // Failure
            alertLevel += currentICE.alertOnFail;
            outcomeMessage = `${action.name} failed! ${currentICE.name} countermeasures active.`;
            statusDisplay.style.color = 'var(--error-color)';
            if (currentICE.special === 'dataStealOnFail') {
                const stolenData = Math.floor(dataAcquired * 0.2);
                if (stolenData > 0) {
                    dataAcquired = Math.max(0, dataAcquired - stolenData);
                    outcomeMessage += ` Lost ${stolenData}TB data!`;
                }
            }
        }
        alertLevel = Math.min(MAX_ALERT, alertLevel);
        dataAcquired = Math.max(0, dataAcquired); // Ensure data doesn't go negative
        statusDisplay.textContent = outcomeMessage;
        
        actionsContainer.innerHTML = '<p class="game-text-style">Analyzing response...</p>';
        setTimeout(() => {
            nextEncounter();
        }, 2500);
    }

    function winGame() {
        statusDisplay.textContent = `Target data acquired! ${dataAcquired}TB. You are a master netrunner!`;
        statusDisplay.style.color = 'var(--accent-1)';
        actionsContainer.style.display = 'none';
        iceDisplay.textContent = 'System compromised. Victory!';
        restartButton.textContent = 'Run Again?';
        restartButton.style.display = 'block';
    }

    function loseGame() {
        alertLevel = MAX_ALERT; // Ensure alert is max on loss screen
        updateDisplays(); // Update to show max alert
        statusDisplay.textContent = `System Alert Critical! Connection terminated. Alert: ${alertLevel}%`;
        statusDisplay.style.color = 'var(--error-color)';
        actionsContainer.style.display = 'none';
        iceDisplay.textContent = 'Trace complete. Runner neutralized.';
        restartButton.textContent = 'Retry Gauntlet';
        restartButton.style.display = 'block';
    }

    startGame();
});
