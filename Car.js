class Car {
    constructor(ctx, cvs, road) {
        this.ctx = ctx;
        this.cvs = cvs;
        this.road = road;
        this.x = 200;
        this.y = 200;

        // Math.PI -> down
        // 0 -> up
        // Math.PI / 2 -> left 
        // -Math.PI / 2 -> right 
        this.angle = 0; // Radians

        this.speed = 2;

        this.left = false;
        this.right = false;

        this.changeLeft = true;
        this.changeRight = true;

        this.colliding = false;
    }

    draw() {
        if (this.colliding) {
            this.ctx.fillStyle = "#ff0000";
        } else {
            this.ctx.fillStyle = "#00ff00";
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

        this.ctx.beginPath();
        this.ctx.moveTo(start[0], start[1]);
        this.ctx.lineTo(bottom[0], bottom[1]);
        this.ctx.lineTo(right[0], right[1]);
        this.ctx.lineTo(left[0], left[1]);
        this.ctx.lineTo(start[0], start[1]);
        this.ctx.stroke();
        this.ctx.fill();

        // Double lines at front
        this.ctx.beginPath();
        this.ctx.moveTo(start[0], start[1]);
        this.ctx.lineTo(bottom[0], bottom[1]);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(start[0], start[1]);
        this.ctx.lineTo(bottom[0], bottom[1]);
        this.ctx.stroke();
    }

    tick() {
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

        if (this.check(this.road.innerLines, start, bottom, left, right)) {
            res = true;
        }

        if (this.check(this.road.outerlines, start, bottom, left, right)) {
            res = true;
        }

        this.colliding = res;
    }

    check(lines, start, bottom, left, right) {
        var res = false;

        for (var i = 1; i < lines.length; i++) {
            if (intersects(start[0], start[1], bottom[0], bottom[1], lines[i - 1][0], lines[i - 1][1], lines[i][0], lines[i][1])) {
                res = true;
            }

            if (intersects(right[0], right[1], bottom[0], bottom[1], lines[i - 1][0], lines[i - 1][1], lines[i][0], lines[i][1])) {
                res = true;
            }

            if (intersects(right[0], right[1], left[0], left[1], lines[i - 1][0], lines[i - 1][1], lines[i][0], lines[i][1])) {
                res = true;
            }

            if (intersects(start[0], start[1], left[0], left[1], lines[i - 1][0], lines[i - 1][1], lines[i][0], lines[i][1])) {
                res = true;
            }
        }

        if (intersects(start[0], start[1], bottom[0], bottom[1], lines[lines.length - 1][0], lines[lines.length - 1][1], lines[0][0], lines[0][1])) {
            res = true;
        }

        if (intersects(right[0], right[1], bottom[0], bottom[1], lines[lines.length - 1][0], lines[lines.length - 1][1], lines[0][0], lines[0][1])) {
            res = true;
        }

        if (intersects(right[0], right[1], left[0], left[1], lines[lines.length - 1][0], lines[lines.length - 1][1], lines[0][0], lines[0][1])) {
            res = true;
        }

        if (intersects(start[0], start[1], left[0], left[1], lines[lines.length - 1][0], lines[lines.length - 1][1], lines[0][0], lines[0][1])) {
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