"use client";

import { useEffect, useState } from "react";
import StarRating from "./components/StarRating";

type Movie = {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  cover: string;
};

const defaultMovies: Movie[] = [
  { id: 1, title: "Inception", year: 2010, genre: "Sci-Fi", rating: 5, cover: "https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg" },
  { id: 2, title: "Avatar", year: 2009, genre: "Adventure", rating: 4, cover: "https://image.tmdb.org/t/p/w500/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg" },
  { id: 3, title: "The Dark Knight", year: 2008, genre: "Action", rating: 5, cover: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
  { id: 4, title: "Parasite", year: 2019, genre: "Thriller", rating: 4, cover: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg" },
  { id: 5, title: "Avengers: Endgame", year: 2019, genre: "Superhero", rating: 4, cover: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg" },
  { id: 6, title: "Interstellar", year: 2014, genre: "Sci-Fi", rating: 5, cover: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
  { id: 7, title: "Gladiator", year: 2000, genre: "Historical", rating: 4, cover: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg" },
  { id: 8, title: "The Matrix", year: 1999, genre: "Sci-Fi", rating: 5, cover: "https://image.tmdb.org/t/p/w500/p96dm7sCMn4VYAStA6siNz30G1r.jpg" },
  { id: 9, title: "Titanic", year: 1997, genre: "Romance", rating: 4, cover: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg" },
  { id: 10, title: "Joker", year: 2019, genre: "Drama", rating: 4, cover: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg" },
];

export default function MovieLibraryPage() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("4");
  const [cover, setCover] = useState("");

  useEffect(() => {
    const savedMovies = localStorage.getItem("movie-library-movies");

    if (savedMovies) {
      setMovies(JSON.parse(savedMovies));
    } else {
      setMovies(defaultMovies);
    }
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      localStorage.setItem("movie-library-movies", JSON.stringify(movies));
    }
  }, [movies]);

  const filteredMovies = movies.filter((movie) => {
    const query = search.toLowerCase();

    return (
      movie.title.toLowerCase().includes(query) ||
      movie.genre.toLowerCase().includes(query) ||
      movie.year.toString().includes(query)
    );
  });

  const handleAddMovie = () => {
    if (!title || !year || !genre || !cover) return;

    const newMovie: Movie = {
      id: Date.now(),
      title,
      year: Number(year),
      genre,
      rating: Number(rating),
      cover,
    };

    setMovies((prev) => [newMovie, ...prev]);

    setTitle("");
    setYear("");
    setGenre("");
    setRating("4");
    setCover("");
    setShowForm(false);
  };

  const handleDeleteMovie = (id: number) => {
    setMovies((prev) => prev.filter((movie) => movie.id !== id));
  };

  return (
    <main className="p-6 bg-neutral-950 min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">🎬 Movie Library</h1>

        <div className="flex gap-2 w-full md:w-[520px]">
          <input
            type="text"
            placeholder="Search by title, genre, or year..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 rounded-md border border-neutral-800 bg-neutral-900"
          />

          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 transition"
          >
            {showForm ? "Close" : "+ Add Movie"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Movie title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 rounded-md bg-neutral-950 border border-neutral-800"
          />

          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="p-2 rounded-md bg-neutral-950 border border-neutral-800"
          />

          <input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="p-2 rounded-md bg-neutral-950 border border-neutral-800"
          />

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="p-2 rounded-md bg-neutral-950 border border-neutral-800"
          >
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>

          <input
            type="text"
            placeholder="Poster image URL"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            className="p-2 rounded-md bg-neutral-950 border border-neutral-800 md:col-span-2"
          />

          <button
            onClick={handleAddMovie}
            className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-500 transition md:col-span-2"
          >
            Save Movie
          </button>
        </div>
      )}

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredMovies.map((movie) => (
          <article
            key={movie.id}
            className="flex flex-col bg-neutral-900 rounded-2xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={movie.cover}
              alt={movie.title}
              className="h-64 w-full object-cover"
            />

            <div className="p-4 flex flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold leading-tight">{movie.title}</h2>
                <button
                  onClick={() => handleDeleteMovie(movie.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-neutral-400">
                {movie.year} • {movie.genre}
              </p>

              <StarRating rating={movie.rating} />
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}