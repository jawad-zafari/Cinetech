import { API_KEY, BASE_URL } from "./config.js";

/**
 * La fonction principale de gestion des commentaires
 */
export async function initComments(id: string, type: string): Promise<void> {
  const commentsList = document.getElementById("comments-list");
  const commentForm = document.getElementById(
    "comment-form",
  ) as HTMLFormElement;

  if (!commentsList || !commentForm) return;

}