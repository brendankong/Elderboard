import express from 'express';
import cors from 'cors';
import PhotosScraper from 'scrape-google-photos';

const app = express();
app.use(cors());

let cache = { urls: [], updated: 0 };
const ALBUM = 'https://photos.app.goo.gl/C8fUNWmEfRE1gWYo9';

async function refreshCache() {
  try {
    const urls = await PhotosScraper(ALBUM);
    cache = { urls, updated: Date.now() };
    console.log(`Fetched ${urls.length} photos`);
  } catch (e) {
    console.error('Scraper failed:', e);
  }
}
// Initial fetch & hourly update
refreshCache();
setInterval(refreshCache, 60 * 60 * 1000);

app.get('/api/photos', (req, res) => {
  res.json(cache.urls);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
