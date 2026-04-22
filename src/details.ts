import { API_KEY, BASE_URL, IMAGE_BASE_URL } from './config.js';

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const type = urlParams.get('type') || 'movie'; 

