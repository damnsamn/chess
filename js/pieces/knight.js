class Knight extends Piece {

    constructor(side, gridX, gridY) {
        super("KNIGHT", side, gridX, gridY);
    }

    getMoves() {
        this.moves = [];

        // Top-Left
        this.checkEmptyOrEnemy(this.position.index.x - 1, this.position.index.y + 2);
        // Top-Right
        this.checkEmptyOrEnemy(this.position.index.x + 1, this.position.index.y + 2);

        // Right-Top
        this.checkEmptyOrEnemy(this.position.index.x + 2, this.position.index.y + 1);
        // Right-Bottom
        this.checkEmptyOrEnemy(this.position.index.x + 2, this.position.index.y - 1);

        // Bottom-Left
        this.checkEmptyOrEnemy(this.position.index.x + 1, this.position.index.y - 2);
        // Bottom-Right
        this.checkEmptyOrEnemy(this.position.index.x - 1, this.position.index.y - 2);

        // Left-Top
        this.checkEmptyOrEnemy(this.position.index.x - 2, this.position.index.y + 1);
        // Left-Bottom
        this.checkEmptyOrEnemy(this.position.index.x - 2, this.position.index.y - 1);
    }

    checkEmptyOrEnemy(x, y) {
        if (board.state[x] !== undefined && board.state[x][y] !== undefined && (!board.checkPositionIsOccupied(x, y) || (board.checkPositionIsOccupied(x, y) && board.state[x][y].side.name != this.side.name)))
            if (board.state[x][y] !== undefined)
                this.moves.push({ x: x, y: y });
    }


}