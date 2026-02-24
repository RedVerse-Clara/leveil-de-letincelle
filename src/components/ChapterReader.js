export function renderChapterReader(chapter, stripeLink) {
  const readingTime = Math.ceil(chapter.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length / 220);
  return `
    <div class="chapter-reader-overlay active" data-font="serif" data-font-size="medium">
      <nav class="reader-nav">
        <div class="reader-nav-left">
          <button class="btn-close-reader" aria-label="Fermer" title="Fermer la lecture">✕</button>
        </div>

        <div class="reader-progress-container">
          <span class="reader-progress-text">Page 1</span>
          <div class="reader-progress-bar">
            <div class="reader-progress-fill"></div>
          </div>
        </div>

        <div class="reader-controls">
          <a href="${stripeLink}" target="_blank" rel="noopener noreferrer" class="btn-support btn-support-nav">&#9825; Soutenir</a>
          <button class="btn-comments-reader" title="Commentaires">Commentaires</button>
          <button class="btn-settings-reader" title="Paramètres d'affichage">
            <span class="icon">Aa</span>
          </button>
        </div>
      </nav>

      <!-- Settings Panel -->
      <div class="settings-panel">
        <div class="settings-group">
          <span class="settings-label">Police</span>
          <div class="font-choice-options">
            <button class="font-choice-btn active" data-font="serif">Serif</button>
            <button class="font-choice-btn" data-font="sans">Sans-Serif</button>
          </div>
        </div>
        <div class="settings-group">
          <span class="settings-label">Taille du texte</span>
          <div class="font-size-options">
            <button class="font-btn" data-size="small" style="font-size:0.75rem">A</button>
            <button class="font-btn active" data-size="medium" style="font-size:1rem">A</button>
            <button class="font-btn" data-size="large" style="font-size:1.25rem">A</button>
            <button class="font-btn" data-size="extra-large" style="font-size:1.5rem">A</button>
          </div>
        </div>
      </div>

      <div class="chapter-carousel">
        <div class="chapter-track" id="chapter-track">
          <!-- Pages seront générées dynamiquement ici -->
        </div>
      </div>

      <!-- Navigation Overlays -->
      <button class="nav-btn prev" title="Page précédente">‹</button>
      <button class="nav-btn next" title="Page suivante">›</button>

      <!-- Sidebar : visible à droite sur desktop, panneau coulissant sur mobile -->
      <aside class="reader-sidebar">
        <div class="reader-sidebar-header">
          <div>
            <h3 class="reader-sidebar-title">${chapter.title}</h3>
            <span class="reader-sidebar-meta">${readingTime} min de lecture</span>
          </div>
          <button class="btn-close-comments" title="Fermer">✕</button>
        </div>
        <div class="reader-sidebar-body">
          <h4 class="comments-title">Commentaires</h4>
          <div id="comments-container"></div>
          <div id="moderation-notice-container" style="margin-top:1rem"></div>
        </div>
        <div class="reader-sidebar-footer">
          <a href="${stripeLink}" target="_blank" rel="noopener noreferrer" class="btn-support">&#9825; Soutenir le projet</a>
        </div>
      </aside>
    </div>
  `;
}
