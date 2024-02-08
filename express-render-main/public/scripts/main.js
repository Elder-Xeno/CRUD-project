document.addEventListener('DOMContentLoaded', () => {
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      window.location.href = '/boardgames';
    });
  }

  const toggleFormBtn = document.getElementById('toggleFormBtn');
  const playLogFormContainer = document.getElementById('playLogFormContainer');

  if (toggleFormBtn && playLogFormContainer) {
    toggleFormBtn.addEventListener('click', () => {
      if (playLogFormContainer.style.display === 'none') {
        playLogFormContainer.style.display = 'block';
      } else {
        playLogFormContainer.style.display = 'none';
      }
    });
  }
});
