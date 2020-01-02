class Piece {
    constructor(type, side, posX, posY) {
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
    }

    validate() {

    }

    draw() {
        push();
        strokeWeight(8);
        let iconSize = squareSize / 1.5;
        textFont(iconFont, iconSize)

        translate((this.position.index.x) * squareSize, (8 - this.position.index.y - 1) * squareSize);
        if (board.turn == board.sides[1]) {
            translate(squareSize, squareSize);
            rotate(PI);
        }

        fill(this.side.color);
        stroke(selectedPiece == this ? darken(colors.blue, 0.75) : 255 - this.side.color);
        textAlign(CENTER, CENTER)
        text(this.glyph, squareSize / 2, squareSize / 2 - iconSize / 8);
        pop();
    }

    showAvailableMoves() {
        let piece = this;

        let moves = piece.getMoves();

        for (let move in moves) {
            boardLoop(function (x, y) {
                if (x == move[0] && y == move[1]) {
                    push();
                    translate(x * squareSize, y * squareSize);
                    noStroke();
                    fill(darken(colors.blue, 0.75))
                    circle(squareSize / 2, squareSize / 2, 20);
                    pop();

                    // console.log(`x: ${x}, y: ${y}, ${moves}`)
                }
            })

        }
    }


    highlight() {
        // Highlight the available moves
    }

    getMoves() {
        // Get the available moves, set this.availableMoves
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