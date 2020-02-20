var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var genText = document.getElementById("gen");

var road = new Road(ctx, cvs);
var gen = 1;
var cars = [];

function reset() {
    cars = [];

    for (var i = 0; i < 100; i++) {
        cars.push(new Car(ctx, cvs, road));
    }

    gen = 1;
}

function regenerate() {
    gen++;

    var newGen = [];

    cars.sort((a, b) => b.lifeTime - a.lifeTime);
          
    for (var i = 0; i < 40; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.who = cars[i].who;
        addition.wih = cars[i].wih;

        newGen.push(addition);
    }

    for (var i = 0; i < 20; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.who = mutate(cars[0].who);
        addition.wih = mutate(cars[0].wih);

        newGen.push(addition);
    }

    for (var i = 0; i < 10; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.who = mutate(cars[1].who);
        addition.wih = mutate(cars[1].wih);

        newGen.push(addition);
    }

    for (var i = 0; i < 10; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.who = mutate(cars[2].who);
        addition.wih = mutate(cars[2].wih);

        newGen.push(addition);
    }

    for (var i = 0; i < 5; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.who = averageMatrices(cars[0].who, cars[1].who);
        addition.wih = averageMatrices(cars[0].wih, cars[1].wih);

        newGen.push(addition);
    }

    for (var i = 0; i < 1; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.who = averageMatrices(cars[0].who, cars[2].who);
        addition.wih = averageMatrices(cars[0].wih, cars[2].wih);

        newGen.push(addition);
    }

    for (var i = 0; i < 14; i++) {
        newGen.push(new Car(ctx, cvs, road));
    }

    cars = newGen;
}

reset();

function runner() {

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    ctx.fillStyle = "#737475";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    road.draw();

    var alive = 0;

    for (var i = 0; i < cars.length; i++) {
        if (cars[i].alive) {
            cars[i].tick();
            cars[i].draw();
            alive++;
        }
    }

    if (alive == 0) {
        regenerate();
    }

    genText.innerText = "Generation: " + gen;

    requestAnimationFrame(runner);
}

runner();