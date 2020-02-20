var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var genText = document.getElementById("gen");

var road = new Road(ctx, cvs);
var gen = 0;
var cars = [];

function reset() {
    cars = [];

    for (var i = 0; i < 10; i++) {
        cars.push(new Car(ctx, cvs, road));
    }

    gen++;
}

reset();

function runner() {

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    ctx.fillStyle = "#737475";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    road.draw();

    for (var i = 0; i < cars.length; i++) {
        cars[i].tick();
        cars[i].draw();
    }

    cars = cars.filter((car) => !car.colliding);

    if (cars.length == 0) {
        reset();
    }

    genText.innerText = "Generation: " + gen;

    requestAnimationFrame(runner);
}

runner();