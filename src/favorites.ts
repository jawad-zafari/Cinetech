import { IMAGE_BASE_URL } from './config.js';

const favoritesGrid = document.getElementById('favorites-grid');


// Affiche une notification
function showToast(message: string): void {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 2000);
}


/**
 * Charge et affiche la liste des favoris depuis le localStorage
 */
function loadFavorites(): void {
    if (!favoritesGrid) return;

    // 1. Récupération des données
    const favorites = JSON.parse(localStorage.getItem('cinetech_favorites') || '[]');

    // 2. Gestion du cas où la liste est vide
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<p class="empty-message">Votre liste de favoris est vide. Allez explorer des films et des séries !</p>';
        return;
    }

    // 3. Nettoyage de la grille
    favoritesGrid.innerHTML = '';

    // 4. Création des cartes pour chaque favori
    favorites.forEach((fav: any) => {
        const card = document.createElement('div');
        card.className = 'movie-card';

        // Structure de la carte avec un bouton de suppression
        card.innerHTML = `
            <img src="${IMAGE_BASE_URL}${fav.poster_path}" alt="${fav.title}" style="cursor: pointer;">
            <div class="movie-info">
                <h3 class="movie-title">${fav.title}</h3>
                <p>★ ${fav.vote_average ? fav.vote_average.toFixed(1) : 'N/A'}</p>
                <button class="btn-remove-fav" data-id="${fav.id}" data-type="${fav.type}">
                    Retirer
                </button>
            </div>
        `;

        // Événement : Clic sur l'image pour aller aux détails
        const img = card.querySelector('img');
        if (img) {
            img.addEventListener('click', () => {
                window.location.href = `details.html?id=${fav.id}&type=${fav.type}`;
            });
        }

        // Événement : Clic sur le bouton pour retirer des favoris
        const btnRemove = card.querySelector('.btn-remove-fav');
        if (btnRemove) {
            btnRemove.addEventListener('click', (event) => {
                event.stopPropagation(); // Évite de déclencher le clic sur la carte
                showToast("Favori retiré");
                removeFromFavorites(fav.id, fav.type);
            });
        }

        favoritesGrid.appendChild(card);
    });
}

/**
 * Supprime un élément spécifique du localStorage et rafraîchit l'affichage
 */
function removeFromFavorites(id: number | string, type: string): void {
    let favorites = JSON.parse(localStorage.getItem('cinetech_favorites') || '[]');
    
    // Filtrer le tableau pour enlever l'élément cliqué
    favorites = favorites.filter((fav: any) => !(fav.id == id && fav.type === type));
    
    // Sauvegarder le nouveau tableau
    localStorage.setItem('cinetech_favorites', JSON.stringify(favorites));

    // Recharger la grille pour voir les changements immédiatement
    loadFavorites();
}

loadFavorites();