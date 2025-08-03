// Counter Animation
function initCounter() {
  const counterElement = document.getElementById('counter-value');
  if (!counterElement) return;

  const startNumber = 0;
  const startDate = new Date('2025-01-01');
  const today = new Date();
  const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const baseNumber = 1000000;
  const dailyIncrement = 10;
  const endNumber = baseNumber + (daysPassed * dailyIncrement);
  const duration = 2000;
  let startTime = null;

  const animateCounter = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const increment = (endNumber - startNumber) * (progress / duration);
    let currentNumber = Math.min(startNumber + increment, endNumber);

    counterElement.textContent = Math.floor(currentNumber).toLocaleString('en-US');

    if (progress < duration) {
      window.requestAnimationFrame(animateCounter);
    } else {
      counterElement.textContent = endNumber.toLocaleString('en-US');
      counterElement.classList.add('text-yellow-400');
    }
  };

  window.requestAnimationFrame(animateCounter);
}

// Contact Form success message
function formSubmitted() {
  setTimeout(() => {
    document.getElementById('success-message').classList.remove('hidden');
  }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
  // Counter trigger when in view
  const counterSection = document.querySelector('#counter-value');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initCounter();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  counterObserver.observe(counterSection);

  // Engagement fade-in
  const blocks = document.querySelectorAll('.engagement-block');
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  blocks.forEach(block => fadeObserver.observe(block));

  // Services highlight cycling
  const cards = document.querySelectorAll("#services .p-6");
  let currentIndex = 0;

  function highlightCard() {
    cards.forEach(card => card.classList.remove("highlight"));
    cards[currentIndex].classList.add("highlight");
    currentIndex = (currentIndex + 1) % cards.length;
  }

  if (cards.length > 0) {
    highlightCard(); // initial
    setInterval(highlightCard, 3000); // every 3s
  }

  const scrollBtn = document.getElementById('scroll-to-top');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }
});
