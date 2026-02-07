
/**
 * SEO & LLM Optimization Manager
 * Handles dynamic meta tags, Open Graph, and JSON-LD structured data.
 */

const BASE_URL = 'https://leveil-de-letincelle.fr'; // Replace with actual domain when live
const AUTHOR_NAME = 'Marc';
const BOOK_TITLE = "L'Éveil de l'Étincelle";

export function updateSEO(type, data = {}) {
    // 1. Clear existing dynamic tags
    clearDynamicTags();

    // 2. Set Title & Meta Description
    if (type === 'home') {
        document.title = `${BOOK_TITLE} | Roman Fantasy par ${AUTHOR_NAME}`;
        setMeta('description', `Découvrez ${BOOK_TITLE}, une épopée de fantasy où magie et technologie s'affrontent. Lisez les premiers chapitres gratuitement et suivez la création du roman.`);
        setMeta('keywords', 'roman fantasy, lecture en ligne, marc auteur, livre gratuit, écriture, webroman, imaginaire');

        // JSON-LD for the Book & Author (Home Context)
        injectJSONLD({
            "@context": "https://schema.org",
            "@type": "Book",
            "name": BOOK_TITLE,
            "author": {
                "@type": "Person",
                "name": AUTHOR_NAME
            },
            "genre": "Fantasy",
            "inLanguage": "fr",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock"
            },
            "url": BASE_URL,
            "description": "Une épopée de foudre et d'ombres. Suivez Hilyesin dans un monde où la magie est une ressource rare et dangereuse."
        });

    } else if (type === 'chapter') {
        const { title, excerpt, id } = data;
        const cleanExcerpt = excerpt ? excerpt.substring(0, 160).replace(/<[^>]*>/g, '') + '...' : '';

        document.title = `${title} - ${BOOK_TITLE}`;
        setMeta('description', `Lisez ${title} de ${BOOK_TITLE}. ${cleanExcerpt}`);

        // JSON-LD for the Chapter
        injectJSONLD({
            "@context": "https://schema.org",
            "@type": "Chapter",
            "headline": title,
            "isPartOf": {
                "@type": "Book",
                "name": BOOK_TITLE,
                "url": BASE_URL
            },
            "position": id.replace('chapter-', ''), // mental model: chapter-1 -> 1
            "author": {
                "@type": "Person",
                "name": AUTHOR_NAME
            },
            "description": cleanExcerpt,
            "url": `${BASE_URL}/#${id}`
        });
    }
}

function setMeta(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
    }
    meta.content = content;
}

function injectJSONLD(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.className = 'dynamic-seo-jsonld';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
}

function clearDynamicTags() {
    const scripts = document.querySelectorAll('.dynamic-seo-jsonld');
    scripts.forEach(s => s.remove());
}
