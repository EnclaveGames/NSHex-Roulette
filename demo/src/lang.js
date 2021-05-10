FloodLangs = ['en']; // English
parse_query_string = function(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr;
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
};
getOrRefreshLanguage = function(lang) {
	var query = window.location.search.substring(1);
	var qs = parse_query_string(query);
	if(qs && qs['lang']) {
		console.log("LANG: "+qs['lang']);
		FloodLANG = qs['lang'];
	} else {
		if(lang) {
			FloodLANG = lang;
		}
		FloodLANG = navigator.language;
		if(FloodLangs.indexOf(FloodLANG) == -1) {
			FloodLANG = 'en';
		}
	}
};
getOrRefreshLanguage();
var LANGTXT = {
	'en': {
		'settings': 'SETTINGS',
		'audio-on': 'Audio: ON',
		'audio-off': 'Audio: OFF',
		'music-on': 'Music: ON',
		'music-off': 'Music: OFF',
		'notifications-na': 'Notifications: N/A',
		'keyboard-info': 'Press K for keyboard shortcuts',
		'credits': 'CREDITS',
		'madeby': 'Flood Escape game made by',
		'team': 'THE TEAM',
		'coding': 'coding',
		'design': 'design',
		'testing': 'testing',
		'musicby': 'Music by',
		'key-title': 'KEYBOARD SHORTCUTS',
		'key-settings-title': 'Settings',
		'key-settings-onoff': 'show/hide settings',
		'key-audio': 'turn audio on/off',
		'key-music': 'turn music on/off',
		'key-notifications': 'turn notifications on/off',
		'key-credits': 'show/hide credits',
		'key-shortcuts': 'show/hide keyboard shortcuts',
		'key-menu': 'Main menu',
		'key-left': '<left arrow> - move level selection to the left',
		'key-right': '<right arrow> - move level selection to the right',
		'key-start': 'Enter, Space - start selected level',
		'key-gameplay': 'Gameplay',
		'key-new': 'Enter, Space, <up/down arrows> - place new floor',
		'key-pause': 'turn pause screen on/off',
		'key-pause-title': 'Pause screen',
		'key-back': 'back to main menu',
		'key-return': 'return to the game',
		'key-gameover': 'Game over screen',
		'key-try': 'try again',
		'spin': 'Spin and try your luck!',
		'won': 'You won:',
		'coins': 'COINS!',
		'life': 'EXTRA LIFE!',
		'coins-x2': 'DOUBLE COINS',
		'slow': 'SLOW DOWN TIME',
		'not-enough': 'NOT ENOUGH COINS!',
		'slowed': 'SLOWED DOWN!',
		'life-lost': 'LIFE LOST!',
		'good': 'GOOD!',
		'great': 'GREAT!',
		'excellent': 'EXCELLENT!',
		'perfect': 'PERFECT!',
		'new-high': 'NEW HIGHSCORE!',
		'score': 'SCORE:',
		'game-over': 'YOU ALMOST MADE IT!',
		'well-done': 'WELL DONE!',
		'paused': 'PAUSED',
		'congrats': 'CONGRATS!',
		'rescued': 'YOU WERE RESCUED!',
		'10k': '+10 000 COINS!'
	}
}

// CHEATS

FloodCheat = '';
parse_query_string = function(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr;
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
};
getCheatCode = function(cheat) {
	var query = window.location.search.substring(1);
	var qs = parse_query_string(query);
	if(qs && qs['cheatcode']) {
		// console.log("Cheat Code: "+qs['cheatcode']);
		FloodCheat = qs['cheatcode'];
	} else {
		if(cheat) {
			FloodCheat = cheat;
		}
	}
};
getCheatCode();