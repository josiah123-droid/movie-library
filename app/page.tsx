"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type Movie = {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  cover: string;
};

const moviesData: Movie[] = [
  { id: 1, title: "Inception", year: 2010, genre: "Sci-Fi", rating: 5, cover: "https://picsum.photos/200/300?1" },
  { id: 2, title: "Avatar", year: 2009, genre: "Adventure", rating: 4, cover: "https://picsum.photos/200/300?2" },
  { id: 3, title: "The Dark Knight", year: 2008, genre: "Action", rating: 5, cover: "https://picsum.photos/200/300?3" },
  { id: 4, title: "Parasite", year: 2019, genre: "Thriller", rating: 4, cover: "https://picsum.photos/200/300?4" },
  { id: 5, title: "Avengers: Endgame", year: 2019, genre: "Superhero", rating: 4, cover: "https://picsum.photos/200/300?5" },
];

export default function MovieLibraryPage() {
  const [search, setSearch] = useState<string>("");

  const filteredMovies = moviesData.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-6 bg-neutral-950 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">🎬 Movie Library</h1>

        <div className="flex gap-2 w-full md:w-96">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 rounded-md border border-neutral-800 bg-neutral-900"
          />

          <button className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 transition">
            + Add Movie
          </button>
        </div>
      </div>

      {/* Movie Grid */}
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
              <h2 className="font-semibold">{movie.title}</h2>

              <p className="text-sm text-neutral-400">
                {movie.year} • {movie.genre}
              </p>

              <div className="flex gap-1">
                {Array.from({ length: movie.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}