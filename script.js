(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.querySelector('.scroll-progress span');
  const themeButton = document.querySelector('.theme-toggle');
  const featured = document.querySelector('.featured-work');
  const room = document.querySelector('.game-room');
  const player = document.querySelector('.player-character');
  const toast = document.querySelector('.game-toast');
  const interior = document.querySelector('.interior-screen');
  const interiorContent = document.querySelector('.interior-content');
  const interiorPath = document.querySelector('.interior-path b');
  const exitInterior = document.querySelector('.exit-interior');
  let walkX = 47;
  let walkY = 62;
  let moveTimer;
  let walking = false;
  let previousFocus = null;

  const announce = (message) => {
    toast.textContent = message;
    toast.classList.add('is-active');
    window.clearTimeout(moveTimer);
    moveTimer = window.setTimeout(() => toast.classList.remove('is-active'), 1800);
  };
  const setPosition = () => {
    player.style.setProperty('--walk-x', `${walkX}%`);
    player.style.setProperty('--walk-y', `${walkY}%`);
  };
  const walkToward = (x, y, callback) => {
    const fromX = walkX;
    const fromY = walkY;
    const distance = Math.hypot(x - fromX, y - fromY);
    const duration = reducedMotion ? 1 : Math.min(1050, Math.max(360, distance * 11));
    const startedAt = performance.now();
    player.style.setProperty('--facing', x < fromX ? '-1' : '1');
    walking = true;
    player.classList.add('is-walking');
    room.classList.add('is-in-motion');
    const walk = () => {
      const elapsed = Math.min(1, (performance.now() - startedAt) / duration);
      const eased = elapsed < .5 ? 4 * elapsed ** 3 : 1 - Math.pow(-2 * elapsed + 2, 3) / 2;
      walkX = fromX + (x - fromX) * eased;
      walkY = fromY + (y - fromY) * eased;
      setPosition();
      if (elapsed < 1) window.requestAnimationFrame(walk);
      else {
        walking = false;
        player.classList.remove('is-walking');
        room.classList.remove('is-in-motion');
        if (callback) callback();
      }
    };
    window.requestAnimationFrame(walk);
  };
  setPosition();
  room.addEventListener('click', (event) => {
    if (event.target.closest('.station') || event.target.closest('.player-character') || walking) return;
    const bounds = room.getBoundingClientRect();
    const x = Math.min(85, Math.max(10, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(78, Math.max(43, ((event.clientY - bounds.top) / bounds.height) * 100));
    walkToward(x, y);
  });
  document.querySelectorAll('.station').forEach((station) => {
    station.addEventListener('click', () => {
      const bounds = room.getBoundingClientRect();
      const stationBounds = station.getBoundingClientRect();
      const destination = station.dataset.destination;
      announce(`Walking to ${station.querySelector('b').textContent}…`);
      walkToward(26 + ((stationBounds.left + stationBounds.width / 2 - bounds.left) / bounds.width) * 48, 48, () => {
        announce(`${station.querySelector('b').textContent} station selected`);
        room.classList.add('is-transitioning');
        station.classList.add('is-selected');
        window.setTimeout(() => {
          enterInterior(destination);
          room.classList.remove('is-transitioning');
          station.classList.remove('is-selected');
        }, reducedMotion ? 0 : 520);
      });
    });
  });
  const destinationContent = {
    profile: { label: 'ENGINEER PROFILE', source: '#about' },
    experience: { label: 'PROFESSIONAL EXPERIENCE', source: '#work' },
    skills: { label: 'TECHNICAL SKILLS', source: '#toolkit' }
  };
  function enterInterior(destination) {
    const route = destinationContent[destination];
    if (!route) return;
    const source = document.querySelector(route.source);
    const content = source.querySelector('.section-wrap') || source;
    interiorContent.replaceChildren(content.cloneNode(true));
    previousFocus = document.activeElement;
    interiorPath.textContent = route.label;
    interior.dataset.view = destination;
    interior.hidden = false;
    interior.classList.remove('is-entering');
    document.body.classList.add('inside-portfolio');
    document.querySelector('header').inert = true;
    document.querySelector('main').inert = true;
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => interior.classList.add('is-entering')));
    exitInterior.focus({ preventScroll: true });
  }
  function returnToRoom() {
    interior.classList.remove('is-entering');
    window.setTimeout(() => {
      interior.hidden = true;
      interiorContent.replaceChildren();
      document.body.classList.remove('inside-portfolio');
      document.querySelector('header').inert = false;
      document.querySelector('main').inert = false;
      (previousFocus?.isConnected ? previousFocus : room).focus({ preventScroll: true });
    }, reducedMotion ? 0 : 360);
  }
  exitInterior.addEventListener('click', returnToRoom);
  interior.addEventListener('click', (event) => {
    if (event.target === interior) returnToRoom();
  });
  window.addEventListener('keydown', (event) => {
    if (interior.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      returnToRoom();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = [...interior.querySelectorAll('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')].filter((item) => item.getClientRects().length);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || !interior.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !interior.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  });
  document.querySelectorAll('a[href="#about"], a[href="#work"], a[href="#toolkit"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const destination = { '#about': 'profile', '#work': 'experience', '#toolkit': 'skills' }[link.hash];
      if (!destination) return;
      event.preventDefault();
      enterInterior(destination);
    });
  });
  window.addEventListener('keydown', (event) => {
    if (!room || (!room.matches(':hover') && !room.contains(document.activeElement)) || walking || event.altKey || event.ctrlKey || event.metaKey) return;
    const key = event.key.toLowerCase();
    const moves = { arrowleft: [-3, 0], a: [-3, 0], arrowright: [3, 0], d: [3, 0], arrowup: [0, -3], w: [0, -3], arrowdown: [0, 3], s: [0, 3] };
    if (!moves[key]) return;
    event.preventDefault();
    walkToward(Math.min(85, Math.max(10, walkX + moves[key][0])), Math.min(78, Math.max(43, walkY + moves[key][1])));
  });
  let scheduled = false;

  const updateProgress = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const amount = available > 0 ? window.scrollY / available : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, amount))})`;
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();

  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'dark') document.body.classList.add('dark-theme');
  themeButton.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    themeButton.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
  });
  themeButton.setAttribute('aria-label', `Switch to ${document.body.classList.contains('dark-theme') ? 'light' : 'dark'} theme`);

  const revealTargets = document.querySelectorAll('.intro-grid, .metrics-row, .work-heading, .featured-work, .experience-item, .toolkit-heading, .skill-card, .learning-strip, .education-list, .contact-inner > *');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach((target) => {
      target.classList.add('reveal-ready');
      observer.observe(target);
    });
  }

  const setFeaturedExpanded = (expanded) => {
    featured.classList.toggle('is-expanded', expanded);
    featured.setAttribute('aria-label', `OneData Azure migration project. ${expanded ? 'Highlighted' : 'Not highlighted'}.`);
  };
  featured.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;
    setFeaturedExpanded(!featured.classList.contains('is-expanded'));
  });
  featured.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setFeaturedExpanded(!featured.classList.contains('is-expanded'));
    }
  });

  const navLinks = [...document.querySelectorAll('.topbar nav a')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle('is-current', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }
})();
