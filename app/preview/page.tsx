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
};

export default function PreviewPage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const savedMovies = localStorage.getItem("movie-library-movies");

    if (savedMovies) {
      setMovies(JSON.parse(savedMovies));
    }
  }, []);

  return (
    <main className="p-10 bg-neutral-950 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-10">🎬 Movie Library</h1>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex flex-col bg-neutral-900 rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={movie.cover}
              alt={movie.title}
              className="h-64 w-full object-cover"
            />

            <div className="p-4 flex flex-col gap-2">
              <h2 className="font-semibold">{movie.title}</h2>

              <p className="text-sm text-neutral-400">
                {movie.year} • {movie.genre}
              </p>

              <StarRating rating={movie.rating} />

              <p className="text-sm text-neutral-300 line-clamp-3">
                {movie.description || "No description yet."}
              </p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}