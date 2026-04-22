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

            // Redirection vers les détails
            card.addEventListener('click', () => {
                window.location.href = `details.html?id=${serie.id}&type=tv`;
            });

            grid.appendChild(card);
        });

        // Mise à jour de l'interface de pagination
        updatePaginationUI();
        
        // Remonter en haut de la page de manière fluide après le chargement
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error("Erreur lors du chargement des films:", error);
    }
}

/**
 * Gère l'état des boutons de pagination (activé/désactivé)
 */
function updatePaginationUI(): void {
    if (pageIndicator) {
        pageIndicator.textContent = `Page ${currentPage} sur ${totalPages}`;
    }

    // Désactiver "Précédent" si on est sur la première page
    if (btnPrev) btnPrev.disabled = currentPage === 1;
    
    // Désactiver "Suivant" si on est sur la dernière page
    if (btnNext) btnNext.disabled = currentPage === totalPages;
}

// Événements pour les boutons de pagination
if (btnPrev) {
    btnPrev.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadMovies(currentPage);
        }
    });
}

if (btnNext) {
    btnNext.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadMovies(currentPage);
        }
    });
}

loadMovies(currentPage);