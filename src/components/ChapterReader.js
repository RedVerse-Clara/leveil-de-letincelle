
export function renderChapterReader(chapter, allChapters) {
  const currentIndex = allChapters.findIndex(c => c.id === chapter.id);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  return `
    <div class="chapter-reader-overlay active">
      <nav class="reader-nav">
        <button class="btn-close-reader" aria-label="Fermer">✕</button>
        <div class="reader-progress-container">
          <span class="reader-progress-text">0% lu</span>
          <div class="reader-progress-bar">
            <div class="reader-progress-fill"></div>
          </div>
        </div>
      </nav>

      <div class="chapter-content-container">
        <!-- Main Grid Layout -->
        <div class="chapter-grid">
            
            <!-- Left Column: Content -->
            <div class="chapter-main-column">
                <header class="chapter-header">
                  <h1 class="chapter-title">${chapter.title}</h1>
                  <div class="chapter-meta">
                    <span>Par Marc</span> • <span>${Math.ceil(chapter.content.length / 1000)} min de lecture</span>
                  </div>
                </header>
                
                <div class="chapter-body">
                  ${chapter.content}
                </div>

                <footer class="chapter-footer mobile-only">
                   <!-- Mobile navigation (duplicated for ease) -->
                   <div class="chapter-navigation">
                    ${prevChapter ? `<button class="btn btn-nav-chapter" data-id="${prevChapter.id}">← Précédent</button>` : '<span></span>'}
                    ${nextChapter ? `<button class="btn btn-nav-chapter" data-id="${nextChapter.id}">Suivant →</button>` : '<span></span>'}
                  </div>
                </footer>
            </div>

            <!-- Right Column: Sidebar (Comments + Nav) -->
            <aside class="chapter-sidebar">
                <div class="sidebar-sticky-content">
                    
                    <!-- Desktop Nav (moved here for better UX) -->
                    <div class="desktop-chapter-nav">
                        ${prevChapter ? `<button class="btn btn-nav-chapter small" data-id="${prevChapter.id}">← Précédent</button>` : '<span></span>'}
                        ${nextChapter ? `<button class="btn btn-nav-chapter small" data-id="${nextChapter.id}">Suivant →</button>` : '<span></span>'}
                    </div>

                    <div class="comments-sidebar-box">
                        <h3 class="comments-title-sidebar">Discussion</h3>
                        <div id="comments-container">
                            <p class="loading-text">Chargement des commentaires...</p>
                        </div>
                        
                        <!-- Moderation notice always visible -->
                        <div id="moderation-notice-container" style="text-align: center; margin-top: 1rem;">
                        </div>
                        
                        <!-- Support button always visible -->
                        <div id="support-button-container" style="text-align: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                        </div>
                    </div>
                </div>
            </aside>

        </div>
      </div>
    </div>
  `;
}
