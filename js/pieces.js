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
            this.addMove(this.position.index.x, yStep);

        // Two-step
        if (!this.moved && !board.checkPositionIsOccupied(this.position.index.x, yStep) && !board.checkPositionIsOccupied(this.position.index.x, yStep + yDir))
            this.addMove(this.position.index.x, yStep + yDir);

        // Capture Left
        if (board.checkPositionIsOccupied(this.position.index.x - 1, yStep) && board.state[this.position.index.x - 1][yStep].side.name != this.side.name)
            this.addMove(this.position.index.x - 1, yStep);

        // Capture Right
        if (board.checkPositionIsOccupied(this.position.index.x + 1, yStep) && board.state[this.position.index.x + 1][yStep].side.name != this.side.name)
            this.addMove(this.position.index.x + 1, yStep);
    }


}

class Rook extends Piece {
    constructor(side, gridX, gridY, moves = []) {
        super("ROOK", side, gridX, gridY, moves);
    }

    getMoves() {
        this.moves = [];


        for (let x = -1; x <= 1; x++)
            if (x != 0)
                this.moveLoop(x, 0);
            else
                for (let y = -1; y <= 1; y += 2)
                    this.moveLoop(x, y);

    }
}

class Knight extends Piece {
    constructor(side, gridX, gridY, moves = []) {
        super("KNIGHT", side, gridX, gridY, moves);
    }

    getMoves() {
        this.moves = [];

        for (let x = -2; x <= 2; x++)
            if (x != 0)
                if (x % 2 == 0) {
                    for (let y = -1; y <= 1; y++)
                        if (y != 0)
                            this.moveLoop(x, y, 1);
                }
                else
                    for (let y = -2; y <= 2; y++)
                        if (y % 2 == 0 && y != -0)
                            this.moveLoop(x, y, 1);
    }
}

class Bishop extends Piece {
    constructor(side, gridX, gridY, moves = []) {
        super("BISHOP", side, gridX, gridY, moves);
    }

    getMoves() {
        this.moves = [];

        for (let x = -1; x <= 1; x += 2)
            for (let y = -1; y <= 1; y += 2)
                this.moveLoop(x, y);
    }
}

class Queen extends Piece {
    constructor(side, gridX, gridY, moves = []) {
        super("QUEEN", side, gridX, gridY, moves);
    }

    getMoves() {
        this.moves = [];

        for (let x = -1; x <= 1; x++)
            for (let y = -1; y <= 1; y++)
                this.moveLoop(x, y);
    }
}

class King extends Piece {
    constructor(side, gridX, gridY, moves = [], potentialAttackers = []) {
        super("KING", side, gridX, gridY, moves);
        this.potentialAttackers = potentialAttackers;
    }

    getMoves() {
        this.moves = [];

        for (let x = -1; x <= 1; x++)
            for (let y = -1; y <= 1; y++)
                this.moveLoop(x, y, 1);

        this.checkLoop();
    }

    checkLoop() {
        this.getPotentialAttackers();


        this.checkedBy = [];
        for (let piece of this.potentialAttackers) {
            piece.getMoves();
            for (let move of piece.moves)
                if (move.x == this.position.index.x && move.y == this.position.index.y)
                    this.checkedBy.push(piece);
        }

        // Perform checkLoop() for each King
        let check = Null;
        for (let king of getPiecesOfType("KING")) {
            if (king.checkedBy && king.checkedBy.length)
                check = king;
        }
        board.check = check;

    }

    getPotentialAttackers() {
        this.potentialAttackers = [];

        // Cardinal & ordinal directions
        for (let x = -1; x <= 1; x++)
            for (let y = -1; y <= 1; y++) {
                // console.log(`checking: ${x}, ${y}`)
                this.loopIncrementAttackers(x, y);
            }


        // Knight
        for (let x = -2; x <= 2; x++)
            if (x != 0)
                if (x % 2 == 0) {
                    for (let y = -1; y <= 1; y++)
                        if (y != 0)
                            this.loopIncrementAttackers(x, y, 1);
                }
                else
                    for (let y = -2; y <= 2; y++)
                        if (y % 2 == 0 && y != -0)
                            this.loopIncrementAttackers(x, y, 1);

    }

    loopIncrementAttackers(x, y, n = 0) {
        this.loopIncrement(x, y, (posX, posY) => {
            let statePos = board.state[posX][posY];
            if (statePos != Null && statePos.side.name != this.side.name && statePos.type != this.type)
                this.potentialAttackers.push(statePos);
        }, n)
    }

}