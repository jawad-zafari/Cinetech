import { API_KEY, BASE_URL, IMAGE_BASE_URL } from './config.js';

// Récupération du terme recherché depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q');

const searchTitle = document.getElementById('search-title');
const resultsGrid = document.getElementById('search-results-grid');
const noResultsMsg = document.getElementById('no-results-message');

async function loadSearchResults(): Promise<void> {
    if (!query || !resultsGrid || !searchTitle) return;

    // Afficher le terme recherché
    searchTitle.textContent = `Résultats pour : "${query}"`;

    try {
        // Recherche globale (films et séries en même temps)
        const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=1`);
        const data = await response.json();

        // Filtrer pour ne garder que les films et séries avec une affiche valide
        const validResults = data.results.filter((item: any) => 
            (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path
        );

        // Limiter strictement à 20 résultats
        const finalResults = validResults.slice(0, 20);

        if (finalResults.length === 0) {
            if (noResultsMsg) noResultsMsg.style.display = 'block';
            return;
        }

        resultsGrid.innerHTML = '';

        finalResults.forEach((item: any) => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.style.cursor = 'pointer';

            const title = item.title || item.name;
            const date = item.release_date || item.first_air_date;
            const year = date ? date.substring(0, 4) : 'N/A';
            
            card.innerHTML = `
                <img src="${IMAGE_BASE_URL}${item.poster_path}" alt="${title}">
                <div class="movie-info">
                    <h3 class="movie-title">${title}</h3>
                    <p>Année : ${year}</p>
                </div>
            `;

            // Redirection vers la page de détails avec le bon type (film ou série)
            card.addEventListener('click', () => {
                window.location.href = `details.html?id=${item.id}&type=${item.media_type}`;
            });

            resultsGrid.appendChild(card);
        });

    } catch (error) {
        console.error("Erreur lors de la recherche :", error);
    }
}

loadSearchResults();