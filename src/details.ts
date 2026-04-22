import { API_KEY, BASE_URL, IMAGE_BASE_URL } from './config.js';

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const type = urlParams.get('type') || 'movie'; 


//  Bouton de retour
const btnBack = document.getElementById('btn-back');
if (btnBack) {
    btnBack.addEventListener('click', () => {
        //Revenir en arrière d'une étape dans l'historique du navigateur
        window.history.back();
    });
}


//  Charge les détails complets de l'œuvre
 
async function loadDetails(): Promise<void> {
    if (!id) return;

    try {
        // 1. Récupération des détails principaux (Film ou Série)
        const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=fr-FR`);
        const data = await response.json();

        // 2. Récupération des crédits (pour le réalisateur et les acteurs)
        const creditsResponse = await fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}&language=fr-FR`);
        const creditsData = await creditsResponse.json();

        if (data.success === false) return;
        // 3. Mise à jour de l'interface principale
        updateUI(data, creditsData);

        // 4. Récupération et affichage du casting
        loadCast(creditsData);

        if (id) {
            checkFavoriteStatus(id);
            const btnFav = document.getElementById('btn-favorite');
            btnFav?.addEventListener('click', () => toggleFavorite(data, type));
        }

    } catch (error) {
        console.error("Erreur lors du chargement des détails:", error);
    }
}

/**
 * Injecte les données dans le DOM
 */
function updateUI(data: any, creditsData: any): void {
    const hero = document.getElementById('movie-hero');
    const title = document.getElementById('movie-title');
    const poster = document.getElementById('movie-poster') as HTMLImageElement;
    const overview = document.getElementById('movie-overview');
    
    const yearElement = document.getElementById('movie-year');
    const countryElement = document.getElementById('movie-country');
    const directorElement = document.getElementById('movie-director');

    // Image de fond (Backdrop)
    if (hero && data.backdrop_path) {
        hero.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.4)), url(${IMAGE_BASE_URL}${data.backdrop_path})`;
    }
    
    // Titre, Poster et Synopsis
    if (title) title.textContent = data.title || data.name || "Titre inconnu";
    if (poster && data.poster_path) poster.src = `${IMAGE_BASE_URL}${data.poster_path}`;
    if (overview) overview.textContent = data.overview || "Pas de description disponible.";

    // Année de sortie
    if (yearElement) {
        const date = data.release_date || data.first_air_date;
        yearElement.textContent = date ? date.substring(0, 4) : "Inconnue";
    }

    // Pays d'origine
    if (countryElement) {
        const country = data.production_countries?.[0]?.name || data.origin_country?.[0] || "Inconnu";
        countryElement.textContent = country;
    }

    // Réalisateur (pour les films) ou Créateur (pour les séries)
    if (directorElement) {
        let directorName = "Inconnu";
        if (type === 'movie' && creditsData.crew) {
            const director = creditsData.crew.find((member: any) => member.job === 'Director');
            if (director) directorName = director.name;
        } else if (type === 'tv' && data.created_by && data.created_by.length > 0) {
            directorName = data.created_by[0].name;
        }
        directorElement.textContent = directorName;
    }

    // Genres
    const genresContainer = document.getElementById('movie-genres');
    if (genresContainer && data.genres) {
        genresContainer.innerHTML = data.genres.map((g: any) => `<span>${g.name}</span>`).join('');
    }
}

/**
 * Récupère et affiche les acteurs principaux
 */
function loadCast(creditsData: any): void {
    const castGrid = document.getElementById('cast-grid');
    if (!castGrid || !creditsData.cast) return;

    castGrid.innerHTML = '';

    // Afficher les 7 premiers acteurs
    creditsData.cast.slice(0, 7).forEach((actor: any) => {
        const actorCard = document.createElement('div');
        actorCard.className = 'actor-card';
        
        // Gestion des acteurs sans photo de profil
        const imageSrc = actor.profile_path 
            ? `${IMAGE_BASE_URL}${actor.profile_path}` 
            : 'https://via.placeholder.com/150x225?text=Image+non+disponible';

        actorCard.innerHTML = `
            <img src="${imageSrc}" alt="${actor.name}">
            <p><strong>${actor.name}</strong></p>
            <p>${actor.character}</p>
        `;
        castGrid.appendChild(actorCard);
    });
}


// --- Gestion des Favoris ---

/**
 * Récupère la liste des favoris depuis le LocalStorage
 */
function getFavorites(): any[] {
    const favs = localStorage.getItem('cinetech_favorites');
    return favs ? JSON.parse(favs) : [];
}

/**
 * Vérifie si l'œuvre actuelle est déjà en favoris et met à jour le bouton
 */
function checkFavoriteStatus(id: string): void {
    const btnFav = document.getElementById('btn-favorite');
    if (!btnFav) return;

    const favorites = getFavorites();
    const isFavorite = favorites.some(fav => fav.id === id);

    if (isFavorite) {
        btnFav.classList.add('active');
        btnFav.innerHTML = '<span class="heart-icon">❤️</span>';
    } else {
        btnFav.classList.remove('active');
        btnFav.innerHTML = '<span class="heart-icon">♡</span>';
    }
}

/**
 * Ajoute ou retire l'œuvre de la liste des favoris
 */
function toggleFavorite(data: any, type: string): void {
    let favorites = getFavorites();
    const id = data.id.toString();
    const index = favorites.findIndex(fav => fav.id === id);

    if (index > -1) {
        // Si déjà présent, on le retire
        favorites.splice(index, 1);
    } else {
        // Sinon, on l'ajoute avec les infos nécessaires pour la page Favoris
        favorites.push({
            id: id,
            type: type,
            title: data.title || data.name,
            poster_path: data.poster_path,
            vote_average: data.vote_average
        });
    }

    localStorage.setItem('cinetech_favorites', JSON.stringify(favorites));
    checkFavoriteStatus(id);
}


loadDetails();