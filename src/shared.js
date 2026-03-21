/**
 * Shared utilities for all pages.
 * Renders common elements (navigation, footer, particles) and provides helpers.
 */
import './style.css';
import { createAshParticles } from './utils/particles.js';
import { renderFooter } from './components/Footer.js';
import chaptersData from './content/chapters.json';

const SITE_EMAIL = chaptersData.homepage.footer.email;

/**
 * Renders the site-wide navigation bar.
 * Unlike the SPA version, links point to real URLs.
 */
export function renderSiteNavigation(currentPage = '') {
  const navLinks = [
    { href: '/', label: 'Accueil', id: 'home' },
    { href: '/#chapitres', label: 'Chapitres', id: 'chapters' },
    { href: '/univers/', label: 'Univers', id: 'univers' },
    { href: '/blog/', label: 'Blog', id: 'blog' },
  ];

  const desktopLinks = navLinks.map(l =>
    `<a href="${l.href}" class="nav-link${currentPage === l.id ? ' active' : ''}">${l.label}</a>`
  ).join('');

  const mobileLinks = navLinks.map(l =>
    `<a href="${l.href}" class="mobile-nav-link${currentPage === l.id ? ' active' : ''}">${l.label}</a>`
  ).join('');

  return `
    <nav id="main-nav" class="navigation">
      <div class="nav-container">
        <a href="/" class="nav-logo">L'Éveil de l'Étincelle</a>
        <div class="nav-links desktop-only">${desktopLinks}</div>
        <button class="mobile-menu-toggle" aria-label="Toggle menu">
          <span class="hamburger"></span>
        </button>
        <div class="mobile-menu">${mobileLinks}</div>
      </div>
      <div class="scroll-progress-container">
        <div class="scroll-progress-bar" id="reading-progress"></div>
      </div>
    </nav>
  `;
}

/**
 * Renders the site-wide footer with multi-page links.
 */
export function renderSiteFooter() {
  return `
    <footer class="main-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <h4 class="footer-heading">L'Éveil de l'Étincelle</h4>
            <p class="footer-text">Une épopée fantasy écrite avec passion par Marc ASSI.</p>
          </div>
          <div class="footer-col">
            <h4 class="footer-heading">Navigation</h4>
            <ul class="footer-links">
              <li><a href="/">Accueil</a></li>
              <li><a href="/#chapitres">Chapitres</a></li>
              <li><a href="/univers/">Univers</a></li>
              <li><a href="/blog/">Blog</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4 class="footer-heading">Contact</h4>
            <p class="footer-text"><a href="mailto:${SITE_EMAIL}">${SITE_EMAIL}</a></p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} L'Éveil de l'Étincelle. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Initializes shared page behavior: mobile menu, scroll progress, particles.
 */
export function initSharedPage() {
  // Particles
  createAshParticles('bg-canvas');

  // Mobile menu
  const nav = document.getElementById('main-nav');
  if (nav) {
    const toggle = nav.querySelector('.mobile-menu-toggle');
    const mobileMenu = nav.querySelector('.mobile-menu');
    const hamburger = nav.querySelector('.hamburger');

    if (toggle && mobileMenu && hamburger) {
      toggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open');
      });
    }

    // Scroll progress & sticky
    const progressBar = document.getElementById('reading-progress');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      if (progressBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        progressBar.style.width = scrolled + '%';
      }
    });
  }
}

export { chaptersData };
