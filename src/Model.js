/*global _:true, life:true */
(function() {
	"use strict";

	life.Model = function(setup) {
		this.getGridSize = _.constant(setup.gridSize);
		this.percentAlive = 0.2;
		this.generations = 0;
		var coordinates = _.product(_.repeat(_.range(this.getGridSize()), 2));
		this.grid = {};
		_.each(coordinates, function(coordinate) {
			this.grid[coordinate] = new life.Square(coordinate[0], coordinate[1], this.getGridSize());
		}, this);
		this.generation = 0;
		this.mode = "standard";
		this.bornConditions = [3];
		this.surviveConditions = [2, 3];
	};

	life.Model.prototype.restart = function() {
		this.generation = 0;
		_.each(this.grid, function(square) {
			square.setup();
		}, this);
	};

	life.Model.prototype.setupRandom = function() {
		this.generation = 0;
		_.each(this.grid, function(square) {
			square.setup();
			if(Math.random() < this.percentAlive) {
				square.isAlive = true;
				square.isAliveNow = true;
			}
		}, this);
	};

	life.Model.prototype.isRunning = function() {
		return _.any(this.grid, function(square) {
			return square.isAlive;
		}, this);
	};

	life.Model.prototype.step = function() {
		this.generation++;

		_.each(this.grid, function(square) {
			square.neighbors = 0;
		}, this);

		_.each(this.grid, function(square) {
			if(square.isAlive) {
				this.addNeighbors(square);
			}
		}, this);
	};

	life.Model.prototype.addNeighbors = function(square) {
		_.each(square.neighborArray, function(neighbor) {
			this.grid[neighbor].neighbors++;
		}, this);
	};

	life.Model.prototype.setupMode = function(bornConditions, surviveConditions) {
		this.bornConditions = bornConditions;
		this.surviveConditions = surviveConditions;
	};

	life.Model.prototype.chooseMode = function() {
		switch(this.mode) {
		case "standard":
			this.setupMode([3], [2, 3]);
			break;
		case "high":
			this.setupMode([3, 6], [2, 3]);
			break;
		case "seeds":
			this.setupMode([2], []);
			break;
		case "serviettes":
			this.setupMode([2, 3, 4], []);
			break;
		case "gnarl":
			this.setupMode([1], [1]);
			break;
		case "lwd":
			this.setupMode([3], [0, 1, 2, 3, 4, 5, 6, 7, 8]);
			break;
		case "dn":
			this.setupMode([3, 6, 7, 8], [3, 4, 6, 7, 8]);
			break;
		case "2x2":
			this.setupMode([3, 6], [1, 2, 5]);
			break;
		case "amoeba":
			this.setupMode([3, 5, 7], [1, 3, 5, 8]);
			break;
		case "replicator":
			this.setupMode([1, 3, 5, 7], [1, 3, 5, 7]);
			break;
		case "maze":
			this.setupMode([3, 7], [1, 2, 3, 4, 5]);
			break;
		case "34life":
			this.setupMode([3, 4], [3, 4]);
			break;
		}
	};

	life.Square = function(x, y, gridSize) {
		this.getX = _.constant(x);
		this.getY = _.constant(y);
		this.setup();
		this.neighborArray = [];
		for(var xx = this.getX() - 1; xx <= this.getX() + 1; xx++) {
			for(var yy = this.getY() - 1; yy <= this.getY() + 1; yy++) {
				if(!(xx === this.getX() && yy === this.getY())) {
					var newX = xx;
					var newY = yy;
					if(xx < 0) {
						newX += gridSize;
					} else if(xx >= gridSize) {
						newX = gridSize - xx;
					}
					if(yy < 0) {
						newY += gridSize;
					} else if(yy >= gridSize) {
						newY = gridSize - yy;
					}
					this.neighborArray.push([newX, newY]);
				}
			}
		}
	};

	life.Square.prototype.setup = function() {
		this.isAlive = false;
		this.isAliveNow = false;
		this.neighbors = 0;
	};
}());