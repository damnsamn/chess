class Button {
    constructor(drawFunction) {
        this.drawFunction = drawFunction;
    }

    catchClick(func) {
        if (this.hover()) {
            func();
        }
    }

    draw(x, y, width, height = width, debug = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        push();
        translate(this.x, this.y);
        this.drawFunction(0, 0, this);
        if (debug) {
            stroke(255, 0, 0);
            strokeWeight(1);
            noFill();
            rect(0, 0, this.width, this.height);
        }
        pop();

        if (this.hover())
            cursor("pointer");
    }

    hover() {
        if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height)
            return true;
        else
            return false;
    }
}

var buttons = {
    selectWhite: new Button((x, y, self) => {
        setupGlyphStyle(squareSize);
        fill(board.sides[0].color);
        stroke(board.sides[1].color);
        text(glyphs.king, self.width / 2, self.height / 2);
    }),
    selectBlack: new Button((x, y, self) => {
        setupGlyphStyle(squareSize);
        fill(board.sides[1].color);
        stroke(board.sides[0].color);
        text(glyphs.king, self.width / 2, self.height / 2);
    }),
    resetBoard: new Button((x, y, self) => {
        textSize(16);
        fill(colors.red);
        noStroke();
        textAlign(CENTER, CENTER);
        text("RESET BOARD", self.width / 2, self.height / 2);
    })
}