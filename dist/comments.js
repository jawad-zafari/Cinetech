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
        if (localComments.length === 0 && apiComments.length === 0) {
            container.innerHTML = '<p style="color:#888;">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>';
            return;
        }
        // Afficher d'abord les commentaires locaux
        localComments.forEach((c) => {
            container.appendChild(createCommentElement(c, true));
        });
        // Afficher les commentaires de l'API
        apiComments.forEach((c) => {
            container.appendChild(createCommentElement(c, false));
        });
    }
    catch (error) {
        console.error("Erreur comments:", error);
    }
}
/**
 * Crée le HTML pour un commentaire ---
 */
function createCommentElement(comment, isLocal) {
    const div = document.createElement('div');
    div.className = `comment-item ${isLocal ? 'local-comment' : ''}`;
    // Déterminer l'auteur et la date selon la source (Local ou API)
    const author = comment.author;
    const content = comment.content;
    const date = isLocal ? comment.date : new Date(comment.created_at).toLocaleDateString('fr-FR');
    div.innerHTML = `
        <div class="comment-header">
            <strong>${author} ${isLocal ? '(Vous)' : ''}</strong>
            <span>${date}</span>
        </div>
        <p class="comment-content">${content}</p>
    `;
    return div;
}
function handleCommentSubmit(id, type, container) {
    const input = document.getElementById('comment-input');
    const text = input.value.trim();
    const name = document.getElementById('comment-name');
    const author = name.value.trim();
    if (!text || !author)
        return;
    const newComment = {
        mediaId: id,
        mediaType: type,
        author: author,
        content: text,
        date: new Date().toLocaleDateString('fr-FR')
    };
    const allComments = JSON.parse(localStorage.getItem('cinetech_comments') || '[]');
    allComments.unshift(newComment);
    localStorage.setItem('cinetech_comments', JSON.stringify(allComments));
    input.value = '';
    name.value = '';
    loadComments(id, type, container);
}
//# sourceMappingURL=comments.js.map