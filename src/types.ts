export interface Movie {
    id: number;
    title: string; //films
    name?: string;  //séries
    poster_path: string;
    overview: string;
    release_date?: string; //  films
    first_air_date?: string; // séries
    backdrop_path?: string; 
}