// Contact Form success message
function formSubmitted() {
  setTimeout(() => {
    document.getElementById('success-message').classList.remove('hidden');
  }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
  // Counter trigger when in view
  const counterSection = document.querySelector('#counter-value');
  const donutProgress = document.getElementById('donut-progress');
  
  const startNumber = 0;
  const startDate = new Date('2025-01-01');
  const today = new Date();
  const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const baseNumber = 1000000;
  const dailyIncrement = 10;
  const endNumber = baseNumber + (daysPassed * dailyIncrement);
  const duration = 5000;
  const circumference = 2 * Math.PI * 54; // radius of donut
  let startTime = null;

  function animateCounter(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const increment = (endNumber - startNumber) * (progress / duration);
    const currentNumber = Math.min(startNumber + increment, endNumber);

    counterSection.textContent = Math.floor(currentNumber).toLocaleString();

    const percentage = currentNumber / endNumber;
    donutProgress.style.strokeDashoffset = circumference - (circumference * percentage);

    if (progress < duration) {
      requestAnimationFrame(animateCounter);
    } else {
      counterSection.textContent = endNumber.toLocaleString();
      donutProgress.style.strokeDashoffset = 0;
      counterSection.classList.add('text-yellow-400', 'animate-pulse');
    }
  }

  if (donutProgress) {
    donutProgress.style.strokeDasharray = circumference;
    donutProgress.style.strokeDashoffset = circumference;
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        requestAnimationFrame(animateCounter);
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  if (counterSection) counterObserver.observe(counterSection);

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

  // Scroll-to-top button
  const scrollBtn = document.getElementById('scroll-to-top');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }
});
