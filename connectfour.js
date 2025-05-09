class ConnectFour {
  #board;
  #rows = 6;
  #cols = 7;
  currentPlayer = "X";

  constructor() {
    this.#board = Array.from({ length: this.#rows }, () => Array(this.#cols).fill(" "));
  }

  board() {
    return this.#board;
  }

  place(col) {
    if (col < 0 || col >= this.#cols || typeof col !== "number") {
      throw new Error("Ej co Ty robisz! nie mozna tak!");
    }

    for (let row = this.#rows - 1; row >= 0; row--) {
      if (this.#board[row][col] === " ") {
        this.#board[row][col] = this.currentPlayer;
        this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
        return;
      }
    }

    throw new Error("Co Ty robisz!! Ta kolumna jest pełna!!!");
  }

  checkWinner() {
    const directions = [
      { dr: 0, dc: 1 }, // poziomo
      { dr: 1, dc: 0 }, // pionowo
      { dr: 1, dc: 1 }, // ukos w prawo w dół
      { dr: 1, dc: -1 }, // ukos w lewo w dół
    ];

    for (let row = 0; row < this.#rows; row++) {
      for (let col = 0; col < this.#cols; col++) {
        const player = this.#board[row][col];
        if (player === " ") continue;

        for (const { dr, dc } of directions) {
          let count = 1;
          let r = row + dr;
          let c = col + dc;

          while (
            r >= 0 &&
            r < this.#rows &&
            c >= 0 &&
            c < this.#cols &&
            this.#board[r][c] === player
          ) {
            count++;
            if (count === 4) {
              return player;
            }
            r += dr;
            c += dc;
          }
        }
      }
    }

    // Check for draw
    if (this.#board.every(row => row.every(cell => cell !== " "))) {
      return "Draw";
    }

    return null; // Gra trwa
  }
  printBoard() {
    let output = "";
    for (let row = 0; row < this.#rows; row++) {
      for (let col = 0; col < this.#cols; col++) {
        output += `[${this.#board[row][col]}]`;
      }
      output += "\n";
    }
    console.log(output);
  }
  
}

// Inicjalizacja HTML
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const game = new ConnectFour();

function renderBoard() {
  boardElement.innerHTML = "";
  game.board().forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = document.createElement('div');
      cell.textContent = value;
      cell.style.width = '50px';
      cell.style.height = '50px';
      cell.style.display = 'flex';
      cell.style.alignItems = 'center';
      cell.style.justifyContent = 'center';
      cell.style.border = '1px solid black';
      cell.style.fontSize = '24px';
      cell.addEventListener('click', () => handleClick(colIndex));
      boardElement.appendChild(cell);
    });
  });
  boardElement.style.display = "grid";
  boardElement.style.gridTemplateColumns = `repeat(${game.board()[0].length}, 50px)`;
}

function handleClick(col) {
  try {
    if (game.checkWinner()) return;

    game.place(col);
    renderBoard();

    const winner = game.checkWinner();
    if (winner) {
      statusElement.textContent = winner === "Draw" ? "Remis!" : `Wygrał ${winner}!`;
    }
  } catch (error) {
    alert(error.message);
  }
}

renderBoard();

// Test: Próba wrzucenia dysku do pełnej kolumny
let testGame = new ConnectFour();
for (let i = 0; i < 6; i++) {
  testGame.place(0);
}
try {
  testGame.place(0);
  console.assert(false, "Powinien być wyjątek przy pełnej kolumnie");
} catch (error) {
  console.assert(
    error.message === "Co Ty robisz!! Ta kolumna jest pełna!!!",
    "Poprawna obsługa pełnej kolumny"
  );
}

// Test: Wygrana na krawędzi planszy (pionowo lewa krawędź)
testGame = new ConnectFour();
for (let i = 0; i < 4; i++) {
  testGame.place(0);
  testGame.place(1);
}
console.assert(
  testGame.checkWinner() === "X",
  "Wykryto wygraną X na krawędzi planszy"
);

// Test: Wygrana w ostatnim możliwym ruchu
testGame = new ConnectFour();

for (let row = 0; row < 5; row++) {
  for (let col = 0; col < 7; col++) {
    testGame.board()[row][col] = (row + col) % 2 === 0 ? "X" : "O";
  }
}
// Ostatni ruch dający wygraną
testGame.board()[5] = ["X", "X", "X", " ", "O", "O", "O"];
testGame.place(3); 
console.assert(
  testGame.checkWinner() === "X",
  "Wygrana w ostatnim możliwym ruchu"
);

// Test: Remis bez zwycięzcy (pełna plansza)
testGame = new ConnectFour();
["X", "O"].forEach((player, index) => {
  testGame.#currentPlayer = player;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row < 6; row++) {
      testGame.board()[row][col] = (row + col + index) % 2 === 0 ? "X" : "O";
    }
  }
});
console.assert(
  testGame.checkWinner() === "Draw",
  "Poprawne wykrycie remisu"
);
game.printBoard();


