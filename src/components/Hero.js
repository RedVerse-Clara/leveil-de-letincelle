
export function renderHero(chaptersData) {
  const totalChapters = 40;
  const writtenChapters = chaptersData?.chapters?.length || 0;
  const progressPercent = Math.round((writtenChapters / totalChapters) * 100);

  return `
    <section id="home" class="hero-section">
      <div class="hero-content">
        <div class="hero-logo-container">
          <img src="images/logo.jpg" alt="Logo L'Éveil de l'Étincelle" class="hero-logo">
          <img src="images/hilyesin_medite.png" alt="Hilyésin médite" class="hero-illustration">
        </div>
        <h1 class="hero-title">L'Éveil de l'Étincelle</h1>
        <h2 class="hero-subtitle electric-text">Tome 1 : Les Cendres</h2>
        
        <div class="writing-progress-container">
          <div class="writing-progress-info">
            <span class="progress-label">Progression d'écriture</span>
            <span class="progress-stats">${writtenChapters} / ${totalChapters} chapitres (${progressPercent}%)</span>
          </div>
          <div class="writing-progress-bar">
            <div class="writing-progress-fill" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <div class="hero-cta-container">
          <a href="#chapters" class="btn btn-large btn-glow">
            Lire les derniers chapitres
          </a>
        </div>
      </div>
      <div class="hero-scroll-indicator">
        <span>Découvrir</span>
        <div class="scroll-arrow">↓</div>
      </div>
    </section>
  `;
}
