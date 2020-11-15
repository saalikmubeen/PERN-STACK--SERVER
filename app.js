var dotenv = require('dotenv');
dotenv.config({path: './config.env'});

var express = require('express');
var app = express();

app.use(express.json());

var restaurantRoutes = require("./routes/restaurantRoutes");

app.use(restaurantRoutes);



var PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`STARTING SERVER AT PORT ${PORT}...!`);
})