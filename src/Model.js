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
		return true;
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

	life.Model.prototype.setupStandard = function() {
		this.bornConditions = [3];
		this.surviveConditions = [2, 3];
	};

	life.Model.prototype.setupHigh = function() {
		this.bornConditions = [3, 6];
		this.surviveConditions = [2, 3];
	};

	life.Model.prototype.setupSeeds = function() {
		this.bornConditions = [2];
		this.surviveConditions = [];
	};

	life.Model.prototype.setupServiettes = function() {
		this.bornConditions = [2, 3, 4];
		this.surviveConditions = [];
	};

	life.Model.prototype.setupGnarl = function() {
		this.bornConditions = [1];
		this.surviveConditions = [1];
	}

	life.Model.prototype.setupLWD = function() {
		this.bornConditions = [3];
		this.surviveConditions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	}

	life.Model.prototype.setupDN = function() {
		this.bornConditions = [3, 6, 7, 8];
		this.surviveConditions = [3, 4, 6, 7, 8];
	};

	life.Model.prototype.setup2By2 = function() {
		this.bornConditions = [3, 6];
		this.surviveConditions = [1, 2, 5];
	};

	life.Model.prototype.setupAmoeba = function() {
		this.bornConditions = [3, 5, 7];
		this.surviveConditions = [1, 3, 5, 8];
	};

	life.Model.prototype.setupReplicator = function() {
		this.bornConditions = [1, 3, 5, 7];
		this.surviveConditions = [1, 3, 5, 7];
	};

	life.Model.prototype.setupMaze = function() {
		this.bornConditions = [3, 7];
		this.surviveConditions = [1, 2, 3, 4, 5];
	};

	life.Model.prototype.setup34Life = function() {
		this.bornConditions = [3, 4];
		this.surviveConditions = [3, 4];
	};

	life.Model.prototype.chooseMode = function() {
		switch(this.mode) {
			case "standard":
				this.setupStandard(); 
				break;
			case "high":
				this.setupHigh();
				break;
			case "seeds":
				this.setupSeeds();
				break;
			case "serviettes":
				this.setupServiettes();
				break;
			case "gnarl":
				this.setupGnarl();
				break;
			case "lwd":
				this.setupLWD();
				break;
			case "dn":
				this.setupDN();
				break;
			case "2x2":
				this.setup2By2();
				break;
			case "amoeba":
				this.setupAmoeba();
				break;
			case "replicator":
				this.setupReplicator();
				break;
			case "maze":
				this.setupMaze();
				break;
			case "34life":
				this.setup34Life();
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