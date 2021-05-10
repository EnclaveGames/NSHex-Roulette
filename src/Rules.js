class Rules extends Phaser.Scene {
    constructor() {
        super('Rules');
    }
    create() {
		this.add.sprite(0, 0, 'background').setOrigin(0, 0);
		// console.log('Rules');
		this.navbar = this.add.sprite(0, 0, 'img-navbar').setOrigin(0, 0);
		this.buttonBack = new Button(10, 10, 'button-back', this.clickBack, this, 'noframes').setOrigin(0, 0);

		var fontTitle = { font: EPT.text['STYLE']+'40px '+EPT.text['FONT'], fill: '#fff', align: 'center' };
		var fontSubtitle = { font: EPT.text['STYLE']+'38px '+EPT.text['FONT'], fill: '#000', align: 'center', stroke: "#fff", strokeThickness: 3 };
		var fontSmallerTitle = { font: EPT.text['STYLE']+'30px '+EPT.text['FONT'], fill: '#000', align: 'center', stroke: "#fff", strokeThickness: 2 };
		var fontSmall = { font: EPT.text['STYLE']+'26px '+EPT.text['FONT'], fill: '#000', align: 'left', lineSpacing: 2, stroke: "#fff", strokeThickness: 2 };
		var fontSmallItalic = { font: 'italic '+EPT.text['STYLE']+'26px '+EPT.text['FONT'], fill: '#000', align: 'left', lineSpacing: 2, stroke: "#fff", strokeThickness: 2 };
		var fontTiny = { font: EPT.text['STYLE']+'20px '+EPT.text['FONT'], fill: '#000', stroke: "#eee", strokeThickness: 5 };
		// var fontFooter = { font: EPT.text['STYLE']+'14px '+EPT.text['FONT'], fill: '#000' };

		var offsetTop = 125;
		var offsetLeft = 30;
		var delta = 32;
		var yOff = 5;
		var xOff = 20;
		this.rulesContainer = this.add.container(0, 0);

		this.rulesIntroText = this.add.text(offsetLeft, offsetTop+0*delta, EPT.text['rules-intro-text'], fontSmall);
		this.rulesQuoteText = this.add.text(offsetLeft+30, offsetTop+15+6*delta, EPT.text['rules-quote-text'], fontSmall);
		// this.rulesStoryTitle = this.add.text(offsetLeft, offsetTop+11*delta, EPT.text['rules-story-title'], fontSubtitle);
		// this.rulesStoryText = this.add.text(offsetLeft, offsetTop+13*delta, EPT.text['rules-story-text'], fontSmall);

		this.rulesUsageTitle = this.add.text(offsetLeft, offsetTop+12*delta, EPT.text['rules-usage-title'], fontSubtitle);
		this.rulesUsageText = this.add.text(offsetLeft, offsetTop+14*delta, EPT.text['rules-usage-text'], fontSmall);
		this.rulesTilesTitle = this.add.text(offsetLeft, offsetTop+24*delta, EPT.text['rules-tiles-title'], fontSubtitle);
		this.rulesTilesText = this.add.text(offsetLeft, offsetTop+26*delta, EPT.text['rules-tiles-text'], fontSmall);

		this.rulesTile1Bg = this.add.sprite(offsetLeft-5, offsetTop+31*delta, 'roulette-bg').setOrigin(0, 0.5).setScale(0.75,0.75);
		this.rulesTile2Bg = this.add.sprite(offsetLeft-5, offsetTop+37*delta, 'roulette-bg').setOrigin(0, 0.5).setScale(0.75,0.75);
		this.rulesTile3Bg = this.add.sprite(offsetLeft-5, offsetTop+42*delta, 'roulette-bg').setOrigin(0, 0.5).setScale(0.75,0.75);
		this.rulesTile4Bg = this.add.sprite(offsetLeft-5, offsetTop+48*delta, 'roulette-bg').setOrigin(0, 0.5).setScale(0.75,0.75);
		this.rulesTile5Bg = this.add.sprite(offsetLeft-5, offsetTop+54*delta, 'roulette-bg').setOrigin(0, 0.5).setScale(0.75,0.75);
		this.rulesTile6Bg = this.add.sprite(offsetLeft-5, offsetTop+60*delta, 'roulette-bg').setOrigin(0, 0.5).setScale(0.75,0.75);

		this.rulesTile1Img = this.add.sprite(offsetLeft+xOff*2, offsetTop+31*delta, 'tiles', 1);
		this.rulesTile1Title = this.add.text(offsetLeft+xOff*5, offsetTop+31*delta-15, EPT.text['rules-tile1-title'], fontSmallerTitle);
		this.rulesTile1Text = this.add.text(offsetLeft, offsetTop+yOff+32*delta, EPT.text['rules-tile1-text'], fontSmall);
		this.rulesTile2Img = this.add.sprite(offsetLeft+xOff*2, offsetTop+37*delta, 'tiles', 2);
		this.rulesTile2Title = this.add.text(offsetLeft+xOff*5, offsetTop+37*delta-15, EPT.text['rules-tile2-title'], fontSmallerTitle);
		this.rulesTile2Text = this.add.text(offsetLeft, offsetTop+yOff+38*delta, EPT.text['rules-tile2-text'], fontSmall);
		this.rulesTile3Img = this.add.sprite(offsetLeft+xOff*2, offsetTop+42*delta, 'tiles', 3);
		this.rulesTile3Title = this.add.text(offsetLeft+xOff*5, offsetTop+42*delta-15, EPT.text['rules-tile3-title'], fontSmallerTitle);
		this.rulesTile3Text = this.add.text(offsetLeft, offsetTop+yOff+43*delta, EPT.text['rules-tile3-text'], fontSmall);
		this.rulesTile4Img = this.add.sprite(offsetLeft+xOff*2, offsetTop+48*delta, 'tiles', 4);
		this.rulesTile4Title = this.add.text(offsetLeft+xOff*5, offsetTop+48*delta-15, EPT.text['rules-tile4-title'], fontSmallerTitle);
		this.rulesTile4Text = this.add.text(offsetLeft, offsetTop+yOff+49*delta, EPT.text['rules-tile4-text'], fontSmall);
		this.rulesTile5Img = this.add.sprite(offsetLeft+xOff*2, offsetTop+54*delta, 'tiles', 5);
		this.rulesTile5Title = this.add.text(offsetLeft+xOff*5, offsetTop+54*delta-15, EPT.text['rules-tile5-title'], fontSmallerTitle);
		this.rulesTile5Text = this.add.text(offsetLeft, offsetTop+yOff+55*delta, EPT.text['rules-tile5-text'], fontSmall);
		this.rulesTile6Img = this.add.sprite(offsetLeft+xOff*2, offsetTop+60*delta, 'tiles', 0);
		this.rulesTile6Title = this.add.text(offsetLeft+xOff*5, offsetTop+60*delta-15, EPT.text['rules-tile6-title'], fontSmallerTitle);
		this.rulesTile6Text = this.add.text(offsetLeft, offsetTop+yOff+61*delta, EPT.text['rules-tile6-text'], fontSmall);

		this.rulesEndTitle = this.add.text(offsetLeft, offsetTop+65*delta, EPT.text['rules-end-title'], fontSubtitle);
		this.rulesEndText = this.add.text(offsetLeft, offsetTop+67*delta, EPT.text['rules-end-text'], fontSmall);

		this.rulesContainer.add([
			this.rulesIntroText,this.rulesQuoteText,//this.rulesStoryTitle,this.rulesStoryText
			this.rulesUsageTitle,this.rulesUsageText,
			this.rulesTilesTitle,this.rulesTilesText,
			this.rulesTile1Bg,this.rulesTile1Img,this.rulesTile1Title,this.rulesTile1Text,
			this.rulesTile2Bg,this.rulesTile2Img,this.rulesTile2Title,this.rulesTile2Text,
			this.rulesTile3Bg,this.rulesTile3Img,this.rulesTile3Title,this.rulesTile3Text,
			this.rulesTile4Bg,this.rulesTile4Img,this.rulesTile4Title,this.rulesTile4Text,
			this.rulesTile5Bg,this.rulesTile5Img,this.rulesTile5Title,this.rulesTile5Text,
			this.rulesTile6Bg,this.rulesTile6Img,this.rulesTile6Title,this.rulesTile6Text,
			this.rulesEndTitle,this.rulesEndText
		]);

		this.titleRules = this.add.text(EPT.world.centerX, 45, EPT.text['rules-title'], fontTitle);
		this.titleRules.setOrigin(0.5, 0.5);
		this.containerRulesBar = this.add.container(0, 0);
		this.containerRulesBar.add([this.navbar,this.buttonBack,this.titleRules]);

		// ADD SWPIE BUTTONS

		this.add.sprite(0, EPT.world.height-70, 'background-overlay').setOrigin(0, 0);

		this.pageMin = 1;
		this.pageCur = 1;
		this.pageMax = 5;
		this.pageStep = [
			0,
			EPT.world.height*0.5,
			EPT.world.height*0.5,
			EPT.world.height*0.5,
			EPT.world.height*0.5,
			EPT.world.height*0.45
		];

		this.buttonUp = new Button(5, EPT.world.height+5, 'button-up', function(){
            // this.rulesContainer.y -= 300;
            if(this.pageCur < this.pageMax) {
				this.pageCur += 1;
            	this.tweens.add({targets: this.rulesContainer, y: this.rulesContainer.y-this.pageStep[this.pageCur], ease: 'Linear', duration: 250});
				if(this.pageCur > this.pageMin) {
					this.buttonDown.setAlpha(1);
				}
				if(this.pageCur == this.pageMax) {
					this.buttonUp.setAlpha(0.25);
				}
            }
        }, this, 'noframes').setOrigin(0, 1);

		this.buttonDown = new Button(EPT.world.width+5, EPT.world.height+5, 'button-down', function(){
			if(this.pageCur > this.pageMin) {
				this.tweens.add({targets: this.rulesContainer, y: this.rulesContainer.y+this.pageStep[this.pageCur], ease: 'Linear', duration: 250});
				this.pageCur -= 1;
				if(this.pageCur == this.pageMin) {
					this.buttonDown.setAlpha(0.25);
				}
				if(this.pageCur < this.pageMax) {
					this.buttonUp.setAlpha(1);
				}
			}
        }, this, 'noframes').setOrigin(1, 1).setAlpha(0.25);

		// this.rulesContainer.y-=EPT.world.height*0.5*2;

		this.cameras.main.fadeIn(250);
	}
	clickBack(name) {
		EPT.Sfx.play('click');
		if(name) {
			if(name == 'language') {
				// EPT.fadeOutScene('Settings', this);
			}
			else {
				this.buttonBack.alpha = 1;
				this.toggleInput('enable');
				var that = this;
				EPT.fadeOutIn(function(){
					switch(name) {
						case 'credits': {
							that.containerCredits.y = EPT.world.height;
							break;
						}
						case 'copyright': {
							that.containerCopy.y = EPT.world.height;
							break;
						}
						case 'statistics': {
							that.containerStats.y = EPT.world.height;
							break;
						}
						default: {}
					}	
					// that.clickSettings();
				}, this);
				// this.screenName = 'settings';
			}
		}
		else {
			EPT.fadeOutScene('MainMenu', this);
		}
	}
	clickEnclave() {
		EPT.Sfx.play('click');
		window.top.location.href = 'https://enclavegames.com/';
	}
	clickMore() {
		EPT.Sfx.play('click');
		window.top.location.href = 'https://nshex.enclavegames.com/';
	}
	clickPortal() {
		EPT.Sfx.play('click');
		window.top.location.href = 'https://portalgames.pl/';
	}
	clickNeuroshimaHexpl() {
		EPT.Sfx.play('click');
		window.top.location.href = 'https://neuroshimahex.pl/';
	}
	clickCoil() {
		EPT.Sfx.play('click');
		window.top.location.href = 'https://coil.com/?ref=end3r';
	}
};