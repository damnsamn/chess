class Side {
    constructor(c) {
        this.color = c;
    }

    definePieces(obj) {
        this.pieces = obj;
        board.addSide(this);

        let pieces = Object.values(obj)
        for (let piece of pieces) {
            board.state[piece.position.index.x][piece.position.index.y] = piece;
        }
    }

    // draw() {
    //     let pieces = Object.entries(this.pieces)
    //     for (let piece of pieces) {
    //         piece[1].draw();
    //     }
    // }
}