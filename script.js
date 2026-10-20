(() => {
  const year = document.querySelector('#copyright-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const progress = document.querySelector('.scroll-progress span');
  if (progress) {
    let scheduled = false;
    const updateProgress = () => {
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollRange > 0 ? Math.min(1, window.scrollY / scrollRange) : 0;
      progress.style.transform = `scaleX(${amount})`;
      scheduled = false;
    };

    window.addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(updateProgress);
    }, { passive: true });
    updateProgress();
  }

  const motionUnits = [...document.querySelectorAll('[data-motion-unit]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  motionUnits.forEach((unit) => {
    const object = unit.querySelector('.motion-object');
    const fallback = unit.querySelector('[data-motion-fallback]');
    const motionFigure = unit.querySelector('.motion-figure');
    const controls = unit.querySelector('.motion-controls');
    const playButton = unit.querySelector('[data-motion-play]');
    const pauseButton = unit.querySelector('[data-motion-pause]');
    const replayButton = unit.querySelector('[data-motion-replay]');
    const status = unit.querySelector('[data-motion-status]');
    if (!object || !controls || !playButton || !pauseButton || !replayButton || !status) return;

    const mobileSource = object.dataset.mobile;
    const desktopSource = object.getAttribute('data');
    const mobileQuery = window.matchMedia('(max-width: 680px)');
    const sourceForViewport = () => mobileQuery.matches && mobileSource ? mobileSource : desktopSource;
    const motionState = {
      svg: null,
      animations: [],
      ready: false,
      playing: false,
      started: false,
      finished: false,
      gsapTimeline: null
    };

    const setStatus = (message) => { status.textContent = message; };
    const refreshControls = () => {
      playButton.disabled = motionState.playing || !motionState.ready;
      pauseButton.disabled = !motionState.playing || !motionState.ready;
      replayButton.disabled = !motionState.ready;
    };

    const getSvgDocument = () => {
      let doc = null;
      try {
        doc = object.contentDocument;
      } catch {
        // Cross-origin fallback
      }
      const svg = doc?.documentElement;
      if (!svg || svg.localName !== 'svg') {
        object.hidden = true;
        object.style.opacity = '';
        return false;
      }
      motionState.svg = svg;

      // Check for GSAP animatable nodes inside SVG
      const animNodes = doc.querySelectorAll('.hero-packet, animateMotion, animate, animateTransform, set');
      motionState.animations = [...animNodes].filter((a) => a.getAttribute('begin') === 'indefinite' || a.classList.contains('hero-packet'));
      motionState.ready = motionState.animations.length > 0;
      motionState.started = false;

      const aspectRatio = svg.viewBox?.baseVal?.width && svg.viewBox?.baseVal?.height
        ? `${svg.viewBox.baseVal.width} / ${svg.viewBox.baseVal.height}`
        : '16 / 9';
      if (motionFigure) motionFigure.style.aspectRatio = aspectRatio;
      object.style.aspectRatio = aspectRatio;

      if (motionState.ready) {
        if (fallback) fallback.hidden = true;
        object.hidden = false;
        object.style.opacity = '';
        object.removeAttribute('aria-hidden');
        controls.hidden = false;
        setStatus(reducedMotion.matches ? 'Paused · motion preference respected' : 'Paused · press Play to begin');
      } else {
        object.hidden = true;
        object.style.opacity = '';
        setStatus('Static diagram available');
      }
      refreshControls();
    };

    object.addEventListener('load', getSvgDocument);
    object.addEventListener('error', () => {
      object.hidden = true;
      object.style.opacity = '';
      setStatus('Static diagram available');
    });

    const source = sourceForViewport();
    if (object.getAttribute('data') !== source) object.setAttribute('data', source);
    object.style.opacity = '0';
    object.setAttribute('aria-hidden', 'true');
    object.hidden = false;
    if (object.contentDocument?.documentElement?.localName === 'svg') getSvgDocument();

    mobileQuery.addEventListener?.('change', () => {
      if (motionState.playing) stopAnimation();
      motionState.ready = false;
      motionState.animations = [];
      motionState.svg = null;
      motionState.started = false;
      object.hidden = true;
      if (fallback) fallback.hidden = false;
      object.setAttribute('data', sourceForViewport());
      object.style.opacity = '0';
      object.setAttribute('aria-hidden', 'true');
      object.hidden = false;
      setStatus('Loading diagram…');
      refreshControls();
    });

    const startAnimation = (rewind = false) => {
      if (!motionState.ready || !motionState.svg) return;
      if (rewind || motionState.finished) {
        try {
          motionState.svg.pauseAnimations();
          motionState.svg.setCurrentTime(0);
        } catch { /* ignore */ }
        motionState.started = false;
        motionState.finished = false;
      }
      if (!motionState.started) {
        motionState.animations.forEach((animation, index) => {
          try {
            if (typeof animation.beginElement === 'function') {
              animation.beginElement();
            } else if (typeof animation.beginElementAt === 'function') {
              animation.beginElementAt(index * 0.4);
            }
          } catch { /* unsupported SMIL handled gracefully */ }
        });
        motionState.started = true;
      }
      try {
        motionState.svg.unpauseAnimations();
      } catch { /* ignore */ }
      motionState.playing = true;
      setStatus('Animation playing');
      refreshControls();
    };

    function stopAnimation() {
      try {
        motionState.svg?.pauseAnimations();
      } catch { /* ignore */ }
      motionState.playing = false;
      setStatus('Animation paused');
      refreshControls();
    }

    playButton.addEventListener('click', () => startAnimation());
    pauseButton.addEventListener('click', stopAnimation);
    replayButton.addEventListener('click', () => startAnimation(true));
    reducedMotion.addEventListener?.('change', () => {
      if (reducedMotion.matches && motionState.playing) stopAnimation();
      else if (!motionState.playing) setStatus(reducedMotion.matches ? 'Paused · motion preference respected' : 'Paused · press Play to begin');
    });
  });

  if (!('IntersectionObserver' in window)) return;
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
  const navLinks = [...document.querySelectorAll('.main-nav a')].filter((link) => {
    try {
      const destination = new URL(link.href, window.location.href);
      const destPath = destination.pathname.replace(/\/index\.html$/, '/');
      return destPath === currentPath && destination.hash;
    } catch {
      return false;
    }
  });
  const sections = navLinks
    .map((link) => document.querySelector(link.hash))
    .filter(Boolean);

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isCurrent = link.hash === `#${entry.target.id}`;
        link.classList.toggle('is-current', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-28% 0px -62% 0px' });

  sections.forEach((section) => navObserver.observe(section));
})();
