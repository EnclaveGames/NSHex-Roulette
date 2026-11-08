class Settings extends Phaser.Scene {
    constructor() {
        super('Settings');
    }
    create() {
		EPT.setWorldSize(this, EPT.isWide());
		EPT.watchLayout(this);
		var wide = EPT.world.width > 640;
		var cx = EPT.world.centerX;
		var L = wide ? 320 : cx, R = wide ? 960 : cx; // left and right column in landscape
		EPT.strip(this, 'background', 0, true);
		this.screenName = 'settings';

		this.navbar = EPT.strip(this, 'img-navbar', 0);

		this.buttonBack = new Button(10, 10, 'button-back', this.clickBack, this, 'noframes').setOrigin(0, 0);

		var fontTitle = { font: EPT.text['STYLE']+'40px '+EPT.text['FONT'], fill: '#fff', align: 'center' };
		var fontSubtitle = { font: EPT.text['STYLE']+'38px '+EPT.text['FONT'], fill: '#000', align: 'center' };
		var fontSmall = { font: EPT.text['STYLE']+'28px '+EPT.text['FONT'], fill: '#000', align: 'center' };
		var fontTiny = { font: EPT.text['STYLE']+'20px '+EPT.text['FONT'], fill: '#fff' };

		this.titleSettings = this.add.text(EPT.world.centerX, 45, EPT.text['settings'], fontTitle);
		this.titleSettings.setOrigin(0.5, 0.5);
		
		this.containerSettingsBar = this.add.container(0, 0);
		this.containerSettingsBar.add(this.navbar.concat([this.buttonBack,this.titleSettings]));

		this.buttonSound = new Button(cx-100, 190, 'button-sound-on', this.clickSound, this).setOrigin(0.5);
		this.buttonMusic = new Button(cx+100, 190, 'button-music-on', this.clickMusic, this).setOrigin(0.5);
		var bp = wide ? [[cx-190,320],[cx+190,320],[cx-190,440],[cx+190,440],[cx-190,560],[cx+190,560]] : [[cx,300],[cx,415],[cx,530],[cx,645],[cx,760],[cx,875]];
		this.buttonLanguage = new Button(bp[0][0], bp[0][1], 'button-language-'+EPT.Lang.current, this.clickLanguage, this).setOrigin(0.5);
		this.buttonCredits = new Button(bp[1][0], bp[1][1], 'button-credits-'+EPT.Lang.current, this.clickCredits, this).setOrigin(0.5);
		this.buttonCopy = new Button(bp[2][0], bp[2][1], 'button-copyright-'+EPT.Lang.current, this.clickCopy, this).setOrigin(0.5);
		this.buttonSupport = new Button(bp[3][0], bp[3][1], 'button-support-'+EPT.Lang.current, this.clickSupport, this).setOrigin(0.5);
		this.buttonStatistics = new Button(bp[4][0], bp[4][1], 'button-statistics-'+EPT.Lang.current, this.clickStatistics, this).setOrigin(0.5);
		this.buttonMore = new Button(bp[5][0], bp[5][1], 'button-more-'+EPT.Lang.current, this.clickMore, this).setOrigin(0.5);

		EPT.Sfx.update('sound', this.buttonSound, this.textSound);
		EPT.Sfx.update('music', this.buttonMusic, this.textMusic);

		this.clickSettings();		

		var offsetTopCredits = 40;
		var offsetTopCrew = wide ? 180 : 540;
		this.containerCredits = this.add.container(0, EPT.world.height);
		var creditsBg = EPT.strip(this, 'background', 0, true);
		this.navbarCredits = EPT.strip(this, 'img-navbar', 0);
		this.creditsBack = new Button(10, 10, 'button-back', function(){this.clickBack('credits');}, this, 'noframes').setOrigin(0, 0);
		this.titleCredits = this.add.text(cx, offsetTopCredits+5, EPT.text['credits'], fontTitle).setOrigin(0.5, 0.5);	
		this.titleCreditsApp = this.add.text(L, offsetTopCredits+140, EPT.text['appname'], fontSubtitle).setOrigin(0.5,0);
		this.titleCreditsText = this.add.text(L, offsetTopCredits+200, EPT.text['madeby'], fontSmall).setOrigin(0.5,0);
		this.titleCreditsLogo = this.add.sprite(L, offsetTopCredits+270, 'logo-enclave', 1).setOrigin(0.5,0);
		this.titleCreditsLogo.setInteractive({ useHandCursor: true });
		this.titleCreditsLogo.on('pointerdown', function() { this.clickEnclave(); }, this);
		this.titleCreditsUrl = this.add.text(L, offsetTopCredits+390, 'enclavegames.com', fontSmall).setOrigin(0.5,0);
		this.titleCreditsUrl.setInteractive({ useHandCursor: true });
		this.titleCreditsUrl.on('pointerdown', function() { this.clickEnclave(); }, this);
		this.titleCrew = this.add.text(R, offsetTopCrew, EPT.text['team'], fontSubtitle).setOrigin(0.5,0);
		this.titleCrewAndrzej = this.add.text(R, offsetTopCrew+80, 'Andrzej Mazur - '+EPT.text['coding'], fontSmall).setOrigin(0.5,0);
		this.titleCrewEwa = this.add.text(R, offsetTopCrew+140, 'Ewa Mazur - '+EPT.text['design'], fontSmall).setOrigin(0.5,0);
		this.titleCrewKasia = this.add.text(R, offsetTopCrew+200, 'Kasia Mazur - '+EPT.text['testing'], fontSmall).setOrigin(0.5,0);
		this.titleCreditsMusic = this.add.text(R, offsetTopCrew+320, EPT.text['musicby']+' Alexandr Zhelanov', fontSmall).setOrigin(0.5,0);
		this.containerCredits.add(creditsBg.concat(this.navbarCredits, [this.creditsBack,this.titleCredits,this.titleCreditsApp,this.titleCreditsText,this.titleCreditsLogo,this.titleCreditsUrl]));
		this.containerCredits.add([this.titleCrew,this.titleCrewAndrzej,this.titleCrewEwa,this.titleCrewKasia,this.titleCreditsMusic]);

		this.containerCopy = this.add.container(0, EPT.world.height);
		var copyBg = EPT.strip(this, 'background', 0, true);
		this.navbarCopy = EPT.strip(this, 'img-navbar', 0);
		this.copyBack = new Button(10, 10, 'button-back', function(){this.clickBack('copyright');}, this, 'noframes').setOrigin(0, 0);
		this.titleCopy = this.add.text(cx, 45, EPT.text['copy-title'], fontTitle).setOrigin(0.5, 0.5);	
		this.titleCopyText1 = this.add.text(L, 150, EPT.text['copy-description1'], fontSmall).setOrigin(0.5,0);
		this.logoPortalGames = new Button(L, 370, 'logo-portalgames', this.clickPortal, this, 'noframes').setOrigin(0.5, 0.5);
		this.titleCopyText2 = this.add.text(L, 470, EPT.text['copy-description2'], fontSmall).setOrigin(0.5,0);
		this.logoNeuroshimaHexpl = new Button(R, wide ? 240 : 630, 'logo-neuroshimahexpl', this.clickNeuroshimaHexpl, this, 'noframes').setOrigin(0.5, 0.5);
		this.titleCopyText3 = this.add.text(R, wide ? 310 : 700, EPT.text['copy-description3'], fontSmall).setOrigin(0.5,0);
		this.logoEnclaveGames = this.add.sprite(R, wide ? 440 : 820, 'logo-enclave', 1).setOrigin(0.5, 0);
		this.logoEnclaveGames.setInteractive({ useHandCursor: true });
		this.logoEnclaveGames.on('pointerdown', function() { this.clickEnclave(); }, this);
		this.containerCopy.add(copyBg.concat(this.navbarCopy, [this.copyBack,this.titleCopy,this.titleCopyText1,this.logoPortalGames]));
		this.containerCopy.add([this.titleCopyText2,this.logoNeuroshimaHexpl,this.titleCopyText3,this.logoEnclaveGames]);

		this.containerLanguage = this.add.container(0, EPT.world.height);
		var languageBg = EPT.strip(this, 'background', 0, true);
		this.navbarLanguage = EPT.strip(this, 'img-navbar', 0);
		this.languageBack = new Button(10, 10, 'button-back', function(){this.clickBack('language');}, this, 'noframes').setOrigin(0, 0);
		this.titleLanguage = this.add.text(cx, 45, EPT.text['language-title'], fontTitle).setOrigin(0.5);
		this.languageEnglish = new Button(cx, wide ? 220 : 270, 'button-language-english-on', function(){ EPT.Sfx.play('click'); this.clickLanguageChange('en'); }, this).setOrigin(0.5);
		this.languagePolish = new Button(cx, wide ? 370 : 420, 'button-language-polish-off', function(){ EPT.Sfx.play('click'); this.clickLanguageChange('pl'); }, this).setOrigin(0.5);
		this.languageHelp = this.add.text(cx, wide ? 600 : 850, EPT.text['language-help'], fontSmall).setOrigin(0.5);
		this.containerLanguage.add(languageBg.concat(this.navbarLanguage, [this.languageBack,this.titleLanguage,this.languageEnglish,this.languagePolish,this.languageHelp]));
		this.clickLanguageChange(EPT.Lang.current);
		if(!EPT.Lang.foreign) {
			this.languageHelp.setText('');
		}

		this.containerSupport = this.add.container(0, EPT.world.height);
		var supportBg = EPT.strip(this, 'background', 0, true);
		this.navbarSupport = EPT.strip(this, 'img-navbar', 0);
		this.supportBack = new Button(10, 10, 'button-back', function(){this.clickBack('support');}, this, 'noframes').setOrigin(0, 0);
		this.supportTitle = this.add.text(cx, 45, EPT.text['support-title'], fontTitle).setOrigin(0.5, 0.5);
		this.supportText1 = this.add.text(cx, 190, EPT.text['support-text1'], fontSmall).setOrigin(0.5,0);
		this.bannerBeer = new Button(cx, 400, 'button-beer', this.clickBeer, this, 'noframes').setOrigin(0.5, 0.5).setScale(1.5);
		this.supportText2 = this.add.text(cx, 500, EPT.text['support-text2'], fontSmall).setOrigin(0.5,0);
		this.containerSupport.add(supportBg.concat(this.navbarSupport, [this.supportBack,this.supportTitle,this.supportText1,this.bannerBeer,this.supportText2]));

		this.containerStats = this.add.container(0, EPT.world.height);
		var statsBg = EPT.strip(this, 'background', 0, true);
		this.navbarStats = EPT.strip(this, 'img-navbar', 0);
		this.statsBack = new Button(10, 10, 'button-back', function(){this.clickBack('statistics');}, this, 'noframes').setOrigin(0, 0);
		this.statsTitle = this.add.text(cx, 45, EPT.text['stats-title'], fontTitle).setOrigin(0.5, 0.5);
		{
			var ratio = function(count, total) { return total == 0 || count == 0 ? "0%" : "~"+Math.floor((count/total).toFixed(2)*100)+"%"; };
			var spinRatio = EPT.Stats.gameplays == 0 ? "0" : "~"+Math.floor(EPT.Stats.spins/EPT.Stats.gameplays);
			var rows = [
				[6, 'stats-gameplays', EPT.Stats.gameplays],
				[7, 'stats-spins', EPT.Stats.spins+" ("+spinRatio+" "+EPT.text['stats-pergame']+")"],
				[0, 'stats-headshots', EPT.Stats.headshots+" ("+ratio(EPT.Stats.headshots, EPT.Stats.spins)+")"],
				[1, 'stats-airbornes', EPT.Stats.airbornes+" ("+ratio(EPT.Stats.airbornes, EPT.Stats.spins)+")"],
				[2, 'stats-detonations', EPT.Stats.detonations+" ("+ratio(EPT.Stats.detonations, EPT.Stats.spins)+")"],
				[3, 'stats-bombingraids', EPT.Stats.bombingraids+" ("+ratio(EPT.Stats.bombingraids, EPT.Stats.spins)+")"],
				[4, 'stats-reanimations', EPT.Stats.reanimations+" ("+ratio(EPT.Stats.reanimations, EPT.Stats.spins)+")"],
				[5, 'stats-berserks', EPT.Stats.berserks+" ("+ratio(EPT.Stats.berserks, EPT.Stats.spins)+")"]
			];
			var offsetLineStats = wide ? 110 : 82;
			var perColumn = wide ? 4 : 8;
			this.containerStats.add(statsBg.concat(this.navbarStats, [this.statsBack,this.statsTitle]));
			this.statsTexts = [];
			for(var i = 0; i < rows.length; i++) {
				var col = Math.floor(i/perColumn), line = i%perColumn;
				var left = wide ? 40+col*640 : 20;
				var y = (wide ? 190 : 175)+offsetLineStats*line;
				var bg = this.add.sprite(left, y, 'roulette-bg').setOrigin(0, 0.5).setScale(0.75,0.75);
				var img = this.add.sprite(left, y, 'tiles', rows[i][0]).setOrigin(0, 0.5).setScale(0.75,0.75);
				var text = this.add.text(left+125, y, EPT.text[rows[i][1]]+": "+rows[i][2], fontSubtitle).setOrigin(0, 0.5);
				if(wide) { text.setFontSize(30); }
				this.statsTexts.push(text);
				this.containerStats.add([bg,img,text]);
			}
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
		this.tweens.add({targets: this.buttonMore, scaleX: 1, scaleY: 1, duration: 500, delay: 437, ease: 'Cubic.easeOut' });
		this.buttonSupport.setScale(0.5);
		this.tweens.add({targets: this.buttonSupport, scaleX: 1, scaleY: 1, duration: 500, delay: 312, ease: 'Cubic.easeOut' });
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
			that.statsTexts.forEach(function(text, i) {
				text.setScale(0.5, 0.5);
				that.tweens.add({targets: text, scaleX: 1, scaleY: 1, duration: 500, delay: i*62.5, ease: 'Cubic.easeOut' });
			});
		}, this);
		this.toggleInput('disable');
		this.screenName = 'statistics';
	}
	clickSupport() {
		EPT.Sfx.play('click');
		var that = this;
		EPT.fadeOutIn(function(){
			that.containerSupport.y = 0;
			that.supportText1.setScale(0.5, 0.5);
			that.tweens.add({targets: that.supportText1, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });
			that.bannerBeer.setScale(0.75, 0.75);
			that.tweens.add({targets: that.bannerBeer, scaleX: 1.5, scaleY: 1.5, duration: 500, delay: 62, ease: 'Cubic.easeOut' });
			that.supportText2.setScale(0.5, 0.5);
			that.tweens.add({targets: that.supportText2, scaleX: 1, scaleY: 1, duration: 500, delay: 125, ease: 'Cubic.easeOut' });
		}, this);
		this.toggleInput('disable');
		this.screenName = 'support';
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
						case 'support': {
							that.containerSupport.y = EPT.world.height;
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
			this.buttonSupport.input.enabled = false;
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
			this.buttonSupport.input.enabled = true;
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
};