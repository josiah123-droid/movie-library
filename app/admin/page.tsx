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

  // ✅ LOAD FROM DATABASE (FIXED)
  useEffect(() => {
    async function loadMovies() {
      try {
        const res = await fetch("/api/movies");
        const data = await res.json();

        console.log("ADMIN API:", data);

        const safe = Array.isArray(data) ? data : data.movies || [];

        const mapped = safe.map((m: any) => ({
          id: m.tmdbId,
          title: m.title,
          year: m.releaseDate?.slice(0, 4) || 0,
          genre: "N/A",
          rating: m.rating,
          cover: `https://image.tmdb.org/t/p/w500${m.posterPath}`,
          description: m.overview,
          trailer: "",
          isDefault: false,
          isDraft: false,
          featured: false,
        }));

        setMovies(mapped);
      } catch (err) {
        console.error("ADMIN LOAD ERROR:", err);
      }
    }

    loadMovies();
  }, []);

  // 🔍 SEARCH FILTER (FIXED)
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  // 🔍 TMDB SEARCH
  const handleTmdbSearch = async () => {
    if (!tmdbQuery.trim()) return;

    const res = await fetch(
      `/api/tmdb/search?query=${encodeURIComponent(tmdbQuery)}`
    );
    const data = await res.json();

    setTmdbResults(data.results || []);
  };

  return (
    <main className="p-6 bg-neutral-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">🎬 Admin Panel</h1>

      {/* SEARCH */}
      <div className="flex gap-2 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="flex-1 p-2 bg-neutral-900 rounded"
        />

        <input
          value={tmdbQuery}
          onChange={(e) => setTmdbQuery(e.target.value)}
          placeholder="Search TMDB..."
          className="flex-1 p-2 bg-neutral-900 rounded"
        />

        <button onClick={handleTmdbSearch} className="bg-green-600 px-4">
          Search
        </button>
      </div>

      {/* TMDB RESULTS */}
      {tmdbResults.map((movie) => (
        <div key={movie.id} className="flex items-center gap-2 mb-2">
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

      {/* MOVIES */}
      <h2 className="text-2xl mt-6 mb-4">Library</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            className="bg-neutral-900 rounded-xl overflow-hidden"
          >
            <img src={movie.cover} className="h-64 w-full object-cover" />

            <div className="p-3">
              <h3>{movie.title}</h3>
              <p className="text-sm text-neutral-400">{movie.year}</p>
              <StarRating rating={movie.rating} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}