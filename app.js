var dotenv = require('dotenv');
dotenv.config({path: './config.env'});

var express = require('express');
var app = express();

const db = require('./db');

app.get('/:id', async (req, res) => {
    var data = await db.query(`SELECT * FROM restaurants WHERE id = ${req.params.id}`);
    res.json({data});
})



var PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`STARTING SERVER AT PORT ${PORT}...!`);
})