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
const pg = require('pg');
const server = express();
server.use(cors());
server.use(errorHandler)
server.use(express.json());
const PORT = process.env.PORT || 3000;
require('dotenv').config();

// Routes
server.get('/', homeHandler);
server.get('/favorite', favoriteHandler)
// server.get('error', serverErrorHandler)
server.get('/trending', trendingHandler)
server.get('/search', searchHandler)
server.get('/genres', genreHandler)
server.get('/person', personHandler)
server.get('/newmovies', getMoviesHandler)
server.post('/newmovies', addNewMovieHandler)
server.delete('/newmovies/:id', deleteMovieHandler)
server.put('/newmovies/:id', updateMovieHandler)
server.get('/newmovies/:id', getNewMovieHandler)

server.get('*', defaultHandler)
// Objects
const client = new pg.Client(process.env.DATABASE_URL);
// Handlers functions
function homeHandler(req, res) {
    const movieData = require('./data.json')
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
            .then((result) => { res.send(result.data) })
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
        const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=en-US`
        axios.get(url)
            .then((result) => { res.send(result.data) })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })

    }
    catch (error) {
        errorHandler(error, req, res);
    }
}

function personHandler(req, res) {
    try {
        const api_key = process.env.api_key;
        const id = 4;
        const url = `https://api.themoviedb.org/3/person/${id}?api_key=${api_key}&language=en-US`
        axios.get(url)
            .then((result) => { res.send(result.data) })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })

    }
    catch (error) {
        errorHandler(error, req, res);
    }
}
function getMoviesHandler(req, res) {
    try {
        const sql = `SELECT * FROM new_movies`;
        client.query(sql)
            .then((data) => {
                res.send(data.rows);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}
function addNewMovieHandler(req, res) {
    try {
        const movie = req.body;
        const sql = `INSERT INTO new_movies (movie_name,movie_comments) VALUES ($1,$2) RETURNING *`;
        const values = [movie.movie_name, movie.movie_comments];
        client.query(sql, values)
            .then((data) => {
                res.send("your data was added !");
            })
            .catch(error => {
                // console.log(error);
                errorHandler(error, req, res);
            });

    }
    catch (error) {
        errorHandler(error, req, res);
    }

}
function deleteMovieHandler(req, res) {
    try {
        const id = req.params.id;
        const sql = `DELETE FROM new_movies WHERE movie_id=${id}`;
        client.query(sql)
            .then((data) => {
                res.status(204).json({});
            })
            .catch((err) => {
                errorHandler(err, req, res);
            })

    }
    catch (error) {
        errorHandler(error, req, res);
    }
}
function updateMovieHandler(req, res) {
    try {
        const id = req.params.id;
        const movie = req.body;
        const sql = `UPDATE new_movies SET movie_name=$1, movie_comments=$2 WHERE movie_id=${id}`;
        const values = [movie.movie_name,movie.movie_comments];
        client.query(sql, values)
            .then((data) => {
                res.status(200).send(data.rows);
            })
            .catch((err) => {
                errorHandler(err, req, res);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}
function getNewMovieHandler(req, res) {
   
    try {
        const id = req.params.id;
        const sql = `SELECT * FROM new_movies WHERE movie_id=${id}`;
        client.query(sql)
            .then((data) => {
                res.send(data.rows);
            })
            .catch((err) => {
                errorHandler(err, req, res);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
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
client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listening on ${PORT}`);
        })
    })
    .catch((err) => {
        console.log("sorry", err);
        res.status(500).send(err);
    })
