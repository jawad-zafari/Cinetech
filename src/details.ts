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
