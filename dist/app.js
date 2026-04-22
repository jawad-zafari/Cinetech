import { API_KEY, BASE_URL, IMAGE_BASE_URL } from './config.js';
const movieGrid = document.getElementById('movieGrid');
export async function getPopularMovies() {
    try {
        const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR`;
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;
        console.log("Data fetched successfully.");
        displayMovies(movies);
    }
    catch (error) {
        console.error("Error fetching data:", error);
    }
}
export function displayMovies(movies) {
    movieGrid.innerHTML = "";
    movies.forEach((movie) => {
        const movieCard = document.createElement('div');
        movieCard.className = "movie-card";
        const imageUrl = movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Image';
        movieCard.innerHTML = `
            <img src="${imageUrl}" alt="${movie.title}">
            <h3>${movie.title}</h3>

            <p>Année : ${movie.release_date ? ` ${movie.release_date.substring(0, 4)}` : ''}</p>
        `;
        movieCard.addEventListener('click', () => {
            window.location.href = `details.html?id=${movie.id}&type=movie`;
        });
        movieGrid.appendChild(movieCard);
    });
}
// Récupère et affiche les séries télévisées populaires dans le conteneur dédié
export async function getPopularSeries() {
    try {
        const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=fr-FR`);
        const data = await response.json();
        const series = data.results;
        const seriesGrid = document.getElementById('seriesGrid');
        if (!seriesGrid)
            return;
        seriesGrid.innerHTML = '';
        series.forEach(serie => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            // Utilisation de "name"
            const displayTitle = serie.name ? serie.name : "Titre inconnu";
            // Extraction de l'année 
            const year = serie.first_air_date ? ` ${serie.first_air_date.substring(0, 4)}` : '';
            card.innerHTML = `
                <img src="${IMAGE_BASE_URL}${serie.poster_path}" alt="${displayTitle}">
                <div class="movie-info">
                    <h3 class="movie-title">${displayTitle}</h3>
                    <p>Année : ${year}</p>
                </div>
            `;
            // Redirection vers la page de détails
            card.addEventListener('click', () => {
                window.location.href = `details.html?id=${serie.id}&type=tv `;
            });
            seriesGrid.appendChild(card);
        });
    }
    catch (error) {
        console.error("Erreur lors de la récupération des séries:", error);
    }
}
// Récupère les sorties cinématographiques futures
export async function getMovieNews() {
    // la date du jour
    const today = new Date().toISOString().split('T')[0];
    try {
        const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=fr-FR`);
        const data = await response.json();
        // Filtrer les résultats : uniquement les films plus anciens qu'aujourd'hui
        const futureMovies = data.results.filter((movie) => {
            return movie.release_date && movie.release_date > today;
        });
        //les 6 premiers films dans la liste corrigée
        const newsItems = futureMovies.slice(0, 6);
        const container = document.getElementById('newsContainer');
        if (!container)
            return;
        container.innerHTML = '';
        newsItems.forEach((movie) => {
            const article = document.createElement('div');
            article.className = 'news-item';
            article.innerHTML = `
                <div class="news-image">
                    <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                </div>
                <div class="news-body">
                    <div class="news-date">Sortie prévue : ${movie.release_date}</div>
                    <h3>${movie.title}</h3>
                    <p>${movie.overview.substring(0, 200)}...</p>
                </div>
            `;
            article.addEventListener('click', () => {
                window.location.href = `details.html?id=${movie.id}&type=movie`;
            });
            container.appendChild(article);
        });
    }
    catch (error) {
        console.error("Erreur lors du chargement des actualités:", error);
    }
}
getPopularSeries();
getPopularMovies();
getMovieNews();
//# sourceMappingURL=app.js.map