'use strict!'
function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}
const express = require('express');
const cors = require('cors');
const server = express();
server.use(cors());
const PORT = 3000;

// Routes
server.get('/', homeHandler);
server.get('/favorite', favoriteHandler)
server.get('error', serverErrorHandler)
server.get('*',defaultHandler)

// Handlers functions
function homeHandler(req,res)
{
        const movieData=require('./Movie Data/data.json')
        const spiderMan=new Movie(movieData.title,movieData.poster_path,movieData.overview);
        res.send(spiderMan);
}
function favoriteHandler (req, res)  {
    res.send("Welcome to favorite page");
}
function serverErrorHandler(req, res){
    res.status(500).send("internal server error");
}
function defaultHandler(req, res) {
    res.status(404).send("page not found");
}

//http://localhost:3000/
server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})
