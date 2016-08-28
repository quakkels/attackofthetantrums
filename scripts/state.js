var State = {

	availableStates : { 
		menu : 0,
		playing : 1,
		paused : 2
	},

	currentState : 0,

	changeState : function (newState, controlEntity) {
		var self = this;
		this.currentState = newState;
		window.onkeydown = function(e) {

			if (e.keyCode === 80) {
				if (self.currentState == self.availableStates.paused) {

					self.currentState = self.availableStates.playing;
				} 
				else if (self.currentState == self.availableStates.playing) {

					self.currentState = self.availableStates.paused;
				}

				return;
			}

			if (e.keyCode === 27) {
				Game.init();
			}

			controlEntity.keyDownHandler(e.keyCode)
		};
		window.onkeyup = function(e) { controlEntity.keyUpHandler(e.keyCode) };
	},
};