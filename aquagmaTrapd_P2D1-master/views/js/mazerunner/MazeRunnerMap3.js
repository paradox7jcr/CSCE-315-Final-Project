var MazeRunnerMap3 = function(game){

};

//Variables for game time text
//game time, and health sprite
var runnerTimeText;
var runnerTimer;
var runSpeedHolder;

var maxHealth;
var antidoteInventoryText;
var potionInventoryText;

var poisoned;
var poisonCounter;
var poisonTimer;

var map3Music;

var trapCollided = false;


MazeRunnerMap3.prototype = {

//Pre-loads maze runner, health, tile map
//and map sprite sheets (the visuals for
//the game)
preload: function(){ 
		maxHealth = HEALTH;

		this.game.load.spritesheet('person', 'assets/sprites/player_sprite.png', 32, 32);
		this.game.load.physics('person_physics', 'assets/sprites/person_physics.json');

		if(HEALTH == 3)
			this.game.load.spritesheet('health', 'assets/sprites/3HealthSprite.png', 269, 90.5);
		else
			this.game.load.spritesheet('health', 'assets/sprites/4HealthSprite.png', 355, 90.5);

	    this.game.load.tilemap('tilemap', 'assets/maps/map3.json', null, Phaser.Tilemap.TILED_JSON);
	    this.game.load.image('tiles', 'assets/tilesets/map1_tiles.png');
	    this.game.load.image('trapTiles', 'assets/tilesets/trap_tiles.png');

	    this.game.load.image('Potion', 'assets/new_images/store_items/healthpotion_item.png');
		this.game.load.image('Antidote', 'assets/new_images/store_items/antidote_item.png');

		this.game.load.audio('MazeRunnerSong3', 'assets/music/05_map3.mp3');
		
		this.game.load.spritesheet('Spikes', 'assets/sprites/spike_sprite.png', 32, 32);
		this.game.load.image('Mud', 'assets/buttons/newmud.png');
		this.game.load.image('Net', 'assets/buttons/newnet.png');
		this.game.load.image('Wire', 'assets/buttons/newbarbwire.png');
		this.game.load.spritesheet('Gas', 'assets/new_images/poisondart_animation.png', 32, 32);
		this.game.load.image('Dart', 'assets/buttons/newpoisondart.png');
		
		this.game.load.image('Exit', 'assets/buttons/exit.png');
	},
	create: function() {
		game.scale.setGameSize(400,200);

		map3Music = game.add.audio('MazeRunnerSong3');
	  	map3Music.loopFull();
		
		//Start the Physics systems
		game.physics.startSystem(Phaser.Physics.P2JS);
		cursors = game.input.keyboard.createCursorKeys();
		game.physics.p2.setImpactEvents(true);

		//Add the tilemap and tileset image. The first parameter in addTilesetImage
		//is the name you gave the tilesheet when importing it into Tiled, the second
		//is the key to the asset in Phaser
	    map = game.add.tilemap('tilemap');
	    map.addTilesetImage('map1_tiles', 'tiles');
	    map.addTilesetImage('trapTiles', 'trapTiles');

		var spikesCG = game.physics.p2.createCollisionGroup();
		var mudCG = game.physics.p2.createCollisionGroup();
		var netCG = game.physics.p2.createCollisionGroup();
		var wireCG = game.physics.p2.createCollisionGroup();
		var dartCG = game.physics.p2.createCollisionGroup();
		var exitCG = game.physics.p2.createCollisionGroup();
		var playerCG = game.physics.p2.createCollisionGroup();

	    //Add both the background and ground layers. We won't be doing anything with the
	    //GroundLayer though
	    backgroundLayer 	= map.createLayer('background_tiles');
	    mainLayer 			= map.createLayer('collision_tiles');
		trapLayer 			= map.createLayer('trap_tiles');

		traps = game.add.group();  
		traps.enableBody = true;
		traps.physicsBodyType = Phaser.Physics.P2JS;

		var i = 0;
	  for(var y = 0; y < 1600; y += 32) {
		  for(var x = 0; x < 1600; x += 32) {
			  if(LAYERARRAY[i] == 901) {
				  var spike = game.add.sprite(x+16, y+16, 'Spikes');
				  game.physics.p2.enable(spike);
				  spike.body.static = true;
				  spike.animations.add('Hit', [0,1,2,3,4], 15, false);
				  spike.visible = false;
				  traps.add(spike);
				  spike.body.setCollisionGroup(spikesCG);
				  spike.body.collides(playerCG);
				  console.log('Index: ' + LAYERARRAY[i]);
			  }
			  else if(LAYERARRAY[i] == 902) {
				  var mud = game.add.sprite(x+16, y+16, 'Mud');
				  game.physics.p2.enable(mud);
				  mud.body.static = true;
				  traps.add(mud);
				  mud.body.setCollisionGroup(mudCG);
				  mud.body.collides(playerCG);
				  console.log('Index: ' + LAYERARRAY[i]);
				  
			  }
			  else if(LAYERARRAY[i] == 903) {
				  var net = game.add.sprite(x+16, y+16, 'Net');
				  game.physics.p2.enable(net);
				  net.body.static = true;
				  net.visible = false;
				  traps.add(net);
				  net.body.setCollisionGroup(netCG);
				  net.body.collides(playerCG);
				  console.log('Index: ' + LAYERARRAY[i]);
			  }
			  else if(LAYERARRAY[i] == 904) {
				  var wire = game.add.sprite(x+16, y+16, 'Wire');
				  game.physics.p2.enable(wire);
				  wire.body.static = true;
				  traps.add(wire);
				  wire.body.setCollisionGroup(wireCG);
				  wire.body.collides(playerCG);
				  console.log('Index: ' + LAYERARRAY[i]);
			  }
			  else if(LAYERARRAY[i] == 905) {
				  var dart = game.add.sprite(x+16, y+16, 'Dart');
				  game.physics.p2.enable(dart);
				  dart.body.static = true;
				  dart.visible = false;
				  traps.add(dart);
				  dart.body.setCollisionGroup(dartCG);
				  dart.body.collides(playerCG);
				  console.log('Index: ' + LAYERARRAY[i]);
			  }
			  ++i;
		  }
	  }
	  
	  var exit1 = game.add.sprite(64+16, 0+16, 'Exit1');
	  var exit2 = game.add.sprite(96+16, 0+16, 'Exit2');
	  var exit3 = game.add.sprite(1472+16, 1568+16, 'Exit3');
	  var exit4 = game.add.sprite(1504+16, 1568+16, 'Exit4');
	  game.physics.p2.enable(exit1);
	  game.physics.p2.enable(exit2);
	  game.physics.p2.enable(exit3);
	  game.physics.p2.enable(exit4);
	  exit1.body.static = true;
	  exit2.body.static = true;
	  exit3.body.static = true;
	  exit4.body.static = true;
	  exit1.body.setCollisionGroup(exitCG);
	  exit2.body.setCollisionGroup(exitCG);
	  exit3.body.setCollisionGroup(exitCG);
	  exit4.body.setCollisionGroup(exitCG);
	  exit1.body.collides(playerCG);
	  exit2.body.collides(playerCG);
	  exit3.body.collides(playerCG);
	  exit4.body.collides(playerCG);
	  

	  //List of all tiles that the player collides with.
		/*map.setCollision(243, true, 'collision_tiles');
		map.setCollision(430, true, 'collision_tiles');
		map.setCollision(551, true, 'collision_tiles');*/
		map.setCollision(244, true, 'collision_tiles');
		map.setCollision(431, true, 'collision_tiles');
		map.setCollision(552, true, 'collision_tiles');

	 	//Makes the Tiled map into a collision based map.
	  	var wallsCG =  game.physics.p2.createCollisionGroup();
	  	var walls = game.physics.p2.convertTilemap(map, mainLayer);
	  	for(var wall in walls)
		{
			walls[wall].setCollisionGroup(wallsCG);
			walls[wall].collides(playerCG);
		}


	    //Add the sprite to the game and enable arcade physics on it
	    sprite = game.add.sprite(832, 704, 'person');
	    health = game.add.sprite(10, 10, 'health');
	    health.scale.setTo(0.25, 0.25);
	    //sprite.scale.setTo(0.66, 0.50);
	    health.fixedToCamera = true;
		//Scale sprite down to fit through the maze tiles.
		
		game.physics.p2.enable(sprite,false); 
		sprite.anchor.setTo(0.5,0.5);
		sprite.body.clearShapes();
		sprite.body.loadPolygon('person_physics', 'player_sprite');
		//Enable physics on the player sprite

		
		//Change the world size to match the size of this layer
		mainLayer.resizeWorld();
		
		
		//Add animations for sprite movement in four directions.
		sprite.animations.add('up', [0, 1, 2], 10, false);
		sprite.animations.add('right', [3, 4, 5], 10, false);
		sprite.animations.add('down', [6, 7, 8], 10, false);
		sprite.animations.add('left', [9, 10, 11], 10, false);

		if(HEALTH == 3){
			health.animations.add('loseHalfHeart', [0, 1, 2, 3, 4, 5, 6], 60, false);
	  	}
	  	else {
			health.animations.add('loseHalfHeart', [0, 1, 2, 3, 4, 5, 6, 7, 8], 60, false);
	  	}

	  	sprite.body.setCollisionGroup(playerCG);
	  	sprite.body.collides(spikesCG, this.hitSpike, this);
	  	sprite.body.collides(mudCG, this.hitMud, this);
	  	sprite.body.collides(netCG, this.hitNet, this);
	  	sprite.body.collides(wireCG, this.hitWire, this);
	 	sprite.body.collides(dartCG, this.hitDart, this);
	  
	  	sprite.body.collides(wallsCG);
		sprite.body.collides(exitCG, this.hitExit, this);
		
		sprite.body.setZeroDamping();
		sprite.body.fixedRotation = true;
		game.camera.follow(sprite);
		
		//Create the game time, update the time and start
		//the game time when the game starts.
		runnerTimer = game.time.create(false);
	    runnerTimer.loop(1000, this.updateTime, this);
	    runnerTimer.start();

	    runnerTimeText = this.game.add.text(this.game.world.centerX - 16, 400, Math.floor(runnerTime/60) +":"+(runnerTime%60), {
        font: "20px Arial",
        fill: "#d4af37",
    	stroke: "#000000",
    	strokeThickness: "3"});
        runnerTimeText.fixedToCamera = true;
        runnerTimeText.cameraOffset.setTo(game.width/2,game.height/15);

//-----------ANTIDOTE AND POTION DISPLAYS
        var antidoteButton = game.add.button(370,10,'Antidote',this.useAntidote, this, 2, 1, 0);
		antidoteButton.scale.setTo(.12,.12);
		antidoteButton.fixedToCamera = true;
		var potionButton = game.add.button(370,50,'Potion',this.usePotion, this, 2, 1, 0);
		potionButton.scale.setTo(.12,.12);
		potionButton.fixedToCamera = true;
		antidoteInventoryText = this.game.add.text(355, 15, INVENTORY[4].toString(), {
	        font: "20px Arial",
	        fill: "#d4af37",
	    	stroke: "#000000",
	    	strokeThickness: "3"
	    });
	    antidoteInventoryText.fixedToCamera = true;
	    potionInventoryText = this.game.add.text(355, 50, INVENTORY[5].toString(), {
	        font: "20px Arial",
	        fill: "#d4af37",
	    	stroke: "#000000",
	    	strokeThickness: "3"
	    });
	    potionInventoryText.fixedToCamera = true;
	    antidoteKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        antidoteKey.onDown.add(this.useAntidote, this);
        potionKey = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        potionKey.onDown.add(this.usePotion, this);
	  
//----------------

		this.gas = this.game.add.sprite(this.game.world.centerX - 32, 444, 'Gas');
		this.gas.alpha = 0;
		this.gas.animations.add('Puff', [0,1,2,3,4], 15, true);

        //Put server in charge of game time
        socket.emit('timerStart', {startTime: runnerTime});

	},

	//Updates variables as game is being played
	update: function() {
		//this.health.loadTexture('health', 2);
		antidoteInventoryText.text = INVENTORY[4].toString();
		potionInventoryText.text = INVENTORY[5].toString();

		//Once sprite stops moving the velocity should be set to zero.
		sprite.body.velocity.x = 0;
	  	sprite.body.velocity.y = 0;
		if(runnerTime%60<10) runnerTimeText.text = (Math.floor(runnerTime/60)) +":0"+(runnerTime%60);
		else runnerTimeText.text = (Math.floor(runnerTime/60)) +":"+(runnerTime%60);
		
		//Play animation when the user pushes an arrow on the keyboard.
		if (cursors.left.isDown||this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
			sprite.body.velocity.x = -(RUNSPEED);
			sprite.animations.play('left');
			var player_loc = {x: sprite.x, y: sprite.y};
			socket.emit('moveLeft', player_loc);
		  } else if (cursors.right.isDown||this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
			sprite.body.velocity.x = RUNSPEED;
			sprite.animations.play('right');
			var player_loc = {x: sprite.x, y: sprite.y};
			socket.emit('moveRight', player_loc);
		  } else if (cursors.up.isDown||this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
			sprite.body.velocity.y = -(RUNSPEED);
			sprite.animations.play('up');
			var player_loc = {x: sprite.x, y: sprite.y};
			socket.emit('moveUp', player_loc);
		  } else if (cursors.down.isDown||this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
			sprite.body.velocity.y = RUNSPEED;
			sprite.animations.play('down');
			var player_loc = {x: sprite.x, y: sprite.y};
			socket.emit('moveDown', player_loc);
		  }
		  
		this.gas.x = sprite.body.x-16;
		this.gas.y = sprite.body.y-16;

		//Game over if either the timer runs out
		//or the player completely loses all of their
		//health
		if(runnerTime == 0 || HEALTH <= 0){
			this.game.state.start("Defeat");
		}
	},

	hitSpike: function(player, spike) {
	 if(!trapCollided) {
		spike.clearCollision(true);
		spike.sprite.visible = true;
		spike.sprite.animations.play('Hit');
		if(DEFENSE == .5) {
			health.animations.getAnimation('loseHalfHeart').next();
			HEALTH -= (1 - DEFENSE);
			socket.emit('dealHalf', HEALTH);
		}
		else {
			health.animations.getAnimation('loseHalfHeart').next(2);
			HEALTH -= (1 - DEFENSE);
			socket.emit('dealFull', HEALTH);
		}
		console.log('Got hit by a spike.');
		trapCollided = true;
	 }
	 else {
		 trapCollided = false;
	 }	
	  
	},
	
	hitMud: function(player, mud) {
	 if(!trapCollided) {
		mud.clearCollision(true);
		if(RUNSPEED > 100){
			RUNSPEED -= 100;
			game.time.events.add(Phaser.Timer.SECOND * 2, this.mudUnslow, this);
		}
		trapCollided = true;
	 }
	 else {
		 trapCollided = false;
	 }
	},

	mudUnslow: function(){
		RUNSPEED += 100;
	},
	
	hitNet: function(player, net) {
	 if(!trapCollided) {
		net.clearCollision(true);
		net.sprite.visible = true;

		runSpeedHolder = RUNSPEED;
		RUNSPEED = 0;
		game.time.events.add(Phaser.Timer.SECOND * 5, this.netRelease, this);
		
		console.log('Got hit by a net.');
		console.log(runSpeedHolder);
		trapCollided = true;
	 }
	 else {
		 trapCollided = false;
	 }	
	  
	},

	netRelease: function(){
		RUNSPEED = runSpeedHolder;
	},
	
	hitWire: function(player, wire) {
	 if(!trapCollided) {
		wire.clearCollision(true);
		
		if(DEFENSE == 0) {
			health.animations.getAnimation('loseHalfHeart').next();
			HEALTH -= 0.5;
			socket.emit('dealHalf', HEALTH);
		}
		console.log('Got hit by a wire.');
		trapCollided = true;
	 }
	 else {
		 trapCollided = false;
	 }	
	  
	},
	
	hitDart: function(player, dart) {
	 if(!trapCollided) {
		dart.clearCollision(true);
		dart.sprite.visible = true;
		//dart SFX
		this.gas.x = sprite.body.x-16;
		this.gas.y = sprite.body.y-16;
		this.gas.alpha = 100;
		this.gas.animations.play('Puff');
		
		if(!poisoned){
			poisonCounter = 0;
			poisonTimer = game.time.events.repeat(Phaser.Timer.SECOND * 10, 4,this.poisonTick, this);
			poisoned = true;
		}
		
		
		console.log('Got hit by a dart.');
		trapCollided = true;
	 }
	 else {
		 trapCollided = false;
	 }	
	  
	},

	poisonTick: function(){
		poisonCounter++;
		health.animations.getAnimation('loseHalfHeart').next();
		HEALTH -= 0.5;
		socket.emit('dealHalf', HEALTH);
		console.log('poisonCounter is at: ' + poisonCounter);
		if(poisonCounter == 4){
			poisonCounter = 0;
			poisoned = false;
			this.gas.alpha = 0;
			this.gas.animations.stop('Puff');
		}
	},
	
	
	useAntidote: function(){
		if(INVENTORY[4]>0&&poisoned==true){
			poisoned = false;
			INVENTORY[4]--;
			game.time.events.remove(poisonTimer);
			socket.emit('antidoteUsed');
			this.gas.alpha = 0;
			this.gas.animations.stop('Puff');
		}
	},

	usePotion: function(){
		if(INVENTORY[5]>0&&HEALTH<maxHealth){
			var difference = (maxHealth-HEALTH)*2;
			HEALTH = maxHealth;
			INVENTORY[5]--;
			var i = 0;
			while(i<difference){
				health.animations.getAnimation('loseHalfHeart').previous();
				i++;
			}
			console.log('using potion' + i);
			socket.emit('potionUsed', i);	
		}
	},

	hitExit: function(player, exit) {
		map3Music.stop();
		this.game.state.start('Victory');
	},

	
	//Updates the game timer 
	updateTime: function(){
		console.log('Runner time is: ' + runnerTime);
		socket.emit('timerTick');
		socket.on('timerTock', function(time){
			runnerTime = time;
		});
	},
	//Intiates the game over function
	//when the round/match is completed
	gameOver: function(){
		this.game.state.start('GameOver');
	},

};