const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session middleware configuration
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the session contains the authorization object
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify the JWT token
        // Use the same secret "access" used during the signing process in auth_users.js
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user; // Store user information in the request
                next(); // Proceed to the next middleware or route handler
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 5000;

// Routing
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port " + PORT));