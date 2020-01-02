// Global Variables
var w = 800;
var h = 800;
var boardSize = 600;
var marginX = (w - boardSize) / 2;
var marginY = (h - boardSize) / 2;
var squareSize = boardSize / 8;
var bg = 10;
var piece, selectedPiece;
var gridMouse = {};
var turn;
var whiteSide;
var iconFont;

var colors = {}


var board = [
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 6, 7]
];

function preload() {
    iconFont = loadFont('/assets/fa-solid-900.ttf');
}

function setup() {
    createCanvas(w, h);
    piece = new Piece('QUEEN', 'WHITE', 3, 4);
    turn = "WHITE";

    whiteSide = initialiseSide("WHITE");

    colors.blue = color(67, 172, 230);
}

function draw() {
    background(255);
    translate(marginX, marginY)

    if (turn == "BLACK") {
        push();
        translate(width - marginX * 2, height - marginY * 2);
        rotate(PI);
    }

    drawBoard();
    mouseGrid();
    drawSide(whiteSide);
    if (selectedPiece)
        selectedPiece.showAvailableMoves();

    if (turn == "BLACK") {
        pop();
    }

    fill(255, 0, 0);
    circle(0, 0, 5);
}


// Input Events
function mousePressed() {
}

function mouseClicked() {
    selectPieceAtMouse();
}

function mouseReleased() {
}

function keyPressed() {
    if (keyCode == 32)
        changeTurn();
    console.log(turn)
}

function drawBoard() {
    noStroke();
    boardLoop(function (x, y) {
        if ((x % 2 == 0 && y % 2 == 0) || (x % 2 != 0 && y % 2 != 0))
            fill(255);
        else
            fill(0);

        rect(x * squareSize, y * squareSize, squareSize, squareSize);
    })

    noFill();
    stroke(0);
    rect(0, 0, boardSize, boardSize);
    rect(-marginX, -marginY, boardSize + marginX * 2, boardSize + marginY * 2);
}

function changeTurn() {
    if (turn == "WHITE")
        turn = "BLACK"
    else if (turn == "BLACK")
        turn = "WHITE"
}

function initialiseSide(side) {
    // side accepts "BLACK or "WHITE"
    return {
        pieces: {
            pawn1: new Piece("PAWN", side, 1, 7),
            pawn2: new Piece("PAWN", side, 2, 7),
            pawn3: new Piece("PAWN", side, 3, 7),
            pawn4: new Piece("PAWN", side, 4, 7),
            pawn5: new Piece("PAWN", side, 5, 7),
            pawn6: new Piece("PAWN", side, 6, 7),
            pawn7: new Piece("PAWN", side, 7, 7),
            pawn8: new Piece("PAWN", side, 8, 7),

            rook1: new Piece("ROOK", side, 1, 8),
            knight1: new Piece("KNIGHT", side, 2, 8),
            bishop1: new Piece("BISHOP", side, 3, 8),
            queen: new Piece("QUEEN", side, 4, 8),
            king: new Piece("KING", side, 5, 8),
            bishop2: new Piece("BISHOP", side, 6, 8),
            knight2: new Piece("KNIGHT", side, 7, 8),
            rook2: new Piece("ROOK", side, 8, 8)
        }
    }
}

function drawSide(side) {
    let pieces = Object.entries(side.pieces)
    for (let piece of pieces) {
        piece[1].draw();
    }
}

function boardLoop(fn, x, y) {
    var x = 0;
    var y = 0;
    for (x = 0; x < 8; x++) {
        for (y = 0; y < 8; y++) {
            fn(x, y);
        }
    }
}

function mouseGrid() {
    if (turn == "WHITE") {
        gridMouse.x = ceil((mouseX - marginX) / squareSize);
        gridMouse.y = ceil((mouseY - marginY) / squareSize);
    }
    else if (turn == "BLACK") {

        gridMouse.x = ceil((boardSize - (mouseX - marginX)) / squareSize);
        gridMouse.y = ceil((boardSize - (mouseY - marginY)) / squareSize);
    }

    console.log(`[${gridMouse.x}, ${gridMouse.y}]`);

    if (gridMouse.x > 0 && gridMouse.x < 8 && gridMouse.y > 0 && gridMouse.y < 8) {
        let c = colors.blue;
        c.setAlpha(50)
        fill(c);
        c.setAlpha(225);
        stroke(c);
        rect((gridMouse.x - 1) * squareSize, (gridMouse.y - 1) * squareSize, squareSize, squareSize);
        noStroke();
    }
}

function selectPieceAtMouse() {
    console.log(selectedPiece);
    let pieces = Object.entries(whiteSide.pieces);
    let selection;
    for (let piece of pieces) {
        piece = piece[1];
        if (piece.grid.x == gridMouse.x && piece.grid.y == gridMouse.y)
            selection = piece;
    }

    selectedPiece = selection;
}
function darken(c, s) {
    s = constrain(s, 0, 1);
    let r = s * red(c);
    let g = s * green(c);
    let b = s * blue(c);

    return color(r, g, b);
}