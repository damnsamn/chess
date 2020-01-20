class TextField {

    constructor(label) {
        this.label = label;
        this.width = 0;
        this.value = "This is a value";
    }

    catchClick(func) {
        if (this.hover()) {
            func(this);
        }
    }


    draw(x, y, width, debug = false) {
        this.x = x;
        this.y = y;

        this.fieldX = 0;
        this.fieldY = textSize() * 1.75;
        this.fieldW = width;
        this.fieldH = textSize() * 2;
        let valueSize = textSize() * 0.8;

        this.maxChars = round(this.fieldW / (valueSize * 0.75)) + 1;

        let textBlink = fieldFocus == this && frameCount % 60 < 30 || keyIsPressed ? "_" : "";

        push();
        translate(x, y);
        let focusColor = color(fieldFocus == this ? colors.blue : 0);

        // Label
        textAlign(LEFT, TOP);
        text(this.label, 0, this.width);

        // Box
        translate(this.fieldX, this.fieldY)
        fill(255);
        stroke(lighten(focusColor, 0.4));
        strokeWeight(2);
        rect(0, 0, this.fieldW, this.fieldH, 3);

        // Value
        textAlign(LEFT, CENTER);
        textSize(valueSize);
        fill(darken(focusColor, 0.7));
        noStroke();
        text(this.value + textBlink, textSize() / 1.5, this.fieldH / 2.25);


        pop();


        if (this.hover())
            cursor("text");

    }

    hover() {
        // console.log(`mouseX > this.x: ${round(mouseX)} > ${this.x}`);
        // console.log(`mouseX < this.x + this.fieldW: ${round(mouseX)} < ${this.x + this.fieldW}`);
        // console.log(`mouseY > this.y + this.fieldY: ${round(mouseY)} > ${this.y + this.fieldY}`);
        // console.log(`mouseY < this.y + this.fieldY + this.fieldH: ${round(mouseY)} < ${this.y + this.fieldY + this.fieldH}`);

        return (mouseX > this.x && mouseX < this.x + this.fieldW && mouseY > this.y + this.fieldY && mouseY < this.y + this.fieldY + this.fieldH);
    }

    input(e) {

        // TODO: FIX THIS
        if (e.data) {
            console.log(`fieldFocus.value.length <= fieldFocus.maxChars: ${fieldFocus.value.length} <= ${fieldFocus.maxChars}`)
            if (fieldFocus.value.length <= fieldFocus.maxChars) {
                fieldFocus.value = fieldFocus.value + e.data;
            }
        }

        if (e.key == "Backspace") {
            fieldFocus.value.slice(0, -1);
        }
    }
}

var textFields = {
    newGame: new TextField("Help")
}