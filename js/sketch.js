var colors = {};
var player = {
    gridMouse: {},
    selectedPiece: null,
    view: null
}
var loaded;
var incomingData;
var board;

initialiseBoard();

function preload() {
    iconFont = loadFont(iconFontPath);
}

function setup() {
    createCanvas(w, h);

    colors = {
        red: color("#d60b0b"),
        blue: color("#43ace6")
    }

    console.log(board);
    console.log(player);

    // DBData.remove();
    DBData.on('value', data => { if (data.val()) { console.table('incoming data:'); console.log(data.val()); board.updateData(data.val()); loaded = true; } }, err => console.log(err));
}

function draw() {
    background(255);
    translate(marginX, marginY)

    if (player.view == board.sides[1].name) {
        push();
        translate(width - marginX * 2, height - marginY * 2);
        rotate(PI);
    }

    board.drawBoard();
    mouseGrid();
    if (loaded)
        board.drawPieces();

    if (board.lastMove.length)
        board.lastMove[0].draw();


    if (player.selectedPiece)
        player.selectedPiece.showAvailableMoves();

    if (player.view == board.sides[1].name) {
        pop();
    }

    fill(255, 0, 0);
    circle(0, 0, 5);
}


// Input Events
function mousePressed() {
}

function mouseClicked() {
    let selection = player.selectedPiece;
    selectPieceAtMouse();
    if (selection && selection.moves.length)
        selection.moveTo(player.gridMouse.x, player.gridMouse.y);

}

function mouseReleased() {
}

function keyPressed() {
    if (keyCode == 32) {
        changeTurn();
        console.log(player.view)
    }
    if (keyCode == 27) {
        initialiseBoard();
        console.log("sending data:")
        console.log(board)
        DBData.set(board);
    }
}

function changeTurn() {
    if (player.view == board.sides[0].name)
        player.view = board.sides[1].name
    else if (player.view == board.sides[1].name)
        player.view = board.sides[0].name
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
    if (player.view == board.sides[0].name) {
        player.gridMouse.x = ceil((mouseX - marginX) / squareSize);
        player.gridMouse.y = 8 - ceil((mouseY - marginY) / squareSize) + 1;
    }
    else if (player.view == board.sides[1].name) {
        player.gridMouse.x = ceil((boardSize - (mouseX - marginX)) / squareSize);
        player.gridMouse.y = 8 - ceil((boardSize - (mouseY - marginY)) / squareSize) + 1;
    }
}

function selectPieceAtMouse() {
    let selection = board.state[player.gridMouse.x - 1][player.gridMouse.y - 1];

    // Deselect, if clicking selected piece
    if (selection == player.selectedPiece)
        selection = player.selectedPiece = null;

    player.selectedPiece = selection;
    if (selection && board.isFirstMove)
        player.selectedPiece.getMoves();
    console.log(player.selectedPiece);
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
    let boardPointer = board.state[col - 1][row - 1];
    if (boardPointer != Null)
        return boardPointer;
    else
        return false;
}

function getPiecesOfType(string) {
    let arr = [];
    boardLoop((x, y) => {
        let boardPointer = board.state[x - 1][y - 1];
        if (boardPointer != Null && boardPointer.type == string)
            arr.push(boardPointer);
    })

    return arr;
}

function getSideAtCoordinate(col, row) {
    let boardPointer = board.state[col - 1][row - 1];
    if (boardPointer != null)
        return boardPointer.side;
    else
        return false;
}

function initialiseBoard() {
    board = new Board(true);

    var whiteSide = new Side("White", 255);
    whiteSide.definePieces([
        new Pawn(whiteSide, A, 2),
        new Pawn(whiteSide, B, 2),
        new Pawn(whiteSide, C, 2),
        new Pawn(whiteSide, D, 2),
        new Pawn(whiteSide, E, 2),
        new Pawn(whiteSide, F, 2),
        new Pawn(whiteSide, G, 2),
        new Pawn(whiteSide, H, 2),
        new Rook(whiteSide, A, 1),
        new Knight(whiteSide, B, 1),
        new Bishop(whiteSide, C, 1),
        new Queen(whiteSide, D, 1),
        new King(whiteSide, E, 1),
        new Bishop(whiteSide, F, 1),
        new Knight(whiteSide, G, 1),
        new Rook(whiteSide, H, 1)
    ]);

    var blackSide = new Side("Black", 0);
    blackSide.definePieces([
        new Pawn(blackSide, A, 7),
        new Pawn(blackSide, B, 7),
        new Pawn(blackSide, C, 7),
        new Pawn(blackSide, D, 7),
        new Pawn(blackSide, E, 7),
        new Pawn(blackSide, F, 7),
        new Pawn(blackSide, G, 7),
        new Pawn(blackSide, H, 7),
        new Rook(blackSide, A, 8),
        new Knight(blackSide, B, 8),
        new Bishop(blackSide, C, 8),
        new Queen(blackSide, D, 8),
        new King(blackSide, E, 8),
        new Bishop(blackSide, F, 8),
        new Knight(blackSide, G, 8),
        new Rook(blackSide, H, 8)
    ]);
    player.view = board.sides[0].name;
}