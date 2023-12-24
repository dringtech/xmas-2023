const kArray = [];
const borderPadding = 20;
let flakeHeight;
let fitScale = 1;
let topBorder;

function setup() {
    createCanvas(windowWidth, windowHeight);
    const sideLength = 200;
    flakeHeight = 2 * sin(PI/3) * sideLength;
    calcScale();
    frameRate(2);  // Animate slowly
    kArray.push(
        new KochFractal(
            createVector(0, 0),
            createVector(sideLength, flakeHeight)
        )
    );
    kArray.push(
        new KochFractal(
            createVector(sideLength, flakeHeight),
            createVector(-sideLength, flakeHeight)
        )
    );
    kArray.push(
        new KochFractal(
            createVector(-sideLength, flakeHeight),
            createVector(0, 0)
        )
    );
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    calcScale();
}

function calcScale() {
    const maxDimension = flakeHeight * 4 / 3;
    const minScreenDimension = min(width, height) - (2 * borderPadding);
    fitScale = minScreenDimension / maxDimension;
    topBorder = max(borderPadding, (height - width) * 3/4);
}

function draw() {
    clear();
    push();
    translate(windowWidth/2, topBorder);
    scale(fitScale);
    kArray.forEach(k => {
        k.render();
        k.nextLevel();
        if (k.getCount() > 4) k.restart();
    })
    pop();
}

class KochFractal {
    constructor(start, end) {
        this.start = start;
        this.end = end;
        this.lines = [];
        this.restart();
    }

    nextLevel() {
        this.lines = this.iterate(this.lines);
        this.count++;
    }

    restart() {
        this.count = 0;      // Reset count
        this.lines = [];  // Empty the array list
        this.lines.push(new KochLine(this.start, this.end));  // Add the initial line (from one end PVector to the other)
    }

    getCount() {
        return this.count;
    }

    render() {
        this.lines.forEach(l => l.display());
    }

    iterate(before) {
        const now = [];    // Create emtpy list
        for (const l of before) {
            const a = l.start();
            const b = l.kochleft();
            const c = l.kochmiddle();
            const d = l.kochright();
            const e = l.end();
            now.push(new KochLine(a, b));
            now.push(new KochLine(b, c));
            now.push(new KochLine(c, d));
            now.push(new KochLine(d, e));
        }
        return now;
    }
}

class KochLine {
    constructor(start, end) {
        this.a = start.copy();
        this.b = end.copy();
        this.colour = color(251, 72, 196);
    }

    display() {
        stroke(this.colour);
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur = 5;
        drawingContext.shadowColor = this.colour;
        strokeWeight(3);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
        // filter(BLUR, 1); 
        // line(this.a.x, this.a.y, this.b.x, this.b.y);
    }

    start() {
        return this.a.copy();
    }

    end() {
        return this.b.copy();
    }

    // This is easy, just 1/3 of the way
    kochleft() {
        const v = p5.Vector.sub(this.b, this.a);
        v.div(3);
        v.add(this.a);
        return v;
    }

    // More complicated, have to use a little trig to figure out where this PVector is!
    kochmiddle() {
        const v = p5.Vector.sub(this.b, this.a);
        v.div(3);

        const p = this.a.copy();
        p.add(v);

        v.rotate(-radians(60));
        p.add(v);

        return p;
    }

    // Easy, just 2/3 of the way
    kochright() {
        const v = p5.Vector.sub(this.a, this.b);
        v.div(3);
        v.add(this.b);
        return v;
    }
}