(function () {
  'use strict';

  var runtimeScript = document.currentScript;
  var runtimeRoute = window.location.pathname.replace(/\/+$/, '') || '/';
  var runtimeVisualSafeMode =
    runtimeRoute === '/kl' ||
    runtimeRoute === '/kl-pay' ||
    runtimeRoute === '/kl-success' ||
    runtimeRoute.indexOf('/members') === 0;

  function injectDesignSystem() {
    if (document.getElementById('nav-design-system-v1')) return;
    if (!runtimeScript || !runtimeScript.src) return;

    if (runtimeVisualSafeMode) return;

    var stylesheet = document.createElement('link');
    stylesheet.id = 'nav-design-system-v1';
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL('nav-design-system-v1.css', runtimeScript.src).href;
    document.head.appendChild(stylesheet);
  }


  function initPrivateCourseCommerce() {
    var route = window.location.pathname.replace(/\/+$/, '') || '/';
    var markerKey = 'nav.checkout.context.v1';
    var privateProductIds = ['238824202294', '205660180354', '399321648234'];

    if (route === '/shop') {
      var style = document.createElement('style');
      style.id = 'nav-private-course-products';
      style.textContent = privateProductIds.map(function (id) {
        return [
          '.js-product[data-product-uid="' + id + '"]',
          '.t-store__card[data-product-uid="' + id + '"]',
          '[data-product-id="' + id + '"]',
          '[data-product-lid="' + id + '"]'
        ].join(',') + '{display:none!important}';
      }).join('\n');
      document.head.appendChild(style);

      var selectors = privateProductIds.reduce(function (items, id) {
        return items.concat([
          '.js-product[data-product-uid="' + id + '"]',
          '.t-store__card[data-product-uid="' + id + '"]',
          '[data-product-id="' + id + '"]',
          '[data-product-lid="' + id + '"]'
        ]);
      }, []).join(',');

      function removePrivateCards() {
        if (!selectors) return;
        var cards = document.querySelectorAll(selectors);
        for (var index = 0; index < cards.length; index++) cards[index].remove();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removePrivateCards, {once:true});
      } else {
        removePrivateCards();
      }

      var shopObserver = new MutationObserver(removePrivateCards);
      shopObserver.observe(document.documentElement, {childList:true, subtree:true});
      window.addEventListener('pagehide', function () { shopObserver.disconnect(); }, {once:true});
    }

    if (route === '/kl-pay') {
      function markCourseCheckout() {
        try {
          localStorage.setItem(markerKey, JSON.stringify({
            type: 'kl',
            updatedAt: Date.now()
          }));
        } catch (error) {}
      }

      document.addEventListener('click', function (event) {
        var target = event.target && event.target.closest
          ? event.target.closest(
            '.js-store-prod-btn,.t-store__card__btn,.t706__submit,' +
            '.t706__cartwin-form .t-submit'
          )
          : null;
        if (target) markCourseCheckout();
      }, true);

      document.addEventListener('submit', function (event) {
        if (
          event.target &&
          event.target.closest &&
          event.target.closest('.t706__cartwin-form,.t-form')
        ) {
          markCourseCheckout();
        }
      }, true);
    }

    if (route === '/success') {
      try {
        var marker = JSON.parse(localStorage.getItem(markerKey) || 'null');
        if (
          marker &&
          marker.type === 'kl' &&
          Date.now() - Number(marker.updatedAt || 0) < 172800000
        ) {
          localStorage.removeItem(markerKey);
          window.location.replace('/kl-success' + window.location.search);
        }
      } catch (error) {}
    }
  }

  function injectCanonicalPreloaderStyles() {
    if (runtimeVisualSafeMode) return;
    if (document.getElementById('nav-canonical-preloader-styles')) return;

    var styles = document.createElement('style');
    styles.id = 'nav-canonical-preloader-styles';
    styles.textContent = [
      '.TiPreloaderContainer {',
      '  position: fixed !important;',
      '  z-index: 999999 !important;',
      '  inset: 0 !important;',
      '  display: flex;',
      '  width: 100% !important;',
      '  height: 100% !important;',
      '  align-items: center !important;',
      '  justify-content: center !important;',
      '  padding: 24px !important;',
      '  color: #fff !important;',
      '  background: #020202 !important;',
      '  text-align: center !important;',
      '  transform: none !important;',
      '  transition: opacity .18s ease !important;',
      '}',
      '.TiCodeLoader {',
      '  display: flex !important;',
      '  flex-direction: column !important;',
      '  align-items: center !important;',
      '  justify-content: center !important;',
      '  text-align: center !important;',
      '}',
      '.TiCodePercentage {',
      '  margin: 0 !important;',
      '  color: #fff !important;',
      '  font: 400 clamp(64px, 10vw, 100px)/.92 Arial, sans-serif !important;',
      '  letter-spacing: -.055em !important;',
      '  text-align: center !important;',
      '}',
      '.TiCodeText {',
      '  margin: 18px 0 0 !important;',
      '  color: #fff !important;',
      '  font: 400 clamp(16px, 2.5vw, 25px)/1.2 Arial, sans-serif !important;',
      '  letter-spacing: 0 !important;',
      '  text-align: center !important;',
      '}',
      '#nav-world-embed { position: relative !important; background: #020202 !important; }',
      '#nav-world-embed .nav-home-embed-loader {',
      '  position: absolute !important;',
      '  z-index: 3 !important;',
      '  pointer-events: none !important;',
      '}',
      '#nav-world-embed .nav-home-embed-loader.is-leaving { opacity: 0 !important; }',
      '.TiPreloaderContainer[data-nav-loader-duplicate="true"] { display: none !important; }'
    ].join('\n');
    document.head.appendChild(styles);
  }

  function initHomepageEmbedShell() {
    var route = window.location.pathname.replace(/\/+$/, '') || '/';
    if (route !== '/') return;

    var root = document.getElementById('nav-world-embed');
    if (!root || root.dataset.navHomeLoaderReady === 'true') return;

    var frame = root.querySelector('iframe[src*="knife-ecosystem-avatar"]');
    if (!frame) return;

    root.dataset.navHomeLoaderReady = 'true';

    frame.setAttribute('loading', 'eager');
    frame.setAttribute('fetchpriority', 'high');

    var loader = document.createElement('div');
    var percentage = document.createElement('div');
    var copy = document.createElement('div');
    var content = document.createElement('div');
    loader.className = 'TiPreloaderContainer nav-home-embed-loader';
    loader.setAttribute('aria-hidden', 'true');
    content.className = 'TiCodeLoader';
    percentage.className = 'TiCodePercentage';
    percentage.textContent = '0%';
    copy.className = 'TiCodeText';
    copy.textContent = 'Разворачиваем карту…';
    content.appendChild(percentage);
    content.appendChild(copy);
    loader.appendChild(content);
    root.appendChild(loader);

    var removed = false;
    var fallbackTimer = 0;
    var progressTimer = 0;
    var progress = 0;

    function advanceProgress() {
      if (removed || progress >= 94) return;
      progress += progress < 55 ? 3 : progress < 82 ? 2 : 1;
      progress = Math.min(94, progress);
      percentage.textContent = progress + '%';
      progressTimer = window.setTimeout(advanceProgress, 72);
    }

    function requestFrameStatus() {
      if (!frame.contentWindow) return;
      frame.contentWindow.postMessage({type:'nav-world-status-request'}, '*');
    }

    function handleFrameMessage(event) {
      if (
        event.source === frame.contentWindow &&
        event.data &&
        event.data.type === 'nav-world-ready'
      ) {
        removeLoader();
      }
    }

    function removeLoader() {
      if (removed) return;
      removed = true;
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(progressTimer);
      window.removeEventListener('message', handleFrameMessage);
      percentage.textContent = '100%';
      window.setTimeout(function () {
        loader.classList.add('is-leaving');
        window.setTimeout(function () { loader.remove(); }, 190);
      }, 110);
    }

    window.addEventListener('message', handleFrameMessage);
    frame.addEventListener('load', requestFrameStatus);
    advanceProgress();
    requestFrameStatus();
    fallbackTimer = window.setTimeout(removeLoader, 15000);
  }

  injectDesignSystem();
  initPrivateCourseCommerce();
  injectCanonicalPreloaderStyles();
  initHomepageEmbedShell();

  /*
   * Reserve the public layer IDs before Tilda's inline DOMContentLoaded
   * handlers run. This prevents the legacy, repaint-heavy canvas effects from
   * starting while this external runtime is loading.
   */
  var effectIds = runtimeVisualSafeMode
    ? []
    : ['nav-site-dust', 'nav-site-film-grain'];
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


  function initCommerceEnhancements() {
    if (!document.getElementById('nav-commerce-enhancement-styles')) {
      var styles = document.createElement('style');
      styles.id = 'nav-commerce-enhancement-styles';
      styles.textContent = [
        '.t706__cartwin {',
        '  background-color: #b9def4 !important;',
        '  background-image: url("https://raw.githack.com/PNK109/nav_audio/226ac2946cf8bc422894c1f92b4f886083daf602/assets/sky-tile.jpg") !important;',
        '  background-repeat: repeat !important;',
        '  background-position: center top !important;',
        '}',
        '.t706__cartwin-content {',
        '  color: #0b1822 !important;',
        '  background: rgba(241, 249, 253, .92) !important;',
        '  border: 1px solid rgba(8, 30, 46, .58) !important;',
        '  border-radius: 2px !important;',
        '  box-shadow: 8px 8px 0 rgba(18, 59, 82, .32) !important;',
        '}',
        '.t706__cartwin-bottom {',
        '  color: #0b1822 !important;',
        '  background: transparent !important;',
        '}',
        '.t706__cartwin-bottom * {',
        '  color: #0b1822 !important;',
        '  text-shadow: none !important;',
        '}',
        '.t706__cartwin-heading,',
        '.t706__product-title,',
        '.t706__product-title a,',
        '.t706__product-amount,',
        '.t706__cartwin-prodamount-wrap,',
        '.t706__cartwin-totalamount-wrap,',
        '.t706__auth,',
        '.t706__auth a,',
        '.t706__form-bottom-text,',
        '.t706__form-bottom-text a {',
        '  color: #0b1822 !important;',
        '  text-shadow: none !important;',
        '}',
        '.t706__cartwin-content .t706__auth *,',
        '.t706__cartwin-content .t-input-title,',
        '.t706__cartwin-content .t-input-subtitle,',
        '.t706__cartwin-content .t-input-error,',
        '.t706__cartwin-content .t-form__errorbox-item,',
        '.t706__cartwin-content .t-form__errorbox-middle,',
        '.t706__cartwin-content .t-input-phonemask__select-code,',
        '.t706__cartwin-content .t706__cartwin-totalamount-info {',
        '  color: #0b1822 !important;',
        '  text-shadow: none !important;',
        '}',
        '.t706__product-title a {',
        '  font-weight: 600 !important;',
        '  text-decoration-color: rgba(11, 24, 34, .35) !important;',
        '}',
        '.t706__auth {',
        '  padding: 14px 16px !important;',
        '  background: rgba(255, 255, 255, .78) !important;',
        '  border: 1px solid rgba(8, 30, 46, .26) !important;',
        '}',
        '.t706__cartwin-content .t-input,',
        '.t706__cartwin-content .t-input-phonemask__wrap {',
        '  color: #0b1822 !important;',
        '  background: rgba(255, 255, 255, .9) !important;',
        '  border-color: rgba(8, 30, 46, .42) !important;',
        '}',
        '.t706__cartwin-content input::placeholder {',
        '  color: #385264 !important;',
        '  opacity: .78 !important;',
        '}',
        '.t706__product-del img {',
        '  filter: none !important;',
        '  opacity: .72;',
        '}',
        '.t706__close-icon {',
        '  stroke: #102a3a !important;',
        '}',
        '.nav-offer-consent {',
        '  display: flex;',
        '  align-items: flex-start;',
        '  gap: 10px;',
        '  margin: 18px 0 14px;',
        '  padding: 12px 14px;',
        '  color: #0b1822;',
        '  background: rgba(255, 255, 255, .76);',
        '  border: 1px solid rgba(8, 30, 46, .34);',
        '  font: 14px/1.4 Arial, Helvetica, sans-serif;',
        '  cursor: pointer;',
        '}',
        '.nav-offer-consent input {',
        '  flex: 0 0 auto;',
        '  width: 18px;',
        '  height: 18px;',
        '  margin: 1px 0 0;',
        '  accent-color: #184f70;',
        '}',
        '.nav-offer-consent a {',
        '  color: #0a3f5f !important;',
        '  text-decoration: underline;',
        '}',
        '.t706__orderform .t-submit {',
        '  color: #8d0015 !important;',
        '  background: #fff239 !important;',
        '  border: 2px solid #8d0015 !important;',
        '  box-shadow: 5px 5px 0 rgba(141, 0, 21, .28) !important;',
        '  font-weight: 700 !important;',
        '  opacity: 1 !important;',
        '  filter: none !important;',
        '}',
        '.t706__orderform .t-submit *,',
        '.t706__orderform .t-submit .t-btnflex__text {',
        '  color: inherit !important;',
        '}',
        '.t706__orderform .t-submit:disabled,',
        '.t706__orderform .t-submit[aria-disabled="true"] {',
        '  cursor: not-allowed !important;',
        '  color: #9a4150 !important;',
        '  background: #ffe788 !important;',
        '  border-color: #b45566 !important;',
        '  box-shadow: 3px 3px 0 rgba(141, 0, 21, .18) !important;',
        '  opacity: .82 !important;',
        '  filter: none !important;',
        '  transform: none !important;',
        '}',
        '.nav-cart-alt-payment {',
        '  color: #0b1822 !important;',
        '  text-align: center;',
        '}',
        '.nav-cart-alt-payment a:not(.nav-cart-alt-payment-button) {',
        '  color: #0a3f5f !important;',
        '}',
        '.nav-cart-alt-payment-button {',
        '  display: flex !important;',
        '  align-items: center;',
        '  justify-content: center;',
        '  min-height: 46px;',
        '  margin-top: 12px;',
        '  padding: 10px 16px;',
        '  box-sizing: border-box;',
        '  color: #fff !important;',
        '  background: #0b2d46;',
        '  border: 2px solid #071b2a;',
        '  box-shadow: 4px 4px 0 rgba(7, 27, 42, .24);',
        '  font-weight: 700;',
        '  letter-spacing: .025em;',
        '  text-decoration: none !important;',
        '}',
        '.nav-cart-alt-payment-button:hover,',
        '.nav-cart-alt-payment-button:focus-visible {',
        '  color: #8d0015 !important;',
        '  background: #fff239;',
        '  outline: 2px solid #8d0015;',
        '  outline-offset: 2px;',
        '}',
        'html body .t706__cartwin .t706__orderform .t-submit {',
        '  border: 2px solid #8d0015 !important;',
        '  box-shadow: 5px 5px 0 rgba(141, 0, 21, .28) !important;',
        '}',
        'html body .t706__cartwin .t706__orderform .t-submit:disabled,',
        'html body .t706__cartwin .t706__orderform .t-submit[aria-disabled="true"] {',
        '  border-color: #b45566 !important;',
        '  box-shadow: 3px 3px 0 rgba(141, 0, 21, .18) !important;',
        '}',
        'html body .t706__cartwin .nav-cart-alt-payment .nav-cart-alt-payment-button {',
        '  color: #fff !important;',
        '}',
        'html body .t706__cartwin .nav-cart-alt-payment .nav-cart-alt-payment-button:hover,',
        'html body .t706__cartwin .nav-cart-alt-payment .nav-cart-alt-payment-button:focus-visible {',
        '  color: #8d0015 !important;',
        '}',
        '@media (max-width: 680px) {',
        '  .t706__cartwin-content {',
        '    width: calc(100% - 24px) !important;',
        '    margin: 12px auto 30px !important;',
        '    padding-right: 18px !important;',
        '    padding-left: 18px !important;',
        '    box-sizing: border-box;',
        '  }',
        '  .nav-offer-consent {',
        '    font-size: 13px;',
        '  }',
        '}'
      ].join('\n');
      document.head.appendChild(styles);
    }

    function enhanceCartForm() {
      var forms = document.querySelectorAll('.t706__orderform form');
      for (var formIndex = 0; formIndex < forms.length; formIndex++) {
        var form = forms[formIndex];
        if (form.dataset.navOfferConsentReady === 'true') continue;

        var submitWrap = form.querySelector('.t-form__submit');
        var submit = submitWrap && submitWrap.querySelector('button[type="submit"], input[type="submit"]');
        if (!submitWrap || !submit) continue;

        var label = document.createElement('label');
        var checkbox = document.createElement('input');
        var copy = document.createElement('span');
        var offerLink = document.createElement('a');

        label.className = 'nav-offer-consent';
        checkbox.type = 'checkbox';
        checkbox.required = true;
        checkbox.setAttribute('aria-label', 'Принять условия публичной оферты');
        offerLink.href = '/offer';
        offerLink.target = '_blank';
        offerLink.rel = 'noreferrer noopener';
        offerLink.textContent = 'публичной оферты';
        copy.appendChild(document.createTextNode('Я ознакомился и принимаю условия '));
        copy.appendChild(offerLink);
        copy.appendChild(document.createTextNode('.'));
        label.appendChild(checkbox);
        label.appendChild(copy);
        submitWrap.parentNode.insertBefore(label, submitWrap);

        submit.disabled = true;
        submit.setAttribute('aria-disabled', 'true');

        checkbox.addEventListener('change', function () {
          var currentLabel = this.closest('.nav-offer-consent');
          var currentForm = currentLabel && currentLabel.closest('form');
          var currentSubmit = currentForm && currentForm.querySelector('.t-form__submit button[type="submit"], .t-form__submit input[type="submit"]');
          if (!currentSubmit) return;
          currentSubmit.disabled = !this.checked;
          currentSubmit.setAttribute('aria-disabled', this.checked ? 'false' : 'true');
        });

        form.addEventListener('submit', function (event) {
          var consent = this.querySelector('.nav-offer-consent input[type="checkbox"]');
          if (consent && !consent.checked) {
            event.preventDefault();
            event.stopImmediatePropagation();
            consent.focus();
          }
        }, true);

        form.dataset.navOfferConsentReady = 'true';
      }

      var bottomTexts = document.querySelectorAll('.t706__form-bottom-text');
      for (var textIndex = 0; textIndex < bottomTexts.length; textIndex++) {
        var bottomText = bottomTexts[textIndex];
        if (bottomText.dataset.navCleaned === 'true') continue;
        bottomText.classList.add('nav-cart-alt-payment');
        bottomText.textContent = 'Для пользователей из-за рубежа доступны альтернативные методы оплаты.';

        var alternativeButton = document.createElement('a');
        alternativeButton.className = 'nav-cart-alt-payment-button';
        alternativeButton.href = '/alternative';
        alternativeButton.textContent = 'ВЫБРАТЬ PAYPAL / USDT';
        bottomText.appendChild(alternativeButton);
        bottomText.dataset.navCleaned = 'true';
      }
    }

    enhanceCartForm();
    var observer = new MutationObserver(enhanceCartForm);
    observer.observe(document.body, {childList:true, subtree:true});
  }

  function initMenuDust() {
    var menuPanel = document.querySelector('#rec969552191 .t450');
    if (!menuPanel) return;

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

  function injectAudioControlStyles() {
    if (document.getElementById('nav-audio-control-styles')) return;

    var styles = document.createElement('style');
    styles.id = 'nav-audio-control-styles';
    styles.textContent = [
      '#nav-global-audio-player .nav-audio-toggle {',
      '  position: relative !important;',
      '  width: 32px !important;',
      '  height: 32px !important;',
      '  min-width: 32px !important;',
      '  min-height: 32px !important;',
      '  padding: 0 !important;',
      '  border-radius: 50% !important;',
      '  font-size: 0 !important;',
      '  line-height: 0 !important;',
      '  -webkit-appearance: none !important;',
      '  appearance: none !important;',
      '}',
      '#nav-global-audio-player .nav-audio-toggle::before {',
      '  content: "" !important;',
      '  position: absolute !important;',
      '  left: calc(50% + 1px) !important;',
      '  top: 50% !important;',
      '  display: block !important;',
      '  width: 6px !important;',
      '  height: 9px !important;',
      '  border: 0 !important;',
      '  background: currentColor !important;',
      '  -webkit-clip-path: polygon(0 0, 100% 50%, 0 100%) !important;',
      '  clip-path: polygon(0 0, 100% 50%, 0 100%) !important;',
      '  transform: translate(-50%, -50%) !important;',
      '}',
      '#nav-global-audio-player.is-playing .nav-audio-toggle::before {',
      '  left: 50% !important;',
      '  width: 8px !important;',
      '  height: 10px !important;',
      '  border: 0 !important;',
      '  background: linear-gradient(to right, currentColor 0 3px, transparent 3px 5px, currentColor 5px 8px) !important;',
      '  -webkit-clip-path: none !important;',
      '  clip-path: none !important;',
      '  transform: translate(-50%, -50%) !important;',
      '}'
    ].join('\n');
    document.head.appendChild(styles);
  }

  function initPersistentAudio() {
    injectAudioControlStyles();
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
    audio.controls = false;
    audio.removeAttribute('controls');
    audio.setAttribute('aria-hidden', 'true');
    audio.tabIndex = -1;
    audio.style.display = 'none';
    audio.volume = 0.82;
    player.id = 'nav-global-audio-player';
    toggle.type = 'button';
    toggle.className = 'nav-audio-toggle';
    toggle.setAttribute('aria-label', 'Воспроизвести музыку');
    toggle.dataset.state = 'play';
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
      toggle.textContent = '';
      toggle.dataset.state = playing ? 'pause' : 'play';
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
    if (runtimeVisualSafeMode) return;
    injectCanonicalPreloaderStyles();
    initHomepageEmbedShell();
    injectOptimizedEffectStyles();
    injectMenuEnhancements();
    initOptimizedDust();
    initOptimizedGrain();
    initMenuDust();
    initCommerceEnhancements();
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
