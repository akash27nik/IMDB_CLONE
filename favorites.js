function displayFavorites() {
  const favoritesList = document.getElementById("favorites-list"); // Container for favorite movies
  const favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || []; // Get favorite movies from localStorage

  favoritesList.innerHTML = ""; // Clear the list before adding items

  // Check if there are no favorite movies
  if (favoriteMovies.length === 0) {
    favoritesList.innerHTML = '<p class="text-center text-white">No favorite movies added yet.</p>';
    return;
  }

  // Reverse array to display the most recently added first
  const reversedMovies = [...favoriteMovies].reverse();

  // Render each favorite movie
  reversedMovies.forEach((movie) => {
    if (!movie || !movie.Title || !movie.Poster || !movie.Year || !movie.imdbID) return;

    const movieRow = document.createElement("div");
    movieRow.classList.add(
      "row",
      "movie-row",
      "align-items-center",
      "border",
      "rounded",
      "mb-3",
      "p-3",
      "bg-dark",
      "text-white"
    );

    movieRow.innerHTML = `
      <div class="poster col-12 col-sm-4 col-md-3 text-center mb-3 mb-sm-0">
        <img src="${movie.Poster}" alt="${movie.Title}" class="img-fluid rounded" style="width: 150px; height: auto;">
      </div>
      <div class="info col-12 col-sm-5 col-md-6 text-center text-sm-start">
        <h5>${movie.Title}</h5>
        <p><strong>Year:</strong> ${movie.Year}</p>
      </div>
      <div class="actions col-12 col-sm-3 d-flex justify-content-center justify-content-sm-end gap-2">
        <a href="movie.html?id=${movie.imdbID}" class="btn btn-primary btn-sm">Details</a>
        <button class="btn btn-danger btn-sm" onclick="removeFromFavorites('${movie.imdbID}')">Remove</button>
      </div>
    `;

    favoritesList.appendChild(movieRow);
  });
}

// Function to remove a movie from favorites
function removeFromFavorites(imdbID) {
  const favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];
  const updatedFavorites = favoriteMovies.filter((movie) => movie.imdbID !== imdbID);
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Update localStorage
  displayFavorites(); // Refresh the displayed favorites list
}

// Initial call to display the favorites on page load
displayFavorites();
