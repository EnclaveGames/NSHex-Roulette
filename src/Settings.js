class Settings extends Phaser.Scene {
    constructor() {
        super('Settings');
    }
    create() {
		this.add.sprite(0, 0, 'background').setOrigin(0, 0);
		this.screenName = 'settings';

		this.navbar = this.add.sprite(0, 0, 'img-navbar').setOrigin(0, 0);

		this.buttonBack = new Button(10, 10, 'button-back', this.clickBack, this, 'noframes').setOrigin(0, 0);

		var fontTitle = { font: EPT.text['STYLE']+'40px '+EPT.text['FONT'], fill: '#fff', align: 'center' };
		var fontSubtitle = { font: EPT.text['STYLE']+'38px '+EPT.text['FONT'], fill: '#000', align: 'center' };
		var fontSmall = { font: EPT.text['STYLE']+'28px '+EPT.text['FONT'], fill: '#000', align: 'center' };
		var fontTiny = { font: EPT.text['STYLE']+'20px '+EPT.text['FONT'], fill: '#fff' };

		this.titleSettings = this.add.text(EPT.world.centerX, 45, EPT.text['settings'], fontTitle);
		this.titleSettings.setOrigin(0.5, 0.5);
		
		this.containerSettingsBar = this.add.container(0, 0);
		this.containerSettingsBar.add([this.navbar,this.buttonBack,this.titleSettings]);

		this.buttonSound = new Button(EPT.world.centerX-100, 190, 'button-sound-on', this.clickSound, this).setOrigin(0.5);
		this.buttonMusic = new Button(EPT.world.centerX+100, 190, 'button-music-on', this.clickMusic, this).setOrigin(0.5);
		this.buttonLanguage = new Button(EPT.world.centerX, 320, 'button-language-'+EPT.Lang.current, this.clickLanguage, this).setOrigin(0.5);
		this.buttonCredits = new Button(EPT.world.centerX, 450, 'button-credits-'+EPT.Lang.current, this.clickCredits, this).setOrigin(0.5);
		this.buttonCopy = new Button(EPT.world.centerX, 580, 'button-copyright-'+EPT.Lang.current, this.clickCopy, this).setOrigin(0.5);
		this.buttonStatistics = new Button(EPT.world.centerX, 710, 'button-statistics-'+EPT.Lang.current, this.clickStatistics, this).setOrigin(0.5);
		this.buttonMore = new Button(EPT.world.centerX, 840, 'button-more-'+EPT.Lang.current, this.clickMore, this).setOrigin(0.5);

		EPT.Sfx.update('sound', this.buttonSound, this.textSound);
		EPT.Sfx.update('music', this.buttonMusic, this.textMusic);

		this.clickSettings();		

		var offsetTopCredits = 40;
		var offsetTopCrew = 540;
		this.containerCredits = this.add.container(0, EPT.world.height);
		var creditsBg = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
		this.navbarCredits = this.add.sprite(0, 0, 'img-navbar').setOrigin(0);
		this.creditsBack = new Button(10, 10, 'button-back', function(){this.clickBack('credits');}, this, 'noframes').setOrigin(0, 0);
		this.titleCredits = this.add.text(EPT.world.centerX, offsetTopCredits+5, EPT.text['credits'], fontTitle).setOrigin(0.5, 0.5);	
		this.titleCreditsApp = this.add.text(EPT.world.centerX, offsetTopCredits+140, EPT.text['appname'], fontSubtitle).setOrigin(0.5,0);
		this.titleCreditsText = this.add.text(EPT.world.centerX, offsetTopCredits+200, EPT.text['madeby'], fontSmall).setOrigin(0.5,0);
		this.titleCreditsLogo = this.add.sprite(EPT.world.centerX, offsetTopCredits+270, 'logo-enclave', 1).setOrigin(0.5,0);
		this.titleCreditsLogo.setInteractive({ useHandCursor: true });
		this.titleCreditsLogo.on('pointerdown', function() { this.clickEnclave(); }, this);
		this.titleCreditsUrl = this.add.text(EPT.world.centerX, offsetTopCredits+390, 'enclavegames.com', fontSmall).setOrigin(0.5,0);
		this.titleCreditsUrl.setInteractive({ useHandCursor: true });
		this.titleCreditsUrl.on('pointerdown', function() { this.clickEnclave(); }, this);
		this.titleCrew = this.add.text(EPT.world.centerX, offsetTopCrew, EPT.text['team'], fontSubtitle).setOrigin(0.5,0);
		this.titleCrewAndrzej = this.add.text(EPT.world.centerX, offsetTopCrew+80, 'Andrzej Mazur - '+EPT.text['coding'], fontSmall).setOrigin(0.5,0);
		this.titleCrewEwa = this.add.text(EPT.world.centerX, offsetTopCrew+140, 'Ewa Mazur - '+EPT.text['design'], fontSmall).setOrigin(0.5,0);
		this.titleCrewKasia = this.add.text(EPT.world.centerX, offsetTopCrew+200, 'Kasia Mazur - '+EPT.text['testing'], fontSmall).setOrigin(0.5,0);
		this.titleCreditsMusic = this.add.text(EPT.world.centerX, offsetTopCrew+320, EPT.text['musicby']+' Alexandr Zhelanov', fontSmall).setOrigin(0.5,0);
		this.containerCredits.add([creditsBg,this.navbarCredits,this.creditsBack,this.titleCredits,this.titleCreditsApp,this.titleCreditsText,this.titleCreditsLogo,this.titleCreditsUrl]);
		this.containerCredits.add([this.titleCrew,this.titleCrewAndrzej,this.titleCrewEwa,this.titleCrewKasia,this.titleCreditsMusic]);

		this.containerCopy = this.add.container(0, EPT.world.height);
		var copyBg = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
		this.navbarCopy = this.add.sprite(0, 0, 'img-navbar').setOrigin(0);
		this.copyBack = new Button(10, 10, 'button-back', function(){this.clickBack('copyright');}, this, 'noframes').setOrigin(0, 0);
		this.titleCopy = this.add.text(EPT.world.centerX, 45, EPT.text['copy-title'], fontTitle).setOrigin(0.5, 0.5);	
		this.titleCopyText1 = this.add.text(EPT.world.centerX, 150, EPT.text['copy-description1'], fontSmall).setOrigin(0.5,0);
		this.logoPortalGames = new Button(EPT.world.centerX, 370, 'logo-portalgames', this.clickPortal, this, 'noframes').setOrigin(0.5, 0.5);
		this.titleCopyText2 = this.add.text(EPT.world.centerX, 470, EPT.text['copy-description2'], fontSmall).setOrigin(0.5,0);
		this.logoNeuroshimaHexpl = new Button(EPT.world.centerX, 630, 'logo-neuroshimahexpl', this.clickNeuroshimaHexpl, this, 'noframes').setOrigin(0.5, 0.5);
		this.titleCopyText3 = this.add.text(EPT.world.centerX, 700, EPT.text['copy-description3'], fontSmall).setOrigin(0.5,0);
		this.logoEnclaveGames = this.add.sprite(EPT.world.centerX, 820, 'logo-enclave', 1).setOrigin(0.5, 0);
		this.logoEnclaveGames.setInteractive({ useHandCursor: true });
		this.logoEnclaveGames.on('pointerdown', function() { this.clickEnclave(); }, this);
		this.containerCopy.add([copyBg,this.navbarCopy,this.copyBack,this.titleCopy,this.titleCopyText1,this.logoPortalGames]);
		this.containerCopy.add([this.titleCopyText2,this.logoNeuroshimaHexpl,this.titleCopyText3,this.logoEnclaveGames]);

		this.containerLanguage = this.add.container(0, EPT.world.height);
		var languageBg = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
		this.navbarLanguage = this.add.sprite(0, 0, 'img-navbar').setOrigin(0);
		this.languageBack = new Button(10, 10, 'button-back', function(){this.clickBack('language');}, this, 'noframes').setOrigin(0, 0);
		this.titleLanguage = this.add.text(EPT.world.centerX, 45, EPT.text['language-title'], fontTitle).setOrigin(0.5);
		this.languageEnglish = new Button(EPT.world.centerX, 270, 'button-language-english-on', function(){ EPT.Sfx.play('click'); this.clickLanguageChange('en'); }, this).setOrigin(0.5);
		this.languagePolish = new Button(EPT.world.centerX, 420, 'button-language-polish-off', function(){ EPT.Sfx.play('click'); this.clickLanguageChange('pl'); }, this).setOrigin(0.5);
		this.languageHelp = this.add.text(EPT.world.centerX, 850, EPT.text['language-help'], fontSmall).setOrigin(0.5);
		this.containerLanguage.add([languageBg,this.navbarLanguage,this.languageBack,this.titleLanguage,this.languageEnglish,this.languagePolish,this.languageHelp]);
		this.clickLanguageChange(EPT.Lang.current);
		if(!EPT.Lang.foreign) {
			this.languageHelp.setText('');
		}

		this.containerStats = this.add.container(0, EPT.world.height);
		var statsBg = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
		this.navbarStats = this.add.sprite(0, 0, 'img-navbar').setOrigin(0);
		this.statsBack = new Button(10, 10, 'button-back', function(){this.clickBack('statistics');}, this, 'noframes').setOrigin(0, 0);
		this.statsTitle = this.add.text(EPT.world.centerX, 45, EPT.text['stats-title'], fontTitle).setOrigin(0.5, 0.5);
		if(document.monetization && document.monetization.state === 'started') {
			var statsBg2 = this.add.sprite(0, EPT.world.height+175, 'background-overlay').setOrigin(0, 1);
			var fontSize = fontSubtitle;

			var spinRatio = "~"+Math.floor(EPT.Stats.spins/EPT.Stats.gameplays).toFixed(0);
			if(EPT.Stats.spins == 0) { var spinRatio = 0+"%"; }
			var headshotRatio = "~"+Math.floor((EPT.Stats.headshots/EPT.Stats.spins).toFixed(2)*100)+"%";
			if(EPT.Stats.spins == 0) { var headshotRatio = 0+"%"; }
			var airborneRatio = "~"+Math.floor((EPT.Stats.airbornes/EPT.Stats.spins).toFixed(2)*100)+"%";
			if(EPT.Stats.airbornes == 0) { var airborneRatio = 0+"%"; }
			var detonationRatio = "~"+Math.floor((EPT.Stats.detonations/EPT.Stats.spins).toFixed(2)*100)+"%";
			if(EPT.Stats.detonations == 0) { var detonationRatio = 0+"%"; }
			var bombingraidRatio = "~"+Math.floor((EPT.Stats.bombingraids/EPT.Stats.spins).toFixed(2)*100)+"%";
			if(EPT.Stats.bombingraids == 0) { var bombingraidRatio = 0+"%"; }
			var reanimationRatio = "~"+Math.floor((EPT.Stats.reanimations/EPT.Stats.spins).toFixed(2)*100)+"%";
			if(EPT.Stats.airbornes == 0) { var reanimationRatio = 0+"%"; }
			var berserkRatio = "~"+Math.floor((EPT.Stats.berserks/EPT.Stats.spins).toFixed(2)*100)+"%";
			if(EPT.Stats.berserks == 0) { var berserkRatio = 0+"%"; }

			var offsetLeftImages = 20;
			var offsetLeftBg = 0;
			var offsetTopImages = 175;
			var offsetLeftStats = 145;
			var offsetTopStats = 170;
			var offsetLineStats = 82;

			this.statsImgBg1 = this.add.sprite(offsetLeftImages+offsetLeftBg, offsetTopImages+offsetLineStats*0, 'roulette-bg').setOrigin(0, 0.5).setScale(0.75,0.75);
			this.statsImgBg2 = this.add.sprite(offsetLeftImages+offsetLeftBg, offsetTopImages+offsetLineStats*1, 'roulette-bg').setOrigin(0, 0.5).setScale(0.75,0.75);
			this.statsImgBg3 = this.add.sprite(offsetLeftImages+offsetLeftBg, offsetTopImages+offsetLineStats*2, 'roulette-bg').setOrigin(0, 0.5).setScale(0.75,0.75);
			this.statsImgBg4 = this.add.sprite(offsetLeftImages+offsetLeftBg, offsetTopImages+offsetLineStats*3, 'roulette-bg').setOrigin(0, 0.5).setScale(0.75,0.75);
			this.statsImgBg5 = this.add.sprite(offsetLeftImages+offsetLeftBg, offsetTopImages+offsetLineStats*4, 'roulette-bg').setOrigin(0, 0.5).setScale(0.75,0.75);
			this.statsImgBg6 = this.add.sprite(offsetLeftImages+offsetLeftBg, offsetTopImages+offsetLineStats*5, 'roulette-bg').setOrigin(0, 0.5).setScale(0.75,0.75);
			this.statsImgBg7 = this.add.sprite(offsetLeftImages+offsetLeftBg, offsetTopImages+offsetLineStats*6, 'roulette-bg').setOrigin(0, 0.5).setScale(0.75,0.75);
			this.statsImgBg8 = this.add.sprite(offsetLeftImages+offsetLeftBg, offsetTopImages+offsetLineStats*7, 'roulette-bg').setOrigin(0, 0.5).setScale(0.75,0.75);

			// this.statsImgGameplaysShadow = this.add.sprite(offsetLeftImages+20, offsetTopImages+offsetLineStats*0, 'roulette-shadow').setOrigin(0, 0.5).setScale(0.1,0.1);
			this.statsImgGameplays = this.add.sprite(offsetLeftImages, offsetTopImages+offsetLineStats*0, 'tiles', 6).setOrigin(0, 0.5).setScale(0.75,0.75);
			this.statsImgSpins = this.add.sprite(offsetLeftImages, offsetTopImages+offsetLineStats*1, 'tiles', 7).setOrigin(0, 0.5).setScale(0.75,0.75);
			this.statsImgHeadshots = this.add.sprite(offsetLeftImages, offsetTopImages+offsetLineStats*2, 'tiles', 0).setOrigin(0, 0.5).setScale(0.75,0.75);
			this.statsImgAirbornes = this.add.sprite(offsetLeftImages, offsetTopImages+offsetLineStats*3, 'tiles', 1).setOrigin(0, 0.5).setScale(0.75,0.75);
			this.statsImgDetonations = this.add.sprite(offsetLeftImages, offsetTopImages+offsetLineStats*4, 'tiles', 2).setOrigin(0, 0.5).setScale(0.75,0.75);
			this.statsImgBombingRaids = this.add.sprite(offsetLeftImages, offsetTopImages+offsetLineStats*5, 'tiles', 3).setOrigin(0, 0.5).setScale(0.75,0.75);
			this.statsImgReanimations = this.add.sprite(offsetLeftImages, offsetTopImages+offsetLineStats*6, 'tiles', 4).setOrigin(0, 0.5).setScale(0.75,0.75);
			this.statsImgBerserks = this.add.sprite(offsetLeftImages, offsetTopImages+offsetLineStats*7, 'tiles', 5).setOrigin(0, 0.5).setScale(0.75,0.75);

			this.statsTextGameplays = this.add.text(offsetLeftStats, offsetTopStats, EPT.text['stats-gameplays']+": "+EPT.Stats.gameplays, fontSize).setOrigin(0, 0.5);
			this.statsTextSpins = this.add.text(offsetLeftStats, offsetTopStats+offsetLineStats, EPT.text['stats-spins']+": "+EPT.Stats.spins+" ("+spinRatio+" "+EPT.text['stats-pergame']+")", fontSize).setOrigin(0, 0.5);
			this.statsTextHeadshots = this.add.text(offsetLeftStats, offsetTopStats+offsetLineStats*2, EPT.text['stats-headshots']+": "+EPT.Stats.headshots+" ("+headshotRatio+")", fontSize).setOrigin(0, 0.5);
			this.statsTextAirbornes = this.add.text(offsetLeftStats, offsetTopStats+offsetLineStats*3, EPT.text['stats-airbornes']+": "+EPT.Stats.airbornes+" ("+airborneRatio+")", fontSize).setOrigin(0, 0.5);
			this.statsTextDetonations = this.add.text(offsetLeftStats, offsetTopStats+offsetLineStats*4, EPT.text['stats-detonations']+": "+EPT.Stats.detonations+" ("+detonationRatio+")", fontSize).setOrigin(0, 0.5);
			this.statsTextBombingRaids = this.add.text(offsetLeftStats, offsetTopStats+offsetLineStats*5, EPT.text['stats-bombingraids']+": "+EPT.Stats.bombingraids+" ("+bombingraidRatio+")", fontSize).setOrigin(0, 0.5);
			this.statsTextReanimations = this.add.text(offsetLeftStats, offsetTopStats+offsetLineStats*6, EPT.text['stats-reanimations']+": "+EPT.Stats.reanimations+" ("+reanimationRatio+")", fontSize).setOrigin(0, 0.5);
			this.statsTextBerserks = this.add.text(offsetLeftStats, offsetTopStats+offsetLineStats*7, EPT.text['stats-berserks']+": "+EPT.Stats.berserks+" ("+berserkRatio+")", fontSize).setOrigin(0, 0.5);

			this.statsTextCoil = this.add.text(20, EPT.world.height-20, EPT.text['stats-thanks1'], fontTiny).setOrigin(0, 1);
			// this.statsText1 = this.add.text(EPT.world.centerX, 170, EPT.text['stats-thanks1'], fontSmall).setOrigin(0.5,0);
			this.logoCoil = new Button(EPT.world.width-20, EPT.world.height-20, 'logo-coil', this.clickCoil, this, 'noframes').setOrigin(1, 1);
			// this.statsText2 = this.add.text(EPT.world.centerX, 500, EPT.text['stats-thanks2'], fontSmall).setOrigin(0.5,0);
			this.containerStats.add([statsBg,statsBg2,this.navbarStats,this.statsBack,this.statsTitle]);
			// this.containerStats.add([this.statsText1,this.logoCoil,this.statsText2]);
			this.containerStats.add([
				this.statsImgBg1,this.statsImgBg2,this.statsImgBg3,this.statsImgBg4,this.statsImgBg5,this.statsImgBg6,this.statsImgBg7,this.statsImgBg8,
				this.statsImgGameplays,this.statsImgSpins,this.statsImgHeadshots,
				this.statsImgAirbornes,this.statsImgDetonations,this.statsImgBombingRaids,this.statsImgReanimations,this.statsImgBerserks,
				this.statsTextGameplays,this.statsTextSpins,this.statsTextHeadshots,this.statsTextAirbornes,this.statsTextDetonations,
				this.statsTextBombingRaids,this.statsTextReanimations,this.statsTextBerserks,this.statsTextCoil,this.logoCoil
			]);
		}
		else {
			this.statsText1 = this.add.text(EPT.world.centerX, 170, EPT.text['stats-description1'], fontSmall).setOrigin(0.5,0);
			this.logoCoil = new Button(EPT.world.centerX, 390, 'logo-coil', this.clickCoil, this, 'noframes').setOrigin(0.5, 0.5);
			this.statsText2 = this.add.text(EPT.world.centerX, 490, EPT.text['stats-description2'], fontSmall).setOrigin(0.5,0);
			this.bannerBeer = new Button(EPT.world.centerX, 660, 'button-beer', this.clickBeer, this, 'noframes').setOrigin(0.5, 0.5).setScale(1.25);
			this.statsText3 = this.add.text(EPT.world.centerX, 760, EPT.text['stats-description3'], fontSmall).setOrigin(0.5,0);
			this.containerStats.add([statsBg,this.navbarStats,this.statsBack,this.statsTitle,this.statsText1]);
			this.containerStats.add([this.logoCoil,this.statsText2,this.bannerBeer,this.statsText3]);
		}

		this.cameras.main.fadeIn(250);
	}
	clickSound() {
		EPT.Sfx.play('click');
		EPT.Sfx.manage('sound', 'switch', this, this.buttonSound, this.textSound);
	}
	clickMusic() {
		EPT.Sfx.play('click');
		EPT.Sfx.manage('music', 'switch', this, this.buttonMusic, this.textMusic);
	}
	clickSettings() {
		this.buttonSound.setScale(0.5);
		this.tweens.add({targets: this.buttonSound, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });
		this.buttonMusic.setScale(0.5);
		this.tweens.add({targets: this.buttonMusic, scaleX: 1, scaleY: 1, duration: 500, delay: 62, ease: 'Cubic.easeOut' }); // 125
		this.buttonLanguage.setScale(0.5);
		this.tweens.add({targets: this.buttonLanguage, scaleX: 1, scaleY: 1, duration: 500, delay: 125, ease: 'Cubic.easeOut' }); // 250
		this.buttonCredits.setScale(0.5);
		this.tweens.add({targets: this.buttonCredits, scaleX: 1, scaleY: 1, duration: 500, delay: 187, ease: 'Cubic.easeOut' }); // 375
		this.buttonCopy.setScale(0.5);
		this.tweens.add({targets: this.buttonCopy, scaleX: 1, scaleY: 1, duration: 500, delay: 250, ease: 'Cubic.easeOut' }); // 500
		this.buttonStatistics.setScale(0.5);
		this.tweens.add({targets: this.buttonStatistics, scaleX: 1, scaleY: 1, duration: 500, delay: 312, ease: 'Cubic.easeOut' }); // 625
		this.buttonMore.setScale(0.5);
		this.tweens.add({targets: this.buttonMore, scaleX: 1, scaleY: 1, duration: 500, delay: 375, ease: 'Cubic.easeOut' });
	}
	clickCredits() {
		EPT.Sfx.play('click');

		var that = this;
		EPT.fadeOutIn(function(){
			that.containerCredits.y = 0;

			that.titleCreditsApp.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCreditsApp, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });
			that.titleCreditsText.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCreditsText, scaleX: 1, scaleY: 1, duration: 500, delay: 62, ease: 'Cubic.easeOut' });
			that.titleCreditsLogo.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCreditsLogo, scaleX: 1, scaleY: 1, duration: 500, delay: 125, ease: 'Cubic.easeOut' });
			that.titleCreditsUrl.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCreditsUrl, scaleX: 1, scaleY: 1, duration: 500, delay: 187, ease: 'Cubic.easeOut' });

			that.titleCrew.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCrew, scaleX: 1, scaleY: 1, duration: 500, delay: 250, ease: 'Cubic.easeOut' });
			that.titleCrewAndrzej.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCrewAndrzej, scaleX: 1, scaleY: 1, duration: 500, delay: 312, ease: 'Cubic.easeOut' });
			that.titleCrewEwa.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCrewEwa, scaleX: 1, scaleY: 1, duration: 500, delay: 375, ease: 'Cubic.easeOut' });
			that.titleCrewKasia.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCrewKasia, scaleX: 1, scaleY: 1, duration: 500, delay: 437, ease: 'Cubic.easeOut' });
			that.titleCreditsMusic.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCreditsMusic, scaleX: 1, scaleY: 1, duration: 500, delay: 500, ease: 'Cubic.easeOut' });
		}, this);

		this.toggleInput('disable');
		this.screenName = 'credits';
	}
	clickCopy() {
		EPT.Sfx.play('click');
		var that = this;
		EPT.fadeOutIn(function(){
			that.containerCopy.y = 0;

			that.titleCopyText1.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCopyText1, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });
			that.logoPortalGames.setScale(0.5, 0.5);
			that.tweens.add({targets: that.logoPortalGames, scaleX: 1, scaleY: 1, duration: 500, delay: 62, ease: 'Cubic.easeOut' });
			that.titleCopyText2.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCopyText2, scaleX: 1, scaleY: 1, duration: 500, delay: 125, ease: 'Cubic.easeOut' });
			that.logoNeuroshimaHexpl.setScale(0.5, 0.5);
			that.tweens.add({targets: that.logoNeuroshimaHexpl, scaleX: 1, scaleY: 1, duration: 500, delay: 187, ease: 'Cubic.easeOut' });
			that.titleCopyText3.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCopyText3, scaleX: 1, scaleY: 1, duration: 500, delay: 250, ease: 'Cubic.easeOut' });
			that.logoEnclaveGames.setScale(0.5, 0.5);
			that.tweens.add({targets: that.logoEnclaveGames, scaleX: 1, scaleY: 1, duration: 500, delay: 312, ease: 'Cubic.easeOut' });
		}, this);
		this.toggleInput('disable');
		this.screenName = 'copyright';
	}
	clickStatistics() {
		EPT.Sfx.play('click');
		var that = this;
		EPT.fadeOutIn(function(){
				that.containerStats.y = 0;
				var d=62.5;
			if(document.monetization && document.monetization.state === 'started') {
				that.statsTextGameplays.setScale(0.5, 0.5);
				that.tweens.add({targets: that.statsTextGameplays, scaleX: 1, scaleY: 1, duration: 500, delay: 0*d, ease: 'Cubic.easeOut' });
				that.statsTextSpins.setScale(0.5, 0.5);
				that.tweens.add({targets: that.statsTextSpins, scaleX: 1, scaleY: 1, duration: 500, delay: 1*d, ease: 'Cubic.easeOut' });
				that.statsTextHeadshots.setScale(0.5, 0.5);
				that.tweens.add({targets: that.statsTextHeadshots, scaleX: 1, scaleY: 1, duration: 500, delay: 2*d, ease: 'Cubic.easeOut' });
				that.statsTextAirbornes.setScale(0.5, 0.5);
				that.tweens.add({targets: that.statsTextAirbornes, scaleX: 1, scaleY: 1, duration: 500, delay: 3*d, ease: 'Cubic.easeOut' });
				that.statsTextDetonations.setScale(0.5, 0.5);
				that.tweens.add({targets: that.statsTextDetonations, scaleX: 1, scaleY: 1, duration: 500, delay: 4*d, ease: 'Cubic.easeOut' });
				that.statsTextBombingRaids.setScale(0.5, 0.5);
				that.tweens.add({targets: that.statsTextBombingRaids, scaleX: 1, scaleY: 1, duration: 500, delay: 5*d, ease: 'Cubic.easeOut' });
				that.statsTextReanimations.setScale(0.5, 0.5);
				that.tweens.add({targets: that.statsTextReanimations, scaleX: 1, scaleY: 1, duration: 500, delay: 6*d, ease: 'Cubic.easeOut' });
				that.statsTextBerserks.setScale(0.5, 0.5);
				that.tweens.add({targets: that.statsTextBerserks, scaleX: 1, scaleY: 1, duration: 500, delay: 7*d, ease: 'Cubic.easeOut' });
				that.statsTextCoil.setScale(0.5, 0.5);
				that.tweens.add({targets: that.statsTextCoil, scaleX: 1, scaleY: 1, duration: 500, delay: 8*d, ease: 'Cubic.easeOut' });
				that.logoCoil.setScale(0.5, 0.5);
				that.tweens.add({targets: that.logoCoil, scaleX: 1, scaleY: 1, duration: 500, delay: 8*d, ease: 'Cubic.easeOut' });
			}
			else {
				if(that.bannerBeer && that.statsText3) {
					that.statsText1.setScale(0.5, 0.5);
					that.tweens.add({targets: that.statsText1, scaleX: 1, scaleY: 1, duration: 500, delay: 0*d, ease: 'Cubic.easeOut' });
					that.logoCoil.setScale(0.5, 0.5);
					that.tweens.add({targets: that.logoCoil, scaleX: 1, scaleY: 1, duration: 500, delay: 1*d, ease: 'Cubic.easeOut' });
					that.statsText2.setScale(0.5, 0.5);
					that.tweens.add({targets: that.statsText2, scaleX: 1, scaleY: 1, duration: 500, delay: 2*d, ease: 'Cubic.easeOut' });
					that.bannerBeer.setScale(0.5, 0.5);
					that.tweens.add({targets: that.bannerBeer, scaleX: 1, scaleY: 1, duration: 500, delay: 3*d, ease: 'Cubic.easeOut' });
					that.statsText3.setScale(0.5, 0.5);
					that.tweens.add({targets: that.statsText3, scaleX: 1, scaleY: 1, duration: 500, delay: 4*d, ease: 'Cubic.easeOut' });
				}
			}
		}, this);
		this.toggleInput('disable');
		this.screenName = 'statistics';
	}
	clickLanguage() {
		EPT.Sfx.play('click');
		var that = this;
		EPT.fadeOutIn(function(){
			that.containerLanguage.y = 0;

			that.languageEnglish.setScale(0.5);
			that.tweens.add({targets: that.languageEnglish, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });
			that.languagePolish.setScale(0.5);
			that.tweens.add({targets: that.languagePolish, scaleX: 1, scaleY: 1, duration: 500, delay: 125, ease: 'Cubic.easeOut' });
			that.languageHelp.setScale(0.5);
			that.tweens.add({targets: that.languageHelp, scaleX: 1, scaleY: 1, duration: 500, delay: 250, ease: 'Cubic.easeOut' });
		}, this);
		this.toggleInput('disable');
		this.screenName = 'language';
	}
	clickLanguageChange(lang) {
		EPT.Lang.current = lang;
		EPT.text = EPT.Lang.text[lang];
		if(lang == 'en') {
			this.languageEnglish.setTexture('button-language-english-on');
			this.languagePolish.setTexture('button-language-polish-off');
		}
		else { // pl
			this.languageEnglish.setTexture('button-language-english-off');
			this.languagePolish.setTexture('button-language-polish-on');
		}
		this.titleLanguage.setFont(EPT.text['STYLE']+'40px '+EPT.text['FONT']);
		this.titleLanguage.setText(EPT.text['language-title']);
		EPT.Storage.set('EPT-language', lang);
	}
    clickBeer() {
        EPT.Sfx.play('click');
        window.top.location.href = 'https://www.paypal.me/end3r';
    }
	clickBack(name) {
		EPT.Sfx.play('click');
		if(name) {
			if(name == 'language') {
				EPT.fadeOutScene('Settings', this);
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
					that.clickSettings();
				}, this);
				this.screenName = 'settings';
			}
		}
		else {
			EPT.fadeOutScene('MainMenu', this);
		}
	}
	toggleInput(toggle) {
		if(toggle == 'disable') {
			this.buttonBack.input.enabled = false;
			this.buttonSound.input.enabled = false;
			this.buttonMusic.input.enabled = false;
			this.buttonLanguage.input.enabled = false;
			this.buttonCredits.input.enabled = false;
			this.buttonCopy.input.enabled = false;
			this.buttonStatistics.input.enabled = false;
			this.buttonMore.input.enabled = false;
		}
		else { // enable
			this.buttonBack.input.enabled = true;
			this.buttonSound.input.enabled = true;
			this.buttonMusic.input.enabled = true;
			this.buttonLanguage.input.enabled = true;
			this.buttonCredits.input.enabled = true;
			this.buttonCopy.input.enabled = true;
			this.buttonStatistics.input.enabled = true;
			this.buttonMore.input.enabled = true;
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