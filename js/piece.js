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
        this.moved = false;
    }

    validate() {

    }

    draw() {
        push();
        strokeWeight(6);
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

        if (this.moves) {
            let moves = Object.values(this.moves)
            for (let move of moves) {
                push();
                translate(move.x * squareSize, (8 - move.y - 1) * squareSize);
                noStroke();
                fill(darken(colors.blue, 0.75))
                circle(squareSize / 2, squareSize / 2, 20);
                pop();

                // console.log(`x: ${x}, y: ${y}, ${moves}`)

            }
        }
    }


    getMoves() {

    }

    moveTo(col, row) {
        let moves = Object.values(this.moves)
        for (let move of moves) {
            if (col == move.x + 1 && row == move.y + 1) {

                this.moved = true;
                board.state[this.position.index.x][this.position.index.y] = null;

                this.position.x = col;
                this.position.index.x = col - 1;
                this.position.y = row;
                this.position.index.y = row - 1;

                board.state[this.position.index.x][this.position.index.y] = null;
                board.state[this.position.index.x][this.position.index.y] = this;

            }
        }
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