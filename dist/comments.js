import { API_KEY, BASE_URL } from "./config.js";
/**
 * La fonction principale de gestion des commentaires
 */
export async function initComments(id, type) {
    const commentsList = document.getElementById("comments-list");
    const commentForm = document.getElementById("comment-form");
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
        const localComments = JSON.parse(localStorage.getItem("cinetech_comments") || "[]").filter((c) => c.mediaId == id && c.mediaType === type);
        // Obtenez toutes les réponses de mémoire locale
        const allReplies = JSON.parse(localStorage.getItem("cinetech_replies") || "[]");
        container.innerHTML = "";
        if (localComments.length === 0 && apiComments.length === 0) {
            container.innerHTML =
                '<p style="color:#888;">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>';
            return;
        }
        // Afficher d'abord les commentaires locaux
        localComments.forEach((c) => {
            const repliesForThis = allReplies.filter((r) => r.parentId === c.id);
            container.appendChild(createCommentElement(c, true, repliesForThis, id, type, container));
        });
        // Afficher les commentaires de l'API
        apiComments.forEach((c) => {
            const repliesForThis = allReplies.filter((r) => r.parentId === c.id);
            container.appendChild(createCommentElement(c, false, repliesForThis, id, type, container));
        });
    }
    catch (error) {
        console.error("Erreur comments:", error);
    }
}
/**
 * Crée le HTML pour un commentaire ---
 */
function createCommentElement(comment, isLocal, replies, mediaId, mediaType, container) {
    const div = document.createElement("div");
    div.className = `comment-item ${isLocal ? "local-comment" : ""}`;
    // Déterminer l'auteur et la date selon la source (Local ou API)
    const author = comment.author;
    const content = comment.content;
    const date = isLocal
        ? comment.date
        : new Date(comment.created_at).toLocaleDateString("fr-FR");
    const commentId = comment.id; // ID unique du commentaire
    div.innerHTML = `
        <div class="comment-header">
            <strong>${author} ${isLocal ? "(Vous)" : ""}</strong>
            <span>${date}</span>
        </div>
        <p class="comment-content">${content}</p>
        
        <button class="reply-btn">Répondre</button>
        
        <form class="reply-form-container" id="form-${commentId}">
            <input type="text" class="reply-name" placeholder="Votre nom" required>
            <textarea class="reply-input" rows="2" placeholder="Votre réponse..." required></textarea>
            <button type="submit" class="btn-submit-reply">Envoyer</button>
        </form>

        <div class="replies-list" id="replies-${commentId}">
            ${replies
        .map((r) => `
                <div class="reply-item">
                    <div class="reply-header">
                        <strong>${r.author}</strong>
                        <span>${r.date}</span>
                    </div>
                    <p>${r.content}</p>
                </div>
            `)
        .join("")}
        </div>
    `;
    // Gérer l'ouverture et la fermeture du formulaire de réponse
    const replyBtn = div.querySelector(".reply-btn");
    const replyForm = div.querySelector(".reply-form-container");
    replyBtn.addEventListener("click", () => {
        replyForm.classList.toggle("active");
    });
    // Gérer la publication de nouvelles réponses
    replyForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const nameInput = replyForm.querySelector(".reply-name");
        const textInput = replyForm.querySelector(".reply-input");
        handleReplySubmit(commentId, nameInput.value, textInput.value, mediaId, mediaType, container);
    });
    return div;
}
function handleCommentSubmit(id, type, container) {
    const input = document.getElementById("comment-input");
    const text = input.value.trim();
    const name = document.getElementById("comment-name");
    const author = name.value.trim();
    if (!text || !author)
        return;
    const newComment = {
        id: Date.now().toString(), // Generate a unique ID for the local comment
        mediaId: id,
        mediaType: type,
        author: author,
        content: text,
        date: new Date().toLocaleDateString("fr-FR"),
    };
    const allComments = JSON.parse(localStorage.getItem("cinetech_comments") || "[]");
    allComments.unshift(newComment);
    localStorage.setItem("cinetech_comments", JSON.stringify(allComments));
    input.value = "";
    name.value = "";
    loadComments(id, type, container);
}
// function to save answers
function handleReplySubmit(parentId, author, content, mediaId, mediaType, container) {
    if (!author.trim() || !content.trim())
        return;
    const newReply = {
        parentId: parentId, // ID unique du commentaire parent
        author: author.trim(),
        content: content.trim(),
        date: new Date().toLocaleDateString("fr-FR"),
    };
    const allReplies = JSON.parse(localStorage.getItem("cinetech_replies") || "[]");
    allReplies.push(newReply);
    localStorage.setItem("cinetech_replies", JSON.stringify(allReplies));
    loadComments(mediaId, mediaType, container);
}
//# sourceMappingURL=comments.js.map