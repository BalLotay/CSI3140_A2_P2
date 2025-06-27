let modal = document.querySelector('dialog');
let editButton = document.querySelector('.edit-button');
let addButton = document.querySelector('.add-movie-button');
let cancelEditButton = document.querySelector('.cancel-edit-button');
console.log(addButton);

editButton.addEventListener('click', () => {
    console.log('Edit button clicked');
    modal.showModal();
});

cancelEditButton.addEventListener('click', () => {
    console.log('Cancel button clicked');
    modal.close();
});

function addMovie(event) {
    //Prevent page from reloading to default values
    event.preventDefault();

    //Get values from input fields
    const title = document.getElementById('movie').value;
    const genre = document.getElementById('genre').value;
    const rating = document.querySelector('input[name="rate"]:checked').value; //Get the selected rating value
    
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
    
    renderMovies();
}

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
        
        buttons.addEventListener('click', function(event) { 
            if (event.target.classList.contains('delete-button')) {
                // Delete movie from the array
                const index = movies.indexOf(entry);
                movies.splice(index, 1);
                renderMovies();
            } else if (event.target.classList.contains('mark-watched-button')) {
                // Mark movie as watched
                entry.watched = !entry.watched;
                renderMovies();
            } else if (event.target.classList.contains('edit-button')) {
                // Edit movie
                alert("Editing movie: " + entry.title);
            }
        });
    });
}

function start() {
    // Add event listener to the add movie form
    var am = document.getElementById('add-movie-form');
    am.addEventListener('submit', addMovie, false);

    // Add event listener to sort by drop down
    var sb = document.getElementById('sort-by');
    sb.addEventListener('change' , sortMovies, false);

    // Add event listener to Filter by genre drop down
    var fbg = document.getElementById('filter-genre');
    fbg.addEventListener('change', renderMovies, false);

    // Add event listener to 

    renderMovies();
}

function sortMovies() {
    const sortBy = document.getElementById('sort-by').value;
    if (sortBy === 'none') {
        movies.sort((a, b) => a.id - b.id); // Default sort by ID
    }
    else if (sortBy === 'title') {
        movies.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'genre') {
        movies.sort((a, b) => a.genre.localeCompare(b.genre));
    }
    renderMovies();
}

const movies = [
    {
        id: 1,
        title: "Inception",
        genre: "Sci-Fi",
        rating: 4,
        watched: false
    }
]

window.addEventListener('load', start, false);