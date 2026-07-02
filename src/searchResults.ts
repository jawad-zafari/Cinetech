import { API_KEY, BASE_URL, IMAGE_BASE_URL } from './config.js';

// Récupération du terme recherché depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q');

const searchTitle = document.getElementById('search-title');
const resultsGrid = document.getElementById('search-results-grid');
const noResultsMsg = document.getElementById('no-results-message');

