import { API_KEY, BASE_URL } from './config.js';
import { getPopularMovies } from './app.js';
const searchInput = document.getElementById('searchInput');
const suggestionBox = document.createElement('ul');
suggestionBox.className = "suggestion-dropdown";
if (searchInput.parentElement) {
    searchInput.parentElement.appendChild(suggestionBox);
}
async function fetchSearchSuggestions(query) {
    try {
        const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${query}`;
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;
        showSuggestions(movies);
    }
    catch (error) {
        console.error("Erreur lors de l'obtention des résultats :", error);
    }
}
function showSuggestions(movies) {
    suggestionBox.innerHTML = "";
    if (movies.length === 0) {
        suggestionBox.style.display = "none";
        return;
    }
    suggestionBox.style.display = "block";
    movies.forEach((movie) => {
        const li = document.createElement('li');
        const year = movie.release_date ? ` (${movie.release_date.substring(0, 4)})` : '';
        li.textContent = movie.title + year;
        li.addEventListener('click', () => {
            suggestionBox.style.display = "none";
            searchInput.value = movie.title;
            window.location.href = `details.html?id=${movie.id}`;
        });
        suggestionBox.appendChild(li);
    });
}
searchInput.addEventListener('input', (event) => {
    const target = event.target;
    const searchTerm = target.value.trim();
    if (searchTerm.length > 0) {
        fetchSearchSuggestions(searchTerm);
    }
    else {
        suggestionBox.style.display = "none";
        getPopularMovies();
    }
});
document.addEventListener('click', (event) => {
    if (event.target !== searchInput && event.target !== suggestionBox) {
        suggestionBox.style.display = "none";
    }
});
//# sourceMappingURL=search.js.map