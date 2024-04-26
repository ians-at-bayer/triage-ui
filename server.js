const express = require('express');
const path = require('path');
const app = express();

app.use('/support-triage-manager', express.static(path.join(__dirname)));

app.get('/support-triage-manager/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8080);