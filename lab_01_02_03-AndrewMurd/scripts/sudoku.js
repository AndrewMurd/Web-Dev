/*
Andrew Murdoch
100707816

This file implements the sudoku logic.
*/
class Sudoku {
    constructor() {
        this.board = this.blankArray();
        this.checkBoard = this.blankArray();
    }
      
    blankArray() {
        return [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0]
        ];
    }
    // Creates Random Gameboard
    setBoard(difficulty) {
        for (let row = 0; row < 9; row++) {
            for (let column = 0; column < 9; column++ ) {
                this.generate(this.board);
            }
        }
        this.randomGen(1);
        this.randomGen(0);
        let count = 0;
        while (count <= (81 - difficulty)) {
            let col = Math.floor(Math.random() * 9); 
            let row = Math.floor(Math.random() * 9);
            if (this.board[col][row] != 0 && this.board[col][row] != -1) {
                this.board[col][row] = -1;
                count++;
            }
        }

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.checkBoard[i][j] = this.board[i][j];
            }
        }
    }
      
    // Checks if move is legal
    isLegalMove(row, col, value) {
        let rows = [];
        let cols = [];
        let bool = false;
        for (let i = 0; i <= 8; i++ ) {
            if (value == this.board[row][i]) {
                rows.push(row);
                cols.push(i);
                bool = true;
            }
        }
        
        for (let i = 0; i <= 8; i++ ) {
            if (value == this.board[i][col]) {
                rows.push(i);
                cols.push(col);
                bool = true;
            }
        }
    
        let rowOffset = Math.floor(row/3)*3;
        let colOffset = Math.floor(col/3)*3;
        for (let i = 0 + rowOffset; i <= 2 + rowOffset; i++) {
            for (let j = 0 + colOffset; j <= 2 + colOffset; j++) {
                if (value == this.board[i][j] ) {
                    rows.push(i);
                    cols.push(j);
                    bool = true;
                }
            }
        }
        if (bool) {
            return [rows, cols];
        }
        return true;
    }
    // Generates non-random game board
    generate(board) {
        let k = 1, n = 1;
        for (let i = 0; i < 9; i++) {
            k = n;
            for (let j = 0; j < 9; j++) {
                if(k <= 9){
                    board[i][j] = k;
                     k++;
                } else {
                    k = 1;
                    board[i][j] = k;
                    k++;
                }
            }
            n = k + 3;
            if(k == 10)
                n = 4;
            if(n > 9)
                n = (n % 9) + 1;
        }
    }
    // Randomize the game board
    randomGen(check) {
        let k1 = 0, k2 = 0, max = 2, min = 0;
        for (let i = 0; i < 3; i++) {
            k1 = Math.floor(Math.random() * (max - min + 1) ) + min;
            do{
                k2 = Math.floor(Math.random() * (max - min + 1) ) + min;
            } while(k1 == k2);
            
            max += 3;
            min += 3;

            if (check == 1)
                this.permutationRow(k1, k2);
            else if (check == 0)
                this.permutationCol(k1, k2);
        }
    }
    // Switch rows k1, k2
    permutationRow(k1, k2){
        let temp;
        for (let j = 0; j < 9; j++) {
            temp = this.board[k1][j];
            this.board[k1][j] = this.board[k2][j];
            this.board[k2][j] = temp;
        }
    }

    permutationCol(k1, k2){
        let temp;
        for (let j = 0; j < 9; j++) {
            temp = this.board[j][k1];
            this.board[j][k1] = this.board[j][k2];
            this.board[j][k2] = temp;
        }
    }
    // Checks if game is over (not implemented)
    gameOver() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] == -1) {
                    return false;
                }
            }
        }
        return true;
    }
};
// Activate burger menu
$(document).ready(function() {
    $(".navbar-burger").click(function() {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });
});

var active = false;
var paletteValue;
var lastClicked = [];
var errorCell;
var errors = []

let sudoku = new Sudoku();
sudoku.setBoard(16);

generateTable();
applyBoard(sudoku.board);

// When palette is clicked 
$("#palette td").click(function() {
    paletteValue = parseInt($(this).html());
    // If clicked cell was 1-9 number
    if (Number.isInteger(paletteValue)) {
        active = true;
    } else {
        active = false;
        // Remove last last move from list after clicking undo
        if (lastClicked.length > 0 && errors.length == 0) {
            let item = lastClicked.pop();
            item.html("");
            let id = item.attr('id');
            let row = parseInt(id[4]);
            let col = parseInt(id[5]);
            sudoku.board[row][col] = -1;
        }
        // Remove errors when using undo
        if (errors.length > 0) {
            try {
                for (let i = 0; i < errors.length; i++) {
                    //errors[i].style.backgroundColor = "white";
                    $(errors[i]).removeClass("error");
                }
                errors = []
            } catch(err) {}
        }
    }
});
// When board is clicked
$("#board td").click(function() {
    // Reset errors
    try {
        for (let i = 0; i < errors.length; i++) {
            //errors[i].style.backgroundColor = "white";
            $(errors[i]).removeClass("error");
        }
        errors = []
    } catch(err) {}
    let id = $(this).attr('id');
    let row = parseInt(id[4]);
    let col = parseInt(id[5]);
    // Execute move if the move is legal
    if (active == true && sudoku.isLegalMove(row, col, paletteValue) == true && sudoku.checkBoard[row][col] == -1) {
        sudoku.board[row][col] = paletteValue;
        $(this).html(paletteValue);
        lastClicked.push($(this));
        if (sudoku.gameOver() == false) {
            //addScore();
        }
        // Get errors
    } else if (active == true) {
        let ret = sudoku.isLegalMove(row, col, paletteValue);
        for (let i = 0; i < ret[0].length; i++) {
            errorCell = document.getElementById("cell" + ret[0][i] + ret[1][i]);
            $(errorCell).addClass("error");
            //errorCell.style.backgroundColor = "#f76c5e";
            errors.push(errorCell);
        }
        if (sudoku.checkBoard[row][col] == -1) {
            sudoku.board[row][col] = -1;
        }
    }
});
// Generate sudoku table elements
function generateTable() {
    var tblBody = document.getElementsByTagName("tbody");
    let count = 0;

    for (let b = 0; b < 3; b++) {
        for (let i = 0; i < 3; i++) {
            var row = document.createElement("tr");
            for (let j = 0; j < 9; j++) {
                var cell = document.createElement("td");
                let idName = "cell" + count + j; 
                cell.setAttribute("id", idName);
                row.appendChild(cell);
            }
            tblBody[b].appendChild(row);
            count++;
        }
    }
}
// Apply sudoku game board to table 
async function applyBoard(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let cell = document.getElementById("cell" + i + j);
            if (board[i][j] != -1)
                cell.innerHTML = board[i][j];
            else 
                cell.innerHTML = ""
        }
    }
}