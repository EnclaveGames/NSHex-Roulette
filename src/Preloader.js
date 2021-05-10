class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }
    preload() {
		this.add.sprite(0, 0, 'background-black').setOrigin(0, 0);
        var logoRoulette = this.add.sprite(EPT.world.centerX, 150, 'logo-roulette');
        logoRoulette.setOrigin(0.5, 0.5);
		var loadingBg = this.add.sprite(EPT.world.centerX, EPT.world.centerY-80, 'loading-background');
		loadingBg.setOrigin(0.5, 0.5);
        var logoEnclave = this.add.sprite(EPT.world.centerX, EPT.world.centerY+100, 'logo-enclave');
        logoEnclave.setOrigin(0.5, 0.5);

		var progress = this.add.graphics();
		this.load.on('progress', function (value) {
			progress.clear();
			progress.fillStyle(0xffde00, 1);
			progress.fillRect(loadingBg.x-(loadingBg.width*0.5)+20, loadingBg.y-(loadingBg.height*0.5)+10, 540 * value, 25);
		});

		var resources = {
			'image': [
				['background', 'img/background.png'],
				['background-overlay', 'img/background-overlay.png'],
				['overlay', 'img/overlay.png'],
				['button-settings', 'img/button-settings.png'],
				['button-home', 'img/button-home.png'],

				['button-back', 'img/button-back.png'],
				['button-up', 'img/button-up.png'],
				['button-down', 'img/button-down.png'],
                ['img-seethru', 'img/img-seethru.png'],

				['img-tiles', 'img/img-tiles.png'],
				['img-topbar', 'img/img-topbar.png'],
				['img-navbar', 'img/img-navbar.png'],
				['hex-border-color', 'img/hex-border-color.png'],
				['hex-border-pattern', 'img/hex-border-pattern.png'],
				['hex-shadow', 'img/hex-shadow.png'],

				['roulette-icons', 'img/roulette-icons.png'],
				['roulette-overlay', 'img/roulette-overlay.png'],
				['roulette-texture', 'img/roulette-texture.png'],
				['roulette-bg', 'img/roulette-bg.png'],
				['roulette-shadow', 'img/roulette-shadow.png'],
				['black', 'img/black.png']
			],
			'spritesheet': [
				['button-start-pl', 'img/lang/pl/button-start.png', {frameWidth:450,frameHeight:128}],
				['button-rules-pl', 'img/lang/pl/button-rules.png', {frameWidth:300,frameHeight:85}],
				['button-spin-pl', 'img/lang/pl/button-spin.png', {frameWidth:450,frameHeight:128}],

				['button-start-en', 'img/lang/en/button-start.png', {frameWidth:450,frameHeight:128}],
				['button-rules-en', 'img/lang/en/button-rules.png', {frameWidth:300,frameHeight:85}],
				['button-spin-en', 'img/lang/en/button-spin.png', {frameWidth:450,frameHeight:128}],

                ['button-yes-pl', 'img/lang/pl/button-yes.png', {frameWidth:160,frameHeight:85}],
                ['button-no-pl', 'img/lang/pl/button-no.png', {frameWidth:160,frameHeight:85}],
                ['button-yes-en', 'img/lang/en/button-yes.png', {frameWidth:160,frameHeight:85}],
                ['button-no-en', 'img/lang/en/button-no.png', {frameWidth:160,frameHeight:85}],

				['tiles', 'img/tiles.png', {frameWidth:122,frameHeight:106}],

				['loader', 'img/loader.png', {frameWidth:45,frameHeight:45}],
				['loader-yellow', 'img/loader-yellow.png', {frameWidth:90,frameHeight:90}]
			]
		};
		for(var method in resources) {
			resources[method].forEach(function(args) {
				var loader = this.load[method];
				loader && loader.apply(this.load, args);
			}, this);
		};
    }
    create() {
		// EPT.Sfx.manage('music', 'init', this);
		// EPT.Sfx.manage('sound', 'init', this);
		EPT.fadeOutScene('MainMenu', this);
	}
}