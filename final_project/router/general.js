const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        if (isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(400).json({ message: "User already exists!" });
        }
    }
    return res.status(400).json({ message: "Unable to register user. Provide username and password." });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Using JSON.stringify with 4-space indentation for neat output
    res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn]);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const keys = Object.keys(books);
    const filtered_books = [];

    keys.forEach((key) => {
        if (books[key].author === author) {
            filtered_books.push(books[key]);
        }
    });

    if (filtered_books.length > 0) {
        res.send(filtered_books);
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const keys = Object.keys(books);
    const filtered_books = [];

    keys.forEach((key) => {
        if (books[key].title === title) {
            filtered_books.push(books[key]);
        }
    });

    if (filtered_books.length > 0) {
        res.send(filtered_books);
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      // If the book exists, send the reviews (even if it's an empty {})
      return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

module.exports.general = public_users;
