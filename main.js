// Book class: Represents a Book
class Book {
    constructor(id, title, author, publisher) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.publisher = publisher;
    }
}

class UI {
    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.publisher}</td>
        <td><a data-id="${book.id}" class='btn btn-danger btn-sm delete' href="#">X</a></td>
        `;
        list.appendChild(row);
    }

    static clearFields() {
        document.querySelector('#book-form').reset();
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(book => {
            UI.addBookToList(book);
        });
    }
}

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        book.id = generateUniqueId(); // Implement a function to generate unique IDs
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook (id) {
        const books = Store.getBooks();

        const index = books.findIndex(book => book.id === id);

        if (index !== -1) {
            books.splice(index, 1);
            localStorage.setItem('books', JSON.stringify(books));
        } 
    }
}

// Get the UI elements
let form = document.querySelector('#book-form');
let bookList = document.querySelector('#book-list');

// Add Event Listener
form.addEventListener('submit', newBook);
bookList.addEventListener('click', removeBook);
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Define function
function newBook(e) {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const publisher = document.querySelector('#publisher').value;

    // Instantiate book
    const book = new Book(generateUniqueId(), title, author, publisher);

    // Add book to UI
    UI.addBookToList(book);

    // Clear Fields
    UI.clearFields();

    // Save book to local Storage
    Store.addBook(book);
}

function removeBook(e) {
    if (e.target.classList.contains('delete')) {
        const id = e.target.getAttribute('data-id');
        UI.deleteBook(e.target);
        Store.removeBook(id);
    }
}

function generateUniqueId() {
    // Implement your logic to generate a unique ID here
    // This can be done using a random number generator or a timestamp-based approach
    return Math.random().toString(36).substr(2, 9); // Example of generating a random string
}
