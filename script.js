const board = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart');
const timerDisplay = document.getElementById('time');
const highScoresList = document.getElementById('highScores');
const clearScoresBtn = document.getElementById('clearScores');
const playerWinsDisplay = document.getElementById('playerWins');
const computerWinsDisplay = document.getElementById('computerWins');

let currentPlayer = 'X';
let gameActive = true;
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let startTime, intervalId;
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
let playerWins = 0;
let computerWins = 0;

function startGame() {
    startTime = Date.now();
    intervalId = setInterval(updateTimer, 1000);
    board.forEach(cell => cell.addEventListener('click', handlePlayerMove));
    restartBtn.addEventListener('click', resetGame);
    clearScoresBtn.addEventListener('click', clearHighScores);
    renderHighScores();
    updateScoreboard();
}

function handlePlayerMove(e) {
    const cellIndex = e.target.getAttribute('data-index');
    if (gameBoard[cellIndex] !== '' || !gameActive) return;

    gameBoard[cellIndex] = currentPlayer;
    e.target.textContent = currentPlayer;

    checkWinner();

    if (gameActive) {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    let emptyCells = [];
    gameBoard.forEach((cell, index) => {
        if (cell === '') emptyCells.push(index);
    });

    if (emptyCells.length === 0) return;

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameBoard[randomIndex] = 'O';
    board[randomIndex].textContent = 'O';

    checkWinner();
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            clearInterval(intervalId);
            if (gameBoard[a] === 'X') {
                const timeTaken = Math.floor((Date.now() - startTime) / 1000);
                message.textContent = `¡Ganaste en ${timeTaken} segundos!`;
                saveHighScore(timeTaken);
                playerWins++;
            } else {
                message.textContent = "¡Te ganó la computadora!";
                computerWins++;
            }
            updateScoreboard();
            return;
        }
    }

    if (!gameBoard.includes('')) {
        gameActive = false;
        clearInterval(intervalId);
        message.textContent = "¡Es un empate!";
    }
}

function saveHighScore(time) {
    const playerName = prompt("¡Ganaste! Ingresa tu nombre:");
    const newScore = { name: playerName, time: time, date: new Date().toLocaleString() };

    highScores.push(newScore);
    highScores.sort((a, b) => a.time - b.time); 
    highScores = highScores.slice(0, 10); 

    localStorage.setItem('highScores', JSON.stringify(highScores));
    renderHighScores();
}

function renderHighScores() {
    highScoresList.innerHTML = highScores
        .map(score => `<li>${score.name} - ${score.time} segundos (${score.date})</li>`)
        .join('');
}


function clearHighScores() {
    if (confirm("¿Estás seguro de que quieres borrar el registro de mejores tiempos?")) {
        highScores = []; 
        localStorage.removeItem('highScores'); 
        renderHighScores(); 
    }
}


function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = elapsedTime;
}

function updateScoreboard() {
    playerWinsDisplay.textContent = playerWins;
    computerWinsDisplay.textContent = computerWins;
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    board.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    gameActive = true;
    message.textContent = '';
    clearInterval(intervalId);
    startGame();
}

startGame();
