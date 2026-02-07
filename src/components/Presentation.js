
export function renderPresentation(presentationData) {
  // Extract content and link
  const { content, stripeLink } = presentationData;

  let formattedHTML = '';

  content.forEach(line => {
    // Robust title detection based on specific known titles or patterns
    const knownTitles = [
      "L'Éveil de l'Étincelle : bienvenue dans la Forge",
      "Une épopée de foudre et d'ombres",
      "La Forge : l'écriture en mouvement",
      "Soutenir l'Étincelle",
      "Vos bénéfices en tant que contributeur :"
    ];

    const isTitle = knownTitles.includes(line) || (line.length < 60 && !line.endsWith('.') && !line.startsWith('-'));

    if (isTitle) {
      formattedHTML += `<h3 class="presentation-subtitle">${line}</h3>`;
    } else if (line.startsWith('- ')) {
      formattedHTML += `<li class="presentation-list-item">${line.substring(2)}</li>`;
    } else if (line.includes('http')) {
      // Skip raw links if they are just standalone links, or render them as links
      if (line.startsWith('Soutenir le projet sur Stripe')) {
        // This is the link line, we can ignore it as we have a button, 
        // OR we can render it as a text link if we want.
        // But we have the button now.
      } else {
        formattedHTML += `<p class="presentation-text">${line}</p>`;
      }
    } else {
      formattedHTML += `<p class="presentation-text">${line}</p>`;
    }
  });

  return `
    <section id="presentation" class="section presentation-section">
      <div class="container">
        <h2 class="section-title">Présentation</h2>
        <div class="presentation-content glass-card">
          ${formattedHTML}
          
          <div class="presentation-cta">
            <a href="${stripeLink}" target="_blank" rel="noopener noreferrer" class="btn btn-support">
              <span class="icon">♥</span> Soutenir le projet sur Stripe
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}
