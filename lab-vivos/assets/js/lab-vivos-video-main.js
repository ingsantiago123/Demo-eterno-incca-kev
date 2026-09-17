// lab-vivos-video-main.js — lab-vivos-video.html (reproductor de práctica grabada)
// Control del botón de reproducción (grande y de la barra) y de pantalla completa.
(function() {
  const playToggleBtn = document.getElementById('playToggleBtn');
  const bigPlayBtn = document.getElementById('bigPlayBtn');
  const playIcon = document.getElementById('playIcon');
  const centerPlayIcon = document.getElementById('centerPlayIcon');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const videoContainer = document.getElementById('videoContainer');
  let isPlaying = false;

  function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      playIcon.textContent = 'pause';
      centerPlayIcon.textContent = 'pause';
      bigPlayBtn.classList.add('opacity-0', 'pointer-events-none');
    } else {
      playIcon.textContent = 'play_arrow';
      centerPlayIcon.textContent = 'play_arrow';
      bigPlayBtn.classList.remove('opacity-0', 'pointer-events-none');
    }
  }

  if (playToggleBtn) playToggleBtn.addEventListener('click', togglePlay);
  if (bigPlayBtn) bigPlayBtn.addEventListener('click', togglePlay);

  if (fullscreenBtn && videoContainer) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        videoContainer.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    });
  }
})();
