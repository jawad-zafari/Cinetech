import { IMAGE_BASE_URL } from './config.js';
const favoritesGrid = document.getElementById('favorites-grid');
/**
 * Charge et affiche la liste des favoris depuis le localStorage
 */
function loadFavorites() {
    if (!favoritesGrid)
        return;
    // 1. Récupération des données
    const favorites = JSON.parse(localStorage.getItem('cinetech_favorites') || '[]');
    // 2. Gestion du cas où la liste est vide
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<p class="empty-message">Votre liste de favoris est vide. Allez explorer des films et des séries !</p>';
        return;
    }
    // 3. Nettoyage de la grille
    favoritesGrid.innerHTML = '';
}
loadFavorites();
//# sourceMappingURL=favorites.js.map