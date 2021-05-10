var EPT = {
	_width: 640,
	_height: 960,
	_bonus: { coins: 1, life: 0, slow: 0 },
	_manageAudio: function(mode, game) {
		switch(mode) {
			case 'init': {
				EPT.Storage.initUnset('EPT-audio', true);
				EPT._audioStatus = EPT.Storage.get('EPT-audio');
				EPT._sound = [];
				EPT._sound['click'] = game.add.audio('audio-click');
				if(!EPT._soundMusic) {
					EPT._soundMusic = game.add.audio('audio-theme',1,true);
					EPT._soundMusic.volume = 0.5;
				}
				break;
			}
			case 'on': {
				EPT._audioStatus = true;
				break;
			}
			case 'off': {
				EPT._audioStatus = false;
				break;
			}
			case 'switch': {
				EPT._audioStatus =! EPT._audioStatus;
				break;
			}
			default: {}
		}
		if(EPT._audioStatus) {
			EPT._audioOffset = 0;
			if(EPT._soundMusic) {
				if(!EPT._soundMusic.isPlaying) {
					EPT._soundMusic.play('',0,1,true);
				}
			}
		}
		else {
			EPT._audioOffset = 4;
			if(EPT._soundMusic) {
				EPT._soundMusic.stop();
			}
		}
		EPT.Storage.set('EPT-audio',EPT._audioStatus);
		game.buttonAudio.setFrames(EPT._audioOffset+1, EPT._audioOffset+0, EPT._audioOffset+2);
	},
	_playAudio: function(sound) {
		if(EPT._audioStatus) {
			if(EPT._sound && EPT._sound[sound]) {
				EPT._sound[sound].play();
			}
		}
	},
	_formatTime: function(seconds) {
		var sec_num = parseInt(seconds, 10);
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);
		// if (hours   < 10) {hours   = "0"+hours;}
		// if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		return minutes+':'+seconds;
	}
};
EPT.Boot = function(game){};
EPT.Boot.prototype = {
	preload: function(){
		this.stage.backgroundColor = '#111111';
		this.load.image('loading-background', 'img/loading-background.png');
		this.load.image('loading-progress', 'img/loading-progress.png');
	},
	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.state.start('Preloader');
	}
};