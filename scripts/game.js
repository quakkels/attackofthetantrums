var Game = {};

Game.canvasIdSelector = '';
Game.state = State;
Game.menu = new Menu();
Game.hud = new Hud();
Game.fps = 60;
Game.tileSize = 32;
Game.entities = [];
Game.pendingEntities = [];

Game.playerSprite = new Image();
Game.bulletSprite = new Image();
Game.venomSprite = new Image();
Game.enemySprite = new Image();
Game.enemy2Sprite = new Image();
Game.powerupSprite = new Image();

Game.enemySpawnRate = 1;
Game.spawnCountdown = 30;
Game.spawnCountdownReset = 30;
Game.score = 0;
Game.areSpawningEnemies = true;

Game.init = function(canvasId) {

	Game.map = new Map(544, 544, Game.over, Game.stopEnemySpawn);
	Game.areSpawningEnemies = true;
	Game.score = 0;
	Game.enemySprite.src = "enemy1.png";
	Game.enemy2Sprite.src = "enemy2.png";
	Game.playerSprite.src = "player.png";
	Game.bulletSprite.src = "bullet.png";
	Game.venomSprite.src = "venom.png";
	Game.powerupSprite.src = "powerup.gif";

	// init game state
	Game.entities = [];
	Game.powerups = [];
	Game.spawnPlayer();
	Game.state.changeState(Game.state.availableStates.menu, Game.menu);

	// init canvas
	if (Game.c === undefined) {
		Game.c = document.getElementById(canvasId).getContext("2d");
	} 

	// create frame event
	Game.createFrameEvent();

	// launch
	window.onEachFrame(Game.run);
};

Game.run = (function() {

	var loops = 0;
	var skipTicks = 1000 / Game.fps;
	var maxFrameSkip = 10;
	var nextGameTick = (new Date).getTime();

	return function() {
		loops = 0;
		while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {

			Game.update(Game.map);

			nextGameTick += skipTicks;
			loops++;
		}

		Game.draw();
	};
})();

Game.spawnPlayer = function () {
	var player = new Player(Game.addPendingEntity, Game.playerSprite, Game.over);
	player.x = 300;
	player.y = 300;
	player.setXVelocity(0);
	player.setYVelocity(0);
	this.entities.unshift(player);
};

Game.addPendingEntity = function(entity) {

	Game.pendingEntities.push(entity);
};

Game.addEntities = function() {

	for(var i = 0; i < Game.pendingEntities.length; i++) {
		Game.entities.push(Game.pendingEntities[i]);
	}
	Game.pendingEntities = [];
};

Game.addToScore = function(val) {

	Game.score += val;
};

Game.updateEntities = function() {

	Game.addEntities();

	// check to see if it's time to spawn a new enemy
	if (Game.areSpawningEnemies) {
		if (Game.spawnCountdown <= 0) {

			var enemy;
			if (Math.floor(Math.random()*2) == 1){
				enemy = new Enemy(
					Game.map, 
					Game.enemySprite, 
					Game.addToScore, 
					Game.addPendingEntity);
			}
			else {
				enemy = new Enemy(
					Game.map, 
					Game.enemy2Sprite, 
					Game.addToScore, 
					Game.addPendingEntity);	
			}
			this.entities.push(enemy);
			Game.spawnCountdown = Math.floor(Math.random() * 
				Game.spawnCountdownReset) + 
				(Game.spawnCountdownReset / 2);

		} else {
			// if it's not time to spawn, update the countdown
			Game.spawnCountdown -= Game.enemySpawnRate;
		}
	}

	// update all entities
	var len = this.entities.length;

	var removeIndexes = [];
	for (var i = 0; i < len; i++) {

		if (this.entities[i] !== undefined) {
			
			if (this.entities[i].destroyMe() === true) {
				removeIndexes.push(i);
				continue;
			}

			this.entities[i].update(Game.map);
		}
	}

	// remove entities
	len = removeIndexes.length;	
	if (len === 1) {
		this.entities.splice(removeIndexes[0], 1);
	}
	else if (len > 1) {
		// remove entities starting with the highest index
		// fixes 'ghost' removal
		removeIndexes = removeIndexes.sort(function(a,b) { 
			return a + b; 
		});
		for (var i = 0; i < len; i++) {
			this.entities.splice(removeIndexes[i], 1);
		}
	}
};

Game.updateCollisions = function() {

	if (this.entities.length <= 0) { return; }

	var collisionIndexes = [];
	for(var i = 0; i < this.entities.length; i++) {
		for(var j = 0; j < this.entities.length; j++) {

			// don't check collision with itself
			if (j === i) { continue; } 

			var jRect = this.getRect(this.entities[j]);
			var iRect = this.getRect(this.entities[i]);
			var collided = this.isCollision(iRect, jRect);

			if (collided) {

				if (i === 0 && this.entities[j].isFriendly) {
					// we're comparing a friendly object with the player
					if (this.entities[j] !== undefined &&
						this.entities[j].hasCollided !== undefined) {
						this.entities[j].hasCollided(true);
					}
					continue;					
				}

				if (j === 0 && this.entities[i].isFriendly) {
					// we're comparing a friendly object with the player
					if (this.entities[i] !== undefined &&
						this.entities[i].hasCollided !== undefined) {
						this.entities[i].hasCollided(true);
					}
					continue;					
				}

				if (this.entities[i] !== undefined &&
					this.entities[i].hasCollided !== undefined) {
					this.entities[i].hasCollided();
				}

				if (this.entities[j] !== undefined &&
					this.entities[j].hasCollided !== undefined) {
					this.entities[j].hasCollided();
				}
			}
		}
	}
};

Game.isCollision = function(rect1, rect2) {

	if (rect1.isSoft || rect2.isSoft) {
		return false;
	}	

	// top right
	var x = rect1.right;
	var y = rect1.top;
	if (x > rect2.left &&
		x < rect2.right &&
		y > rect2.top &&
		y < rect2.bottom) {

		return true;
	}

	// top left
	var x = rect1.left;
	var y = rect1.top;
	if (x > rect2.left &&
		x < rect2.right &&
		y > rect2.top &&
		y < rect2.bottom) {

		return true;
	}
};

Game.getRect = function(entity) {
	
	var thisRect = {
		isSoft : entity.isSoft,
		left : entity.x,
		right : entity.x + entity.width,
		top : entity.y,
		bottom : entity.y + entity.height
	};

	return thisRect;
};

Game.update = function() {

	if (Game.state.currentState === Game.state.availableStates.playing) { 
				
		this.map.update();
		this.updateEntities();
		this.updateCollisions();
		this.hud.update(this.entities[0].health, Game.score); 
	} 
	else if (Game.state.currentState === Game.state.availableStates.menu) {

		Game.menu.update();
	} 
	else if (Game.state.currentState === Game.state.availableStates.paused) {

	}
};

Game.draw = function() {
				
	Game.map.draw(this.c);

	if (Game.state.currentState === Game.state.availableStates.playing
		|| Game.state.currentState === Game.state.availableStates.paused) { 

		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].draw(this.c);
		};

		Game.hud.draw(this.c);
	} 
	else if (Game.state.currentState === Game.state.availableStates.menu) {

		Game.menu.draw(this.c)
	} 

};

// create smooth and efficient animations across browsers
Game.createFrameEvent = function() {

	var onEachFrame;
	
	if (window.requestAnimationFrame) {
		onEachFrame = function(cb) {
			var _cb = function() { 
				cb(); 
				requestAnimationFrame(_cb); 
			}
			_cb();
		};
	}
	else if (window.webkitRequestAnimationFrame) {
		onEachFrame = function(cb) {
			var _cb = function() { 
				cb(); 
				webkitRequestAnimationFrame(_cb); 
			}
			_cb();
		};
	} 
	else if (window.mozRequestAnimationFrame) {
		onEachFrame = function(cb) {
			var _cb = function() { 
				cb(); 
				mozRequestAnimationFrame(_cb); 
			}
			_cb();
		};
	}
	else {
		onEachFrame = function(cb) {
			var _cb = function() { 
				setInterval(cb, 1000 / 60);
			}
		};
	}

	window.onEachFrame = onEachFrame;
};

Game.over = function(msg) {

	Game.menu = undefined;
	Game.menu = new Menu(msg);
	Game.init();
};

Game.stopEnemySpawn = function() {
	Game.areSpawningEnemies = false;
};