
/**
 * SEO, AEO & LLM Optimization Manager
 * Handles dynamic meta tags, Open Graph, JSON-LD @graph, and AI context.
 */

const BASE_URL = 'https://www.leveildeletincelle.fr';
const AUTHOR_NAME = 'Marc';
const BOOK_TITLE = "L'Éveil de l'Étincelle";

export function updateSEO(type, data = {}) {
    // 1. Clear existing dynamic tags
    clearDynamicTags();

    // 2. Set Title, Meta Description & Canonical
    if (type === 'home') {
        const description = `Découvrez ${BOOK_TITLE}, une épopée de fantasy épique par ${AUTHOR_NAME}. Suivez Hilyesin dans un monde où la magie est rare et dangereuse. Lisez les chapitres gratuitement en ligne.`;
        document.title = `${BOOK_TITLE} | Roman Fantasy par ${AUTHOR_NAME}`;

        setMeta('description', description);
        setMeta('keywords', 'roman fantasy, lecture en ligne, marc auteur, livre gratuit, écriture, webroman, imaginaire, épopée');
        setCanonical(BASE_URL);

        // Open Graph / Social
        setOGTags({
            title: document.title,
            description: description,
            url: BASE_URL,
            type: 'website'
        });

        // JSON-LD @graph for better AEO/LLM context
        injectJSONLD({
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": `${BASE_URL}/#website`,
                    "url": BASE_URL,
                    "name": BOOK_TITLE,
                    "description": description,
                    "inLanguage": "fr-FR"
                },
                {
                    "@type": "Book",
                    "@id": `${BASE_URL}/#book`,
                    "name": `${BOOK_TITLE} - Tome 1 : Les Cendres`,
                    "author": { "@id": `${BASE_URL}/#author` },
                    "genre": ["Fantasy", "Epic Fantasy"],
                    "inLanguage": "fr-FR",
                    "bookFormat": "https://schema.org/EBook",
                    "url": BASE_URL,
                    "abstract": "Dans un monde où la magie est une rareté dangereuse, Hilyesin doit affronter son destin.",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "EUR",
                        "availability": "https://schema.org/InStock"
                    }
                },
                {
                    "@type": "Person",
                    "@id": `${BASE_URL}/#author`,
                    "name": AUTHOR_NAME,
                    "jobTitle": "Auteur",
                    "url": BASE_URL
                }
            ]
        });

        // AI Context for LLMs
        setMeta('ai:context', JSON.stringify({
            type: "creative_fiction",
            genre: "epic_fantasy",
            status: "ongoing",
            language: "fr",
            author: AUTHOR_NAME
        }));

    } else if (type === 'chapter') {
        const { title, excerpt, id } = data;
        const cleanExcerpt = excerpt ? excerpt.substring(0, 160).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() + '...' : '';
        const chapterUrl = `${BASE_URL}/#${id}`;

        document.title = `${title} - ${BOOK_TITLE}`;
        setMeta('description', `Lisez ${title} de ${BOOK_TITLE}. ${cleanExcerpt}`);
        setCanonical(chapterUrl);

        // Open Graph / Social
        setOGTags({
            title: `${title} - ${BOOK_TITLE}`,
            description: cleanExcerpt,
            url: chapterUrl,
            type: 'article'
        });

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
            "position": id.replace('chapter-', ''),
            "author": {
                "@type": "Person",
                "name": AUTHOR_NAME
            },
            "description": cleanExcerpt,
            "url": chapterUrl
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

function setCanonical(url) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
    }
    link.href = url;
}

function setOGTags({ title, description, url, type, image }) {
    const defaultImage = `${BASE_URL}/images/logo.jpg`;
    const mapping = {
        'og:title': title,
        'og:description': description,
        'og:url': url,
        'og:type': type,
        'og:image': image || defaultImage,
        'twitter:title': title,
        'twitter:description': description,
        'twitter:url': url,
        'twitter:image': image || defaultImage
    };

    Object.entries(mapping).forEach(([prop, val]) => {
        const attr = prop.startsWith('og:') ? 'property' : 'name';
        let el = document.querySelector(`meta[${attr}="${prop}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute(attr, prop);
            document.head.appendChild(el);
        }
        el.content = val;
    });
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
