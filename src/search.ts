import { API_KEY, BASE_URL } from './config.js';

let searchTimeout: ReturnType<typeof setTimeout>;

const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const searchIcon = document.querySelector('.search-input-icon') as HTMLElement;

const suggestionBox = document.createElement('ul');
suggestionBox.className = "suggestion-dropdown";

if (searchInput && searchInput.parentElement) {
    searchInput.parentElement.appendChild(suggestionBox);
}

// Fonction pour récupérer les suggestions depuis l'API
async function fetchSearchSuggestions(query: string): Promise<void> {
    try {
        const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Filtrer pour afficher uniquement les films et séries
        const results = data.results.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
        
        showSuggestions(results.slice(0, 10));

    } catch (error) {
        console.error("Erreur lors de la recherche :", error);
    }
}

// Fonction pour afficher les suggestions sous l'input
function showSuggestions(items: any[]): void {
    suggestionBox.innerHTML = "";

    if (items.length === 0) {
        suggestionBox.style.display = "none";
        return;
    }

    suggestionBox.style.display = "block";

    items.forEach((item: any) => {
        const li = document.createElement('li');

        const title = item.title || item.name;
        const rawDate = item.release_date || item.first_air_date;
        const year = rawDate ? ` (${rawDate.substring(0, 4)})` : '';
        const typeLabel = item.media_type === 'movie' ? '🎬' : '📺';

        li.textContent = `${typeLabel} ${title}${year}`;
        
        li.addEventListener('click', () => {
            suggestionBox.style.display = "none";
            searchInput.value = title;
            window.location.href = `details.html?id=${item.id}&type=${item.media_type}`;
        });

        suggestionBox.appendChild(li);
    });
}

// Fonction pour exécuter la recherche globale et rediriger vers la page des résultats
function executeSearch(): void {
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    if (query.length > 0) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
}

// --- Événements et interactions ---

if (searchInput) {
    // Gestion des suggestions automatiques
    searchInput.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const searchTerm = target.value.trim();

        clearTimeout(searchTimeout);

        if (searchTerm.length > 1) { 
            searchTimeout = setTimeout(() => {
                fetchSearchSuggestions(searchTerm);
            }, 300);
        } else {
            suggestionBox.style.display = "none";
        }
    });

    // Déclencher la recherche avec la touche "Entrée"
    searchInput.addEventListener('keypress', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            executeSearch();
        }
    });
}

// Déclencher la recherche au clic sur l'icône rouge
if (searchIcon) {
    searchIcon.style.cursor = 'pointer';
    searchIcon.addEventListener('click', executeSearch);
}

// Fermer le menu déroulant si on clique en dehors
document.addEventListener('click', (event) => {
    if (searchInput && event.target !== searchInput && event.target !== suggestionBox) {
        suggestionBox.style.display = "none";
    }
});