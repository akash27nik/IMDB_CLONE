const movieDetails = document.getElementById("movieDetails"); // Container for displaying movie details
const addToFavoritesButton = document.getElementById("addToFavorites"); // "Add to Favorites" button
const apiKey = "8cce907e"; // OMDB API Key
const urlParams = new URLSearchParams(window.location.search); // Parse URL parameters
const movieID = urlParams.get("id"); // Extract `imdbID` from URL parameters

// Function to fetch and display movie details
async function loadMovieDetails() {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movieID}`);
  const movie = await response.json(); // Parse the movie data

  // Render the movie details
  movieDetails.innerHTML = `
    <div class="row bg-dark text-white rounded p-4">
      <div class="col-12 col-sm-4 text-center mb-3 mb-sm-0">
        <img src="${movie.Poster}" alt="${movie.Title}" class="movie-row img-fluid rounded">
      </div>
      <div class="col-12 col-sm-8 text-center text-sm-start">
        <h2>${movie.Title}</h2>
        <p><strong>Year:</strong> ${movie.Year}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Actors:</strong> ${movie.Actors}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
      </div>
    </div>
  `;

  // Store movie data for "Add to Favorites" functionality
  addToFavoritesButton.dataset.movie = JSON.stringify(movie);

  // Add event listener to the "Add to Favorites" button
  addToFavoritesButton.addEventListener("click", () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.some(fav => fav.imdbID === movie.imdbID)) {
      favorites.push(movie);
      localStorage.setItem("favorites", JSON.stringify(favorites)); // Save to localStorage
      alert("Added to Favorites!");
    } else {
      alert("Movie is already in Favorites!");
    }
  });
}

// Initial call to load movie details on page load
loadMovieDetails();
