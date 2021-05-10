EPT.Preloader = function(game) {};
EPT.Preloader.prototype = {
	preload: function() {
		var preloadBG = this.add.sprite((this.world.width-580)*0.5, (this.world.height+150)*0.5, 'loading-background');
		var preloadProgress = this.add.sprite((this.world.width-540)*0.5, (this.world.height+170)*0.5, 'loading-progress');
		this.load.setPreloadSprite(preloadProgress);
		WebFont.load({ custom: { families: ['Alfa'], urls: ['fonts/alfa.css'] } });
		this._preloadResources();
	},
	_preloadResources() {
		var pack = EPT.Preloader.resources;
		for(var method in pack) {
			pack[method].forEach(function(args) {
				var loader = this.load[method];
				loader && loader.apply(this.load, args);
			}, this);
		}
	},
	create: function() {
		this.time.events.add(Phaser.Timer.SECOND*0.2, function() {
			this.state.start('Wheel');
		}, this);
	}
};
EPT.Preloader.resources = {
	'image': [
		['background', 'img/background.png'],
		// ['title', 'img/title.png'],
		['logo-enclave', 'img/logo-enclave.png'],
		// ['clickme', 'img/clickme.png'],
		['overlay', 'img/overlay.png'],
		// ['button-beer', 'img/button-beer.png'],
		['icon-coin', 'img/icon-coin.png'],
		// ['wheel-spinner', 'img/wheel-spinner.png'],
		// ['wheel-shadow', 'img/wheel-shadow.png'],
		// ['wheel-indicator', 'img/wheel-indicator.png'],
		['roulette-icons', 'img/roulette-icons.png'],
		['roulette-overlay', 'img/roulette-overlay.png'],
		['roulette-texture', 'img/roulette-texture.png'],
		['roulette-bg', 'img/roulette-bg.png'],
		['particle', 'img/particle.png'],
		['black', 'img/black.png'],
		// ['red', 'img/red.png'],
		['box', 'img/box.png']
	],
	'spritesheet': [
		// ['button-start', 'img/button-start.png', 180, 180],
		// ['button-continue', 'img/button-continue.png', 180, 180],
		// ['button-mainmenu', 'img/button-mainmenu.png', 180, 180],
		// ['button-restart', 'img/button-tryagain.png', 180, 180],
		// ['button-achievements', 'img/button-achievements.png', 110, 110],
		// ['button-pause', 'img/button-pause.png', 80, 80],
		// ['button-audio', 'img/button-sound.png', 80, 80],
		// ['button-back', 'img/button-back.png', 70, 70],

		['tiles', 'img/tiles.png', 122, 106],
		['button-spin', 'img/button-spin.png', 262, 117],
		['button-info', 'img/button-info.png', 103, 103],
		// ['button-wheel-border', 'img/button-wheel-border.png', 80, 80],
		// ['button-wheel-spinning', 'img/button-wheel-spinning.png', 80, 80],
		// ['button-wheel-static', 'img/button-wheel-static.png', 80, 80]
	],
	'audio': [
		['audio-click', ['sfx/audio-button.m4a','sfx/audio-button.mp3','sfx/audio-button.ogg']],
		['audio-theme', ['sfx/music-bitsnbites-liver.m4a','sfx/music-bitsnbites-liver.mp3','sfx/music-bitsnbites-liver.ogg']]
	]
};
