document.addEventListener('DOMContentLoaded', () => {
    const modeSelection = document.querySelector('.mode-selection');
    const gameContainer = document.querySelector('.game-container');
    const singlePlayerBtn = document.getElementById('singlePlayerBtn');
    const twoPlayerBtn = document.getElementById('twoPlayerBtn');
    const gameBoard = document.getElementById('gameBoard');
    const turnIndicator = document.getElementById('turnIndicator');
    const resetButton = document.getElementById('resetButton');


    // Sound Effects
    const clickSound = document.getElementById('clickSound');
    const gameOverSound = document.getElementById('gameOverSound');
    
    const ROWS = 6;
    const COLS = 7;
    let board = [];
    let currentPlayer = 'red';
    let isSinglePlayer = false;

    // Initialize the board
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

    // Check for a win condition
    const checkWin = (row, col) => {
        const directions = [
            { dr: 0, dc: 1 }, // Horizontal
            { dr: 1, dc: 0 }, // Vertical
            { dr: 1, dc: 1 }, // Diagonal down-right
            { dr: 1, dc: -1 } // Diagonal down-left
        ];

        const player = board[row][col];

        for (const { dr, dc } of directions) {
            let count = 1;

            // Check in one direction
            for (let i = 1; i < 4; i++) {
                const r = row + dr * i;
                const c = col + dc * i;
                if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }

            // Check in the opposite direction
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

    // AI Move Logic: Smarter AI
const aiMove = () => {
    // Helper to check if a move results in a win
    const simulateMove = (row, col, player) => {
        board[row][col] = player; // Simulate the move
        const isWin = checkWin(row, col); // Check for a win
        board[row][col] = null; // Undo the move
        return isWin;
    };

    // Check for winning moves for AI
    for (let col = 0; col < COLS; col++) {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (!board[row][col]) {
                if (simulateMove(row, col, 'yellow')) {
                    board[row][col] = 'yellow';

                    // Update the UI
                    const cell = gameBoard.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                    const disc = document.createElement('div');
                    disc.classList.add('disc', 'yellow');
                    cell.appendChild(disc);

                    turnIndicator.textContent = 'AI wins!';
                    gameBoard.removeEventListener('click', handleCellClick);
                    return;
                }
                break;
            }
        }
    }

    // Check for blocking moves against Player 1
    for (let col = 0; col < COLS; col++) {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (!board[row][col]) {
                if (simulateMove(row, col, 'red')) {
                    board[row][col] = 'yellow';

                    // Update the UI
                    const cell = gameBoard.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                    const disc = document.createElement('div');
                    disc.classList.add('disc', 'yellow');
                    cell.appendChild(disc);

                    // Switch players
                    currentPlayer = 'red';
                    turnIndicator.textContent = "Player 1's turn (Red)";
                    return;
                }
                break;
            }
        }
    }

    // Fallback: Choose the first available column
    for (let col = 0; col < COLS; col++) {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (!board[row][col]) {
                board[row][col] = 'yellow';

                // Update the UI
                const cell = gameBoard.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                const disc = document.createElement('div');
                disc.classList.add('disc', 'yellow');
                cell.appendChild(disc);

                // Switch players
                currentPlayer = 'red';
                turnIndicator.textContent = "Player 1's turn (Red)";
                return;
            }
        }
    }
};

    // Handle cell click
    const handleCellClick = (e) => {
        const col = parseInt(e.target.dataset.col);

        // Find the lowest empty cell in the column
        for (let row = ROWS - 1; row >= 0; row--) {
            if (!board[row][col]) {
                board[row][col] = currentPlayer;

                // Update the UI
                const cell = gameBoard.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                const disc = document.createElement('div');
                disc.classList.add('disc', currentPlayer);
                cell.appendChild(disc);

                // Play sound for placing a disc
                clickSound.play();

                // Check for a win
                if (checkWin(row, col)) {
                    turnIndicator.textContent = `Player ${currentPlayer === 'red' ? 1 : 2} wins!`;
                    
                    // Play game-over sound
                    gameOverSound.play(); 
                    gameBoard.removeEventListener('click', handleCellClick);
                    return;
                }

                // Switch players
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                turnIndicator.textContent = `Player ${currentPlayer === 'red' ? 1 : 'AI'}'s turn (${currentPlayer})`;

                if (isSinglePlayer && currentPlayer === 'yellow') {
                    setTimeout(aiMove, 500); // AI move delay
                }

                return;
            }
        }

        alert('This column is full!');
    };

    // Reset the game
    resetButton.addEventListener('click', () => {
        initializeBoard();
        currentPlayer = 'red';
        turnIndicator.textContent = `Player 1's turn (Red)`;
        gameBoard.addEventListener('click', handleCellClick);
    });

    // Initialize the game
    initializeBoard();

    // Mode Selection
    singlePlayerBtn.addEventListener('click', () => {
        isSinglePlayer = true;
        modeSelection.style.display = 'none';
        gameContainer.style.display = 'block';
    });

    twoPlayerBtn.addEventListener('click', () => {
        isSinglePlayer = false;
        modeSelection.style.display = 'none';
        gameContainer.style.display = 'block';
    });

    gameBoard.addEventListener('click', handleCellClick);
});
