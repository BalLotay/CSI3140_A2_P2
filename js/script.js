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