class Car {
    constructor(ctx, cvs, road) {
        this.ctx = ctx;
        this.cvs = cvs;
        this.road = road;

        this.x = 60;
        this.y = 220;
        this.angle = 0; // Radians
        this.speed = 2;

        this.left = false;
        this.right = false;
        this.changeLeft = true;
        this.changeRight = true;

        this.colliding = false;
        this.alive = true;

        this.disFront = -1;
        this.disLeft = -1;
        this.disRight = -1;
        this.disLeftDiag = -1;
        this.disRightDiag = -1;

        this.lifeTime = 0;
        this.fillColour = "#00ff00";

        this.wih = [];
        this.who = [];

        // From 5 to 10
        for (var i = 0; i < 10; i++) {
            var row = [];
            for (var j = 0; j < 5; j++) {
                row.push(randomNumber(100, -100));
            }
            this.wih.push(row);
        }

        // From 10 to 2
        for (var i = 0; i < 2; i++) {
            var row = [];
            for (var j = 0; j < 10; j++) {
                row.push(randomNumber(100, -100));
            }
            this.who.push(row);
        }
    }

    draw() {

        if (this.colliding) {
            this.ctx.fillStyle = "#ff0000";
        } else {
            this.ctx.fillStyle = this.fillColour;
        }

        // Default values for right or straight
        var start = [this.x, this.y];
        var bottom = bottom = [this.x - 15 * Math.cos(this.angle), this.y + 15 * Math.sin(this.angle)];
        var left = [this.x + 30 * Math.sin(this.angle), this.y + 30 * Math.cos(this.angle)];
        var right = [left[0] + (bottom[0] - start[0]), left[1] + (bottom[1] - start[1])];

        // Flipped horizontally for left
        if (this.left && !this.right) {

            bottom = [this.x + 15 * Math.cos(this.angle), this.y - 15 * Math.sin(this.angle)];
            left = [this.x + 30 * Math.sin(this.angle), this.y + 30 * Math.cos(this.angle)];
            right = [left[0] + (bottom[0] - start[0]), left[1] + (bottom[1] - start[1])];

        } 

        // Draw eyesight underneath
        this.drawFrontLine(start, bottom, left, right);
        this.drawLeftLine(start, bottom, left, right);
        this.drawRightLine(start, bottom, left, right);
        this.drawLeftDiagonal(start, bottom, left, right);
        this.drawRightDiagonal(start, bottom, left, right);

        // Draw box
        this.ctx.beginPath();
        this.ctx.moveTo(start[0], start[1]);
        this.ctx.lineTo(bottom[0], bottom[1]);
        this.ctx.lineTo(right[0], right[1]);
        this.ctx.lineTo(left[0], left[1]);
        this.ctx.lineTo(start[0], start[1]);
        this.ctx.stroke();
        this.ctx.fill();

    }

    drawFrontLine(start, bottom, left, right) {
        // Draw line extending forward
        var midXSB = (start[0] + bottom[0]) / 2;
        var midYSB = (start[1] + bottom[1]) / 2;
        var midXLR = (left[0] + right[0]) / 2;
        var midYLR = (left[1] + right[1]) / 2;

        var gradient = (midYSB - midYLR) / (midXSB - midXLR);
        var dir = 1000;

        if (midXSB < midXLR) {
            dir = -1000;
        }

        var farPointX = midXSB + dir;
        var farPointY = gradient * dir + midYSB;

        if (gradient == -Infinity) {
            farPointY = -1000;
            farPointX = midXSB;
        } else if (gradient == Infinity) {
            farPointY = 1000;
            farPointX = midXSB;
        }

        var closest = this.drawSide(midXSB, midYSB, farPointX, farPointY);

        if (closest != null) {
            ctx.beginPath();
            ctx.arc(closest.x, closest.y, 5, 0, 2 * Math.PI, false);
            ctx.stroke();
            this.disFront = (closest.x - midXSB) * (closest.x - midXSB) + (closest.y - midYSB) * (closest.y - midYSB);
        } else {
            this.disFront = -1;
        }
    }

    drawLeftLine(start, bottom, left, right) {
        var midXSB = (start[0] + bottom[0]) / 2;
        var midYSB = (start[1] + bottom[1]) / 2;
        var midXLR = (left[0] + right[0]) / 2;
        var midYLR = (left[1] + right[1]) / 2;
        var midX = (midXSB + midXLR) / 2;
        var midY = (midYSB + midYLR) / 2;

        var gradient = (start[1] - bottom[1]) / (start[0] - bottom[0]);
        var dir = 1000;

        if (midYSB < midYLR) {
            dir = -1000;
        }

        var farPointX = midX + dir;
        var farPointY = gradient * dir + midY;

        if (gradient == Infinity || gradient == -Infinity) {
            gradient = 0;
            farPointY = midY;
            farPointX = 1000;
        }

        var closest = this.drawSide(midX, midY, farPointX, farPointY);

        if (closest != null) {
            ctx.beginPath();
            ctx.arc(closest.x, closest.y, 5, 0, 2 * Math.PI, false);
            ctx.stroke();
            this.disLeft = (closest.x - midX) * (closest.x - midX) + (closest.y - midY) * (closest.y - midY);
        } else {
            this.disLeft = -1;
        }
    }

    drawRightLine(start, bottom, left, right) {
        var midXSB = (start[0] + bottom[0]) / 2;
        var midYSB = (start[1] + bottom[1]) / 2;
        var midXLR = (left[0] + right[0]) / 2;
        var midYLR = (left[1] + right[1]) / 2;
        var midX = (midXSB + midXLR) / 2;
        var midY = (midYSB + midYLR) / 2;

        var gradient = (start[1] - bottom[1]) / (start[0] - bottom[0]);
        var dir = -1000;

        if (midYSB < midYLR) {
            dir = 1000;
        }

        var farPointX = midX + dir;
        var farPointY = gradient * dir + midY;

        if (gradient == -Infinity || gradient == Infinity) {
            gradient = 0;
            farPointY = midY;
            farPointX = 1000;
        }

        var closest = this.drawSide(midX, midY, farPointX, farPointY);

        if (closest != null) {
            ctx.beginPath();
            ctx.arc(closest.x, closest.y, 5, 0, 2 * Math.PI, false);
            ctx.stroke();
            this.disRight = (closest.x - midX) * (closest.x - midX) + (closest.y - midY) * (closest.y - midY);
        } else {
            this.disRight = -1;
        }
    }

    drawLeftDiagonal(start, bottom, left, right) {

        var pX = bottom[0];
        var pY = bottom[1];

        var gradient = (bottom[1] - left[1]) / (bottom[0] - left[0]);
        var dir = 1000;

        if (this.left) {
            gradient = (start[1] - right[1]) / (start[0] - right[0]);
            pX = start[0];
            pY = start[1];
        }

        if (!this.left && bottom[0] < left[0]) {
            dir = -1000;
        } else if (this.left && start[0] < right[0]) {
            dir = -1000;
        }

        var farPointX = pX + dir;
        var farPointY = gradient * dir + pY;

        if (gradient == -Infinity) {
            gradient = 0;
            farPointY = pY;
            farPointX = 1000;
        } else if (gradient == Infinity) {
            gradient = 0;
            farPointY = pY;
            farPointX = 1000;
        }

        var closest = this.drawSide(pX, pY, farPointX, farPointY);

        if (closest != null) {
            ctx.beginPath();
            ctx.arc(closest.x, closest.y, 5, 0, 2 * Math.PI, false);
            ctx.stroke();
            this.disLeftDiag = (closest.x - pX) * (closest.x - pX) + (closest.y - pY) * (closest.y - pY);
        } else {
            this.disLeftDiag = -1;
        }
    }

    drawRightDiagonal(start, bottom, left, right) {

        var pX = start[0];
        var pY = start[1];

        var gradient = (start[1] - right[1]) / (start[0] - right[0]);
        var dir = 1000;

        if (this.left) {
            gradient = (bottom[1] - left[1]) / (bottom[0] - left[0]);
            pX = bottom[0];
            pY = bottom[1];
        }

        if (!this.left && start[0] < right[0]) {
            dir = -1000;
        } else if (this.left && bottom[0] < left[0]) {
            dir = -1000;
        }

        var farPointX = pX + dir;
        var farPointY = gradient * dir + pY;

        if (gradient == -Infinity) {
            gradient = 0;
            farPointY = pY;
            farPointX = 1000;
        } else if (gradient == Infinity) {
            gradient = 0;
            farPointY = pY;
            farPointX = 1000;
        }

        var closest = this.drawSide(pX, pY, farPointX, farPointY);

        if (closest != null) {
            ctx.beginPath();
            ctx.arc(closest.x, closest.y, 5, 0, 2 * Math.PI, false);
            ctx.stroke();
            this.disRightDiag = (closest.x - pX) * (closest.x - pX) + (closest.y - pY) * (closest.y - pY);
        } else {
            this.disRightDiag = -1;
        }
    }

    drawSide(midX, midY, farPointX, farPointY) {
        this.ctx.beginPath();
        this.ctx.moveTo(midX, midY);
        this.ctx.lineTo(farPointX, farPointY);
        this.ctx.stroke();

        var closest = null;

        for (var i = 0; i < this.road.innerLines.length; i++) {

            var res = null;

            if (i == 0) {
                res = this.getCircle(this.road.innerLines[this.road.innerLines.length - 1], this.road.innerLines[0], midX, midY, farPointX, farPointY);
            } else {
                res = this.getCircle(this.road.innerLines[i - 1], this.road.innerLines[i], midX, midY, farPointX, farPointY);
            }

            if (res == undefined) {
                continue;
            }

            if (closest == null) {
                closest = res;
            } else {

                // Check whether point is closer than current closer
                var disClosest = (closest.x - midX) * (closest.x - midX) + (closest.y - midY) * (closest.y - midY)
                var disRes = (res.x - midX) * (res.x - midX) + (res.y - midY) * (res.y - midY)
                if (disRes < disClosest) {
                    closest = res;
                }
            }
        }

        for (var i = 0; i < this.road.outerlines.length; i++) {

            var res = null;

            if (i == 0) {
                res = this.getCircle(this.road.outerlines[this.road.outerlines.length - 1], this.road.outerlines[0], midX, midY, farPointX, farPointY);
            } else {
                res = this.getCircle(this.road.outerlines[i - 1], this.road.outerlines[i], midX, midY, farPointX, farPointY);
            }

            if (res == undefined) {
                continue;
            }

            if (closest == null) {
                closest = res;
            } else {

                // Check whether point is closer than current closer
                var disClosest = (closest.x - midX) * (closest.x - midX) + (closest.y - midY) * (closest.y - midY)
                var disRes = (res.x - midX) * (res.x - midX) + (res.y - midY) * (res.y - midY)
                if (disRes < disClosest) {
                    closest = res;
                }
            }
        }

        return closest;
    }

    getCircle(line1, line2, midXSB, midYSB, farPointX, farPointY) {
        if (intersects(line1[0], line1[1], line2[0], line2[1], midXSB, midYSB, farPointX, farPointY)) {
            // https://rosettacode.org/wiki/Find_the_intersection_of_two_lines#Java
            var a1 = line2[1] - line1[1];
            var b1 = line1[0] - line2[0];
            var c1 = a1 * line1[0] + b1 * line1[1];

            var a2 = farPointY - midYSB;
            var b2 = midXSB - farPointX;
            var c2 = a2 * midXSB + b2 * midYSB;

            var delta = a1 * b2 - a2 * b1;

            var pX = (b2 * c1 - b1 * c2) / delta;
            var pY = (a1 * c2 - a2 * c1) / delta;

            return {
                x: pX,
                y: pY
            }
        }
    }

    think() {
        var inputs = transpose([this.disFront, this.disLeft, this.disRight, this.disLeftDiag, this.disRightDiag]);
        var hiddenOutput = matrixMultiply(this.wih, inputs);
        var hiddenResult = applySigmoid(hiddenOutput);
        var outputs = matrixMultiply(this.who, hiddenResult);
        var result = applySigmoid(outputs);

        if (result[0][0] > 0.5) {
            this.turnLeft(true);
        } else {
            this.turnLeft(false);
        }

        if (result[1][0] > 0.5) {
            this.turnRight(true);
        } else {
            this.turnRight(false);
        }
    }

    tick() {
        
        this.lifeTime++;

        this.think();

        this.x -= this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);

        if (this.left && !this.right) {

            if (this.changeLeft) {
                this.x = this.x - 15 * Math.cos(this.angle);
                this.y = this.y + 15 * Math.sin(this.angle);
                this.changeLeft = false;
            }

            this.angle += 0.05;
            this.changeRight = true;
        } else if (this.right && !this.left) {

            if (this.changeRight) {
                this.x = this.x + 15 * Math.cos(this.angle);
                this.y = this.y - 15 * Math.sin(this.angle);
                this.changeRight = false;
            }

            this.angle -= 0.05;
            this.changeLeft = true;

        } else {
            if (this.changeRight) {
                this.x = this.x + 15 * Math.cos(this.angle);
                this.y = this.y - 15 * Math.sin(this.angle);
                this.changeRight = false;
            }
        }

        this.checkColliding();
    }

    checkColliding() {

        // Order is start->bottom->right->left->start
        var start = [this.x, this.y];
        var bottom = bottom = [this.x - 15 * Math.cos(this.angle), this.y + 15 * Math.sin(this.angle)];
        var left = [this.x + 30 * Math.sin(this.angle), this.y + 30 * Math.cos(this.angle)];
        var right = [left[0] + (bottom[0] - start[0]), left[1] + (bottom[1] - start[1])];

        // Flipped horizontally for left
        if (this.left && !this.right) {

            bottom = [this.x + 15 * Math.cos(this.angle), this.y - 15 * Math.sin(this.angle)];
            left = [this.x + 30 * Math.sin(this.angle), this.y + 30 * Math.cos(this.angle)];
            right = [left[0] + (bottom[0] - start[0]), left[1] + (bottom[1] - start[1])];

        } 

        var res = false;

        if (this.check(this.road.innerLines, start, bottom, left, right) ||
            this.check(this.road.outerlines, start, bottom, left, right)) {
            res = true;
        }

        this.colliding = res;

        if (this.colliding) {
            this.alive = false;
        }
    }

    check(lines, start, bottom, left, right) {
        var res = false;

        // Go through all lines in track
        for (var i = 1; i < lines.length; i++) {
            if (intersects(start[0], start[1], bottom[0], bottom[1], lines[i - 1][0], lines[i - 1][1], lines[i][0], lines[i][1]) ||
                intersects(right[0], right[1], bottom[0], bottom[1], lines[i - 1][0], lines[i - 1][1], lines[i][0], lines[i][1]) ||
                intersects(right[0], right[1], left[0], left[1], lines[i - 1][0], lines[i - 1][1], lines[i][0], lines[i][1]) ||
                intersects(start[0], start[1], left[0], left[1], lines[i - 1][0], lines[i - 1][1], lines[i][0], lines[i][1])) {
                res = true;
            }
        }

        // Go through line from last vertex to first
        if (intersects(start[0], start[1], bottom[0], bottom[1], lines[lines.length - 1][0], lines[lines.length - 1][1], lines[0][0], lines[0][1]) ||
            intersects(right[0], right[1], bottom[0], bottom[1], lines[lines.length - 1][0], lines[lines.length - 1][1], lines[0][0], lines[0][1]) ||
            intersects(right[0], right[1], left[0], left[1], lines[lines.length - 1][0], lines[lines.length - 1][1], lines[0][0], lines[0][1]) ||
            intersects(start[0], start[1], left[0], left[1], lines[lines.length - 1][0], lines[lines.length - 1][1], lines[0][0], lines[0][1])) {
            res = true;
        }
        
        return res;
    }

    turnLeft(x) {

        this.left = x;
        if (!x) {
            this.changeLeft = true;
        }
    }

    turnRight(x) {
        this.right = x;
    }
}

// Returns true if (a,b)->(c,d) intersects with (p,q)->(r,s)
function intersects(a,b,c,d,p,q,r,s) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
        return false;
    } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
};

// Returns random number in range
function randomNumber(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
}