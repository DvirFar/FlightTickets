function startGame() {
    // DOM elements for game control and display
    const gameArea = document.getElementById('game-area');
    const gameScore = document.getElementById('score');
    const obstacles = document.querySelector('#obstacles');
    const player = document.getElementById('player');
    const restartButton = document.getElementById('restart-game');
    const gameTimeout = []; // Stores intervals for managing dynamic game speed

    // Retrieve user data from localStorage
    //const users = JSON.parse(localStorage.getItem('users'));
    //const userIndex = users.findIndex(user => user.username === sessionStorage.getItem('username'));
    //let userGame = JSON.parse(JSON.parse(users[userIndex].gamesOwned)["FallingFrenzy"]);

    // Game configuration variables
    let tickRate = 30, // Game refresh rate (ms)
        keyDown = {}, // Tracks currently pressed keys
        keyMap = { // Maps key codes to game actions
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };

    let playerX = gameArea.offsetWidth / 2 - 15; // Initial player position
    let score = 0; // Player's current score
    let isRunning = true; // Game state
    let obstacleSpeed = 5; // Speed of falling obstacles

    // Event listeners for player controls
    document.addEventListener('keydown', (e) => { keyDown[keyMap[e.key]] = true; });
    document.addEventListener('keyup', (e) => { keyDown[keyMap[e.key]] = false; });

    // Game tick function: handles player movement
    let tick = () => {
        const gameLeftBorder = 0;
        const gameRightBorder = gameArea.offsetWidth;

        // Move player left or right based on key input
        if (keyDown['left'] && playerX - 30 > gameLeftBorder) {
            playerX -= 15;
        } else if (keyDown['right'] && playerX + 30 < gameRightBorder) {
            playerX += 15;
        }
        player.style.left = playerX + 'px';

        setTimeout(tick, tickRate); // Continuously refresh game logic
    };

    tick(); // Start game logic

    // Create a new obstacle and add it to the game area
    function createObstacle() {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
        obstacle.style.top = 0;
        obstacles.appendChild(obstacle);
    }

    // Handle the falling obstacles' behavior
    function dropObjects() {
        if (!isRunning) {
            clearInterval(fallInterval);
            obstacles.innerHTML = ''; // Clear obstacles when the game stops
        }
            
        for (let obstacle of obstacles.children) {
            let obstacleY = parseInt(obstacle.style.top) + obstacleSpeed; // Move obstacle down
            obstacle.style.top = obstacleY + 'px';

            // Check for collisions with the player
            if (checkCollision(player, obstacle)) {
                endGame();
            }
        
            // Remove obstacles that go off-screen and update the score
            if (obstacleY > gameArea.offsetHeight) {
                obstacle.remove();
                score++;
                let temp = obstacleSpeed;
                obstacleSpeed = 5 + Math.floor(score / 5); // Increase obstacle speed over time
                if ((obstacleSpeed - temp) && (temp % 2)) {
                    gameTimeout.push(setInterval(gameLoop, 1000 - Math.min(score * 10, 800)));
                }
                gameScore.textContent = `Score: ${score}`; // Update score display
            }
        }
    }

    let fallInterval = setInterval(dropObjects, 20); // Regularly update obstacle positions

    // Check for collision between the player and an obstacle
    function checkCollision(player, obstacle) {
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        // Collision detection logic
        return !(
            playerRect.top > obstacleRect.bottom ||
            playerRect.right < obstacleRect.left ||
            playerRect.bottom < obstacleRect.top ||
            playerRect.left > obstacleRect.right
        );
    }

    // Update user data in localStorage after game ends
    function updateMemory() {
        //userGame.timePlayed += Date.now();
        //userGame.lastPlayed = new Date();
        //userGame.highScore.time = userGame.highScore.score > score ? userGame.highScore.time : (new Date()).toLocaleString();
        //userGame.highScore.score = Math.max(userGame.highScore.score, score);

        // Save updated game data to localStorage
        //users[userIndex].gamesOwned = JSON.parse(users[userIndex].gamesOwned);
        //users[userIndex].gamesOwned["FallingFrenzy"] = JSON.stringify(userGame);
        //users[userIndex].gamesOwned = JSON.stringify(users[userIndex].gamesOwned);
        //localStorage.setItem('users', JSON.stringify(users));
    }

    // End the game, display the score, and allow the player to retry
    function endGame() {
        isRunning = false;
        keyDown = {};
        alert(`Game Over! Score: ${score}`);
        updateMemory();
        const retry = confirm('Retry?');
        if (retry) {
            restartGame();
        }
    }

    // Reset game state and restart the game
    function restartGame() {
        //userGame.timePlayed -= Date.now(); // Update time played
        isRunning = true;
        score = 0;
        obstacles.innerHTML = ''; // Clear obstacles
        gameScore.textContent = 'Score: 0';
        obstacleSpeed = 5;
        for (let i = gameTimeout.length - 1; i >= 0 ; i--) {
            clearInterval(gameTimeout[i]);
            gameTimeout.pop();
        }
        gameTimeout.push(setInterval(gameLoop, 1000 - Math.min(score * 10, 800)));
        clearInterval(fallInterval);
        fallInterval = setInterval(dropObjects, 20); // Restart obstacle logic
        restartButton.textContent = 'Restart Game';
    }

    // Main game loop: creates obstacles at regular intervals
    function gameLoop() {
        if (!isRunning) {
            return;
        }
        createObstacle();
    }

    // Add an event listener to restart the game when the button is clicked
    restartButton.addEventListener('click', restartGame);
}