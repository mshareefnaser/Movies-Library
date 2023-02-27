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
server.use(errorHandler)
const PORT = 3000;
require('dotenv').config();

// Routes
server.get('/', homeHandler);
server.get('/favorite', favoriteHandler)
// server.get('error', serverErrorHandler)
server.get('/trending', trendingHandler)
server.get('/search', searchHandler)
server.get('/genres', genreHandler)
server.get('/person',personHandler)
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
// function serverErrorHandler(req, res) {
//     res.status(500).send("internal server error");
// }
function trendingHandler(req, res) {
    try {
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
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}

function searchHandler(req, res) {
    try {
        const api_key = process.env.api_key;
        const query_value = "man";
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&query=${query_value}&page=2`
        axios.get(url)
            .then((result) => { return result.data })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }

}

function genreHandler(req, res) {
    try {
        const api_key = process.env.api_key;
        const url=`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=en-US`
        axios.get(url)
        .then((result)=>{return result.data})
        .catch((err) => {
            console.log("sorry", err);
            res.status(500).send(err);
        })

    }
    catch (error){
        errorHandler(error,req,res);
    }
}

function personHandler(req, res) {
    try {
        const api_key = process.env.api_key;
        const id=4;
        const url=`https://api.themoviedb.org/3/person/${id}?api_key=${api_key}&language=en-US`
        axios.get(url)
        .then((result)=>{return result.data})
        .catch((err) => {
            console.log("sorry", err);
            res.status(500).send(err);
        })

    }
    catch (error){
        errorHandler(error,req,res);
    }
}



function defaultHandler(req, res) {
    res.status(404).send("page not found");
}
function errorHandler(error, req, res, next) {
    const err = {
        status: 500,
        message: error
    }
    res.status(500).send(err);
}

//http://localhost:3000/
server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})
