
const CHAPTER_SLUGS = {
  'chapter-1': 'les-cendres-de-pradwyn',
  'chapter-2': 'lecho-sous-la-pierre',
};

export function renderChapterCard(chapter, isLatest = false) {
  const slug = CHAPTER_SLUGS[chapter.id] || chapter.id;
  const chapterUrl = `/chapitre/${slug}/`;

  return `
    <article class="chapter-card" data-id="${chapter.id}">
      ${isLatest ? '<span class="badge-new">Nouveau</span>' : ''}
      <div class="card-image-container">
        <img src="${chapter.image}" alt="${chapter.title}" class="card-image" loading="lazy">
        <div class="card-overlay"></div>
      </div>
      <div class="card-content">
        <h3 class="card-title">${chapter.title}</h3>
        <p class="card-excerpt">${chapter.excerpt}</p>
        <a href="${chapterUrl}" class="btn btn-primary read-chapter-btn" data-id="${chapter.id}">
          Lire
          <span class="icon">→</span>
        </a>
      </div>
    </article>
  `;
}
