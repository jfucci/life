/*global _:true, life:true, $:true */
(function() {
	"use strict";

	life.View = function(model) {
		this.model = model;
		this.canvas = $("#canvas");

		//resize canvas to correct height
		var canvas_wrap = $("#canvas_wrap");
		var height = canvas_wrap.innerHeight() - 20;
		this.canvas[0].width = height;
		this.canvas[0].height = height;
		canvas_wrap.height(height);

		this.ctx = this.canvas[0].getContext("2d");

		var width = this.canvas.width();

		this.ctx.scale(width, height);

		this.pixel = 1 / width;

		this.canvas.click(_.bind(this._mouseClick, this));
		//this.canvas.mousemove(_.bind(this._mouseMove, this));

		this.cellSize = 1 / this.model.getGridSize();
		this.started = false;
		//this.mouseMode = ""; attempt at click-and-drag; see mouseClick and mouseMove below
	};

	life.View.prototype._mouseClick = function(event) {
		var x = this.getCellXCoordinate(event);
		var y = this.getCellYCoordinate(event);
		/* attempt at click-and-drag
		if(this.model.grid[[x, y]].isAlive) {
			this.mouseMode = "delete";
		} else {
			this.mouseMode = "create";
		}
		 */

		this.model.grid[[x, y]].isAlive = !this.model.grid[[x, y]].isAlive;
		this.model.grid[[x, y]].isAliveNow = !this.model.grid[[x, y]].isAliveNow;

		this.update();
	};

	/*
	 * attempt at a click-and-drag way of creating and deleting squares:
	 *
	life.View.prototype._mouseMove = function(event) {
		var x = this.getCellXCoordinate(event);
		var y = this.getCellYCoordinate(event);
		if(this.mouseMode === "create") {
			this.model.grid[[x, y]].isAlive = true;
			this.model.grid[[x, y]].isAliveNow = true;			
		} else {
			this.model.grid[[x, y]].isAlive = false;
			this.model.grid[[x, y]].isAliveNow = false;	
		}
		this.update();
	};
	 *
	 */

	life.View.prototype.getCellXCoordinate = function(event) {
		var pixelX = event.pageX - this.canvas.offset().left;
		var x = 0;
		if(pixelX < this.canvas.width() && pixelX > 0) {
			var cellWidthInPixels = this.canvas.width() * this.cellSize;
			x = Math.floor(pixelX / cellWidthInPixels); //find the x index of the cell
		}
		return x;
	};

	life.View.prototype.getCellYCoordinate = function(event) {
		var pixelY = event.pageY - this.canvas.offset().top;
		var y = 0;
		if(pixelY < this.canvas.height() && pixelY > 0) {
			var cellHeightInPixels = this.canvas.height() * this.cellSize;
			y = Math.floor(pixelY / cellHeightInPixels); //find the y index of the cell
		}
		return y;
	};

	life.View.prototype.stepStandard = function() {
		_.each(this.model.grid, function(square) {
			if(square.neighbors === 3) {
				square.isAliveNow = true;
			} else if(square.neighbors < 2 || square.neighbors > 3) {
				square.isAliveNow = false;
			} 
		}, this);
	};

	life.View.prototype.stepHigh = function() {
		_.each(this.model.grid, function(square) {
			if(square.neighbors === 3 || square.neighbors === 6) {
				square.isAliveNow = true;
			} else if(square.neighbors < 2 || square.neighbors > 3) {
				square.isAliveNow = false;
			}
		}, this);
	};

	life.View.prototype.stepSeeds = function() {
		_.each(this.model.grid, function(square) {
			square.isAliveNow = false;
			if (!square.isAlive && square.neighbors === 2){	
				square.isAliveNow = true;
			}
		}, this);
	};

	life.View.prototype.stepServiettes = function() {
		_.each(this.model.grid, function(square) {
			square.isAliveNow = false;
			if (!square.isAlive && square.neighbors >= 2 && square.neighbors <= 4){	
				square.isAliveNow = true;
			}
		}, this);
	};

	life.View.prototype.stepGnarl = function() {
		_.each(this.model.grid, function(square) {
			if(square.neighbors === 1) {
				square.isAliveNow = true;
			} else {
				square.isAliveNow = false;
			}
		}, this);
	}

	life.View.prototype.stepLWD = function() {
		_.each(this.model.grid, function(square) {
			if(square.neighbors === 3) {
				square.isAliveNow = true;
			}
		}, this);
	}

	life.View.prototype.stepDN = function() {
		_.each(this.model.grid, function(square) {
			if(square.neighbors === 3 || square.neighbors >= 6) {
				square.isAliveNow = true;
			} else if(square.neighbors < 3 || square.neighbors === 5) {
				square.isAliveNow = false;
			}
		}, this);
	};

	life.View.prototype.step2By2 = function() {
		_.each(this.model.grid, function(square) {
			if(!square.isAlive && (square.neighbors === 3 || square.neighbors === 6)) {
				square.isAliveNow = true;
			} else if(square.neighbors === 0 || (square.neigbors > 3 && square.neighbors !== 5)) {
				square.isAliveNow = false; 
			} 
		}, this);
	};

	life.View.prototype.stepAmoeba = function() {
		_.each(this.model.grid, function(square) {
			if(!square.isAlive && (square.neighbors === 3 || square.neighbors === 5 || square.neighbors === 7)) {
				square.isAliveNow = true;
			} 
			else if((square.neighbors % 2 === 0 && square.neighbors !== 8) || square.neighbors === 7) {
				square.isAliveNow = false; 
			}
		}, this);
	};

	life.View.prototype.stepReplicator = function() {
		_.each(this.model.grid, function(square) {
			if(square.neighbors % 2 === 1) {
				square.isAliveNow = true;
			} else {
				square.isAliveNow = false;
			}
		}, this);
	};

	life.View.prototype.stepMaze = function() {
		_.each(this.model.grid, function(square) {
			if(!square.isAlive && (square.neighbors === 3 || square.neighbors === 7)) {
				square.isAliveNow = true;
			} else if(square.neighbors > 5){
				square.isAliveNow = false;
			}
		}, this);
	};

	life.View.prototype.update = function() {

		var alive = 0;
		var total = 0;

		if(this.started) {
			switch(this.model.mode) {
				case "standard":
					this.stepStandard();
					break;
				case "high":
					this.stepHigh();
					break;
				case "seeds":
					this.stepSeeds();
					break;
				case "serviettes":
					this.stepServiettes();
					break;
				case "gnarl":
					this.stepGnarl();
					break;
				case "lwd":
					this.stepLWD();
					break;
				case "dn":
					this.stepDN();
					break;
				case "2x2":
					this.step2By2();
					break;
				case "amoeba":
					this.stepAmoeba();
					break;
				case "replicator":
					this.stepReplicator();
					break;
				case "maze":
					this.stepMaze();
					break;
			}
		}

		_.each(this.model.grid, function(square) {
			square.isAlive = square.isAliveNow;
			total++;
			var color = "black";
			if(square.isAlive) {
				alive++;
				color = "white";
			}
			this.ctx.fillStyle = color;
			this.ctx.fillRect(square.getX() * this.cellSize, square.getY() * this.cellSize, this.cellSize + this.pixel, this.cellSize + this.pixel);
		}, this);

		$("#generation .value").text(this.model.generation);
		$("#alive .value").text(Math.round((alive / total) * 100));
	};
}());