import { API_KEY, BASE_URL, IMAGE_BASE_URL } from './config.js';

// Pagination
let currentPage = parseInt(sessionStorage.getItem('seriesPage') || '1', 10);
let totalPages = 1;

const grid = document.getElementById('catalog-grid');
const btnPrev = document.getElementById('btn-prev') as HTMLButtonElement;
const btnNext = document.getElementById('btn-next') as HTMLButtonElement;
const pageIndicator = document.getElementById('page-indicator');


//  Charge les séries 
async function loadSeries(page: number): Promise<void> {
    if (!grid) return;

    try {
        const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=fr-FR&page=${page}`);
        const data = await response.json();

        totalPages = data.total_pages;
        grid.innerHTML = '';

        data.results.forEach((tv: any) => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            
            const year = tv.first_air_date ? tv.first_air_date.substring(0, 4) : 'N/A';

            card.innerHTML = `
                <img src="${IMAGE_BASE_URL}${tv.poster_path}" alt="${tv.name}">
                <div class="movie-info">
                    <h3 class="movie-title">${tv.name}</h3>
                    <p>Année : ${year}</p>
                </div>
            `;

            //Enregistrement de la position avant la navigation
            card.addEventListener('click', () => {
                const scrollPos = window.scrollY.toString();
                sessionStorage.setItem('last_scroll_pos_tv', scrollPos);
                window.location.href = `details.html?id=${tv.id}&type=tv`;
            });

            grid.appendChild(card);
        });

        updatePaginationUI();
        
        //Gestion intelligente du défilement (Scroll
        const savedPos = sessionStorage.getItem('last_scroll_pos_tv');
        
        if (savedPos) {
            // Si on revient de la page détails, on restaure la position
            setTimeout(() => {
                window.scrollTo({
                    top: parseInt(savedPos, 10),
                    behavior: 'instant'
                });
                sessionStorage.removeItem('last_scroll_pos_tv');
            }, 100);
        } else {
            // window.scrollTo({ top: 0, behavior: 'smooth' });
        }

    } catch (error) {
        console.error("Erreur lors du chargement des séries:", error);
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
            sessionStorage.setItem('seriesPage', currentPage.toString());
            loadSeries(currentPage);
        }
    });
}

if (btnNext) {
    btnNext.addEventListener('click', () => {
        if (currentPage < totalPages) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            currentPage++;
            sessionStorage.setItem('seriesPage', currentPage.toString());
            loadSeries(currentPage);
        }
    });
}

loadSeries(currentPage);