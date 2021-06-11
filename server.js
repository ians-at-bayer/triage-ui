const express = require('express');
const path = require('path');
const app = express();

const isNP = process.argv[2] === 'isNP';

//There is no PROD currently
if (isNP) {
    //NP
    app.use('/support-triage-manager', express.static(path.join(__dirname)));

    app.get('/support-triage-manager/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    app.listen(8080);
} else {
    //local
    app.use('/support-triage-manager', express.static(path.join(__dirname, 'build')));

    app.get('/support-triage-manager/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });

    app.listen(3000);
}
