import { API_KEY, BASE_URL, IMAGE_BASE_URL } from './config.js';

// pagination
let currentPage = 1;
let totalPages = 1;

// Éléments du DOM
const grid = document.getElementById('catalog-grid');
const btnPrev = document.getElementById('btn-prev') as HTMLButtonElement;
const btnNext = document.getElementById('btn-next') as HTMLButtonElement;
const pageIndicator = document.getElementById('page-indicator');


// Charge les series
 
async function loadMovies(page: number): Promise<void> {
    if (!grid) return;

    try {
        // Requête vers l'API
        const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=fr-FR&page=${page}`);
        const data = await response.json();

        // Mise à jour des variables d'état
        totalPages = data.total_pages;
        
        // Nettoyage
        grid.innerHTML = '';

        data.results.forEach((serie: any) => {
            const card = document.createElement('div');
            card.className = 'movie-card';

            // first_air_date
            const year = serie.first_air_date?.substring(0, 4) || 'Inconnue';
            card.innerHTML = `
                <img src="${IMAGE_BASE_URL}${serie.poster_path}" alt="${serie.name}">
                <div class="movie-info">
                    <h3 class="movie-title">${serie.name}</h3>
                    <p>Année : ${year}</p>
                </div>
            `;
