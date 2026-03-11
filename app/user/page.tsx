"use client";

import { useEffect, useState } from "react";
import StarRating from "../components/StarRating";

type Movie = {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  cover: string;
  description: string;
  trailer: string;
  isDefault: boolean;
  isDraft: boolean;
};

type SearchResult = {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string;
};

export default function UserPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const savedMovies = localStorage.getItem("movie-library-movies");
    if (savedMovies) {
      setMovies(JSON.parse(savedMovies));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("movie-library-movies", JSON.stringify(movies));
  }, [movies]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/tmdb/search?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setResults(data.results ?? []);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToLibrary = async (tmdbId: number) => {
    const res = await fetch(`/api/tmdb/movie/${tmdbId}`);
    const data = await res.json();

    const alreadyExists = movies.some(
      (movie) =>
        movie.title.toLowerCase() === data.title.toLowerCase() &&
        movie.year === data.year
    );

    if (alreadyExists) return;

    const newMovie: Movie = {
      id: Date.now(),
      title: data.title,
      year: data.year,
      genre: data.genre,
      rating: data.rating,
      cover: data.cover,
      description: data.description,
      trailer: data.trailer,
      isDefault: false,
      isDraft: false,
    };

    setMovies((prev) => [newMovie, ...prev]);
    setResults([]);
    setQuery("");
  };

  const removeMovie = (id: number) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <main className="p-6 bg-neutral-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">🎬 User Movie Search</h1>

      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 rounded-md border border-neutral-800 bg-neutral-900"
        />
        <button
          onClick={handleSearch}
          className="bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-500 transition"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>

      {results.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {results.map((movie) => (
            <div
              key={movie.id}
              className="flex items-center gap-3 bg-neutral-900 rounded-xl p-3 border border-neutral-800"
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : "https://via.placeholder.com/100x150?text=No+Poster"
                }
                alt={movie.title}
                className="w-16 h-24 object-cover rounded-md"
              />

              <div className="flex-1">
                <p className="font-semibold">{movie.title}</p>
                <p className="text-sm text-neutral-400">
                  {movie.release_date
                    ? movie.release_date.slice(0, 4)
                    : "No year"}
                </p>
              </div>

              <button
                onClick={() => handleAddToLibrary(movie.id)}
                className="bg-green-600 px-3 py-2 rounded-md hover:bg-green-500 transition text-sm"
              >
                Add
              </button>
            </div>
          ))}
        </section>
      )}

      {movies.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Library</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                className="flex flex-col bg-neutral-900 rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition"
              >
                <img
                  src={movie.cover}
                  alt={movie.title}
                  className="h-64 w-full object-cover"
                />

                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-semibold leading-tight">{movie.title}</h3>

                  <p className="text-sm text-neutral-400">
                    {movie.year} • {movie.genre}
                  </p>

                  <StarRating rating={movie.rating} />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMovie(movie.id);
                    }}
                    className="bg-red-600 text-xs px-2 py-1 rounded mt-2 hover:bg-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedMovie && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-neutral-900 rounded-xl max-w-xl w-full p-6 relative">

            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-3 right-3 text-white text-xl"
            >
              ✕
            </button>

            <img
              src={selectedMovie.cover}
              className="w-full rounded-lg mb-4"
            />

            <h2 className="text-2xl font-bold mb-2">
              {selectedMovie.title}
            </h2>

            <p className="text-sm text-neutral-400 mb-4">
              {selectedMovie.year} • {selectedMovie.genre}
            </p>

            <p className="text-sm leading-relaxed">
              {selectedMovie.description}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}