
export function renderNavigation() {
    return `
    <nav id="main-nav" class="navigation">
      <div class="nav-container">
        <a href="#" class="nav-logo" data-scroll="home">L'Éveil de l'Étincelle</a>
        
        <div class="nav-links desktop-only">
          <a href="#home" class="nav-link active" data-scroll="home">Accueil</a>
          <a href="#presentation" class="nav-link" data-scroll="presentation">Présentation</a>
          <a href="#chapters" class="nav-link" data-scroll="chapters">Derniers Chapitres</a>
          <a href="#about" class="nav-link" data-scroll="about">À propos</a>
        </div>

        <button class="mobile-menu-toggle" aria-label="Toggle menu">
          <span class="hamburger"></span>
        </button>

        <div class="mobile-menu">
           <a href="#home" class="mobile-nav-link active" data-scroll="home">Accueil</a>
          <a href="#presentation" class="mobile-nav-link" data-scroll="presentation">Présentation</a>
          <a href="#chapters" class="mobile-nav-link" data-scroll="chapters">Derniers Chapitres</a>
          <a href="#about" class="mobile-nav-link" data-scroll="about">À propos</a>
        </div>
      </div>
      <div class="scroll-progress-container">
        <div class="scroll-progress-bar" id="reading-progress"></div>
      </div>
    </nav>
  `;
}

export function initNavigation() {
    const nav = document.getElementById('main-nav');
    const toggle = nav.querySelector('.mobile-menu-toggle');
    const mobileMenu = nav.querySelector('.mobile-menu');
    const hamburger = nav.querySelector('.hamburger');
    const links = nav.querySelectorAll('a[data-scroll]');
    const progressBar = document.getElementById('reading-progress');

    // Sticky Header & Scroll Spy
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Reading Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + "%";

        // Active Section
        const sections = ['home', 'presentation', 'chapters', 'about'];
        let current = '';

        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 150 && rect.bottom >= 150) {
                    current = section;
                }
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-scroll') === current) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Menu Toggle
    toggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open');
    });

    // Smooth Scroll
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-scroll');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Calculate offset for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }

            // Close mobile menu
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('open');
        });
    });
}
