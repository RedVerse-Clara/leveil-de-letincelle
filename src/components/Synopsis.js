
export function renderSynopsis(synopsisText, synopsisHook) {
  return `
    <section id="synopsis" class="section synopsis-section">
      <div class="container">
        <h2 class="section-title">L'Histoire</h2>
        <div class="synopsis-content glass-card">
          <p class="synopsis-text">${synopsisText}</p>
          <p class="synopsis-hook">${synopsisHook}</p>
          <a href="#" class="synopsis-cta read-chapter-link" data-chapter="chapter-1">
            → Commencer la lecture
          </a>
        </div>
      </div>
    </section>
  `;
}
