// DOM Elements
const gameArea = document.getElementById('gameArea');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const timeLeftDisplay = document.getElementById('timeLeft');
const startGameBtn = document.getElementById('startGame');
const difficultySelect = document.getElementById('difficulty');
const leaderboardTable = document.getElementById('leaderboardTable');
const clickSound = document.getElementById('clickSound');
const gameOverSound = document.getElementById('gameOverSound');

// Game Variables
let score = 0;
let timeLeft = 30;
let gameInterval;
let timerInterval;
let moveInterval = 800;

// Load Leaderboard
let leaderboard = JSON.parse(localStorage.getItem('leaderboardGame1')) || {
    Easy: [],
    Medium: [],
    Hard: [],
};

// Get Current User
const currentUser = localStorage.getItem('currentUser');

// Display Leaderboard
function updateLeaderboard() {
    if (!leaderboard.Easy) leaderboard.Easy = [];
    if (!leaderboard.Medium) leaderboard.Medium = [];
    if (!leaderboard.Hard) leaderboard.Hard = [];
    
    // Clear the table
    leaderboardTable.innerHTML = `
        <tr>
            <th>Level</th>
            <th>Player</th>
            <th>Score</th>
            <th>Date</th>
        </tr>
    `;

    // Populate the table with scores grouped by difficulty level
    for (const level of ['Easy', 'Medium', 'Hard']) {
        if (Array.isArray(leaderboard[level])) {
            leaderboard[level]
                .sort((a, b) => b.score - a.score) // Sort descending
                .slice(0, 5) // Top 5 scores
                .forEach((entry) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${level}</td>
                        <td>${entry.name}</td>
                        <td>${entry.score}</td>
                        <td>${entry.date || 'N/A'}</td>
                    `;
                    leaderboardTable.appendChild(row);
                });
        }
    }
}

// Start Game
startGameBtn.addEventListener('click', () => {
    if (!currentUser) {
        alert('You need to be logged in to play!');
        return;
    }
    resetGame();
    startGame();
    startTimer();
});

// Reset Game
function resetGame() {
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = timeLeft;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    startGameBtn.disabled = false;
}

// Start Game Logic
function startGame() {
    startGameBtn.disabled = true;

    // Adjust movement speed based on difficulty
    const difficulty = difficultySelect.value;
    moveInterval = difficulty === 'easy' ? 1000 : difficulty === 'medium' ? 800 : 500;

    // Move the ball at regular intervals
    gameInterval = setInterval(() => {
        moveBall();
    }, moveInterval);
}

// Move Ball Randomly
function moveBall() {
    const x = Math.floor(Math.random() * (gameArea.offsetWidth - 50));
    const y = Math.floor(Math.random() * (gameArea.offsetHeight - 50));
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
}

// Ball Click Event
ball.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
    clickSound.play(); 
});

// Start Timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// End Game
function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    startGameBtn.disabled = false;
    gameOverSound.play(); // Play game-over sound
    alert(`Time's up! Your score is ${score}`);
    saveScore(score);
}

// Save Score to Leaderboard
function saveScore(score) {
    if (!currentUser) {
        return;
    }

    const difficulty = difficultySelect.value.charAt(0).toUpperCase() + difficultySelect.value.slice(1); // Capitalize difficulty
    const levelScores = leaderboard[difficulty];
    const currentDate = new Date().toLocaleString(); // Get current date and time

    // Update leaderboard with the current user's score
    const existingEntry = levelScores.find((entry) => entry.name === currentUser);

    if (existingEntry) {
        // Update the score if the new score is higher
        if (score > existingEntry.score) {
            existingEntry.score = score;
            existingEntry.date = currentDate; // Update date
        }
    } else {
        // Add a new entry for the current user
        levelScores.push({ name: currentUser, score, date: currentDate });
    }

    // Save the updated leaderboard to localStorage
    localStorage.setItem('leaderboardGame1', JSON.stringify(leaderboard));
    updateLeaderboard();
}

// Reset Leaderboard 
function resetLeaderboard() {
    localStorage.removeItem('leaderboardGame1');
    leaderboard = { Easy: [], Medium: [], Hard: [] };
    updateLeaderboard();
    alert('Leaderboard has been reset.');
}

// Initialize Leaderboard on Load
updateLeaderboard();
