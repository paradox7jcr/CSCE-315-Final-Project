var Tutorial = function(game){};

var INDEX = 0;
var ONRUNNER = true;
var RUNNERIMAGES = [];
var TRAPPERIMAGES = [];

Tutorial.prototype = {
	
	//Loads Zoom In button from assets folder
	preload: function(){
		this.game.load.image('Quit', 'assets/new_images/buttons/quit_button.png');
		this.game.load.image('Next', 'assets/new_images/buttons/next_button.png');
		this.game.load.image('Prev', 'assets/new_images/buttons/prev_button.png');
		this.game.load.image('Trapper', 'assets/new_images/buttons/trap_master_button.png');
		this.game.load.image('Runner', 'assets/new_images/buttons/maze_runner_button.png');

		this.game.load.image('MR1', 'assets/tutorial/mazerunnert1.png');
		RUNNERIMAGES.push('MR1');
		this.game.load.image('MR2', 'assets/tutorial/mazerunnert2.png');
		RUNNERIMAGES.push('MR2');
		this.game.load.image('MR3', 'assets/tutorial/mazerunnert3.png');
		RUNNERIMAGES.push('MR3');
		//this.game.load.image('MR4', 'assets/tutorial/mazerunnert4.png');
		//RUNNERIMAGES.push('MR4');
		this.game.load.image('MR5', 'assets/tutorial/mazerunnert5.png');
		RUNNERIMAGES.push('MR5');
		this.game.load.image('MR6', 'assets/tutorial/mazerunnert6.png');
		RUNNERIMAGES.push('MR6');
		this.game.load.image('MR7', 'assets/tutorial/mazerunnert7.png');
		RUNNERIMAGES.push('MR7');
		this.game.load.image('MR8', 'assets/tutorial/mazerunnert8.png');
		RUNNERIMAGES.push('MR8');
		this.game.load.image('MR9', 'assets/tutorial/mazerunnert9.png');
		RUNNERIMAGES.push('MR9');
		this.game.load.image('TM1', 'assets/tutorial/trapmastert1.png');
		TRAPPERIMAGES.push('TM1');
		this.game.load.image('TM2', 'assets/tutorial/trapmastert2.png');
		TRAPPERIMAGES.push('TM2');
		this.game.load.image('TM3', 'assets/tutorial/trapmastert3.png');
		TRAPPERIMAGES.push('TM3');
		this.game.load.image('TM4', 'assets/tutorial/trapmastert4.png');
		TRAPPERIMAGES.push('TM4');
		this.game.load.image('TM5', 'assets/tutorial/trapmastert5.png');
		TRAPPERIMAGES.push('TM5');
		this.game.load.image('TM6', 'assets/tutorial/trapmastert6.png');
		TRAPPERIMAGES.push('TM6');
		this.game.load.image('TM7', 'assets/tutorial/trapmastert7.png');
		TRAPPERIMAGES.push('TM7');
		this.game.load.image('TM8', 'assets/tutorial/trapmastert8.png');
		TRAPPERIMAGES.push('TM8');
	},
	
	//Sets the game size based on the game window
	//Displays "GAME OVER" to the player's screen 
	//when the game is over. Player is given choice
	//to restart the game by creating "new game" button
  	create: function(){
  		this.game.scale.setGameSize(4000,2000);
  		this.game.stage.backgroundColor = "#28368a";
  		gameOverText = this.game.add.text(this.game.world.width*.25,0, "Rules of the Game", {
        font: "250px Arial",
        fill: "#d4af37"
    });
  		this.nextButton = this.game.add.button(this.game.world.width*.55, this.game.world.height*.9, 'Next', this.nextPic, this, 2, 1, 0);
		this.nextButton.scale.setTo(1,1);
	
		this.prevButton = this.game.add.button(this.game.world.width*.3, this.game.world.height*.9, 'Prev', this.prevPic, this, 2, 1, 0);
		this.prevButton.scale.setTo(1,1);

		this.trapperTutorialButton = this.game.add.button(0, this.game.world.height*.5, 'Trapper', this.trapperTutorial, this, 2, 1, 0);
		this.trapperTutorialButton.scale.setTo(1,1);

		this.runnerTutorialButton = this.game.add.button(this.game.world.width*.85, this.game.world.height*.5, 'Runner', this.runnerTutorial, this, 2, 1, 0);
		this.runnerTutorialButton.scale.setTo(1,1);

  		this.quitTutorialButton = this.game.add.button(50, 50, 'Quit', this.quitGame, this, 2, 1, 0);
		this.quitTutorialButton.scale.setTo(1,1);

		this.tutorialImage = this.game.add.sprite(this.game.world.width*.28, this.game.world.height*.2,'MR1');
		this.tutorialImage.scale.setTo(1.8,1.2);
	},

	//Update function
	update: function(){
		if(ONRUNNER)
			this.tutorialImage.key = RUNNERIMAGES[INDEX];
		else
			this.tutorialImage.key = TRAPPERIMAGES[INDEX];
	},

	nextPic: function(){
		if(ONRUNNER){
			if(INDEX < 8){
				INDEX++;
				this.tutorialImage.destroy();
				this.tutorialImage = this.game.add.sprite(this.game.world.width*.28, this.game.world.height*.2,RUNNERIMAGES[INDEX]);
				this.tutorialImage.scale.setTo(1.8,1.2);
			}
		}
		else{
			if(INDEX < 7){
				INDEX++;
				this.tutorialImage.destroy();
				this.tutorialImage = this.game.add.sprite(this.game.world.width*.28, this.game.world.height*.2,TRAPPERIMAGES[INDEX]);
				this.tutorialImage.scale.setTo(1.8,1.2);
			}
		}
		
	},

	prevPic: function(){
		if(ONRUNNER){
			if(INDEX > 0){
				INDEX--;
				this.tutorialImage.destroy();
				this.tutorialImage = this.game.add.sprite(this.game.world.width*.28, this.game.world.height*.2,RUNNERIMAGES[INDEX]);
				this.tutorialImage.scale.setTo(1.8,1.2);
			}
		}
		else{
			if(INDEX > 0){
				INDEX--;
				this.tutorialImage.destroy();
				this.tutorialImage = this.game.add.sprite(this.game.world.width*.28, this.game.world.height*.2,TRAPPERIMAGES[INDEX]);
				this.tutorialImage.scale.setTo(1.8,1.2);
			}
		}
	},

	runnerTutorial: function(){
		INDEX = 0;
		ONRUNNER = true;
		this.tutorialImage.destroy();
		this.tutorialImage = this.game.add.sprite(this.game.world.width*.28, this.game.world.height*.2,RUNNERIMAGES[INDEX]);
		this.tutorialImage.scale.setTo(1.8,1.2);
	},

	trapperTutorial: function(){
		INDEX = 0;
		ONRUNNER = false;
		this.tutorialImage.destroy();
		this.tutorialImage = this.game.add.sprite(this.game.world.width*.28, this.game.world.height*.2,TRAPPERIMAGES[INDEX]);
		this.tutorialImage.scale.setTo(1.8,1.2);
	},

	

	//Restarts the game back to the Main Menu to search
	//for more games
	quitGame: function(){
		this.game.state.start("MainMenu");
	},
	
};