import { renderSiteNavigation, renderSiteFooter, initSharedPage, chaptersData } from './shared.js';
import { renderHero } from './components/Hero.js';
import { renderHowItWorks } from './components/HowItWorks.js';
import { renderSynopsis } from './components/Synopsis.js';
import { renderChapterCard } from './components/ChapterCard.js';
import { renderSupport } from './components/Support.js';

// Map chapter IDs to URL slugs
const CHAPTER_SLUGS = {
  'chapter-1': 'les-cendres-de-pradwyn',
  'chapter-2': 'lecho-sous-la-pierre',
};

const app = document.querySelector('#app');

function renderApp() {
  const homepage = chaptersData.homepage;
  const stripeLink = chaptersData.presentation.stripeLink;
  const lastIndex = chaptersData.chapters.length - 1;
  const chaptersHTML = chaptersData.chapters
    .map((c, i) => renderChapterCard(c, i === lastIndex))
    .join('');

  app.innerHTML = `
    ${renderSiteNavigation('home')}

    <div id="content-wrapper">
      <main>
        ${renderHero(chaptersData)}
        ${renderHowItWorks(homepage.howItWorks)}
        ${renderSynopsis(homepage.synopsis, homepage.synopsisHook)}

        <section id="chapitres" class="section chapters-section">
          <div class="container">
            <h2 class="section-title">Chapitres publiés</h2>
            <div class="chapters-grid">
              ${chaptersHTML}
            </div>
          </div>
        </section>

        ${renderSupport(homepage.support, stripeLink)}
      </main>

      ${renderSiteFooter()}
    </div>
  `;

  initSharedPage();
  initHomepageScrollSpy();
  initChapterLinks();
}

/**
 * Scroll spy for homepage sections (highlight nav links).
 */
function initHomepageScrollSpy() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const links = nav.querySelectorAll('.nav-link, .mobile-nav-link');

  window.addEventListener('scroll', () => {
    const sectionToNav = {
      'home': 'home',
      'how-it-works': 'home',
      'synopsis': 'home',
      'chapitres': 'chapters',
      'support': 'home'
    };

    let current = 'home';
    Object.keys(sectionToNav).forEach(section => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          current = sectionToNav[section];
        }
      }
    });

    links.forEach(link => {
      const href = link.getAttribute('href');
      // Only highlight home link via scroll spy
      if (href === '/' || href === '/#chapitres') {
        link.classList.toggle('active', current === 'home' && href === '/');
      }
    });
  });
}

/**
 * Intercept chapter card clicks and navigate to real URLs.
 */
function initChapterLinks() {
  // Chapter card buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.read-chapter-btn');
    if (btn) {
      e.preventDefault();
      const chapterId = btn.getAttribute('data-id');
      const slug = CHAPTER_SLUGS[chapterId];
      if (slug) {
        window.location.href = `/chapitre/${slug}/`;
      }
    }

    // "Commencer la lecture" and synopsis links
    const link = e.target.closest('.read-chapter-link');
    if (link) {
      e.preventDefault();
      const chapterId = link.getAttribute('data-chapter');
      const slug = CHAPTER_SLUGS[chapterId];
      if (slug) {
        window.location.href = `/chapitre/${slug}/`;
      }
    }
  });
}

// Handle legacy hash URLs (redirect to new URLs)
if (window.location.hash.startsWith('#chapter-')) {
  const chapterId = window.location.hash.replace('#', '');
  const slug = CHAPTER_SLUGS[chapterId];
  if (slug) {
    window.location.replace(`/chapitre/${slug}/`);
  }
}

// Start the app
renderApp();
