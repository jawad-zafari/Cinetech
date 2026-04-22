import { API_KEY, BASE_URL } from './config.js';
import type { Movie } from './types.js';
import { getPopularMovies } from './app.js';

const searchInput = document.getElementById('searchInput') as HTMLInputElement;

const suggestionBox = document.createElement('ul');
suggestionBox.className = "suggestion-dropdown";

if (searchInput.parentElement) {
    searchInput.parentElement.appendChild(suggestionBox);
}



async function fetchSearchSuggestions(query: string): Promise<void> {
    try {
        // multi pour la recherche combinée
        const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=fr-FR&query=${query}`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Filtrer les résultats pour afficher uniquement les films et séries (supprimer les acteurs des résultats)
        const results = data.results.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
        
        showSuggestions(results.slice(0, 10));

    } catch (error) {
        console.error("Erreur lors de la recherche :", error);
    }
}

function showSuggestions(items: any[]): void {
    suggestionBox.innerHTML = "";

    if (items.length === 0) {
        suggestionBox.style.display = "none";
        return;
    }

    suggestionBox.style.display = "block";

    items.forEach((item: any) => {
        const li = document.createElement('li');

        // Reconnaissance du nom et de la date basée sur un film ou une série
        const title = item.title || item.name;
        const rawDate = item.release_date || item.first_air_date;
        const year = rawDate ? ` (${rawDate.substring(0, 4)})` : '';
        
        const typeLabel = item.media_type === 'movie' ? '🎬' : '📺';

        li.textContent = `${typeLabel} ${title}${year}`;
        
        li.addEventListener('click', () => {
            suggestionBox.style.display = "none";
            searchInput.value = title;
            // ajouter un type de contenu au lien de la page de détail
            window.location.href = `details.html?id=${item.id}&type=${item.media_type}`;
        });

        suggestionBox.appendChild(li);
    });
}


    suggestionBox.style.display = "block";


    item.forEach((item: any) => {
        const li = document.createElement('li');


        const year = item.release_date ? ` (${item.release_date.substring(0, 4)})` : '';
        li.textContent = item.title + year;
        
        li.addEventListener('click', () => {
            suggestionBox.style.display = "none";
            searchInput.value = item.title;
            window.location.href = `details.html?id=${item.id}&type=${item.media_type}`;
        });

        suggestionBox.appendChild(li);
    });
}

searchInput.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value.trim();

    if (searchTerm.length > 0) {
        fetchSearchSuggestions(searchTerm);
    } else {
        suggestionBox.style.display = "none";
        getPopularMovies();
    }
});

document.addEventListener('click', (event) => {
    if (event.target !== searchInput && event.target !== suggestionBox) {
        suggestionBox.style.display = "none";
    }
});