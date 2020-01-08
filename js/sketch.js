var bg = null;
var colors = {};
var player = {
    side: null,
    gridMouse: {},
    selectedPiece: null,
    view: null
}
var loaded;
var incomingData;
var board;
var fontIcon, fontText;
var players = [];

initialiseBoard();

function preload() {
    fontIcon = loadFont(iconFontPath);
    fontText = loadFont(textFontPath);
}

function setup() {
    createCanvas(w, h);

    colors = {
        red: color("#bd2d2d"),
        blue: color("#43ace6"),
        green: color("#4a962c")
    }
    textFont(fontText);

    boardData.on('value',
        data => {
            if (data.val()) {
                console.table('incoming boardData:');
                console.log(data.val());
                board.updateData(data.val());
                loaded = true;
            }
        },
        err => console.log(err)
    );
    playerData.on('value',
        data => {
            if (data.val()) {
                console.table('incoming playerData:');
                console.log(data.val());
                updatePlayers(data.val());
            }
        },
        err => console.log(err)
    );
}

function draw() {
    if (bg)
        background(bg);
    noFill();
    strokeWeight(1);
    stroke(board.sides[0].color);
    rect(0, 0, boardSize + marginX * 2, boardSize + marginY * 2);

    translate(marginX, marginY)
    select("body").style("background", bg);

    if (loaded)
        if (player.side) {
            if (player.view == board.sides[1].name) {
                push();
                translate(width - marginX * 2, height - marginY * 2);
                rotate(PI);
            }
            board.drawBoard();
            mouseGrid();
            board.drawPieces();
            if (player.selectedPiece)
                player.selectedPiece.showAvailableMoves();

            if (player.view == board.sides[1].name) {
                pop();
            }
        } else {
            if (board.sides.length == 2) {
                push();
                let white = board.sides[0].color;
                let black = board.sides[1].color;

                fill(white);
                noStroke();
                textSize(30);
                textAlign(CENTER, TOP);
                text("Choose a side", boardSize / 2, boardSize / 2 - squareSize * 1.5);


                setupGlyphStyle(squareSize);

                if (checkPlayerByName(board.sides[0].name) == false) {
                    fill(white);
                    stroke(black);
                    text(glyphs.king, boardSize / 2 - squareSize, boardSize / 2);
                }

                if (checkPlayerByName(board.sides[1].name) == false) {
                    fill(black);
                    stroke(white);
                    text(glyphs.king, boardSize / 2 + squareSize, boardSize / 2);
                }

                pop();
            }

        }
}


// Input Events
function mousePressed() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        if (player.side && board.turn.name == player.side.name) {
            let selection = player.selectedPiece;
            selectPieceAtMouse();
            if (selection && selection.moves.length)
                selection.moveTo(player.gridMouse.x, player.gridMouse.y);
        } else {
            let whiteX = marginX + boardSize / 2 - (squareSize * 1.5);
            let blackX = marginX + boardSize / 2 + (squareSize * 0.5);
            let iconY = marginY + boardSize / 2 - (squareSize * 0.5);
            let iconW = squareSize;
            let iconH = squareSize * 1.25;

            // Select White
            if (checkPlayerByName(board.sides[0].name) == false) {
                if (mouseX > whiteX && mouseX < whiteX + iconW && mouseY > iconY && mouseY < iconY + iconH) {
                    player.side = board.sides[0];
                    player.view = board.sides[0].name;
                    addPlayer(player.side.name);
                }
            }

            // Select Black
            if (checkPlayerByName(board.sides[1].name) == false) {
                if (mouseX > blackX && mouseX < blackX + iconW && mouseY > iconY && mouseY < iconY + iconH) {
                    player.side = board.sides[1];
                    player.view = board.sides[1].name;
                    addPlayer(player.side.name);
                }
            }
        }
    }
}

function mouseClicked() {
}

function mouseReleased() {
}

function keyPressed() {
    if (keyCode == 32) {
        changeView();
    }
    if (keyCode == 27) {
        resetBoard();
    }
}

function changeView() {
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

    if (selection == Null)
        player.selectedPiece = selection;

    // Limit selection to players' own side
    else if (selection.side.name == player.side.name) {
        // Deselect, if clicking selected piece
        if (selection == player.selectedPiece)
            selection = player.selectedPiece = null;

        player.selectedPiece = selection;
        if (selection && board.isFirstMove)
            player.selectedPiece.getMoves();
        console.log(player.selectedPiece);
    }
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

function resetBoard() {
    boardData.remove();
    initialiseBoard();
    console.log("sending data:")
    console.log(board)
    players = [];
    playerData.set(players);
    boardData.set(board);
}

function initialiseBoard() {
    board = new Board(true);

    var whiteSide = new Side("White", "#EEEEEE");
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

    var blackSide = new Side("Black", "#21252b");
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

function setupGlyphStyle(size = iconSize) {
    strokeWeight(6);
    textFont(fontIcon, size)
    textAlign(CENTER, CENTER)
}

function updatePlayers(data) {
    players = data;
}

function addPlayer(player) {
    players.push(player);
    playerData.set(players);
}

function checkPlayerByName(playerName) {
    var result = false;
    for (let p of players)
        if (p == playerName)
            result = true;
    return result;
}

window.addEventListener('beforeunload', (event) => {
    if (player.side) {
        for (let p = 0; p < players.length; p++)
            if (players[p] == player.side.name) {
                players.splice(p, 1);
                playerData.set(players);
            }

        // // Cancel the event as stated by the standard.
        // event.preventDefault();
        // // Chrome requires returnValue to be set.
        // event.returnValue = '';
    }
});