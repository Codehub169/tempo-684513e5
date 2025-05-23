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
    title.textContent = 'Neon Racer';
    title.className = 'game-title-style';
    wrapper.appendChild(title);

    const scoreDisplay = document.createElement('p');
    scoreDisplay.className = 'game-text-style';
    scoreDisplay.style.fontSize = '1.2em';
    let score = 0;
    scoreDisplay.textContent = `Distance: ${score}m`;
    wrapper.appendChild(scoreDisplay);

    const canvas = document.createElement('canvas');
    canvas.width = Math.min(window.innerWidth * 0.8, 500);
    canvas.height = 300;
    canvas.style.border = '2px solid var(--accent-2)';
    canvas.style.backgroundColor = '#101020'; // Darker background for contrast
    canvas.style.display = 'block';
    canvas.style.margin = '10px auto';
    wrapper.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let player, obstacles, gameLoop, gameRunning, obstacleSpeed, spawnTimer;

    const playerWidth = 30;
    const playerHeight = 20;
    const playerColor = 'var(--accent-1)'; // Neon Pink

    function initGame() {
        player = {
            x: canvas.width / 2 - playerWidth / 2,
            y: canvas.height - playerHeight - 10,
            width: playerWidth,
            height: playerHeight,
            speed: 15 // Increased speed for better responsiveness
        };
        obstacles = [];
        score = 0;
        obstacleSpeed = 2;
        spawnTimer = 0;
        gameRunning = true;
        scoreDisplay.textContent = `Distance: ${score}m`;
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp); // Optional for smoother movement
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, 20); // ~50 FPS
    }

    let keys = {};
    function handleKeyDown(e) {
        keys[e.key] = true;
        if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) {
             e.preventDefault(); // Prevent page scroll
        }
        if (!gameRunning && (e.key === 'Enter' || e.key === ' ')) {
            initGame();
        }
    }
    function handleKeyUp(e) {
        keys[e.key] = false;
    }

    function movePlayer() {
        if (keys['ArrowLeft'] || keys['a']) {
            player.x -= player.speed;
        }
        if (keys['ArrowRight'] || keys['d']) {
            player.x += player.speed;
        }
        // Keep player within bounds
        player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    }

    function spawnObstacle() {
        const minWidth = 20, maxWidth = 50;
        const minHeight = 20, maxHeight = 40;
        const width = Math.random() * (maxWidth - minWidth) + minWidth;
        const height = Math.random() * (maxHeight - minHeight) + minHeight;
        const x = Math.random() * (canvas.width - width);
        obstacles.push({
            x: x,
            y: -height, // Start above canvas
            width: width,
            height: height,
            color: `hsl(${Math.random() * 360}, 100%, 70%)` // Random bright colors
        });
    }

    function updateGame() {
        if (!gameRunning) return;

        movePlayer();

        // Update obstacles
        spawnTimer++;
        if (spawnTimer > (100 - Math.min(score / 10, 70)) / (obstacleSpeed / 2) ) { // Spawn rate increases with score/speed
            spawnObstacle();
            spawnTimer = 0;
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].y += obstacleSpeed;
            if (obstacles[i].y > canvas.height) {
                obstacles.splice(i, 1);
                score += 10; // Score for avoiding an obstacle
                scoreDisplay.textContent = `Distance: ${score}m`;
                if (score % 100 === 0) { // Increase speed every 100m
                    obstacleSpeed += 0.2;
                }
            }

            // Collision detection
            if (
                player.x < obstacles[i].x + obstacles[i].width &&
                player.x + player.width > obstacles[i].x &&
                player.y < obstacles[i].y + obstacles[i].height &&
                player.y + player.height > obstacles[i].y
            ) {
                gameOver();
                return;
            }
        }

        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw player
        ctx.fillStyle = playerColor;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        // Simple triangle shape for player
        ctx.beginPath();
        ctx.moveTo(player.x + player.width / 2, player.y);
        ctx.lineTo(player.x, player.y + player.height);
        ctx.lineTo(player.x + player.width, player.y + player.height);
        ctx.closePath();
        ctx.fill();

        // Draw obstacles
        obstacles.forEach(obs => {
            ctx.fillStyle = obs.color;
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
    }

    function gameOver() {
        gameRunning = false;
        clearInterval(gameLoop);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        keys = {}; // Clear pressed keys

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '30px Orbitron, sans-serif';
        ctx.fillStyle = 'var(--accent-1)';
        ctx.textAlign = 'center';
        ctx.fillText('SYSTEM CRASH!', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '16px Roboto Mono, monospace';
        ctx.fillStyle = 'var(--text-color)';
        ctx.fillText(`Total Distance: ${score}m`, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText('Press ENTER to Retry', canvas.width / 2, canvas.height / 2 + 50);
    }
    
    const startInstructions = document.createElement('p');
    startInstructions.className = 'game-text-style';
    startInstructions.innerHTML = 'Use <b>Left/Right Arrows</b> or <b>A/D</b> to move. Avoid obstacles.<br>Press <b>ENTER</b> to start.';
    wrapper.appendChild(startInstructions);
    
    // Initial message on canvas before start
    function showInitialMessage() {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.font = '24px Orbitron, sans-serif';
        ctx.fillStyle = 'var(--accent-3)';
        ctx.textAlign = 'center';
        ctx.fillText('NEON RACER', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '14px Roboto Mono, monospace';
        ctx.fillStyle = 'var(--text-color)';
        ctx.fillText('Press ENTER to engage thrusters', canvas.width / 2, canvas.height / 2 + 20);
    }

    gameContainer.appendChild(wrapper);
    showInitialMessage(); // Show initial message on canvas
    document.addEventListener('keydown', handleKeyDown, { once: false }); // Listen for Enter to start

    console.log('Neon Racer loaded.');
});
