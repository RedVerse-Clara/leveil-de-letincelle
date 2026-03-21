/**
 * Entry point for the Univers page.
 * Displays worldbuilding content: characters, magic system, locations.
 */
import { renderSiteNavigation, renderSiteFooter, initSharedPage } from './shared.js';

const app = document.querySelector('#app');

function renderUniversPage() {
  app.innerHTML = `
    ${renderSiteNavigation('univers')}
    <div id="content-wrapper">
      <main>
        <section class="section" style="padding-top: 8rem;">
          <div class="container">
            <h1 style="font-family: var(--font-heading); font-size: 2.5rem; text-align: center; margin-bottom: 0.5rem;">L'Univers</h1>
            <p style="text-align: center; color: var(--text-secondary); margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto;">
              Explorez le monde de L'Éveil de l'Étincelle : ses personnages, sa magie et ses mystères.
            </p>

            <!-- Personnages -->
            <div class="glass-card" style="margin-bottom: 2rem; padding: 2rem;">
              <h2 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--accent-gold);">Personnages</h2>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                <div style="border: 1px solid var(--border-color); border-radius: 0.75rem; padding: 1.5rem;">
                  <h3 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 0.5rem;">Hilyesin</h3>
                  <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                    Jeune conscrit de Fort Balyn, Hilyesin possède un don électrique brut qu'il ne maîtrise pas encore.
                    Lorsqu'il découvre son village natal réduit en cendres et sa fiancée enlevée, il se lance dans une quête
                    désespérée. Chaque utilisation de son pouvoir le consume un peu plus, laissant un goût de cuivre et une
                    douleur lancinante derrière les tempes.
                  </p>
                </div>

                <div style="border: 1px solid var(--border-color); border-radius: 0.75rem; padding: 1.5rem;">
                  <h3 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 0.5rem;">Maléna</h3>
                  <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                    Fiancée d'Hilyesin, Maléna possède un don rare lié à la nature et aux plantes. Son pendentif en bois
                    de sorbier, qu'elle utilisait pour canaliser ses pouvoirs, a été retrouvé vidé de toute énergie dans
                    les ruines de Pradwyn. Elle est la proie principale du prédateur.
                  </p>
                </div>

                <div style="border: 1px solid var(--border-color); border-radius: 0.75rem; padding: 1.5rem;">
                  <h3 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 0.5rem;">Le Père Peryn</h3>
                  <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                    Aumônier de Pradwyn et seul survivant du massacre. Ancien garde du Roi reconverti en homme de foi,
                    il conserve les réflexes et les secrets de son passé militaire. Il confie à Hilyesin une dague de
                    la Garde Royale, forgée pour supporter les courants magiques.
                  </p>
                </div>

                <div style="border: 1px solid var(--border-color); border-radius: 0.75rem; padding: 1.5rem;">
                  <h3 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 0.5rem;">L'Homme sans Visage</h3>
                  <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                    Une entité mystérieuse dont les traits changent sans cesse. Il aspire la magie des êtres vivants,
                    les réduisant en poussière. Il a détruit Pradwyn à la recherche de Maléna, dont l'éclat magique
                    pourrait « nourrir un dieu ». Sa spirale inversée est sa signature.
                  </p>
                </div>
              </div>
            </div>

            <!-- Système de Magie -->
            <div class="glass-card" style="margin-bottom: 2rem; padding: 2rem;">
              <h2 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--accent-gold);">Le Système de Magie</h2>
              <div style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.8;">
                <p style="margin-bottom: 1rem;">
                  Dans le monde de L'Éveil de l'Étincelle, la magie est <strong style="color: var(--text-primary);">rare et dangereuse</strong>.
                  Les dons magiques ne s'apprennent pas — on naît avec. Ils se manifestent sous des formes variées :
                  affinité avec les plantes, contrôle du feu, manipulation de la foudre...
                </p>
                <p style="margin-bottom: 1rem;">
                  Chaque utilisation a un <strong style="color: var(--text-primary);">coût physique</strong>.
                  Pour Hilyesin, c'est un goût métallique de cuivre dans la bouche, une pression écrasante derrière les tempes,
                  et un épuisement qui consume sa vitalité. Plus le pouvoir est puissant, plus le prix est élevé.
                </p>
                <p>
                  L'Homme sans Visage représente une forme pervertie de la magie : il ne crée pas, il
                  <strong style="color: var(--text-primary);">absorbe</strong>. Il draine l'énergie magique des autres
                  jusqu'à les réduire en cendres, nourrissant sa propre puissance de la destruction d'autrui.
                </p>
              </div>
            </div>

            <!-- Lieux -->
            <div class="glass-card" style="margin-bottom: 2rem; padding: 2rem;">
              <h2 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--accent-gold);">Lieux</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                <div style="border: 1px solid var(--border-color); border-radius: 0.75rem; padding: 1.5rem;">
                  <h3 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 0.5rem;">Pradwyn</h3>
                  <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                    Village natal d'Hilyesin, réduit en cendres par l'Homme sans Visage. Seule l'église a partiellement
                    survécu, protégée par une force inexpliquée. Le cercle de cendres blanches dans les ruines de la
                    maison de Maléna témoigne du rituel accompli.
                  </p>
                </div>

                <div style="border: 1px solid var(--border-color); border-radius: 0.75rem; padding: 1.5rem;">
                  <h3 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 0.5rem;">Fort Balyn</h3>
                  <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                    Forteresse aux murs de pierre cyclopéens où Hilyesin effectue son service de conscrit.
                    Un lieu de routine monotone, d'exercices à l'épée et de tours de garde sous la bise hurlante.
                  </p>
                </div>

                <div style="border: 1px solid var(--border-color); border-radius: 0.75rem; padding: 1.5rem;">
                  <h3 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 0.5rem;">Le Lac Gammure</h3>
                  <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                    Immense étendue d'eau gelée que traverse Hilyesin à cheval. Sa surface est si transparente qu'on
                    aperçoit les herbiers emprisonnés dans les profondeurs. C'est ici qu'Hilyesin utilise son pouvoir
                    électrique pour la première fois sur Max.
                  </p>
                </div>
              </div>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin-top: 3rem;">
              <a href="/" class="btn btn-primary btn-large btn-glow">
                Commencer la lecture →
              </a>
            </div>
          </div>
        </section>
      </main>
      ${renderSiteFooter()}
    </div>
  `;

  initSharedPage();
}

renderUniversPage();
