var TrapMasterLoading = function(game){};

var runnerStartGold;
var runnerTime;

var HEALTH = 0;
var trapd = this;

TrapMasterLoading.prototype = {
	
	preload: function(){ 
		this.game.load.spritesheet('Loading', 'assets/new_images/loading_sprite.png', 866, 125, 3);
		this.setEventHandlers();
	},
	
	create: function(){
		this.game.scale.setGameSize(4000,2000);
		
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.stage.backgroundColor = "#28368a";

		
		
		sprite = game.add.sprite(this.game.world.width/2 - (662.5), this.game.world.height/2 - (116), 'Loading');

		sprite.scale.setTo(2,2);
		
		sprite.animations.add('load');

		sprite.animations.play('load', 1, true);
		
		waitText = this.game.add.text(this.game.world.width/2 - (1150), this.game.world.height/2 - (270), "Waiting on other player to finish.", {
	        font: "150px Arial",
	        fill: "#d4af37"
    	});

		
	},

	setEventHandlers: function() {
		
		socket.on('otherPlayerReady', function(runnerInfo) {
			INVENTORY = runnerInfo.INVENTORY;
			HEALTH = runnerInfo.HEALTH;
			console.log('MazeRunnerMap: ' + mapNumber);
			if(mapNumber == 1)
				trapd.game.state.start('SpectateMap1');
			else if(mapNumber == 2)
				trapd.game.state.start('SpectateMap2');
			else if(mapNumber == 3)
				trapd.game.state.start('SpectateMap3');
		});
	},

};