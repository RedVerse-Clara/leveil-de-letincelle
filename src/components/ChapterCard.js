
export function renderChapterCard(chapter) {
  return `
    <article class="chapter-card" data-id="${chapter.id}">
      <div class="card-image-container">
        <img src="${chapter.image}" alt="${chapter.title}" class="card-image" loading="lazy">
        <div class="card-overlay"></div>
      </div>
      <div class="card-content">
        <h3 class="card-title">${chapter.title}</h3>
        <p class="card-excerpt">${chapter.excerpt}</p>
        <button class="btn btn-primary read-chapter-btn" data-id="${chapter.id}">
          Lire le chapitre
          <span class="icon">→</span>
        </button>
      </div>
    </article>
  `;
}
