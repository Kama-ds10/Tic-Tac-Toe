const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return {
    getBoard,
    setCell,
    resetBoard,
  };
})();

const Player = (name, marker) => {
  return { name, marker };
};

// Game Controller module
const GameController = (() => {
  let player1;
  let player2;
  let currentPlayer = null;
  let gameOver = false;

  const initGame = (name1, name2) => {
    player1 = Player(name1 || "Player 1", "X");
    player2 = Player(name2 || "Player 2", "O");
    currentPlayer = player1;
    gameOver = false;
    Gameboard.resetBoard();
  };

  const getCurrentPlayer = () => currentPlayer;

  const isGameOver = () => gameOver;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const playRound = (index) => {
    if (!currentPlayer) return "Start the game first!";
    if (gameOver) return "Game over";

    const moveSuccess = Gameboard.setCell(index, currentPlayer.marker);
    if (!moveSuccess) return "Invalid move";

    if (checkWinner()) {
      gameOver = true;
      return `${currentPlayer.name} wins!`;
    }

    if (checkTie()) {
      gameOver = true;
      return "It's a tie!";
    }

    switchPlayer();
    return null;
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    const patterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    return patterns.some(
      ([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c],
    );
  };

  const checkTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  return {
    initGame,
    playRound,
    getCurrentPlayer,
    isGameOver,
  };
})();

// Display Controller module
const DisplayController = (() => {
  const boardContainer = document.querySelector(".gameboard");
  const statusDiv = document.querySelector(".status");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const player1Input = document.getElementById("player1");
  const player2Input = document.getElementById("player2");

  const render = () => {
    const board = Gameboard.getBoard();
    boardContainer.innerHTML = "";

    board.forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.dataset.index = index;
      cellDiv.textContent = cell;

      // Assign structural marker colors systematically
      if (cell === "X") cellDiv.classList.add("x-marker");
      if (cell === "O") cellDiv.classList.add("o-marker");

      cellDiv.addEventListener("click", handleClick);
      boardContainer.appendChild(cellDiv);
    });
  };

  const handleClick = (e) => {
    if (!GameController.getCurrentPlayer()) {
      statusDiv.textContent = "Click Start Game first!";
      return;
    }

    if (GameController.isGameOver()) return;

    const index = e.target.dataset.index;
    const result = GameController.playRound(index);

    render();

    if (result) {
      statusDiv.textContent = result;
    } else {
      statusDiv.textContent = `${GameController.getCurrentPlayer().name}'s turn`;
    }
  };

  const startGame = () => {
    GameController.initGame(player1Input.value, player2Input.value);
    statusDiv.textContent = `${GameController.getCurrentPlayer().name}'s turn`;
    render();
  };

  const restartGame = () => {
    startGame();
  };

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", restartGame);

  // Initialize empty view state securely on window load
  render();
})();
