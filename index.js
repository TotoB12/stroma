const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const huggingFaceToken = process.env.HUGGINGFACE_TOKEN;
const tmdbApiKey = process.env.TMDB_API_KEY;

app.get('/api/series', async (req, res) => {
  try {
    const response = await axios.get('https://huggingface.co/api/datasets/totob12-dev/stroma/tree/main', {
      headers: {
        Authorization: `Bearer ${huggingFaceToken}`,
      },
    });

    const seriesIds = response.data
      .filter(item => item.type === 'directory')
      .map(series => series.path);

    res.json(seriesIds);
  } catch (error) {
    console.error('Error fetching series:', error);
    res.status(500).json({ error: 'Failed to fetch series data' });
  }
});

app.get('/api/backdrop/:id', async (req, res) => {
  const seriesId = req.params.id;
  try {
    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/images`, {
      params: {
        api_key: tmdbApiKey,
        include_image_language: 'en',
        language: 'en-US',
      },
    });

    const backdropPath = tmdbResponse.data.backdrops[0].file_path;;
    res.json({ backdropPath: `https://image.tmdb.org/t/p/w500${backdropPath}` });
  } catch (error) {
    console.error('Error fetching backdrop:', error);
    res.status(500).json({ error: 'Failed to fetch backdrop image' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
