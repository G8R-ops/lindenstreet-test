(function () {
  const section = document.getElementById('story-scroll');
  if (!section) return;

  const copies = Array.from(section.querySelectorAll('.lsl-copy'));
  const dots = Array.from(section.querySelectorAll('.lsl-dot'));
  const frames = Array.from(section.querySelectorAll('.lsl-frame'));
  let current = -1;

  // Helper to set active index (updates text + dots)
  function setActive(idx) {
    if (idx === current) return;
    copies.forEach((el, i) => {
      el.classList.toggle('is-active', i === idx);
    });
    dots.forEach((d, i) => {
      const active = i === idx;
      d.classList.toggle('is-active', active);
      d.setAttribute('aria-current', active ? 'true' : 'false');
    });
    current = idx;
  }

  // Scroll → activate frame occupying viewport center
  function onScroll() {
    const mid = window.innerHeight / 2;
    const idx = frames.findIndex(frame => {
      const rect = frame.getBoundingClientRect();
      return rect.top <= mid && rect.bottom >= mid;
    });
    if (idx !== -1) setActive(idx);
  }

  // Dots → scroll to specific frame
  dots.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-go'), 10);
      const target = frames[idx];
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(idx);
      }
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // Initialize
  setActive(0);
  onScroll();
})();

