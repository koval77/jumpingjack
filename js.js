const player = document.getElementById('player');
const lines = document.getElementsByClassName('line');
const gameContainer = document.querySelector('.game-container');

let isJumping = false;
let isMovingLeft = false;
let isMovingRight = false;
let playerBottom = 0;
let playerLeft = 0;
let gameSpeed = 5;
let gameInterval;

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(event) {
    if (event.key === "ArrowUp" && !isJumping) {
        isJumping = true;
        jump();
    } else if (event.key === "ArrowLeft") {
        isMovingLeft = true;
    } else if (event.key === "ArrowRight") {
        isMovingRight = true;
    }
}

function handleKeyUp(event) {
    if (event.key === "ArrowLeft") {
        isMovingLeft = false;
    } else if (event.key === "ArrowRight") {
        isMovingRight = false;
    }
}

function jump() {
    let jumpCount = 0;
    const jumpInterval = setInterval(() => {
        if (jumpCount >= 80) {
            clearInterval(jumpInterval);
            isJumping = false;
        } else {
            player.style.bottom = (playerBottom + 5) + 'px';
            jumpCount += 5;
        }
    }, 10);
}

function movePlayer() {
    if (isMovingLeft) {
        playerLeft = Math.max(playerLeft - 5, 0);
    } else if (isMovingRight) {
        playerLeft = Math.min(playerLeft + 5, gameContainer.clientWidth - player.clientWidth);
    }

    player.style.left = playerLeft + 'px';
}

function checkCollision() {
    const playerTop = gameContainer.clientHeight - playerBottom - player.clientHeight;

    for (const line of lines) {
        const lineTop = parseInt(line.style.top, 10);
        const lineBottom = lineTop + 10;

        if (playerTop <= lineBottom && playerTop + player.clientHeight >= lineTop) {
            const holes = line.getElementsByClassName('hole');
            for (const hole of holes) {
                const holeLeft = parseInt(hole.style.left, 10);
                const holeRight = holeLeft + hole.clientWidth;

                if (playerLeft + player.clientWidth >= holeLeft && playerLeft <= holeRight) {
                    return false; // Player successfully jumped through the hole
                }
            }
            return true; // Player collided with the line
        }
    }

    return playerTop < 0 || playerTop + player.clientHeight > gameContainer.clientHeight; // Player touched top or bottom of the screen
}

function createHole(line) {
    const holeLeft = Math.floor(Math.random() * (gameContainer.clientWidth - 80));
    const hole = document.createElement('div');
    hole.className = 'hole';
    hole.style.left = holeLeft + 'px';
    line.appendChild(hole);

    setTimeout(() => {
        line.removeChild(hole);
    }, 5000); // Adjust the time the hole stays visible on the screen
}

function updateGame() {
    movePlayer();

    if (checkCollision()) {
        clearInterval(gameInterval);
        alert("Game Over! You fell through a hole or touched the bottom.");
        location.reload();
    }
}

for (const line of lines) {
    createHole(line);
}

gameInterval = setInterval(updateGame, gameSpeed);
