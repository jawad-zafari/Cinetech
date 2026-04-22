import { API_KEY, BASE_URL, IMAGE_BASE_URL } from './config.js';

// Pagination
let currentPage = parseInt(sessionStorage.getItem('savedFilmPage') || '1', 10);
let totalPages = 1;

const grid = document.getElementById('catalog-grid');
const btnPrev = document.getElementById('btn-prev') as HTMLButtonElement;
const btnNext = document.getElementById('btn-next') as HTMLButtonElement;
const pageIndicator = document.getElementById('page-indicator');


//  Charge les films 
async function loadMovies(page: number): Promise<void> {
    if (!grid) return;

    try {
        const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=fr-FR&page=${page}`);
        const data = await response.json();

        totalPages = data.total_pages;
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

            //Enregistrement de la position avant la navigation
            card.addEventListener('click', () => {
                const scrollPos = window.scrollY.toString();
                sessionStorage.setItem('last_scroll_pos', scrollPos);
                window.location.href = `details.html?id=${movie.id}&type=movie`;
            });

            grid.appendChild(card);
        });

        updatePaginationUI();
        
        //Gestion intelligente du défilement (Scroll
        const savedPos = sessionStorage.getItem('last_scroll_pos');
        
        if (savedPos) {
            // Si on revient de la page détails, on restaure la position
            setTimeout(() => {
                window.scrollTo({
                    top: parseInt(savedPos, 10),
                    behavior: 'instant'
                });
                sessionStorage.removeItem('last_scroll_pos');
            }, 100);
        } else {
            // window.scrollTo({ top: 0, behavior: 'smooth' });
        }

    } catch (error) {
        console.error("Erreur lors du chargement des films:", error);
    }
}


//  Gère l'état des boutons de pagination
 
function updatePaginationUI(): void {
    if (pageIndicator) {
        pageIndicator.textContent = `Page ${currentPage} sur ${totalPages}`;
    }
    if (btnPrev) btnPrev.disabled = currentPage === 1;
    if (btnNext) btnNext.disabled = currentPage === totalPages;
}

// Événements pour les boutons de pagination
if (btnPrev) {
    btnPrev.addEventListener('click', () => {
        if (currentPage > 1) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            currentPage--;
            sessionStorage.setItem('savedFilmPage', currentPage.toString());
            loadMovies(currentPage);
        }
    });
}

if (btnNext) {
    btnNext.addEventListener('click', () => {
        if (currentPage < totalPages) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            currentPage++;
            sessionStorage.setItem('savedFilmPage', currentPage.toString());
            loadMovies(currentPage);
        }
    });
}

loadMovies(currentPage);