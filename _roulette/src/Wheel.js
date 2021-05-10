EPT.Wheel = function(game) {};
EPT.Wheel.prototype = {
	create: function(){
		this.add.sprite(0, 0, 'background');

		// EPT.Storage = this.game.plugins.add(Phaser.Plugin.Storage);
		// EPT.Storage.initUnset('EPT-highscore', 0);
		// var highscore = EPT.Storage.get('EPT-highscore') || 0;

		this.sliceNames = ['Airborne','HEADSHOT!','Berserk','Reanimation','Bombing Raid','Detonation'];
		this.sliceDesc = [
			'Pick any of your tiles from \nthe board and put it on \nany other, free spot \n(you can also rotate it).',
			'Boom! You get an extra 3 points \nof damage to your HQ, have to \ndrop all the tiles you have in \nhand, and you lose your turn.',
			'Force a single tile from the \nopponent\'s army on the board \nto do an attack while treating \neveryone else as hostiles.',
			'Heal all your units on the board \nby removing the wound \ntokens from them.',
			'Bomb any two adjacent hexes \non the board dealing one point \nof damage each to the \ntiles on both spots.',
			'Select a single tile from the \nopponent\'s army on the board \nand instantly kill it.'
		];

		// this.sliceValues = [0,1,2,3,4,5];
		// this.slices = this.slicePrizes.length;
		// this.itemsLeft = this.slicePrizes.length;
		// this.slicesLeft = this.sliceValues;
		// this.allIndexes = [0,1,2,3,4,5];
		this.sliceIndexes = [0,1,2,3,4,5];
		// this.currentIndexCount = 6;

		this.fontTitle = { font: "56px Berlin", fill: "#FFF", stroke: "#000", strokeThickness: 4, align: "center" };
		var fontTitle = { font: "56px Berlin", fill: "#FFF", stroke: "#000", strokeThickness: 4, align: "center" };
		this.fontSubtitle = { font: "34px Berlin", fill: "#FFF", stroke: "#000", strokeThickness: 3, align: "center" };
		var fontSubtitle = { font: "34px Berlin", fill: "#FFF", stroke: "#000", strokeThickness: 3, align: "center" };
		this.subtitle = this.add.text(this.world.centerX, 150, LANGTXT[FloodLANG]['spin'], fontSubtitle);
		this.subtitle.anchor.set(0.5,0);
		// this.winLabel = this.add.text(this.world.centerX, 670, LANGTXT[FloodLANG]['won'], fontSubtitle);
		// this.winLabel.anchor.set(0.5);
		// this.winLabel.y += this.winLabel.height*0.5;
		// this.winLabel.alpha = 0;

		this.initTiles();

		this.wheel = this.add.sprite(this.world.centerX, this.world.centerY-190, 'roulette-icons');
		this.wheel.anchor.set(0.5);
		this.wheel.angle += 60;
		this.buttonSpin = this.add.button(this.world.centerX, this.world.height, 'button-spin', this.spin, this, 1, 0, 2);
		this.buttonSpin.anchor.set(0.5, 1);
		this.prizeText = this.add.text(this.world.centerX, 755, "", fontTitle);
		this.prizeText.anchor.set(0.5);
		this.canSpin = true;

		this.buttonInfo = this.add.button(this.world.width-10, 10, 'button-info', this.info, this, 1, 0, 2);
		this.buttonInfo.anchor.set(1, 0);

		var wheelShadow = this.add.sprite(this.world.centerX, this.world.centerY-190, 'roulette-overlay');
		wheelShadow.anchor.set(0.5);
		var wheelIndicator = this.add.sprite(this.world.centerX, this.world.centerY-190, 'roulette-texture');
		wheelIndicator.anchor.set(0.5);

		this.spinWaitingTime = 2;
		// this.getSecondsLeft();

		// if(this.secondsPassed >= this.spinWaitingTime) {
		// 	this.enableSpinning();
		// }
		// else {
		// 	this.disableSpinning();
		// }

		// this.game.onResume.add(function() {
		// 	// this.getSecondsLeft();
		// 	this.subtitle.setText(EPT._formatTime(this.secondsLeft));
		// }, this);

		// this.coins = EPT.Storage.get('FloodEscape-coins') || 0;
		// this.coins = 0;
		// this.coinsImage = this.add.sprite(game.world.width-25, 30, 'icon-coin');
		// this.coinsImage.anchor.set(1,0);
		// this.coinsText = game.add.text(-90+25, 25-30, this.coins, { font: "42px Berlin", fill: "#FFF", stroke: "#333", strokeThickness: 4 });
		// this.coinsText.anchor.set(1,0);
		// this.coinsText.x -= this.coinsText.width*0.5;
		// this.coinsText.y += this.coinsText.height*0.5;
		// this.coinsText.anchor.set(0.5);
		// this.coinsImage.addChild(this.coinsText);
		// this.coinsImage.y = -this.coinsImage.height-20;
		// this.add.tween(this.coinsImage).to({y: 30}, 500, Phaser.Easing.Exponential.Out, true);

		var fontName = { font: "64px Alfa", fill: "#e1e2e2", stroke: "#622a2d", strokeThickness: 10, align: "center" };
		this.gameName = this.add.text(this.world.centerX, this.world.centerX+380, "HexRoulette", fontName);
		this.gameName.anchor.set(0.5);

		// var buttonBack = this.add.button(20, 20, 'button-back', this.clickBack, this, 1, 0, 2);
		// buttonBack.y = -buttonBack.height-20;
		// this.add.tween(buttonBack).to({y: 20}, 500, Phaser.Easing.Exponential.Out, true);
	},
	spin: function(){
		if(this.canSpin){
			EPT._playAudio('spinwheel');
			this.buttonSpin.setFrames(3,3,3);
			this.prizeText.text = "";
			var rounds = this.rnd.between(3, 4);
			// var degrees = this.rnd.between(0, 360);
			// var randomNumber = this.rnd.between(0, this.sliceIndexes.length-1);
			// var randomNumber = 4;

			this.hideTile();

			if(this.gameName.alpha == 1) {
				this.add.tween(this.gameName).to({alpha: 0}, 150, Phaser.Easing.Linear.None, true);
			}

			//var randomSlice = this.sliceValues[randomNumber];
			// if(randomSlice != 0) {
				// do stuff
				// this.sliceValues[randomNumber] = -1;
				// var item = (this.slicesLeft).splice(randomNumber,1,);
			// }
			// else {
				// alert("GAME OVER");
			// }

			// do {
			// 	var randomNumber = this.rnd.between(0, this.slicesLeft.length);
			// } while (randomNumber != -1);

			// alert(randomNumber);

			// var itemIndex = (this.sliceIndexes).indexOf(randomNumber);
			// var randomIndex = this.sliceIndexes[randomNumber];

			var randomX = Math.floor(Math.random()*this.sliceIndexes.length);
			var randomIndex = this.sliceIndexes[randomX];
			
			// if(randomIndex != 1) {
				// this.currentIndexCount--;
				// (this.sliceIndexes).splice(randomIndex,1);
				// for(var i=)
			// }
			// (this.sliceIndexes).splice(randomNumber,1);

			// var randomIndex = (this.sliceIndexes).splice(Math.floor(Math.random()*this.sliceIndexes.length), 1);

			if(randomIndex != 1) {
				(this.sliceIndexes).splice(randomX,1);
			}

			console.log('randomX: '+randomX+', randomIndex: '+randomIndex);
			console.log(this.sliceIndexes);
			// alert(this.allIndexes);

			// this.allIndexes = [0,1,2,3,4,5];
			// this.sliceIndexes = [0,1,2,3,4,5];
			// this.currentIndexCount = 6;

			// this.degrees = randomNumber*60;
			this.degrees = randomIndex*60;
			// alert(this.degrees);
			// alert(this.sliceIndexes);
			// this.prize = this.slices - 1 - Math.floor(degrees / (360 / this.slices));
			// this.prize = Math.floor(this.degrees / (360 / this.slices));
			this.prize = randomIndex;
			this.canSpin = false;
			var spinTween = this.add.tween(this.wheel).to({angle: 360 * rounds + this.degrees}, 3000, Phaser.Easing.Quadratic.Out, true);
			spinTween.onComplete.add(function(){
				this.time.events.add(1000, function() {
					if(this.black1)
						this.add.tween(this.black1).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
				}, this);
				this.winPrize();
			}, this);

			if(randomIndex != 1) {
				this.black1 = this.add.sprite(0, 0, 'black');
				this.black1.anchor.set(0.5,1);
				this.black1.angle = 360 - this.degrees;
				var markX = this.add.sprite(0, 0, 'tiles', 8);
				this.black1.addChild(markX);
				this.wheel.addChild(this.black1);
				this.black1.alpha = 0;
			}
		}
	},
	initTiles: function() {
		this.tileBox = this.add.sprite(this.world.centerX-(589/2), this.world.height-274-120, 'box');
		// this.tileBox.anchor.set(0.5,1);

		var fontTitle = { font: "34px Berlin", fill: "#FFF", stroke: "#FFF", strokeThickness: 2 };
		var fontDescription = { font: "24px Berlin", fill: "#FFF" };

		this.tileBg = this.add.sprite(50, 80, 'roulette-bg');
		this.tileBox.addChild(this.tileBg);

		this.tileImg = this.add.sprite(0, 0, 'tiles', 8); // empty
		this.tileBg.addChild(this.tileImg);

		this.tileTitle = this.add.text(170, -20, "-", fontTitle);
		this.tileTitle.anchor.set(0, 0.5);
		// this.tileTitle.x += this.tileTitle.width*1.5;
		// this.tileTitle.y += this.tileTitle.height*0.5;
		this.tileBg.addChild(this.tileTitle);

		this.tileDescription = this.add.text(170, 20, "-", fontDescription);
		this.tileDescription.lineSpacing = -3;
		this.tileBg.addChild(this.tileDescription);

		// this.tileNames = ['bg','airdrop','detonation','bombing raid','reanimation','berserk','boom'];

		this.tileBg.alpha = 0;
	},
	showTile: function(tileName) {
		// show tile
		// alert(tileName);
		this.tileImg.frame = tileName;//(this.tileNames).indexOf(tileName);
		this.tileTitle.setText(this.sliceNames[tileName]);
		this.tileDescription.setText(this.sliceDesc[tileName]);
		// this.tileBg.alpha = 1;
		this.add.tween(this.tileBg).to({alpha: 1}, 250, Phaser.Easing.Linear.None, true);
	},
	hideTile: function() {
		// hide tile
		this.add.tween(this.tileBg).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true);
	},
	enableSpinning: function() {
		this.subtitle.setText(LANGTXT[FloodLANG]['spin']);
		this.subtitle.setStyle(this.fontSubtitle);
		// this.winLabel.alpha = 0;
		this.prizeText.alpha = 0;
		this.buttonSpin.enabled = true;
		this.buttonSpin.setFrames(1,0,2);
		this.canSpin = true;
	},
	disableSpinning: function() {
		this.subtitle.setText(EPT._formatTime(this.secondsLeft));
		this.subtitle.setStyle(this.fontTitle);
		this.buttonSpin.enabled = false;
		this.buttonSpin.setFrames(3,3,3);
		this.canSpin = false;

		this.countdownLoop = this.time.events.loop(Phaser.Timer.SECOND, function() {
			this.secondsLeft -= 1;
			if(this.secondsLeft) {
				this.subtitle.setText(EPT._formatTime(this.secondsLeft));
			}
			else {
				this.time.events.remove(this.countdownLoop);
				this.enableSpinning();
			}
		}, this);
	},
	winPrize: function(){
		// this.winLabel.alpha = 0;
		// this.winLabel.scale.set(0.1,0.1);
		this.tileTitle.alpha = 0;
		this.tileTitle.scale.set(0.1,0.1);
		// this.prizeText.text = this.sliceNames[this.prize];

		// this.black1.angle = -this.wheel.angle;
		// this.black1.alpha = 1;

		this.showTile(this.prize);
		// this.showTile(5);

		// this.add.tween(this.winLabel).to({alpha: 1}, 250, Phaser.Easing.Linear.None, true);
		// this.add.tween(this.winLabel.scale).to({x:1,y:1}, 500, Phaser.Easing.Cubic.Out, true);
		this.add.tween(this.tileTitle).to({alpha: 1}, 250, Phaser.Easing.Linear.None, true);
		this.add.tween(this.tileTitle.scale).to({x:1,y:1}, 2500, Phaser.Easing.Elastic.Out, true, 100);

		this.timestamp = Date.now();
		// EPT.Storage.set('FloodEscape-timestamp', this.timestamp);
		this.secondsLeft = this.spinWaitingTime;
		this.disableSpinning();

		// if(this.sliceValues[this.prize] > 0) {
		// 	this.oldCoins = this.coins;
		// 	this.newCoins = this.oldCoins + this.sliceValues[this.prize];
		// 	this.coins = this.newCoins;
		// 	// EPT.Storage.set('FloodEscape-coins', this.newCoins);

			var tweenedCoin = this.add.sprite(this.world.centerX, 146, 'tiles', this.prize);
			tweenedCoin.anchor.set(0.5);
			tweenedCoin.alpha = 0;
			this.add.tween(tweenedCoin).to({alpha:1}, 200, Phaser.Easing.Linear.None, true);
			this.add.tween(tweenedCoin).to({x:137, y:this.world.height-260}, 200, Phaser.Easing.Linear.None, true, 250).onComplete.addOnce(function() {
				EPT._playAudio('coin');
				// this.winScoreTween();
				this.spawnEmitter(tweenedCoin, 'particle', 20, 300);
				tweenedCoin.kill();
			}, this);
		// }
		// else {
		// 	EPT._playAudio('winbonus');
		// 	switch(this.sliceValues[this.prize]) {
		// 		case -1: { // LIFE
		// 			if(EPT._bonus.life < 3) {
		// 				EPT._bonus.life++;
		// 			}
		// 			break;
		// 		}
		// 		case -2: { // DOUBLE
		// 			EPT._bonus.coins = 2;
		// 			break;
		// 		}
		// 		case -3: { // SLOW
		// 			if(EPT._bonus.slow < 3) {
		// 				EPT._bonus.slow++;
		// 			}
		// 			break;
		// 		}
		// 		default: {}
		// 	}
		// }
	},
	// clickBack: function() {
	// 	EPT._playAudio('click');
	// 	this.camera.fade(0x38464D, 200, true);
	// 	this.time.events.add(200, function() {
	// 		this.game.state.start('MainMenu');
	// 	}, this);
	// },
	spawnEmitter: function(item, particle, number, lifespan, frequency, offsetX, offsetY, gravity) {
		offsetX = offsetX || 0;
		offsetY = offsetY || 0;
		lifespan = lifespan || 2000;
		frequency = frequency || 0;
		var emitter = this.game.add.emitter(item.x+offsetX, item.y+offsetY, number);
		emitter.maxParticles = number;
		emitter.makeParticles(particle);
		// emitter.setAlpha(1, 0.9, 1000);
		emitter.setXSpeed(-300, 300);
		emitter.setYSpeed(-400, 200);
		emitter.setScale(1.75, 1.25, 1.75, 1.25, 500, Phaser.Easing.Linear.None);
		emitter.gravity = 250;
		emitter.start(false, lifespan, frequency, number);
	}
	// winScoreTween: function() {
	// 	this.tweenedPoints = this.oldCoins;
	// 	var pointsTween = this.add.tween(this);
	// 	pointsTween.to({ tweenedPoints: this.newCoins }, 500, Phaser.Easing.Linear.None, true);
	// 	pointsTween.onUpdateCallback(function(){
	// 		this.coinsText.setText(''+Math.floor(this.tweenedPoints));
	// 	}, this);
	// 	pointsTween.onComplete.addOnce(function(){
	// 		this.coinsText.setText(''+Math.floor(this.newCoins));
	// 	}, this);
	// 	pointsTween.start();
	// }
	// getSecondsLeft: function() {
	// 	EPT.Storage.initUnset('FloodEscape-timestamp', 0);
	// 	this.timestamp = EPT.Storage.get('FloodEscape-timestamp') || 0;
	// 	this.secondsPassed = Math.floor((Date.now()-this.timestamp)/1000);
	// 	this.secondsLeft = this.spinWaitingTime - this.secondsPassed;
	// 	if(this.secondsLeft < 0) {
	// 		this.secondsLeft = 1;
	// 	}
	// }
};