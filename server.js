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
server.get('/', (req, res) => {
    const movieData=require('./Movie Data/data.json')
    const spiderMan=new Movie(movieData.title,movieData.poster_path,movieData.overview);
    res.send(spiderMan);
})
server.get('/favorite', (req, res) => {
    res.send("Welcome to favorite page");
})
server.get('*', (req, res) => {
    res.status(404).send("page not found");
})
server.get('error', (req, res) => {
    res.status(500).send("internal server error");
})
server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})
