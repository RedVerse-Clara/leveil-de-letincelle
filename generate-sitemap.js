
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chaptersPath = path.join(__dirname, 'src/content/chapters.json');
const publicPath = path.join(__dirname, 'public/sitemap.xml');

const BASE_URL = 'https://leveildeletincelle.fr';

// Map chapter IDs to URL slugs
const CHAPTER_SLUGS = {
  'chapter-1': 'les-cendres-de-pradwyn',
  'chapter-2': 'lecho-sous-la-pierre',
};

try {
  const data = fs.readFileSync(chaptersPath, 'utf8');
  const { chapters } = JSON.parse(data);
  const today = new Date().toISOString().split('T')[0];

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${BASE_URL}/images/logo.jpg</image:loc>
      <image:title>L'Éveil de l'Étincelle - Roman Fantasy Épique</image:title>
    </image:image>
  </url>

  <!-- Chapters (real URLs) -->
${chapters.map(chapter => {
    const slug = CHAPTER_SLUGS[chapter.id];
    if (!slug) return '';
    return `  <url>
    <loc>${BASE_URL}/chapitre/${slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${BASE_URL}/${chapter.image}</image:loc>
      <image:title>${chapter.title} - L'Éveil de l'Étincelle</image:title>
    </image:image>
  </url>`;
  }).filter(Boolean).join('\n')}

  <!-- Univers -->
  <url>
    <loc>${BASE_URL}/univers/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Blog -->
  <url>
    <loc>${BASE_URL}/blog/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

  fs.writeFileSync(publicPath, sitemapContent, 'utf8');
  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
  console.log(`   - Homepage included`);
  console.log(`   - ${chapters.length} chapters indexed (real URLs)`);
  console.log(`   - Univers page included`);
  console.log(`   - Blog page included`);

} catch (error) {
  console.error('❌ Error generating sitemap:', error);
}
