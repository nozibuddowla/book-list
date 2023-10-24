// Get the UI elements
const form = document.querySelector('#book-form');
const bookList = document.querySelector('#book-list');
const deleteList = document.querySelector('#del-list-btn');
const input = document.getElementById('myInput');

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

        row.classList.add('book-active');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.publisher}</td>
        <td class="delete-btn"><a data-id="${book.id}" class='btn btn-danger btn-sm delete' href="#">X</a></td>
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
        const getBooks = localStorage.getItem('books');

        !getBooks ? books = [] : books = JSON.parse(localStorage.getItem('books'));

        !books.length && (deleteList.disabled = true);

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        book.id = generateUniqueId(); // Implement a function to generate unique IDs
        books.push(book);
        deleteList.disabled = false;
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook (id) {
        const books = Store.getBooks();

        const index = books.findIndex(book => book.id === id);

        if (index !== -1) {
            books.splice(index, 1);
            books.length && (deleteList.disabled = true);
            localStorage.setItem('books', JSON.stringify(books));
        } 
    }
}


// Add Event Listener
form.addEventListener('submit', newBook);
bookList.addEventListener('click', removeBook);
document.addEventListener('DOMContentLoaded', UI.displayBooks);
deleteList.addEventListener('click', deleteBooksList);


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
    if (e.target.classList.contains('delete') && e.target.hasAttribute('href')) {
        const id = e.target.getAttribute('data-id');
        UI.deleteBook(e.target);
        Store.removeBook(id);
    }
}

function deleteBooksList() {
    bookList.parentNode.removeChild(bookList);
    deleteList.disabled = true;
    localStorage.removeItem('books');
}

function searchBook() {
    const filter = input.value.toUpperCase();
    const books = bookList.getElementsByClassName('book-active');

    for (let index = 0; index < books.length; index++) {
        const title = books[index].getElementsByTagName('td')[0];
        const author = books[index].getElementsByTagName('td')[1];
        const publisher = books[index].getElementsByTagName('td')[2];

        if (title || author || publisher) {
            const titleValue = title.textContent || title.innerText;
            const authorValue = author.textContent || author.innerText;
            const publisherValue = publisher.textContent || publisher.innerText;

            if (filterBook(titleValue, filter) || filterBook(authorValue, filter) || filterBook(publisherValue, filter)) {
                books[index].style.display = '';
            } else {
                books[index].style.display = 'none';
            }
        }
        
    }
}

const filterBook = (param, filter) => {
    return param.toUpperCase().indexOf(filter) > - 1;
}

function generateUniqueId() {
    // Implement your logic to generate a unique ID here
    // This can be done using a random number generator or a timestamp-based approach
    return Math.random().toString(36).substr(2, 9); // Example of generating a random string
}
