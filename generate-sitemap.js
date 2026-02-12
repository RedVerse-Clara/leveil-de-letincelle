
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Load chapter data
// Note: In a pure Node script (type: module), we need to read JSON file fs
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chaptersPath = path.join(__dirname, 'src/content/chapters.json');
const publicPath = path.join(__dirname, 'public/sitemap.xml');

const BASE_URL = 'https://www.leveildeletincelle.fr';

try {
  const data = fs.readFileSync(chaptersPath, 'utf8');
  const { chapters } = JSON.parse(data);

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Chapters -->
  ${chapters.map(chapter => `
  <url>
    <loc>${BASE_URL}/#${chapter.id}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}
</urlset>`;

  fs.writeFileSync(publicPath, sitemapContent);
  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
  console.log(`   - Homepage included`);
  console.log(`   - ${chapters.length} chapters indexed`);

} catch (error) {
  console.error('❌ Error generating sitemap:', error);
}
