const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const app = express();
const session = require('express-session');


// Replace these with your actual values
const CLIENT_ID = process.env.CONSUMER_KEY;
const CLIENT_SECRET = process.env.CONSUMER_SECRET;
const REDIRECT_URI = 'https://owlreceiver.onrender.com/callback';

// Endpoint to initiate the authorization process
app.get('/authorize', (req, res) => {
    const state = crypto.randomBytes(16).toString('hex');
    // Construct the authorization URL
    const authorizationUrl = `https://www.tumblr.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=basic&state=${state}&redirect_uri=${REDIRECT_URI}`;

    // Redirect the user to the authorization URL
    res.redirect(authorizationUrl);
});

// Callback endpoint to handle the authorization response
app.get('/callback', async (req, res) => {
    try {
        const code = req.query.code;

        console.log('authorization code got is: ', code);

        accessToken = await exchangeCodeForToken(code);

        console.log('accesstoken obtained is:' , accessToken);

       // const webhookUrl = 'https://discord.com/api/webhooks/1236663645786603611/eK41zlrFrjcemT5vuHQ08il2PKfUCLFVp9frLz8kMMsSXgIw0LpVgJ77UaqqDQQ1AX7a';
       const webhookUrl = 'https://78.108.218.15:25288/callback';
        await axios.post(webhookUrl, { content: `Access token: ${accessToken}` });

        res.send('Authorization successful! You can now use your bot.');
    } catch (error) {
        console.error('Error in /callback:', error);
        res.status(500).send('An error occurred.');
    }
});

// Function to exchange authorization code for an access token
async function exchangeCodeForToken(code) {
    const tokenUrl = 'https://api.tumblr.com/v2/oauth2/token';

    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);

    console.log(params.toString());

    const response = await axios({
        method: 'post',
        url: tokenUrl,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: params
    });

    //const data = await response.json();
    const data = await response;
    console.log('we got this data from the exchange; ', data);
    return data.data.access_token;
}

app.get('/', (req, res) => {
    res.send('Hello, world! 🦉');
});


// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

