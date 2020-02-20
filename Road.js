class Road {
    constructor(ctx, cvs) {
        this.ctx = ctx;
        this.cvs = cvs;
        this.outerlines = []
        this.innerLines = []
        this.makeLines();
    }

    makeLines() {

        this.outerlines.push([30, 30]);
        this.outerlines.push([260, 90]);
        this.outerlines.push([560, 40]);
        this.outerlines.push([580, 330]);
        this.outerlines.push([130, 390]);
        this.outerlines.push([40, 240]);

        this.innerLines.push([100, 120]);
        this.innerLines.push([260, 160]);
        this.innerLines.push([500, 120]);
        this.innerLines.push([500, 270]);
        this.innerLines.push([170, 320]);
        this.innerLines.push([100, 220]);

    }

    drawLines(lines, inner) {
        if (!inner) {
            this.ctx.fillStyle = "#878787";
        } else {
            this.ctx.fillStyle = "#737475";
        }

        this.ctx.beginPath();
        this.ctx.moveTo(lines[0][0], lines[0][1]);

        for (var i = 1; i < lines.length; i++) {
            this.ctx.lineTo(lines[i][0], lines[i][1]);
        }

        this.ctx.lineTo(lines[0][0], lines[0][1]);
        this.ctx.stroke();
        this.ctx.fill();
    }

    draw() {

        this.drawLines(this.outerlines, false);
        this.drawLines(this.innerLines, true);

    }
}