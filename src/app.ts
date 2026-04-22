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
