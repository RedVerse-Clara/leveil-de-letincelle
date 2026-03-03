
const icons = {
  book: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>`,
  lightbulb: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
    <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>
  </svg>`,
  heart: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>`
};

export function renderHowItWorks(howItWorksData) {
  const blocksHTML = howItWorksData.map(block => `
    <div class="how-card glass-card">
      <span class="how-icon">${icons[block.icon] || ''}</span>
      <h3 class="how-title">${block.title}</h3>
      <p class="how-text">${block.text}</p>
    </div>
  `).join('');

  return `
    <section id="how-it-works" class="section how-it-works-section">
      <div class="container">
        <h2 class="section-title">Comment ça marche</h2>
        <div class="how-grid">
          ${blocksHTML}
        </div>
      </div>
    </section>
  `;
}
