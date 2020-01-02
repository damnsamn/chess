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
    pawn1: new Piece("PAWN", whiteSide, A, 2),
    pawn2: new Piece("PAWN", whiteSide, B, 2),
    pawn3: new Piece("PAWN", whiteSide, C, 2),
    pawn4: new Piece("PAWN", whiteSide, D, 2),
    pawn5: new Piece("PAWN", whiteSide, E, 2),
    pawn6: new Piece("PAWN", whiteSide, F, 2),
    pawn7: new Piece("PAWN", whiteSide, G, 2),
    pawn8: new Piece("PAWN", whiteSide, H, 2),

    rook1: new Piece("ROOK", whiteSide, A, 1),
    knight1: new Piece("KNIGHT", whiteSide, B, 1),
    bishop1: new Piece("BISHOP", whiteSide, C, 1),
    queen: new Piece("QUEEN", whiteSide, D, 1),
    king: new Piece("KING", whiteSide, E, 1),
    bishop2: new Piece("BISHOP", whiteSide, F, 1),
    knight2: new Piece("KNIGHT", whiteSide, G, 1),
    rook2: new Piece("ROOK", whiteSide, H, 1)
});

var blackSide = new Side(0);
blackSide.definePieces({
    pawn1: new Piece("PAWN", blackSide, A, 7),
    pawn2: new Piece("PAWN", blackSide, B, 7),
    pawn3: new Piece("PAWN", blackSide, C, 7),
    pawn4: new Piece("PAWN", blackSide, D, 7),
    pawn5: new Piece("PAWN", blackSide, E, 7),
    pawn6: new Piece("PAWN", blackSide, F, 7),
    pawn7: new Piece("PAWN", blackSide, G, 7),
    pawn8: new Piece("PAWN", blackSide, H, 7),

    rook1: new Piece("ROOK", blackSide, A, 8),
    knight1: new Piece("KNIGHT", blackSide, B, 8),
    bishop1: new Piece("BISHOP", blackSide, C, 8),
    queen: new Piece("QUEEN", blackSide, D, 8),
    king: new Piece("KING", blackSide, E, 8),
    bishop2: new Piece("BISHOP", blackSide, F, 8),
    knight2: new Piece("KNIGHT", blackSide, G, 8),
    rook2: new Piece("ROOK", blackSide, H, 8)
});
board.turn = board.sides[0];

console.log(board)


var colors = {}

function preload() {
    iconFont = loadFont('/assets/fa-solid-900.ttf');
}

function setup() {
    createCanvas(w, h);

    colors.blue = color(67, 172, 230);
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

    for (side of board.sides)
        side.draw();

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
    selectPieceAtMouse();
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

    if (gridMouse.x > 0 && gridMouse.x <= 8 && gridMouse.y > 0 && gridMouse.y <= 8) {
        let c = colors.blue;
        c.setAlpha(50)
        fill(c);
        c.setAlpha(225);
        stroke(c);
        rect((gridMouse.x - 1) * squareSize, (8 - gridMouse.y) * squareSize, squareSize, squareSize);
        noStroke();
    }
}

function selectPieceAtMouse() {
    console.log(selectedPiece);
    let pieces = Object.entries(whiteSide.pieces);
    let selection;
    for (let piece of pieces) {
        piece = piece[1];
        if (piece.position.x == gridMouse.x && piece.position.y == gridMouse.y)
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

function getPieceAtCoordinate(col, row) {
    // eg col: A, row: 1
    // for all pieces, return piece that matches gridX==col and gridY==row
    let piece;
    if (piece.gridX == col && piece.gridX == row)
        return piece;
    else
        return false;
}