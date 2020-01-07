class Board {
    constructor(isFirstMove = false) {
        this.sides = [];
        this.turn = Null;
        this.state = [
            [Null, Null, Null, Null, Null, Null, Null, Null],
            [Null, Null, Null, Null, Null, Null, Null, Null],
            [Null, Null, Null, Null, Null, Null, Null, Null],
            [Null, Null, Null, Null, Null, Null, Null, Null],
            [Null, Null, Null, Null, Null, Null, Null, Null],
            [Null, Null, Null, Null, Null, Null, Null, Null],
            [Null, Null, Null, Null, Null, Null, Null, Null],
            [Null, Null, Null, Null, Null, Null, Null, Null]
        ];
        this.isFirstMove = isFirstMove;
        this.lastMove = Null;
    }

    drawBoard() {
        noStroke();
        boardLoop(function (x, y) {
            push();
            translate((x - 1) * squareSize, (8 - y) * squareSize);

            // Set alternating colors
            if ((x % 2 == 0 && y % 2 == 0) || (x % 2 != 0 && y % 2 != 0))
                fill(board.sides[1].color);
            else
                fill(board.sides[0].color);

            rect(0, 0, squareSize, squareSize);

            if (board.lastMove.length && board.lastMove[1].position.x == x && board.lastMove[1].position.y == y) {
                let c = color(colors.blue);
                c.setAlpha(100);
                fill(c);
                rect(0, 0, squareSize, squareSize);

            }



            fill(board.sides[1].color);

            textStyle(BOLD);
            textAlign(CENTER, CENTER);


            // Draw coordinate labels
            if (x == A || x == H) {
                push();
                switch (x) {
                    case A:
                        translate(-squareSize * 1.5, 0);
                    case H:
                        translate(squareSize * 1.25, squareSize / 2);
                }
                if (player.view == board.sides[1].name)
                    rotate(PI);

                text(`${y}`, 0, 0);
                pop();
            }
            if (y == 1 || y == 8) {
                push();
                switch (y) {
                    case 1:
                        translate(0, squareSize * 1.5);
                    case 8:
                        translate(squareSize / 2, -squareSize / 4);
                }
                if (player.view == board.sides[1].name)
                    rotate(PI);

                text(`${colChar(x)}`, 0, 0);
                pop();
            }
            pop();
        })

        push();
        if (player.view == board.sides[1].name) {
            translate(boardSize, boardSize);
            rotate(PI);
        }
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        fill(board.sides[1].color);
        text(`Current turn: ${board.turn.name}`, boardSize / 2, -50)
        pop();

        // Draw Borders
        strokeWeight(1);
        noFill();
        stroke(0);
        rect(0, 0, boardSize, boardSize);
        rect(-marginX, -marginY, boardSize + marginX * 2, boardSize + marginY * 2);
    }

    drawPieces() {
        for (let x of board.state)
            for (let piece of x)
                if (piece)
                    piece.draw();

    }

    addSide(side) {
        this.sides.push(side);

        if (side == this.sides[1]) {
            this.sides[0].createEnemy(this.sides[1]);
            this.sides[1].createEnemy(this.sides[0]);
            this.turn = this.sides[0];
            player.side = this.sides[0];
        }

    }


    checkPositionIsOccupied(x, y) {
        if (board.state[x] && board.state[x][y])
            return true;
        else
            return false;
    }

    updateData(data) {
        for (let [key, value] of Object.entries(data))
            switch (key) {
                case "lastMove":
                    this[key] = [];
                    for (let val of value) {
                        this[key].push(new Piece(val.type, val.side, val.position.x, val.position.y));
                    }
                    break;
                case "state":
                    this[key] = [];
                    for (let [index, array] of Object.entries(value)) {
                        this[key].push([]);
                        for (let i = 0; i < array.length; i++) {
                            if (array[i])
                                switch (array[i].type) {
                                    case "PAWN":
                                        this[key][index].push(new Pawn(array[i].side, array[i].position.x, array[i].position.y, array[i].moves, array[i].moved));
                                        break;

                                    case "ROOK":
                                        this[key][index].push(new Rook(array[i].side, array[i].position.x, array[i].position.y, array[i].moves, array[i].moved));
                                        break;

                                    case "KNIGHT":
                                        this[key][index].push(new Knight(array[i].side, array[i].position.x, array[i].position.y, array[i].moves, array[i].moved));
                                        break;

                                    case "BISHOP":
                                        this[key][index].push(new Bishop(array[i].side, array[i].position.x, array[i].position.y, array[i].moves, array[i].moved));
                                        break;

                                    case "QUEEN":
                                        this[key][index].push(new Queen(array[i].side, array[i].position.x, array[i].position.y, array[i].moves, array[i].moved));
                                        break;

                                    case "KING":
                                        this[key][index].push(new King(array[i].side, array[i].position.x, array[i].position.y, array[i].moves, array[i].moved, array[i].potentialAttackers));
                                        break;

                                    default:
                                        this[key][index].push(new Piece(array[i].type, array[i].side, array[i].position.x, array[i].moves, array[i].position.y, array[i].moved));
                                        break;
                                }
                            else
                                this[key][index].push(Null)
                        }
                    }
                    break;

                default:
                    this[key] = value;
                    break;
            }

        // call getMoves() for every piece
        boardLoop((x, y) => { if (board.state[x - 1][y - 1] !== Null) board.state[x - 1][y - 1].getMoves(); });
    }

}