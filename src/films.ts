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

        // Mise à jour de l'interface de pagination
        updatePaginationUI();
        
        // Remonter en haut de la page de manière fluide après le chargemen
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error("Erreur lors du chargement des films:", error);
    }
}


//  Gère l'état des boutons de pagination (activé/désactivé)

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
