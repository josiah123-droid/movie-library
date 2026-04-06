"use client";

import { useEffect, useState } from "react";
import StarRating from "../components/StarRating";
import AddToLibraryButton from "../components/AddToLibraryButton";
import RemoveFromLibraryButton from "../components/RemoveFromLibraryButton";

type DbMovie = {
  id: string;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  rating: number;
  createdAt: string;
};

type SearchResult = {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string | null;
  vote_average?: number; // ✅ FIXED
};

export default function MovieLibraryPage() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<DbMovie[]>([]);
  const [tmdbQuery, setTmdbQuery] = useState("");
  const [tmdbResults, setTmdbResults] = useState<SearchResult[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    try {
      setLoadingLibrary(true);

      const res = await fetch("/api/movies", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();
      console.log("ADMIN API:", data);

      if (Array.isArray(data)) {
        setMovies(data);
      } else {
        setMovies([]);
      }
    } catch (err) {
      console.error("ADMIN LOAD ERROR:", err);
      setMovies([]);
    } finally {
      setLoadingLibrary(false);
    }
  }

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
      <h1 className="mb-6 text-3xl font-bold">🎬 Movie Library</h1>

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
            <div
              key={movie.id}
              className="flex items-center justify-between rounded-lg bg-neutral-900 p-3"
            >
              <p>{movie.title}</p>

              <AddToLibraryButton
                movie={{
                  id: movie.id,
                  title: movie.title,
                  overview: "",
                  poster_path: movie.poster_path ?? null,
                  backdrop_path: null,
                  release_date: movie.release_date ?? "",
                  vote_average: movie.vote_average ?? 0, // ✅ FIXED
                }}
              />
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-4 mt-6 text-2xl">Library</h2>

      {loadingLibrary ? (
        <p className="text-neutral-400">Loading movies...</p>
      ) : filteredMovies.length === 0 ? (
        <p className="text-neutral-400">No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="overflow-hidden rounded-xl bg-neutral-900"
            >
              {movie.posterPath ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                  alt={movie.title}
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center bg-neutral-800 text-sm text-neutral-400">
                  No Image
                </div>
              )}

              <div className="p-3">
                <h3 className="font-semibold">{movie.title}</h3>

                <p className="text-sm text-neutral-400">
                  {movie.releaseDate ? movie.releaseDate.slice(0, 4) : "N/A"}
                </p>

                <div className="mt-2">
                  <StarRating rating={Number(movie.rating ?? 0)} />
                </div>

                <div className="mt-4">
                  <RemoveFromLibraryButton id={movie.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}