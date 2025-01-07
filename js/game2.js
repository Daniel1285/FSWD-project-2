document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const gameBoard = document.getElementById('gameBoard');
    const leaderboardTable = document.getElementById('leaderboardTable');
    const turnIndicator = document.getElementById('turnIndicator');
    const resetButton = document.getElementById('resetButton');
    const startButton = document.getElementById('startButton');
    const difficultySelect = document.getElementById('difficulty');
    const clickSound = document.getElementById('clickSound');
    const startSound = document.getElementById('startSound');
    const gameOverSound = document.getElementById('gameOverSound');

    // Game Variables
    const ROWS = 6;
    const COLS = 7;
    let board = [];
    let currentPlayer = 'red';
    let currentDifficulty = 'medium'; // Default difficulty
    let isGameActive = false;
    let leaderboard = JSON.parse(localStorage.getItem('leaderboardGame2')) || {
        Easy: [],
        Medium: [],
        Hard: []
    };

    // Initialize Board
    const initializeBoard = () => {
        board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
        gameBoard.innerHTML = '';
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                gameBoard.appendChild(cell);
            }
        }
    };

    // Initialize Game
    const initializeGame = () => {
        initializeBoard();
        isGameActive = false;
        turnIndicator.textContent = "Click 'Start Game' to begin";
    };

    // Handle Start Button Click
    startButton.addEventListener('click', () => {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            alert('You must be logged in to play the game!');
            return;
        }
        startSound.play();
        isGameActive = true;
        turnIndicator.textContent = "Player 1's turn";
    });

    // Handle Difficulty Change
    difficultySelect.addEventListener('change', (e) => {
        currentDifficulty = e.target.value.toLowerCase();
    });

    // Handle Cell Click
    const handleCellClick = (e) => {
        if (!isGameActive) {
            return;
        }

        const col = parseInt(e.target.dataset.col);

        for (let row = ROWS - 1; row >= 0; row--) {
            if (!board[row][col]) {
                board[row][col] = currentPlayer;

                const cell = gameBoard.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                const disc = document.createElement('div');
                disc.classList.add('disc', currentPlayer);
                cell.appendChild(disc);

                clickSound.play();

                if (checkWin(row, col)) {
                    turnIndicator.textContent = currentPlayer === 'red' ? 'Player 1 wins!' : 'AI wins!';
                    gameOverSound.play();
                    isGameActive = false;
                    saveScore();
                    return;
                }

                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                turnIndicator.textContent = currentPlayer == 'red' ? 'Player 1\'s turn' : 'AI\'s turn';

                if (currentPlayer === 'yellow') {
                    setTimeout(aiMove, 500);
                }
                return;
            }
        }

        alert('This column is full!');
    };

    // AI Move Logic
    const aiMove = () => {
        const simulateMove = (row, col, player) => {
            board[row][col] = player;
            const isWin = checkWin(row, col);
            board[row][col] = null;
            return isWin;
        };

        const availableColumns = [];
        for (let col = 0; col < COLS; col++) {
            for (let row = ROWS - 1; row >= 0; row--) {
                if (!board[row][col]) {
                    availableColumns.push({ row, col });
                    break;
                }
            }
        }

        let selectedMove;

        if (currentDifficulty === 'easy') {
            // Random move
            selectedMove = availableColumns[Math.floor(Math.random() * availableColumns.length)];
        } else if (currentDifficulty === 'medium') {
            // Block or random move
            selectedMove = availableColumns.find(({ row, col }) => simulateMove(row, col, 'red')) ||
                availableColumns[Math.floor(Math.random() * availableColumns.length)];
        } else if (currentDifficulty === 'hard') {
            // Winning, blocking, or strategic move
            selectedMove = availableColumns.find(({ row, col }) => simulateMove(row, col, 'yellow')) ||
                availableColumns.find(({ row, col }) => simulateMove(row, col, 'red')) ||
                availableColumns.find(({ col }) => col === Math.floor(COLS / 2)) ||
                availableColumns[Math.floor(Math.random() * availableColumns.length)];
        }

        if (selectedMove) {
            const { row, col } = selectedMove;
            board[row][col] = 'yellow';

            const cell = gameBoard.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            const disc = document.createElement('div');
            disc.classList.add('disc', 'yellow');
            cell.appendChild(disc);

            if (checkWin(row, col)) {
                turnIndicator.textContent = 'AI wins!';
                gameOverSound.play();
                isGameActive = false;
            }
            else{
                turnIndicator.textContent = 'Player 1\'s turn';
            }
            currentPlayer = 'red';
        }
    };

    // Check Win Condition (unchanged)
    const checkWin = (row, col) => {
        const directions = [
            { dr: 0, dc: 1 }, // Horizontal
            { dr: 1, dc: 0 }, // Vertical
            { dr: 1, dc: 1 }, // Diagonal down-right
            { dr: 1, dc: -1 } // Diagonal down-left
        ];

        const player = board[row][col];
        //console.log(`player: ${currentPlayer}`,row, col)
        for (const { dr, dc } of directions) {
            let count = 1;

            for (let i = 1; i < 4; i++) {
                const r = row + dr * i;
                const c = col + dc * i;
                if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                    count++;
                    console.log(`count for ${currentPlayer} = ${count}`)
                } else {
                    break;
                }
            }

            for (let i = 1; i < 4; i++) {
                const r = row - dr * i;
                const c = col - dc * i;
                if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }

            if (count >= 4) {
                return true;
            }
        }
        return false;
    };

    // Save Score (unchanged)
    const saveScore = () => {
        const currentUser = localStorage.getItem('currentUser') || 'Anonymous';
        const date = new Date().toLocaleString();

        const levelKey = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
        let levelScores = leaderboard[levelKey];

        if (!levelScores) {
            levelScores = [];
            leaderboard[levelKey] = levelScores;
        }

        const existingEntry = levelScores.find(entry => entry.name === currentUser);

        if (existingEntry) {
            existingEntry.score++;
            existingEntry.date = date;
        } else {
            levelScores.push({ name: currentUser, score: 1, date });
        }

        localStorage.setItem('leaderboardGame2', JSON.stringify(leaderboard));
        updateLeaderboard();
    };

    // Update Leaderboard (unchanged)
    const updateLeaderboard = () => {
        leaderboardTable.innerHTML = `
            <tr>
                <th>Level</th>
                <th>Player</th>
                <th>Total wins</th>
                <th>Date</th>
            </tr>
        `;

        for (const level of ['Easy', 'Medium', 'Hard']) {
            if (Array.isArray(leaderboard[level])) {
                leaderboard[level]
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5)
                    .forEach(entry => {
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
    };

    // Add Event Listeners
    gameBoard.addEventListener('click', handleCellClick);
    resetButton.addEventListener('click', initializeGame);

    // Start the game on page load
    initializeGame();
    updateLeaderboard();
});
