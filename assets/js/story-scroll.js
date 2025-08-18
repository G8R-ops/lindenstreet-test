(function () {
  const section = document.getElementById('story-scroll');
  if (!section) return;

  if (window.matchMedia('(max-width: 991px)').matches) return;

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

  // IntersectionObserver → activate frame when majority is visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.getAttribute('data-index'), 10);
          setActive(idx);
        }
      });
    },
    { threshold: 0.6 }
  );

  frames.forEach((frame) => observer.observe(frame));

  // Dots → scroll to specific frame
  dots.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-go'), 10);
      const target = frames[idx];
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Initialize
  setActive(0);
})();

