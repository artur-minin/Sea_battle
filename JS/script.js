var view = {
    displayMessage : function(message) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = message;
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
}

var model = {
    boardSize: 7,
    numShips: 3,
    shipLenght: 3,
    shipsSunk: 0,
    ships: [ { locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] } ],
    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations))
            this.ships[i].locations = locations;
        }
    },
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var newShipLocations = [];
        var row, col;
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLenght));
        }
        else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLenght))
            col = Math.floor(Math.random() * this.boardSize);
        }
        for (var i = 0; i < this.shipLenght; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            }
            else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },
    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < this.shipLenght; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    },
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayMessage('Hit!');
                view.displayHit(guess);
                if(this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship!');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMessage('Miss!');
        view.displayMiss(guess);
        return false;
    },
    isSunk: function(ship) {
        for (var i = 0; i < this.shipLenght; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    }
}

var controller = {
    guesses: 0,
    processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                alert("You sank all my battleships in " + this.guesses + " shots!");
            }
        }
    }
}

function parseGuess(guess) {
    var alphaBet = ["A", "B", "C", "D", "E", "F", "G"];
    if (guess === null) {
        alert("Oops, please enter number on the board.");
    }
    else {
        firstChar = guess.charAt(0);
        var row = alphaBet.indexOf(firstChar);
        var col = guess.charAt(1);
        if (isNaN(row) || isNaN(col)) {
            alert("Oops, that isn't on the board.");
        }
        else if (row < 0 || row >= model.boardSize || col < 0 || col >= model.boardSize) {
            alert("Oops, that's off the board.");
        }
        else {
            return row + col;
        }
    }
    return null;
}

function init() {
    model.generateShipLocations();
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
}
window.onload = init;
function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if(e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}
function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value.toUpperCase();
    controller.processGuess(guess);
    guessInput.value = "";
}




