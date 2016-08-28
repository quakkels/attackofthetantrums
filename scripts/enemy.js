var Enemy = function(map, sprite, addScoreFunc, addEntityFunc) {
	this.width = 46;
	this.height = 60;
	this.mapHalfY = map.viewPort.height / 2;
	this.x = Math.floor(Math.random() * (map.viewPort.width + 1 - this.width));
	this.y = -this.height*2;
	this.xVelocity = 0;
	this.yVelocity = 3;

	this.image = sprite;

	this.isDestroyable = false;
	this.value = 3;

	this.addScore = addScoreFunc;
	this.addEntity = addEntityFunc;

	this.venom = null;
	this.hasVenom = false;

	this.isFriendly = false;

	if (Math.floor(Math.random() * 2) == 1) {
		
		this.hasVenom = true;

		this.venomCountdownTop = 60;
		this.venomCountdownBottom = 45;
		this.venomCountdownTimer = 0;
		this.resetVenomTimer();
	}
};

Enemy.prototype.update = function(map) {
	this.x += this.xVelocity;
	this.y += this.yVelocity;

	if (map.viewPort.height < this.y) {
		this.isDestroyable = true;
	}
	
	if (this.venom === null && this.hasVenom == true) {

		this.venomCountdownTimer--;
		if (this.venomCountdownTimer <= 0) {

			var proj = new Projectile(Game.venomSprite);
			proj.width = 16;
			proj.height = 32;
			proj.x = this.x + (this.width / 2);
			proj.y = this.y + this.height;
			proj.yVelocity = 7;
			this.venom = proj;

			this.resetVenomTimer();
		}
	}

	this.updateVenom(map);
};

Enemy.prototype.draw = function(context) {
	// context.fillStyle = '#c00';
	// context.fillRect(this.x, this.y, this.width, this.height);
	context.drawImage(this.image, this.x, this.y, this.width, this.height);

	if (this.venom !== null) {
		this.venom.draw(context);
	}
};

Enemy.prototype.updateVenom = function(map) {

	if (this.venom === null ) {
		return;
	}

	this.venom.update(map);

	if (this.venom.y > map.viewPort.height + this.venom.height) {
		this.venom = null;
		return;
	}

	var venomRect = Game.getRect(this.venom);
	var playerRect = Game.getRect(Game.entities[0]);
	var hasCollided = Game.isCollision(venomRect, playerRect);

	if (hasCollided) {

		Game.entities[0].hasCollided();
	}
};

Enemy.prototype.hasCollided = function () {
	
	if (this.hasVenom === true) {

		var powerup = new Powerup(Game.powerupSprite);
		powerup.x = this.x;
		powerup.y = this.y;
		this.addEntity(powerup);
	}

	this.addScore(this.value);
	this.isDestroyable = true;
};

Enemy.prototype.destroyMe = function() {
	return this.isDestroyable;
};

Enemy.prototype.resetVenomTimer = function() {

	this.venomCountdownTimer = Math.floor(Math.random() * this.venomCountdownTop);

	if (this.venomCountdownTimer < this.venomCountdownBottom) {
		this.venomCountdownTimer = this.venomCountdownBottom;
	}
};