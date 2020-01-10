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
var checkMate = false;
var checkBreakers = [];
var activity = {};

initialiseBoard();

function preload() {
    fontIcon = loadFont(iconFontPath);
    fontText = loadFont(textFontPath);
}

function setup() {
    createCanvas(w, h);

    colors = {
        red: "#bd2d2d",
        blue: "#43ace6",
        green: "#4a962c"
    }
    textFont(fontText);

    boardData.on('value',
        data => {
            if (data.val() && !checkMate) {
                console.table('Incoming boardData:');
                console.log(data.val());
                board.updateData(data.val());
                loaded = true;
            }
        },
        err => console.log(err)
    );

    activityData.on('value',
        data => {
            if (data.val()) {
                console.table('Incoming Activity:');
                console.log(data.val());
                activity = data.val();
            }
        },
        err => console.log(err)
    );
}

function draw() {
    if (bg)
        background(bg);
    cursor(ARROW);
    noFill();
    strokeWeight(1);
    stroke(board.sides[0].color);
    rect(0, 0, boardSize + marginX * 2, boardSize + marginY * 2);

    select("body").style("background", bg);
    selectAll("meta")[2].attribute("content", bg);

    if (loaded) {

        if (player.side) {
            push();
            buttons.resetBoard.color = color(colors.red);
            buttons.resetBoard.draw(width / 2 - 62.5, height - marginY / 2 + 5 - 17.5, 125, 35)
            translate(marginX, marginY)
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
            pop();
        } else {
            if (board.sides.length == 2) {
                push();

                fill(255);
                noStroke();
                textSize(30);
                textAlign(CENTER, TOP);
                text("Choose a side:", width / 2, height / 2 - squareSize * 1.5);

                let iconW = squareSize;
                let iconH = squareSize * 1.25;


                // if (checkPlayerByName(board.sides[0].name) == false) {
                buttons.selectWhite.draw(width / 2 - iconW * 1.5, height / 2 - iconH / 2, iconW, iconH);
                // }

                // if (checkPlayerByName(board.sides[1].name) == false) {
                buttons.selectBlack.draw(width / 2 + iconW * 0.5, height / 2 - iconH / 2, iconW, iconH);
                // }

                pop();
            }

        }
    }

    if (checkMate) {
        push();
        fill(0, 0, 0, 175)
        noStroke();
        rect(0, 0, width, height);
        fill(255);
        textSize(30);
        textAlign(CENTER, CENTER);
        text(`CHECKMATE`, width / 2, height / 2 - 30);
        textSize(20);
        text(`${board.check.side.enemy.name} is victorious!`, width / 2, height / 2 + 30);
        buttons.resetBoard.color = lighten(color(colors.red), 0.25);
        buttons.resetBoard.draw(width / 2 - 62.5, height - 75, 125, 35)
        pop();
    }
}


// Input Events
function mousePressed() {
    if (!checkMate) {
        if (player.side) {
            buttons.resetBoard.catchClick(resetBoard);

            if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height && !checkMate) {
                if (player.side && board.turn.name == player.side.name) {
                    let selection = player.selectedPiece;
                    selectPieceAtMouse();
                    if (selection && selection.moves.length)
                        selection.moveTo(player.gridMouse.x, player.gridMouse.y);
                }
            }
        } else {
            buttons.selectWhite.catchClick(() => {
                player.side = board.sides[0];
                player.view = board.sides[0].name;
                board.active = true;
                setPlayerActivity(true);
            });

            buttons.selectBlack.catchClick(() => {
                player.side = board.sides[1];
                player.view = board.sides[1].name;
                board.active = true;
                setPlayerActivity(true);
            });
        }
    } else {
        buttons.resetBoard.catchClick(resetBoard);
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
    if (player && player.gridMouse.x >= 1 && player.gridMouse.x <= 8 && player.gridMouse.y >= 1 && player.gridMouse.y <= 8) {
        let selection = board.state[player.gridMouse.x - 1][player.gridMouse.y - 1];

        if (selection == Null)
            player.selectedPiece = selection;

        // Limit selection to players' own side
        else if (selection.side.name == player.side.name) {
            // Deselect, if clicking selected piece
            if (selection == player.selectedPiece)
                selection = player.selectedPiece = null;

            player.selectedPiece = selection;
            if (player.selectedPiece && board.isFirstMove)
                player.selectedPiece.getMoves();
            console.log(player.selectedPiece);
        }
    }
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
    setAllActivity(false);
    player.side = null;
    board.active = false;
    console.log("sending data:")
    boardData.set(board);
    checkMate = false;
    noLoop();
    loop();
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
        new King(whiteSide, E, 1), // E1
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
        new Queen(blackSide, D, 8), // D8
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

function setPlayerActivity(bool) {
    if (player.side) {
        for (let side of board.sides)
            if (side.name == player.side.name)
                activity[side.name] = bool;
        console.log("Player Activity Changed:")
        console.log(activity)
        activityData.set(activity);
    }
}
function setAllActivity(bool) {
    for (let side of activity)
        side.active = bool;
    console.log("Reset Player Activity:")
    console.log(activity)
    activityData.set(activity);
}

// // Remove player when closing the window/refreshing
window.addEventListener('beforeunload', playerLeave);
// Remove player when window loses focus (mobile OR desktop)
window.addEventListener('blur', playerLeave);
// Re-add player when window regains focus
window.addEventListener('focus', playerReturn);


function playerLeave() {
    setPlayerActivity(false);
}
function playerReturn() {
    setPlayerActivity(true);
}