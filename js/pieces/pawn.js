class Pawn extends Piece {

    constructor(color, gridX, gridY) {
        super(color, gridX, gridY);
    }

    getMoves() {
        let moves = [];

        boardLoop(function (x, y) {
            if (x == this.gridX && y == this.gridY - 1) {
                moves.push([x,y]);
            }
        })


    }
}