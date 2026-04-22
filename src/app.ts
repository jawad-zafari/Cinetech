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
