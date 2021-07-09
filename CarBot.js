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

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Fisher Yates
function shuffle(array) {
    for (var i = 0; i < array.length; i++) {
        var temporaryValue = array[i];
        var swap = getRandomArbitrary(i, array.length);
        array[i] = array[swap];
        array[swap] = temporaryValue;
    }

	return array;
}

function regenerate() {
    gen++;

    var newGen = [];

    cars.sort((a, b) => b.lifeTime - a.lifeTime);

    // Prev gen - orange (15)
    // Mutants - light blue (43)
    // Averages - purple (11)
    // New - green (20)
          
    // 15
    for (var i = 0; i < 15; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.who = cars[i].who;
        addition.wih = cars[i].wih;

        addition.fillColour = "#fcba03";

        newGen.push(addition);
    }

    // 27
    for (var i = -12; i < 15; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.who = mutate(cars[0].who, i * 5);
        addition.wih = mutate(cars[0].wih, i * 5);

        addition.fillColour = "#03fcf4";

        newGen.push(addition);
    }

    // 15
    for (var i = 0; i < 15; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.who = mutate(cars[1].who, i * 5);
        addition.wih = mutate(cars[1].wih, i * 5);

        addition.fillColour = "#03fcf4";

        newGen.push(addition);
    }

    // 13
    for (var i = 0; i < 13; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.who = mutate(cars[2].who, i * 5);
        addition.wih = mutate(cars[2].wih, i * 5);

        addition.fillColour = "#03fcf4";

        newGen.push(addition);
    }

    // 20
    for (var i = 1; i < 21; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.fillColour = "#7b03fc";

        addition.who = averageMatrices(cars[0].who, cars[i].who);
        addition.wih = averageMatrices(cars[0].wih, cars[i].wih);

        newGen.push(addition);
    }

    // 10
    for (var i = 0; i < 10; i++) {
        newGen.push(new Car(ctx, cvs, road));
    }

    cars = shuffle(newGen);
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