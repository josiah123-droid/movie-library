"use client";

import { useEffect, useState } from "react";
import StarRating from "../components/StarRating";
import AddToLibraryButton from "../components/AddToLibraryButton";

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
  featured: boolean;
};

type SearchResult = {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string;
};

export default function MovieLibraryPage() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tmdbQuery, setTmdbQuery] = useState("");
  const [tmdbResults, setTmdbResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    async function loadMovies() {
      try {
        const res = await fetch("/api/movies", {
          cache: "no-store",
        });

        const data = await res.json();
        console.log("ADMIN API:", data);

        const safe = Array.isArray(data) ? data : data.movies || [];

        const mapped = safe.map((m: any) => ({
          id: Number(m.tmdbId ?? m.id),
          title: m.title ?? "",
          year: m.releaseDate ? Number(String(m.releaseDate).slice(0, 4)) : 0,
          genre: "N/A",
          rating: Number(m.rating ?? 0),
          cover: m.posterPath
            ? `https://image.tmdb.org/t/p/w500${m.posterPath}`
            : "/no-image.png",
          description: m.overview ?? "",
          trailer: "",
          isDefault: false,
          isDraft: false,
          featured: false,
        }));

        setMovies(mapped);
      } catch (err) {
        console.error("ADMIN LOAD ERROR:", err);
        setMovies([]);
      }
    }

    loadMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleTmdbSearch = async () => {
    if (!tmdbQuery.trim()) return;

    try {
      const res = await fetch(
        `/api/tmdb/search?query=${encodeURIComponent(tmdbQuery)}`
      );
      const data = await res.json();

      setTmdbResults(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      console.error("TMDB SEARCH ERROR:", err);
      setTmdbResults([]);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">🎬 Admin Panel</h1>

      <div className="mb-6 flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="flex-1 rounded bg-neutral-900 p-2"
        />

        <input
          value={tmdbQuery}
          onChange={(e) => setTmdbQuery(e.target.value)}
          placeholder="Search TMDB..."
          className="flex-1 rounded bg-neutral-900 p-2"
        />

        <button
          onClick={handleTmdbSearch}
          className="rounded bg-green-600 px-4 text-white"
        >
          Search
        </button>
      </div>

      {tmdbResults.length > 0 && (
        <div className="mb-8 space-y-2">
          {tmdbResults.map((movie) => (
            <div key={movie.id} className="flex items-center gap-2">
              <p>{movie.title}</p>

              <AddToLibraryButton
                movie={{
                  id: movie.id,
                  title: movie.title,
                  overview: "",
                  poster_path: movie.poster_path ?? null,
                  backdrop_path: null,
                  release_date: movie.release_date ?? "",
                  vote_average: 0,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-4 mt-6 text-2xl">Library</h2>

      {filteredMovies.length === 0 ? (
        <p className="text-neutral-400">No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="overflow-hidden rounded-xl bg-neutral-900"
            >
              <img
                src={movie.cover}
                alt={movie.title}
                className="h-64 w-full object-cover"
              />

              <div className="p-3">
                <h3>{movie.title}</h3>
                <p className="text-sm text-neutral-400">{movie.year || "N/A"}</p>
                <StarRating rating={movie.rating} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}