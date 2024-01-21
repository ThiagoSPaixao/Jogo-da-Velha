document.addEventListener("DOMContentLoaded", function() {
    const cells = document.querySelectorAll(".cell");
    const scoreXElement = document.getElementById("score-x");
    const scoreOElement = document.getElementById("score-o");
    const currentPlayerElement = document.getElementById("current-player");
    const gameMessageElement = document.getElementById("game-message");
    const victoryModal = document.getElementById("victory-modal");
    const winnerMessage = document.getElementById("winner-message");
    const playAgainBtn = document.getElementById("play-again-btn");
    const gameModeSelect = document.getElementById("game-mode");

    let currentPlayer = "X";
    let gameBoard = ["", "", "", "", "", "", "", "", ""];
    let scoreX = 0;
    let scoreO = 0;
    let gameMode = "player";

    cells.forEach(cell => {
        cell.addEventListener("click", () => handleCellClick(cell));
    });

    playAgainBtn.addEventListener("click", () => {
        hideVictoryModal();
        resetGame();
    });

    gameModeSelect.addEventListener("change", () => {
        gameMode = gameModeSelect.value;
        resetGame();
    });

    function handleCellClick(cell) {
        const cellIndex = parseInt(cell.id) - 1;

        if (gameBoard[cellIndex] === "" && !isGameOver()) {
            gameBoard[cellIndex] = currentPlayer;
            cell.textContent = currentPlayer;

            if (checkWinner()) {
                updateScore();
                displayWinner();
                showVictoryModal();
            } else if (isBoardFull()) {
                displayDraw();
                showVictoryModal();
            } else {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
                updateCurrentPlayer();

                if (gameMode === "bot" && currentPlayer === "O") {
                    makeBotMove();
                }
            }
        }
    }

    function makeBotMove() {
        const availableCells = getAvailableCells();

        if (availableCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            const botMove = availableCells[randomIndex];
            gameBoard[botMove] = "O";
            cells[botMove].textContent = "O";

            if (checkWinner()) {
                updateScore();
                displayWinner();
                showVictoryModal();
            } else if (isBoardFull()) {
                displayDraw();
                showVictoryModal();
            } else {
                currentPlayer = "X";
                updateCurrentPlayer();
            }
        }
    }

    function getAvailableCells() {
        return gameBoard.reduce((acc, cell, index) => {
            if (cell === "") {
                acc.push(index);
            }
            return acc;
        }, []);
    }

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
        });
    }

    function isBoardFull() {
        return gameBoard.every(cell => cell !== "");
    }

    function isGameOver() {
        return checkWinner() || isBoardFull();
    }

    function updateScore() {
        if (currentPlayer === "X") {
            scoreX++;
            scoreXElement.textContent = scoreX;
        } else {
            scoreO++;
            scoreOElement.textContent = scoreO;
        }
    }

    function updateCurrentPlayer() {
        currentPlayerElement.textContent = currentPlayer;
    }

    function displayWinner() {
        winnerMessage.textContent = `${currentPlayer} venceu!`;
    }

    function displayDraw() {
        winnerMessage.textContent = "Empate!";
    }

    function showVictoryModal() {
        victoryModal.style.display = "flex";
    }

    function hideVictoryModal() {
        victoryModal.style.display = "none";
    }

    function resetGame() {
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        cells.forEach(cell => {
            cell.textContent = "";
        });

        gameMessageElement.textContent = "";
        updateCurrentPlayer();
        hideVictoryModal();

        if (gameMode === "bot" && currentPlayer === "O") {
            makeBotMove();
        }
    }
});
