
// Input Events
function mousePressed() {
    let screenCheckMate = player.side && checkMate;
    let screenPromotion = player.side && promotion;
    let screenSideSelect = !player.side;
    let screenGamePlay = player.side && !promotion && !checkMate;

    fieldFocus = null;

    // Gameplay
    if (screenGamePlay) {
        buttons.resetBoard.catchClick(resetBoard);

        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height && !checkMate) {
            if (player.side && board.turn.name == player.side.name) {
                let selection = player.selectedPiece;
                selectPieceAtMouse();
                if (selection && selection.moves.length)
                    selection.moveTo(player.gridMouse.x, player.gridMouse.y);
            }
        }
    }

    // Side Selection
    if (screenSideSelect) {
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
        textFields.newGame.catchClick((field) => {
            console.log(field)
            fieldFocus = field;
            let el = document.getElementById('textInput');
            document.getElementById('textInput').focus();
        })
    }

    // Promotion
    if (screenPromotion) {
        console.log("PROMOTION CLICK")
        buttons.promote.queen.catchClick(() => { promote(promotion, QUEEN) })
        buttons.promote.rook.catchClick(() => { promote(promotion, ROOK) })
        buttons.promote.bishop.catchClick(() => { promote(promotion, BISHOP) })
        buttons.promote.knight.catchClick(() => { promote(promotion, KNIGHT) })

    }

    // Checkmate
    if (screenCheckMate) {
        buttons.resetBoard.catchClick(resetBoard);
    }
}

function mouseClicked() {
    if (fieldFocus)
        document.getElementById('textInput').focus()
}

function mouseReleased() {
}

function keyPressed(e) {
    var capsLock = e.getModifierState('CapsLock');

    if (keyCode == 32) {
        changeView();
    }
    if (keyCode == ESCAPE) {
        resetBoard();
    }
}