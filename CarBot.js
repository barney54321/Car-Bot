var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

var road = new Road(ctx, cvs);
var car = new Car(ctx, cvs, road);

function move(e) {

    var keyCode = e.keyCode;

    if (keyCode == 37) {
        car.turnLeft(true);
    } else {
        car.turnRight(true);
    }

}

function stop(e) {
    var keyCode = e.keyCode;

    if (keyCode == 37) {
        car.turnLeft(false);
    } else {
        car.turnRight(false);
    }
}

document.addEventListener("keydown", move);
document.addEventListener("keyup", stop);


function runner() {

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    ctx.fillStyle = "#737475";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    car.tick();

    road.draw();
    car.draw();

    requestAnimationFrame(runner);
}

runner();