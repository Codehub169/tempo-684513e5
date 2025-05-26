// static/games/game4.js - Space Navigator (Placeholder)
'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container #game-container not found for Space Navigator.');
        return;
    }

    let targetX, targetY;
    let currentX = 0;
    let currentY = 0;
    let moves = 0;
    const step = 10; // Ship moves 10 units at a time

    gameContainer.innerHTML = `
        <h3 class='game-title-style'>Space Navigator</h3>
        <p class='game-text-style'>Navigate your ship to the target coordinates.</p>
        <p class='game-text-style'>Current Position: <span id='current-pos'></span></p>
        <p class='game-text-style'>Target Coordinates: <span id='target-pos'></span></p>
        <p class='game-text-style'>Moves: <span id='nav-moves'>0</span></p>
        <div style='margin-top: 20px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;'>
            <button class='game-button nav-button' onclick='navigate("N")'>North (+Y)</button>
            <button class='game-button nav-button' onclick='navigate("S")'>South (-Y)</button>
            <button class='game-button nav-button' onclick='navigate("E")'>East (+X)</button>
            <button class='game-button nav-button' onclick='navigate("W")'>West (-X)</button>
        </div>
        <p class='game-text-style' id='nav-status' style='min-height: 1em; margin-top:15px;'></p>
        <button class='game-button' style='margin-top:10px;' onclick='resetNav()'>New Target</button>
    `;

    const currentPosElement = document.getElementById('current-pos');
    const targetPosElement = document.getElementById('target-pos');
    const navMovesElement = document.getElementById('nav-moves');
    const navStatusElement = document.getElementById('nav-status');
    const navButtons = document.querySelectorAll('.nav-button'); // NodeList

    if (!currentPosElement || !targetPosElement || !navMovesElement || !navStatusElement || navButtons.length === 0) {
        console.error('Critical game elements not found for Space Navigator.');
        return;
    }

    function updateDisplay() {
        currentPosElement.textContent = `X: ${currentX}, Y: ${currentY}`;
        targetPosElement.textContent = `X: ${targetX}, Y: ${targetY}`;
        navMovesElement.textContent = moves;
        if (currentX === targetX && currentY === targetY) {
            navStatusElement.textContent = `Target reached in ${moves} moves! Excellent navigation!`;
            navStatusElement.style.color = 'var(--accent-1)';
            navButtons.forEach(b => b.disabled = true);
        } else {
            navStatusElement.textContent = 'Adjust course to reach target coordinates.';
            navStatusElement.style.color = 'var(--text-color)';
        }
    }

    window.navigate = function(direction) {
        if (currentX === targetX && currentY === targetY) return; // Game already won
        moves++;
        switch (direction) {
            case 'N': currentY += step; break;
            case 'S': currentY -= step; break;
            case 'E': currentX += step; break;
            case 'W': currentX -= step; break;
        }
        updateDisplay();
    };

    window.resetNav = function() {
        targetX = Math.floor(Math.random() * 200) - 100;
        targetY = Math.floor(Math.random() * 200) - 100;
        // Ensure target is not 0,0 initially if player starts at 0,0
        if (targetX === 0 && targetY === 0) {
            targetX = (Math.random() > 0.5 ? 1 : -1) * step * (Math.floor(Math.random()*5)+1); // Ensure it's reachable
        }
        currentX = 0;
        currentY = 0;
        moves = 0;
        navButtons.forEach(b => b.disabled = false);
        navStatusElement.textContent = ''; // Clear previous win/status message
        updateDisplay();
    };

    resetNav(); // Initial setup calls updateDisplay internally
});
