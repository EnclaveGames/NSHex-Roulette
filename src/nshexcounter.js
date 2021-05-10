var EPT = {};

EPT.Sfx = {
  manage: function(type, mode, game, button, label) {
    switch(mode) {
      case 'init': {
        // EPT.Storage.initUnset('EPT-'+type, true);
        EPT.Storage.initUnset('EPT-sound', true);
        EPT.Storage.initUnset('EPT-music', false);
        EPT.Sfx.status = EPT.Sfx.status || [];
        EPT.Sfx.status[type] = EPT.Storage.get('EPT-'+type);
        if(type == 'sound') {
          EPT.Sfx.sounds = [];
          EPT.Sfx.sounds['click'] = game.sound.add('sound-click');
          EPT.Sfx.sounds['move'] = game.sound.add('sound-move');
          EPT.Sfx.sounds['shot'] = game.sound.add('sound-gun-shot');
          EPT.Sfx.sounds['spin'] = game.sound.add('sound-revolver-spin');
        }
        else { // music
          if(!EPT.Sfx.music || !EPT.Sfx.music.isPlaying) {
            EPT.Sfx.music = game.sound.add('music-theme');
            EPT.Sfx.music.volume = 0.5;
          }
        }
        break;
      }
      case 'on': {
        EPT.Sfx.status[type] = true;
        break;
      }
      case 'off': {
        EPT.Sfx.status[type] = false;
        break;
      }
      case 'switch': {
        EPT.Sfx.status[type] =! EPT.Sfx.status[type];
        break;
      }
      default: {}
    }
    EPT.Sfx.update(type, button, label);

    if(type == 'music' && EPT.Sfx.music) {
      if(EPT.Sfx.status['music']) {
        if(!EPT.Sfx.music.isPlaying) {
          EPT.Sfx.music.play({loop:true});
        }
      }
      else {
        EPT.Sfx.music.stop();
      }
    }

    EPT.Storage.set('EPT-'+type, EPT.Sfx.status[type]);
  },
  play: function(audio) {
    if(audio == 'music') {
      if(EPT.Sfx.status['music'] && EPT.Sfx.music && !EPT.Sfx.music.isPlaying) {
        EPT.Sfx.music.play({loop:true});
      }
    }
    else { // sound
      if(EPT.Sfx.status['sound'] && EPT.Sfx.sounds && EPT.Sfx.sounds[audio]) {
        EPT.Sfx.sounds[audio].play();
      }
    }
  },
  update: function(type, button, label) {
    if(button) {
      if(EPT.Sfx.status[type]) {
        button.setTexture('button-'+type+'-on');
      }
      else {
        button.setTexture('button-'+type+'-off');
      }
    }
    if(label) {
      if(EPT.Sfx.status[type]) {
        label.setText(EPT.Lang.text[EPT.Lang.current][type+'-on']);
      }
      else {
        label.setText(EPT.Lang.text[EPT.Lang.current][type+'-off']);
      }
    }
  }
};
EPT.fadeOutIn = function(passedCallback, context) {
  context.cameras.main.fadeOut(250);
  context.time.addEvent({
    delay: 250,
    callback: function() {
      context.cameras.main.fadeIn(250);
      passedCallback(context);
    },
    callbackScope: context
  });  
}
EPT.fadeOutScene = function(sceneName, context) {
  context.cameras.main.fadeOut(250);
  context.time.addEvent({
      delay: 250,
      callback: function() {
        context.scene.start(sceneName);
      },
      callbackScope: context
  });
};

class Button extends Phaser.GameObjects.Image {
  constructor(x, y, texture, callback, scene, noframes) { // noframes => frame
    super(scene, x, y, texture, 0);
    this.setInteractive({ useHandCursor: true });
    
    this.on('pointerup', function() {
      if(!noframes) {
        this.setFrame(1);
      }
    }, this);

    this.on('pointerdown', function() {
      if(!noframes) {
        this.setFrame(2);
      }
      callback.call(scene);
    }, this);

    this.on('pointerover', function() {
      if(!noframes) {
        this.setFrame(1);
      }
    }, this);

    this.on('pointerout', function() {
      if(!noframes) {
        this.setFrame(0);
      }
    }, this);

    scene.add.existing(this);
  }
};

EPT.Storage = {
  availability: function() {
    if(!(!(typeof(window.localStorage) === 'undefined'))) {
      console.log('localStorage not available');
      return null;
    }
  },
  get: function(key) {
    this.availability();
    try {
      return JSON.parse(localStorage.getItem(key));
    }
    catch(e) {
      return window.localStorage.getItem(key);
    }
  },
  set: function(key, value) {
    this.availability();
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
    catch(e) {
      if(e == QUOTA_EXCEEDED_ERR) {
        console.log('localStorage quota exceeded');
      }
    }
  },
  initUnset: function(key, value) {
    if(this.get(key) === null) {
      this.set(key, value);
    }
  },
  getFloat: function(key) {
    return parseFloat(this.get(key));
  },
  setHighscore: function(key, value) {
    if(value > this.getFloat(key)) {
      this.set(key, value);
    }
  },
  remove: function(key) {
    this.availability();
    window.localStorage.removeItem(key);
  },
  clear: function() {
    this.availability();
    window.localStorage.clear();
  }
};

EPT.Lang = {
  current: 'en',
  options: ['en', 'pl'],
  parseQueryString: function(query) {
    var vars = query.split('&');
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (typeof query_string[pair[0]] === 'undefined') {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
      } else if (typeof query_string[pair[0]] === 'string') {
        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
        query_string[pair[0]] = arr;
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return query_string;
  },
  updateLanguage: function(lang) {
    // the importance of language setting: parameter, url, cache, navigator
    var savedLang = EPT.Storage.get('EPT-language');
    var query = window.location.search.substring(1);
    var qs = EPT.Lang.parseQueryString(query);
    EPT.Lang.foreign = false;

    if(lang) {
      EPT.Lang.current = lang;
    }
    else if(qs && qs['lang']) {
      EPT.Lang.current = qs['lang'];
    }
    else if(savedLang) {
      EPT.Lang.current = savedLang;
    }
    else {
      EPT.Lang.current = navigator.language;
    }

    if(EPT.Lang.options.indexOf(EPT.Lang.current) == -1) {
      EPT.Lang.current = 'en';
    }

    if(navigator.language != 'en' && navigator.language != 'pl') {
      EPT.Lang.foreign = true;
    }
  },
  text: {
    'en': {
      'FONT': 'montserratbold',
      'STYLE': '',
      'menu-intro': 'Locked and loaded\ntry your luck!',
      'settings': 'Settings',
      'rules-title': 'Rules',
      'rules-intro-text': 'NSHex Roulette is a digital expansion for\n\
the physical board game Neuroshima Hex.\n\
The app is developed by Enclave Games, \n\
while the board game is created \n\
and published by Portal Games.',
      'rules-quote-text': '"In a post-apocalyptic wasteland,\n\
you never know what you can find\n\
in an old abandoned bunker\n\
burried deep in the ground."',
      // 'rules-story-title': 'Story',
      // 'rules-story-text': 'When you entered the battlefield, you found remains of a small bunker in the middle of the field. After inspecting the interiors it turned out to be an entrance to a bigger military complex down below. There are radioactive spills all over the place, and it looks like the place has seen a serious fight. The weird feeling of death and destruction is everywhere.'
        // +"\n\n"+'At the very end of the complex, in a massive warehouse, you find crates covered in Russian markings, apparently promising great treasures. Some of them are open already - a few still hold destroyed weapons and other equipment, while it looks like something got out of the others and violetnly ended lives of those who arrived here and opened them before you.'
        // +"\n\n"+'Will you risk it and open the remaining crates that are still intact?',
      'rules-usage-title': 'Usage',
      'rules-usage-text': 'Launch the application, then tap Start\n\
when you\'re all ready to begin the game.\n\
Now, whenever a player is about to start\n\
their turn, they can use the Roulette by\n\
tapping the Spin button. They can do it\n\
only once per their turn, and every time\n\
it is used, it costs 1 damage\n\
to the player\'s HQ.',
      'rules-tiles-title': 'Tiles',
      'rules-tiles-text': 'Whenever a player spins the Roulette,\n\
it will produce one out of the six\n\
available outcomes:',
      'rules-tile1-title': 'Airborne',
      'rules-tile1-slug': 'airbornes',
      'rules-tile1-text': 'Pick any of your tiles from the board\n\
and put it on any other, free spot.\n\
You can also rotate it.',
      'rules-tile2-title': 'Detonation',
      'rules-tile2-slug': 'detonations',
      'rules-tile2-text': 'Select a single tile from the opponent\'s\n\
army on the board and instantly kill it.',
      'rules-tile3-title': 'Bombing Raid',
      'rules-tile3-slug': 'bombingraids',
      'rules-tile3-text': 'Bomb any two adjacent hexes on the\n\
board dealing one point of damage\n\
each to the tiles on both spots.',
      'rules-tile4-title': 'Reanimation',
      'rules-tile4-slug': 'reanimations',
      'rules-tile4-text': 'Heal all your units on the board by\n\
removing wound tokens from them, or\n\
heal two points of damage of your HQ.',
      'rules-tile5-title': 'Berserk',
      'rules-tile5-slug': 'berserks',
      'rules-tile5-text': 'Force a single tile from the opponent\'s\n\
army on the board to do an attack while\n\
treating everyone else as hostiles.',
      'rules-tile6-title': 'Headshot',
      'rules-tile6-slug': 'headshots',
      'rules-tile6-text': 'Boom! You instantly finish your turn\n\
and receive extra 2 points of damage\n\
to your HQ.',
      'rules-end-title': 'Endgame',
      'rules-end-text': 'If a player gets a Headshot as a result of\n\
their spin, the outcome goes back to the\n\
pool, while all other five outcomes can\n\
be used only once and then are removed\n\
from the pool. This means the longer you\n\
play Roulette, the bigger the chance of\n\
ending up with a Headshot.'
+"\n\n"+'The expansion can be played up until\n\
there\'s only one possible outcome:\n\
Headshot. After that it is considered as\n\
depleted, and can be removed\n\
from the game.',
      'language-title': 'Language',
      'language-help': '\
Would you like to help translate\n\
this app to your language?\n\
Let us know at\n\
nshex@enclavegames.com!',
      'stats-title': 'Statistics',
      'stats-description1': '\
The NSHex Roulette app is free,\n\
but you can appreciate that fact\n\
either by becoming a Web Monetized\n\
power user - a Coil subscriber:',
      'stats-description2': '\
or sending us a few bucks for\n\
a beer (or coffee!) directly:',
      'stats-description3': '\
Coil subscribers will see here\n\
statistics of their gameplays.',
      'stats-thanks1': '\
Thank you for being Coil\'s\n\
Web Monetized power user\n\
and supporting Enclave Games!',
      'stats-thanks2': '\
We\'re working on delivering\n\
the ability to track statistics\n\
of your gameplays - coming soon!',

      'stats-gameplays': 'Gameplays',
      'stats-pergame': 'per game',
      'stats-spins': 'Spins',
      'stats-headshots': 'Headshots',
      'stats-airbornes': 'Airbornes',
      'stats-detonations': 'Detonations',
      'stats-bombingraids': 'Bombing Raids',
      'stats-reanimations': 'Reanimations',
      'stats-berserks': 'Berserks',

      'copy-title': 'Copyright',
      'copy-description1': '\
All rights to the images of the\n\
tiles from the Neuroshima Hex\n\
board game belongs to its creator\n\
and publisher: Portal Games.',
      'copy-description2': '\
This app is free and created\n\
by the community\n\
for the community.',
      'copy-description3': '\
It was developed by the\n\
Enclave Games team.',
      'credits': 'Credits',
      'appname': 'NSHex Roulette',
      'madeby': 'made by',
      'team': 'The Team',
      'coding': 'coding',
      'design': 'design',
      'testing': 'testing',
      'musicby': 'Music by',
      // 'selection1': 'Choose 1st army',
      // 'selection2': 'Choose 2nd army',
      'popup-lostprogress': 'Current game will be finished.'
    },
    'pl': {
      'FONT': 'Arial',
      'STYLE': 'bold ',
      'menu-intro': 'Załaduj i zakręć\njeśli się odważysz!',
      'settings': 'Ustawienia',
      'rules-title': 'Zasady',
      'rules-intro-text': 'NSHex Roulette to cyfrowy dodatek do\n\
fizycznej gry planszowej Neuroshima Hex.\n\
Aplikacja została stworzona przez studio\n\
Enclave Games, a autorem gry planszowej\n\
i jej wydawcą jest Portal Games Polska.',
      'rules-quote-text': '"Na post-apokaliptycznych pustkowiach,\n\
nigdy nie wiesz co możesz znaleźć\n\
w opuszczonym bunkrze\n\
pogrzebanym głęboko pod ziemią."',
      // 'rules-story-title': 'Story',
      // 'rules-story-text': 'When you entered the battlefield, you found remains of a small bunker in the middle of the field. After inspecting the interiors it turned out to be an entrance to a bigger military complex down below. There are radioactive spills all over the place, and it looks like the place has seen a serious fight. The weird feeling of death and destruction is everywhere.'
        // +"\n\n"+'At the very end of the complex, in a massive warehouse, you find crates covered in Russian markings, apparently promising great treasures. Some of them are open already - a few still hold destroyed weapons and other equipment, while it looks like something got out of the others and violetnly ended lives of those who arrived here and opened them before you.'
        // +"\n\n"+'Will you risk it and open the remaining crates that are still intact?',
      'rules-usage-title': 'Używanie',
      'rules-usage-text': 'Uruchom aplikację i tapnij na Start kiedy\n\
jesteście gotowi zacząć grę. Za każdym razem,\n\
kiedy gracz powinien zacząć swoją turę,\n\
może użyć Ruletki klikając w przycisk Zakręć.\n\
Gracz może ro zrobić tylko raz podczas\n\
własnej tury, i za każdym razem gry jej użyje,\n\
Ruletka zadaje 1 punkt obrażeń Sztabowi\n\
danego gracza.',
      'rules-tiles-title': 'Żetony',
      'rules-tiles-text': 'Za każdym razem, gdy gracz zakręci Ruletką,\n\
można spodziewać się jednego z sześciu\n\
dostępnych rezultatów:',
      'rules-tile1-title': 'Spadochroniarz',
      'rules-tile1-text': 'Wybierz dowolną własną jednostkę z planszy\n\
i umieść ją na dowolnym innym, wolnym polu.\n\
Możesz ją także obrócić.',
      'rules-tile2-title': 'Detonacja',
      'rules-tile2-text': 'Wybierz dowolną jednostkę przeciwnika\n\
na planszy i zniszcz ją.',
      'rules-tile3-title': 'Nalot Bombowy',
      'rules-tile3-text': 'Zbombarduj dwa dowolne przylegające\n\
do siebie pola na planszy zadając im\n\
po jednym punkcie obrażeń.',
      'rules-tile4-title': 'Reanimacja',
      'rules-tile4-text': 'Ulecz wszystkie swoje jednostki na planszy\n\
zdejmując im naczniki obrażeń, lub ulecz\n\
dwa punkty obrażeń swojemu Sztabowi.',
      'rules-tile5-title': 'Szał',
      'rules-tile5-text': 'Zmuś jednostkę przeciwnika na planszy\n\
do Szału - zaatakuje ona traktując\n\
wszystkich jak wrogów.',
      'rules-tile6-title': 'Strzał w Głowę',
      'rules-tile6-text': 'Pif-paf! Natychmiastowo kończysz swą turę\n\
i otrzymujesz dodatkowe dwa punkty brażeń\n\
w swój Sztab.',
      'rules-end-title': 'Koniec gry',
      'rules-end-text': 'Kiedy gracz otrzymuje Strzał w Głowę, efekt\n\
ten wraca do puli dostępnych efektów, podczas\n\
gry każdy z pozostałych pięciu może zostać\n\
użyty tylko raz i od razu jest odrzucany.\n\
Oznacza to, że im dłużej grasz w Ruletkę, tym\n\
większa szansa trafienia na Strzał w Głowę.'
+"\n\n"+'Dodatek ten jest rozgrywany dopóki nie\n\
pozostanie tylko jeden efekt: Strzał w Głowę.\n\
Po tym uznawany jest za zużyty i jest\n\
usuwany z gry.',
      'language-title': 'Język',
      'language-help': '',
      'stats-title': 'Statystyki',
      'stats-description1': '\
Aplikacja NSHex Roulette jest\n\
darmowa, ale mimo wszystko nadal\n\
możesz nas wesprzeć  - albo\n\
zakładając konto w serwisie Coil:',
      'stats-description2': '\
albo wysyłając kilka złotych\n\
na piwo (lub kawę!) bezpośrednio:',
      'stats-description3': '\
Subskrybenci Coil będą mogli\n\
zobaczyć tu statystyki swoich gier.',
      'stats-thanks1': '\
Dzięki za bycie aktywnym\n\
subskrybentem serwisu Coil\n\
i wspieranie Enclave Games!',
      'stats-thanks2': '\
Pracujemy nad możliwością\n\
zapisu statystyk Twoich gier - \n\
taka opcja pojawi się wkrótce!',

      'stats-gameplays': 'Rozgrywki',
      'stats-pergame': 'na grę',
      'stats-spins': 'Zakręcenia',
      'stats-headshots': 'Strzał w Głowę',
      'stats-airbornes': 'Spadochron',
      'stats-detonations': 'Detonacja',
      'stats-bombingraids': 'Nalot Bombowy',
      'stats-reanimations': 'Reanimacja',
      'stats-berserks': 'Szał',

      'copy-title': 'Prawa autorskie',
      'copy-description1': '\
Wszelkie prawa do grafik żetonów\n\
armii gry Neuroshima Hex\n\
należą do jej twórcy i wydawcy:\n\
Portal Games Polska.',
      'copy-description2': '\
Ta aplikacja jest darmowa\n\
i została zrobiona przez\n\
społeczność, dla społeczności.',
      'copy-description3': '\
Stworzeniem aplikacji zajęło się\n\
studio Enclave Games.',
      'thanks': 'Dzięki za bycie\npłacącym subskrybentem\ni wspieranie EPT!',
      'credits': 'Autorzy',
      'appname': 'NSHex Roulette',
      'madeby': 'stworzony przez',
      'team': 'Zespół',
      'coding': 'programowanie',
      'design': 'projektowanie',
      'testing': 'testowanie',
      'musicby': 'Muzyka autorstwa',
      // 'selection1': 'Wybierz 1szą armię',
      // 'selection2': 'Wybierz 2gą armię',
      'popup-lostprogress': 'Aktualna gra zostanie zakończona.'
    }
  }
};
EPT.Stats = {
  gameplays: 0,
  spins: 0,
  headshots: 0,
  airbornes: 0,
  detonations: 0,
  bombingraids: 0,
  reanimations: 0,
  berserks: 0
  // shotratio: 0 = spins/headshots/gameplays
};
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
      this.logoCoil = new Button(EPT.world.centerX, 390, 'logo-coil-black', this.clickCoil, this, 'noframes').setOrigin(0.5, 0.5);
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
class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    create() {
        this.add.sprite(0, 0, 'background').setOrigin(0, 0);
        this.add.sprite(0, EPT.world.height, 'background-overlay').setOrigin(0, 1);

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

        this.fontTitle = { font: "56px Berlin", fill: "#FFF", stroke: "#000", strokeThickness: 4, align: "center" };
        var fontTitle = { font: "56px Berlin", fill: "#FFF", stroke: "#000", strokeThickness: 4, align: "center" };
        this.fontPopup  = { font: EPT.text['STYLE']+'24px '+EPT.text['FONT'], fill: '#000', align: 'center' };
        var fontDigits = { font: EPT.text['STYLE']+'36px '+EPT.text['FONT'], fill: '#fff', stroke: '#000', strokeThickness: 6, align: 'center' };

        this.initTiles();

        this.counterOverall = this.add.text(EPT.world.width-20, 20, " / 5", fontDigits);
        this.counterOverall.setOrigin(1, 0);
        this.counterCurrent = this.add.text(EPT.world.width-78, 20, "5", fontDigits);
        this.counterCurrent.setOrigin(1, 0);

        var wheelX = EPT.world.centerX;
        var wheelY = EPT.world.centerY-190;

        var wheelShadow = this.add.sprite(wheelX, wheelY, 'roulette-shadow');
        wheelShadow.setOrigin(0.5);

        this.wheelContainer = this.add.container(wheelX, wheelY);

        this.wheel = this.add.sprite(0, 0, 'roulette-icons');

        this.wheel.setOrigin(0.5);

        this.wheelContainer.add(this.wheel);

        this.buttonSpin = new Button(EPT.world.centerX, EPT.world.centerY+165, 'button-spin-'+EPT.Lang.current, this.spin, this);
        this.buttonSpin.setOrigin(0.5, 0.5);
        this.prizeText = this.add.text(EPT.world.centerX, 755, "", fontTitle);
        this.prizeText.setOrigin(0.5);

        this.buttonBack = new Button(0, 0, 'button-home', this.popupShow, this, 'noframes');
        this.buttonBack.setOrigin(0, 0);

        var wheelShadow = this.add.sprite(EPT.world.centerX, EPT.world.centerY-190, 'roulette-overlay');
        wheelShadow.setOrigin(0.5);
        var wheelIndicator = this.add.sprite(EPT.world.centerX, EPT.world.centerY-190, 'roulette-texture');
        wheelIndicator.setOrigin(0.5);

        this.enableSpinning();

        this.popupInit();

        this.cameras.main.fadeIn(250);
    }
    spin(){
        if(this.canSpin){
            EPT.Sfx.play('spin');
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
                this.black1Container = this.add.container(0, 0);
                this.black1 = this.add.sprite(50, 0, 'black'); // black X
                this.black1.setOrigin(1,1);
                
                this.black1Container.add(this.black1);
                this.black1Container.angle = 360 - this.degrees;
                this.wheelContainer.add(this.black1Container);
                this.black1.alpha = 0;
            }

            if(this.sliceIndexes.length == 1) {
                EPT.Stats.gameplays += 1;
                EPT.Storage.set('NSHexRoulette-gameplays',EPT.Stats.gameplays);
            }
        }
    }
    initTiles() {
        var posX = EPT.world.centerX-(589/2);
        var posY = EPT.world.centerY+250;
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

        var tweenedCoin = this.add.sprite(EPT.world.centerX, 146, 'tiles', this.prize);
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
        this.popupOverlay = this.add.sprite(0, EPT.world.height, 'overlay').setOrigin(0, 0).setAlpha(0.75);
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
            this.popupOverlay.setAlpha(0.75);
            this.popupOverlay.y = EPT.world.height;
            this.popupContainer.y = EPT.world.height;
            this.popupContainer.setScale(1);
        }, onCompleteScope: this});
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