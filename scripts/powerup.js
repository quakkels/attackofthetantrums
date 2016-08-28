var Powerup = function(sprite) {

	this.width = 16;
	this.height = 16;
	this.x = 0;
	this.y = 0;
	this.xVelocity = 0;
	this.yVelocity = 0;
	this.image = sprite;
	
	this.isSoft = false;
	this.isFriendly = true;
	this.isDestroyable = false;
}

Powerup.prototype.update = function(map) {
	
	this.y += this.yVelocity;

	if (this.y + this.height < 0 ) {
		this.isDestroyable = true;
	}
};

Powerup.prototype.draw = function(context) {
	//context.fillStyle = '#0f0';
	//context.fillRect(this.x, this.y, this.width, this.height);
	context.drawImage(this.image, this.x, this.y, this.width, this.height);
};

Powerup.prototype.hasCollided = function (isPlayerCollision) {
	
	if (isPlayerCollision) {

		Game.addToScore(5);
		Game.entities[0].buffGun();
	}
	
	this.isDestroyable = true;
}

Powerup.prototype.destroyMe = function() {
	return this.isDestroyable;
};
