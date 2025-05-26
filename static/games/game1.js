// static/games/game1.js - Starship Trader (Placeholder)
'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container #game-container not found for Starship Trader.');
        return;
    }

    gameContainer.innerHTML = `
        <h3 class='game-title-style'>Starship Trader</h3>
        <p class='game-text-style'>Welcome, Trader! Your mission is to amass a fortune by buying and selling goods across the galaxy.</p>
        <p class='game-text-style'>Current Credits: <span id='credits'>1000</span></p>
        <p class='game-text-style'>Current Cargo: <span id='cargo'>None</span></p>
        <div style='margin-top: 20px;'>
            <button class='game-button' onclick='tradeAction("buy", "Alpha Crystals", 100)'>Buy Alpha Crystals (100c)</button>
            <button class='game-button' onclick='tradeAction("sell", "Alpha Crystals", 120)'>Sell Alpha Crystals (120c)</button>
        </div>
        <p class='game-text-style' id='trade-status' style='min-height: 1em; margin-top:15px;'></p>
    `;

    const creditsElement = document.getElementById('credits');
    const cargoElement = document.getElementById('cargo');
    const statusElement = document.getElementById('trade-status');

    if (!creditsElement || !cargoElement || !statusElement) {
        console.error('Critical game elements (credits, cargo, or status) not found for Starship Trader.');
        return;
    }

    window.tradeAction = function(action, item, price) {
        let currentCredits = parseInt(creditsElement.textContent);
        let currentCargo = cargoElement.textContent;

        if (action === 'buy') {
            if (currentCredits >= price) {
                currentCredits -= price;
                currentCargo = item;
                statusElement.textContent = `Bought ${item} for ${price}c.`;
                statusElement.style.color = 'var(--success-color)';
            } else {
                statusElement.textContent = 'Not enough credits!';
                statusElement.style.color = 'var(--error-color)';
            }
        } else if (action === 'sell') {
            if (currentCargo === item) {
                currentCredits += price;
                currentCargo = 'None';
                statusElement.textContent = `Sold ${item} for ${price}c.`;
                statusElement.style.color = 'var(--success-color)';
            } else {
                statusElement.textContent = 'No such item in cargo!';
                statusElement.style.color = 'var(--error-color)';
            }
        }
        creditsElement.textContent = currentCredits;
        cargoElement.textContent = currentCargo;
    };
});
