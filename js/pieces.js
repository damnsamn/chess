class Pawn extends Piece {
    constructor(side, gridX, gridY, moves = [], moved = false) {
        super("PAWN", side, gridX, gridY, moves, moved);
    }

    getMoves() {
        this.moves = [];

        let yDir = board.sides[0].name == this.side.name ? 1 : -1;
        let yStep = this.position.index.y + yDir;

        // Forward
        if (!board.checkPositionIsOccupied(this.position.index.x, yStep) && board.state[this.position.index.x][yStep] !== undefined)
            this.moves.push({ x: this.position.index.x, y: yStep });

        // Two-step
        if (!this.moved && !board.checkPositionIsOccupied(this.position.index.x, yStep) && !board.checkPositionIsOccupied(this.position.index.x, yStep + yDir))
            this.moves.push({ x: this.position.index.x, y: yStep + yDir });

        // Capture Left
        if (board.checkPositionIsOccupied(this.position.index.x - 1, yStep) && board.state[this.position.index.x - 1][yStep].side.name != this.side.name)
            this.moves.push({ x: this.position.index.x - 1, y: yStep });

        // Capture Right
        if (board.checkPositionIsOccupied(this.position.index.x + 1, yStep) && board.state[this.position.index.x + 1][yStep].side.name != this.side.name)
            this.moves.push({ x: this.position.index.x + 1, y: yStep });
    }


}

class Rook extends Piece {
    constructor(side, gridX, gridY, moves = []) {
        super("ROOK", side, gridX, gridY, moves);
    }

    getMoves() {
        this.moves = [];

        // left
        this.moveLoop(-1, 0);
        // right
        this.moveLoop(1, 0);
        // up
        this.moveLoop(0, 1);
        // down
        this.moveLoop(0, -1);

    }
}

class Knight extends Piece {
    constructor(side, gridX, gridY, moves = []) {
        super("KNIGHT", side, gridX, gridY, moves);
    }

    getMoves() {
        this.moves = [];

        // Top-Left
        // this.checkEmptyOrEnemy(this.position.index.x - 1, this.position.index.y + 2);
        this.moveLoop(-1, 2, 1);
        // Top-Right
        // this.checkEmptyOrEnemy(this.position.index.x + 1, this.position.index.y + 2);
        this.moveLoop(1, 2, 1);

        // Right-Top
        // this.checkEmptyOrEnemy(this.position.index.x + 2, this.position.index.y + 1);
        this.moveLoop(2, 1, 1);
        // Right-Bottom
        // this.checkEmptyOrEnemy(this.position.index.x + 2, this.position.index.y - 1);
        this.moveLoop(2, -1, 1);

        // Bottom-Left
        // this.checkEmptyOrEnemy(this.position.index.x + 1, this.position.index.y - 2);
        this.moveLoop(-1, -2, 1);
        // Bottom-Right
        // this.checkEmptyOrEnemy(this.position.index.x - 1, this.position.index.y - 2);
        this.moveLoop(1, -2, 1);

        // Left-Top
        // this.checkEmptyOrEnemy(this.position.index.x - 2, this.position.index.y + 1);
        this.moveLoop(-2, 1, 1);
        // Left-Bottom
        // this.checkEmptyOrEnemy(this.position.index.x - 2, this.position.index.y - 1);
        this.moveLoop(-2, -1, 1);
    }
}

class Bishop extends Piece {
    constructor(side, gridX, gridY, moves = []) {
        super("BISHOP", side, gridX, gridY, moves);
    }

    getMoves() {
        this.moves = [];

        // up, right
        this.moveLoop(1, 1);
        // up, left
        this.moveLoop(-1, 1);
        // down, right
        this.moveLoop(1, -1);
        // down, left
        this.moveLoop(-1, -1);
    }
}

class Queen extends Piece {
    constructor(side, gridX, gridY, moves = []) {
        super("QUEEN", side, gridX, gridY, moves);
    }

    getMoves() {
        this.moves = [];

        // up
        this.moveLoop(0, 1);
        // up, right
        this.moveLoop(1, 1);
        // right
        this.moveLoop(1, 0);
        // down, right
        this.moveLoop(1, -1);
        // down
        this.moveLoop(0, -1);
        // down, left
        this.moveLoop(-1, -1);
        // left
        this.moveLoop(-1, 0);
        // up, left
        this.moveLoop(-1, 1);
    }
}

class King extends Piece {
    constructor(side, gridX, gridY, moves = [], potentialAttackers = []) {
        super("KING", side, gridX, gridY, moves);
        this.potentialAttackers = potentialAttackers;
    }

    getMoves() {
        this.moves = [];

        // up
        this.moveLoop(0, 1, 1);
        // up, right
        this.moveLoop(1, 1, 1);
        // right
        this.moveLoop(1, 0, 1);
        // down, right
        this.moveLoop(1, -1, 1);
        // down
        this.moveLoop(0, -1, 1);
        // down, left
        this.moveLoop(-1, -1, 1);
        // left
        this.moveLoop(-1, 0, 1);
        // up, left
        this.moveLoop(-1, 1, 1);

        this.checkLoop();
    }

    checkLoop() {
        this.getPotentialAttackers();


        this.checkedBy = [];
        for (let piece of this.potentialAttackers)
            for (let move of piece.moves)
                if (move.x == this.position.index.x && move.y == this.position.index.y)
                    this.checkedBy.push(piece);
        board.check = this.checkedBy.length ? this : false;
    }

    getPotentialAttackers() {
        this.potentialAttackers = [];
        for (var x = -1; x <= 1; x++)
            for (var y = -1; y <= 1; y++) {
                this.loopIncrement(x, y, (posX, posY) => {
                    let statePos = board.state[posX][posY];
                    if (statePos != Null && statePos.side.name != this.side.name)
                        this.potentialAttackers.push(statePos);
                })

            }
    }

}