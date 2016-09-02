var MainMenu = function(game){};

var socket = io;
var trapd = this;
var loadingMusic;

MainMenu.prototype = {
	
	preload: function(){
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.scale.refresh();
		this.game.load.image('NewGameButtonImage', 'assets/new_images/buttons/new_game_button.png');
		this.game.load.image('CreditsButtonImage', 'assets/new_images/buttons/credits_button.png');
		this.game.load.image('TutorialButtonImage', 'assets/new_images/buttons/tutorial_button.png');
		this.game.load.image('Logo', 'assets/buttons/pixelogo.png');
		this.game.load.audio('mainMusic', 'assets/music/01_loading.mp3');
	},
	create: function(){
		loadingMusic = game.add.audio('mainMusic');
		loadingMusic.loopFull();

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.stage.backgroundColor = "#28368a";
		
		this.logo = this.game.add.sprite(this.game.world.width / 3.25, 25, 'Logo');
		this.logo.scale.setTo(2,2);
		this.newGameButton = this.game.add.button(this.game.world.width/ 2.9, this.game.world.height / 2.75, 'NewGameButtonImage', this.startNewGame, this, 2, 1, 0);
		this.newGameButton.scale.setTo(2, 2);
		this.tutorialButton = this.game.add.button(this.game.world.width / 2.6, this.game.world.height / 1.8, 'TutorialButtonImage', this.startTutorial, this, 2, 1, 0);
		this.tutorialButton.scale.setTo(1.5, 1.5);
		this.creditsButton = this.game.add.button(50, this.game.world.height / 1.2, 'CreditsButtonImage', this.startCredits, this, 2, 1, 0);
		this.creditsButton.scale.setTo(1.5, 1.5);
	},
	startNewGame: function(){
		socket.emit('PlayerReady');
		trapd.game.state.start("Loading");
	},

	startTutorial: function() {
		trapd.game.state.start("Tutorial");
	},

	startCredits: function() {
		trapd.game.state.start("Credits");
	}
};