var Credits = function(game){};
var trapd = this;

Credits.prototype = {
	
	preload: function(){ 
		this.game.load.image('mainMenu', 'assets/new_images/buttons/main_menu_button.png');
	},
	
	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.stage.backgroundColor = "#28368a";

		this.game.scale.setGameSize(4000,2000);
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.scale.refresh();

		this.game.world.setBounds(0,0,4000,10000);
		
		var titleText = this.game.add.text(this.game.world.width/2.5, this.game.world.height/15, "CREDITS", {
	        font: "175px Arial",
	        fill: "#d4af37"
    	});

    	var creditText = this.game.add.text(0, this.game.world.height/10,
    		"Game Assets:\nGaurav Munjal: http://opengameart.org/content/universal-lpc-sprite-male-01\nHyptosis: http://opengameart.org/content/lots-of-free-2d-tiles-and-sprites-by-hyptosis\n\nSpike sound - jamesabdulrahman: https://freesound.org/people/jamesabdulrahman/sounds/320521/\nMud sound - JanKoehl: https://freesound.org/people/JanKoehl/sounds/85604/\nDart sound - pfranzen: https://freesound.org/people/pfranzen/sounds/187707/\nWire sound - qubodup: https://freesound.org/people/qubodup/sounds/332056/\nNet sound - RSilveira_88: https://freesound.org/people/RSilveira_88/sounds/216244/\n\nGame Engine: \nhttp://phaser.io\n", {
	        font: "90px Arial",
	        fill: "#d4af37"
    	});

    	titleText.align = 'center';
    	creditText.align = 'center';

    	textTimer = game.time.create(false);
	  	textTimer.loop(5, this.slideText, this);
	  	textTimer.start();
		
		this.mainMenuButton = this.game.add.button(50, 50, 'mainMenu', this.mainMenu, this, 2, 1, 0);
		
		this.mainMenuButton.fixedToCamera = true;

	},

	slideText: function(){
		this.game.camera.y += 5;
	},
	
	mainMenu: function() {
		this.game.world.setBounds(0,0,4000,2000);
		this.game.state.start("MainMenu");
	},

	/*update: function(){
		
	}*/

};