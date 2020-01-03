class Board {
    constructor() {
        this.sides = [];
        this.turn = null;
        this.state = [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null]
        ];
    }

    drawBoard() {
        noStroke();
        boardLoop(function (x, y) {
            push();
            translate((x - 1) * squareSize, (8 - y) * squareSize);

            // Set alternating colors
            if ((x % 2 == 0 && y % 2 == 0) || (x % 2 != 0 && y % 2 != 0))
                fill(board.sides[0].color);
            else
                fill(board.sides[1].color);

            rect(0, 0, squareSize, squareSize);

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
                if (board.turn == board.sides[1])
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
                if (board.turn == board.sides[1])
                    rotate(PI);

                text(`${colChar(x)}`, 0, 0);
                pop();
            }
            pop();
        })

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
            this.sides[1].enemy = this.sides[0];
            this.sides[0].enemy = this.sides[1];
        }

    }


    checkPosition(x, y) {
        if (board.state[x] && board.state[x][y])
            return true;
        else
            return false;
    }


}