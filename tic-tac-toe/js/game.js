const container = document.getElementById("container");

export class Game {

    constructor(playerSymbol) {
        this.playerSymbol = playerSymbol;
        this.computerSymbol = playerSymbol === "X" ? "O" : "X";
        this.currentMove = "X"; // represents the symbol that has to play. X always goes first
        this.isGameOver = false;
        this.board = [];

        // the board is represented as a 2D array of strings. an empty spot is denoted by an empty string
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                row.push("");
            }
            this.board.push(row);
        }

        this.drawBoard();

        // if the player's symbol is O, then the computer must move first
        if (this.currentMove === this.computerSymbol) {
            this.playComputerMove();
            this.currentMove = this.currentMove === "X" ? "O" : "X";
        }
    }

    drawBoard() {
        this.createCanvas();
        let width = this.canvas.width;
        let height = this.canvas.height;
        let ctx = this.ctx;

        // clearing the container and then adding the new game button and the canvas to it
        this.buttons = [... document.getElementsByClassName("button")];
        container.innerHTML = "";
        container.appendChild(this.buttons[0]);
        container.appendChild(this.canvas);

        // drawing the vertical lines
        ctx.beginPath();
        ctx.moveTo(width * (1/3), 0);
        ctx.lineTo(width * (1/3), height);
        ctx.moveTo(width * (2/3), 0);
        ctx.lineTo(width * (2/3), height);

        // drawing the horizontal lines
        ctx.moveTo(0, height * (1/3));
        ctx.lineTo(width, height * (1/3));
        ctx.moveTo(0, height * (2/3));
        ctx.lineTo(width, height * (2/3));
        ctx.stroke();
    }

    // the canvas is where everything will be drawn
    createCanvas() {
        this.canvas = document.createElement("canvas");
        this.canvas.style.padding = "20px";
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 1;

        // everytime the player clicks the board, they make a move
        this.canvas.addEventListener("click", (event) => {
            // getting the row and column of the click
            let rect = this.canvas.getBoundingClientRect();
            let rowCoordinates = event.clientY - rect.top;
            let colCoordinates = event.clientX - rect.left;
            let row = Math.floor(rowCoordinates / (this.canvas.height / 3));
            let col = Math.floor(colCoordinates / (this.canvas.width / 3));
        
            // if the move is possible then play it, otherwise dont do anything
            if (this.isMovePossible(row, col)) {
                this.updateBoard(row, col);
                if (this.didPlayerWin()) { 
                    // if the player wins then display some text on the screen and make
                    // it impossible to play another move
                    this.displayGameOverScreen("You Win!");
                    this.isGameOver = true;
                    return;
                }
                this.currentMove = this.currentMove === "X" ? "O" : "X";

                // if the board is not full then the computer should play its move
                if (!this.isBoardFull()) {
                    this.playComputerMove();
                    if (this.didPlayerWin()) {
                        this.displayGameOverScreen("You Lose!");
                        this.isGameOver = true;
                        return;
                    }
                    this.currentMove = this.currentMove === "X" ? "O" : "X";
                }

                // if no more moves are possible then the game ends in a tie
                if (this.isBoardFull()) {
                    this.displayGameOverScreen("It's a Tie!")
                    this.isGameOver = true;
                }
            }
        });
    }

    updateBoard(row, col) {
        this.board[row][col] = this.currentMove;

        if (this.currentMove === "X") {
            this.drawCross(row, col);
        }
        else {
            this.drawCircle(row, col);
        }
    }

    drawCross(row, col) {
        let width = this.canvas.width;
        let height = this.canvas.height;
        let rowCentre = row*(height/3) + (height/6);
        let colCentre = col*(width/3) + (width/6);
        this.ctx.beginPath();
        this.ctx.moveTo(colCentre - (height/9), rowCentre - (width/9)); // top-left
        this.ctx.lineTo(colCentre + (height/9), rowCentre + (width/9)); // bottom-right
        this.ctx.moveTo(colCentre - (height/9), rowCentre + (width/9)); // top-right
        this.ctx.lineTo(colCentre + (height/9), rowCentre - (width/9)); // bottom-left
        this.ctx.stroke();
    }

    drawCircle(row, col) {
        let width = this.canvas.width;
        let height = this.canvas.height;
        let rowCentre = row*(height/3) + (height/6);
        let colCentre = col*(width/3) + (width/6);
        this.ctx.beginPath();
        this.ctx.arc(colCentre, rowCentre, (width/9), 0, 2*Math.PI);
        this.ctx.stroke();
    }

    displayGameOverScreen(message) {
        let gameOverMessage = document.createElement("div");
        gameOverMessage.innerText = message;
        container.appendChild(gameOverMessage)
    }

    // a move is possible if that spot is empty and the game isnt over yet
    isMovePossible(row, col) {
        return this.board[row][col] === "" && !this.isGameOver;
    }

    didPlayerWin(board = this.board, symbol = this.currentMove) {
        // horizontals
        if (board[0][0] === symbol && board[0][0] === board[0][1] && board[0][1] === board[0][2]) return true;
        if (board[1][0] === symbol && board[1][0] === board[1][1] && board[1][1] === board[1][2]) return true;
        if (board[2][0] === symbol && board[2][0] === board[2][1] && board[2][1] === board[2][2]) return true;

        // verticals
        if (board[0][0] === symbol && board[0][0] === board[1][0] && board[1][0] === board[2][0]) return true;
        if (board[0][1] === symbol && board[0][1] === board[1][1] && board[1][1] === board[2][1]) return true;
        if (board[0][2] === symbol && board[0][2] === board[1][2] && board[1][2] === board[2][2]) return true;

        // diagonals
        if (board[0][0] === symbol && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return true;
        if (board[0][2] === symbol && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return true;

        return false;
    }

    playComputerMove() {
        // making a deep copy of the board
        let board = [...this.board];

        // first know that in my implementation an evaluation of +1 means a win for the computer, -1 means a loss for
        // the computer and 0 means a draw. Since the worst possible score for the computer -1, we initialise the best
        // evaluation of the computer to -1, since this value will be maximized and it cannot go any lower
        let bestEvaluation = -1; 
        let bestRow = 0;
        let bestCol = 0;

        // going through each spot and finding the spot with the best evaluation using the minimax algorithm
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === "") {
                    // simulating the move
                    board[row][col] = this.computerSymbol;
                    
                    // evaluating the resulting position
                    let evaluation = this.minimax(board, this.playerSymbol);

                    // if the evaluation is better than the current best, update the fields
                    if (evaluation > bestEvaluation) {
                        bestEvaluation = evaluation;
                        bestRow = row;
                        bestCol = col;
                    }

                    // setting the board back to its initial state
                    board[row][col] = "";
                }
            }
        }

        // now that we found the optimum spot, we play the move
        this.updateBoard(bestRow, bestCol);
    }

    // https://en.wikipedia.org/wiki/Minimax#Minimax_algorithm_with_alternate_moves
    minimax(board, currentSymbol) {
        if (this.isBoardFull(board) || this.didPlayerWin(board, "X") || this.didPlayerWin(board, "O")) {
            return this.calculatePositionEvaluation(board);
        }

        let evaluation = currentSymbol === this.computerSymbol ? -2 : +2;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === "") {
                    board[row][col] = currentSymbol;

                    let nextSymbol = currentSymbol === this.computerSymbol ? this.playerSymbol : this.computerSymbol;
                    let value = this.minimax(board, nextSymbol);
                    if (currentSymbol === this.computerSymbol) {
                        evaluation = Math.max(evaluation, value);
                    }
                    else {
                        evaluation = Math.min(evaluation, value);
                    }

                    board[row][col] = "";
                }
            }
        }

        return evaluation;
    }

    // returns false if any spot is empty, and true otherwise
    isBoardFull(board = this.board) {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === "") {
                    return false;
                }
            }
        }
        return true;
    }

    // I define an evaluation of +1 if the computer wins, -1 if the player wins, and 0 in case of a draw
    calculatePositionEvaluation(board) {
        if (this.didPlayerWin(board, this.computerSymbol)) {
            return 1;
        }
        if (this.didPlayerWin(board, this.playerSymbol)) {
            return -1;
        }
        return 0;
    }

}