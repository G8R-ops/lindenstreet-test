function initCounter() {
  const counterElement = document.getElementById('counter-value');
  if (!counterElement) return; // Exit if element not found

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
    }
  };

  window.requestAnimationFrame(animateCounter);
}

// Run after DOM is fully ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initCounter, 100); // slight delay to ensure element loads
});

