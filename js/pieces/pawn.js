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