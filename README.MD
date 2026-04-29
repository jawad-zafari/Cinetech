# Cinetech - Plateforme d'exploration de films et séries

Cinetech est une application web dynamique et responsive permettant aux utilisateurs de naviguer dans une vaste bibliothèque de films et de séries TV en utilisant l'API **The Movie Database (TMDB)**. Ce projet a été développé dans le cadre du cursus à **La Plateforme**.
## 🌟 Fonctionnalités Clés

Le projet implémente toutes les exigences du cahier des charges avec une attention particulière à l'expérience utilisateur (UX) :

- **Page d'Accueil** : Mise en avant des tendances actuelles avec des carrousels interactifs.
- **Catalogues complets** : Pages dédiées pour les Films et les Séries avec un système de **pagination** fluide.
- **Recherche Intelligente** : Barre de recherche avec **autocomplétion** en temps réel utilisant des appels API asynchrones.
- **Page de Détails Riche** : 
    - Informations complètes (Réalisateur, pays, résumé, genres).
    - **Casting en Carrousel** : Affichage des acteurs principaux sous forme de menu chancelant.
    - **Recommandations (Films similaires)** : Un carrousel dynamique suggérant des œuvres liées.
- **Gestion des Favoris** : Système permettant d'ajouter ou de retirer des œuvres de sa liste personnelle, avec persistance via le **LocalStorage**.
- **Espace Communautaire (Commentaires)** :
    - Récupération des avis officiels de l'API TMDB.
    - Possibilité pour l'utilisateur de publier ses propres avis (nom + texte).
    - **Système de Réponses** : Fonctionnalité permettant de répondre directement à un commentaire existant.
- **Design Full-Responsive** : Interface optimisée pour Desktop, Tablette et Mobile, avec des menus chancelants adaptés.
## 🛠️ Stack Technique

- **Langages** : HTML5, CSS3 (Grid & Flexbox), TypeScript.
- **API** : Intégration de l'API TMDB (Fetch API).
- **Stockage** : Utilisation du `LocalStorage` pour la gestion des données utilisateurs (favoris, commentaires locaux, réponses).
- **Architecture** : Séparation des préoccupations (modules TypeScript pour les commentaires, la configuration, et les détails).

## ⚙️ Installation et Configuration

1. **Clonage du dépôt** :
   ```bash
   git clone [https://github.com/jawad-zafari/Cinetech.git]
   ```
2. **Configuration de l'API** :

Modifiez le fichier `config.ts` (ou `.js`) et insérez votre clé API TMDB :

```javascript
export const API_KEY = "cle API";
```
3. **Compilation** :
Si vous modifiez les fichiers `.ts`, utilisez le compilateur TypeScript :
```Bash
tsc -w
```
4. **Lancement** :
Ouvrez `index.html` via un serveur local (ex: Live Server sur VS Code).

## 📁 Structure du projet

   * `index.html` : Accueil du site.

   * `films.html` / ``series.html`` : Listes avec pagination.

   * `details.html` : Page de détails d'une œuvre.

   * `favorites.html` : Liste des favoris de l'utilisateur.

   * `src/` : Logique TypeScript (recherche, commentaires, gestion API).

   * `styles/` : Fichiers CSS organisés par page et gestion du responsive.
