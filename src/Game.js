class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    create() {
        EPT.setWorldSize(this, EPT.isWide());
        var keep = EPT._rouletteRun; // set when the layout changes mid-game, so the spins already made are not lost
        EPT._rouletteRun = null;
        // called only when the layout is about to change: wait for the spin, then remember the run
        EPT.watchLayout(this, function() {
            if(this.spinning) { return true; }
            EPT._rouletteRun = { slices: this.sliceIndexes, degrees: this.degrees || 0, prize: this.prize };
            return false;
        });
        var wide = EPT.world.width > 640;
        this.wide = wide;
        EPT.strip(this, 'background', 0, true);
        if(wide) { this.add.sprite(EPT.world.width-640, EPT.world.height-307, 'background-overlay').setOrigin(0, 0); }
        else { EPT.strip(this, 'background-overlay', EPT.world.height-307); }
        EPT.WakeLock.start();
        this.events.once('shutdown', function() { EPT.WakeLock.stop(); });
        this.spinning = false;
        // the wheel stays on the left in landscape, the spin button and the result go to the right
        this.panelX = wide ? 940 : EPT.world.centerX;

        this.sliceNames = [
            EPT.text['rules-tile6-title'],
            EPT.text['rules-tile1-title'],
            EPT.text['rules-tile2-title'],
            EPT.text['rules-tile3-title'],
            EPT.text['rules-tile4-title'],
            EPT.text['rules-tile5-title']
        ];
        this.statsSlugs = [
            EPT.text['rules-tile6-slug'],
            EPT.text['rules-tile1-slug'],
            EPT.text['rules-tile2-slug'],
            EPT.text['rules-tile3-slug'],
            EPT.text['rules-tile4-slug'],
            EPT.text['rules-tile5-slug']
        ];
        this.sliceDesc = [
            EPT.text['rules-tile6-text'],
            EPT.text['rules-tile1-text'],
            EPT.text['rules-tile2-text'],
            EPT.text['rules-tile3-text'],
            EPT.text['rules-tile4-text'],
            EPT.text['rules-tile5-text']
        ];

        this.sliceIndexes = [0,1,2,3,4,5];
        if(keep) { this.sliceIndexes = keep.slices.slice(); }

        this.fontTitle = { font: "56px Berlin", fill: "#FFF", stroke: "#000", strokeThickness: 4, align: "center" };
        var fontTitle = { font: "56px Berlin", fill: "#FFF", stroke: "#000", strokeThickness: 4, align: "center" };
        this.fontPopup  = { font: EPT.text['STYLE']+'24px '+EPT.text['FONT'], fill: '#000', align: 'center' };
        var fontDigits = { font: EPT.text['STYLE']+'36px '+EPT.text['FONT'], fill: '#fff', stroke: '#000', strokeThickness: 6, align: 'center' };

        this.initTiles();

        this.counterOverall = this.add.text(EPT.world.width-20, 20, " / 5", fontDigits);
        this.counterOverall.setOrigin(1, 0);
        this.counterCurrent = this.add.text(EPT.world.width-78, 20, "5", fontDigits);
        this.counterCurrent.setOrigin(1, 0);

        var wheelX = wide ? 340 : EPT.world.centerX;
        var wheelY = wide ? 360 : EPT.world.centerY-190;
        this.wheelX = wheelX;
        this.wheelY = wheelY;

        var wheelShadow = this.add.sprite(wheelX, wheelY, 'roulette-shadow');
        wheelShadow.setOrigin(0.5);

        this.wheelContainer = this.add.container(wheelX, wheelY);

        this.wheel = this.add.sprite(0, 0, 'roulette-icons');

        this.wheel.setOrigin(0.5);

        this.wheelContainer.add(this.wheel);

        this.buttonSpin = new Button(this.panelX, wide ? 215 : EPT.world.centerY+165, 'button-spin-'+EPT.Lang.current, this.spin, this);
        this.buttonSpin.setOrigin(0.5, 0.5);
        this.prizeText = this.add.text(this.panelX, wide ? 330 : 755, "", fontTitle);
        this.prizeText.setOrigin(0.5);

        this.buttonBack = new Button(0, 0, 'button-home', this.popupShow, this, 'noframes');
        this.buttonBack.setOrigin(0, 0);

        var wheelShadow = this.add.sprite(wheelX, wheelY, 'roulette-overlay');
        wheelShadow.setOrigin(0.5);
        var wheelIndicator = this.add.sprite(wheelX, wheelY, 'roulette-texture');
        wheelIndicator.setOrigin(0.5);

        this.enableSpinning();

        this.popupInit();

        if(keep) {
            for(var mark = 1; mark <= 5; mark++) {
                if(this.sliceIndexes.indexOf(mark) < 0) { this.black1 = this.addMark(mark, 1); }
            }
            this.degrees = keep.degrees;
            this.prize = keep.prize;
            this.wheelContainer.setAngle(keep.degrees);
            this.counterCurrent.setText(""+(this.sliceIndexes.length-1));
            if(keep.prize !== undefined) {
                this.showTile(keep.prize);
                this.tileImg.alpha = 1;
            }
            if(this.sliceIndexes.length-1 <= 0) { this.disableSpinning(); }
        }

        this.cameras.main.fadeIn(250);
    }
    // black X over a wheel slice that is used up; it rotates together with the wheel
    addMark(index, alpha) {
        var container = this.add.container(0, 0);
        var mark = this.add.sprite(50, 0, 'black');
        mark.setOrigin(1,1);
        container.add(mark);
        container.angle = 360 - index*60;
        this.wheelContainer.add(container);
        mark.alpha = alpha;
        return mark;
    }
    spin(){
        if(this.canSpin){
            EPT.Sfx.play('spin');
            EPT.haptic(15);
            this.spinning = true;
            this.disableSpinning();
            this.hideTile();
            this.prizeText.text = "";
            var rounds = Phaser.Math.Between(2, 3);

            var randomX = Math.floor(Math.random()*this.sliceIndexes.length);
            var randomIndex = this.sliceIndexes[randomX];

            if(randomIndex != 0) {
                (this.sliceIndexes).splice(randomX,1);
            }

            this.degrees = randomIndex*60;
            this.prize = randomIndex;

            var that = this;
            var spinTween = this.tweens.add({
                targets: this.wheelContainer,
                angle: 360 * rounds + this.degrees,
                ease: 'Quad.easeInOut',
                duration: 3000,
                yoyo: false,
                repeat: 0,
                onComplete: function () {
                    var timedEvent = that.time.delayedCall(1000, function(){
                        if(that.black1) {
                            var moveTween = that.tweens.add({targets: that.black1, alpha: 1, ease: 'Linear', duration: 500});
                            
                            this.counterCurrent.setText(""+(this.sliceIndexes.length-1));
                        }
                    }, [], that);
                    that.winPrize();
                }
            });

            if(randomIndex != 0) {
                this.black1 = this.addMark(randomIndex, 0); // black X
            }

            if(this.sliceIndexes.length == 1) {
                EPT.Stats.gameplays += 1;
                EPT.Storage.set('NSHexRoulette-gameplays',EPT.Stats.gameplays);
            }
        }
    }
    initTiles() {
        var posX = this.panelX-(589/2);
        var posY = this.wide ? 400 : EPT.world.centerY+250;
        this.tileContainer = this.add.container(posX, posY);

        var fontTitle = { font: "42px Berlin", fill: "#FFF" };
        var fontDescription = {
            'en': { font: "26px Berlin", fill: "#FFF" },
            'pl': { font: "21px Arial", fill: "#FFF" }
        };

        this.tileBg = this.add.sprite(15, 40, 'roulette-bg');
        this.tileBg.setOrigin(0, 0);

        this.tileImg = this.add.sprite(75, 92, 'tiles', 8);
        this.tileImg.setOrigin(0.5, 0.5);

        this.tileTitle = this.add.text(170, 10, "-", fontTitle);
        this.tileTitle.setOrigin(0, 0);

        this.tileDescription = this.add.text(170, 70, "-", fontDescription[EPT.Lang.current]);
        this.tileDescription.setOrigin(0, 0);
        this.tileDescription.lineSpacing = -3;

        this.tileContainer.add(this.tileBg);
        this.tileContainer.add(this.tileImg);
        this.tileContainer.add(this.tileTitle);
        this.tileContainer.add(this.tileDescription);

        this.tileImg.alpha = 0;
        this.tileContainer.alpha = 0;
    }
    showTile(tileName) {
        this.tweens.add({targets: this.tileContainer, alpha: 1, ease: 'Linear', duration: 100});
        this.tileImg.setFrame(tileName);
        this.tileTitle.setText(this.sliceNames[tileName]);
        this.tileDescription.setText(this.sliceDesc[tileName]);
        this.tileBg.alpha = 1;
    }
    hideTile() {
        this.tileImg.alpha = 0;
        this.tweens.add({targets: this.tileContainer, alpha: 0, ease: 'Linear', duration: 100});
    }
    winPrize(){
        EPT.Stats['spins'] += 1;
        EPT.Storage.set('NSHexRoulette-spins',EPT.Stats.spins);

        var slug = this.statsSlugs[this.prize];
        if(slug == 'headshots') {
            EPT.Sfx.play('shot');
        }
        else {
            EPT.Sfx.play('move');
        }
        if(EPT.Stats[slug] != null || EPT.Stats[slug] != undefined) {
            EPT.Stats[slug] += 1;
            EPT.Storage.set('NSHexRoulette-'+slug,EPT.Stats[slug]);
        }

        this.showTile(this.prize);

        EPT.haptic([10, 30, 10]);
        var tweenedCoin = this.add.sprite(this.wheelX, this.wheelY-144, 'tiles', this.prize);
        tweenedCoin.setOrigin(0.5,0.5);
        tweenedCoin.alpha = 0;

        this.tweens.add({targets: tweenedCoin, alpha: 1, ease: 'Linear', duration: 200});

        var that = this;
        this.tweens.add({
            targets: tweenedCoin,
            x: this.tileContainer.x+this.tileImg.x,
            y: this.tileContainer.y+this.tileImg.y,
            ease: 'Quad.easeInOut', // 'Linear'
            duration: 500,
            delay: 250,
            yoyo: false,
            repeat: 0,
            onComplete: function () {
                tweenedCoin.destroy();
                that.spinning = false;
                that.tileImg.alpha = 1;
                that.enableSpinning();

                if(that.sliceIndexes.length-1 <= 0) {
                    that.disableSpinning();
                }
            }
        });
    }
    spawnEmitter(item, particle, number, lifespan, frequency, offsetX, offsetY, gravity) {
        offsetX = offsetX || 0;
        offsetY = offsetY || 0;
        lifespan = lifespan || 2000;
        frequency = frequency || 0;
        var emitter = this.game.add.emitter(item.x+offsetX, item.y+offsetY, number);
        emitter.maxParticles = number;
        emitter.makeParticles(particle);
        emitter.setXSpeed(-300, 300);
        emitter.setYSpeed(-400, 200);
        emitter.setScale(1.75, 1.25, 1.75, 1.25, 500, Phaser.Easing.Linear.None);
        emitter.gravity = 250;
        emitter.start(false, lifespan, frequency, number);
    }
    spawnNewEmitter(item) {
        var particles = this.add.particles('particle');
        var emitter = particles.createEmitter();
        emitter.setPosition(item.x, item.y);
        emitter.setSpeed(200);
        emitter.setBlendMode(Phaser.BlendModes.ADD);
    }
    popupInit() {
        this.popupOverlay = this.add.sprite(0, EPT.world.height, 'overlay').setOrigin(0, 0).setAlpha(0.75).setDisplaySize(EPT.world.width, EPT.world.height);
        this.popupContainer = this.add.container(0, EPT.world.height);
        var popupBg = this.add.sprite(EPT.world.centerX, 200, 'popup-bg').setOrigin(0.5);
        var popupTitle = this.add.sprite(EPT.world.centerX, 130, 'text-areyousure-'+EPT.Lang.current).setOrigin(0.5);
        var popupText = this.add.text(EPT.world.centerX, 235, EPT.text['popup-lostprogress'], this.fontPopup).setOrigin(0.5);
        var popupYes = new Button(EPT.world.centerX-100, 340, 'button-yes-'+EPT.Lang.current, function(){ this.clickBack(); }, this).setOrigin(0.5);
        var popupNo = new Button(EPT.world.centerX+100, 340, 'button-no-'+EPT.Lang.current, function(){ this.popupHide(); }, this).setOrigin(0.5);
        this.popupContainer.add([popupBg,popupTitle,popupText,popupYes,popupNo]);
    }
    popupShow() {
        if(this.sliceIndexes.length > 1) {
            EPT.Sfx.play('click');
            this.popupOverlay.y = 0;
            this.popupOverlay.setAlpha(0);
            this.tweens.add({targets: this.popupOverlay, alpha: 0.75, duration: 150, ease: 'Linear'});
            this.popupContainer.x = EPT.world.centerX;
            this.popupContainer.y = 360;
            this.popupContainer.setScale(0);
            this.tweens.add({targets: this.popupContainer, x: 0, y: 140, scaleX: 1, scaleY: 1, duration: 350, ease: 'Back'});
        }
        else {
            this.clickBack();
        }
    }
    popupHide() {
        EPT.Sfx.play('click');
        this.tweens.add({targets: this.popupOverlay, alpha: 0, duration: 150, ease: 'Linear'});
        this.tweens.add({targets: this.popupContainer, x: EPT.world.centerX, y: 360, scaleX: 0, scaleY: 0, duration: 150, ease: 'Linear', onComplete: function(){
            if(!this.popupOverlay || !this.popupContainer || !this.popupOverlay.scene) { return; }
            this.popupOverlay.setAlpha(0.75);
            this.popupOverlay.y = EPT.world.height;
            this.popupContainer.y = EPT.world.height;
            this.popupContainer.setScale(1);
        }, callbackScope: this});
    }
    disableSpinning() {
        this.canSpin = false;
        this.buttonSpin.setFrame(3);
        this.buttonSpin.on('pointerup', function() { this.buttonSpin.setFrame(3); }, this);
        this.buttonSpin.on('pointerdown', function() { this.buttonSpin.setFrame(3); }, this);
        this.buttonSpin.on('pointerover', function() { this.buttonSpin.setFrame(3); }, this);
        this.buttonSpin.on('pointerout', function() { this.buttonSpin.setFrame(3); }, this);
    }
    enableSpinning() {
        this.canSpin = true;
        this.buttonSpin.setFrame(0);
        this.buttonSpin.on('pointerup', function() { this.buttonSpin.setFrame(1); }, this);
        this.buttonSpin.on('pointerdown', function() { this.buttonSpin.setFrame(2); }, this);
        this.buttonSpin.on('pointerover', function() { this.buttonSpin.setFrame(1); }, this);
        this.buttonSpin.on('pointerout', function() { this.buttonSpin.setFrame(0); }, this);
    }
    clickBack() {
        EPT.Sfx.play('click');
        EPT.Stats.gameplays += 1;
        EPT.Storage.set('NSHexRoulette-gameplays',EPT.Stats.gameplays);
        EPT.fadeOutScene('MainMenu', this);
    }
};