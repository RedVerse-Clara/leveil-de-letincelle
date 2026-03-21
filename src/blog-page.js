/**
 * Entry point for the Blog listing page.
 * Articles will be added to the blog data array as they are written.
 */
import { renderSiteNavigation, renderSiteFooter, initSharedPage } from './shared.js';

// Blog articles data — add new articles here
const blogArticles = [
  // Example structure for future articles:
  // {
  //   slug: 'creer-systeme-magie-original',
  //   title: 'Comment créer un système de magie original',
  //   excerpt: 'Découvrez les principes fondamentaux pour concevoir un système de magie cohérent et unique pour votre roman fantasy.',
  //   date: '2026-04-15',
  //   image: '/images/blog/systeme-magie.jpg',
  //   tags: ['écriture', 'worldbuilding', 'magie'],
  // },
];

const app = document.querySelector('#app');

function renderBlogPage() {
  const articlesHTML = blogArticles.length > 0
    ? `<div class="chapters-grid">
        ${blogArticles.map(article => `
          <article class="chapter-card">
            ${article.image ? `<div class="card-image-container">
              <img src="${article.image}" alt="${article.title}" class="card-image" loading="lazy">
              <div class="card-overlay"></div>
            </div>` : ''}
            <div class="card-content">
              <span style="color: var(--text-secondary); font-size: 0.85rem;">${new Date(article.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <h3 class="card-title">${article.title}</h3>
              <p class="card-excerpt">${article.excerpt}</p>
              ${article.tags ? `<div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.5rem;">
                ${article.tags.map(tag => `<span style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 0.2rem 0.6rem; border-radius: 1rem; font-size: 0.75rem; color: var(--text-secondary);">${tag}</span>`).join('')}
              </div>` : ''}
              <a href="/blog/${article.slug}/" class="btn btn-primary" style="margin-top: 1rem;">
                Lire l'article <span class="icon">→</span>
              </a>
            </div>
          </article>
        `).join('')}
      </div>`
    : `<div class="glass-card" style="text-align: center; padding: 3rem;">
        <p style="font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 1rem;">
          Le blog est en préparation.
        </p>
        <p style="color: var(--text-secondary);">
          Des articles sur la fantasy, le worldbuilding et les coulisses d'écriture de L'Éveil de l'Étincelle arriveront bientôt.
        </p>
        <a href="/" class="btn btn-primary" style="margin-top: 2rem;">Retour à l'accueil</a>
      </div>`;

  app.innerHTML = `
    ${renderSiteNavigation('blog')}
    <div id="content-wrapper">
      <main>
        <section class="section" style="padding-top: 8rem;">
          <div class="container">
            <h1 style="font-family: var(--font-heading); font-size: 2.5rem; text-align: center; margin-bottom: 0.5rem;">Blog</h1>
            <p style="text-align: center; color: var(--text-secondary); margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto;">
              Coulisses d'écriture, réflexions sur la fantasy et le worldbuilding.
            </p>
            ${articlesHTML}
          </div>
        </section>
      </main>
      ${renderSiteFooter()}
    </div>
  `;

  initSharedPage();
}

renderBlogPage();
