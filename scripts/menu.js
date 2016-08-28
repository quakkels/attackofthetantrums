var Menu = function (msg) {
	
	this.lineHeight = 32;
	this.menuLines = [];
	if (msg !== undefined) {
		msg = [].concat(msg);
		for (var i = 0; i < msg.length; i++) {
			this.writeLine(msg[i]);
		}

    	this.writeLine();
	}

    this.writeLine('ESC: Quit');
    this.writeLine('P: Pause');
    this.writeLine('Arrows: Move');
    this.writeLine('Space/Z: Shoot');
    this.writeLine();
    this.writeLine('Press "enter" key to start');
};

Menu.prototype.update = function() {
};

Menu.prototype.draw = function(context) {
	context.font = "Bold 40px Sans-Serif";
    context.fillStyle = "rgba(176,0,0,1.00)";
    context.fillText(
		"Attack of the Tantrums!", 
		48, 
		144);

	context.font = "Bold 24px Sans-Serif";
    context.fillStyle = "rgba(0,0,0,1.0)";

    for (var i = 0; i < this.menuLines.length; i++) {
		context.fillText(
			this.menuLines[i].message, 
			this.menuLines[i].x, 
			this.menuLines[i].y);
	}
};

Menu.prototype.keyDownHandler = function(keyCode) {

	if (keyCode === 13 /*Enter key*/) {
		if (Game.entities[0] instanceof Player === false) {
			Game.spawnPlayer();
		}
		Game.state.changeState(Game.state.availableStates.playing, Game.entities[0]);
	}
};

Menu.prototype.keyUpHandler = function (keyCode) { };

Menu.prototype.writeLine = function (msg) {

	var yPos = (1 + this.menuLines.length) * this.lineHeight + 168;
	var messageText = '';
	if (msg !== undefined && 
		msg.length !== 0) {
		messageText = msg;
	}
	this.menuLines.push( { x : 48, y : yPos, message : messageText } );
};