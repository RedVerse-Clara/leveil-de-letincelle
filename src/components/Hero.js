
export function renderHero() {
  return `
    <section id="home" class="hero-section">
      <div class="hero-content">
        <div class="hero-logo-container">
          <img src="images/logo.jpg" alt="Logo L'Éveil de l'Étincelle" class="hero-logo">
          <img src="images/hilyesin_medite.png" alt="Hilyésin médite" class="hero-illustration">
        </div>
        <h1 class="hero-title">L'Éveil de l'Étincelle</h1>
        <h2 class="hero-subtitle electric-text">Tome 1 : Les Cendres</h2>
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
