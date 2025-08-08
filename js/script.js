// Contact Form success message
function formSubmitted() {
  setTimeout(() => {
    document.getElementById('success-message').classList.remove('hidden');
  }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
  // ===== Counter Donut =====
  const counterSection = document.querySelector('#counter-value');
  const donutProgress = document.getElementById('donut-progress');

  const startNumber = 0;
  const startDate = new Date('2025-01-01');
  const today = new Date();
  const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const baseNumber = 1000000;
  const dailyIncrement = 10;
  const endNumber = baseNumber + (daysPassed * dailyIncrement);

  const duration = 3500;
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
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
      counterSection.style.color = '#FACC15'; // yellow
      donutProgress.style.stroke = '#FACC15';
      donutProgress.style.strokeDashoffset = 0;
    }
  }

  if (donutProgress) {
    donutProgress.style.strokeDasharray = circumference;
    donutProgress.style.strokeDashoffset = circumference;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        requestAnimationFrame(animateCounter);
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  if (counterSection) observer.observe(counterSection);

  // ===== Services Highlight Rotation =====
  const serviceCards = document.querySelectorAll('#services .service-card');
  let currentServiceIndex = 0;

  function highlightNextService() {
    serviceCards.forEach((card, index) => {
      if (index === currentServiceIndex) {
        card.classList.add('highlight');
      } else {
        card.classList.remove('highlight');
      }
    });
    currentServiceIndex = (currentServiceIndex + 1) % serviceCards.length;
  }

  if (serviceCards.length) {
    highlightNextService();
    setInterval(highlightNextService, 2000);
  }

  // ===== Engagement Fade-In =====
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
});
