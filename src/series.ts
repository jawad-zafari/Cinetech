import { API_KEY, BASE_URL, IMAGE_BASE_URL } from './config.js';

// pagination
let currentPage = 1;
let totalPages = 1;

// Éléments du DOM
const grid = document.getElementById('catalog-grid');
const btnPrev = document.getElementById('btn-prev') as HTMLButtonElement;
const btnNext = document.getElementById('btn-next') as HTMLButtonElement;
const pageIndicator = document.getElementById('page-indicator');

