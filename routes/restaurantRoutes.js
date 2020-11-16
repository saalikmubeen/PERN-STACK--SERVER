var express = require("express");
var router = new express.Router();

const db = require('../db');


router.get('/api/restaurants', async (req, res) => {
    try{
        // var data = await db.query(`SELECT * FROM restaurants`);

        var data = await db.query('SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*) as ratings, AVG(rating) AS avg_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id = reviews.restaurant_id');
    
    res.status(200).json({
        status: "success",
        results: data.rows.length,
        data: {restaurants: data.rows}
    })
    }catch(err){
        res.status(400).json({
            status: "error",
            error: err
        })
    }
})


router.get('/api/restaurants/:id', async (req, res) => {
    try{
        // var data = await db.query(`SELECT * FROM restaurants WHERE id = ${req.params.id}`);

        var data = await db.query('SELECT * FROM restaurants WHERE id = $1', [req.params.id]); //Parameterized query

        var reviews = await db.query('SELECT * FROM reviews WHERE restaurant_id = $1', [req.params.id]);

        var ratings = await db.query('SELECT restaurant_id, COUNT(*) AS number_of_ratings, TRUNC(AVG(rating), 1) AS avg_rating FROM reviews WHERE restaurant_id = $1 GROUP BY restaurant_id', [req.params.id]);
        
        res.status(200).json({
        status: "success",
        results: data.rows.length,
        data: {
            restaurants: data.rows[0],
            reviews: reviews.rows,
            ratings: ratings.rows[0]
        }
    })
    }catch(err){
        res.status(400).json({
            status: "error",
            error: err
        })
    }
})

router.post('/api/restaurants', async (req, res) => {
    try{
        var {name, location, price_range} = req.body;
        var data = await db.query('INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) RETURNING *', 
                                [name, location, price_range]);
        res.status(201).json({
            status: "success",
            results: data.rows.length,
            data: {restaurants: data.rows[0]}
        })
    }catch(err){
        res.status(400).json({
            status: "error",
            error: err
        })
    }
});


router.put('/api/restaurants/:id', async (req, res) => {
    try{
        var {name, location, price_range} = req.body;
        var data = await db.query('UPDATE restaurants SET name=$1, location=$2, price_range=$3 WHERE id=$4 RETURNING *', 
                                [name, location, price_range, req.params.id]);
        res.status(201).json({
            status: "success",
            results: data.rows.length,
            data: {restaurants: data.rows[0]}
        })
    }catch(err){
        res.status(400).json({
            status: "error",
            error: err
        })
    }
});


router.delete('/api/restaurants/:id', async (req, res) => {
    try{

        var data = await db.query('DELETE FROM restaurants WHERE id = $1', [req.params.id]);
        res.status(204).json({
            status: "success"
        })
    }catch(err){
        res.status(400).json({
            status: "error",
            error: err
        })
    }
});

router.post('/api/restaurants/:id/reviews', async (req, res) => {
      try{
        var {author, review, rating} = req.body;
        var data = await db.query('INSERT INTO reviews (author, review, rating, restaurant_id) VALUES ($1, $2, $3, $4) RETURNING *', 
                                        [author, review, rating, req.params.id]);
        console.log(data);
        res.status(201).json({
            status: "success",
            results: data.rows.length,
            data: {review: data.rows[0]}
        })
    }catch(err){
        res.status(400).json({
            status: "error",
            error: err
        })
    }
});


module.exports = router;