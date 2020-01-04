class Side {
    constructor(name, c) {
        this.name = name;
        this.color = c;
    }

    definePieces(obj) {
        board.addSide(this);

        let pieces = Object.values(obj)
        for (let piece of pieces) {
            board.state[piece.position.index.x][piece.position.index.y] = piece;
        }
    }

    createEnemy(side) {
        this.enemy = {
            name: side.name,
            color: side.color
        }

    }
}