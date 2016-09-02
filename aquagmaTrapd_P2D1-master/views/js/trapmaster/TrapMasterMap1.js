var TrapMasterMap1 = function(game){

};


var goldText;

var trapTimer;
var trapTimerText;
var runnerReadyFirst = false;

var trapperMusic1;

var trapCoord = new Array(2500);

var HEALTH = 0;
var INVENTORY;

TrapMasterMap1.prototype = {
	preload: function(){ 

		//Preloads map 1 tiles and map from the assets folders
	    this.game.load.tilemap('tilemap', 'assets/maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
	    this.game.load.image('tiles', 'assets/tilesets/map1_tiles.png');
		this.game.load.image('trapTiles', 'assets/tilesets/trap_tiles.png');
		
		//Preload images for the toolbar
		this.game.load.image('ToolBar', 'assets/TrapToolBar.png');
		this.game.load.image('Minimize', 'assets/buttons/ZoomOut.png');
		this.game.load.image('Maximize', 'assets/buttons/ZoomIn.png');

		this.game.load.audio('TrapMasterSong1', 'assets/music/fur_elise.ogg');
		
		//Preload images for buttons
		this.game.load.image('MapDone', 'assets/buttons/mapDone.png');
		this.game.load.image('Spikes', 'assets/buttons/spikes.png');
		this.game.load.image('Mud', 'assets/buttons/mud.png');
		this.game.load.image('Net', 'assets/buttons/net.png');
		this.game.load.image('Barbwire', 'assets/buttons/barbwire.png');
		this.game.load.image('Poison-dart', 'assets/buttons/poisondart.png');
		this.game.load.image('Selected', 'assets/buttons/Selected.png');
	},
	
	//Creates the game size and aligns it within the game
	//window appropriately 
	create: function() {

		//TIMER
		this.trapTimer = game.time.create(false);	//CHANGED ALL OF THESE FROM SELECTTIMER
	    this.trapTimer.loop(1000, this.updateTime, this);
	    this.trapTimer.start();
	    //Put server in charge of game time
        socket.emit('timerStart', {startTime: trapSetTime});
		
		//Pop-up text style
		this.style = { font: "bold 12px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

		//music
		trapperMusic1 = game.add.audio('TrapMasterSong1');
	 	trapperMusic1.loopFull();
		
		//Boolean vars to determine which trap is being placed.
		var spikePlacing = false;
		var mudPlacing = false;
		var netPlacing = false;
		var wirePlacing = false;
		var dartPlacing = false;

		this.game.scale.setGameSize(1200,800);
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.scale.refresh();

	
		//Set size boundaries for the game
		this.game.world.setBounds(0,0,1600,1600);
		
		//Start the Physics systems
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.game.physics.p2.setImpactEvents(true);
		
		this.game.physics.p2.defaultRestitution = 0.8;

		//Change the background colour
		//this.game.stage.backgroundColor = "#a9f0ff";

		//Add the tilemap and tileset image. The first parameter in addTilesetImage
		//is the name you gave the tilesheet when importing it into Tiled, the second
		//is the key to the asset in Phaser
	    this.map = this.game.add.tilemap('tilemap');
	    this.map.addTilesetImage('map1_tiles', 'tiles');
		this.map.addTilesetImage('trap_tiles', 'trapTiles');

		
	    //Add both the background and ground layers. We won't be doing anything with the
	    //GroundLayer though
	    this.backgroundLayer = this.map.createLayer('Wall');
	    this.groundLayer = this.map.createLayer('Tile Layer 1');
		this.trapLayer = this.map.createLayer('Traps');
		
		this.currentTile = this.map.getTile(0, 0, this.groundLayer);
		this.currentTrapTile = this.map.getTile(0, 0, this.groundLayer);
		
		//Change the world size to match the size of this layer
		this.backgroundLayer.resizeWorld();
		
		//List of all tiles that the player collides with.
		this.map.setCollisionBetween(67, 73, true, 'Wall');
		this.map.setCollisionBetween(457, 458, true, 'Wall');
		this.map.setCollisionBetween(485, 486, true, 'Wall');
		this.map.setCollisionBetween(488, 489, true, 'Wall');
		this.map.setCollisionBetween(513, 515, true, 'Wall');
		this.map.setCollisionBetween(517, 520, true, 'Wall');
		
		//Makes the Tiled map into a collision based map.
		this.game.physics.p2.convertTilemap(this.map, this.backgroundLayer);
		//this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		
		
		
		//Toolbar
		this.toolbar = this.game.add.sprite(this.game.width/5, this.game.height*.83, 'ToolBar');
		this.toolbar.scale.setTo(0.15,0.15);
		this.toolbar.fixedToCamera = true;
		
		//Minimize Button
		this.minimizeButton = this.game.add.button((this.toolbar.x + this.toolbar.width) - 32, this.toolbar.y - 32, 'Minimize', this.minimize, this, 2, 1, 0);
		this.minimizeButton.width = 32;
		this.minimizeButton.height = 32;
		this.minimizeButton.fixedToCamera = true;
		
		//Maximize Button
		this.maximizeButton = this.game.add.button((this.toolbar.x + this.toolbar.width) - 32, this.game.height - 32, 'Maximize', this.maximize, this, 2, 1, 0);
		this.maximizeButton.width = 32;
		this.maximizeButton.height = 32;
		this.maximizeButton.fixedToCamera = true;
		this.maximizeButton.exists = false;
		
		//Spike Button
		this.spikeButton = this.game.add.button(this.toolbar.x + 10, this.toolbar.y + 15, 'Spikes', this.spikeSelect, this, 2, 1, 0);
		this.spikeButton.scale.setTo(0.69,0.72);
		this.spikeButton.fixedToCamera = true;
			//Spike Hovertext
		this.spikeButton.onInputOver.add(this.overSpike, this);
		this.spikeButton.onInputOut.add(this.outSpike, this);
		
		//Selected-Trap
		this.selected = this.game.add.sprite(this.spikeButton.x, this.spikeButton.y, 'Selected');
		this.selected.scale.setTo(0.115,0.0868);
		this.selected.exists = false;
		
		//Mud Button
		this.mudButton = this.game.add.button(this.toolbar.x + 165, this.toolbar.y + 15, 'Mud', this.mudSelect, this, 2, 1, 0);
		this.mudButton.scale.setTo(0.69,0.82);
		this.mudButton.fixedToCamera = true;
			//Mud Hovertext
		this.mudButton.onInputOver.add(this.overMud, this);
		this.mudButton.onInputOut.add(this.outMud, this);
		
		//Net Button
		this.netButton = this.game.add.button(this.toolbar.x + 320, this.toolbar.y + 15, 'Net', this.netSelect, this, 2, 1, 0);
		this.netButton.scale.setTo(0.69,0.67);
		this.netButton.fixedToCamera = true;
			//Net Hovertext
		this.netButton.onInputOver.add(this.overNet, this);
		this.netButton.onInputOut.add(this.outNet, this);
		
		//Wire Button
		this.wireButton = this.game.add.button(this.toolbar.x + 475, this.toolbar.y + 15, 'Barbwire', this.wireSelect, this, 2, 1, 0);
		this.wireButton.scale.setTo(0.70,2.425);
		this.wireButton.fixedToCamera = true;
			//Wire Hovertext
		this.wireButton.onInputOver.add(this.overWire, this);
		this.wireButton.onInputOut.add(this.outWire, this);
		
		//Dart Button
		this.dartButton = this.game.add.button(this.toolbar.x + 630, this.toolbar.y + 15, 'Poison-dart', this.dartSelect, this, 2, 1, 0);
		this.dartButton.scale.setTo(0.71,0.57);
		this.dartButton.fixedToCamera = true;
			//Dart Hovertext
		this.dartButton.onInputOver.add(this.overDart, this);
		this.dartButton.onInputOut.add(this.outDart, this);
		
		//mapDone Button
		this.mapDoneButton = this.game.add.button(this.game.width - 128, this.game.height - 64, 'MapDone', this.mapDone, this, 2, 1, 0);
		this.mapDoneButton.width = 128;
		this.mapDoneButton.height = 64;
		this.mapDoneButton.fixedToCamera = true;
		
		//Square Marker for trap placement
		this.marker = this.game.add.sprite(this.game.input.mousePointer.x-12, this.game.input.mousePointer.y-12, 'Selected');
		this.marker.width = 32;
		this.marker.height = 32;
		this.marker.exists = false;
		
		//Takes keyboard inputs for the game
		this.cursors = game.input.keyboard.createCursorKeys();
		
		this.game.input.onDown.add(this.mouseClick, this);
		
		this.goldText = this.game.add.text(this.game.width *.7, 0, "Gold: " + trapperStartGold, {
			font: "70px Arial",
			fill: "#d4af37",
	    	stroke: "#000000",
	    	strokeThickness: "3"
		});

		//trapSetTime is made in TrapMasterMapSelect
		this.trapTimerText = this.game.add.text(this.game.width *.4, 0, Math.floor(trapSetTime/60) + ":" + (trapSetTime%60), {
	        font: "100px Arial",
	        fill: "#d4af37",
	    	stroke: "#000000",
	    	strokeThickness: "3"
    	});
		
		this.goldText.bringToTop();
		this.trapTimerText.bringToTop();
		this.trapTimerText.fixedToCamera = true;
	},

	updateTime: function(){
		socket.emit('timerTick');
		socket.on('timerTock', function(time){
			trapSetTime = time;
		});
	},
	
	minimize: function() {
		this.toolbar.exists = false;
		this.selected.exists = false;
		this.spikeButton.exists = false;
		this.mudButton.exists = false;
		this.netButton.exists = false;
		this.wireButton.exists = false;
		this.dartButton.exists = false;
		this.minimizeButton.exists = false;
		this.maximizeButton.exists = true;
	},
	
	maximize: function() {
		this.toolbar.exists = true;
		this.selected.exists = true;
		this.spikeButton.exists = true;
		this.mudButton.exists = true;
		this.netButton.exists = true;
		this.wireButton.exists = true;
		this.dartButton.exists = true;
		this.minimizeButton.exists = true;
		this.maximizeButton.exists = false;
	},
	
	spikeSelect: function() {
		this.mudPlacing = false;
		this.netPlacing = false;
		this.wirePlacing = false;
		this.dartPlacing = false;
		this.selected.kill();
		this.selected = this.game.add.sprite(this.spikeButton.x, this.spikeButton.y, 'Selected');
		this.selected.scale.setTo(0.115,0.0868);
		this.spikePlacing = true;
		this.marker.exists = true;
		this.marker.bringToTop();
	},
	
	//Shows Hovertext for Spike
	overSpike: function() {
		this.spikeBox = game.add.graphics();
		this.spikeBox.beginFill(0x000000, 0.6);
		this.spikeBox.drawRect(this.toolbar.x + 10, this.toolbar.y - 100, 150, 100);
		this.spikeText = game.add.text(this.toolbar.x +10, this.toolbar.y - 100, "", this.style);
		this.spikeText.setTextBounds(this.spikeText.x , this.spikeText.y, 150, 100);
		this.spikeText.setText("Spikes \nCost: 75 \nVisible: NO \nDescription: \nDeals 1 Heart of Damage.");
		this.spikeText.bringToTop();
	},
		//Removes Hovertext for Spike
	outSpike: function() {
		this.spikeBox.destroy();
		this.spikeText.destroy();
	},
	
	mudSelect: function() {
		this.spikePlacing = false;
		this.netPlacing = false;
		this.wirePlacing = false;
		this.dartPlacing = false;
		this.selected.kill();
		this.selected = this.game.add.sprite(this.spikeButton.x + 155, this.spikeButton.y, 'Selected');
		this.selected.scale.setTo(0.115,0.0868);
		this.mudPlacing = true;
		this.marker.exists = true;
		this.marker.bringToTop();
	},
	//Shows Hovertext for Mud
	overMud: function() {
		this.mudBox = game.add.graphics();
		this.mudBox.beginFill(0x000000, 0.6);
		this.mudBox.drawRect(this.toolbar.x + 165, this.toolbar.y - 100, 150, 100);
		this.mudText = game.add.text(this.toolbar.x + 165, this.toolbar.y - 100, "", this.style);
		this.mudText.setTextBounds(this.mudText.x , this.mudText.y, 150, 100);
		this.mudText.setText("Mud \nCost: 10 \nVisible: YES \nDescription: \nSlow player for 5 seconds.");
		this.mudText.bringToTop();
	},
		//Removes Hovertext for Mud
	outMud: function() {
		this.mudBox.destroy();
		this.mudText.destroy();
	},
	
	netSelect: function() {
		this.spikePlacing = false;
		this.mudPlacing = false;
		this.wirePlacing = false;
		this.dartPlacing = false;
		this.selected.kill();
		this.selected = this.game.add.sprite(this.spikeButton.x + 310, this.spikeButton.y, 'Selected');
		this.selected.scale.setTo(0.115,0.0868);
		this.netPlacing = true;
		this.marker.exists = true;
		this.marker.bringToTop();
	},
	//Shows Hovertext for Net
	overNet: function() {
		this.netBox = game.add.graphics();
		this.netBox.beginFill(0x000000, 0.6);
		this.netBox.drawRect(this.toolbar.x + 320, this.toolbar.y - 100, 150, 100);
		this.netText = game.add.text(this.toolbar.x + 320, this.toolbar.y - 100, "", this.style);
		this.netText.setTextBounds(this.netText.x , this.netText.y, 150, 100);
		this.netText.setText("Net \nCost: 50 \nVisible: NO \nDescription: \nStop player for 5 seconds.");
		this.netText.bringToTop();
	},
		//Remove Hovertext for Net
	outNet: function() {
		this.netBox.destroy();
		this.netText.destroy();
	},
	
	wireSelect: function() {
		this.spikePlacing = false;
		this.mudPlacing = false;
		this.netPlacing = false;
		this.dartPlacing = false;
		this.selected.kill();
		this.selected = this.game.add.sprite(this.spikeButton.x + 465, this.spikeButton.y, 'Selected');
		this.selected.scale.setTo(0.115,0.0868);
		this.wirePlacing = true;
		this.marker.exists = true;
		this.marker.bringToTop();
	},
	//Shows Hovertext for Wire
	overWire: function() {
		this.wireBox = game.add.graphics();
		this.wireBox.beginFill(0x000000, 0.6);
		this.wireBox.drawRect(this.toolbar.x + 475, this.toolbar.y - 100, 150, 100);
		this.wireText = game.add.text(this.toolbar.x + 475, this.toolbar.y - 100, "", this.style);
		this.wireText.setTextBounds(this.wireText.x , this.wireText.y, 150, 100);
		this.wireText.setText("Barbed Wire \nCost: 25 \nVisible: YES \nDescription: \nDeals 1/2 heart of damage.");
		this.wireText.bringToTop();
	},
		//Removes Hovertext for Wire
	outWire: function() {
		this.wireBox.destroy();
		this.wireText.destroy();
	},

	dartSelect: function() {
		this.spikePlacing = false;
		this.mudPlacing = false;
		this.netPlacing = false;
		this.wirePlacing = false;
		this.selected.kill();
		this.selected = this.game.add.sprite(this.spikeButton.x + 620, this.spikeButton.y, 'Selected');
		this.selected.scale.setTo(0.115,0.0868);
		this.dartPlacing = true;
		this.marker.exists = true;
		this.marker.bringToTop();
	},
	//Shows Hovertext for Dart
	overDart: function() {
		this.dartBox = game.add.graphics();
		this.dartBox.beginFill(0x000000, 0.6);
		this.dartBox.drawRect(this.toolbar.x + 630, this.toolbar.y - 100, 150, 100);
		this.dartText = game.add.text(this.toolbar.x + 630, this.toolbar.y - 100, "", this.style);
		this.dartText.setTextBounds(this.dartText.x , this.dartText.y, 150, 100);
		this.dartText.setText("Poison dart \nCost: 50 \nVisible: NO \nDescription: \nDeals 1/2 heart of damage.");
		this.dartText.bringToTop();
	},
	
	outDart: function() {
		this.dartBox.destroy();
		this.dartText.destroy();
	},

	
	mouseClick: function() {
		if(this.map.hasTile(this.trapLayer.getTileX(this.marker.x), this.trapLayer.getTileY(this.marker.y), this.trapLayer)) {
			this.currentTrapTile = this.map.getTile(this.trapLayer.getTileX(this.marker.x), this.trapLayer.getTileY(this.marker.y), this.trapLayer);
		}
		
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
			if(this.currentTile.index==4) {
				if(trapperStartGold < 1000 && this.currentTrapTile.index == 901){
					trapperStartGold += 75;
					this.map.putTile(820, this.trapLayer.getTileX(this.marker.x), this.trapLayer.getTileY(this.marker.y), this.trapLayer);
				}
				else if(trapperStartGold < 1000 && this.currentTrapTile.index == 902){
					trapperStartGold += 10;
					this.map.putTile(820, this.trapLayer.getTileX(this.marker.x), this.trapLayer.getTileY(this.marker.y), this.trapLayer);
				}
				else if(trapperStartGold < 1000 && this.currentTrapTile.index == 903){
					trapperStartGold += 50;
					this.map.putTile(820, this.trapLayer.getTileX(this.marker.x), this.trapLayer.getTileY(this.marker.y), this.trapLayer);
				}
				else if(trapperStartGold < 1000 && this.currentTrapTile.index == 904){
					trapperStartGold += 25;
					this.map.putTile(820, this.trapLayer.getTileX(this.marker.x), this.trapLayer.getTileY(this.marker.y), this.trapLayer);
				}
				else if(trapperStartGold < 1000 && this.currentTrapTile.index == 905){
					trapperStartGold += 50;
					this.map.putTile(820, this.trapLayer.getTileX(this.marker.x), this.trapLayer.getTileY(this.marker.y), this.trapLayer);
				}
			}
		}
		
		else {	
			if((this.game.input.activePointer.worldY >= this.minimizeButton.y) && (this.game.input.activePointer.worldY <= this.minimizeButton.y + this.minimizeButton.height) && (this.game.input.activePointer.worldX >= this.minimizeButton.x) && (this.game.input.activePointer.worldX <= this.minimizeButton.x + this.minimizeButton.width)) {}
			
			else if((this.game.input.activePointer.worldY >= this.maximizeButton.y) && (this.game.input.activePointer.worldY <= this.maximizeButton.y + this.maximizeButton.height) && (this.game.input.activePointer.worldX >= this.maximizeButton.x) && (this.game.input.activePointer.worldX <= this.maximizeButton.x + this.maximizeButton.width)) {}
			
			else if((this.game.input.activePointer.worldY >= this.mapDoneButton.y) && (this.game.input.activePointer.worldY <= this.mapDoneButton.y + this.mapDoneButton.height) && (this.game.input.activePointer.worldX >= this.mapDoneButton.x) && (this.game.input.activePointer.worldX <= this.mapDoneButton.x + this.mapDoneButton.width)) {}
			
			else if((this.toolbar.exists == true) &&(this.game.input.activePointer.worldY >= this.toolbar.y && this.game.input.activePointer.worldX >= this.toolbar.x && this.game.input.activePointer.worldX <= this.toolbar.x + this.toolbar.width && this.game.input.activePointer.worldY <= this.toolbar.y + this.toolbar.height)) {}
			
			else {
				
				if(this.spikePlacing == true && trapperStartGold >= 75){
					if(this.currentTile.index == 4 && this.currentTrapTile.index != 901){
						trapperStartGold -= 75;
						this.map.putTile(901, this.trapLayer.getTileX(this.marker.x), this.trapLayer.getTileY(this.marker.y), this.trapLayer);
					}
					else {
						this.currentTrapTile = this.map.getTile(0, 0, this.groundLayer);
					}
				}

				else if(this.mudPlacing == true && trapperStartGold >= 10){
					if(this.currentTile.index == 4 && this.currentTrapTile.index != 902){
						trapperStartGold -= 10;
						this.map.putTile(902, this.trapLayer.getTileX(this.marker.x), this.trapLayer.getTileY(this.marker.y), this.trapLayer);
					}
					else {
						this.currentTrapTile = this.map.getTile(0, 0, this.groundLayer);
					}
				}

				else if(this.netPlacing == true && trapperStartGold >= 50){
					if(this.currentTile.index == 4 && this.currentTrapTile.index != 903){
						trapperStartGold -= 50;
						this.map.putTile(903, this.trapLayer.getTileX(this.marker.x), this.trapLayer.getTileY(this.marker.y), this.trapLayer);
					}
					else {
						this.currentTrapTile = this.map.getTile(0, 0, this.groundLayer);
					}
				}

				else if(this.wirePlacing == true && trapperStartGold >= 25){
					if(this.currentTile.index == 4 && this.currentTrapTile.index != 904){
						trapperStartGold -= 25;
						this.map.putTile(904, this.trapLayer.getTileX(this.marker.x), this.trapLayer.getTileY(this.marker.y), this.trapLayer);
					}
					else {
						this.currentTrapTile = this.map.getTile(0, 0, this.groundLayer);
					}
				}

				else if(this.dartPlacing == true && trapperStartGold >= 50){
					if(this.currentTile.index == 4 && this.currentTrapTile.index != 905){
						trapperStartGold -= 50;
						this.map.putTile(905, this.trapLayer.getTileX(this.marker.x), this.trapLayer.getTileY(this.marker.y), this.trapLayer);
					}
					else {
						this.currentTrapTile = this.map.getTile(0, 0, this.groundLayer);
					}
				}

			}
				
			//TODO: other else if statements for the other traps
		}
	},
	
	mapDone: function() {
		var i = 0;
		var tiles = this.trapLayer.getTiles(0, 0, 1600, 1600);
		//var trapCoord = new Array(2500);
		var str;
		for(var y = 0; y < 1600; y+=32) {
			for(var x = 0; x < 1600; x+=32) {
				if(tiles[i].index == 901) {
					str = tiles[i].index;
				}
				else if(tiles[i].index == 902) {
					str = tiles[i].index;
				}
				else if(tiles[i].index == 903) {
					str = tiles[i].index;
				}
				else if(tiles[i].index == 904) {
					str = tiles[i].index;
				}
				else if(tiles[i].index == 905) {
					str = tiles[i].index;
				}
				else {
					str = '0';
				}
				trapCoord[i] = str;
				//console.log('Coordinates: ' + trapCoord[i]); //Sanity Check
				++i;
			}
		}
		
		var tileMapInfo = {mapNumber: 1, newMap: trapCoord};
		console.log('Map Number is: ' + tileMapInfo.mapNumber);
		console.log('Total Number of Tiles: ' + tileMapInfo.newMap.length);
		
		socket.emit('trapperReady', tileMapInfo);
		if(runnerReadyFirst){
			this.game.state.start('SpectateMap1');
		}
		else{
			this.game.state.start('TrapMasterLoading');
		}
		//this.game.state.start('TrapMasterLoading');//TEMPORARY
	},
	
	
	update: function() {
		
		this.goldText.text = "Gold: " + trapperStartGold;

		if(trapSetTime%60<10)
			this.trapTimerText.text = Math.floor(trapSetTime/60) + ":0" + (trapSetTime%60);
		else
			this.trapTimerText.text = Math.floor(trapSetTime/60) + ":" + (trapSetTime%60);
		
		if(this.toolbar.exists == true) {
			if(this.game.input.activePointer.worldY <= this.toolbar.y || this.game.input.activePointer.worldX <=this.toolbar.x || this.game.input.activePointer.worldX >= this.toolbar.x + this.toolbar.width) {
				this.marker.x = this.groundLayer.getTileX(this.game.input.activePointer.worldX) * 32;
				this.marker.y = this.groundLayer.getTileY(this.game.input.activePointer.worldY) * 32;
				this.currentTile = this.map.getTile(this.groundLayer.getTileX(this.marker.x), this.groundLayer.getTileY(this.marker.y), this.groundLayer);
			}
		}
		else {
			this.marker.x = this.groundLayer.getTileX(this.game.input.activePointer.worldX) * 32;
			this.marker.y = this.groundLayer.getTileY(this.game.input.activePointer.worldY) * 32;
			this.currentTile = this.map.getTile(this.groundLayer.getTileX(this.marker.x), this.groundLayer.getTileY(this.marker.y), this.groundLayer);
		}
		
		
		
		//If the player presses the up arrow
		if(this.cursors.up.isDown||this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {	
			if(this.game.camera.y > 0)
			{
				this.game.camera.y -= 5;
				this.selected.y -=5;
				this.goldText.y -=5;
			}
	    }

	    //If the player presses the down arrow
		else if(this.cursors.down.isDown||this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
			
			if(this.game.camera.y < this.game.height)
			{
				this.game.camera.y += 5;
				this.selected.y +=5;
				this.goldText.y +=5;
			}
		}

		//If the player presses the right arrow
		else if(this.cursors.right.isDown||this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
			if(this.game.camera.x < this.game.width-800)
			{
				this.game.camera.x += 5;
				this.selected.x +=5;
				this.goldText.x +=5;
			}
		}
		
		//If the player presses the left arrow
		else if(this.cursors.left.isDown||this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
			if(this.game.camera.x > 0)
			{
				this.game.camera.x -= 5;
				this.selected.x -=5;
				this.goldText.x -=5;
			}
		}
		
		socket.on('otherPlayerReady', function(runnerInfo) {
			INVENTORY = runnerInfo.INVENTORY;
			HEALTH = runnerInfo.HEALTH;
			runnerReadyFirst = true;
		});
		
	},
};