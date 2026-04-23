import { API_KEY, BASE_URL } from './config.js';

/**
 * La fonction principale de gestion des commentaires
 */
export async function initComments(id: string, type: string): Promise<void> {
    const commentsList = document.getElementById('comments-list');
    const commentForm = document.getElementById('comment-form') as HTMLFormElement;

    if (!commentsList || !commentForm) return;

    // 1. Chargement des commentaires (depuis l'API et LocalStorage)
    await loadComments(id, type, commentsList);

    // 2. Gestion de la soumission du formulaire
    commentForm.onsubmit = (event) => {
        event.preventDefault();
        handleCommentSubmit(id, type, commentsList);
    };
}

async function loadComments(id: string, type: string, container: HTMLElement): Promise<void> {
    try {
        // Obtenir des commentaires de l'API
const response = await fetch(`${BASE_URL}/${type}/${id}/reviews?api_key=${API_KEY}`);        const data = await response.json();
        const apiComments = data.results || [];

        // Obtenir les commentaires de LocalStorage
        const localComments = JSON.parse(localStorage.getItem('cinetech_comments') || '[]')
            .filter((c: any) => c.mediaId == id && c.mediaType === type);

        container.innerHTML = '';

       
    } catch (error) {
        console.error("Erreur comments:", error);
    }
}


function handleCommentSubmit(id: string, type: string, container: HTMLElement) {
    const input = document.getElementById('comment-input') as HTMLTextAreaElement;
    const text = input.value.trim();
    const name = document.getElementById('comment-name') as HTMLInputElement;
    const author = name.value.trim();

    if (!text || !author) return;

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