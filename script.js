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
    const motionState = { svg: null, animations: [], ready: false, playing: false, started: false };

    const setStatus = (message) => { status.textContent = message; };
    const refreshControls = () => {
      playButton.disabled = motionState.playing || !motionState.ready;
      pauseButton.disabled = !motionState.playing || !motionState.ready;
      replayButton.disabled = !motionState.ready;
    };
    const getSvgDocument = () => {
      const document = object.contentDocument;
      const svg = document?.documentElement;
      if (!svg || svg.localName !== 'svg') {
        object.hidden = true;
        object.style.opacity = '';
        return false;
      }
      motionState.svg = svg;
      motionState.animations = [...document.querySelectorAll('animateMotion, animate, animateTransform, set')]
        .filter((animation) => animation.getAttribute('begin') === 'indefinite');
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
      if (rewind) {
        motionState.svg.pauseAnimations();
        motionState.svg.setCurrentTime(0);
        motionState.started = false;
      }
      if (!motionState.started) {
        motionState.animations.forEach((animation, index) => {
          try { animation.beginElementAt(index * 0.6); } catch { /* Unsupported SMIL controls leave the static diagram available. */ }
        });
        motionState.started = true;
      }
      motionState.svg.unpauseAnimations();
      motionState.playing = true;
      setStatus('Animation playing');
      refreshControls();
    };

    function stopAnimation() {
      motionState.svg?.pauseAnimations();
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
  const currentPage = new URL(window.location.href).pathname;
  const navLinks = [...document.querySelectorAll('.main-nav a')].filter((link) => {
    const destination = new URL(link.href);
    return destination.pathname === currentPage && destination.hash;
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
