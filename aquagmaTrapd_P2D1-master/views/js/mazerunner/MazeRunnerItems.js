var MazeRunnerItems = function(game){

};

//Global
//var mapNumber;


var HEALTH;
var RUNSPEED;
var DEFENSE;
var INVENTORY = [0,0,0,0,0,0];
var LAYERARRAY;

//Local
var goldText;
var timeText;
var itemTimer;
var speedBootsInventoryText;
var trapperReadyFirst = false;

var extraHeartInventoryText;
var bodyArmorInventoryText;
var extraTimeInventoryText;
var antidoteInventoryText;
var potionInventoryText;

var prepMusic;


MazeRunnerItems.prototype = {
	preload: function(){
		if(mapNumber == 1) {
			itemTimer = 120;
		}
		else {
			itemTimer = 180;
		}

		RUNSPEED = 150;
		DEFENSE = 0;
		HEALTH = 3;
		this.game.load.image('Runner', 'assets/new_images/buttons/done_button.png');
		this.game.load.image('SpeedBoots', 'assets/new_images/store_items/speedboots_item.png');
		this.game.load.image('ExtraHeart', 'assets/new_images/store_items/extraheart_item.png');
		this.game.load.image('BodyArmor', 'assets/new_images/store_items/bodyarmor_item.png');
		this.game.load.image('ExtraTime', 'assets/new_images/store_items/extratime_item.png');
		this.game.load.image('Plus', 'assets/new_images/buttons/plusbutton.png');
		this.game.load.image('Minus', 'assets/new_images/buttons/minusbutton.png');
		
		this.game.load.image('Potion', 'assets/new_images/store_items/healthpotion_item.png');
		this.game.load.image('Antidote', 'assets/new_images/store_items/antidote_item.png');

		this.game.load.audio('prepMusic', 'assets/music/02_prepTime.mp3');
	},
	create: function() {

		prepMusic = game.add.audio('mainMusic');
		prepMusic.loopFull();

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		this.game.stage.backgroundColor = "#28368a";

		this.itemTimer = game.time.create(false);	//CHANGED ALL OF THESE FROM SELECTTIMER
	    this.itemTimer.loop(1000, this.updateTime, this);
	    this.itemTimer.start();

	    //Put server in charge of game time
        socket.emit('timerStart', {startTime: itemTimer});

		itemTimerText = this.game.add.text(game.world.width *.4, 0, Math.floor(itemTimer/60) + ":" + (itemTimer%60), {
        font: "300px Arial",
        fill: "#d4af37"
    });
		goldText = this.game.add.text(game.world.width *.75, 0, "Gold: " + runnerStartGold, {
        font: "100px Arial",
        fill: "#d4af37"
    });
		timeText = this.game.add.text(game.world.width *.75, game.world.height*.06, "Time: " + runnerTime + " seconds", {
        font: "100px Arial",
        fill: "#d4af37"
    }); 
		passiveText = this.game.add.text(game.world.width *0.16, game.world.height *0.15, "PASSIVE ITEMS", {
        font: "100px Arial",
        fill: "#d4af37"
    }); 
		activeText = this.game.add.text(game.world.width *0.625, game.world.height *0.15, "ACTIVE ITEMS", {
        font: "100px Arial",
        fill: "#d4af37"
    });
		speedBootsText = this.game.add.text((game.world.width/12)*3.0, (game.world.height/12)*3, "Speed Boots (MAX 1)\n\nCost: 500 gold\n+Speed: 50 pts", {
        font: "55px Arial",
        fill: "#d4af37"
    });
		speedBootsInventoryText = this.game.add.text((game.world.width/12)*1.25, (game.world.height/12)*3.25, INVENTORY[0].toString(), {
        font: "200px Arial",
        fill: "#d4af37"
    });
		extraHeartText = this.game.add.text((game.world.width/12)*3.0, (game.world.height/12)*5, "Extra Heart (MAX 1)\n\nCost: 500 gold\n+Health: 1", {
        font: "55px Arial",
        fill: "#d4af37"
    });
		extraHeartInventoryText = this.game.add.text((game.world.width/12)*1.25, (game.world.height/12)*5.25, INVENTORY[1].toString(), {
        font: "200px Arial",
        fill: "#d4af37"
    });
		bodyArmorText = this.game.add.text((game.world.width/12)*3.0, (game.world.height/12)*7, "Body Armor (MAX 1)\n\nCost: 300 gold\n+Defense: 0.5\n-Speed: 50pts", {
        font: "55px Arial",
        fill: "#d4af37"
    });
		bodyArmorInventoryText = this.game.add.text((game.world.width/12)*1.25, (game.world.height/12)*7.25, INVENTORY[2].toString(), {
        font: "200px Arial",
        fill: "#d4af37"
    });
		extraTimeText = this.game.add.text((game.world.width/12)*3.0, (game.world.height/12)*9, "Extra Time\n\nCost: 300 gold\n+Time: 20 seconds", {
        font: "55px Arial",
        fill: "#d4af37"
    });
		extraTimeInventoryText = this.game.add.text((game.world.width/12)*1.25, (game.world.height/12)*9.25, INVENTORY[3].toString(), {
        font: "200px Arial",
        fill: "#d4af37"
    });
		antidoteText = this.game.add.text((game.world.width/12)*8.5, (game.world.height/12)*3, "Antidote\n\nCost: 150 gold\nActive: Cure poison", {
        font: "55px Arial",
        fill: "#d4af37"
    });
		antidoteInventoryText = this.game.add.text((game.world.width/12)*6.75, (game.world.height/12)*3.25, INVENTORY[4].toString(), {
        font: "200px Arial",
        fill: "#d4af37"
    });
		potionText = this.game.add.text((game.world.width/12)*8.5, (game.world.height/12)*5, "Potion\n\nCost: 800 gold\nActive: Fully restores health", {
        font: "55px Arial",
        fill: "#d4af37"
    });
		potionInventoryText = this.game.add.text((game.world.width/12)*6.75, (game.world.height/12)*5.25, INVENTORY[5].toString(), {
        font: "200px Arial",
        fill: "#d4af37"
    });
	
		mapSelectedText = this.game.add.text((game.world.width/12)*6, (game.world.height/12)*8, "Map Selected: Map " + mapNumber, {
			font: "200px Arial",
			fill: "#d4af37"
	});


		//Start runner button
		this.runnerButton = this.game.add.button((this.game.world.width /9)*3.5 , (this.game.world.height / 12)*11, 'Runner', this.startRunner, this, 2, 1, 0);
		this.runnerButton.scale.setTo(1, 1);
		//SpeedBoots button
		this.speedBootsButton = this.game.add.button((this.game.world.width / 8)*1.3, (this.game.world.height / 12)*3, 'SpeedBoots', this.speedBoots, this, 2, 1, 0);
		this.speedBootsButton.scale.setTo(1.4,1.4);
		this.buySpeedBootsButton = this.game.add.button((this.game.world.width / 8)*1.1, (this.game.world.height / 12)*3.25, 'Plus', this.speedBoots, this, 2, 1, 0);
		this.buySpeedBootsButton.scale.setTo(0.6,0.6);
		this.sellSpeedBootsButton = this.game.add.button((this.game.world.width/8)*1.1, (this.game.world.height/12)*4, 'Minus', this.sellSpeedBoots, this, 2, 1, 0);
		this.sellSpeedBootsButton.scale.setTo(0.6,0.6);
		//Extra heart button
		this.extraHeartButton = this.game.add.button((this.game.world.width / 8)*1.3, (this.game.world.height / 12)*5, 'ExtraHeart', this.extraHeart, this, 2, 1, 0);
		this.extraHeartButton.scale.setTo(1.4,1.4);
		this.buyExtraHeartButton = this.game.add.button((this.game.world.width / 8)*1.1, (this.game.world.height / 12)*5.25, 'Plus', this.extraHeart, this, 2, 1, 0);
		this.buyExtraHeartButton.scale.setTo(0.6,0.6);
		this.sellExtraHeartButton = this.game.add.button((this.game.world.width/8)*1.1, (this.game.world.height/12)*6, 'Minus', this.sellExtraHeart, this, 2, 1, 0);
		this.sellExtraHeartButton.scale.setTo(0.6, 0.6);
		//Body Armor button
		this.bodyArmorButton = this.game.add.button((this.game.world.width / 8)*1.3, (this.game.world.height / 12)*7, 'BodyArmor', this.bodyArmor, this, 2, 1, 0);
		this.bodyArmorButton.scale.setTo(1.4,1.4);
		this.buyBodyArmorButton = this.game.add.button((this.game.world.width / 8)*1.1, (this.game.world.height / 12)*7.25, 'Plus', this.bodyArmor, this, 2, 1, 0);
		this.buyBodyArmorButton.scale.setTo(0.6,0.6);
		this.sellBodyArmorButton = this.game.add.button((this.game.world.width/8)*1.1, (this.game.world.height/12)*8, 'Minus', this.sellBodyArmor, this, 2, 1, 0);
		this.sellBodyArmorButton.scale.setTo(0.6, 0.6);
		//extraTime button
		this.extraTimeButton = this.game.add.button((this.game.world.width / 8)*1.3, (this.game.world.height / 12)*9, 'ExtraTime', this.extraTime, this, 2, 1, 0);
		this.extraTimeButton.scale.setTo(1.4,1.4);
		this.buyExtraTimeButton = this.game.add.button((this.game.world.width / 8)*1.1, (this.game.world.height / 12)*9.25, 'Plus', this.extraTime, this, 2, 1, 0);
		this.buyExtraTimeButton.scale.setTo(0.6,0.6);
		this.sellExtraTimeButton = this.game.add.button((this.game.world.width/8)*1.1, (this.game.world.height/12)*10, 'Minus', this.sellExtraTime, this, 2, 1, 0);
		this.sellExtraTimeButton.scale.setTo(0.6, 0.6);
		//Antidote button
		this.antidoteButton = this.game.add.button((this.game.world.width / 8)*5, (this.game.world.height / 12)*3, 'Antidote', this.antidote, this, 2, 1, 0);
		this.antidoteButton.scale.setTo(1.4,1.4);
		this.buyAntidoteButton = this.game.add.button((this.game.world.width / 8)*4.8, (this.game.world.height / 12)*3.25, 'Plus', this.antidote, this, 2, 1, 0);
		this.buyAntidoteButton.scale.setTo(0.6,0.6);
		this.sellAntidoteButton = this.game.add.button((this.game.world.width/8)*4.8, (this.game.world.height/12)*4, 'Minus', this.sellAntidote, this, 2, 1, 0);
		this.sellAntidoteButton.scale.setTo(0.6, 0.6);
		//Potion button
		this.potionButton = this.game.add.button((this.game.world.width / 8)*5, (this.game.world.height / 12)*5, 'Potion', this.potion, this, 2, 1, 0);
		this.potionButton.scale.setTo(1.4,1.4);
		this.buyPotionButton = this.game.add.button((this.game.world.width / 8)*4.8, (this.game.world.height / 12)*5.25, 'Plus', this.potion, this, 2, 1, 0);
		this.buyPotionButton.scale.setTo(0.6,0.6);
		this.sellPotionButton = this.game.add.button((this.game.world.width/8)*4.8, (this.game.world.height/12)*6, 'Minus', this.sellPotion, this, 2, 1, 0);
		this.sellPotionButton.scale.setTo(0.6, 0.6);

		this.setEventHandlers();
	},
	startRunner: function(){
		var runnerInfo = {INVENTORY: INVENTORY, HEALTH: HEALTH};
		
		socket.emit('runnerReady', runnerInfo);
		if(trapperReadyFirst&&mapNumber == 1){ 
			this.game.state.start("MazeRunnerMap1");
		}
		else if(trapperReadyFirst&&mapNumber == 2){ 
			this.game.state.start("MazeRunnerMap2");
		}
		else if(trapperReadyFirst&&mapNumber == 3){ 
			this.game.state.start("MazeRunnerMap3");
		}
		else{
			this.game.state.start("MazeRunnerLoading");
		}
		
	},

	speedBoots: function(){
		if(RUNSPEED <= 150 && runnerStartGold >= 500)
		{
			runnerStartGold -= 500;
			RUNSPEED += 50;
			INVENTORY[0]++;
		}
	},
	sellSpeedBoots: function(){
		if(INVENTORY[0]>0)
		{
			runnerStartGold += 500;
			RUNSPEED -= 50;
			INVENTORY[0]--;
		}
	},

	extraHeart: function(){
		if(HEALTH == 3 && runnerStartGold >= 500)
		{
			runnerStartGold -= 500;
			HEALTH++;
			INVENTORY[1]++;
		}
	},
	sellExtraHeart: function(){
		if(INVENTORY[1]>0)
		{
			runnerStartGold += 500;
			HEALTH--;
			INVENTORY[1]--;
		}
	},

	extraTime: function(){
		if(runnerStartGold >= 300)
		{
			runnerStartGold -= 300;
			runnerTime += 20;
			INVENTORY[3]++;
		}
	},
	sellExtraTime: function(){
		if(INVENTORY[3]>0)
		{
			runnerStartGold += 300;
			runnerTime -= 20;
			INVENTORY[3]--;
		}
	},

	bodyArmor: function(){
		if(DEFENSE == 0 && runnerStartGold >= 300)
		{
			runnerStartGold -= 300;
			DEFENSE += .5;
			RUNSPEED -= 50;
			INVENTORY[2]++;
		}
	},
	sellBodyArmor: function(){
		if(INVENTORY[2]>0)
		{
			runnerStartGold += 300;
			DEFENSE -= .5;
			RUNSPEED += 50;
			INVENTORY[2]--;
		}
	},


	antidote: function(){
		if(runnerStartGold >= 150)
		{
			runnerStartGold -= 150;
			INVENTORY[4]++;
		}
	},
	sellAntidote: function(){
		if(INVENTORY[4]>0)
		{
			runnerStartGold += 150;
			INVENTORY[4]--;
		}
	},

	potion: function(){
		if(runnerStartGold >= 800)
		{
			runnerStartGold -= 800;
			INVENTORY[5]++;
		}
	},
	sellPotion: function(){
		if(INVENTORY[5]>0)
		{
			runnerStartGold += 800;
			INVENTORY[5]--;
		}
	},

	updateTime: function(){
		socket.emit('timerTick');
		socket.on('timerTock', function(time){
			itemTimer = time;
		});
	},

	setEventHandlers: function() {
		socket.on('trapMapDone', function(mapInfo){
			LAYERARRAY = mapInfo.newMap;
			console.log('Number of tiles: ' + LAYERARRAY.length);
			console.log('Map number:' + mapInfo.mapNumber)
			trapperReadyFirst = true;
		});
	},

	update: function() {
		goldText.text = "Gold: " + runnerStartGold;
		timeText.text = "Time: " + runnerTime + " seconds";

		speedBootsInventoryText.text = INVENTORY[0].toString();
		extraHeartInventoryText.text = INVENTORY[1].toString();
		bodyArmorInventoryText.text = INVENTORY[2].toString();
		extraTimeInventoryText.text = INVENTORY[3].toString();
		antidoteInventoryText.text = INVENTORY[4].toString();
		potionInventoryText.text = INVENTORY[5].toString();

		if(itemTimer%60<10) itemTimerText.text = Math.floor(itemTimer/60) + ":0" + (itemTimer%60);
		else itemTimerText.text = Math.floor(itemTimer/60) + ":" + (itemTimer%60);
		
		if(itemTimer == 0) {
			socket.emit('runnerReady');
		}
				
	},

};