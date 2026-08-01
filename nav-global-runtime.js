(function () {
  'use strict';

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
      '  text-shadow: none !important;',
      '  transition: none !important;',
      '}',
      '@media (hover: hover) {',
      '  #rec969552191 .t450__menu .t-menu__link-item:hover,',
      '  #rec969552191 .t450__menu .t-menu__link-item.t-active:hover {',
      '    color: #000 !important;',
      '    text-shadow: none !important;',
      '  }',
      '}',
      '#rec969552191 .t450__menu .t-menu__link-item:focus-visible {',
      '  color: #000 !important;',
      '  text-shadow: none !important;',
      '}',
      '#rec969552191 .t450__logoimg {',
      '  box-shadow: none !important;',
      '  filter: none !important;',
      '  mix-blend-mode: screen;',
      '  background: transparent !important;',
      '}',
      '#rec969552191 .nav-menu-dust {',
      '  position: absolute;',
      '  z-index: 1;',
      '  inset: 0;',
      '  overflow: hidden;',
      '  pointer-events: none;',
      '  contain: strict;',
      '  transform: translateZ(0);',
      '}',
      '#rec969552191 .nav-menu-dust__particle {',
      '  position: absolute;',
      '  left: var(--dust-x);',
      '  top: var(--dust-y);',
      '  width: var(--dust-size);',
      '  height: var(--dust-size);',
      '  border-radius: 50%;',
      '  background: radial-gradient(circle, rgba(255,255,255,.94) 0, rgba(255,252,238,.38) 34%, rgba(255,255,255,0) 74%);',
      '  opacity: var(--dust-opacity);',
      '  transform: translate3d(0, 12px, 0) scale(.72);',
      '  backface-visibility: hidden;',
      '  animation: nav-menu-dust-rise var(--dust-speed) ease-in-out var(--dust-delay) infinite;',
      '}',
      '@keyframes nav-menu-dust-rise {',
      '  0%   { transform: translate3d(0, 14px, 0) scale(.68); opacity: 0; }',
      '  18%  { opacity: var(--dust-opacity); }',
      '  55%  { transform: translate3d(var(--dust-drift), -22px, 0) scale(1); opacity: calc(var(--dust-opacity) * .82); }',
      '  100% { transform: translate3d(calc(var(--dust-drift) * -.35), -58px, 0) scale(.76); opacity: 0; }',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  #rec969552191 .nav-menu-dust__particle { animation: none; }',
      '}'
    ].join('\n');
    document.head.appendChild(styles);
  }

  function initMenuDust() {
    var menuPanel = document.querySelector('#rec969552191 .t450');
    if (!menuPanel) return;

    var menuLogo = menuPanel.querySelector('.t450__logoimg');
    if (menuLogo && menuLogo.src.indexOf('data:image/png;base64,') !== 0) {
      menuLogo.src = 'data:image/png;base64,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A1J8Y8rd33SZKCsL47TTTkMikQBjDCNHjkR5eblomlKpFNra2qAoCjRNw969e6FpGpxOJ3K5HDZt2oR3330X27Zt410xysvL0dnZCd4t8wayurpavNORzWbh8Xjw+uuvY+bMmay+vp45nU6ceeaZePXVV9nnn3/O1qxZw6699lrs27cPLpcLw4cPR1NTE7Zs2cL4oINhGNiyZQtbunQppk2bhvHjx4tXEXbt2gUA+Oyzz8ClgJUrVwo9hA9187x2JFMnAwbE7/cjn88jk8nC7/ciFovj9NNPhyzLWL9+PbZs2YLnnnsO7733HsLhMAKBAC677DIAxYLghz/8IXvmmWewe/duWJaFF154AU1NTXjqqadQKBQwZ84cNDQ00BtvvMGampoErTF8+HC88847eOyxx9DU1ASfz4d0Oo2bb76ZJZNJRKNRXHTRRWzmzJl44IEHaNy4cdTV1YVYLAaXyyWG6ZYvX45kMikoD94UPvvss+y1116DruuYOHEiKisrBfgffPABgKKgtXz5csYjBX/3hVeax8RDiuShDY/HhXRag8/35bztySefjHg8jquuugonnngiZsyYAcuycO2112LkyJHkcDjQ3NyMnp4ejBw5Ej09PYjFYti8eTP75JNP0NraiuOPPx67du1iqqriqaeegmmaqKqqwqeffoqnn34aH3zwAT744ANomobu7m4xJ6zrOlpaWnD22Wfj3HPPxZ133olcLofjjz8eDocDY8aMgcPhwNq1a5nb7Ra8GA9bpmni17/+tTjhYdasWYhEImCM4Qc/+AHy+Tzefvtt7Ny5U/RVpfZVmYijDkihYKC8PIxsVofP5wFjDAsXLmS8ofP5fLjttttw7733wjRN0Tn/7ne/QyqVQf974MhkMti4cSNeffVVBgBr165lL774IiZPnoxUKgVFUXDcccchGo2is7MTp556qlAPzz33XHi9Xvz1r39FIpEQpXEoFMLWrVvZggULMGnSJNx44400d+5cABDdek9Pz36jQ/zAAbfbjZ07d+Kmm24CUOxhEokECoUCqqqqoOs6/v73vwOA0M9LlUdObH7jgDCGfveXkMkU9YEvvtiH6dOno7m5GXPnzsWJJ56Ijo4OLF68GKqq4uWXX8ZZZ52FadOmUiQSQXV1NQKBAJqamsTUhsfjwbvvvosNGzbgnnvuIdu2MWrUKLS1teGq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';
      menuLogo.removeAttribute('srcset');
    }

    if (menuPanel.querySelector('.nav-menu-dust')) return;

    var legacyGrass = menuPanel.querySelector('.nav-menu-grass');
    if (legacyGrass) legacyGrass.remove();

    var dust = document.createElement('div');
    dust.className = 'nav-menu-dust';
    dust.setAttribute('aria-hidden', 'true');

    var particleCount = window.innerWidth <= 640 ? 24 : 34;
    var seed = 109;
    var fragment = document.createDocumentFragment();

    function random() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    for (var index = 0; index < particleCount; index++) {
      var particle = document.createElement('i');
      particle.className = 'nav-menu-dust__particle';
      particle.style.setProperty('--dust-x', (3 + random() * 94).toFixed(2) + '%');
      particle.style.setProperty('--dust-y', (8 + random() * 88).toFixed(2) + '%');
      particle.style.setProperty('--dust-size', (3 + random() * 8).toFixed(1) + 'px');
      particle.style.setProperty('--dust-opacity', (0.24 + random() * 0.48).toFixed(2));
      particle.style.setProperty('--dust-drift', (-18 + random() * 36).toFixed(1) + 'px');
      particle.style.setProperty('--dust-speed', (6.5 + random() * 8).toFixed(2) + 's');
      particle.style.setProperty('--dust-delay', (-random() * 13).toFixed(2) + 's');
      fragment.appendChild(particle);
    }

    dust.appendChild(fragment);
    menuPanel.appendChild(dust);
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
    initMenuDust();
    restoreNativeMacScroll();
    initPersistentAudio();
    window.setTimeout(initMenuDust, 500);
    window.setTimeout(restoreNativeMacScroll, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRuntime, {once:true});
  } else {
    initRuntime();
  }
  window.addEventListener('load', restoreNativeMacScroll, {once:true});
})();
