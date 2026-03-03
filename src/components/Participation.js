
export function renderParticipation(participationData) {
  return `
    <section id="contribute" class="section participation-section">
      <div class="container">
        <h2 class="section-title">${participationData.title}</h2>
        <div class="participation-content glass-card">
          <p class="participation-text">${participationData.text}</p>
          <div id="participation-comments" class="participation-cusdis">
            <div id="participation-cusdis-container"></div>
            <div id="participation-moderation-notice"></div>
          </div>
        </div>
      </div>
    </section>
  `;
}
