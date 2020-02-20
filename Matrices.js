function matrixMultiply(a, b) {
    
    var res = [];

    var n = a[0].length;
    var m = a.length;
    var p = b[0].length;

    for (var i = 0; i < m; i++) {
        var arr = [];
        for (var j = 0; j < p; j++) {
            arr.push(0);
        }
        res.push(arr);
    }

    for(var i = 0; i < m; i++) {
        for(var j = 0; j < p; j++) {
            for(var k = 0; k < n; k++) {
                res[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return res;
}

function transpose(a) {
    var res = [];
    for (var i = 0; i < a.length; i++) {
        res[i] = [a[i]];
    }
    return res;
}

function applySigmoid(a) {

    var res = [];

    // We know that res will be a n * 1 matrix
    for (var i = 0; i < a.length; i++) {
        res.push([1 / (1 + Math.pow(Math.E, a[i][0] * (-1)))]);
    }

    return res;
}

function mutate(a) {
    var res = [];
    for (var i = 0; i < a.length; i++) {
        res.push([]);
        for (var j = 0; j < a[0].length; j++) {
            if (Math.random() < 0.5) {
                res[i][j] = a[i][j] + (Math.random() - 0.5);
            }
        }
    }
    return res;
}

function averageMatrices(a, b) {
    var res = [];
    for (var i = 0; i < a.length; i++) {
        res.push([]);
        for (var j = 0; j < a[0].length; j++) {
            res[i][j] = (a[i][j] + b[i][j]) / 2;
        }
    }
    return res;
}

function crossover(a, b) {
    var res1 = [];
    var res2 = [];

    for (var i = 0; i < a.length; i++) {
        var x = [];
        var y = [];
        for (var j = 0; j < a[0].length; j++) {
            if (Math.random() < 0.5) {
                x.push(a[i][j]);
                y.push(b[i][j]);
            } else {
                x.push(b[i][j]);
                y.push(a[i][j]);
            }
        }
        res1.push(x);
        res2.push(y);
    }

    return [res1, res2];
}