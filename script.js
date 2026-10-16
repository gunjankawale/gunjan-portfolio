(() => {
  const progress = document.querySelector('.scroll-progress span');
  const navLinks = [...document.querySelectorAll('.main-nav a')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let scheduled = false;
  const updateProgress = () => {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? Math.min(1, window.scrollY / range) : 0})`;
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateProgress);
  }, { passive: true });
  updateProgress();

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle('is-current', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach((section) => navObserver.observe(section));

    if (!reducedMotion) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
      document.querySelectorAll('.section-heading, .current-role, .timeline-item, .impact-card, .skill-tile, .about-art, .about-copy, .learning-row').forEach((element) => {
        element.classList.add('reveal');
        revealObserver.observe(element);
      });

      const formatCount = (value, decimals) => value.toFixed(decimals).replace(/\.0$/, '');
      const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const counter = entry.target;
          observer.unobserve(counter);
          const end = Number(counter.dataset.count);
          const rangeEnd = Number(counter.dataset.countEnd || end);
          const decimals = Number(counter.dataset.decimals || 0);
          const startTime = performance.now();
          const duration = 1100;

          const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = end * eased;
            const currentRangeEnd = rangeEnd * eased;
            const first = formatCount(current, decimals);
            const second = formatCount(currentRangeEnd, decimals);
            counter.textContent = rangeEnd === end ? first : `${first}–${second}`;
            if (progress < 1) window.requestAnimationFrame(tick);
          };
          window.requestAnimationFrame(tick);
        });
      }, { threshold: 0.55 });
      document.querySelectorAll('.count-value').forEach((counter) => countObserver.observe(counter));
    }
  }
})();
