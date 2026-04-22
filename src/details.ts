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

    } catch (error) {
        console.error("Erreur lors du chargement des détails:", error);
    }
}
