import { API_KEY, BASE_URL, IMAGE_BASE_URL } from './config.js';

// Pagination
let currentPage = 1;
let totalPages = 1;

// Éléments du DOM
const grid = document.getElementById('catalog-grid');
const btnPrev = document.getElementById('btn-prev') as HTMLButtonElement;
const btnNext = document.getElementById('btn-next') as HTMLButtonElement;
const pageIndicator = document.getElementById('page-indicator');


//   Charger les films
 
async function loadMovies(page: number): Promise<void> {
    if (!grid) return;

    try {
        // Requête vers l'API
        const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=fr-FR&page=${page}`);
        const data = await response.json();

        // Mise à jour des variables d'état
        totalPages = data.total_pages;
        
        // Nettoyage
        grid.innerHTML = '';

        data.results.forEach((movie: any) => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            
            const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';

            card.innerHTML = `
                <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p>Année : ${year}</p>
                </div>
            `;

            // Enregistrement de la position

card.addEventListener('click', () => {
    // Stocker la position
    const scrollPos = window.scrollY.toString();
    sessionStorage.setItem('last_scroll_pos', scrollPos);
    
    // Redirection vers la page de détails
    window.location.href = `details.html?id=${movie.id}&type=movie`;
});

            grid.appendChild(card);
        });
