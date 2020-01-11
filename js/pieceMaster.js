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
        this.glyph = setGlyph(this.type);
        this.moves = moves;
        this.moved = moved;
    }

    draw() {
        let fillColor = color(this.side.color || "#ff0000");
        let strokeColor = color(this.side.enemy ? this.side.enemy.color : "#ff0000");
        push();
        setupGlyphStyle();

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

    showAvailableMoves() {

        if (this.moves) {
            let moves = Object.values(this.moves)
            for (let move of moves) {
                let c = board.state[move.x][move.y] == Null ? color(colors.blue) : color(colors.red);
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

    getKing() {
        for (let king of getPiecesOfType("KING"))
            if (king.side.name == this.side.name)
                return king;
    }

    getCheckBreakingMoves() {
        let availableMoves = this.moves;

        this.moves = [];
        let currentCheck = board.check;
        for (let move of availableMoves) {
            let mockMove = this.beginMove(move.x, move.y);

            for (let king of getPiecesOfType("KING"))
                if (king.side.name == this.side.name)
                    king.checkLoop();

            if (board.check != currentCheck) {
                this.moves.push(move);
            }

            board.check = currentCheck;
            this.revertMove(mockMove.original, mockMove.destination);
        }

        if (this.moves.length)
            checkBreakers.push(this);
    }

    blockCheckMoves() {
        let i = 0;
        for (let move of this.moves) {
            let mockMove = this.beginMove(move.x, move.y);
            let currentCheck = board.check;

            for (let king of getPiecesOfType("KING"))
                if (king.side.name == this.side.name)
                    king.checkLoop();

            if (board.check)
                this.moves.splice(i, 1);
            else
                i++;

            board.check = currentCheck;
            this.revertMove(mockMove.original, mockMove.destination);
        }
    }

    beginMove(x, y) {
        let This = this;
        let original = {
            piece: This,
            x: This.position.index.x,
            y: This.position.index.y
        };
        let destination = {
            piece: board.state[x][y],
            x: x,
            y: y
        };

        // Set current state position to Null
        board.state[this.position.index.x][this.position.index.y] = Null;

        // Change Piece's position coords
        this.position.x = x + 1;
        this.position.index.x = x;
        this.position.y = y + 1;
        this.position.index.y = y;

        // Change state destination to this
        board.state[this.position.index.x][this.position.index.y] = Null;
        board.state[this.position.index.x][this.position.index.y] = this;

        return {
            original: original,
            destination: destination
        }
    }

    revertMove(original, destination) {
        this.position.x = original.x + 1;
        this.position.index.x = original.x;
        this.position.y = original.y + 1;
        this.position.index.y = original.y;

        board.state[original.x][original.y] = original.piece;
        board.state[destination.x][destination.y] = destination.piece;
    }

    moveTo(col, row, commit = true) {
        let moves = Object.values(this.moves);

        // Check col,row correspond to an existing move in this.moves
        for (let move of moves) {
            if (col == move.x + 1 && row == move.y + 1) {

                let mockMove = this.beginMove(col - 1, row - 1);

                this.commitMove(mockMove.original, mockMove.destination);
            }
        }
    }

    commitMove(original, destination) {
        // Add lastMove ghost
        board.lastMove = [{ x: original.x, y: original.y }];

        this.moved = true;

        // show *which* piece last moved
        board.lastMove.push({ x: this.position.index.x, y: this.position.index.y });

        if (this.type == "PAWN")
            if ((this.side.name == board.sides[0].name && this.position.y == 8) || (this.side.name == board.sides[1].name && this.position.y == 1))
                promotion = this;


        if (!promotion) {
            // Deselect on move
            player.selectedPiece = Null;

            if (board.isFirstMove)
                board.isFirstMove = false;

            if (destination.piece != Null)
                this.grave(destination.piece.type);

            // Change turn
            board.turn = this.side.enemy;

            console.log("sending data:")
            console.log(board)
            boardData.set(board);
        }

    }

    loopIncrement(incrementX, incrementY, loopFunction, n = 0) {
        let newX = this.position.index.x + incrementX;
        let newY = this.position.index.y + incrementY;

        // if n, only loop n times - else loop until we hit array bounds
        for (let i = 0; n != 0 ? i < n : i < board.state.length; i++)
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
            (x, y) => {
                this.addMove(x, y);
            }, n);
    }

    grave(pieceType) {
        let side = board.sides[0].name == this.side.name ? board.sides[0] : board.sides[1];
        if (!side.graveyard)
            side.graveyard = [];

        side.graveyard.push(pieceType);
    }
}