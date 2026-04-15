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


const GameController = (() => {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");

  let currentPlayer = player1;
  let gameOver = false;

  const getCurrentPlayer = () => currentPlayer;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };


  const playRound = (index) => {
    if (gameOver) {
      console.log("Game is over. Restart to play again.");
      return;
    }

    const moveSuccess = Gameboard.setCell(index, currentPlayer.marker);

    if (!moveSuccess) {
      console.log("Invalid move. Try another spot.");
      return;
    }

    console.log(Gameboard.getBoard());

    if (checkWinner()) {
      console.log(`${currentPlayer.name} wins! 🎉`);
      gameOver = true;
      return;
    }

    if (checkTie()) {
      console.log("It's a tie! 🤝");
      gameOver = true;
      return;
    }

    switchPlayer();
  };


  const checkWinner = () => {
    const board = Gameboard.getBoard();

    const winPatterns = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ];

    return winPatterns.some(([a, b, c]) => {
      return (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      );
    });
  };


  const checkTie = () => {
    const board = Gameboard.getBoard();
    return board.every(cell => cell !== "");
  };


  const restartGame = () => {
    Gameboard.resetBoard();
    currentPlayer = player1;
    gameOver = false;
    console.log("Game restarted 🔄");
  };


  return {
    playRound,
    restartGame,
    getCurrentPlayer
  };
})();


GameController.playRound(0);
GameController.playRound(1);
GameController.playRound(4);
GameController.playRound(2);
GameController.playRound(8);



const DisplayController = (() => {
  const boardContainer = document.querySelector(".gameboard");

  const render = () => {
    const board = Gameboard.getBoard();

    // Clear board before re-rendering
    boardContainer.innerHTML = "";

    board.forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.dataset.index = index;
      cellDiv.textContent = cell;

      boardContainer.appendChild(cellDiv);
    });
  };

  return {
    render,
  };
})();

Gameboard.setCell(0, "X");
Gameboard.setCell(1, "O");
DisplayController.render();