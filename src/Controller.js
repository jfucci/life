/*global $:true, document:true, life:true, _:true, window:true*/
(function() {
	"use strict";

	$(document).ready(function() {
		new life.Controller();
	});

	life.Controller = function() {
		var setup = {
			gridSize: 100
		};
		//#of millis to delay between steps
		//this.stepDelay = 50;

		this.model = new life.Model(setup);
		this.view = new life.View(this.model);
		this.interval = null;

		$("#percentAlive").slider({max:1, min:0, step:0.01, value:0.25});

		$('#random').click(_.bind(function() {
			this.resetInterval();
			this.model.percentAlive = $("#percentAlive").slider("value");
			this.view.started = false;
			this.model.setupRandom();
			this.view.update();
		}, this));

		$("#mode").buttonset();
		$("#mode").css('width', '500px').buttonset();

		$('input:radio[name=mode]').click(_.bind(function() {
  			this.model.mode = $('input:radio[name=mode]:checked').attr('id');
  			this.model.chooseMode();
		}, this));

		$("#time").slider({max:500, min:25, step:25, value:50,
			stop: _.bind(function() {
				this.stepDelay = $("#time").slider("value");
				console.log(this.stepDelay);
				if(this.interval !== null) {
					this.resetInterval();
					this.interval = window.setInterval(_.bind(this.step, this), this.stepDelay);
				}
			}, this)
		});

		$('#start').click(_.bind(function() {
			this.view.started = true;
			if(this.interval === null) {
				this.interval = window.setInterval(_.bind(this.step, this), this.stepDelay);
			}
		}, this));

		$('#step').click(_.bind(function() {
			this.resetInterval();
			this.view.started = true;
			this.model.step();
			this.view.update();
			this.view.started = false;
		}, this));

		$('#clear').click(_.bind(function() {
			this.resetInterval();
			this.view.started = false;
			this.model.restart();
			this.view.update();
		}, this));

		//disable double click selection
		$(document).bind('mousedown.disableTextSelect', function() {
			return false;
		});

		//initialize
		this.model.restart();
		this.view.update();
	};

	life.Controller.prototype.step = function() {
		this.model.step();
		this.view.update();
		if(!this.model.isRunning()) {
			window.clearInterval(this.interval);
			this.interval = null;
		}
	};

	life.Controller.prototype.resetInterval = function() {
		window.clearInterval(this.interval);
		this.interval = null;
	}

}());