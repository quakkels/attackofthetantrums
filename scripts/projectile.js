var Projectile = function(sprite) {

	this.width = 4;
	this.height = 10;
	this.x = 0;
	this.y = 0;
	this.xVelocity = 0;
	this.yVelocity = -11;
	this.image = sprite;

	this.isDestroyable = false;
}

Projectile.prototype.update = function(map) {
	
	this.y += this.yVelocity;

	if (this.y + this.height < 0 ) {
		this.isDestroyable = true;
	}
};

Projectile.prototype.draw = function(context) {
	//context.fillStyle = '#000';
	//context.fillRect(this.x, this.y, this.width, this.height);
	context.drawImage(this.image, this.x, this.y, this.width, this.height);
};

Projectile.prototype.hasCollided = function () {
	this.isDestroyable = true;
}

Projectile.prototype.destroyMe = function() {
	return this.isDestroyable;
};
