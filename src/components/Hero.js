
export function renderHero(chaptersData) {
  return `
    <section id="home" class="hero-section">
      <div class="hero-content">
        <div class="hero-logo-container">
          <img src="/images/logo.jpg" alt="Logo L'Éveil de l'Étincelle" class="hero-logo">
          <img src="/images/hilyesin_medite.png" alt="Hilyésin médite" class="hero-illustration">
        </div>
        <h1 class="hero-title">L'Éveil de l'Étincelle</h1>
        <h2 class="hero-subtitle electric-text">Tome 1 : Les Cendres</h2>
        <p class="hero-tagline">Un roman de dark fantasy où la magie consume ceux qui l'utilisent.</p>

        <div class="hero-cta-container" style="margin-top: 2rem;">
          <a href="/chapitre/les-cendres-de-pradwyn/" class="btn btn-large btn-glow">
            Lire le premier chapitre →
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
