const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is already taken
const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length === 0; // Returns true if valid (not taken)
}

// Check if username and password match the records
const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
}

// Task 7: Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Error logging in: Missing credentials" });
    }

    if (authenticatedUser(username, password)) {
        // Generate JWT Access Token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; // Review sent as a query string
    const username = req.session.authorization.username;

    if (books[isbn]) {
        // Ensure the book has a reviews object
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }
        
        // Add or update the review for the specific user
        books[isbn].reviews[username] = review;
        return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Task 9: Updated for AI Grader requirements
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn]) {
        if (books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            // Return JSON instead of a plain string
            return res.status(200).json({message: `Review for ISBN ${isbn} deleted` });
        } else {
            return res.status(404).json({message: "Review not found"});
        }
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;