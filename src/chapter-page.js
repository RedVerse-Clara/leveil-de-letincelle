/**
 * Entry point for individual chapter pages.
 * Detects which chapter to display from the URL path.
 */
import { renderSiteNavigation, renderSiteFooter, initSharedPage, chaptersData } from './shared.js';
import { renderChapterReader } from './components/ChapterReader.js';

// Map URL slugs to chapter IDs
const SLUG_MAP = {
  'les-cendres-de-pradwyn': 'chapter-1',
  'lecho-sous-la-pierre': 'chapter-2',
};

const app = document.querySelector('#app');

function getChapterFromURL() {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  // URL pattern: /chapitre/{slug}/
  const chapitreIndex = pathParts.indexOf('chapitre');
  if (chapitreIndex >= 0 && pathParts[chapitreIndex + 1]) {
    const slug = pathParts[chapitreIndex + 1];
    const chapterId = SLUG_MAP[slug];
    if (chapterId) {
      return chaptersData.chapters.find(c => c.id === chapterId);
    }
  }
  return null;
}

function renderChapterPage() {
  const chapter = getChapterFromURL();

  if (!chapter) {
    app.innerHTML = `
      ${renderSiteNavigation('chapters')}
      <div id="content-wrapper">
        <main>
          <section class="section" style="text-align:center; padding-top: 8rem;">
            <div class="container">
              <h1 style="font-family: var(--font-heading); font-size: 2rem; margin-bottom: 1rem;">Chapitre introuvable</h1>
              <p style="color: var(--text-secondary); margin-bottom: 2rem;">Ce chapitre n'existe pas ou n'est pas encore publié.</p>
              <a href="/" class="btn btn-primary">Retour à l'accueil</a>
            </div>
          </section>
        </main>
        ${renderSiteFooter()}
      </div>
    `;
    initSharedPage();
    return;
  }

  const currentIndex = chaptersData.chapters.findIndex(c => c.id === chapter.id);
  const nextChapter = currentIndex < chaptersData.chapters.length - 1 ? chaptersData.chapters[currentIndex + 1] : null;
  const prevChapter = currentIndex > 0 ? chaptersData.chapters[currentIndex - 1] : null;
  const stripeLink = chaptersData.presentation.stripeLink;

  // Render the full-page reader
  app.innerHTML = renderChapterReader(chapter, stripeLink);

  // Override close button to go back to homepage
  const closeBtn = document.querySelector('.btn-close-reader');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/';
    });
  }

  // Initialize reader logic (pagination, fonts, etc.)
  initReaderLogic(chapter, nextChapter);
}

function initReaderLogic(chapter, nextChapter) {
  const overlay = document.querySelector('.chapter-reader-overlay');
  if (!overlay) return;

  const track = overlay.querySelector('.chapter-track');
  const carousel = track.parentElement;
  const progressBar = overlay.querySelector('.reader-progress-fill');
  const progressText = overlay.querySelector('.reader-progress-text');
  const settingsBtn = overlay.querySelector('.btn-settings-reader');
  const settingsPanel = overlay.querySelector('.settings-panel');
  const fontChoiceBtns = overlay.querySelectorAll('.font-choice-btn');
  const fontSizeBtns = overlay.querySelectorAll('.font-btn');
  const prevPageBtn = overlay.querySelector('.nav-btn.prev');
  const nextPageBtn = overlay.querySelector('.nav-btn.next');

  let totalPages = 1;
  let currentPage = 1;
  let pageElements = [];

  function getChapterUrl(ch) {
    // Reverse lookup slug from chapter ID
    for (const [slug, id] of Object.entries(SLUG_MAP)) {
      if (id === ch.id) return `/chapitre/${slug}/`;
    }
    return '/';
  }

  function createHorizontalPages(restorePage = 1) {
    track.innerHTML = '';
    pageElements = [];

    const isMobile = window.innerWidth <= 768;
    const pageWidth = isMobile ? carousel.offsetWidth : track.offsetWidth;
    const pageHeight = isMobile
      ? Math.max(200, carousel.clientHeight)
      : track.offsetHeight;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = chapter.content;
    const children = Array.from(tempDiv.children);

    function startPage(isFirst) {
      const p = document.createElement('div');
      p.className = isFirst ? 'chapter-page chapter-page--first' : 'chapter-page';
      p.style.width = `${pageWidth}px`;
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
      return;
    }

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
      const first = para.cloneNode(false); first.textContent = words.slice(0, best).join(' ');
      const second = para.cloneNode(false); second.textContent = words.slice(best).join(' ');
      return { first, second };
    }

    let activePage = startPage(true);

    for (const child of children) {
      activePage.appendChild(child);
      if (activePage.scrollHeight > activePage.clientHeight + 2) {
        const titleOffset = pageElements.length === 1 ? 1 : 0;
        const contentCount = activePage.children.length - titleOffset;
        if (contentCount > 1) {
          activePage.removeChild(child);
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
      }
    }

    // End page with next chapter CTA (link to real URL)
    if (nextChapter) {
      const endPage = startPage(false);
      endPage.classList.add('chapter-page--end');
      endPage.innerHTML = `
        <div class="chapter-end-cta">
          <p class="chapter-end-label">Fin du chapitre</p>
          <a href="${getChapterUrl(nextChapter)}" class="btn btn-nav-chapter chapter-end-btn">
            ${nextChapter.title} →
          </a>
        </div>
      `;
    }

    totalPages = pageElements.length || 1;
    currentPage = 1;
    updateProgress();
    scrollPage(Math.min(restorePage, totalPages || 1), true);
  }

  function updateProgress() {
    if (totalPages === 0) return;
    progressText.textContent = `${currentPage} / ${totalPages}`;
    const scrollPercent = totalPages > 1 ? ((currentPage - 1) / (totalPages - 1)) * 100 : 100;
    progressBar.style.width = `${scrollPercent}%`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }

  function scrollPage(pageNum, instant = false) {
    if (pageNum < 1 || pageNum > totalPages) return;
    currentPage = pageNum;
    if (window.innerWidth <= 768) {
      pageElements.forEach((p, i) => {
        p.classList.toggle('chapter-page--active', i === pageNum - 1);
      });
    } else {
      track.scrollTo({ left: (pageNum - 1) * track.offsetWidth, behavior: instant ? 'instant' : 'smooth' });
    }
    updateProgress();
  }

  function goToPage(dir) {
    const newPage = currentPage + dir;
    if (newPage >= 1 && newPage <= totalPages) scrollPage(newPage);
  }

  // Navigation buttons
  prevPageBtn.addEventListener('click', () => goToPage(-1));
  nextPageBtn.addEventListener('click', () => goToPage(1));

  // Keyboard
  const handleKeydown = (e) => {
    if (e.key === 'ArrowLeft') goToPage(-1);
    if (e.key === 'ArrowRight') goToPage(1);
    if (e.key === 'Escape') window.location.href = '/';
  };
  window.addEventListener('keydown', handleKeydown);

  // Touch (desktop only)
  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    if (window.innerWidth > 768) {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (dx < -50) goToPage(1);
      if (dx > 50) goToPage(-1);
    }
  });

  // Settings
  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsPanel.classList.toggle('active');
  });
  overlay.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
      settingsPanel.classList.remove('active');
    }
  });

  // Font choice
  fontChoiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.setAttribute('data-font', btn.getAttribute('data-font'));
      fontChoiceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setTimeout(createHorizontalPages, 100);
    });
  });

  // Font size
  fontSizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.setAttribute('data-font-size', btn.getAttribute('data-size'));
      fontSizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setTimeout(createHorizontalPages, 100);
    });
  });

  // Comments panel
  const commentsBtn = overlay.querySelector('.btn-comments-reader');
  const sidebar = overlay.querySelector('.reader-sidebar');
  const closeCommentsBtn = overlay.querySelector('.btn-close-comments');
  if (commentsBtn && sidebar) {
    commentsBtn.addEventListener('click', () => sidebar.classList.toggle('active'));
    closeCommentsBtn?.addEventListener('click', () => sidebar.classList.remove('active'));
  }

  // Init pages after font load
  const handleResize = () => { createHorizontalPages(currentPage); };
  document.fonts.load('1rem "Merriweather"')
    .catch(() => {})
    .then(() => {
      createHorizontalPages();
      window.addEventListener('resize', handleResize);
      if (window.visualViewport) window.visualViewport.addEventListener('resize', handleResize);
    });
}

// Load comments via Cusdis
function loadChapterComments(chapter) {
  const container = document.getElementById('comments-container');
  if (!container) return;

  const div = document.createElement('div');
  div.id = 'cusdis_thread';
  div.dataset.host = 'https://cusdis.com';
  div.dataset.appId = 'f4c40187-515a-4943-a0c6-f498019a4115';
  div.dataset.pageId = chapter.id;
  div.dataset.pageUrl = window.location.href;
  div.dataset.pageTitle = chapter.title;
  div.dataset.theme = 'dark';
  container.appendChild(div);

  const script = document.createElement('script');
  script.src = 'https://cusdis.com/js/cusdis.es.js';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);

  const noticeContainer = document.getElementById('moderation-notice-container');
  if (noticeContainer) {
    const notice = document.createElement('p');
    notice.style.cssText = "color: var(--text-secondary); font-size: 0.85rem; opacity: 0.8; margin: 0;";
    notice.innerText = "Note : Les commentaires sont soumis à validation avant d'apparaître.";
    noticeContainer.appendChild(notice);
  }
}

// Boot
renderChapterPage();
const chapter = getChapterFromURL();
if (chapter) loadChapterComments(chapter);
