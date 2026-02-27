/**
 * BOOK CLASS
 * Represents the data structure for a single Book entity.
 */
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.id = Date.now(); // Unique ID for internal tracking
    }
}

/**
 * UI CLASS
 * Handles all DOM manipulation, animations, and visual feedback.
 */
class UI {
    // Initiates the app state with a loading sequence
    static async init() {
        UI.renderSkeleton(3);
        const books = await Store.fetchBooks();
        UI.clearBookList();
        books.forEach(book => UI.addBookToList(book));
    }

    // Creates a "shimmer" effect during the mock data fetch
    static renderSkeleton(count) {
        const list = document.querySelector('#book-list');
        list.innerHTML = Array(count).fill(`
            <tr class="skeleton-row">
                <td><div class="skeleton-shimmer"></div></td>
                <td><div class="skeleton-shimmer"></div></td>
                <td><div class="skeleton-shimmer"></div></td>
                <td><div class="skeleton-shimmer ms-auto"></div></td>
            </tr>
        `).join('');
    }

    static clearBookList() {
        document.querySelector('#book-list').innerHTML = '';
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.className = 'table-row-animate';
        
        row.innerHTML = `
            <td class="fw-semibold text-white">${book.title}</td>
            <td class="text-white-50">${book.author}</td>
            <td class="font-monospace text-accent small">${book.isbn}</td>
            <td class="text-end">
                <button data-id="${book.id}" class="btn btn-sm glass-btn-danger delete-btn">
                    Remove
                </button>
            </td>
        `;
        list.appendChild(row);
    }

    static removeBookFromUI(el) {
        const row = el.closest('tr');
        row.style.transform = 'translateX(20px)';
        row.style.opacity = '0';
        setTimeout(() => row.remove(), 300);
    }

    static showAlert(message, type = 'info') {
        const container = document.querySelector('#alert-container');
        const alertDiv = document.createElement('div');
        
        alertDiv.className = `glass-alert alert-${type} mb-2`;
        alertDiv.innerHTML = `<span class="small fw-bold text-uppercase">${message}</span>`;
        
        container.appendChild(alertDiv);

        // Auto-vanish sequence
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            alertDiv.style.transform = 'translateX(30px)';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }

    static clearFields() {
        ['#title', '#author', '#isbn'].forEach(id => document.querySelector(id).value = '');
    }
}

/**
 * STORE CLASS
 * Simulates a DB using LocalStorage with async/await wrappers.
 */
class Store {
    // Simulated DB "Fetch" with network latency
    static async fetchBooks() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const books = localStorage.getItem('books') 
                    ? JSON.parse(localStorage.getItem('books')) 
                    : Store.getMockData();
                resolve(books);
            }, 1000);
        });
    }

    static getMockData() {
        return [
            { id: 1, title: 'The Design of Everyday Things', author: 'Don Norman', isbn: '9780465050659' },
            { id: 2, title: 'Atomic Habits', author: 'James Clear', isbn: '9780735211292' }
        ];
    }

    static async saveBook(book) {
        const books = await Store.fetchBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static async deleteBook(id) {
        const books = await Store.fetchBooks();
        const filtered = books.filter(b => b.id != id);
        localStorage.setItem('books', JSON.stringify(filtered));
    }

    static async isDuplicate(isbn) {
        const books = await Store.fetchBooks();
        return books.some(b => b.isbn === isbn);
    }
}

/**
 * CORE LOGIC & EVENT HANDLERS
 */

// Load data on start
document.addEventListener('DOMContentLoaded', UI.init);

// Handle Form Submission
document.querySelector('#book-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.querySelector('#title').value.trim();
    const author = document.querySelector('#author').value.trim();
    const isbn = document.querySelector('#isbn').value.trim();

    // 1. Structural Validation
    if (!title || !author || !isbn) {
        UI.showAlert('Please fill in all fields', 'danger');
        return;
    }

    // 2. Business Logic: Duplicate ISBN Check
    const isDup = await Store.isDuplicate(isbn);
    if (isDup) {
        UI.showAlert(`ISBN ${isbn} is already in your list`, 'warning');
        return;
    }

    // 3. Execution Sequence
    const book = new Book(title, author, isbn);
    
    // Optimistic UI Update
    UI.addBookToList(book);
    UI.clearFields();
    UI.showAlert('Book cataloged successfully', 'success');

    // Persistence
    await Store.saveBook(book);
});

// Handle Deletion
document.querySelector('#book-list').addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.getAttribute('data-id');
        
        UI.removeBookFromUI(e.target);
        await Store.deleteBook(id);
        UI.showAlert('Book removed from archive', 'success');
    }
});