var Defeat = function(game){};

var defeatMusic;

Defeat.prototype = {
	
	//Loads Zoom In button from assets folder
	preload: function(){
		this.game.load.image('NewGame', 'assets/new_images/buttons/new_game_button.png');
		this.game.load.image('Loser', 'assets/new_images/text_images/loser_text.png');
		this.game.load.audio('defeatSong', 'assets/music/06_gameOver.mp3');
	},
	
	//Sets the game size based on the game window
	//Displays "GAME OVER" to the player's screen 
	//when the game is over. Player is given choice
	//to restart the game by creating "new game" button
  	create: function(){
  		defeatMusic = game.add.audio('defeatSong');
		defeatMusic.loopFull();
  		this.game.scale.setGameSize(4000,2000);
		//this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  		this.game.stage.backgroundColor = "#000000";
		this.loser = this.game.add.sprite(-350,-50, 'Loser');
  		this.loser.scale.setTo(8,8);

  		this.newGameButton = this.game.add.button(this.game.world.width *.28, this.game.world.height*.6, 'NewGame', this.newGame, this, 2, 1, 0);
		this.newGameButton.scale.setTo(3,3);
	},

	//Update function
	update: function(){

	},

	//Restarts the game back to the Main Menu to search
	//for more games
	newGame: function(){
		defeatMusic.stop();
		//refresh the entire document
		document.location.reload();
	},
	
};