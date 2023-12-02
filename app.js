/**
  Name: Yen Ton
  Date: December 1, 2023
  This app.js file sets up a Node.js server using Express to handle HTTP requests, 
  serving a list of movies and genres and providing functionality to filter movies by genre.
**/

const express = require('express'); 
const cors = require('cors'); 
const app = express(); 
const port = process.env.PORT || 3000; 

// Enable CORS for all routes
app.use(cors());

const movies = [
    // Action Movies
    { title: 'Avengers: Endgame', genre: 'Action', year: 2019 },
    { title: 'Mad Max: Fury Road', genre: 'Action', year: 2015 },
    { title: 'John Wick', genre: 'Action', year: 2014 },
    { title: 'The Dark Knight', genre: 'Action', year: 2008 },

    // Comedy Movies
    { title: 'The Grand Budapest Hotel', genre: 'Comedy', year: 2014 },
    { title: 'Superbad', genre: 'Comedy', year: 2007 },
    { title: 'Borat', genre: 'Comedy', year: 2006 },
    { title: 'Anchorman', genre: 'Comedy', year: 2004 },

    // Drama Movies
    { title: 'Parasite', genre: 'Drama', year: 2019 },
    { title: 'The Shawshank Redemption', genre: 'Drama', year: 1994 },
    { title: 'Forrest Gump', genre: 'Drama', year: 1994 },
    { title: 'Schindler’s List', genre: 'Drama', year: 1993 }

];

const directors = {
    'Avengers: Endgame': { 
        name: 'Anthony and Joe Russo', 
        age: 50, 
        awards: ['MTV Movie Award'] },
    'Mad Max: Fury Road': { 
        name: 'George Miller', 
        age: 77, 
        awards: ['Academy Award'] },
    'John Wick': { 
        name: 'Chad Stahelski', 
        age: 53, 
        awards: ['None'] },
    'The Dark Knight': { 
        name: 'Christopher Nolan', 
        age: 52, 
        awards: ['Saturn Award'] },
    'The Grand Budapest Hotel': { 
        name: 'Wes Anderson', 
        age: 52, 
        awards: ['Silver Bear Award'] },  
    'Superbad': { 
        name: 'Greg Mottola', 
        age: 57, 
        awards: ['None'] },  
    'Borat': { 
        name: 'Larry Charles', 
        age: 66, 
        awards: ['AFI Movie of the Year Award'] },  
    'Anchorman': { 
        name: 'Adam McKay', 
        age: 54, 
        awards: ['BAFTA Award'] },
    'Parasite': { 
        name: 'Bong Joon-ho', 
        age: 53,  
        awards: ['Academy Award for Best Picture', 'Academy Award for Best Director'] 
    },
    'The Shawshank Redemption': { 
        name: 'Frank Darabont', 
        age: 63,  
        awards: ['Nominated for Academy Award for Best Picture'] 
    },
    'Forrest Gump': { 
        name: 'Robert Zemeckis', 
        age: 71, 
        awards: ['Academy Award for Best Director']  
    },
    'Schindler’s List': { 
        name: 'Steven Spielberg', 
        age: 76, 
        awards: ['Academy Award for Best Director', 'Academy Award for Best Picture']  
    }  
};

/**
 * Extracts unique genres from the movies array.
 * @returns {Array<string>} Array of unique genres.
 */
const genres = [...new Set(movies.map(movie => movie.genre))];

app.use(express.static('public'));

/**
 * GET endpoint for retrieving a list of genres.
 * @param {Object} req - doesn't expect any parameter
 * @param {Object} res - Movie genres
 */
app.get('/genres', (req, res) => {
    if (genres.length === 0) {
        // No genres available
        res.status(404).send('No genres available');
    } else {
        res.type('application/json'); 
        res.send(genres); // Send genres data
    }
});

/**
 * GET endpoint for retrieving movies filtered by genre.
 * @param {Object} req - doesn't expect any parameter
 * @param {Object} res - movies information
 */
app.get('/movies', (req, res) => {
    const genre = req.query.genre;
    
    if (genre) {
        // Filter movies by the specified genre
        const filteredMovies = movies.filter(movie => movie.genre === genre);

        if (filteredMovies.length === 0) {
            // No movies found for the specified genre
            res.status(404).send(`No movies found for genre: ${genre}`);
        } else {
            // Adding director details to each filtered movie
            const moviesWithDirectors = filteredMovies.map(movie => ({
                ...movie, 
                director: directors[movie.title] || { name: 'Unknown', age: 'Unknown', awards: ['Unknown'] }
            }));

            res.type('application/json');
            res.send(moviesWithDirectors);
        }
    } else {
        // No genre is specified, return all movies with directors
        const moviesWithDirectors = movies.map(movie => ({
            ...movie, 
            director: directors[movie.title] || { name: 'Unknown', age: 'Unknown', awards: ['Unknown'] }
        }));

        res.type('application/json');
        res.send(moviesWithDirectors);
    }
});

/**
 * POST endpoint for adding a new movie.
 * This endpoint expects a request body with a movie object containing title, genre, and year.
 * If any of these fields are missing, it sends a 400 status code.
 * On successful addition of the movie, it sends a 201 status code.
 * 
 * @param {Object} req - Express request object containing the movie data in the body.
 * @param {Object} res - Express response object used for sending responses.
 */
app.post('/addMovie', express.json(), (req, res) => {
    const newMovie = req.body;
    if (newMovie.title && newMovie.genre && newMovie.year) {
        movies.push(newMovie);
        res.status(201).send('Movie added successfully');
    } else {
        res.status(400).send('Invalid movie data');
    }
});

/**
 * GET endpoint for basic information about the service.
 * @param {Object} req - doesn't expect any parameter
 * @param {Object} res - instructional text
 */
app.get('/info', (req, res) => {
    res.type('text/plain');
    res.send('Welcome to the Movie Recommendation Service. Choose a genre to get started!');
});


/**
 * Default route handler for invalid requests.
 * @param {Object} req - doesn't expect any parameter
 * @param {Object} res - error text
 */
app.all('*', (req, res) => {
    res.status(400).send('Invalid request'); 
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
