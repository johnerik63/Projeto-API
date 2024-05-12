const functions = require('firebase-functions');
const express = require('express');
const https = require('https');
const app = express();

function getCurrencyData(currency) {
    return new Promise((resolve, reject) => {
        https.get(`https://economia.awesomeapi.com.br/last/${currency}-BRL`, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });

        }).on('error', (err) => {
            reject(err);
        });
    });
}

app.get('/:currency', async (req, res) => {
    try {
        const currencyData = await getCurrencyData(req.params.currency.toUpperCase());
        res.json({[req.params.currency]: currencyData});
    } catch (err) {
        res.status(500).send(err.toString());
    }
});

exports.app = functions.https.onRequest(app);
