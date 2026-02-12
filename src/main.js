
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

function loadComments(chapterId, title, stripeLink) {
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

  // Add support button in separate container (always visible, outside scrollable area)
  const supportContainer = document.getElementById('support-button-container');
  if (supportContainer && stripeLink) {
    supportContainer.innerHTML = ''; // Clear any previous button

    const supportButton = document.createElement('a');
    supportButton.href = stripeLink;
    supportButton.target = "_blank";
    supportButton.rel = "noopener noreferrer";
    supportButton.className = "btn-support";
    supportButton.innerHTML = '<span class="icon">❤️</span> Soutenir le projet';

    supportContainer.appendChild(supportButton);
  }
}

// Global Listener to try and catch post success if emitted
window.addEventListener('message', (e) => {
  if (e.data && e.data.from === 'cusdis') {
    // If we ever get a specific success event, we can enhance this.
    // For now, the visual refresh of the iframe is the main cue.
  }
});
/*
  Correction: The standard Cusdis script doesn't always broadcast 'onPost' to parent window easily without custom setup.
  However, we can use a workaround:
  The iFrame *reloads* or changes state.
  
  Actually, let's try to use the `onCusdisPost` hook if possible? No, that's for React usually.
  
  Let's try to add a MutationObserver on the iframe to see if it changes? No, cross-origin.
  
  Wait, let's trust the standard behavior or use a visual cue.
  Actually, Cusdis 1.0+ might emit `onPost`.
  Let's try implementing a generic handler that we can verify.
  
  Refined Plan: 
  I'll add the listener. If it doesn't work out of the box, I will add a small permanent notice below the box:
  "Note: Les commentaires apparaissent après validation."
  This is a safer UX pattern if technical detection is flaky.
  
  BUT, let's try to implement the helper message first.
*/
// Let's stick to adding a static helper text for now, it's 100% reliable.
// "Votre commentaire sera visible après validation par le modérateur."


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
              <p>L'Éveil de l'Étincelle est une épopée fantaisie écrite avec passion. Suivez-nous pour découvrir la suite des aventures d'Hilyésin.</p>
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

  // Render the reader overlay
  readerContainer.innerHTML = renderChapterReader(chapter, chaptersData.chapters);

  // Initialize Comments for this chapter
  loadComments(chapter.id, chapter.title, chaptersData.presentation.stripeLink);

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
  attachReaderEvents(overlay);
}

function attachReaderEvents(overlay) {
  const closeBtn = overlay.querySelector('.btn-close-reader');
  // Handle main overlay scroll for reading progress
  const scrollContainer = overlay;
  const progressBar = overlay.querySelector('.reader-progress-fill');
  const progressText = overlay.querySelector('.reader-progress-text');

  // Close Reader
  closeBtn.addEventListener('click', () => {
    closeReader();
    // Revert URL cleanly
    history.pushState(null, '', window.location.pathname);
  });

  // Scroll Progress Logic
  scrollContainer.addEventListener('scroll', () => {
    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;

    let scrollPercent = 0;
    if (scrollHeight > 0) {
      scrollPercent = (scrollTop / scrollHeight) * 100;
    }

    scrollPercent = Math.min(100, Math.max(0, scrollPercent));

    progressBar.style.width = `${scrollPercent}%`;
    progressText.textContent = `${Math.round(scrollPercent)}% lu`;
  });

  // Navigation between chapters
  const navBtns = overlay.querySelectorAll('.btn-nav-chapter');
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const nextId = btn.getAttribute('data-id');
      closeReader();
      setTimeout(() => openChapter(nextId), 300);
    });
  });
}

function closeReader() {
  const overlay = document.querySelector('.chapter-reader-overlay');
  const readerContainer = document.getElementById('reader-container');

  // Revert SEO to Home
  updateSEO('home');

  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => {
      readerContainer.innerHTML = '';
      document.body.style.overflow = ''; // Re-enable scroll on body
    }, 300);
  }
}

// Handle Browser Back Button
window.addEventListener('popstate', (event) => {
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
