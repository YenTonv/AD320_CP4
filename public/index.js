/**
 * Name: Yen Ton
 * Date: December 1, 2023
 * This JavaScript file implements the user interface for a Movie recommendation project.
 * It allows the user to choose a movie genre and then recommends movies to them.
 **/

"use strict";

/**
 * Initializes the application by loading genres and setting up event listeners when the document is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    loadGenres();
    setupRecommendationsButton();
    setupLoadMoviesButton();
    setupAddMovieButton();
});

/**
 * Loads genres from the server and populates the genre dropdown.
 */
async function loadGenres() {
    try {
        const response = await fetch('/genres');
        if (!response.ok) throw new Error('Network response was not ok');
        const genres = await response.json();
        populateGenresDropdown(genres);
    } catch (error) {
        displayError('Failed to load genres: ' + error.message);
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
 * Sets up the event listener for the recommendations button.
 */
function setupRecommendationsButton() {
    const recommendationsButton = document.getElementById('getRecommendations');
    if (recommendationsButton) {
        recommendationsButton.addEventListener('click', getMovies);
    } else {
        console.error('Button with ID `getRecommendations` not found.');
    }
}

/**
 * Sets up the event listener for the load movies button.
 */
function setupLoadMoviesButton() {
    document.getElementById('loadMovies').addEventListener('click', fetchMovies);
}

/**
 * Fetches movies from the server and displays them.
 */
async function fetchMovies() {
    try {
        const response = await fetch('/movies');
        await statusCheck(response);
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        handleError(error);
    }
}

/**
 * Fetches and displays movies based on the selected genre.
 */
async function getMovies() {
    const selectedGenre = document.getElementById('genreSelect').value;
    try {
        const response = await fetch(`/movies?genre=${encodeURIComponent(selectedGenre)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        handleError(error);
    }
}

/**
 * Displays the list of movies in the DOM.
 * @param {Array<Object>} movies - An array of movie objects to display. Each movie object includes title, year, and director details.
 */
function displayMovies(movies) {
    const moviesList = document.getElementById('movieList');
    if (!moviesList) {
        console.error('Element with ID `movieList` not found.');
        return;
    }
    moviesList.innerHTML = '';
    movies.forEach(movie => {
        const listItem = createMovieListItem(movie);
        moviesList.appendChild(listItem);
    });
}

/**
 * Creates a list item for a movie.
 * @param {Object} movie - A movie object containing title, year, and director details.
 * @return {HTMLElement} The created list item element.
 */
function createMovieListItem(movie) {
    const listItem = document.createElement('li');
    listItem.textContent = `${movie.title} (${movie.year})`;

    const directorBox = document.createElement('div');
    directorBox.className = 'director-info';
    directorBox.textContent = movie.director ? formatDirectorInfo(movie.director) : 'Director information not available';
    
    listItem.appendChild(directorBox);
    return listItem;
}

/**
 * Formats the director information for display.
 * @param {Object} director - The director object containing name, age, and awards.
 * @return {string} The formatted director information.
 */
function formatDirectorInfo(director) {
    return `Director: ${director.name}, Age: ${director.age}, Awards: ${director.awards.join(', ')}`;
}

/**
 * Checks the status of a network response.
 * @param {Response} response - The response to check.
 * @throws {Error} Throws an error if the response is not OK.
 */
function statusCheck(response) {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response;
}

/**
 * Handles errors by displaying them in the error container.
 * @param {Error} error - The error to handle.
 */
function handleError(error) {
    displayError(`Failed to load movies: ${error.message}`);
}

/**
 * Displays an error message in the error container.
 * @param {string} message - The error message to display.
 */
function displayError(message) {
    document.getElementById('errorContainer').textContent = message;
}

/**
 * Sets up the event listener for the add movie button.
 */
function setupAddMovieButton() {
    document.getElementById('addMovieButton').addEventListener('click', () => {
        const movieData = {
            title: document.getElementById('movieTitle').value,
            genre: document.getElementById('movieGenre').value,
            year: document.getElementById('movieYear').value
        };
        addMovie(movieData);
    });
}

/**
 * Adds a movie to the server.
 * @param {Object} movieData - The data of the movie to add.
 */
async function addMovie(movieData) {
    try {
        const response = await fetch('/addMovie', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(movieData)
        });

        const result = await response.text();
        document.getElementById('addMovieResult').textContent = result;
    } catch (error) {
        document.getElementById('addMovieResult').textContent = `Error: ${error.message}`;
    }
}
