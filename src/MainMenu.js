class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
        this.bgFilesLoaded = false;
    }
    create() {
        this.add.sprite(0, 0, 'background').setOrigin(0, 0);
        var topbar = this.add.sprite(0, 0, 'img-topbar').setOrigin(0, 0);

        EPT.Storage.initUnset('NSHexRoulette-gameplays', 0);
        EPT.Stats.gameplays = EPT.Storage.get('NSHexRoulette-gameplays');
        EPT.Storage.initUnset('NSHexRoulette-spins', 0);
        EPT.Stats.spins = EPT.Storage.get('NSHexRoulette-spins');
        EPT.Storage.initUnset('NSHexRoulette-headshots', 0);
        EPT.Stats.headshots = EPT.Storage.get('NSHexRoulette-headshots');
        EPT.Storage.initUnset('NSHexRoulette-airbornes', 0);
        EPT.Stats.airbornes = EPT.Storage.get('NSHexRoulette-airbornes');
        EPT.Storage.initUnset('NSHexRoulette-detonations', 0);
        EPT.Stats.detonations = EPT.Storage.get('NSHexRoulette-detonations');
        EPT.Storage.initUnset('NSHexRoulette-raids', 0);
        EPT.Stats.raids = EPT.Storage.get('NSHexRoulette-raids');
        EPT.Storage.initUnset('NSHexRoulette-reanimations', 0);
        EPT.Stats.reanimations = EPT.Storage.get('NSHexRoulette-reanimations');
        EPT.Storage.initUnset('NSHexRoulette-berserks', 0);
        EPT.Stats.berserks = EPT.Storage.get('NSHexRoulette-berserks');

        this.waitingForSettings = false;
        this.waitingForStart = false;

        this.logoRoulette = this.add.sprite(EPT.world.centerX, 150, 'logo-roulette', 1);
        this.logoRoulette.setOrigin(0.5, 0.5);

        var fontMenuIntro = { font: EPT.text['STYLE']+'30px '+EPT.text['FONT'], fill: '#000', align: 'center' };
        this.add.text(EPT.world.centerX, 275, EPT.text['menu-intro'], fontMenuIntro).setOrigin(0.5, 0);

        this.buttonStart = new Button(EPT.world.centerX, 500, 'button-start-'+EPT.Lang.current, this.clickStart, this);
        this.buttonStart.setOrigin(0.5, 0.5);//.setAlpha(0.5);

        this.buttonRules = new Button(EPT.world.centerX, EPT.world.height-275, 'button-rules-'+EPT.Lang.current, this.clickRules, this).setOrigin(0.5);

        var tiles = this.add.sprite(EPT.world.centerX, EPT.world.height-100, 'img-tiles');
        tiles.setOrigin(0.5, 0.5);

        this.buttonSettings = new Button(EPT.world.width-20, EPT.world.height-20, 'button-settings', this.clickSettings, this, 'noframes').setOrigin(1, 1);

        this.cameras.main.fadeIn(250);

        this.time.addEvent({
            delay: 500,
            callback: function() {
                this.startPreloadInTheBackground();
            },
            callbackScope: this
          }, this);
    }
    clickSettings() {
        if(this.bgFilesLoaded) {
            EPT.Sfx.play('click');
            if(this.loadImage) {
                this.loadImage.destroy();
            }
            EPT.fadeOutScene('Settings', this);
        }
        else {
            var animationFrames = this.anims.generateFrameNumbers('loader');
            animationFrames.pop();
            this.waitingForSettings = true;
            this.buttonSettings.setAlpha(0.1);
            var loadAnimation = this.anims.create({
                key: 'loading',
                frames: animationFrames,
                frameRate: 12,
                repeat: -1
            });
            this.loadImage = this.add.sprite(EPT.world.width-30, EPT.world.height-30, 'loader').setOrigin(1,1).setScale(1.25);
            this.loadImage.play('loading');
        }
    }
    clickStart() {
        if(this.bgFilesLoaded) {
            EPT.Sfx.play('click');
            if(this.loadImageStart) {
                this.loadImageStart.destroy();
            }
            EPT.fadeOutScene('Game', this);
        }
        else {
            var animationFramesStart = this.anims.generateFrameNumbers('loader-yellow');
            animationFramesStart.pop();
            this.waitingForStart = true;
            var fakeButtonStart = this.add.sprite(EPT.world.centerX, 500, 'button-start-'+EPT.Lang.current, 3).setOrigin(0.5, 0.5);
            this.buttonStart.destroy();
            var loadAnimationStart = this.anims.create({
                key: 'loading',
                frames: animationFramesStart,
                frameRate: 12,
                repeat: -1
            });
            this.loadImageStart = this.add.sprite(EPT.world.centerX, 490, 'loader-yellow').setOrigin(0.5,0.5);
            this.loadImageStart.play('loading');
        }
    }
    clickRules() {
        if(this.bgFilesLoaded) {
            EPT.Sfx.play('click');
        }
        EPT.fadeOutScene('Rules', this);
    }
    startPreloadInTheBackground() {
        this.load.image('img/button-home');
        this.load.once('filecomplete', this.addFiles, this);
        this.load.start();
    }
    addFiles() {
		var resources = {
            'image': [
				['button-beer', 'img/button-beer.png'],
                ['banner-beer', 'img/banner-beer.png'],
                ['overlay', 'img/overlay.png'],
                ['logo-portalgames', 'img/logo-portalgames.png'],
				['logo-neuroshimahexpl', 'img/logo-neuroshimahexpl.png'],
                ['logo-coil', 'img/logo-coil.png'],
                ['logo-coil-black', 'img/logo-coil-black.png'],
                
                ['popup-bg', 'img/popup-bg.png'],
                ['text-areyousure-pl', 'img/lang/pl/text-areyousure.png'],
                ['text-areyousure-en', 'img/lang/en/text-areyousure.png']
            ],
			'spritesheet': [
				['button-statistics-en', 'img/lang/en/button-statistics.png', {frameWidth:300,frameHeight:85}],
				['button-more-en', 'img/lang/en/button-more.png', {frameWidth:300,frameHeight:85}],
				['button-language-en', 'img/lang/en/button-language.png', {frameWidth:300,frameHeight:85}],
				['button-credits-en', 'img/lang/en/button-credits.png', {frameWidth:300,frameHeight:85}],
				['button-copyright-en', 'img/lang/en/button-copyright.png', {frameWidth:300,frameHeight:85}],
                ['button-yes-en', 'img/lang/en/button-yes.png', {frameWidth:160,frameHeight:85}],
                ['button-no-en', 'img/lang/en/button-no.png', {frameWidth:160,frameHeight:85}],

                ['button-statistics-pl', 'img/lang/pl/button-statistics.png', {frameWidth:300,frameHeight:85}],
				['button-more-pl', 'img/lang/pl/button-more.png', {frameWidth:300,frameHeight:85}],
				['button-language-pl', 'img/lang/pl/button-language.png', {frameWidth:300,frameHeight:85}],
				['button-credits-pl', 'img/lang/pl/button-credits.png', {frameWidth:300,frameHeight:85}],
				['button-copyright-pl', 'img/lang/pl/button-copyright.png', {frameWidth:300,frameHeight:85}],
                ['button-yes-pl', 'img/lang/pl/button-yes.png', {frameWidth:160,frameHeight:85}],
                ['button-no-pl', 'img/lang/pl/button-no.png', {frameWidth:160,frameHeight:85}],

				['button-sound-on', 'img/button-sound-on.png', {frameWidth:160,frameHeight:85}],
				['button-sound-off', 'img/button-sound-off.png', {frameWidth:160,frameHeight:85}],
				['button-music-on', 'img/button-music-on.png', {frameWidth:160,frameHeight:85}],
				['button-music-off', 'img/button-music-off.png', {frameWidth:160,frameHeight:85}],
				['button-language-english-on', 'img/lang/button-language-english-on.png', {frameWidth:300,frameHeight:85}],
				['button-language-english-off', 'img/lang/button-language-english-off.png', {frameWidth:300,frameHeight:85}],
				['button-language-polish-on', 'img/lang/button-language-polish-on.png', {frameWidth:300,frameHeight:85}],
				['button-language-polish-off', 'img/lang/button-language-polish-off.png', {frameWidth:300,frameHeight:85}]
            ],
			'audio': [
                ['sound-click', ['sfx/audio-click.m4a','sfx/audio-click.mp3','sfx/audio-click.ogg']],
                ['sound-move', ['sfx/audio-move.m4a','sfx/audio-move.mp3','sfx/audio-move.ogg']],
                ['sound-gun-shot', ['sfx/audio-gun-shot.m4a','sfx/audio-gun-shot.mp3','sfx/audio-gun-shot.ogg']],
                ['sound-revolver-spin', ['sfx/audio-revolver-spin.m4a','sfx/audio-revolver-spin.mp3','sfx/audio-revolver-spin.ogg']],
				['music-theme', ['sfx/music-battle.m4a','sfx/music-battle.mp3','sfx/music-battle.ogg']]
			]
		};
		for(var method in resources) {
			resources[method].forEach(function(args) {
				var loader = this.load[method];
				loader && loader.apply(this.load, args);
			}, this);
        };
        this.load.on('complete', function(){
            console.log('[NSHex Roulette] All files loaded in the background.');
            this.bgFilesLoaded = true;
            EPT.Sfx.manage('music', 'init', this);
            EPT.Sfx.manage('sound', 'init', this);
            if(this.waitingForSettings) {
                this.clickSettings();
            }
            if(this.waitingForStart) {
                this.clickStart();
            }
        }, this);
    }
}