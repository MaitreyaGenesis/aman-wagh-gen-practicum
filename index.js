require('dotenv').config();

const express = require('express');
const axios = require('axios');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;
const OBJECT_API_NAME = '2-230050247';

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};


//ROUTE 1 - Homepage
app.get('/', async (req, res) => {

    try {

        const response = await axios.get(
            `https://api.hubapi.com/crm/v3/objects/${OBJECT_API_NAME}`,
            {
                headers,
                params: {
                    properties: 'book_name,author,price'
                }
            }
        );

        const records = response.data.results;

        res.render('homepage', {
            title: 'Books Homepage',
            records
        });

    } catch (error) {

        console.error('GET ERROR');
        console.error(error.response?.data || error.message);

        res.send(
            JSON.stringify(
                error.response?.data || error.message,
                null,
                2
            )
        );
    }
});


//ROUTE 2 - Render Form
app.get('/update-cobj', (req, res) => {

    res.render('updates', {
        title:
            'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });

});


//ROUTE 3 - Create Book Record
app.post('/update-cobj', async (req, res) => {

    try {

        const newRecord = {
            properties: {
                book_name: req.body.book_name,
                author: req.body.author,
                price: req.body.price
            }
        };

        await axios.post(
            `https://api.hubapi.com/crm/v3/objects/${OBJECT_API_NAME}`,
            newRecord,
            { headers }
        );

        res.redirect('/');

    } catch (error) {

        console.error('POST ERROR');
        console.error(error.response?.data || error.message);

        res.send(
            JSON.stringify(
                error.response?.data || error.message,
                null,
                2
            )
        );
    }
});

//TEST ROUTE
app.get('/test', async (req, res) => {

    try {

        const response = await axios.get(
            'https://api.hubapi.com/crm/v3/schemas',
            { headers }
        );

        res.json(response.data);

    } catch (error) {

        console.error(error.response?.data || error.message);

        res.send(
            JSON.stringify(
                error.response?.data || error.message,
                null,
                2
            )
        );
    }
});


//LOCALHOST
app.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});