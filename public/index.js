/**
 * Name: Yen Ton
 * Date: December 1, 2023
 * This JavaScript file implements the user interface for a Movie recommendation project.
 * It allows the user to choose a movie genre and then recommends movies to them.
 **/

"use strict";

/**
 * Initializes the genre loading and sets up event listeners when the document is ready.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    loadGenres();
    const recommendationsButton = document.getElementById('getRecommendations');
    if (recommendationsButton) {
        recommendationsButton.addEventListener('click', getMovies);
    } else {
        console.error('Button with ID `getRecommendations` not found.');
    }
});

/**
 * Loads genres from the server and populates the genre dropdown.
 */
async function loadGenres() {
    try {
        const response = await fetch('/genres');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const genres = await response.json();
        populateGenresDropdown(genres);
    } catch (error) {
        document.getElementById('error').textContent = 'Failed to load genres: ' + error.message;
    }
}

/**
 * Populates the genre dropdown with options.
 * @param {Array<string>} genres - An array of genres to populate the dropdown.
 */
function populateGenresDropdown(genres) {
    const select = document.getElementById('genreSelect');
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        select.appendChild(option);
    });
}

/**
 * Fetches and displays movies based on the selected genre.
 */
async function getMovies() {
    const genreSelect = document.getElementById('genreSelect');
    const selectedGenre = genreSelect.value;
    try {
        const response = await fetch(`/movies?genre=${encodeURIComponent(selectedGenre)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        document.getElementById('error').textContent = 'Failed to load movies: ' + error.message;
    }
}

/**
 * Displays the list of movies in the DOM, including director details.
 * Each movie is listed with its title and year, followed by a smaller box containing the director's name, age, and awards.
 * If the director information is not available, a default message is displayed.
 * @param {Array<Object>} movies - An array of movie objects to display. Each movie object includes title, year, and director details.
 */
function displayMovies(movies) {
    const moviesList = document.getElementById('movieList');
    if (!moviesList) {
        console.error('Element with ID `movieList` not found.');
        return;
    }
    moviesList.innerHTML = ''; // Clear existing movies
    movies.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.textContent = `${movie.title} (${movie.year})`;

        const directorBox = document.createElement('div');
        directorBox.className = 'director-info';
        const directorInfo = movie.director ? `Director: ${movie.director.name}, Age: ${movie.director.age}, Awards: ${movie.director.awards.join(', ')}` : 'Director information not available';
        directorBox.textContent = directorInfo;

        listItem.appendChild(directorBox);
        moviesList.appendChild(listItem);
    });
}
