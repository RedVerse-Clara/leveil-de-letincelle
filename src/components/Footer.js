
export function renderFooter(footerData) {
  return `
    <footer class="main-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <h4 class="footer-heading">L'Éveil de l'Étincelle</h4>
            <p class="footer-text">Une épopée fantaisie écrite avec passion par Marc ASSI.</p>
          </div>
          <div class="footer-col">
            <h4 class="footer-heading">Navigation</h4>
            <ul class="footer-links">
              <li><a href="#home" data-scroll="home">Accueil</a></li>
              <li><a href="#chapters" data-scroll="chapters">Chapitres</a></li>
              <li><a href="#contribute" data-scroll="contribute">Contribuer</a></li>
              <li><a href="#support" data-scroll="support">Soutenir</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4 class="footer-heading">Contact</h4>
            <p class="footer-text"><a href="mailto:${footerData.email}">${footerData.email}</a></p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} L'Éveil de l'Étincelle. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  `;
}
