var Loading = function(game){};

var mapNumber;
var runnerStartGold;
var runnerTime;

var trapd = this;

Loading.prototype = {
	
	preload: function(){ 
		this.game.load.spritesheet('Loading', 'assets/new_images/loading_sprite.png', 866, 125, 3);
		this.setEventHandlers();
	},
	
	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.stage.backgroundColor = "#28368a";
		
		sprite = game.add.sprite(this.game.world.width/2 - (662.5), this.game.world.height/2 - (116), 'Loading');
		sprite.scale.setTo(2,2);
		sprite.animations.add('load');
		sprite.animations.play('load', 1, true);
		
		waitText = this.game.add.text(this.game.world.width/2 - (950), this.game.world.height/2 - (270), "Waiting for another Player", {
	        font: "150px Arial",
	        fill: "#d4af37"
    	});

		//this.setEventHandlers();
	},

	setEventHandlers: function() {
		socket.on('MazeRunnerStart', function() {
			console.log('You have been selected as the MazeRunner');
			//trapd.game.state.start("Loading");
				socket.on('receiveMapInfo', function(mapInfo) {
					console.log('Received mapInfo on runner side');
					console.log('Run Time should be: '+ mapInfo.runnerTime);
					console.log('Map number should be: '+ mapInfo.mapNumber);
					trapd.mapNumber = mapInfo.mapNumber;
					trapd.runnerTime = mapInfo.runnerTime;
					trapd.runnerStartGold = mapInfo.runnerStartGold;

					trapd.loadingMusic.stop();

					trapd.game.state.start("MazeRunnerItems");
					});
			});
	
		socket.on('TrapMasterStart', function() {
			console.log('You have been selected as the TrapMaster');
			trapd.loadingMusic.stop();
			trapd.game.state.start("TrapMasterMapSelect");
			});
	},

	update: function(){
		socket.emit('pairPlayers');
	}

};