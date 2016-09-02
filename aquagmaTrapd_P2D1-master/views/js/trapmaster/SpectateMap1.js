var SpectateMap1 = function(game){

};
 
//Variables for game time text
//and game time
var INVENTORY;
var runnerTimeText;
var runnerTimer;
var runSpeedHolder = 0;

var maxHealth;
var antidoteInventoryText;
var potionInventoryText;

var spikeSFX, mudSFX, netSFX, wireSFX, dartSFX;

var poisoned;
var poisonCounter;


var trapCollided = false;
var inNet = false;

var tempX;
var tempY;
var trapd = this;

SpectateMap1.prototype = {

	preload: function() {
		maxHealth = HEALTH;

		this.game.load.spritesheet('person', 'assets/sprites/player_sprite.png', 32, 32);
		this.game.load.physics('person_physics', 'assets/sprites/person_physics.json');
		
		if(HEALTH == 3)
			this.game.load.spritesheet('health', 'assets/sprites/3HealthSprite.png', 269, 90.5);
		else
			this.game.load.spritesheet('health', 'assets/sprites/4HealthSprite.png', 355, 90.5);

		this.game.load.tilemap('tilemap', 'assets/maps/map1.json', null, Phaser.Tilemap.TILED_JSON);

		this.game.load.image('tiles', 'assets/tilesets/map1_tiles.png');
		this.game.load.image('trapTiles', 'assets/tilesets/trap_tiles.png');
		
		this.game.load.spritesheet('Spikes', 'assets/sprites/spike_sprite.png', 32, 32);
		this.game.load.image('Mud', 'assets/buttons/newmud.png');
		this.game.load.image('Net', 'assets/buttons/newnet.png');
		this.game.load.image('Wire', 'assets/buttons/newbarbwire.png');
		this.game.load.spritesheet('Gas', 'assets/new_images/poisondart_animation.png', 32, 32);
		this.game.load.image('Dart', 'assets/buttons/newpoisondart.png');

		this.game.load.image('Potion', 'assets/new_images/store_items/healthpotion_item.png');
		this.game.load.image('Antidote', 'assets/new_images/store_items/antidote_item.png');
		
		this.game.load.image('Exit', 'assets/buttons/exit.png');


		this.game.load.audio('spikeSound', 'assets/sounds/spikeSound.ogg');
		this.game.load.audio('mudSound', 'assets/sounds/mudSound.ogg');
		this.game.load.audio('netSound', 'assets/sounds/netSound.ogg');
		this.game.load.audio('wireSound', 'assets/sounds/wireSound.ogg');
		this.game.load.audio('dartSound', 'assets/sounds/dartSound.ogg');
		
		this.setEventHandlers();
	},


	create: function() {
	  game.scale.setGameSize(1600,1600);

	  spikeSFX = game.add.audio('spikeSound');
	  mudSFX = game.add.audio('mudSound');
	  netSFX = game.add.audio('netSound');
	  wireSFX = game.add.audio('wireSound');
	  dartSFX = game.add.audio('dartSound');
	 
	  game.physics.startSystem(Phaser.Physics.P2JS);
	  game.physics.p2.setImpactEvents(true);

	  map = game.add.tilemap('tilemap');
	  map.addTilesetImage('map1_tiles', 'tiles');
	  map.addTilesetImage('trap_tiles', 'trapTiles');
	  
	  var spikesCG = game.physics.p2.createCollisionGroup();
	  var mudCG = game.physics.p2.createCollisionGroup();
	  var netCG = game.physics.p2.createCollisionGroup();
	  var wireCG = game.physics.p2.createCollisionGroup();
	  var dartCG = game.physics.p2.createCollisionGroup();
	  var exitCG = game.physics.p2.createCollisionGroup();
	  var playerCG = game.physics.p2.createCollisionGroup();
	  
	  
	  backgroundlayer = map.createLayer('Wall');
	  layer = map.createLayer('Tile Layer 1');
	  
	  
	  traps = game.add.group();  
	  traps.enableBody = true;
	  traps.physicsBodyType = Phaser.Physics.P2JS;
	  layer.resizeWorld();
	 
	  var i = 0;
	  for(var y = 0; y < 1600; y += 32) {
		  for(var x = 0; x < 1600; x += 32) {
			  if(trapCoord[i] == 901) {
				  var spike = game.add.sprite(x+16, y+16, 'Spikes');
				  game.physics.p2.enable(spike);
				  spike.body.static = true;
				  spike.animations.add('Hit', [0,1,2,3,4], 15, false);
				  spike.visible = true;
				  traps.add(spike);
				  spike.body.setCollisionGroup(spikesCG);
				  spike.body.collides(playerCG);
				  console.log('Index: ' + trapCoord[i]);
			  }
			  else if(trapCoord[i] == 902) {
				  var mud = game.add.sprite(x+16, y+16, 'Mud');
				  game.physics.p2.enable(mud);
				  mud.body.static = true;
				  traps.add(mud);
				  mud.body.setCollisionGroup(mudCG);
				  mud.body.collides(playerCG);
				  console.log('Index: ' + trapCoord[i]);
				  
			  }
			  else if(trapCoord[i] == 903) {
				  var net = game.add.sprite(x+16, y+16, 'Net');
				  game.physics.p2.enable(net);
				  net.body.static = true;
				  net.visible = true;
				  traps.add(net);
				  net.body.setCollisionGroup(netCG);
				  net.body.collides(playerCG);
				  console.log('Index: ' + trapCoord[i]);
			  }
			  else if(trapCoord[i] == 904) {
				  var wire = game.add.sprite(x+16, y+16, 'Wire');
				  game.physics.p2.enable(wire);
				  wire.body.static = true;
				  traps.add(wire);
				  wire.body.setCollisionGroup(wireCG);
				  wire.body.collides(playerCG);
				  console.log('Index: ' + trapCoord[i]);
			  }
			  else if(trapCoord[i] == 905) {
				  var dart = game.add.sprite(x+16, y+16, 'Dart');
				  game.physics.p2.enable(dart);
				  dart.body.static = true;
				  dart.visible = true;
				  traps.add(dart);
				  dart.body.setCollisionGroup(dartCG);
				  dart.body.collides(playerCG);
				  console.log('Index: ' + trapCoord[i]);
			  }
			  ++i;
		  }
	  }
	  
	  var exit = game.add.sprite(736+16, 1568+16, 'Exit');
	  game.physics.p2.enable(exit);
	  exit.body.static = true;
	  exit.body.setCollisionGroup(exitCG);
	  exit.body.collides(playerCG);
	  
      //List of all tiles that the player collides with.
	  map.setCollisionBetween(67, 73, true, 'Tile Layer 1');
	  map.setCollisionBetween(457, 458, true, 'Tile Layer 1');
	  map.setCollisionBetween(485, 486, true, 'Tile Layer 1');
	  map.setCollisionBetween(488, 489, true, 'Tile Layer 1');
	  map.setCollisionBetween(513, 515, true, 'Tile Layer 1');
	  map.setCollisionBetween(517, 520, true, 'Tile Layer 1');
		

	  //Makes the Tiled map into a collision based map.
	  var wallsCG =  game.physics.p2.createCollisionGroup();
	  var walls = game.physics.p2.convertTilemap(map, layer);
	  for(var wall in walls)
	  {
		walls[wall].setCollisionGroup(wallsCG);
		walls[wall].collides(playerCG);
	  }
		
	  sprite = game.add.sprite(this.game.world.centerX - 16, 460, 'person');
	  health = game.add.sprite(10, 10, 'health');
	  health.scale.setTo(1.5, 1.5);
	  health.fixedToCamera = true;
	  
	  game.physics.p2.enable(sprite,false); 
	  sprite.anchor.setTo(0.5,0.5);
	  
	  sprite.body.clearShapes();
	  
	  sprite.body.loadPolygon('person_physics', 'player_sprite');
	 
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

	  //-----------ANTIDOTE AND POTION DISPLAYS
        var antidoteImage = game.add.sprite(1400,50,'Antidote');
		antidoteImage.scale.setTo(.5,.5);
		var potionButton = game.add.sprite(1400,200,'Potion');
		potionButton.scale.setTo(.5,.5);
		antidoteInventoryText = this.game.add.text(1350, 50, INVENTORY[4].toString(), {
	        font: "80px Arial",
	        fill: "#d4af37",
	    	stroke: "#000000",
	    	strokeThickness: "3"
	    });
	    antidoteInventoryText.fixedToCamera = true;
	    potionInventoryText = this.game.add.text(1350, 200, INVENTORY[5].toString(), {
	        font: "80px Arial",
	        fill: "#d4af37",
	    	stroke: "#000000",
	    	strokeThickness: "3"
	    });
	  //-------------------------
	  
	  //Create the game time, update the time and start
	  //the game time when the game starts.
	  runnerTimer = game.time.create(false);
	  runnerTimer.loop(1000, this.updateTime, this);
	  runnerTimer.start();

	  runnerTimeText = game.add.text(this.game.world.centerX - 16, 400, Math.floor(runnerTime/60) +":"+(runnerTime%60), {
		font: "100px Arial",
		fill: "#d4af37",
    	stroke: "#000000",
    	strokeThickness: "3"});
	  runnerTimeText.fixedToCamera = true;
	  runnerTimeText.cameraOffset.setTo(game.width/2, 30);
	  
	  this.gas = this.game.add.sprite(this.game.world.centerX - 32, 444, 'Gas');
	  this.gas.alpha = 0;
	  this.gas.animations.add('Puff', [0,1,2,3,4], 15, true);

	  //Put server in charge of game time
	  socket.emit('timerStart', {startTime: runnerTime});

	  
	},
	
	setEventHandlers: function() {
		socket.on('movingLeft', function(playerInfo){
			tempX = playerInfo.x;
			tempY = playerInfo.y;
			sprite.animations.play('left');
	  	});
	  
	  	socket.on('movingRight', function(playerInfo) {
			tempX = playerInfo.x;
			tempY = playerInfo.y;
			sprite.animations.play('right');
	  	});
	  
	  	socket.on('movingDown', function(playerInfo) {		
			tempX = playerInfo.x;
			tempY = playerInfo.y; 
			sprite.animations.play('down');
	  	});
	  
	  	socket.on('movingUp', function(playerInfo) {
			tempX = playerInfo.x;
			tempY = playerInfo.y;
			sprite.animations.play('up');
		});
		
		socket.on('damageHalf', function(currentHealth) {
			health.animations.getAnimation('loseHalfHeart').next();
			HEALTH = currentHealth;
			console.log('Health is: ' + HEALTH);
		});
		
		socket.on('damageFull', function(currentHealth) {
			health.animations.getAnimation('loseHalfHeart').next(2);
			HEALTH = currentHealth;
			console.log('Health is: ' + HEALTH);
		});

		socket.on('usingAntidote', function() {
			console.log('antidote used');
			poisoned = false;
			INVENTORY[4]--;
			antidoteInventoryText.text = INVENTORY[4].toString();
			trapd.gas.alpha = 0;
			trapd.gas.animations.stop('Puff');
		});

		socket.on('usingPotion', function(i) {
			console.log('potion used ' + i);
			health.animations.getAnimation('loseHalfHeart').previous(i);
			HEALTH = maxHealth;
			INVENTORY[5]--;
	  		potionInventoryText.text = INVENTORY[5].toString();
		});
	},

	update: function() {

	  if(runnerTime%60<10) runnerTimeText.text = (Math.floor(runnerTime/60)) +":0"+(runnerTime%60);
	  else runnerTimeText.text = (Math.floor(runnerTime/60)) +":"+(runnerTime%60);
	  sprite.body.x = tempX;
	  sprite.body.y = tempY;

	  this.gas.x = sprite.body.x-16;
	  this.gas.y = sprite.body.y-16;
	  
	  //Game over if either the timer runs out
	  //or the player completely loses all of their
	  //health
	  if(runnerTime == 0 || HEALTH <= 0){
	  	  this.game.state.start('Victory');
	  }
	 
	},

	hitSpike: function(player, spike) {
	 if(!trapCollided) {
		spike.clearCollision(true);
		spike.sprite.visible = true;
		spike.sprite.animations.play('Hit');
		spikeSFX.play();
		console.log('Got hit by a spike. Health is: ' + HEALTH);
		trapCollided = true;
	 }
	 else {
		 trapCollided = false;
	 }	
	  
	},
	
	hitMud: function(player, mud) {
	 if(!trapCollided) {
		mud.clearCollision(true);
		mudSFX.play();
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
	 if(!trapCollided&&!inNet) {
	 	inNet = true;
		net.clearCollision(true);
		net.sprite.visible = true;
		netSFX.play();

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
		runSpeedHolder = 0;
		inNet = false;
	},
	
	hitWire: function(player, wire) {
	 if(!trapCollided) {
		wire.clearCollision(true);
		wireSFX.play();
		
		console.log('Got hit by a wire. Health is: ' + HEALTH);
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
		dartSFX.play();
		this.gas.x = sprite.body.x-16;
		this.gas.y = sprite.body.y-16;
		this.gas.alpha = 100;
		this.gas.animations.play('Puff');
		
		if(!poisoned){
			poisonCounter = 0;
			game.time.events.repeat(Phaser.Timer.SECOND * 10, 4,this.poisonTick, this);
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

		console.log('poisonCounter is at: ' + poisonCounter + ' Heath is at: ' + HEALTH);
		if(poisonCounter == 4){
			poisonCounter = 0;
			poisoned = false;
			this.gas.alpha = 0;
			this.gas.animations.stop('Puff');
		}
	},

	hitExit: function(player, exit) {
		trapperMusic1.stop();
		this.game.state.start('Defeat');
	},
	
	
	//Updates the game timer 
	updateTime: function(){
		console.log('Runner time is: ' + runnerTime);
		socket.emit('timerTick');
		socket.on('timerTock', function(time){
			runnerTime = time;
		});
	},
};