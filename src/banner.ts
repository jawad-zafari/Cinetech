import { API_KEY, BASE_URL, IMAGE_BASE_URL } from './config.js';
import type { Movie } from './types.js';


//  Charge les 10 films tendance

export async function loadSimpleScrollBanner(): Promise<void> {
    try {
        // Récupération des données
        const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=fr-FR`);
        const data = await response.json();
        const bannerMovies: Movie[] = data.results.slice(0, 10); 

        // Sélection du conteneur
        const carouselContainer = document.getElementById('hero-carousel');
        if (!carouselContainer) return;
        
        carouselContainer.innerHTML = ''; 

        // Création des slides pour chaque film
        bannerMovies.forEach((movie: Movie) => {
            const slide = document.createElement('div');
            slide.className = 'hero-slide';
            
            // Image de fond
            slide.style.backgroundImage = `url(${IMAGE_BASE_URL}${movie.backdrop_path})`;

            // Contenu HTML du slide (Titre, description, bouton)
            slide.innerHTML = `
                <div class="hero-overlay">
                    <div class="hero-content">
                        <h1>${movie.title}</h1>
                        <p>${movie.overview.length > 150 ? movie.overview.substring(0, 150) + '...' : movie.overview}</p>
                        <a href="details.html?id=${movie.id}" class="hero-btn">Voir les détails</a>
                    </div>
                </div>
            `;

            // Ajout du slide au conteneur principal
            carouselContainer.appendChild(slide);
        });

    } catch (error) {
        console.error("Erreur lors du chargement du banner:", error);
    }
}

// Initialisation
loadSimpleScrollBanner();



