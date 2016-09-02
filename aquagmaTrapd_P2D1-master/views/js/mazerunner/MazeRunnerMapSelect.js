var MazeRunnerMapSelect = function(game){};

//Variables for starting gold,
//game time, and map

var startGold;
var gameTime;
var map;
MazeRunnerMapSelect.prototype = {
	//Pre loads map 1 and map 2
	preload: function(){ 
		this.game.load.image('Map1Image', 'assets/maps/map1.png');
		this.game.load.image('Map2Image', 'assets/maps/map2.png');
	},

	//Sets the graphics for the maps in the game window
	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		
		this.game.stage.backgroundColor = "#28368a";
		this.map1Button = this.game.add.button(this.game.world.width / 32, this.game.world.height / 3, 'Map1Image', this.startMap1, this, 2, 1, 0);
		this.map1Button.scale.setTo(0.76, 0.76);
		this.map2Button = this.game.add.button((this.game.world.width/ 32)*11, this.game.world.height / 3, 'Map2Image', this.startMap2, this, 2, 1, 0);
		this.map2Button.scale.setTo(0.635, 0.77);
		this.map3Button = this.game.add.button((this.game.world.width/ 32)*21, this.game.world.height / 3, 'Map1Image', this.startMap3, this, 2, 1, 0);
		this.map3Button.scale.setTo(0.76, 0.76);
	},

	//Selects map 1 with given gold and game time
	//Sends the maze runner to the item menu
	startMap1: function(){
		map = 1;
		startGold = 1500;
		gameTime = 120;
		this.game.state.start("MazeRunnerItems");
	},

	//Selects map 2 with given gold and game time
	//Sends the maze runner to the item menu
	startMap2: function() {
		map = 2;
		startGold = 1500;
		gameTime = 240;
		this.game.state.start("MazeRunnerItems");
	},

	//Selects map 3 with given gold and game time
	//Sends the maze runner to the item menu
	startMap3: function() {
		map = 3;
		startGold = 750;
		gameTime = 1;
		this.game.state.start("MazeRunnerItems");
	},

};