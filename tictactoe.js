// Z - Zero - plansza przed wykonaniem ruchu
// O - One - jak juz wykonamy ruch
// M - Many - po wielu ruchach
// B - Boundries - przypadki brzegowe - nadpisywanie pozycji
// I - Interface - czy wygral/przegral/remis
// E - Exeptions - Obsluga wyjatkow  - niewlasciwe wejscia od usera

class TicTacToe {
  #board;

  constructor() {
    this.#board = Array(9).fill(" ");
  }

   board() {
    return this.#board;
  }

  #currentPlayer = "X";

  place(index) {
    if (index < 0 || index > 8 || typeof index !== "number") {
      throw new Error("Ej co Ty robisz! nie mozna tak!");
    }
    if (this.#board[index] !== " ") {
      throw new Error("Co Ty robisz!! To pole jest zajęte!!!");
    }

    this.#board[index] = this.#currentPlayer;
    this.#currentPlayer = this.#currentPlayer === "X" ? "O" : "X";
  }

  checkWinner() {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        this.#board[a] !== " " &&
        this.#board[a] === this.#board[b] &&
        this.#board[a] === this.#board[c]
      ) {
        return this.#board[a];
      }
    }

    // Check for draw
    if (this.#board.every((cell) => cell !== " ")) {
      return "Draw";
    }

    return null; // Game still in progress
  }
}

let game = new TicTacToe();

console.assert(
  game.board().every((value) => value === " "),
  "Pusta plansza przed wykonaniem ruchu"
);

game.place(4);
console.assert(
  game.board()[4] === "X" &&
    game.board().filter((value) => value === " ").length === 8,
  "Plansza po wstawieniu X na środek"
);

game = new TicTacToe(); // Reset game for new test sequence
game.place(0); // X
game.place(1); // O
game.place(2); // X
console.assert(game.board()[0] === "X", "Na pozycji 0 powinien być X");
console.assert(game.board()[1] === "O", "Na pozycji 1 powinien być O");
console.assert(game.board()[2] === "X", "Na pozycji 2 powinien być X");

try {
  game.place(0);
  console.assert(
    false,
    "Wyjątek powinien być wyrzucony gdy ktoś próbuje zrobić niepoprawny ruch"
  );
} catch (error) {
  console.assert(
    error.message === "Co Ty robisz!! To pole jest zajęte!!!",
    "Wiadomość będu o tym ze pozycja ju zajęta"
  );
  console.assert(game.board()[0] === "X", "Pozycja 0 powinna zostać X");
}

// Test a winning condition (first row for X)
game = new TicTacToe();
game.place(0); // X
game.place(3); // O
game.place(1); // X
game.place(4); // O
game.place(2); // X
console.assert(
  game.checkWinner() === "X",
  "Wykryto wygraną X w pierwszym rzędzie"
);

// Test a winning condition (second column for O)
game = new TicTacToe();
game.place(0); // X
game.place(1); // O
game.place(3); // X
game.place(4); // O
game.place(8); // X
game.place(7); // O
console.assert(game.checkWinner() === "O", "Wykryto wygraną O w 2 kolumnie");

// Test a winning condition (diagonal for X)
game = new TicTacToe();
game.place(0); // X
game.place(1); // O
game.place(4); // X
game.place(2); // O
game.place(8); // X
console.assert(game.checkWinner() === "X", "Wykryto wygraną X po przekatnej");

// Test a draw condition (example)
game = new TicTacToe();
game.place(0); // X
game.place(1); // O
game.place(2); // X
game.place(3); // O
game.place(4); // X
game.place(5); // O
game.place(6); // O
game.place(7); // X
game.place(8); // O
console.assert(
  game.board().every((value) => value !== " "),
  "Wykryto remis"
);

// Test - uzytkownik nie ogarnia
game = new TicTacToe();
try {
  game.place(9);
  console.assert(
    false,
    "Wyjątek powinien wyskoczyć gdy index jest niepoprawny"
  );
} catch (error) {
  console.assert(
    error.message === "Ej co Ty robisz! nie mozna tak!",
    "Wyjątek powinien wyskoczyć gdy index jest niepoprawny"
  );
}
