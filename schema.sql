DROP TABLE IF EXISTS new_movies;
CREATE TABLE IF NOT EXISTS new_movies (
movie_id SERIAL PRIMARY KEY,
movie_name TEXT NOT NULL,
movie_comments TEXT NOT NULL
);