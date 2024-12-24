document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const turnIndicator = document.getElementById('turnIndicator');
    const resetButton = document.getElementById('resetButton');

    const ROWS = 6;
    const COLS = 7;
    let board = [];
    let currentPlayer = 'red';

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

                // Check for a win
                if (checkWin(row, col)) {
                    turnIndicator.textContent = `Player ${currentPlayer === 'red' ? 1 : 2} wins!`;
                    gameBoard.removeEventListener('click', handleCellClick);
                    return;
                }

                // Switch players
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                turnIndicator.textContent = `Player ${currentPlayer === 'red' ? 1 : 2}'s turn (${currentPlayer})`;

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
    gameBoard.addEventListener('click', handleCellClick);
});
