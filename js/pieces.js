class Pawn extends Piece {
    constructor(side, gridX, gridY) {
        super("PAWN", side, gridX, gridY);
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
    constructor(side, gridX, gridY) {
        super("ROOK", side, gridX, gridY);
    }

    getMoves() {
        this.moves = [];

        // left
        this.checkLoop(-1, 0);
        // right
        this.checkLoop(1, 0);
        // up
        this.checkLoop(0, 1);
        // down
        this.checkLoop(0, -1);

    }
}

class Knight extends Piece {
    constructor(side, gridX, gridY) {
        super("KNIGHT", side, gridX, gridY);
    }

    getMoves() {
        this.moves = [];

        // Top-Left
        // this.checkEmptyOrEnemy(this.position.index.x - 1, this.position.index.y + 2);
        this.checkLoop(-1, 2, 1);
        // Top-Right
        // this.checkEmptyOrEnemy(this.position.index.x + 1, this.position.index.y + 2);
        this.checkLoop(1, 2, 1);

        // Right-Top
        // this.checkEmptyOrEnemy(this.position.index.x + 2, this.position.index.y + 1);
        this.checkLoop(2, 1, 1);
        // Right-Bottom
        // this.checkEmptyOrEnemy(this.position.index.x + 2, this.position.index.y - 1);
        this.checkLoop(2, -1, 1);

        // Bottom-Left
        // this.checkEmptyOrEnemy(this.position.index.x + 1, this.position.index.y - 2);
        this.checkLoop(-1, -2, 1);
        // Bottom-Right
        // this.checkEmptyOrEnemy(this.position.index.x - 1, this.position.index.y - 2);
        this.checkLoop(1, -2, 1);

        // Left-Top
        // this.checkEmptyOrEnemy(this.position.index.x - 2, this.position.index.y + 1);
        this.checkLoop(-2, 1, 1);
        // Left-Bottom
        // this.checkEmptyOrEnemy(this.position.index.x - 2, this.position.index.y - 1);
        this.checkLoop(-2, -1, 1);
    }
}

class Bishop extends Piece {
    constructor(side, gridX, gridY) {
        super("BISHOP", side, gridX, gridY);
    }

    getMoves() {
        this.moves = [];

        // up, right
        this.checkLoop(1, 1);
        // up, left
        this.checkLoop(-1, 1);
        // down, right
        this.checkLoop(1, -1);
        // down, left
        this.checkLoop(-1, -1);
    }
}

class Queen extends Piece {
    constructor(side, gridX, gridY) {
        super("QUEEN", side, gridX, gridY);
    }

    getMoves() {
        this.moves = [];

        // up
        this.checkLoop(0, 1);
        // up, right
        this.checkLoop(1, 1);
        // right
        this.checkLoop(1, 0);
        // down, right
        this.checkLoop(1, -1);
        // down
        this.checkLoop(0, -1);
        // down, left
        this.checkLoop(-1, -1);
        // left
        this.checkLoop(-1, 0);
        // up, left
        this.checkLoop(-1, 1);
    }
}

class King extends Piece {
    constructor(side, gridX, gridY) {
        super("KING", side, gridX, gridY);
    }

    getMoves() {
        this.moves = [];

        // up
        this.checkLoop(0, 1, 1);
        // up, right
        this.checkLoop(1, 1, 1);
        // right
        this.checkLoop(1, 0, 1);
        // down, right
        this.checkLoop(1, -1, 1);
        // down
        this.checkLoop(0, -1, 1);
        // down, left
        this.checkLoop(-1, -1, 1);
        // left
        this.checkLoop(-1, 0, 1);
        // up, left
        this.checkLoop(-1, 1, 1);
    }
}