var TrapMasterMapSelect = function(game){};

//Variables for starting gold,
//game time, and map
var trapperStartGold;
var runnerStartGold;
var trapSetTime;
var runnerTime;
var mapNumber;
var selectMusic;
TrapMasterMapSelect.prototype = {
	
	preload: function(){ 
		//Pre loads map 1, map 2, and map 3
		this.game.load.image('Map1Image', 'assets/maps/map1.png');
		this.game.load.image('Map2Image', 'assets/maps/map2.png');
		this.game.load.image('Map3Image', 'assets/maps/map3.png');
		
		this.game.load.image('MapSelect', 'assets/new_images/text_images/map_selection_text.png');
		this.game.load.image('Map1Text', 'assets/new_images/text_images/map_1_text.png');
		this.game.load.image('Map2Text', 'assets/new_images/text_images/map_2_text.png');
		this.game.load.image('Map3Text', 'assets/new_images/text_images/map_3_text.png');
		this.game.load.audio('selectMusic', 'assets/music/02_prepTime.mp3');
	},
	//Sets the graphics for the maps in the game window

	create: function(){
		selectMusic = game.add.audio('selectMusic');
		selectMusic.loopFull();

		this.game.stage.backgroundColor = "#28368a";
		this.mapSelection = this.game.add.sprite((this.game.world.width / 5), -50, 'MapSelect');
		this.mapSelection.scale.setTo(4,4);
		
		this.map1Button = this.game.add.button(this.game.world.width / 32, this.game.world.height / 3, 'Map1Image', this.startMap1, this, 2, 1, 0);
		this.map1Button.scale.setTo(0.76, 0.76);
		this.map1Text = this.game.add.sprite(this.game.world.width / 29, this.game.world.height / 4.5, 'Map1Text');
		this.map1Text.scale.setTo(2,2);
		
		this.map2Button = this.game.add.button((this.game.world.width/ 32)*11, this.game.world.height / 3, 'Map2Image', this.startMap2, this, 2, 1, 0);
		this.map2Button.scale.setTo(0.635, 0.77);
		this.map2Text = this.game.add.sprite((this.game.world.width/ 32)*11, this.game.world.height / 4.5, 'Map2Text');
		this.map2Text.scale.setTo(2,2);
		
		this.map3Button = this.game.add.button((this.game.world.width/ 32)*21, this.game.world.height / 3, 'Map3Image', this.startMap3, this, 2, 1, 0);
		this.map3Button.scale.setTo(0.507, 0.507);
		this.map3Text = this.game.add.sprite((this.game.world.width/ 32)*21, this.game.world.height / 4.5, 'Map3Text');
		this.map3Text.scale.setTo(2,2);
	},

	//Selects map 1 with given gold and game time
	//Sends the trap master to the item menu
	startMap1: function(){
		mapNumber = 1;
		trapperStartGold = 1000;
		runnerStartGold = 1000;
		trapSetTime = 120;
		runnerTime = 120;
		this.sendMapInfo();
		selectMusic.stop();
		this.game.state.start("TrapMasterMap1");
	},

	//Selects map 2 with given gold and game time
	//Sends the trap master to the item menu

	startMap2: function() {
		mapNumber = 2;
		trapperStartGold = 1500;
		runnerStartGold = 1500;
		trapSetTime = 180;
		runnerTime = 240;
		this.sendMapInfo();
		selectMusic.stop();
		this.game.state.start("TrapMasterMap2");
	},

	//Selects map 3 with given gold and game time
	//Sends the trap master to the item menu

	startMap3: function() {
		mapNumber = 3;
		trapperStartGold = 1200;
		runnerStartGold = 1200;
		trapSetTime = 120;
		runnerTime = 120;
		this.sendMapInfo();
		selectMusic.stop();
		this.game.state.start("TrapMasterMap3");
	},

	sendMapInfo: function() {
		console.log('Sending map info from trapper');
		console.log('Runner gold should be: ' + runnerStartGold);
		console.log('Map number: ' + mapNumber)
		var mapInfo = {mapNumber: mapNumber, runnerStartGold: runnerStartGold, runnerTime: runnerTime};
		socket.emit('sendMapInfo', mapInfo);
	},

};