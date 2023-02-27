'use strict!'
function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}
function TrendingMovie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const server = express();
server.use(cors());
const PORT = 3000;
require('dotenv').config();

// Routes
server.get('/', homeHandler);
server.get('/favorite', favoriteHandler)
server.get('error', serverErrorHandler)
server.get('/trending', trendingHandler)
server.get('/search', searchHandler)
server.get('*', defaultHandler)

// Handlers functions
function homeHandler(req, res) {
    const movieData = require('./Movie Data/data.json')
    const spiderMan = new Movie(movieData.title, movieData.poster_path, movieData.overview);
    res.send(spiderMan);
}
function favoriteHandler(req, res) {
    res.send("Welcome to favorite page");
}
function serverErrorHandler(req, res) {
    res.status(500).send("internal server error");
}
function trendingHandler(req, res) {
    const api_key = process.env.api_key;
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${api_key}`;
    axios.get(url)
        .then((result) => {
            const arr = result.data.results;
            const trendingMovies = arr.map(function (movie) {
                const trendingMovie = new TrendingMovie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
                return trendingMovie;
            })
            res.send(trendingMovies)
        })
        .catch((err) => {
            console.log("sorry", err);
            res.status(500).send(err);
})
function searchHandler(req, res) {
    const api_key = process.env.api_key;
    const url = `https://api.themoviedb.org/3/search/company?api_key=${api_key}&page=1`;
    axios.get(url)
    .then((res)=>{})
    .catch((err) => {
        console.log("sorry", err);
        res.status(500).send(err);
    })
    
}


function defaultHandler(req, res) {
    res.status(404).send("page not found");
}

//http://localhost:3000/
server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})
