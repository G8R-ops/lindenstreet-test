(function () {
  const section = document.getElementById('story-scroll');
  if (!section) return;

  const copies = Array.from(section.querySelectorAll('.lsl-copy'));
  const dots = Array.from(section.querySelectorAll('.lsl-dot'));
  const frames = Array.from(section.querySelectorAll('.lsl-frame'));

  // Helper to set active index (updates text + dots)
  function setActive(idx) {
    copies.forEach((el, i) => {
      el.classList.toggle('is-active', i === idx);
      // Update eyebrow “Section X of N”
      const eyebrow = el.querySelector('.lsl-eyebrow');
      if (eyebrow) eyebrow.textContent = `Section ${idx + 1} of ${copies.length}`;
    });
    dots.forEach((d, i) => {
      const active = i === idx;
      d.classList.toggle('is-active', active);
      d.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  // Scroll → detect which frame is most visible
  const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
  const io = new IntersectionObserver((entries) => {
    // choose the intersecting entry with highest ratio
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    const idx = frames.indexOf(visible.target);
    if (idx !== -1) setActive(idx);
  }, { root: null, rootMargin: '0px', threshold: thresholds });

  frames.forEach((f) => io.observe(f));

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

  // Initialize
  setActive(0);
})();

