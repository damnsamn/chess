var colors = {};
var player = {
    gridMouse: {},
    selectedPiece: null,
    view: null
}
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

    DBData.remove();
    DBData.on('value', data => { console.table('incoming data:'); if (data.val()) { console.log(data.val()); board.updateData(data.val()) } }, err => console.log(err));
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
    if (selection)
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

    // if (player.gridMouse.x > 0 && player.gridMouse.x <= 8 && player.gridMouse.y > 0 && player.gridMouse.y <= 8) {
    //     let c = colors.blue;
    //     c.setAlpha(50)
    //     fill(c);
    //     c.setAlpha(225);
    //     stroke(c);
    //     rect((player.gridMouse.x - 1) * squareSize, (8 - player.gridMouse.y) * squareSize, squareSize, squareSize);
    //     noStroke();
    // }
}

function selectPieceAtMouse() {
    let selection = board.state[player.gridMouse.x - 1][player.gridMouse.y - 1];
    if (selection == player.selectedPiece)
        selection = player.selectedPiece = null;
    player.selectedPiece = selection;
    if (selection)
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

function initialiseBoard() {
    board = new Board();

    var whiteSide = new Side("White", 255);
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

    var blackSide = new Side("Black", 0);
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
    player.view = board.sides[0].name;
}