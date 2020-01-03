class Pawn extends Piece {

    constructor(side, gridX, gridY) {
        super("PAWN", side, gridX, gridY);
        this.startingPosition = {
            x: gridX,
            y: gridY,
            index: {
                x: gridX - 1,
                y: gridY - 1
            }
        }
    }

    getMoves() {
        let moves = [];

        let yDir = board.sides[0] == this.side ? 1 : -1;
        let yStep = this.position.index.y + yDir;

        // Forward
        if (!board.checkPosition(this.position.index.x, yStep) && board.state[this.position.index.x][yStep] !== undefined)
            moves.push({ x: this.position.index.x, y: yStep });

        // Two-step
        if (!this.moved && !board.checkPosition(this.position.index.x, yStep) && !board.checkPosition(this.position.index.x, yStep + yDir))
            moves.push({ x: this.position.index.x, y: yStep + yDir });

        // Capture Left
        if (board.checkPosition(this.position.index.x - 1, yStep) && board.state[this.position.index.x - 1][yStep].side != this.side)
            moves.push({ x: this.position.index.x - 1, y: yStep });

        // Capture Right
        if (board.checkPosition(this.position.index.x + 1, yStep) && board.state[this.position.index.x + 1][yStep].side != this.side)
            moves.push({ x: this.position.index.x + 1, y: yStep });


        this.moves = moves;
    }


}