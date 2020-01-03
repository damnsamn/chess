class Rook extends Piece {

    constructor(side, gridX, gridY) {
        super("ROOK", side, gridX, gridY);
    }

    getMoves() {
        this.moves = [];

        // loop once in each direction
        // left
        this.loopX(this.position.index.x - 1, 0);
        // right
        this.loopX(this.position.index.x + 1, board.state.length - 1);

        // up
        this.loopY(this.position.index.y + 1, board.state.length - 1);
        // down
        this.loopY(this.position.index.y - 1, 0);

    }

    loopX(start, max) {
        for (let x = start; max == 0 ? x >= 0 : x <= max; max == 0 ? x-- : x++) {
            if (board.state[x][this.position.index.y] === null)
                this.moves.push({ x: x, y: this.position.index.y })
            else if (board.state[x][this.position.index.y].side != this.side) {
                this.moves.push({ x: x, y: this.position.index.y })
                break;
            } else
                break;
        }
    }

    loopY(start, max) {
        for (let y = start; max == 0 ? y >= 0 : y <= max; max == 0 ? y-- : y++) {
            if (board.state[this.position.index.x][y] === null)
                this.moves.push({ x: this.position.index.x, y: y })
            else if (board.state[this.position.index.x][y].side != this.side) {
                this.moves.push({ x: this.position.index.x, y: y })
                break;
            } else
                break;
        }
    }
}