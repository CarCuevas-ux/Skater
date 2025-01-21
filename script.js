const player = document.getElementById('player');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

let isJumping = false;
let score = 0;
let obstacleInterval;
let isGameOver = false;

function jump() {
    if (isJumping || isGameOver) return;

    isJumping = true;
    let jumpHeight = 0;
    const jumpUpInterval = setInterval(() => {
        if (jumpHeight >= 150) {
            clearInterval(jumpUpInterval);
            const fallDownInterval = setInterval(() => {
                jumpHeight -= 10;
                player.style.bottom = `${jumpHeight}px`;

                if (jumpHeight <= 0) {
                    clearInterval(fallDownInterval);
                    isJumping = false;
                }
            }, 20);
        } else {
            jumpHeight += 10;
            player.style.bottom = `${jumpHeight}px`;
        }
    }, 20);
}

function createObstacle() {
    if (isGameOver) return;

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    game.appendChild(obstacle);

    let obstaclePosition = game.offsetWidth;
    obstacle.style.left = `${obstaclePosition}px`;

    const moveObstacleInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(moveObstacleInterval);
            return;
        }

        obstaclePosition -= 5;
        obstacle.style.left = `${obstaclePosition}px`;

        if (obstaclePosition < 0) {
            clearInterval(moveObstacleInterval);
            game.removeChild(obstacle);
            score++;
            scoreDisplay.textContent = `Puntaje: ${score}`;
        }

        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            playerRect.right > obstacleRect.left &&
            playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top
        ) {
            endGame();
        }
    }, 20);
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

document.addEventListener('touchstart', () => {
    jump();
});

function startGame() {
    score = 0;
    scoreDisplay.textContent = `Puntaje: 0`;
    isGameOver = false;
    restartBtn.style.display = 'none';

    obstacleInterval = setInterval(createObstacle, 1500);
}

function endGame() {
    isGameOver = true;
    clearInterval(obstacleInterval);
    restartBtn.style.display = 'block';
    alert('¡Game Over!');
}

function restartGame() {
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => game.removeChild(obstacle));

    startGame();
}

startGame();
