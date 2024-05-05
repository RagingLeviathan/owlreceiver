const express = require('express');
const crypto = require('crypto');

const app = express();

// Replace these with your actual values
const CLIENT_ID = process.env.CONSUMER_KEY;
const CLIENT_SECRET = process.env.CONSUMER_SECRET;
const REDIRECT_URI = 'https://owlreceiver.onrender.com:3000/callback';

// Endpoint to initiate the authorization process
app.get('/authorize', (req, res) => {
    const state = crypto.randomBytes(16).toString('hex');
    // Construct the authorization URL
    const authorizationUrl = `https://www.tumblr.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=basic&state=${state}&redirect_uri=${REDIRECT_URI}`;

    // Redirect the user to the authorization URL
    res.redirect(authorizationUrl);
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});