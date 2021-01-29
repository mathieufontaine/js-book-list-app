//* Book class
class Book {
  constructor(title, author, id) {
    this.title = title;
    this.author = author;
    this.id = id;
  }
}
//* UI class
class UI {
  static displayBooks() {
    const StoredBooks = [
      {
        title: "Book One",
        author: "John Doe",
        id: 123
      },
      {
        title: "Book Two",
        author: "Jane Doe",
        id: 323
      },
      {
        title: "Book Three",
        author: "Mathieu Doe",
        id: 143
      }
    ];
    const books = Store.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }
  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
     <td>${book.title}</td>
     <td>${book.author}</td>
     <td>${book.id}</td>
     <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
     `;
    list.appendChild(row);
  }
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }
  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#id").value = "";
  }
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    //* disappear after 3 secs
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
}

//* store class: handles storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(id) {
    const books = Store.getBooks();
    const filteredBooks = books.filter(book => book.id != id);
    localStorage.setItem("books", JSON.stringify(filteredBooks));
  }
}

//* Event: diplay books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//* Event: add book
document.querySelector("#book-form").addEventListener("submit", e => {
  e.preventDefault();
  //* get values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const id = document.querySelector("#id").value;

  //* validate fields
  if (title === "" || author === "" || id === "") {
    return UI.showAlert("You need to complete all fields", "danger");
  }

  //* instantiate book
  const book = new Book(title, author, id);

  //* add book to UI
  UI.addBookToList(book);

  //* add book to Store
  Store.addBook(book);

  //* show sucess message
  UI.showAlert("Book succefully added to the list", "success");

  //* clear fields
  UI.clearFields();
});

//* Event: remove book
document.querySelector("#book-list").addEventListener("click", e => {
  UI.deleteBook(e.target);
  //* delete from store
  Store.removeBook(e.target.parentElement.parentElement.children[2].innerText);
  //* show delete message
  UI.showAlert("Book succefully removed from the list", "info");
});
