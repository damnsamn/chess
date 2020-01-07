class Piece {
    constructor(type, side, posX, posY, moves = [], moved = false) {
        this.type = type;
        this.side = side;
        this.position = {
            x: posX,
            y: posY,
            index: {
                x: posX - 1,
                y: posY - 1
            }
        }
        this.glyph = this.setGlyph();
        this.moves = moves;
        this.moved = moved;
    }

    draw() {
        let fillColor = color(this.side.color || "#ff0000");
        let strokeColor = color(this.side.enemy ? this.side.enemy.color : "#ff0000");
        push();
        this.setupGlyphStyle();

        translate((this.position.index.x) * squareSize, (8 - this.position.index.y - 1) * squareSize);
        if (player.view == board.sides[1].name) {
            translate(squareSize, squareSize);
            rotate(PI);
        }

        stroke(player.selectedPiece == this ? darken(colors.blue, 0.75) : strokeColor);
        fill(fillColor);
        text(this.glyph, squareSize / 2, squareSize / 2 - iconSize / 8);
        pop();
    }

    setupGlyphStyle() {
        strokeWeight(6);
        textFont(iconFont, iconSize)
        textAlign(CENTER, CENTER)
    }

    showAvailableMoves() {

        if (this.moves) {
            let moves = Object.values(this.moves)
            for (let move of moves) {
                let c = board.state[move.x][move.y] == Null ? colors.blue : colors.red;
                push();
                translate(move.x * squareSize, (8 - move.y - 1) * squareSize);

                noStroke();
                c.setAlpha(150)
                fill(c)
                circle(squareSize / 2, squareSize / 2, 20);
                pop();

                // console.log(`x: ${x}, y: ${y}, ${moves}`)

            }
        }
    }

    addMove(row, col) {
        this.moves.push({ x: row, y: col });
    }


    getMoves() {

    }

    checkBreakingMoves() {

    }

    moveTo(col, row) {
        let moves = Object.values(this.moves);

        // Check col,row correspond to an existing move in this.moves
        for (let move of moves) {
            if (col == move.x + 1 && row == move.y + 1) {
                // Add lastMove ghost
                board.lastMove = [new Piece(this.type, this.side, this.position.x, this.position.y)];

                this.moved = true;

                // Set current state position to Null
                board.state[this.position.index.x][this.position.index.y] = Null;

                // Change Piece's position coords
                this.position.x = col;
                this.position.index.x = col - 1;
                this.position.y = row;
                this.position.index.y = row - 1;

                // Change state destination to this
                board.state[this.position.index.x][this.position.index.y] = Null;
                board.state[this.position.index.x][this.position.index.y] = this;

                // show *which* piece last moved
                board.lastMove.push(this);

                // Deselect on move
                player.selectedPiece = Null;

                if (board.isFirstMove)
                    board.isFirstMove = false;

                // Perform checkLoop() for each King
                for (let king of getPiecesOfType("KING"))
                    king.checkLoop();

                // Change turn
                board.turn = this.side.enemy;

                console.log("sending data:")
                console.log(board)
                DBData.set(board);
            }
        }
    }

    loopIncrement(incrementX, incrementY, loopFunction, n = 0) {
        let newX = this.position.index.x + incrementX;
        let newY = this.position.index.y + incrementY;

        // if n, only loop n times - else loop until we hit array bounds
        for (let i = 0; n ? i < n : i < board.state.length; i++)
            if (newX >= 0 && newX < board.state.length && newY >= 0 && newY < board.state.length) {
                let newPos = board.state[newX][newY];

                if (newPos === Null && newPos !== undefined) {
                    loopFunction(newX, newY);
                    newX += incrementX;
                    newY += incrementY;
                } else if (newPos && newPos.side.name != this.side.name) {
                    loopFunction(newX, newY);
                    break;
                }
            }
    }

    moveLoop(incrementX, incrementY, n) {
        this.loopIncrement(
            incrementX,
            incrementY,
            (x, y) => { this.addMove(x, y) },
            n
        );
    }

    setGlyph() {
        switch (this.type) {
            case "PAWN":
                return "\u{F443}";
            case "ROOK":
                return "\u{F447}";
            case "KNIGHT":
                return "\u{F441}";
            case "BISHOP":
                return "\u{F43A}";
            case "QUEEN":
                return "\u{F445}";
            case "KING":
                return "\u{F43F}";
        }
    }
}