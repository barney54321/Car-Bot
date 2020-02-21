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

function shuffle(array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

}

function regenerate() {
    gen++;

    var newGen = [];

    cars.sort((a, b) => b.lifeTime - a.lifeTime);

    // Prev gen - orange
    // Mutants - light blue
    // Averages - purple
    // New - green
          
    for (var i = 0; i < 15; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.who = cars[i].who;
        addition.wih = cars[i].wih;

        addition.fillColour = "#fcba03";

        newGen.push(addition);
    }

    for (var i = -12; i < 13; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.who = mutate(cars[0].who, i * 2);
        addition.wih = mutate(cars[0].wih, i * 2);

        addition.fillColour = "#03fcf4";

        newGen.push(addition);
    }

    for (var i = 0; i < 15; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.who = mutate(cars[1].who, i * 2);
        addition.wih = mutate(cars[1].wih, i * 2);

        addition.fillColour = "#03fcf4";

        newGen.push(addition);
    }

    for (var i = 0; i < 15; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.who = mutate(cars[2].who, i * 2);
        addition.wih = mutate(cars[2].wih, i * 2);

        addition.fillColour = "#03fcf4";

        newGen.push(addition);
    }

    for (var i = 1; i < 11; i++) {
        var addition = new Car(ctx, cvs, road);

        addition.fillColour = "#7b03fc";

        addition.who = averageMatrices(cars[0].who, cars[i].who);
        addition.wih = averageMatrices(cars[0].wih, cars[i].wih);

        newGen.push(addition);
    }

    for (var i = 0; i < 20; i++) {
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