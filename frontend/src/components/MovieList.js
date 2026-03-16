import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieService } from '../services/api';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieService.getAllMovies();
        setMovies(data.results || data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieClick = (movie) => {
    navigate(`/showtimes/${movie.id}`);
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="movie-list">
      {movies.length === 0 ? (
        <div className="no-showtimes">No movies available at the moment.</div>
      ) : (
        movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => handleMovieClick(movie)}
          >
            <img
              src={movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Poster'}
              alt={movie.title}
              className="movie-poster"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
              }}
            />
            <div className="movie-info">
              <h2 className="movie-title">{movie.title}</h2>
              <div className="movie-meta">
                <span>{movie.duration} min</span>
                <span className="movie-genre">{movie.genre}</span>
              </div>
              <p className="movie-description">
                {movie.description.substring(0, 100)}...
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MovieList;
