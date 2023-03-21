DROP TABLE IF EXISTS new_movies;
CREATE TABLE IF NOT EXISTS new_movies (
movie_id SERIAL PRIMARY KEY,
movie_name TEXT NOT NULL,
movie_comments TEXT, 
movie_overview TEXT ,
poster_path TEXT ,
release_date VARCHAR (300)
);