const apiKey = "8cce907e"; // OMDB API Key
const searchBar = document.getElementById("searchBar"); // Search bar input
const searchResults = document.getElementById("searchResults"); // Results container

let currentPage = 1; // Tracks the current page
let totalResults = 0; // Total results from API
const resultsPerPage = 10; // Results per page

// Event listener for search input
searchBar.addEventListener("input", async () => {
  const query = searchBar.value.trim();
  if (query.length > 2) {
    currentPage = 1; // Reset to the first page
    await fetchMovies(query, currentPage); // Fetch movies
  } else {
    searchResults.innerHTML = ""; // Clear results
  }
});

// Fetch movies with pagination
async function fetchMovies(query, page) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}&page=${page}`);
  const data = await response.json();

  if (data.Search) {
    totalResults = parseInt(data.totalResults, 10); // Store total results
    displayMovies(data.Search); // Show results
    displayPagination(query); // Show pagination
  } else {
    searchResults.innerHTML = `<p class="text-center">No results found.</p>`;
  }
}

// Display movies
function displayMovies(movies) {
  searchResults.innerHTML = ""; // Clear previous results
  movies.forEach((movie) => {
    const movieRow = document.createElement("div");
    movieRow.classList.add("row", "movie-row", "align-items-center", "border", "rounded", "mb-3", "p-3", "bg-dark", "text-white");

    movieRow.innerHTML = `
      <div class="poster col-12 col-sm-4 col-md-3 text-center mb-3 mb-sm-0">
        <img src="${movie.Poster}" alt="${movie.Title}" class="img-fluid rounded" style="width: 150px; height: auto;">
      </div>
      <div class="info col-12 col-sm-5 col-md-6 text-center text-sm-start">
        <h5>${movie.Title}</h5>
        <p><strong>Year:</strong> ${movie.Year}</p>
      </div>
      <div class="actions col-12 col-sm-3 d-flex justify-content-center justify-content-sm-end gap-2">
        <button class="btn btn-success btn-sm add-favorites-btn">Add to Favorites</button>
        <a href="movie.html?id=${movie.imdbID}" class="btn btn-primary btn-sm">Details</a>
      </div>
    `;
    searchResults.appendChild(movieRow);

    // Adjust alignment for medium screens
    adjustAlignmentForMediumScreens(movieRow);

    // Add event listener for "Add to Favorites"
    const addToFavoritesBtn = movieRow.querySelector(".add-favorites-btn");
    addToFavoritesBtn.addEventListener("click", () => addToFavorites(movie));
  });
}

// Function to add a movie to favorites
function addToFavorites(movie) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.some(fav => fav.imdbID === movie.imdbID)) {
    favorites.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Added to favorites!");
  } else {
    alert("Already in favorites.");
  }
}

// Pagination controls
function displayPagination(query) {
  const pagination = document.createElement("div");
  pagination.className = " d-flex justify-content-center mt-4";

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Previous Button
  const prevBtn = document.createElement("button");
  prevBtn.className = "btn btn-info me-4";
  prevBtn.innerText = "Previous";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchMovies(query, currentPage);
      scrollToTop(); // Scroll to the top after fetching
    }
  });
  pagination.appendChild(prevBtn);

  // Next Button
  const nextBtn = document.createElement("button");
  nextBtn.className = "btn btn-info";
  nextBtn.innerText = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchMovies(query, currentPage);
      scrollToTop(); // Scroll to the top after fetching
    }
  });
  pagination.appendChild(nextBtn);

  const existingPagination = document.getElementById("pagination");
  if (existingPagination) existingPagination.remove();

  pagination.id = "pagination";
  searchResults.parentElement.appendChild(pagination);
}

// Adjust alignment for medium screens dynamically
function adjustAlignmentForMediumScreens(rowElement) {
  const mediaQuery = window.matchMedia("(max-width: 992px) and (min-width: 768px)");

  function applyAlignment(event) {
    const info = rowElement.querySelector(".info");
    const actions = rowElement.querySelector(".actions");

    if (event.matches) {
      // Medium screens: Center align text and buttons
      info.classList.add("text-center");
      info.classList.remove("text-sm-start");
      actions.classList.add("justify-content-center");
      actions.classList.remove("justify-content-sm-end");
    } else {
      // Larger or smaller screens: Reset alignment
      info.classList.remove("text-center");
      info.classList.add("text-sm-start");
      actions.classList.remove("justify-content-center");
      actions.classList.add("justify-content-sm-end");
    }
  }

  // Apply alignment initially
  applyAlignment(mediaQuery);

  // Add event listener for screen size changes
  mediaQuery.addEventListener("change", applyAlignment);
}

// Scroll to the top of the search results
function scrollToTop() {
  const container = document.querySelector(".container"); // Adjust selector based on your layout
  container.scrollIntoView({ behavior: "smooth", block: "start" });
}
