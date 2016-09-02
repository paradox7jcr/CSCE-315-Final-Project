var MazeRunnerLoading = function(game){};

var mapNumber;
var runnerStartGold;
var runnerTime;


var trapd = this;

MazeRunnerLoading.prototype = {
	
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
		
		waitText = this.game.add.text(this.game.world.width/2 - (1150), this.game.world.height/2 - (270), "Waiting on other player to finish.", {
	        font: "150px Arial",
	        fill: "#d4af37"
    	});
	},

	setEventHandlers: function() {
		socket.on('trapMapDone', function(mapInfo){
			LAYERARRAY = mapInfo.newMap;
			console.log('Number of tiles: ' + LAYERARRAY.length);
			console.log('MazeRunnerMap: ' + mapInfo.mapNumber);
			if(mapInfo.mapNumber==1) trapd.game.state.start("MazeRunnerMap1");
			else if(mapInfo.mapNumber==2) trapd.game.state.start("MazeRunnerMap2");
			else if(mapInfo.mapNumber==3) trapd.game.state.start("MazeRunnerMap3");
			trapd.prepMusic.stop();
		});
	},

};