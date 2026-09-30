(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey = 'portfolio-page-transition';
  let navigating = false;
  let entry = false;
  try {
    const pending = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
    entry = pending && pending.path === location.pathname && Date.now() - pending.time < 10000;
    sessionStorage.removeItem(storageKey);
  } catch (_) { /* Navigation still works when storage is unavailable. */ }
  if (entry && !motion.matches) document.documentElement.classList.add('is-entering');

  function initialize() {
    let curtain = document.querySelector('.page-wipe');
    if (!curtain) {
      curtain = document.createElement('div');
      curtain.className = 'page-wipe';
      curtain.setAttribute('aria-hidden', 'true');
      curtain.innerHTML = '<span>SN <i>Selected work</i></span>';
      document.body.append(curtain);
    }
    const reset = () => {
      navigating = false;
      document.documentElement.classList.remove('is-entering', 'is-leaving');
      curtain.getAnimations().forEach(animation => animation.cancel());
    };
    if (entry && !motion.matches) {
      const reveal = curtain.animate([
        {transform: 'translateY(0)'}, {transform: 'translateY(-100%)'}
      ], {duration: 650, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards'});
      reveal.finished.then(reset).catch(reset);
    } else reset();

    document.addEventListener('click', async event => {
      const anchor = event.target.closest('a[data-page-transition]');
      if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const destination = new URL(anchor.href, location.href);
      if (destination.origin !== location.origin || destination.pathname === location.pathname || motion.matches || !curtain.animate) return;
      event.preventDefault();
      if (navigating) return;
      navigating = true;
      curtain.getAnimations().forEach(animation => animation.cancel());
      document.documentElement.classList.remove('is-entering');
      document.documentElement.classList.add('is-leaving');
      try {
        await curtain.animate([
          {transform: 'translateY(100%)'}, {transform: 'translateY(0)'}
        ], {duration: 500, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards'}).finished;
      } catch (_) { /* A cancelled animation must never strand navigation. */ }
      try { sessionStorage.setItem(storageKey, JSON.stringify({path: destination.pathname, time: Date.now()})); } catch (_) {}
      location.assign(destination.href);
    });
    addEventListener('pageshow', event => { if (event.persisted) reset(); });
    motion.addEventListener('change', () => { if (motion.matches && !navigating) reset(); });

    // Keep the project chapter index aligned with the reader's position.
    const chapterLinks = [...document.querySelectorAll('.case-sidebar nav a')];
    if (chapterLinks.length) {
      const chapters = chapterLinks.map(link => document.querySelector(link.hash));
      let frame = 0;
      const updateChapter = () => {
        let active = 0;
        chapters.forEach((section, index) => { if (section && section.getBoundingClientRect().top <= 180) active = index; });
        chapterLinks.forEach((link, index) => {
          if (index === active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
        frame = 0;
      };
      addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(updateChapter); }, {passive:true});
      addEventListener('resize', updateChapter);
      updateChapter();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true});
  else initialize();
})();
