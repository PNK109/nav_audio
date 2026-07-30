(function () {
  'use strict';

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
    var storageKey = 'nav.audio.state.v2';
    var state = {index:0, currentTime:0, isPlaying:false, updatedAt:Date.now()};
    try {
      var saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
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

    function persist(forcePlaying) {
      var now = Date.now();
      state.index = currentIndex;
      if (Number.isFinite(audio.currentTime)) state.currentTime = Math.max(0, audio.currentTime);
      if (typeof forcePlaying === 'boolean') state.isPlaying = forcePlaying;
      state.updatedAt = now;
      try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (error) {}
    }

    function setUi(playing) {
      toggle.textContent = playing ? 'Ⅱ' : '▶';
      toggle.setAttribute('aria-label', playing ? 'Поставить музыку на паузу' : 'Воспроизвести музыку');
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
      for (var i = 0; i < tracks.length; i++) {
        var active = playing && i === currentIndex;
        var playNodes = document.querySelectorAll(tracks[i].play);
        var stopNodes = document.querySelectorAll(tracks[i].stop);
        for (var p = 0; p < playNodes.length; p++) {
          playNodes[p].style.display = active ? 'none' : '';
          playNodes[p].style.opacity = active ? '0' : '1';
        }
        for (var s = 0; s < stopNodes.length; s++) {
          stopNodes[s].style.display = active ? '' : 'none';
          stopNodes[s].style.opacity = active ? '1' : '0';
        }
      }
    }

    function seekWhenReady(time) {
      var target = Math.max(0, Number(time) || 0);
      function applySeek() {
        try {
          if (Number.isFinite(audio.duration) && audio.duration > 0) {
            audio.currentTime = Math.min(target, Math.max(0, audio.duration - 0.12));
          } else {
            audio.currentTime = target;
          }
        } catch (error) {}
      }
      if (audio.readyState >= 1) applySeek();
      else audio.addEventListener('loadedmetadata', applySeek, {once:true});
    }

    function loadTrack(index, time) {
      currentIndex = ((index % tracks.length) + tracks.length) % tracks.length;
      if (audio.getAttribute('src') !== tracks[currentIndex].src) {
        audio.src = tracks[currentIndex].src;
        audio.load();
      }
      seekWhenReady(time || 0);
      state.index = currentIndex;
      state.currentTime = Math.max(0, Number(time) || 0);
    }

    function playTrack(index, time, announce) {
      if (typeof index === 'number' && index !== currentIndex) {
        loadTrack(index, time || 0);
      } else if (!audio.getAttribute('src')) {
        loadTrack(currentIndex, time || state.currentTime || 0);
      } else if (typeof time === 'number') {
        seekWhenReady(time);
      }
      resumeWanted = true;
      state.isPlaying = true;
      persist(true);
      var promise = audio.play();
      if (promise && typeof promise.then === 'function') {
        promise.then(function () {
          resumeWanted = false;
          state.isPlaying = true;
          persist(true);
          setUi(true);
          if (announce !== false) showTitle();
        }).catch(function () {
          resumeWanted = true;
          state.isPlaying = true;
          persist(true);
          setUi(false);
          if (announce !== false) showTitle(tracks[currentIndex].title);
        });
      } else {
        resumeWanted = false;
        setUi(true);
        if (announce !== false) showTitle();
      }
    }

    function pauseTrack(announce) {
      resumeWanted = false;
      audio.pause();
      persist(false);
      setUi(false);
      if (announce) showTitle();
    }

    toggle.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (!audio.paused && !audio.ended) pauseTrack(false);
      else playTrack(currentIndex, state.currentTime || audio.currentTime || 0, true);
    });

    audio.addEventListener('timeupdate', function () {
      if (Date.now() - saveStamp > 750) {
        saveStamp = Date.now();
        persist(!audio.paused);
      }
    });
    audio.addEventListener('play', function () { setUi(true); });
    audio.addEventListener('pause', function () {
      if (!resumeWanted) setUi(false);
    });
    audio.addEventListener('ended', function () {
      state.currentTime = 0;
      playTrack((currentIndex + 1) % tracks.length, 0, true);
    });
    audio.addEventListener('error', function () {
      setUi(false);
      state.isPlaying = false;
      persist(false);
    });

    document.addEventListener('click', function (event) {
      var target = event.target && event.target.closest ? event.target.closest('.tc-play,.tc-play2,.tc-play3,.tc-play4,.tc-play5,.tc-play6,.tc-stop,.tc-stop2,.tc-stop3,.tc-stop4,.tc-stop5,.tc-stop6,#toggle-loop') : null;
      if (target) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (target.id === 'toggle-loop') return;
        for (var i = 0; i < tracks.length; i++) {
          if (target.matches(tracks[i].play)) {
            playTrack(i, 0, true);
            return;
          }
          if (target.matches(tracks[i].stop)) {
            pauseTrack(false);
            return;
          }
        }
      }
      var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
      if (link && state.isPlaying) persist(true);
      if (resumeWanted && !target) playTrack(currentIndex, state.currentTime || 0, false);
    }, true);

    window.addEventListener('pagehide', function () {
      persist(state.isPlaying || (!audio.paused && !audio.ended));
    });
    window.addEventListener('beforeunload', function () {
      persist(state.isPlaying || (!audio.paused && !audio.ended));
    });

    var elapsed = state.isPlaying ? Math.min(12, Math.max(0, (Date.now() - state.updatedAt) / 1000)) : 0;
    loadTrack(state.index, state.currentTime + elapsed);
    setUi(false);
    window.setTimeout(function () { updateKrugControls(false); }, 350);
    if (state.isPlaying) {
      window.setTimeout(function () {
        playTrack(state.index, state.currentTime + elapsed, false);
      }, 80);
    }

    window.NAVAudio = {
      play: function (index) { playTrack(typeof index === 'number' ? index : currentIndex, 0, true); },
      pause: function () { pauseTrack(false); },
      next: function () { playTrack((currentIndex + 1) % tracks.length, 0, true); },
      getState: function () { return {index:currentIndex, currentTime:audio.currentTime, isPlaying:!audio.paused}; }
    };
  }


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPersistentAudio, {once:true});
  } else {
    initPersistentAudio();
  }
})();
