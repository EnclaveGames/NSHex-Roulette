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