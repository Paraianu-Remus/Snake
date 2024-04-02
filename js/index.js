const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

const restartButton = document.getElementById("restartButton");

class SnakePart{
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const snakeParts = [];
let tailLength = 0;

let snakeSpeed = 7;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
let xVelocity = 0;
let yVelocity = 0;
let previousXVelocity = 0;
let previousYVelocity = 0;
let foodX = 5;
let foodY = 5;
let score = 0;

// Eat sound
const eatSound = new Audio("./assets/sounds/gulp.mp3");
// GameOver sound
const gameOverSound = new Audio("./assets/sounds/gameover.mp3");

// Game Loop
function drawGame() {
    // If snakes goes left can't go right
    if (previousXVelocity === -1 && xVelocity === 1) {
        xVelocity = previousXVelocity;
    }
    // If snakes goes up can't go down
    if (previousYVelocity === -1 && yVelocity === 1) {
        yVelocity = previousYVelocity;
    }
    // If snakes goes right can't go left
    if (previousXVelocity === 1 && xVelocity === -1) {
        xVelocity = previousXVelocity;
    }
    // If snakes goes down can't go up
    if (previousYVelocity === 1 && yVelocity === -1) {
        yVelocity = previousYVelocity;
    }
    previousXVelocity = xVelocity;
    previousYVelocity = yVelocity;
    changeSnakePosition();
    let result = checkGameOver();
    if (result) {
        document.body.removeEventListener("keydown", keyDown);
        return;
    }
    clearScreen();
    checkFoodCollision();
    drawFood();
    drawSnake();
    drawScore();
    if (score > 5) {
        snakeSpeed = 10;
    }
    if (score > 10) {
        snakeSpeed = 15;
    }
    if (score > 15) {
        snakeSpeed = 20;
    }
    setTimeout(drawGame, 1000 / snakeSpeed);
}

// Create and reset board
function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Creates snake
function drawSnake() {
    // Snake body
    ctx.fillStyle = "green";
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }
    snakeParts.push(new SnakePart(headX, headY));
    while (snakeParts.length > tailLength) {
        snakeParts.shift();
    }
    // Snake head
    ctx.fillStyle = "orange";
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

// Creates food
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(foodX * tileCount, foodY * tileCount, tileSize, tileSize);
}

// Checks if snakes head tile is on food tile then move the food on random tile
function checkFoodCollision() {
    if (foodX === headX && foodY === headY) {
        foodX = Math.floor(Math.random() * tileCount);
        foodY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        eatSound.play();
    }
}

// Changes snake head position
function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

// Arrow Keys function
function keyDown(e) {
    // Left Arrow or A
    if (e.keyCode == 37 || e.keyCode == 65) {
        yVelocity = 0;
        xVelocity = -1;
    }
    // Up Arrow or W
    if (e.keyCode == 38 || e.keyCode == 87) {
        yVelocity = -1;
        xVelocity = 0;
    }
    // Right Arrow or D
    if (e.keyCode == 39 || e.keyCode == 68) {
        yVelocity = 0;
        xVelocity = 1;
    }
    // Down Arrow or S
    if (e.keyCode == 40 || e.keyCode == 83) {
        yVelocity = 1;
        xVelocity = 0;
    } 
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "10px Bookman Old Style";
    ctx.fillText("Score " + score, canvas.width - 50, 10);
}

function checkGameOver() {
    let gameOver = false;

    // Check if game started (snake moved)
    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }
    // if hit walls
    if (headX < 0) {
        gameOver = true;
    } else if (headX === tileCount) {
        gameOver = true;
    } else if (headY < 0) {
        gameOver = true;
    } else if (headY === tileCount) {
        gameOver = true;
    }
    // if head of the snake hit body of the snake
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "50px Bookman Old Style";
        // Creates the gradient text
        var gradientText = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradientText.addColorStop("0", "magenta");
        gradientText.addColorStop("0.5", "blue");
        gradientText.addColorStop("1.0", "red");
        // Colors the game over text
        ctx.fillStyle = gradientText;

        ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
        gameOverSound.play();
    }

    return gameOver;
}

document.body.addEventListener("keydown", keyDown);
restartButton.addEventListener("click", () => {window.location.reload();});

drawGame();