
const CUSDIS_APP_ID = "f4c40187-515a-4943-a0c6-f498019a4115";

export function loadComments(chapterId, chapterTitle) {
    const container = document.getElementById('comments-container');
    if (!container) return;

    // Clear previous content (placeholder)
    container.innerHTML = '';

    // Create the Cusdis thread div
    const threadDiv = document.createElement('div');
    threadDiv.id = "cusdis_thread";
    threadDiv.setAttribute("data-host", "https://cusdis.com");
    threadDiv.setAttribute("data-app-id", CUSDIS_APP_ID);
    threadDiv.setAttribute("data-page-id", chapterId);
    threadDiv.setAttribute("data-page-url", window.location.href); // Or a canonical URL construction
    threadDiv.setAttribute("data-page-title", chapterTitle);
    threadDiv.setAttribute("data-theme", "dark"); // Helpful if cusdis supports it or for custom CSS targeting

    container.appendChild(threadDiv);

    // Load the script if not already present
    if (!document.getElementById('cusdis-script')) {
        const script = document.createElement('script');
        script.id = 'cusdis-script';
        script.src = "https://cusdis.com/js/cusdis.es.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    } else {
        // If script is already loaded, we might need to re-initialize for the new thread
        // Cusdis typically auto-inits on load, but for SPA navigation, we need to trigger it manually if the window.Cusdis exists
        if (window.CUSDIS) {
            window.CUSDIS.initial();
        }
    }
}
