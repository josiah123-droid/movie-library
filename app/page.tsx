"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import StarRating from "./components/StarRating";

type Movie = {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  cover: string;
};

const moviesData: Movie[] = [
  { id: 1, title: "Inception", year: 2010, genre: "Sci-Fi", rating: 5, cover: "https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg" },
  { id: 2, title: "Avatar", year: 2009, genre: "Adventure", rating: 4, cover: "https://image.tmdb.org/t/p/w500/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg" },
  { id: 3, title: "The Dark Knight", year: 2008, genre: "Action", rating: 5, cover:"https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
  { id: 4, title: "Parasite", year: 2019, genre: "Thriller", rating: 4, cover: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg" },
  { id: 5, title: "Avengers: Endgame", year: 2019, genre: "Superhero", rating: 4, cover: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg" },
  { id: 6, title: "Interstellar", year: 2014, genre: "Sci-Fi", rating: 5, cover: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
  { id: 7, title: "Gladiator", year: 2000, genre: "Historical", rating: 4, cover: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg" },
  { id: 8, title: "The Matrix", year: 1999, genre: "Sci-Fi", rating: 5, cover: "https://image.tmdb.org/t/p/w500/p96dm7sCMn4VYAStA6siNz30G1r.jpg" },
  { id: 9, title: "Titanic", year: 1997, genre: "Romance", rating: 4, cover: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg" },
  { id: 10, title: "Joker", year: 2019, genre: "Drama", rating: 4, cover: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg" },
  { id: 11, title: "Spider-Man: No Way Home", year: 2021, genre: "Superhero", rating: 4, cover: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg" },
  { id: 12, title: "Top Gun: Maverick", year: 2022, genre: "Action", rating: 4, cover: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg" },
  { id: 13, title: "The Godfather", year: 1972, genre: "Crime", rating: 5, cover: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg" },
  { id: 14, title: "Fight Club", year: 1999, genre: "Drama", rating: 4, cover: "https://image.tmdb.org/t/p/w500/https://image.tmdb.org/t/p/w1280/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg" },
  { id: 15, title: "Forrest Gump", year: 1994, genre: "Drama", rating: 5, cover: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg" },
  { id: 16, title: "Mad Max: Fury Road", year: 2015, genre: "Action", rating: 4, cover: "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg" },
  { id: 17, title: "Doctor Strange", year: 2016, genre: "Superhero", rating: 4, cover: "https://image.tmdb.org/t/p/w500/xf8PbyQcR5ucXErmZNzdKR0s8ya.jpg" },
  { id: 18, title: "John Wick", year: 2014, genre: "Action", rating: 4, cover: "https://image.tmdb.org/t/p/w500/wXqWR7dHncNRbxoEGybEy7QTe9h.jpg" },
  { id: 19, title: "The Batman", year: 2022, genre: "Superhero", rating: 4, cover: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg" },
  { id: 20, title: "Dune", year: 2021, genre: "Sci-Fi", rating: 4, cover: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg" }
];

export default function MovieLibraryPage() {
  const [search, setSearch] = useState<string>("");

const filteredMovies = moviesData.filter((movie) => {
  const query = search.toLowerCase();

  return (
    movie.title.toLowerCase().includes(query) ||
    movie.genre.toLowerCase().includes(query) ||
    movie.year.toString().includes(query)
  );
});

  return (
    <main className="p-6 bg-neutral-950 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">🎬 Movie Library</h1>

        <div className="flex gap-2 w-full md:w-96">
          <input
            type="text"
            placeholder="Search by title, genre, or year..."
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

  <StarRating rating={movie.rating} />

</div>
          </article>
        ))}
      </section>
    </main>
  );
}