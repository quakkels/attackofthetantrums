var Hud = function() {
	this.livesLeft = 0;
}

Hud.prototype.update = function(lives, score) {
	this.livesLeft = lives;
	this.score = score;
}

Hud.prototype.draw = function(context) {
	context.font = "Bold 12px Sans-Serif";
    context.fillStyle = "rgba(176,0,0,1.0)";
    context.fillText('Attack of the Tantrums!', 6, 16);

    context.fillStyle = "rgba(0,0,0,1.0)";
	context.font = "Normal 12px Sans-Serif";
    context.fillText('Health: ' + this.livesLeft, 6, 32);
    context.fillText('Score: ' + this.score, 6, 48);
};