// static/games/game2.js - Asteroid Miner (Placeholder)
'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container #game-container not found for Asteroid Miner.');
        return;
    }
    gameContainer.innerHTML = `
        <h3 class='game-title-style'>Asteroid Miner</h3>
        <p class='game-text-style'>Equip your laser, and start mining those valuable ores!</p>
        <p class='game-text-style'>Ore Collected: <span id='ore'>0</span> units</p>
        <p class='game-text-style'>Laser Power: <span id='power'>100</span>%</p>
        <div style='margin-top: 20px;'>
            <button class='game-button' onclick='mineAction()'>Mine Asteroid</button>
            <button class='game-button' onclick='rechargeAction()'>Recharge Laser</button>
        </div>
        <p class='game-text-style' id='mining-status' style='min-height: 1em; margin-top:15px;'></p>
    `;

    const oreElement = document.getElementById('ore');
    const powerElement = document.getElementById('power');
    const statusElement = document.getElementById('mining-status');

    if (!oreElement || !powerElement || !statusElement) {
        console.error('Critical game elements (ore, power, or status) not found for Asteroid Miner.');
        return;
    }

    window.mineAction = function() {
        let currentOre = parseInt(oreElement.textContent);
        let currentPower = parseInt(powerElement.textContent);

        if (currentPower >= 10) {
            currentPower -= 10;
            const minedAmount = Math.floor(Math.random() * 5) + 1;
            currentOre += minedAmount;
            statusElement.textContent = `Mined ${minedAmount} units of ore. Laser power at ${currentPower}%.`;
            statusElement.style.color = 'var(--success-color)';
        } else {
            statusElement.textContent = 'Laser power too low to mine! Recharge.';
            statusElement.style.color = 'var(--error-color)';
        }
        oreElement.textContent = currentOre;
        powerElement.textContent = currentPower;
    };

    window.rechargeAction = function() {
        powerElement.textContent = 100;
        statusElement.textContent = 'Laser fully recharged!';
        statusElement.style.color = 'var(--info-color)'; // Using info-color for recharge as it's a neutral positive action
    };
});
