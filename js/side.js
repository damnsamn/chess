class Side {
    constructor(name, c) {
        this.name = name;
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
}