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
var iconFont;
var turn;

var board = new Board();

var whiteSide = new Side(255);
whiteSide.definePieces({
    pawn1: new Pawn(whiteSide, A, 2),
    pawn2: new Pawn(whiteSide, B, 2),
    pawn3: new Pawn(whiteSide, C, 2),
    pawn4: new Pawn(whiteSide, D, 2),
    pawn5: new Pawn(whiteSide, E, 2),
    pawn6: new Pawn(whiteSide, F, 2),
    pawn7: new Pawn(whiteSide, G, 2),
    pawn8: new Pawn(whiteSide, H, 2),

    rook1: new Rook(whiteSide, A, 1),
    knight1: new Knight(whiteSide, B, 1),
    bishop1: new Piece("BISHOP", whiteSide, C, 1),
    queen: new Piece("QUEEN", whiteSide, D, 1),
    king: new Piece("KING", whiteSide, E, 1),
    bishop2: new Piece("BISHOP", whiteSide, F, 1),
    knight2: new Knight(whiteSide, G, 1),
    rook2: new Rook(whiteSide, H, 1)
});

var blackSide = new Side(0);
blackSide.definePieces({
    pawn1: new Pawn(blackSide, A, 7),
    pawn2: new Pawn(blackSide, B, 7),
    pawn3: new Pawn(blackSide, C, 7),
    pawn4: new Pawn(blackSide, D, 7),
    pawn5: new Pawn(blackSide, E, 7),
    pawn6: new Pawn(blackSide, F, 7),
    pawn7: new Pawn(blackSide, G, 7),
    pawn8: new Pawn(blackSide, H, 7),

    rook1: new Rook(blackSide, A, 8),
    knight1: new Knight(blackSide, B, 8),
    bishop1: new Piece("BISHOP", blackSide, C, 8),
    queen: new Piece("QUEEN", blackSide, D, 8),
    king: new Piece("KING", blackSide, E, 8),
    bishop2: new Piece("BISHOP", blackSide, F, 8),
    knight2: new Knight(blackSide, G, 8),
    rook2: new Rook(blackSide, H, 8)
});
board.turn = board.sides[0];

console.log(board)


var colors = {
}

function preload() {
    iconFont = loadFont('/assets/fa-solid-900.ttf');
}

function setup() {
    createCanvas(w, h);

    colors = {
        red: color("#d60b0b"),
        blue: color("#43ace6")
    }
}

function draw() {
    background(255);
    translate(marginX, marginY)

    if (board.turn == board.sides[1]) {
        push();
        translate(width - marginX * 2, height - marginY * 2);
        rotate(PI);
    }

    board.drawBoard();
    mouseGrid();
    board.drawPieces();

    if (board.lastMove.length)
        board.lastMove[0].draw();


    if (selectedPiece)
        selectedPiece.showAvailableMoves();

    if (board.turn == board.sides[1]) {
        pop();
    }

    fill(255, 0, 0);
    circle(0, 0, 5);
}


// Input Events
function mousePressed() {
}

function mouseClicked() {
    let selection = selectedPiece;
    selectPieceAtMouse();
    if (selection)
        selection.moveTo(gridMouse.x, gridMouse.y);

}

function mouseReleased() {
}

function keyPressed() {
    if (keyCode == 32)
        changeTurn();
    console.log(board.turn)
}

function changeTurn() {
    if (board.turn == board.sides[0])
        board.turn = board.sides[1]
    else if (board.turn == board.sides[1])
        board.turn = board.sides[0]
}

// TODO: Add Board argument
function boardLoop(fn) {
    let w = board.state.length;
    let h = board.state[0].length;
    for (let x = 1; x <= w; x++) {
        for (let y = h; y >= 1; y--) {
            fn(x, y);
        }
    }
}

function mouseGrid() {
    if (board.turn == board.sides[0]) {
        gridMouse.x = ceil((mouseX - marginX) / squareSize);
        gridMouse.y = 8 - ceil((mouseY - marginY) / squareSize) + 1;
    }
    else if (board.turn == board.sides[1]) {
        gridMouse.x = ceil((boardSize - (mouseX - marginX)) / squareSize);
        gridMouse.y = 8 - ceil((boardSize - (mouseY - marginY)) / squareSize) + 1;
    }

    console.log(`[${colChar(gridMouse.x)}, ${gridMouse.y}]`);

    // if (gridMouse.x > 0 && gridMouse.x <= 8 && gridMouse.y > 0 && gridMouse.y <= 8) {
    //     let c = colors.blue;
    //     c.setAlpha(50)
    //     fill(c);
    //     c.setAlpha(225);
    //     stroke(c);
    //     rect((gridMouse.x - 1) * squareSize, (8 - gridMouse.y) * squareSize, squareSize, squareSize);
    //     noStroke();
    // }
}

function selectPieceAtMouse() {
    let selection = board.state[gridMouse.x - 1][gridMouse.y - 1];
    if (selection == selectedPiece)
        selection = selectedPiece = null;
    selectedPiece = selection;
    if (selection)
        selectedPiece.getMoves();
    console.log(selectedPiece);
}
function darken(c, s) {
    s = constrain(s, 0, 1);
    let r = s * red(c);
    let g = s * green(c);
    let b = s * blue(c);

    return color(r, g, b);
}

function getPieceAtCoordinate(col, row) {
    // eg col: A, row: 1
    // for all pieces, return piece that matches gridX==col and gridY==row
    let boardPointer = board.state[col - 1][row - 1];
    if (boardPointer != null)
        return boardPointer;
    else
        return false;
}

function getSideAtCoordinate(col, row) {
    let boardPointer = board.state[col - 1][row - 1];
    if (boardPointer != null)
        return boardPointer.side;
    else
        return false;

}