var express = require("express");
var router = new express.Router();

const db = require('../db');


router.get('/api/restaurants', async (req, res) => {
    try{
        var data = await db.query(`SELECT * FROM restaurants`);
    
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
    
        res.status(200).json({
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


module.exports = router;