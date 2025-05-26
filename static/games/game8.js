// static/games/game8.js - Net Runner's Gauntlet
'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error("Game container #game-container not found for Net Runner's Gauntlet.");
        return;
    }

    gameContainer.innerHTML = '';

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
    statusDisplay.style.minHeight = '2em';
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
    restartButton.onclick = startGame;
    gameContainer.appendChild(restartButton);

    let alertLevel;
    let dataAcquired;
    let currentICE;
    let cloakUses = 2;

    const MAX_ALERT = 100;
    const TARGET_DATA = 50;
    const CLOAK_ALERT_REDUCTION = 10;
    const CLOAK_FAIL_ALERT_INCREASE = 5;

    const iceTypes = [
        { name: 'Standard Firewall', strength: 3, weakness: 'BruteForce', data: 5, alertOnFail: 20 },
        { name: 'Tracer Daemon', strength: 5, weakness: 'StealthScript', data: 8, alertOnFail: 30 },
        { name: 'Black ICE Mk.II', strength: 7, weakness: 'ExploitAlpha', data: 12, alertOnFail: 25 },
        { name: 'Honeypot Trap', strength: 2, weakness: 'BypassRoutine', data: 3, alertOnFail: 15, special: 'dataStealOnFail' },
        { name: 'Guardian Sentry', strength: 6, weakness: 'Cloak', data: 10, alertOnFail: 22}
    ];

    // Note: 'uses' and 'cost' properties for Cloak are not currently used in game logic but kept for potential future use.
    // 'alertOnSuccess' for Cloak is also not used; cloak success uses CLOAK_ALERT_REDUCTION.
    const actions = [
        { name: 'BruteForce', baseSuccess: 0.6, alertOnSuccess: 5 },
        { name: 'StealthScript', baseSuccess: 0.5, alertOnSuccess: 2 },
        { name: 'ExploitAlpha', baseSuccess: 0.4, alertOnSuccess: 10 },
        { name: 'BypassRoutine', baseSuccess: 0.7, alertOnSuccess: 3 },
        { name: 'Cloak', baseSuccess: 0.8, alertOnSuccess: 1, alertReduction: CLOAK_ALERT_REDUCTION, uses: () => cloakUses, cost: 1 } 
    ];

    function updateDisplays() {
        alertDisplay.textContent = `System Alert: ${alertLevel}% | Cloak Charges: ${cloakUses}`;
        dataDisplay.textContent = `Data Acquired: ${dataAcquired} TB`;
        alertDisplay.style.color = alertLevel > 70 ? 'var(--error-color)' : (alertLevel > 40 ? 'var(--warning-color, var(--highlight-color))' : 'var(--text-color)');
    }

    function startGame() {
        alertLevel = 0;
        dataAcquired = 0;
        cloakUses = 2; // Reset cloak uses
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
            if (action.name === 'Cloak') {
                button.textContent += ` (${cloakUses} left)`;
                if (cloakUses <= 0) button.disabled = true;
            }
            button.className = 'game-button';
            button.addEventListener('click', () => handleAction(action));
            actionsContainer.appendChild(button);
        });
    }

    function handleAction(action) {
        let successChance = action.baseSuccess;
        if (currentICE.weakness === action.name) {
            successChance += 0.3;
        }
        // Cloak bypasses strength check mostly, other actions are affected by ICE strength
        if (action.name !== 'Cloak') { 
            successChance -= currentICE.strength * 0.05;
        }
        successChance = Math.max(0.1, Math.min(0.95, successChance));

        let outcomeMessage;
        if (action.name === 'Cloak') {
            if (cloakUses > 0) {
                cloakUses--;
                if (Math.random() < successChance) {
                    alertLevel = Math.max(0, alertLevel - CLOAK_ALERT_REDUCTION);
                    outcomeMessage = `Cloak successful! Alert level reduced by ${CLOAK_ALERT_REDUCTION}.`;
                    statusDisplay.style.color = 'var(--success-color)';
                } else {
                    alertLevel += CLOAK_FAIL_ALERT_INCREASE;
                    outcomeMessage = `Cloak flickered! Alert slightly increased.`;
                    statusDisplay.style.color = 'var(--warning-color, var(--highlight-color))';
                }
            } else {
                outcomeMessage = 'No cloak charges left!';
                statusDisplay.textContent = outcomeMessage;
                statusDisplay.style.color = 'var(--error-color)';
                updateDisplays(); // Update displays to reflect cloak count change
                // Re-enable buttons for other actions, cloak button will be disabled by nextEncounter
                nextEncounter(); 
                return; // Don't proceed to timeout if no charges
            }
        } else if (Math.random() < successChance) { 
            dataAcquired += currentICE.data;
            alertLevel += action.alertOnSuccess;
            outcomeMessage = `SUCCESS: ${action.name} breached ${currentICE.name}. Acquired ${currentICE.data} TB of data. Alert increased by ${action.alertOnSuccess}.`;
            statusDisplay.style.color = 'var(--success-color)';
        } else {
            alertLevel += currentICE.alertOnFail;
            outcomeMessage = `FAILURE: ${action.name} failed against ${currentICE.name}. Alert increased by ${currentICE.alertOnFail}.`;
            statusDisplay.style.color = 'var(--error-color)';
            if (currentICE.special === 'dataStealOnFail' && dataAcquired > 0) {
                const stolenData = Math.min(dataAcquired, 5); // Steal up to 5 TB, but not more than acquired
                dataAcquired -= stolenData;
                outcomeMessage += ` The honeypot stole ${stolenData} TB of your data!`;
            }
        }
        alertLevel = Math.min(MAX_ALERT, Math.max(0, alertLevel)); // Ensure alert is within 0-MAX_ALERT
        dataAcquired = Math.max(0, dataAcquired); // Ensure data doesn't go below 0

        statusDisplay.textContent = outcomeMessage;
        // Disable buttons during timeout
        actionsContainer.querySelectorAll('.game-button').forEach(btn => btn.disabled = true);
        setTimeout(nextEncounter, 2500);
    }

    function winGame() {
        iceDisplay.textContent = 'CONNECTION TERMINATED.';
        statusDisplay.textContent = `Mission Accomplished! Acquired ${dataAcquired} TB. Alert level: ${alertLevel}%. You're a master net runner!`;
        statusDisplay.style.color = 'var(--accent-1)';
        actionsContainer.style.display = 'none';
        restartButton.textContent = 'Run Again';
        restartButton.style.display = 'inline-block';
    }

    function loseGame() {
        iceDisplay.textContent = 'SYSTEM LOCKDOWN! CONNECTION SEVERED.';
        statusDisplay.textContent = `Run Failed! Alert level reached ${MAX_ALERT}%. Traced and apprehended. Data Acquired: ${dataAcquired} TB.`;
        statusDisplay.style.color = 'var(--error-color)';
        actionsContainer.style.display = 'none';
        restartButton.textContent = 'Retry Run';
        restartButton.style.display = 'inline-block';
    }

    startGame();
});
