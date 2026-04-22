import { API_KEY, BASE_URL, IMAGE_BASE_URL } from './config.js';
import type { Movie } from './types.js';


const movieGrid = document.getElementById('movieGrid') as HTMLElement;

export async function getPopularMovies(): Promise<void> {
    try {
        const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR`;
        const response = await fetch(url);
        const data = await response.json();
        
        const movies: Movie[] = data.results;
        
        console.log("Data fetched successfully.");
        
        displayMovies(movies);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

export function displayMovies(movies: Movie[]): void {
    movieGrid.innerHTML = ""; 

    movies.forEach((movie: Movie) => {
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
export async function getPopularSeries(): Promise<void> {
    try {
        const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=fr-FR`);
        const data = await response.json();
        const series: Movie[] = data.results;

        const seriesGrid = document.getElementById('seriesGrid');
        if (!seriesGrid) return;

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
    } catch (error) {
        console.error("Erreur lors de la récupération des séries:", error);
    }
}

