(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.querySelector('.scroll-progress span');
  const themeButton = document.querySelector('.theme-toggle');
  const room = document.querySelector('.game-room');
  const player = document.querySelector('.player-character');
  const toast = document.querySelector('.game-toast');
  let walkX = 47;
  let walkY = 62;
  let moveTimer;
  let walking = false;

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

  const walkToward = (x, y) => {
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
      if (elapsed < 1) {
        window.requestAnimationFrame(walk);
        return;
      }
      walking = false;
      player.classList.remove('is-walking');
      room.classList.remove('is-in-motion');
    };
    window.requestAnimationFrame(walk);
  };

  setPosition();
  room.addEventListener('click', (event) => {
    if (event.target.closest('.station, .player-character') || walking) return;
    const bounds = room.getBoundingClientRect();
    const x = Math.min(85, Math.max(10, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(78, Math.max(43, ((event.clientY - bounds.top) / bounds.height) * 100));
    walkToward(x, y);
    announce('Use the station links or scroll to explore');
  });

  window.addEventListener('keydown', (event) => {
    if (!room.matches(':hover') && !room.contains(document.activeElement)) return;
    if (walking || event.altKey || event.ctrlKey || event.metaKey) return;
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
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateProgress);
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

  const revealTargets = document.querySelectorAll('.intro-grid, .metrics-row, .work-heading, .featured-work, .experience-item, .projects-heading, .project-card, .toolkit-heading, .skill-card, .learning-strip, .education-list, .contact-inner > *');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach((target) => {
      target.classList.add('reveal-ready');
      observer.observe(target);
    });
  }

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
