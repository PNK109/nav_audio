(function () {
  'use strict';

  var runtimeScript = document.currentScript;

  function injectDesignSystem() {
    if (document.getElementById('nav-design-system-v1')) return;
    if (!runtimeScript || !runtimeScript.src) return;

    var stylesheet = document.createElement('link');
    stylesheet.id = 'nav-design-system-v1';
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL('nav-design-system-v1.css', runtimeScript.src).href;
    document.head.appendChild(stylesheet);
  }

  injectDesignSystem();

  /*
   * Reserve the public layer IDs before Tilda's inline DOMContentLoaded
   * handlers run. This prevents the legacy, repaint-heavy canvas effects from
   * starting while this external runtime is loading.
   */
  var effectIds = ['nav-site-dust', 'nav-site-film-grain'];
  for (var reservedIndex = 0; reservedIndex < effectIds.length; reservedIndex++) {
    if (!document.getElementById(effectIds[reservedIndex])) {
      var reservation = document.createElement('i');
      reservation.id = effectIds[reservedIndex];
      reservation.className = 'nav-fx-reservation';
      reservation.setAttribute('aria-hidden', 'true');
      reservation.style.display = 'none';
      document.documentElement.appendChild(reservation);
    }
  }

  function injectOptimizedEffectStyles() {
    if (document.getElementById('nav-fx-optimized-styles')) return;

    var styles = document.createElement('style');
    styles.id = 'nav-fx-optimized-styles';
    styles.textContent = [
      'body.t-body::after {',
      '  -webkit-backdrop-filter: none !important;',
      '  backdrop-filter: none !important;',
      '  background:',
      '    radial-gradient(circle at 50% 12%, rgba(255,250,242,.062) 0, rgba(255,246,236,.023) 34%, transparent 72%),',
      '    rgba(255,244,232,.026) !important;',
      '  opacity: .42 !important;',
      '  contain: strict;',
      '  will-change: auto;',
      '}',
      '#nav-site-film-grain.nav-fx-optimized {',
      '  position: fixed !important;',
      '  inset: -14% !important;',
      '  width: auto !important;',
      '  height: auto !important;',
      '  z-index: 2147483646 !important;',
      '  background-repeat: repeat;',
      '  opacity: .26 !important;',
      '  mix-blend-mode: soft-light !important;',
      '  animation: nav-grain-shift .48s steps(2, end) infinite;',
      '  will-change: transform;',
      '  backface-visibility: hidden;',
      '  pointer-events: none !important;',
      '}',
      '#nav-site-dust.nav-fx-optimized {',
      '  position: fixed !important;',
      '  inset: 0 auto auto 0 !important;',
      '  z-index: 2147483644 !important;',
      '  opacity: .46 !important;',
      '  will-change: auto;',
      '  backface-visibility: hidden;',
      '  pointer-events: none !important;',
      '}',
      '@keyframes nav-grain-shift {',
      '  0%   { transform: translate3d(-2.5%, -1.5%, 0); }',
      '  25%  { transform: translate3d(1.5%, -2.5%, 0); }',
      '  50%  { transform: translate3d(-1.5%, 2.5%, 0); }',
      '  75%  { transform: translate3d(2.5%, 1.5%, 0); }',
      '  100% { transform: translate3d(-2.5%, -1.5%, 0); }',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  #nav-site-film-grain.nav-fx-optimized { animation: none; }',
      '}'
    ].join('\n');
    document.head.appendChild(styles);
  }

  function retireLegacyLayer(id) {
    var layer = document.getElementById(id);
    if (!layer) return;

    if (layer.classList && layer.classList.contains('nav-fx-reservation')) {
      layer.remove();
      return;
    }

    /*
     * A late CDN response may let the legacy loop start before this runtime.
     * Collapse its backing store and detach it from the public ID. Its future
     * drawing calls are clipped to a single pixel and no longer trigger a
     * full-screen composite.
     */
    layer.id = id + '-legacy-retired';
    layer.style.display = 'none';
    if (layer.tagName === 'CANVAS') {
      layer.width = 1;
      layer.height = 1;
    }
  }

  function makeNoiseTile() {
    var size = 112;
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var context = canvas.getContext('2d', {alpha:false});
    var image = context.createImageData(size, size);

    for (var index = 0; index < image.data.length; index += 4) {
      var centered =
        Math.random() + Math.random() + Math.random() + Math.random() - 2;
      var speck = Math.random();
      var tone =
        speck < 0.03 ? 24 :
        speck > 0.97 ? 238 :
        Math.max(40, Math.min(218, Math.round(128 + centered * 56)));

      image.data[index] = tone;
      image.data[index + 1] = tone;
      image.data[index + 2] = tone;
      image.data[index + 3] = 255;
    }

    context.putImageData(image, 0, 0);
    return canvas.toDataURL('image/png');
  }

  function initOptimizedGrain() {
    retireLegacyLayer('nav-site-film-grain');

    var grain = document.createElement('div');
    grain.id = 'nav-site-film-grain';
    grain.className = 'nav-fx-optimized';
    grain.setAttribute('aria-hidden', 'true');
    grain.style.backgroundImage = 'url("' + makeNoiseTile() + '")';
    grain.style.backgroundSize = '112px 112px';
    grain.dataset.frame = '1';
    grain.addEventListener('animationiteration', function () {
      grain.dataset.frame = String((Number(grain.dataset.frame) || 0) + 1);
    });
    document.body.appendChild(grain);
  }

  function makeDustSprite(radius) {
    var padding = Math.ceil(radius * 5);
    var size = padding * 2 + 2;
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var context = canvas.getContext('2d');
    var center = size / 2;
    var gradient = context.createRadialGradient(
      center,
      center,
      0,
      center,
      center,
      Math.max(2, radius * 4.2)
    );

    gradient.addColorStop(0, 'rgba(255,252,242,.96)');
    gradient.addColorStop(0.18, 'rgba(255,250,236,.78)');
    gradient.addColorStop(0.52, 'rgba(255,247,228,.18)');
    gradient.addColorStop(1, 'rgba(255,247,228,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    return canvas;
  }

  function initOptimizedDust() {
    retireLegacyLayer('nav-site-dust');

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var lowPower =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
      (navigator.connection && navigator.connection.saveData);
    var dust = document.createElement('canvas');
    var context = dust.getContext('2d', {alpha:true, desynchronized:true});
    var sprites = [
      makeDustSprite(0.8),
      makeDustSprite(1.25),
      makeDustSprite(1.8),
      makeDustSprite(2.5)
    ];
    var particles = [];
    var width = 1;
    var height = 1;
    var timer = 0;
    var animationFrame = 0;
    var resizeFrame = 0;
    var scrollFrame = 0;
    var lastTime = 0;
    var frameInterval = lowPower ? 58 : 42;
    var scrollTop = 0;
    var documentHeight = 1;

    dust.id = 'nav-site-dust';
    dust.className = 'nav-fx-optimized';
    dust.setAttribute('aria-hidden', 'true');
    dust.dataset.space = 'document';
    document.body.appendChild(dust);

    function readScrollTop() {
      return Math.max(
        0,
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      );
    }

    function readDocumentHeight() {
      return Math.max(
        height,
        document.documentElement.scrollHeight || 0,
        document.body.scrollHeight || 0
      );
    }

    function resetParticle(particle, initial, insideViewport) {
      particle.x = Math.random() * width;
      if (insideViewport || initial) {
        particle.pageY = Math.min(
          documentHeight - 1,
          scrollTop + Math.random() * height
        );
      } else {
        particle.pageY = Math.min(
          documentHeight - 1,
          scrollTop + height + 12 + Math.random() * 80
        );
      }
      particle.sprite = Math.floor(Math.random() * sprites.length);
      particle.speed = 2.8 + Math.random() * 9.5;
      particle.drift = -2.5 + Math.random() * 5;
      particle.phase = Math.random() * Math.PI * 2;
      particle.age = initial ? Math.random() * 12 : 0;
      particle.duration = 8 + Math.random() * 12;
      particle.alpha = 0.34 + Math.random() * 0.48;
    }

    function sizeDust() {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      scrollTop = readScrollTop();
      documentHeight = readDocumentHeight();

      /*
       * Dust is intentionally soft, so a 1x backing store is visually
       * indistinguishable on Retina while using far less fill-rate.
       */
      dust.width = width;
      dust.height = height;
      dust.style.width = width + 'px';
      dust.style.height = height + 'px';
      context.setTransform(1, 0, 0, 1, 0, 0);

      var targetCount = Math.max(
        lowPower ? 22 : 32,
        Math.min(lowPower ? 42 : 68, Math.round(width * height / 26000))
      );
      while (particles.length < targetCount) {
        var particle = {};
        resetParticle(particle, true, true);
        particles.push(particle);
      }
      if (particles.length > targetCount) particles.length = targetCount;
    }

    function syncParticlesToViewport() {
      var bandTop = scrollTop - 120;
      var bandBottom = scrollTop + height + 120;

      for (var index = 0; index < particles.length; index++) {
        var particle = particles[index];
        if (
          particle.pageY < bandTop ||
          particle.pageY > bandBottom ||
          particle.pageY > documentHeight
        ) {
          resetParticle(particle, false, true);
        }
      }
    }

    function drawDust(delta) {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'screen';
      scrollTop = readScrollTop();
      documentHeight = readDocumentHeight();

      for (var index = 0; index < particles.length; index++) {
        var particle = particles[index];
        if (!reduceMotion) {
          particle.age += delta;
          particle.pageY -= particle.speed * delta;
          particle.x += (
            particle.drift +
            Math.sin(particle.age * 0.55 + particle.phase) * 1.4
          ) * delta;
        }

        if (
          particle.age >= particle.duration ||
          particle.pageY < scrollTop - 120 ||
          particle.pageY > scrollTop + height + 120 ||
          particle.x < -30 ||
          particle.x > width + 30
        ) {
          resetParticle(particle, false, false);
        }

        var fadeIn = Math.min(1, particle.age / 1.8);
        var fadeOut = Math.min(1, Math.max(0, particle.duration - particle.age) / 2.4);
        var shimmer = 0.76 + Math.sin(particle.age * 1.3 + particle.phase) * 0.24;
        var alpha = particle.alpha * fadeIn * fadeOut * shimmer;
        var sprite = sprites[particle.sprite];

        context.globalAlpha = alpha;
        context.drawImage(
          sprite,
          particle.x - sprite.width / 2,
          particle.pageY - scrollTop - sprite.height / 2
        );
      }

      context.globalAlpha = 1;
      dust.dataset.frame = String((Number(dust.dataset.frame) || 0) + 1);
    }

    function stop() {
      window.clearTimeout(timer);
      timer = 0;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    function schedule() {
      stop();
      if (document.hidden || reduceMotion) return;
      timer = window.setTimeout(function () {
        animationFrame = requestAnimationFrame(function (time) {
          animationFrame = 0;
          var elapsed = lastTime ? Math.min(0.09, (time - lastTime) / 1000) : 0;
          lastTime = time;
          drawDust(elapsed);
          schedule();
        });
      }, frameInterval);
    }

    window.addEventListener('resize', function () {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(function () {
        sizeDust();
        drawDust(0);
      });
    }, {passive:true});
    window.addEventListener('scroll', function () {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(function () {
        scrollTop = readScrollTop();
        documentHeight = readDocumentHeight();
        syncParticlesToViewport();
        drawDust(0);
      });
    }, {passive:true});
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else schedule();
    });
    window.addEventListener('pagehide', stop, {once:true});

    sizeDust();
    drawDust(0);
    schedule();
  }

  function restoreNativeMacScroll() {
    var isMac = /Macintosh|Mac OS X/i.test(navigator.userAgent);
    var path = location.pathname || '/';
    while (path.length > 1 && path.charAt(path.length - 1) === '/') {
      path = path.slice(0, -1);
    }

    if (
      isMac &&
      path === '/kl' &&
      window.SmoothScroll &&
      typeof window.SmoothScroll.destroy === 'function'
    ) {
      window.SmoothScroll.destroy();
      document.documentElement.dataset.navNativeScroll = 'true';
    }
  }

  function injectMenuEnhancements() {
    if (document.getElementById('nav-menu-enhancement-styles')) return;

    var styles = document.createElement('style');
    styles.id = 'nav-menu-enhancement-styles';
    styles.textContent = [
      '#rec969552191 .t450 { isolation: isolate; }',
      '#rec969552191 .t450__container,',
      '#rec969552191 .t450__rightside {',
      '  position: relative;',
      '  z-index: 2;',
      '}',
      '#rec969552191 .t450__menu .t-menu__link-item {',
      '  color: #fff !important;',
      '  text-shadow: 1px 1px 0 #000, 0 2px 3px rgba(0, 0, 0, .55);',
      '  transition: none !important;',
      '}',
      '@media (hover: hover) {',
      '  #rec969552191 .t450__menu .t-menu__link-item:hover,',
      '  #rec969552191 .t450__menu .t-menu__link-item.t-active:hover {',
      '    color: #000 !important;',
      '    text-shadow: 1px 1px 0 #fff, 0 2px 3px rgba(255, 255, 255, .72);',
      '  }',
      '}',
      '#rec969552191 .t450__menu .t-menu__link-item:focus-visible {',
      '  color: #000 !important;',
      '  text-shadow: 1px 1px 0 #fff, 0 2px 3px rgba(255, 255, 255, .72);',
      '}',
      '#rec969552191 .nav-menu-grass {',
      '  position: absolute;',
      '  z-index: 1;',
      '  left: 0;',
      '  right: 0;',
      '  bottom: 0;',
      '  width: 100%;',
      '  height: 112px;',
      '  overflow: hidden;',
      '  pointer-events: none;',
      '  contain: strict;',
      '  transform: translateZ(0);',
      '}',
      '#rec969552191 .nav-menu-grass__blade {',
      '  position: absolute;',
      '  bottom: -2px;',
      '  left: var(--grass-x);',
      '  width: var(--grass-width);',
      '  height: var(--grass-height);',
      '  border-radius: 80% 20% 0 0;',
      '  background: var(--grass-color);',
      '  clip-path: polygon(48% 0, 100% 100%, 0 100%);',
      '  filter: drop-shadow(1px 0 rgba(18, 74, 24, .42));',
      '  transform: rotate(var(--grass-angle));',
      '  transform-origin: 50% 100%;',
      '  backface-visibility: hidden;',
      '  animation: nav-menu-grass-sway var(--grass-speed) steps(2, end) var(--grass-delay) infinite;',
      '}',
      '#rec969552191 .nav-menu-grass__blade:nth-child(3n) { z-index: 2; }',
      '@keyframes nav-menu-grass-sway {',
      '  50% { transform: rotate(calc(var(--grass-angle) + 8deg)); }',
      '}',
      '@media (max-width: 640px) {',
      '  #rec969552191 .nav-menu-grass { height: 92px; }',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  #rec969552191 .nav-menu-grass__blade { animation: none; }',
      '}'
    ].join('\n');
    document.head.appendChild(styles);
  }

  function initMenuGrass() {
    var menuPanel = document.querySelector('#rec969552191 .t450');
    if (!menuPanel || menuPanel.querySelector('.nav-menu-grass')) return;

    var grass = document.createElement('div');
    grass.className = 'nav-menu-grass';
    grass.setAttribute('aria-hidden', 'true');

    var bladeCount = 42;
    var seed = 109;
    var colors = ['#2f7429', '#3f842f', '#4f9c35', '#68ad3d', '#82bd43'];
    var fragment = document.createDocumentFragment();

    function random() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    for (var index = 0; index < bladeCount; index++) {
      var blade = document.createElement('i');
      var spread = ((index + random() * 0.9) / bladeCount) * 100;
      var angle = -7 + random() * 14;

      blade.className = 'nav-menu-grass__blade';
      blade.style.setProperty('--grass-x', spread.toFixed(2) + '%');
      blade.style.setProperty('--grass-height', Math.round(30 + random() * 70) + 'px');
      blade.style.setProperty('--grass-width', Math.round(3 + random() * 4) + 'px');
      blade.style.setProperty('--grass-angle', angle.toFixed(1) + 'deg');
      blade.style.setProperty('--grass-speed', (0.72 + random() * 1.05).toFixed(2) + 's');
      blade.style.setProperty('--grass-delay', (-random() * 1.8).toFixed(2) + 's');
      blade.style.setProperty('--grass-color', colors[Math.floor(random() * colors.length)]);
      fragment.appendChild(blade);
    }

    grass.appendChild(fragment);
    menuPanel.appendChild(grass);
  }

  function initPersistentAudio() {
    if (document.getElementById('nav-global-audio')) return;

    var tracks = [
      {title:'НАВЬ 2', src:'https://file.garden/Z_YGP2xtO0c_OSpM/%D0%9C%D0%A3%D0%97%D0%AB%D0%9A%D0%90/%D0%9D%D0%90%D0%92%D0%AC%202.mp3', play:'.tc-play', stop:'.tc-stop'},
      {title:'ALBUM1-5 G#m', src:'https://file.garden/Z_YGP2xtO0c_OSpM/%D0%9C%D0%A3%D0%97%D0%AB%D0%9A%D0%90/ALBUM1-5%20G%23m.mp3', play:'.tc-play2', stop:'.tc-stop2'},
      {title:'ALBUM1-1 C7 improvisation', src:'https://file.garden/Z_YGP2xtO0c_OSpM/%D0%9C%D0%A3%D0%97%D0%AB%D0%9A%D0%90/ALBUM1-1%20%D0%A17%20improvisation.mp3', play:'.tc-play3', stop:'.tc-stop3'},
      {title:'Король Сиама', src:'https://file.garden/Z_YGP2xtO0c_OSpM/%D0%9C%D0%A3%D0%97%D0%AB%D0%9A%D0%90/%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D1%8C%20%D0%A1%D0%B8%D0%B0%D0%BC%D0%B0.mp3', play:'.tc-play4', stop:'.tc-stop4'},
      {title:'И белки спят и видят сны', src:'https://file.garden/Z_YGP2xtO0c_OSpM/%D0%9C%D0%A3%D0%97%D0%AB%D0%9A%D0%90/%D0%98%20%D0%B1%D0%B5%D0%BB%D0%BA%D0%B8%20%D1%81%D0%BF%D1%8F%D1%82%20%D0%B8%20%D0%B2%D0%B8%D0%B4%D1%8F%D1%82%20%D1%81%D0%BD%D1%8B.mp3', play:'.tc-play5', stop:'.tc-stop5'},
      {title:'B3NE — Another', src:'https://file.garden/Z_YGP2xtO0c_OSpM/%D0%9C%D0%A3%D0%97%D0%AB%D0%9A%D0%90/B3NE%20-%20Another.mp3', play:'.tc-play6', stop:'.tc-stop6'}
    ];
    var storageKey = 'nav.audio.state.v3';
    var legacyStorageKey = 'nav.audio.state.v2';
    var state = {
      index: 0,
      currentTime: 0,
      isPlaying: false,
      updatedAt: Date.now()
    };

    try {
      var saved = JSON.parse(
        localStorage.getItem(storageKey) ||
        localStorage.getItem(legacyStorageKey) ||
        'null'
      );
      if (saved && typeof saved === 'object') {
        state.index = Number(saved.index) || 0;
        state.currentTime = Math.max(0, Number(saved.currentTime) || 0);
        state.isPlaying = saved.isPlaying === true;
        state.updatedAt = Number(saved.updatedAt) || Date.now();
      }
    } catch (error) {}
    state.index = ((state.index % tracks.length) + tracks.length) % tracks.length;

    var audio = document.createElement('audio');
    var player = document.createElement('div');
    var toggle = document.createElement('button');
    var title = document.createElement('div');
    var currentIndex = state.index;
    var toastTimer = 0;
    var saveStamp = 0;
    var resumeWanted = state.isPlaying;
    var pendingSeek = state.currentTime;
    var loadToken = 0;

    audio.id = 'nav-global-audio';
    audio.preload = 'auto';
    audio.volume = 0.82;
    player.id = 'nav-global-audio-player';
    toggle.type = 'button';
    toggle.className = 'nav-audio-toggle';
    toggle.setAttribute('aria-label', 'Воспроизвести музыку');
    toggle.textContent = '▶';
    title.className = 'nav-audio-title';
    title.setAttribute('aria-live', 'polite');
    player.appendChild(toggle);
    player.appendChild(title);
    document.body.appendChild(audio);
    document.body.appendChild(player);

    function writeState(forcePlaying, preservePending) {
      var now = Date.now();
      state.index = currentIndex;
      if (
        !preservePending &&
        pendingSeek === null &&
        audio.readyState >= 1 &&
        Number.isFinite(audio.currentTime)
      ) {
        state.currentTime = Math.max(0, audio.currentTime);
      }
      if (typeof forcePlaying === 'boolean') state.isPlaying = forcePlaying;
      state.updatedAt = now;
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (error) {}
    }

    function setUi(playing) {
      toggle.textContent = playing ? 'Ⅱ' : '▶';
      toggle.setAttribute(
        'aria-label',
        playing ? 'Поставить музыку на паузу' : 'Воспроизвести музыку'
      );
      player.classList.toggle('is-playing', playing);
      updateKrugControls(playing);
    }

    function showTitle(message) {
      window.clearTimeout(toastTimer);
      title.textContent = message || tracks[currentIndex].title;
      title.classList.add('is-visible');
      toastTimer = window.setTimeout(function () {
        title.classList.remove('is-visible');
      }, 3800);
    }

    function updateKrugControls(playing) {
      for (var index = 0; index < tracks.length; index++) {
        var active = playing && index === currentIndex;
        var playNodes = document.querySelectorAll(tracks[index].play);
        var stopNodes = document.querySelectorAll(tracks[index].stop);
        for (var playIndex = 0; playIndex < playNodes.length; playIndex++) {
          playNodes[playIndex].style.display = active ? 'none' : '';
          playNodes[playIndex].style.opacity = active ? '0' : '1';
        }
        for (var stopIndex = 0; stopIndex < stopNodes.length; stopIndex++) {
          stopNodes[stopIndex].style.display = active ? '' : 'none';
          stopNodes[stopIndex].style.opacity = active ? '1' : '0';
        }
      }
    }

    function attemptPlay(announce) {
      resumeWanted = true;
      state.isPlaying = true;
      writeState(true, pendingSeek !== null);

      var promise = audio.play();
      if (promise && typeof promise.then === 'function') {
        promise.then(function () {
          resumeWanted = false;
          state.isPlaying = true;
          writeState(true, false);
          setUi(true);
          if (announce !== false) showTitle();
        }).catch(function () {
          /*
           * A full Tilda navigation may temporarily lose autoplay permission.
           * Keep the exact seek point and retry on the first user interaction
           * instead of resetting the track to zero.
           */
          resumeWanted = true;
          state.isPlaying = true;
          writeState(true, pendingSeek !== null);
          setUi(false);
        });
      } else {
        resumeWanted = false;
        setUi(true);
        if (announce !== false) showTitle();
      }
    }

    function applyPendingSeek(token, shouldPlay, announce) {
      if (token !== loadToken) return;
      var target = Math.max(0, Number(pendingSeek) || 0);

      try {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          target = Math.min(target, Math.max(0, audio.duration - 0.12));
        }
        audio.currentTime = target;
      } catch (error) {}

      state.currentTime = target;
      pendingSeek = null;
      writeState(shouldPlay, false);
      if (shouldPlay) {
        if (audio.paused) attemptPlay(announce);
        else {
          resumeWanted = false;
          state.isPlaying = true;
          setUi(true);
        }
      }
    }

    function loadTrack(index, time, shouldPlay, announce, fromGesture) {
      currentIndex = ((index % tracks.length) + tracks.length) % tracks.length;
      pendingSeek = Math.max(0, Number(time) || 0);
      resumeWanted = Boolean(shouldPlay);
      state.index = currentIndex;
      state.currentTime = pendingSeek;
      state.isPlaying = Boolean(shouldPlay);
      loadToken += 1;
      var token = loadToken;
      var sourceChanged = audio.getAttribute('src') !== tracks[currentIndex].src;

      if (sourceChanged) {
        audio.src = tracks[currentIndex].src;
        audio.load();
      }
      writeState(Boolean(shouldPlay), true);

      /*
       * Ask the browser to start while the navigation/user activation window
       * is still open. Waiting for loadedmetadata made uncached tracks 2-6
       * lose that window, even though track 1 usually resumed from cache.
       * The exact seek is applied as soon as metadata becomes available.
       */
      if (shouldPlay) attemptPlay(announce);

      if (fromGesture && pendingSeek === 0) {
        pendingSeek = null;
        try { audio.currentTime = 0; } catch (error) {}
        return;
      }

      if (audio.readyState >= 1) {
        applyPendingSeek(token, shouldPlay, announce);
      } else {
        audio.addEventListener('loadedmetadata', function () {
          applyPendingSeek(token, shouldPlay, announce);
        }, {once:true});
      }
    }

    function playCurrent(announce, fromGesture) {
      if (!audio.getAttribute('src')) {
        loadTrack(
          currentIndex,
          pendingSeek !== null ? pendingSeek : state.currentTime,
          true,
          announce,
          fromGesture
        );
        return;
      }

      if (pendingSeek !== null) {
        loadTrack(currentIndex, pendingSeek, true, announce, fromGesture);
        return;
      }
      attemptPlay(announce);
    }

    function pauseTrack(announce) {
      resumeWanted = false;
      audio.pause();
      state.isPlaying = false;
      writeState(false, pendingSeek !== null);
      setUi(false);
      if (announce) showTitle();
    }

    toggle.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (!audio.paused && !audio.ended) pauseTrack(false);
      else playCurrent(true, true);
    });

    audio.addEventListener('timeupdate', function () {
      if (pendingSeek === null && Date.now() - saveStamp > 500) {
        saveStamp = Date.now();
        writeState(!audio.paused, false);
      }
    });
    audio.addEventListener('play', function () {
      setUi(true);
    });
    audio.addEventListener('pause', function () {
      if (!resumeWanted) setUi(false);
    });
    audio.addEventListener('ended', function () {
      state.currentTime = 0;
      pendingSeek = 0;
      loadTrack((currentIndex + 1) % tracks.length, 0, true, true, false);
    });
    audio.addEventListener('error', function () {
      setUi(false);
      state.isPlaying = false;
      writeState(false, pendingSeek !== null);
    });

    function findAudioControl(event) {
      return event.target && event.target.closest
        ? event.target.closest(
          '.tc-play,.tc-play2,.tc-play3,.tc-play4,.tc-play5,.tc-play6,' +
          '.tc-stop,.tc-stop2,.tc-stop3,.tc-stop4,.tc-stop5,.tc-stop6,#toggle-loop'
        )
        : null;
    }

    function resumeOnGesture(event) {
      if (resumeWanted && !findAudioControl(event)) playCurrent(false, true);
    }

    document.addEventListener('pointerdown', resumeOnGesture, true);
    document.addEventListener('touchstart', resumeOnGesture, {capture:true, passive:true});
    document.addEventListener('keydown', resumeOnGesture, true);

    document.addEventListener('click', function (event) {
      var target = findAudioControl(event);
      if (target) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (target.id === 'toggle-loop') return;

        for (var index = 0; index < tracks.length; index++) {
          if (target.matches(tracks[index].play)) {
            loadTrack(index, 0, true, true, true);
            return;
          }
          if (target.matches(tracks[index].stop)) {
            pauseTrack(false);
            return;
          }
        }
      }

      var link = event.target && event.target.closest
        ? event.target.closest('a[href]')
        : null;
      if (link && state.isPlaying) writeState(true, pendingSeek !== null);
      if (resumeWanted && !target) playCurrent(false, true);
    }, true);

    window.addEventListener('pagehide', function () {
      writeState(
        state.isPlaying || (!audio.paused && !audio.ended),
        pendingSeek !== null
      );
    });
    window.addEventListener('beforeunload', function () {
      writeState(
        state.isPlaying || (!audio.paused && !audio.ended),
        pendingSeek !== null
      );
    });
    window.addEventListener('pageshow', function (event) {
      if (event.persisted && state.isPlaying && audio.paused) {
        playCurrent(false, false);
      }
    });

    /*
     * Resume from the exact saved second. Do not add page-load elapsed time:
     * the requested behaviour is pause-during-navigation, then continuation.
     */
    loadTrack(state.index, state.currentTime, state.isPlaying, false, false);
    setUi(false);
    window.setTimeout(function () {
      updateKrugControls(!audio.paused && !audio.ended);
    }, 350);

    window.NAVAudio = {
      play: function (index) {
        if (typeof index === 'number') {
          loadTrack(index, 0, true, true, true);
        } else {
          playCurrent(true, true);
        }
      },
      pause: function () { pauseTrack(false); },
      next: function () {
        loadTrack((currentIndex + 1) % tracks.length, 0, true, true, true);
      },
      getState: function () {
        return {
          index: currentIndex,
          currentTime: pendingSeek !== null
            ? pendingSeek
            : audio.currentTime,
          isPlaying: !audio.paused
        };
      }
    };
  }

  function initRuntime() {
    injectOptimizedEffectStyles();
    injectMenuEnhancements();
    initOptimizedDust();
    initOptimizedGrain();
    initMenuGrass();
    restoreNativeMacScroll();
    initPersistentAudio();
    window.setTimeout(initMenuGrass, 500);
    window.setTimeout(restoreNativeMacScroll, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRuntime, {once:true});
  } else {
    initRuntime();
  }
  window.addEventListener('load', restoreNativeMacScroll, {once:true});
})();


/* nav-zero-form-submit-fix */
(function () {
  if (window.__navZeroFormSubmitFix) return;
  window.__navZeroFormSubmitFix = true;
  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest
      ? event.target.closest('a[href="#sendzeroform"]')
      : null;
    if (!link) return;
    event.preventDefault();
    var record = link.closest('div[data-record-type="396"]');
    var form = record ? record.querySelector('form') : null;
    var submit = form ? form.querySelector('.t-submit') : null;
    if (submit) submit.click();
  });
})();
