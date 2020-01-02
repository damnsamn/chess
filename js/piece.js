class Piece {
    constructor(type, color, gridX, gridY) {
        this.type = type;
        this.color = color;
        this.grid = {
            x: gridX,
            y: gridY,
            index0: {
                x: gridX - 1,
                y: gridY - 1
            }
        }
        this.glyph = this.setGlyph();
    }

    validate() {

    }

    draw() {
        strokeWeight(3);
        let iconSize = squareSize / 2;
        textFont(iconFont, iconSize)

        push();
        translate((this.grid.index0.x) * squareSize, (this.grid.index0.y) * squareSize);
        if (turn == "BLACK") {
            translate(squareSize, squareSize);
            rotate(PI);
        }

        fill(this.color == "WHITE" ? 255 : 0);
        stroke(selectedPiece == this ? darken(colors.blue, 0.75) : (this.color == "BLACK" ? 255 : 0));
        textAlign(CENTER, CENTER)
        text(this.glyph, squareSize / 2, squareSize / 2 - iconSize / 8);

        // fill(this.color == "BLACK" ? 255 : 0);
        // noStroke();
        // textAlign(CENTER);
        // text(this.type, squareSize / 2, squareSize / 2);
        pop();
    }

    showAvailableMoves() {
        let piece = this;

        boardLoop(function (x, y) {
            let moves = piece.getMoves();
            if (x == moves[0] && y == moves[1]) {
                push();
                translate(x * squareSize, y * squareSize);
                noStroke();
                fill(255, 0, 0)
                circle(squareSize / 2, squareSize / 2, 20);
                pop();

                // console.log(`x: ${x}, y: ${y}, ${moves}`)
            }
        })
    }

    highlight() {
        switch (this.type) {
            case "PAWN":

                break;
        }
    }

    getMoves() {
        switch (this.type) {
            case "PAWN":
                return [this.grid.index0.x, this.grid.index0.y - 1];
            default:
                console.log(`Error getting moves for ${this}`);
                return null;
        }
    }

    setGlyph() {
        switch (this.type) {
            case "PAWN":
                return "\u{F444}";
            case "ROOK":
                return "\u{F448}";
            case "KNIGHT":
                return "\u{F442}";
            case "BISHOP":
                return "\u{F43b}";
            case "QUEEN":
                return "\u{F446}";
            case "KING":
                return "\u{F440}";
        }
    }
}