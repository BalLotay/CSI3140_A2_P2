// Get the modal and cancel button elements
let modal = document.querySelector('dialog');
let cancelEditButton = document.querySelector('.cancel-edit-button');

// Add event listener to the cancel button to close the modal
cancelEditButton.addEventListener('click', () => {
    modal.close();
});

/**
 * Saves the current movies array to localStorage.
 */
function saveMovies() {
    localStorage.setItem('movies', JSON.stringify(movies));
}

/**
 * Loads the movies array from localStorage.
 * @returns {Array|null} The movies array if found and valid, otherwise null.
 */
function loadMovies() {
    const stored = localStorage.getItem('movies');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return null;
        }
    }
    return null;
}

/**
 * Handles the submission of the add movie form.
 * Adds a new movie to the movies array and updates storage and UI.
 * @param {Event} event - The form submission event.
 */
function handleAddMovies(event) {
    //Prevent page from reloading to default values
    event.preventDefault();

    //Get values from input fields
    const title = document.getElementById('movie').value;
    const genre = document.getElementById('genre').value;
    const rating = document.querySelector('input[name="rate"]:checked').value; //Get the selected rating value
    const ratings = document.querySelectorAll('input[name="rate"]');
    ratings.forEach(rating => {
        rating.checked = false; // Uncheck all rating stars after adding a movie
    });
    
    //Create a new movie object
    const newMovie = {
        id: movies.length + 1, // Have to redo to get unqiue IDs
        title: title,
        genre: genre,
        rating: rating,
        watched: false
    };

    //Add the new movie to the movies array
    movies.push(newMovie);
    saveMovies();
    renderMovies();
}

/**
 * Handles button clicks within the wishlist container.
 * Supports editing, deleting, and marking movies as watched.
 * @param {Event} event - The click event.
 */
function handleButtonClick(event) {
    //Prevent page from reloading to default values
    event.preventDefault();

    // Handle button clicks for adding movies
    if (event.target.tagName === 'BUTTON') {
        let movieCard = event.target.closest('.movie-card');
        let movieTitle = movieCard.querySelector('.movie-title').textContent;
        let index = movies.findIndex(movie => movie.title === movieTitle);       

        if (event.target.classList.contains('delete-button')) {
            // Delete movie
            movies.splice(index, 1);
            saveMovies();
            renderMovies();
        } else if (event.target.classList.contains('mark-watched-button')) {
            // Mark movie as watched
            movies[index].watched = !movies[index].watched; // Update the watched status
            saveMovies();
            renderMovies();
        } else if (event.target.classList.contains('edit-button')) {
            // Edit movie
            console.log("showing modal for editing movie: " + movieTitle);

            modal.showModal();

            document.getElementById('edit-movie').value = movieTitle; // Set the current title in the edit form
            document.getElementById('edit-genre').value = movies[index].genre; // Set the current genre in the edit form
            document.querySelector('input[name="edit-rate"][value="' + movies[index].rating + '"]').checked = true; // Set the current rating in the edit form
            document.getElementById('edit-movie-form').onsubmit = function(event) {
                // Prevent default form submission
                event.preventDefault();

                // Get updated values from the edit form
                const updatedTitle = document.getElementById('edit-movie').value;
                const updatedGenre = document.getElementById('edit-genre').value;
                const updatedRating = document.querySelector('input[name="edit-rate"]:checked').value;
                console.log("update rating:", updatedRating);
                

                // Update the movie in the array
                movies[index].title = updatedTitle;
                movies[index].genre = updatedGenre;
                movies[index].rating = parseInt(updatedRating, 10);

                saveMovies();
                modal.close(); // Close the modal after editing
                renderMovies(); // Re-render the movie list
            }
        }
    }
}

/**
 * Renders the list of movies in the wishlist container,
 * applying the current filter and clearing the form fields.
 */
function renderMovies() {
    const wishlistContainer = document.getElementById('wishlist-container');
    wishlistContainer.innerHTML = ''; // Clear existing content

    document.getElementById('movie').value = '';
    document.getElementById('genre').value = '';

    //Create movie cards for each movie in the array
    movies.forEach(entry => {
        // Check if the movie matches the filter criteria
        const filter = document.getElementById('filter-genre').value;
        if (filter !== 'none' && entry.genre !== filter) {
            return; // Skip movies that don't match the filter
        }
        
        let card = document.createElement('div');
        if (entry.watched) {
            card.className = 'movie-card watched';
        } else {
            card.className = 'movie-card';
        }

        let title = document.createElement('h3');
        title.className = 'movie-title';
        title.textContent = entry.title;

        let rating = document.createElement('p');
        rating.className = 'movie-rating';
        rating.textContent = '★ '.repeat(entry.rating) + ' ☆'.repeat(5 - entry.rating);

        let genre = document.createElement('p');
        genre.className = 'movie-genre';
        genre.textContent = entry.genre;

        let buttons = document.createElement('div');
        buttons.className = 'card-button-container';

        let editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.textContent = '✎';

        let watchedButton = document.createElement('button');
        watchedButton.className = 'mark-watched-button';
        watchedButton.textContent = '✓';

        let deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '🗑️';

        buttons.appendChild(editButton);
        buttons.appendChild(watchedButton);
        buttons.appendChild(deleteButton);

        card.appendChild(title);
        card.appendChild(rating);
        card.appendChild(genre);
        card.appendChild(buttons);
        wishlistContainer.appendChild(card);
    });
}

/**
 * Initializes event listeners and renders the initial movie list on page load.
 */
function start() {
    // Add event listener to the add movie form
    var am = document.getElementById('add-movie-form');
    am.addEventListener('submit', handleAddMovies, false);

    // Add event listener to sort by options
    const sortOptions = document.querySelectorAll('input[name="sort-by"]');
    sortOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedSort = document.querySelector('input[name="sort-by"]:checked').value;
            console.log('Selected sort option:', selectedSort);
            sortMovies(selectedSort);
            renderMovies();
        });
    });

    // Add event listener to Filter by genre drop down
    var fbg = document.getElementById('filter-genre');
    fbg.addEventListener('change', renderMovies, false);

    // Add event listener to the wishlist container for button clicks
    const wishlistContainer = document.getElementById('wishlist-container');
    wishlistContainer.addEventListener('click', handleButtonClick, false);
    renderMovies();
}

/**
 * Sorts the movies array based on the given sort type.
 * @param {string} sortType - The type of sorting ('title', 'rating', or default).
 */
function sortMovies(sortType) {
    if (!sortType || sortType === 'none') {
        movies.sort((a, b) => a.id - b.id); // Default sort by ID
    }
    else if (sortType === 'title') {
        movies.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === 'rating') {
        movies.sort((a, b) => b.rating - a.rating);
    }
}

let movies = loadMovies();
if (!movies) {
    movies = [];
    saveMovies();
}

window.addEventListener('load', start, false);