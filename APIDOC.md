# Movie Recommendation Service API Documentation
This API provides endpoints for fetching movie genres and movies based on selected genres.

## Get a List of All Genres
**Request Format:** `/genres`

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns a list of all movie genres available in the movie recommendation service.

**Example Request:** `/genres`

**Example Response:**
["Action", "Comedy", "Drama"]

**Error Handling:**
  - If no gerne is available, a 404 error is returned with the message: "No genres available".


## Get Movies by Genre
**Request Format:** `/movies?genre={genreName}`

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Given a valid genre name, it returns a JSON array of movies belonging to that genre. The genre name should match one of the genres returned by the `/genres` endpoint.

**Example Request:** `/movies?genre=Action`

**Example Response:**
[
  {
    "title": "Avengers: Endgame",
    "genre": "Action",
    "year": 2019,
    "director": {
      "name": "Anthony and Joe Russo",
      "age": 50,
      "awards": ["MTV Movie Award"]
    }
  }
]

**Error Handling:**
  - If the `genre` query parameter is specified but no movies are found for that genre, a 404 error is returned with the message: "No movies found for genre: {genre}".

## Get instruction about the page
**Request Format:** `/info`

**Request Type:** GET

**Returned Data Format**: text/plain

**Description:** Returns an instruction: Welcome to the Movie Recommendation Service. Choose a genre to get started!

**Example Request:** `/info`

**Example Response:**
Welcome to the Movie Recommendation Service. Choose a genre to get started!


**Error Handling:**
- N/A


## General Error Handling for Undefined Routes

### Endpoint: All Undefined Routes

- **Path**: `*` (Catches all requests to undefined routes)
- **Method**: All (GET, POST, PUT, DELETE, etc.)

#### Description

This endpoint is a catch-all for any requests made to routes that are not explicitly defined in the API. It is designed to handle invalid or incorrect route requests by returning an error message.

#### Response

- **Status Code**: `400 Bad Request`
- **Response Type**: `text/plain`
- **Response Message**: "Invalid request"

#### Example

Any request to a route that does not exist in the API (for instance, `/nonexistentroute`) will trigger this response:

- **Request**: `GET /nonexistentroute`
- **Response**: 
  - Status Code: `400`
  - Body: "Invalid request"

#### Use Case

This catch-all endpoint is important for providing feedback to API clients when they make a request to a non-existent route, helping them to understand that the route they are trying to access is not part of the API.
