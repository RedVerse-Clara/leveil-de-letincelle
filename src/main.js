import './style.css';
import { createAshParticles } from './utils/particles.js';
import { renderNavigation, initNavigation } from './components/Navigation.js';
import { renderHero } from './components/Hero.js';
import { renderPresentation } from './components/Presentation.js';
import { renderChapterCard } from './components/ChapterCard.js';
import { renderChapterReader } from './components/ChapterReader.js';
import chaptersData from './content/chapters.json';
import { updateSEO } from './utils/seo.js'; // Import SEO manager

// CUSDIS COMMENTS LOADER
// We construct the element dynamically when a chapter is opened
const CUSDIS_APP_ID = "f4c40187-515a-4943-a0c6-f498019a4115";

function loadComments(chapterId, title) {
  const container = document.getElementById('comments-container');
  if (!container) return;

  container.innerHTML = ''; // Clear placeholder

  const div = document.createElement('div');
  div.id = 'cusdis_thread';
  div.dataset.host = 'https://cusdis.com';
  div.dataset.appId = CUSDIS_APP_ID;
  div.dataset.pageId = chapterId;
  div.dataset.pageUrl = window.location.href; // Simplified URL
  div.dataset.pageTitle = title;
  div.dataset.theme = 'dark';

  container.appendChild(div);

  // Load script if needed
  if (!document.getElementById('cusdis-script')) {
    const script = document.createElement('script');
    script.id = 'cusdis-script';
    script.src = 'https://cusdis.com/js/cusdis.es.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  } else if (window.CUSDIS) {
    window.CUSDIS.initial();
  }

  // Add moderation notice in separate container (always visible, outside scrollable area)
  const noticeContainer = document.getElementById('moderation-notice-container');
  if (noticeContainer) {
    const notice = document.createElement('p');
    notice.style.cssText = "color: var(--text-secondary); font-size: 0.85rem; opacity: 0.8; margin: 0;";
    notice.innerText = "Note : Les commentaires sont soumis à validation avant d'apparaître.";
    noticeContainer.innerHTML = '';
    noticeContainer.appendChild(notice);
  }

  // Le bouton de soutien est rendu statiquement dans le template ChapterReader
}

// Global Listener to try and catch post success if emitted
window.addEventListener('message', (e) => {
  if (e.data && e.data.from === 'cusdis') {
    // If we ever get a specific success event, we can enhance this.
    // For now, the visual refresh of the iframe is the main cue.
  }
});

// ============================================
// MAIN APP LOGIC
// ============================================

const app = document.querySelector('#app');

function renderApp() {
  // Update SEO for Home
  updateSEO('home');

  const chaptersHTML = chaptersData.chapters.map(c => renderChapterCard(c)).join('');

  app.innerHTML = `
    ${renderNavigation()}
    
    <div id="content-wrapper">
      <main>
        ${renderHero(chaptersData)}
        
        ${renderPresentation(chaptersData.presentation)}
        
        <section id="chapters" class="section chapters-section">
          <div class="container">
            <h2 class="section-title">Derniers Chapitres</h2>
            <div class="chapters-grid">
              ${chaptersHTML}
            </div>
          </div>
        </section>

        <section id="about" class="section about-section">
          <div class="container">
            <h2 class="section-title">À Propos</h2>
            <div class="glass-card">
              <p>L'Éveil de l'Étincelle est une épopée fantaisie écrite avec passion. Suivez-moi pour découvrir la suite des aventures d'Hilyésin.</p>
              <p style="margin-top: 1rem; font-weight: 600; font-family: 'Cinzel', serif;">Marc ASSI</p>
              <p style="margin-top: 1rem; opacity: 0.7;">© 2026 L'Éveil de l'Étincelle. Tous droits réservés.</p>
            </div>
          </div>
        </section>
      </main>

      <footer class="main-footer">
        <div class="container">
          <p>Site réalisé avec passion pour L'Éveil de l'Étincelle</p>
        </div>
      </footer>
    </div>
    
    <!-- Reader Overlay Container -->
    <div id="reader-container"></div>
  `;

  // Initialize interactive elements
  initNavigation();
  createAshParticles('bg-canvas');
  initChapterButtons();
}

function initChapterButtons() {
  // Use event delegation on the chapters-grid container for better performance and to handle dynamic content if needed
  const grid = document.querySelector('.chapters-grid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.read-chapter-btn');
      if (btn) {
        e.preventDefault();
        const chapterId = btn.getAttribute('data-id');
        if (chapterId) {
          openChapter(chapterId);
        }
      }
    });
  }
}

// Chapter Reader Logic
function openChapter(chapterId) {
  const readerContainer = document.getElementById('reader-container');
  const chapter = chaptersData.chapters.find(c => c.id === chapterId);

  if (!chapter) {
    console.error("Chapter not found:", chapterId);
    return;
  }

  // Update SEO for Chapter
  updateSEO('chapter', chapter);

  const currentIndex = chaptersData.chapters.findIndex(c => c.id === chapterId);
  const nextChapter = currentIndex < chaptersData.chapters.length - 1 ? chaptersData.chapters[currentIndex + 1] : null;

  // Render the reader overlay
  readerContainer.innerHTML = renderChapterReader(chapter, chaptersData.presentation.stripeLink);

  // Initialize Comments for this chapter
  loadComments(chapter.id, chapter.title);

  // Update URL hash
  history.pushState({ chapterId }, '', `#${chapterId}`);

  // Show overlay with animation
  const overlay = readerContainer.querySelector('.chapter-reader-overlay');

  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  // Disable main scroll
  document.body.style.overflow = 'hidden';

  // Attach event listeners for the reader
  attachReaderEvents(overlay, chapter, nextChapter);
}

function attachReaderEvents(overlay, chapter, nextChapter = null) {
  const closeBtn = overlay.querySelector('.btn-close-reader');
  const track = overlay.querySelector('.chapter-track');
  const carousel = track.parentElement; // chapter-carousel
  const progressBar = overlay.querySelector('.reader-progress-fill');
  const progressText = overlay.querySelector('.reader-progress-text');

  // Controls
  const settingsBtn = overlay.querySelector('.btn-settings-reader');
  const settingsPanel = overlay.querySelector('.settings-panel');
  const fontChoiceBtns = overlay.querySelectorAll('.font-choice-btn');
  const fontSizeBtns = overlay.querySelectorAll('.font-btn');
  const prevPageBtn = overlay.querySelector('.nav-btn.prev');
  const nextPageBtn = overlay.querySelector('.nav-btn.next');

  let totalPages = 1;
  let currentPage = 1;
  let pageElements = [];
  let touchStartX = 0;
  let touchEndX = 0;
  let mobileScrollHandler = null; // listener sur carousel en mode colonnes

  function createHorizontalPages(restorePage = 1) {
    track.innerHTML = '';
    pageElements = [];

    // Nettoyer l'ancien listener mobile si présent (évite les doublons au resize)
    if (mobileScrollHandler) {
      carousel.removeEventListener('scroll', mobileScrollHandler);
      mobileScrollHandler = null;
    }

    const isMobile = window.innerWidth <= 768;

    // Dimensions d'une page.
    // Sur mobile : visualViewport.height exclut l'URL bar et la barre de gestes Android,
    // garantissant que le padding-bottom de sécurité reste toujours visible à l'écran.
    const pageWidth = isMobile ? carousel.offsetWidth : track.offsetWidth;
    const pageHeight = isMobile
      ? Math.max(200, (window.visualViewport?.height ?? window.innerHeight) - 60)
      : track.offsetHeight;

    if (isMobile) {
      track.style.cssText = `display:flex;height:${pageHeight}px;width:max-content;overflow:visible;`;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = chapter.content;
    const children = Array.from(tempDiv.children);

    // Crée une nouvelle page et l'insère dans le track
    function startPage(isFirst) {
      const p = document.createElement('div');
      p.className = isFirst ? 'chapter-page chapter-page--first' : 'chapter-page';
      p.style.width  = `${pageWidth}px`;
      p.style.height = `${pageHeight}px`;
      if (isFirst) {
        const h = document.createElement('h2');
        h.className = 'chapter-page-title';
        h.textContent = chapter.title;
        p.appendChild(h);
      }
      track.appendChild(p);
      pageElements.push(p);
      return p;
    }

    if (!children.length) {
      const p = startPage(true);
      p.insertAdjacentHTML('beforeend', chapter.content);
      totalPages = 1; currentPage = 1;
      updateProgress(); scrollPage(1, true);
      if (isMobile) _attachMobileScroll(pageWidth);
      return;
    }

    // Coupe un paragraphe en deux pour remplir la page courante avant d'en commencer
    // une nouvelle. Recherche binaire sur les mots pour trouver la coupure maximale
    // qui ne provoque pas de débordement. Retourne { first, second } ou null.
    function trySplitParagraph(para) {
      const words = para.textContent.trim().split(/\s+/);
      if (words.length < 5) return null;
      const probe = para.cloneNode(false);
      activePage.appendChild(probe);
      let lo = 1, hi = words.length - 1, best = 0;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        probe.textContent = words.slice(0, mid).join(' ');
        if (activePage.scrollHeight <= activePage.clientHeight + 2) { best = mid; lo = mid + 1; }
        else { hi = mid - 1; }
      }
      activePage.removeChild(probe);
      if (best < 3) return null;
      const first  = para.cloneNode(false); first.textContent  = words.slice(0, best).join(' ');
      const second = para.cloneNode(false); second.textContent = words.slice(best).join(' ');
      return { first, second };
    }

    let activePage = startPage(true);

    for (const child of children) {
      activePage.appendChild(child);

      // Vérification du débordement réel dans le DOM
      if (activePage.scrollHeight > activePage.clientHeight + 2) {
        const titleOffset = pageElements.length === 1 ? 1 : 0;
        const contentCount = activePage.children.length - titleOffset;

        if (contentCount > 1) {
          activePage.removeChild(child);
          // Tenter un découpage mot à mot pour remplir la page courante
          const split = child.tagName === 'P' ? trySplitParagraph(child) : null;
          if (split) {
            activePage.appendChild(split.first);
            activePage = startPage(false);
            activePage.appendChild(split.second);
          } else {
            activePage = startPage(false);
            activePage.appendChild(child);
          }
        }
        // Sinon : élément unique trop grand → on l'accepte tel quel
      }
    }

    // Page dédiée pour le CTA "Chapitre suivant" — jamais tronquée
    if (nextChapter) {
      const endPage = startPage(false);
      endPage.classList.add('chapter-page--end');
      endPage.innerHTML = `
        <div class="chapter-end-cta">
          <p class="chapter-end-label">Fin du chapitre</p>
          <button class="btn btn-nav-chapter chapter-end-btn" data-id="${nextChapter.id}">
            ${nextChapter.title} →
          </button>
        </div>
      `;
    }

    totalPages = pageElements.length || 1;
    currentPage = 1;
    updateProgress();
    scrollPage(Math.min(restorePage, totalPages || 1), true);

    if (isMobile) _attachMobileScroll(pageWidth);
  }

  function _attachMobileScroll(pageWidth) {
    // Snap programmatique + mise à jour de la progression
    let snapTimer;
    mobileScrollHandler = () => {
      currentPage = Math.round(carousel.scrollLeft / pageWidth) + 1;
      updateProgress();
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        const target = Math.round(carousel.scrollLeft / pageWidth) * pageWidth;
        if (Math.abs(carousel.scrollLeft - target) > 2) {
          carousel.scrollTo({ left: target, behavior: 'smooth' });
        }
      }, 80);
    };
    carousel.addEventListener('scroll', mobileScrollHandler, { passive: true });

    // Hint swipe : montrer une seule fois par session
    if (!sessionStorage.getItem('swipeHintShown')) {
      sessionStorage.setItem('swipeHintShown', '1');
      const hint = document.createElement('div');
      hint.className = 'swipe-hint';
      hint.textContent = '← Glisser pour tourner les pages →';
      overlay.appendChild(hint);
      setTimeout(() => hint.remove(), 3100);
    }
  }

  // Mettre à jour la progression
  function updateProgress() {
    if (totalPages === 0) return;
    
    progressText.textContent = `Page ${currentPage} sur ${totalPages}`;
    
    const scrollPercent = totalPages > 1 ? ((currentPage - 1) / (totalPages - 1)) * 100 : 100;
    progressBar.style.width = `${scrollPercent}%`;
    
    // Mettre à jour les boutons de navigation
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }

  // Naviguer vers une page spécifique
  function scrollPage(pageNum, instant = false) {
    if (pageNum < 1 || pageNum > totalPages) return;
    currentPage = pageNum;
    const sc = window.innerWidth <= 768 ? carousel : track;
    sc.scrollTo({ left: (pageNum - 1) * sc.offsetWidth, behavior: instant ? 'instant' : 'smooth' });
    updateProgress();
  }

  // Naviguer à la page suivante/précédente
  function goToPage(dir) {
    const newPage = currentPage + dir;
    if (newPage >= 1 && newPage <= totalPages) {
      scrollPage(newPage);
    }
  }

  // Touch Events for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchEndX < touchStartX - 50) {
      // Swipe gauche
      goToPage(1);
    }
    if (touchEndX > touchStartX + 50) {
      // Swipe droite
      goToPage(-1);
    }
  };

  // Event Listeners
  prevPageBtn.addEventListener('click', () => goToPage(-1));
  nextPageBtn.addEventListener('click', () => goToPage(1));

  // Keyboard Navigation
  const handleKeydown = (e) => {
    if (e.key === 'ArrowLeft') goToPage(-1);
    if (e.key === 'ArrowRight') goToPage(1);
    if (e.key === 'Escape') closeReader();
  };
  window.addEventListener('keydown', handleKeydown);

  // Touch Events
  track.addEventListener('touchstart', handleTouchStart);
  track.addEventListener('touchend', handleTouchEnd);

  // Close Reader
  closeBtn.addEventListener('click', () => {
    window.removeEventListener('keydown', handleKeydown);
    closeReader();
    history.pushState(null, '', window.location.pathname);
  });

  // Settings Panel
  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsPanel.classList.toggle('active');
  });

  overlay.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
      settingsPanel.classList.remove('active');
    }
  });

  // Font Choice
  fontChoiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const font = btn.getAttribute('data-font');
      overlay.setAttribute('data-font', font);
      fontChoiceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Recréer les pages avec la nouvelle police
      setTimeout(createHorizontalPages, 100);
    });
  });

  // Font Size
  fontSizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.getAttribute('data-size');
      overlay.setAttribute('data-font-size', size);
      fontSizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Recréer les pages avec la nouvelle taille
      setTimeout(createHorizontalPages, 100);
    });
  });

  // Panneau commentaires
  const commentsBtn = overlay.querySelector('.btn-comments-reader');
  const sidebar = overlay.querySelector('.reader-sidebar');
  const closeCommentsBtn = overlay.querySelector('.btn-close-comments');
  if (commentsBtn && sidebar) {
    commentsBtn.addEventListener('click', () => sidebar.classList.toggle('active'));
    closeCommentsBtn?.addEventListener('click', () => sidebar.classList.remove('active'));
  }

  // Navigation entre les chapitres — délégation pour couvrir le CTA dynamique
  track.addEventListener('click', (e) => {
    const navBtn = e.target.closest('.btn-nav-chapter');
    if (navBtn) {
      window.removeEventListener('keydown', handleKeydown);
      const nextId = navBtn.getAttribute('data-id');
      closeReader();
      setTimeout(() => openChapter(nextId), 300);
    }
  });

  // Initialiser les pages une fois Merriweather effectivement rendue
  // document.fonts.ready peut résoudre avant le chargement lazy du overlay —
  // on force explicitement le chargement de Merriweather avant de mesurer.
  const handleResize = () => { createHorizontalPages(currentPage); };

  // On charge la police principale ; .catch() garantit que les pages sont
  // créées même si la police ne peut pas être chargée (réseau, cache, etc.)
  document.fonts.load('1rem "Merriweather"')
    .catch(() => {})
    .then(() => {
      createHorizontalPages();
      window.addEventListener('resize', handleResize);
      // Recalculer aussi quand l'URL bar apparaît/disparaît sur mobile
      if (window.visualViewport) window.visualViewport.addEventListener('resize', handleResize);
    });

  overlay.addEventListener('close-reader', () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('keydown', handleKeydown);
    if (window.visualViewport) window.visualViewport.removeEventListener('resize', handleResize);
    if (mobileScrollHandler) {
      carousel.removeEventListener('scroll', mobileScrollHandler);
      mobileScrollHandler = null;
    }
  }, { once: true });
}

function closeReader() {
  const overlay = document.querySelector('.chapter-reader-overlay');
  const readerContainer = document.getElementById('reader-container');

  // Revert SEO to Home
  updateSEO('home');

  if (overlay) {
    overlay.dispatchEvent(new CustomEvent('close-reader'));
    overlay.classList.remove('active');
    setTimeout(() => {
      readerContainer.innerHTML = '';
      document.body.style.overflow = ''; // Re-enable scroll on body
    }, 300);
  }
}

// Handle Browser Back Button
window.addEventListener('popstate', () => {
  // If we are back to root or non-chapter hash, close reader
  if (!window.location.hash.includes('chapter-')) {
    closeReader();
  } else {
    // If we are navigating TO a chapter via history (forward/back)
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('chapter-')) {
      openChapter(hash); // This might recurse if not careful, but openChapter handles ID checks
    }
  }
});

// Handle initial load with hash
window.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash.startsWith('#chapter-')) {
    const chapterId = window.location.hash.replace('#', '');
    // Small delay to ensure data is loaded/rendered
    setTimeout(() => openChapter(chapterId), 100);
  }
});

// Start the app
renderApp();
