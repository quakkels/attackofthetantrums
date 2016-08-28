var Player = function (addEntityFunc, sprite, loseFunc) {

	var self = this;

	this.health = 5;

	this.addEntity = addEntityFunc;
	this.loseGame = loseFunc;
	this.width = 32;
	this.height = 32;
	this.x = 0;
	this.y = 0;
	this.xVelocity = 0;
	this.yVelocity = 0;
	this.maxVelocity = 8;
	this.acceleration = 1;

	this.isLeft = false;
	this.isRight = false;
	this.isUp = false;
	this.isDown = false;

	this.image = sprite;

	this.isSoft = false;
	this.softStateTimer = 0;
	this.countdownToSolid = 60;
	this.isHidden = false;

	this.bulletCount = 1;

	this.keyCodes = {
		down : 40,
		up : 38,
		left : 37,
		right : 39,
		space : 32,
		z : 90
	};

	this.isDestroyable = false;
};

Player.prototype.setYVelocity = function(yVal) {

	this.yVelocity = yVal;
};

Player.prototype.setXVelocity = function(xVal) {

	this.xVelocity = xVal;
};

Player.prototype.setX = function(x) { 

	this.x = x;
};

Player.prototype.setY = function(y) { 

	this.y = y;
};

Player.prototype.keyDownHandler = function(keyCode) {

	if (keyCode === this.keyCodes.space ||
		keyCode === this.keyCodes.z) {

		this.shoot();
	}

	if (keyCode === this.keyCodes.down) {
		this.isDown = true;
		this.isUp = false;
	}

	if (keyCode === this.keyCodes.up) {
		this.isUp = true;
		this.isDown = false;
	}

	if (keyCode === this.keyCodes.left) {
		this.isLeft = true;
		this.isRight = false;
	}

	if (keyCode === this.keyCodes.right) {
		this.isRight = true;
		this.isLeft = false;
	}
};

Player.prototype.keyUpHandler = function(keyCode) {
	
	if (keyCode === this.keyCodes.down) {
		this.isDown = false;
	}

	if (keyCode === this.keyCodes.up) {
		this.isUp = false;
	}

	if (keyCode === this.keyCodes.left) {
		this.isLeft = false;
	}

	if (keyCode === this.keyCodes.right) {
		this.isRight = false;
	}
};

Player.prototype.updateVelocity = function() {

	// moving down
	if (this.isDown) {
		this.yVelocity += this.acceleration;

		if (this.yVelocity > this.maxVelocity) {
			this.yVelocity = this.maxVelocity;
		}
	}
	else if (this.yVelocity > 0 && this.isUp == false) {
		this.yVelocity -= this.acceleration;
		if(this.yVelocity < 0) {
			this.yVelocity = 0;
		}
	}

	// moving up
	if (this.isUp) {
		this.yVelocity -= this.acceleration;

		if(this.yVelocity < (-this.maxVelocity)) {
			this.yVelocity = -this.maxVelocity;
		}
	}
	else if (this.yVelocity < 0 && this.isDown == false) {
		this.yVelocity += this.acceleration;
		if (this.yVelocity > 0) {
			this.yVelocity = 0;
		}
	}

	// moving left
	if (this.isLeft) {
		this.xVelocity -= this.acceleration;

		if(this.xVelocity < (-this.maxVelocity)) {
			this.xVelocity = -this.maxVelocity;
		}
	}
	else if (this.xVelocity < 0 && this.isRight == false) {
		this.xVelocity += this.acceleration;
		if (this.xVelocity > 0) {
			this.xVelocity = 0;
		}
	}

	// moving right
	if (this.isRight) {
		this.xVelocity += this.acceleration;

		if (this.xVelocity > this.maxVelocity) {
			this.xVelocity = this.maxVelocity;
		}
	}
	else if (this.xVelocity > 0 && this.isLeft == false) {
		this.xVelocity -= this.acceleration;
		if(this.xVelocity < 0) {
			this.xVelocity = 0;
		}
	}
};

Player.prototype.restrictMapBounds = function (map) {

	if (this.x + this.width > map.viewPort.width) {
		this.x = map.viewPort.width - this.width;
		this.xVelocity = 0;
	}

	if (this.x < 0) {
		this.x = 0;
		this.xVelocity = 0;
	}

	if (this.y < 0) {
		this.y = 0;
		this.yVelocity = 0;
	}

	if (this.y + this.height > map.viewPort.height) {
		this.y = map.viewPort.height - this.height;
		this.yVelocity = 0;
	}
};

Player.prototype.update = function(map) {

	this.updateVelocity();
	this.x += this.xVelocity;
	this.y += this.yVelocity;

	this.restrictMapBounds(map);

	if (this.softStateTimer > 0) {
		this.softStateTimer -= 1;
	}

	this.isSoft = this.softStateTimer > 0;
};

Player.prototype.draw = function(context) {

	if (this.softStateTimer > 0) {
		if (this.softStateTimer % 3 !== 0) {
			return;
		}
	}
	
	context.drawImage(this.image, this.x, this.y, this.width, this.height);
};

Player.prototype.hasCollided = function () {

	if (this.softStateTimer > 0) {
		return;
	}

	this.softStateTimer = this.countdownToSolid;
	this.health -= 1;
	this.nerfGun();

	if (this.health === 0) {
		this.isDestroyable = true;
		this.loseGame([
			"You scored " + Game.score + " points before you fell",
			"to the tantrums. DON'T GIVE UP.",
			"You MUST survive the onslaught!!!"]);
	}
};

Player.prototype.destroyMe = function() {
	
	if (this.isDestroyable === false) {
		return false;
	}

	return true;
};

Player.prototype.buffGun = function () {
	this.bulletCount += 1;
	//if (this.bulletCount > 12) {
	//	this.bulletCount = 6;
	//}
}

Player.prototype.nerfGun = function () {

	this.bulletCount -= 1;
	if (this.bulletCount < 1) {
		this.bulletCount = 1;
	}
}

Player.prototype.shoot = function(){

	var width = 8;
	var startX = Math.floor(
		this.x + 
		(this.width/2) - 
		((this.bulletCount * width) / 2));
	//console.log("startX: " + startX);
	//console.log("bullet count:" + this.bulletCount);
	for (var i = 0; i < this.bulletCount; i++) {
		var proj = new Projectile(Game.bulletSprite);
		proj.x = startX;
		proj.y = this.y - proj.height;
		this.addEntity(proj);
		startX += width;
	}
}