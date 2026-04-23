import { API_KEY, BASE_URL } from './config.js';
/**
 * La fonction principale de gestion des commentaires
 */
export async function initComments(id, type) {
    const commentsList = document.getElementById('comments-list');
    const commentForm = document.getElementById('comment-form');
    if (!commentsList || !commentForm)
        return;
    // 1. Chargement des commentaires (depuis l'API et LocalStorage)
    await loadComments(id, type, commentsList);
    // 2. Gestion de la soumission du formulaire
    commentForm.onsubmit = (event) => {
        event.preventDefault();
        handleCommentSubmit(id, type, commentsList);
    };
}
async function loadComments(id, type, container) {
    try {
        // Obtenir des commentaires de l'API
        const response = await fetch(`${BASE_URL}/${type}/${id}/reviews?api_key=${API_KEY}`);
        const data = await response.json();
        const apiComments = data.results || [];
        // Obtenir les commentaires de LocalStorage
        const localComments = JSON.parse(localStorage.getItem('cinetech_comments') || '[]')
            .filter((c) => c.mediaId == id && c.mediaType === type);
        container.innerHTML = '';
    }
    catch (error) {
        console.error("Erreur comments:", error);
    }
}
function handleCommentSubmit(id, type, container) {
    const input = document.getElementById('comment-input');
    const text = input.value.trim();
    if (!text)
        return;
    const newComment = {
        mediaId: id,
        mediaType: type,
        author: "Utilisateur",
        content: text,
        date: new Date().toLocaleDateString('fr-FR')
    };
    const allComments = JSON.parse(localStorage.getItem('cinetech_comments') || '[]');
    allComments.unshift(newComment);
    localStorage.setItem('cinetech_comments', JSON.stringify(allComments));
    input.value = '';
    loadComments(id, type, container);
}
//# sourceMappingURL=comments.js.map