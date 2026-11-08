// generated into sw.js by build.js - do not edit sw.js directly
var VERSION = 'c25d5dba9c';
var CACHE = 'nshex-roulette-' + VERSION;
var FILES = [
  "ept.webmanifest",
  "favicon.png",
  "fonts/BRLNSDB.css",
  "fonts/BRLNSDB.eot",
  "fonts/BRLNSDB.otf",
  "fonts/BRLNSDB.svg",
  "fonts/BRLNSDB.ttf",
  "fonts/BRLNSDB.woff",
  "fonts/montserrat-bold.css",
  "fonts/montserrat-bold.eot",
  "fonts/montserrat-bold.svg",
  "fonts/montserrat-bold.ttf",
  "fonts/montserrat-bold.woff",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "img/background-black.png",
  "img/background-overlay.png",
  "img/background.png",
  "img/banner-beer.png",
  "img/black.png",
  "img/button-back.png",
  "img/button-beer.png",
  "img/button-down.png",
  "img/button-home.png",
  "img/button-music-off.png",
  "img/button-music-on.png",
  "img/button-settings.png",
  "img/button-sound-off.png",
  "img/button-sound-on.png",
  "img/button-up.png",
  "img/hex-border-color.png",
  "img/hex-border-pattern.png",
  "img/hex-shadow.png",
  "img/img-navbar.png",
  "img/img-seethru.png",
  "img/img-tiles.png",
  "img/img-topbar.png",
  "img/lang/button-language-english-off.png",
  "img/lang/button-language-english-on.png",
  "img/lang/button-language-polish-off.png",
  "img/lang/button-language-polish-on.png",
  "img/lang/en/button-copyright.png",
  "img/lang/en/button-credits.png",
  "img/lang/en/button-language.png",
  "img/lang/en/button-more.png",
  "img/lang/en/button-no.png",
  "img/lang/en/button-rules.png",
  "img/lang/en/button-spin.png",
  "img/lang/en/button-start.png",
  "img/lang/en/button-statistics.png",
  "img/lang/en/button-support.png",
  "img/lang/en/button-yes.png",
  "img/lang/en/text-areyousure.png",
  "img/lang/pl/button-copyright.png",
  "img/lang/pl/button-credits.png",
  "img/lang/pl/button-language.png",
  "img/lang/pl/button-more.png",
  "img/lang/pl/button-no.png",
  "img/lang/pl/button-rules.png",
  "img/lang/pl/button-spin.png",
  "img/lang/pl/button-start.png",
  "img/lang/pl/button-statistics.png",
  "img/lang/pl/button-support.png",
  "img/lang/pl/button-yes.png",
  "img/lang/pl/text-areyousure.png",
  "img/loader-yellow.png",
  "img/loader.png",
  "img/loading-background.png",
  "img/logo-counter.png",
  "img/logo-enclave.png",
  "img/logo-neuroshimahexpl.png",
  "img/logo-portalgames.png",
  "img/logo-roulette.png",
  "img/nshex-roulette.png",
  "img/overlay.png",
  "img/pattern.png",
  "img/popup-bg.png",
  "img/roulette-bg.png",
  "img/roulette-icons.png",
  "img/roulette-overlay.png",
  "img/roulette-shadow.png",
  "img/roulette-texture.png",
  "img/tiles.png",
  "index.html",
  "sfx/audio-button.m4a",
  "sfx/audio-button.mp3",
  "sfx/audio-button.ogg",
  "sfx/audio-click.m4a",
  "sfx/audio-click.mp3",
  "sfx/audio-click.ogg",
  "sfx/audio-gun-shot.m4a",
  "sfx/audio-gun-shot.mp3",
  "sfx/audio-gun-shot.ogg",
  "sfx/audio-move.m4a",
  "sfx/audio-move.mp3",
  "sfx/audio-move.ogg",
  "sfx/audio-revolver-spin.m4a",
  "sfx/audio-revolver-spin.mp3",
  "sfx/audio-revolver-spin.ogg",
  "sfx/music-battle.m4a",
  "sfx/music-battle.mp3",
  "sfx/music-battle.ogg",
  "src/nshexcounter.min.js",
  "src/phaser.4.2.1.min.js",
  "src/plugins/webfont.js",
  "src/start.js"
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return Promise.all(FILES.concat(['./']).map(function(file) {
        // 'reload' skips the HTTP cache so the new version never mixes with old files
        return cache.add(new Request(file, { cache: 'reload' })).catch(function() {});
      }));
    }).then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(key) {
        return key.indexOf('nshex-roulette-') === 0 && key !== CACHE;
      }).map(function(key) { return caches.delete(key); }));
    }).then(function() { return self.clients.claim(); })
  );
});

function networkFirst(request) {
  return new Promise(function(resolve) {
    var done = false;
    var fallback = function() {
      return caches.match(request, { ignoreSearch: true }).then(function(cached) { return cached; });
    };
    // on a weak connection give up after a few seconds and use the saved copy
    var timer = setTimeout(function() {
      fallback().then(function(cached) {
        if(cached && !done) { done = true; resolve(cached); }
      });
    }, 4000);
    fetch(request).then(function(response) {
      clearTimeout(timer);
      if(done) { return; }
      done = true;
      if(response && response.ok) {
        var copy = response.clone();
        caches.open(CACHE).then(function(cache) { cache.put(request, copy); });
      }
      resolve(response);
    }).catch(function() {
      clearTimeout(timer);
      if(done) { return; }
      fallback().then(function(cached) {
        done = true;
        resolve(cached || Response.error());
      });
    });
  });
}

self.addEventListener('fetch', function(event) {
  var request = event.request;
  var url = new URL(request.url);
  if(request.method !== 'GET' || url.origin !== self.location.origin) { return; }

  var isCode = request.mode === 'navigate' || /\.(html|js)$/.test(url.pathname) || url.pathname.slice(-1) === '/';
  if(isCode) {
    event.respondWith(networkFirst(request));
    return;
  }
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(function(cached) {
      return cached || fetch(request).then(function(response) {
        if(response && response.ok) {
          var copy = response.clone();
          caches.open(CACHE).then(function(cache) { cache.put(request, copy); });
        }
        return response;
      });
    })
  );
});
