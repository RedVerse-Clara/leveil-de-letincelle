
export function renderSupport(supportData, stripeLink) {
  return `
    <section id="support" class="section support-section">
      <div class="container">
        <h2 class="section-title">${supportData.title}</h2>
        <div class="support-content glass-card">
          <p class="support-text">${supportData.text}</p>
          <div class="support-cta">
            <a href="${stripeLink}" target="_blank" rel="noopener noreferrer" class="btn btn-support btn-large">
              <span class="icon">☕</span> ${supportData.ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}
