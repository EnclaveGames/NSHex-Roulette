class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }
    preload() {
        this.load.image('loading-background', 'img/loading-background.png');
        this.load.image('background-black', 'img/background-black.png');
        this.load.spritesheet('logo-roulette', 'img/logo-roulette.png', {frameWidth:450,frameHeight:123});
        this.load.spritesheet('logo-enclave', 'img/logo-enclave.png', {frameWidth:253,frameHeight:89});

        WebFont.load({ custom: { families: ['montserratbold'], urls: ['fonts/montserrat-bold.css'] } });
    }
    create() {
        EPT.world = {
            width: this.cameras.main.width,
            height: this.cameras.main.height,
            centerX: this.cameras.main.centerX,
            centerY: this.cameras.main.centerY
        };
        EPT.Lang.updateLanguage();
        EPT.text = EPT.Lang.text[EPT.Lang.current];
        this.scene.start('Preloader');
    }
}