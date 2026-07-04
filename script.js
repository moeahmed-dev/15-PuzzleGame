let moveCount = 0;
let seconds = 0;
let timer = null;
let gameStarted = false;

window.onload = function () {
    shuffle();
};

function swapTiles(cell1, cell2) {
    let temp = document.getElementById(cell1).className;
    document.getElementById(cell1).className =
        document.getElementById(cell2).className;
    document.getElementById(cell2).className = temp;
}

function startTimer() {
    if (gameStarted) return;

    gameStarted = true;

    timer = setInterval(function () {
        seconds++;
        document.getElementById("timer").textContent = seconds;
    }, 1000);
}

function resetGameStats() {
    moveCount = 0;
    seconds = 0;
    gameStarted = false;

    clearInterval(timer);

    document.getElementById("moves").textContent = "0";
    document.getElementById("timer").textContent = "0";
}

function shuffle() {

    resetGameStats();

    // Find blank tile
    let blankRow, blankCol;

    for (let r = 1; r <= 4; r++) {
        for (let c = 1; c <= 4; c++) {
            if (document.getElementById("cell" + r + c).className === "tile16") {
                blankRow = r;
                blankCol = c;
            }
        }
    }

    let moves = 200;
    let lastMoved = null;
    let opposite = {
        right: "left",
        left: "right",
        up: "down",
        down: "up"
    };

    for (let i = 0; i < moves; i++) {

        let neighbors = [];

        if (blankCol < 4) neighbors.push([blankRow, blankCol + 1, "right"]);
        if (blankCol > 1) neighbors.push([blankRow, blankCol - 1, "left"]);
        if (blankRow > 1) neighbors.push([blankRow - 1, blankCol, "up"]);
        if (blankRow < 4) neighbors.push([blankRow + 1, blankCol, "down"]);

        let options = neighbors.filter(function (n) {
            return n[2] !== lastMoved;
        });

        if (options.length === 0)
            options = neighbors;

        let choice = options[Math.floor(Math.random() * options.length)];

        let newRow = choice[0];
        let newCol = choice[1];

        swapTiles(
            "cell" + blankRow + blankCol,
            "cell" + newRow + newCol
        );

        lastMoved = opposite[choice[2]];
        blankRow = newRow;
        blankCol = newCol;
    }
}

function simpleGame() {

    resetGameStats();

    // Arrange puzzle almost solved
    let solved = [
        "tile1","tile2","tile3","tile4",
        "tile5","tile6","tile7","tile8",
        "tile9","tile10","tile11","tile12",
        "tile13","tile14","tile16","tile15"
    ];

    let index = 0;

    for (let r = 1; r <= 4; r++) {
        for (let c = 1; c <= 4; c++) {
            document.getElementById("cell" + r + c).className = solved[index];
            index++;
        }
    }
}

function checkWin() {

    let expected = 1;

    for (let r = 1; r <= 4; r++) {
        for (let c = 1; c <= 4; c++) {

            if (
                document.getElementById("cell" + r + c).className !==
                "tile" + expected
            ) {
                return;
            }

            expected++;
        }
    }

    clearInterval(timer);

    setTimeout(function () {
        alert(
            "Congratulations!\n\n" +
            "Moves: " + moveCount +
            "\nTime: " + seconds + " seconds"
        );
    }, 100);
}

function moveTile(currentCell, blankCell) {

    swapTiles(currentCell, blankCell);

    startTimer();

    moveCount++;

    document.getElementById("moves").textContent = moveCount;

    checkWin();
}

function clickTile(row, column) {

    let tile = document.getElementById("cell" + row + column).className;

    if (tile === "tile16")
        return;

    // Right
    if (column < 4 &&
        document.getElementById("cell" + row + (column + 1)).className === "tile16") {

        moveTile(
            "cell" + row + column,
            "cell" + row + (column + 1)
        );
        return;
    }

    // Left
    if (column > 1 &&
        document.getElementById("cell" + row + (column - 1)).className === "tile16") {

        moveTile(
            "cell" + row + column,
            "cell" + row + (column - 1)
        );
        return;
    }

    // Up
    if (row > 1 &&
        document.getElementById("cell" + (row - 1) + column).className === "tile16") {

        moveTile(
            "cell" + row + column,
            "cell" + (row - 1) + column
        );
        return;
    }

    // Down
    if (row < 4 &&
        document.getElementById("cell" + (row + 1) + column).className === "tile16") {

        moveTile(
            "cell" + row + column,
            "cell" + (row + 1) + column
        );
        return;
    }
}