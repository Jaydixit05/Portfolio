// Script.js for Interactivity
console.log("Welcome to Jay Dixit's");


/* --- Games Logic --- */

// Snake Game Variables
const canvas = document.getElementById('snake-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const box = 10;
let snake = [];
let food = {};
let score = 0;
let d;
let game;
let gameRunning = false;

// Tic-Tac-Toe Variables
const tttBoard = document.getElementById('ttt-board');
const tttStatus = document.getElementById('ttt-status');
let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let tttGameActive = true;


// Initialize Games if elements exist
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    if (document.getElementById('snake-canvas')) {
        initSnake();
        initTTT();
    }
});

/* --- Snake Game Functions --- */
function initSnake() {
    document.getElementById('start-snake').addEventListener('click', startSnakeGame);
    document.addEventListener('keydown', direction);
}

function startSnakeGame() {
    if (gameRunning) clearInterval(game);
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    score = 0;
    d = undefined; // Reset direction
    document.getElementById('snake-score').innerText = score;
    spawnFood();
    gameRunning = true;
    // Decreased speed: 200ms instead of 100ms
    game = setInterval(draw, 200);
}

function direction(event) {
    let key = event.keyCode;
    // Prevent scrolling for arrow keys
    if ([37, 38, 39, 40].includes(key)) {
        event.preventDefault();
    }

    if (key == 37 && d != "RIGHT") d = "LEFT";
    else if (key == 38 && d != "DOWN") d = "UP";
    else if (key == 39 && d != "LEFT") d = "RIGHT";
    else if (key == 40 && d != "UP") d = "DOWN";
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.fillStyle = "#000"; // Clear canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#00FF00" : "#FFFFFF"; // Green Head, White Body
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "#000";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // Eat Food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        document.getElementById('snake-score').innerText = score;
        spawnFood();
    } else {
        snake.pop(); // Remove tail
    }

    // Game Over Conditions
    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        gameRunning = false;
        alert('Game Over! Score: ' + score);
    }

    snake.unshift(newHead);
}


/* --- Tic-Tac-Toe Functions --- */
function initTTT() {
    createBoard();
    document.getElementById('reset-ttt').addEventListener('click', resetTTT);
}

function createBoard() {
    tttBoard.innerHTML = '';
    boardState.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('ttt-cell');
        cellDiv.dataset.index = index;
        cellDiv.innerText = cell;
        cellDiv.addEventListener('click', handleCellClick);
        if (cell !== '') cellDiv.classList.add('taken');
        tttBoard.appendChild(cellDiv);
    });
}

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (boardState[index] !== '' || !tttGameActive || currentPlayer === 'O') return;

    makeMove(index, 'X');
    if (tttGameActive) {
        setTimeout(computerMove, 500); // Small delay for "thinking"
    }
}

function makeMove(index, player) {
    boardState[index] = player;
    createBoard(); // Re-render to show update (simple way)
    checkResult();
    if (tttGameActive) {
        currentPlayer = player === 'X' ? 'O' : 'X';
        tttStatus.innerText = currentPlayer === 'X' ? "Your Turn (X)" : "Computer's Turn (O)";
    }
}

function computerMove() {
    // Simple AI: Random available spot
    let available = boardState.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    if (available.length > 0) {
        const randomIdx = available[Math.floor(Math.random() * available.length)];
        makeMove(randomIdx, 'O');
    }
}

function checkResult() {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    let roundWon = false;
    for (let i = 0; i < wins.length; i++) {
        const [a, b, c] = wins[i];
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        tttStatus.innerText = currentPlayer === 'X' ? "You Won!" : "Computer Won!";
        tttGameActive = false;
        return;
    }

    if (!boardState.includes('')) {
        tttStatus.innerText = "Draw!";
        tttGameActive = false;
    }
}

function resetTTT() {
    boardState = ['', '', '', '', '', '', '', '', ''];
    tttGameActive = true;
    currentPlayer = 'X';
    tttStatus.innerText = "Play against PC";
    createBoard();
}

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeString = `${hours}:${minutes} ${ampm}`;
    const clockElement = document.getElementById('taskbar-clock');
    if (clockElement) {
        clockElement.innerText = timeString;
    }
}

/* --- Theme Toggle Logic --- */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        // Toggle Icon
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
}
