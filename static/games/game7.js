// static/games/game7.js - Drone Escape
'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container #game-container not found for Drone Escape.');
        return;
    }

    gameContainer.innerHTML = ''; // Clear 'Loading...' or previous content

    const title = document.createElement('h3');
    title.textContent = 'Drone Escape';
    title.className = 'game-title-style';
    gameContainer.appendChild(title);

    const statusDisplay = document.createElement('p');
    statusDisplay.className = 'game-text-style';
    statusDisplay.style.minHeight = '4em'; // Adjusted for potentially longer messages
    statusDisplay.style.marginBottom = '15px';
    statusDisplay.setAttribute('aria-live', 'polite');
    gameContainer.appendChild(statusDisplay);

    const integrityDisplay = document.createElement('p');
    integrityDisplay.className = 'game-text-style';
    integrityDisplay.style.fontSize = '1em';
    integrityDisplay.id = 'drone-integrity';
    gameContainer.appendChild(integrityDisplay);

    const distanceDisplay = document.createElement('p');
    distanceDisplay.className = 'game-text-style';
    distanceDisplay.style.fontSize = '1em';
    distanceDisplay.id = 'drone-distance';
    gameContainer.appendChild(distanceDisplay);

    const choicesContainer = document.createElement('div');
    choicesContainer.id = 'drone-choices';
    choicesContainer.style.marginTop = '20px';
    choicesContainer.style.display = 'flex';
    choicesContainer.style.flexDirection = 'column';
    choicesContainer.style.alignItems = 'center';
    choicesContainer.style.gap = '10px';
    gameContainer.appendChild(choicesContainer);

    const restartButton = document.createElement('button');
    restartButton.id = 'drone-restart-button';
    restartButton.className = 'game-button';
    restartButton.style.marginTop = '20px';
    restartButton.style.display = 'none'; // Hidden initially
    restartButton.onclick = startGame; // Assign directly
    gameContainer.appendChild(restartButton);

    let droneIntegrity;
    let distanceToExtraction;
    let currentScenario;

    const MAX_INTEGRITY = 100;
    const INITIAL_DISTANCE = 5; // Reduced for quicker gameplay testing; original was 20

    const scenarios = [
        {
            text: 'Approaching asteroid field. Sensors detect two paths.',
            choices: [
                { text: 'Navigate through (Risky, -1 Distance)', risk: 0.6, integrityEffect: -25, distanceEffect: -1 },
                { text: 'Go around (Safer, Slower)', risk: 0.2, integrityEffect: -10, distanceEffect: -1 }
            ]
        },
        {
            text: 'Security patrol detected ahead!',
            choices: [
                { text: 'Attempt stealth maneuver (-1 Distance)', risk: 0.5, integrityEffect: -20, distanceEffect: -1 },
                { text: 'Deploy countermeasures and speed past (-1 Distance)', risk: 0.4, integrityEffect: -15, distanceEffect: -1 }
            ]
        },
        {
            text: 'Unstable energy signature detected.',
            choices: [
                { text: 'Investigate (Potential reward/damage)', risk: 0.5, integrityEffect: () => (Math.random() > 0.5 ? 10 : -30), distanceEffect: 0 },
                { text: 'Avoid and reroute (-1 Distance)', risk: 0.1, integrityEffect: -5, distanceEffect: -1 }
            ]
        },
        {
            text: 'Clear passage. Opportunity to boost engines.',
            choices: [
                { text: 'Boost engines (-2 Distance, Slight Risk)', risk: 0.2, integrityEffect: -10, distanceEffect: -2 },
                { text: 'Maintain course (-1 Distance, Safe)', risk: 0.0, integrityEffect: 0, distanceEffect: -1 }
            ]
        }
    ];

    function updateDisplays() {
        integrityDisplay.textContent = `Drone Integrity: ${droneIntegrity}%`;
        distanceDisplay.textContent = `Distance to Extraction: ${distanceToExtraction} units`;
        integrityDisplay.style.color = droneIntegrity < 30 ? 'var(--error-color)' : 'var(--text-color)';
    }

    function startGame() {
        droneIntegrity = MAX_INTEGRITY;
        distanceToExtraction = INITIAL_DISTANCE;
        restartButton.style.display = 'none';
        choicesContainer.style.display = 'flex'; // Ensure choices are visible
        statusDisplay.style.color = 'var(--text-color)'; // Reset status color
        nextScenario(); // This will also call updateDisplays
    }

    function nextScenario() {
        updateDisplays(); // Update display at the start of a new scenario/check
        if (distanceToExtraction <= 0) {
            winGame();
            return;
        }
        if (droneIntegrity <= 0) {
            loseGame();
            return;
        }

        currentScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        statusDisplay.textContent = currentScenario.text;
        statusDisplay.style.color = 'var(--text-color)';

        choicesContainer.innerHTML = '';
        currentScenario.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.className = 'game-button';
            button.onclick = () => handleChoice(index);
            choicesContainer.appendChild(button);
        });
    }

    function handleChoice(choiceIndex) {
        const chosen = currentScenario.choices[choiceIndex];
        let outcomeMessage = '';

        const baseIntegrityEffect = typeof chosen.integrityEffect === 'function' ? chosen.integrityEffect() : chosen.integrityEffect;

        if (Math.random() < chosen.risk) { // Failure
            droneIntegrity += baseIntegrityEffect; 
            outcomeMessage = `Maneuver failed! Drone damaged. Integrity change: ${baseIntegrityEffect > 0 ? '+' : ''}${baseIntegrityEffect}%`;
            statusDisplay.style.color = 'var(--error-color)';
        } else { // Success
            let integrityChangeOnSuccess = 0;
            if (baseIntegrityEffect < 0) { // Base effect is damaging
                integrityChangeOnSuccess = Math.floor(baseIntegrityEffect / 2); // Half damage, ensure integer
            } else if (baseIntegrityEffect > 0) { // Base effect is positive (reward)
                if (chosen.risk > 0.4) { // Risky positive effect gets nullified reward on success
                    integrityChangeOnSuccess = 0;
                } else {
                    integrityChangeOnSuccess = baseIntegrityEffect; // Full reward
                }
            }
            // If baseIntegrityEffect is 0, integrityChangeOnSuccess remains 0.

            droneIntegrity += integrityChangeOnSuccess;
            distanceToExtraction += chosen.distanceEffect;
            
            let successDetails = `Distance covered.`;
            if (integrityChangeOnSuccess !== 0) {
                successDetails += ` Integrity change: ${integrityChangeOnSuccess > 0 ? '+' : ''}${integrityChangeOnSuccess}%.`;
            }
            outcomeMessage = `Maneuver successful! ${successDetails}`;
            statusDisplay.style.color = 'var(--success-color)';
        }
        
        droneIntegrity = Math.min(MAX_INTEGRITY, droneIntegrity);
        droneIntegrity = Math.max(0, droneIntegrity); // Integrity cannot be less than 0

        statusDisplay.textContent = outcomeMessage;
        
        choicesContainer.innerHTML = '<p class="game-text-style">Processing...</p>';
        
        setTimeout(() => {
            nextScenario(); 
        }, 2000);
    }

    function winGame() {
        statusDisplay.textContent = 'Extraction Point Reached! Drone escaped successfully!';
        statusDisplay.style.color = 'var(--accent-1)';
        choicesContainer.style.display = 'none';
        restartButton.textContent = 'New Mission';
        restartButton.style.display = 'block';
    }

    function loseGame() {
        droneIntegrity = 0; // Ensure integrity is 0 on loss screen
        updateDisplays(); // Update to show 0% integrity
        statusDisplay.textContent = 'Drone Integrity Critical! Mission Failed.';
        statusDisplay.style.color = 'var(--error-color)';
        choicesContainer.style.display = 'none';
        restartButton.textContent = 'Retry Mission';
        restartButton.style.display = 'block';
    }

    startGame(); // Initialize
});
