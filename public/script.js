document.addEventListener('DOMContentLoaded', async () => {
  const seriesContainer = document.getElementById('series-container');

  try {
    const seriesResponse = await fetch('/api/series');
    const seriesIds = await seriesResponse.json();

    for (const id of seriesIds) {
      const backdropResponse = await fetch(`/api/backdrop/${id}`);
      const { backdropPath } = await backdropResponse.json();

      const seriesDiv = document.createElement('div');
      seriesDiv.className = 'series';
      seriesDiv.style.backgroundImage = `url(${backdropPath})`;
      seriesDiv.onclick = () => window.location.href = `/${id}`;

      seriesContainer.appendChild(seriesDiv);
    }
  } catch (error) {
    console.error('Error loading series:', error);
  }
});
