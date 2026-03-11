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
  featured: boolean;
};

type MovieDraft = {
  title: string;
  year: string;
  genre: string;
  rating: string;
  cover: string;
  description: string;
  trailer: string;
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
  const [showForm, setShowForm] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("4");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [trailer, setTrailer] = useState("");

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [tmdbQuery, setTmdbQuery] = useState("");
  const [tmdbResults, setTmdbResults] = useState<SearchResult[]>([]);
  const [isSearchingTmdb, setIsSearchingTmdb] = useState(false);

  useEffect(() => {
    const savedMovies = localStorage.getItem("movie-library-movies");

    if (savedMovies) {
      const parsedMovies = JSON.parse(savedMovies);

      const normalizedMovies: Movie[] = parsedMovies.map(
        (movie: Partial<Movie>) => ({
          id: movie.id ?? Date.now(),
          title: movie.title ?? "Untitled",
          year: movie.year ?? 0,
          genre: movie.genre ?? "Uncategorized",
          rating: movie.rating ?? 4,
          cover:
            movie.cover ??
            "https://via.placeholder.com/300x450?text=No+Poster",
          description: movie.description ?? "",
          trailer: movie.trailer ?? "",
          isDefault: movie.isDefault ?? false,
          isDraft: movie.isDraft ?? false,
          featured: movie.featured ?? false,
        })
      );

      setMovies(normalizedMovies);
    } else {
      setMovies([]);
    }
  }, []);

  useEffect(() => {
    const savedDraft = localStorage.getItem("movie-library-draft");

    if (savedDraft) {
      const draft: MovieDraft = JSON.parse(savedDraft);

      setTitle(draft.title ?? "");
      setYear(draft.year ?? "");
      setGenre(draft.genre ?? "");
      setRating(draft.rating ?? "4");
      setCover(draft.cover ?? "");
      setDescription(draft.description ?? "");
      setTrailer(draft.trailer ?? "");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("movie-library-movies", JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    const draft: MovieDraft = {
      title,
      year,
      genre,
      rating,
      cover,
      description,
      trailer,
    };

    localStorage.setItem("movie-library-draft", JSON.stringify(draft));
  }, [title, year, genre, rating, cover, description, trailer]);

  const resetForm = () => {
    setEditingMovieId(null);
    setTitle("");
    setYear("");
    setGenre("");
    setRating("4");
    setCover("");
    setDescription("");
    setTrailer("");
  };

  const handleAddMovie = () => {
    if (!title.trim()) return;

    const existingMovie = editingMovieId
      ? movies.find((movie) => movie.id === editingMovieId)
      : null;

    const updatedMovie: Movie = {
      id: editingMovieId ?? Date.now(),
      title: title.trim(),
      year: year ? Number(year) : 0,
      genre: genre.trim() || "Uncategorized",
      rating: Number(rating) || 4,
      cover:
        cover.trim() || "https://via.placeholder.com/300x450?text=No+Poster",
      description: description.trim(),
      trailer: trailer.trim(),
      isDefault: existingMovie?.isDefault ?? false,
      isDraft:
        !year.trim() ||
        !genre.trim() ||
        !cover.trim() ||
        !description.trim() ||
        !trailer.trim(),
      featured: existingMovie?.featured ?? false,
    };

    if (editingMovieId) {
      setMovies((prev) =>
        prev.map((movie) =>
          movie.id === editingMovieId ? updatedMovie : movie
        )
      );

      if (selectedMovie?.id === editingMovieId) {
        setSelectedMovie(updatedMovie);
      }
    } else {
      setMovies((prev) => [updatedMovie, ...prev]);
    }

    resetForm();
    setShowForm(false);
    localStorage.removeItem("movie-library-draft");
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovieId(movie.id);
    setTitle(movie.title);
    setYear(movie.year ? String(movie.year) : "");
    setGenre(movie.genre === "Uncategorized" ? "" : movie.genre);
    setRating(String(movie.rating));
    setCover(
      movie.cover === "https://via.placeholder.com/300x450?text=No+Poster"
        ? ""
        : movie.cover
    );
    setDescription(movie.description);
    setTrailer(movie.trailer);
    setShowForm(true);
    setSelectedMovie(null);
  };

  const handleDeleteMovie = (id: number) => {
    const confirmDelete = confirm("Remove movie permanently?");
    if (!confirmDelete) return;

    setMovies((prev) => prev.filter((movie) => movie.id !== id));

    if (selectedMovie?.id === id) {
      setSelectedMovie(null);
    }

    if (editingMovieId === id) {
      resetForm();
      setShowForm(false);
      localStorage.removeItem("movie-library-draft");
    }
  };

  const handleRateMovie = (id: number, newRating: number) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id ? { ...movie, rating: newRating } : movie
      )
    );

    if (selectedMovie?.id === id) {
      setSelectedMovie((prev) =>
        prev ? { ...prev, rating: newRating } : prev
      );
    }
  };

  const handleToggleFeatured = (id: number) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id ? { ...movie, featured: !movie.featured } : movie
      )
    );

    if (selectedMovie?.id === id) {
      setSelectedMovie((prev) =>
        prev ? { ...prev, featured: !prev.featured } : prev
      );
    }
  };

  const handleTmdbSearch = async () => {
    if (!tmdbQuery.trim()) return;

    setIsSearchingTmdb(true);
    try {
      const res = await fetch(
        `/api/tmdb/search?query=${encodeURIComponent(tmdbQuery)}`
      );
      const data = await res.json();
      setTmdbResults(data.results ?? []);
    } finally {
      setIsSearchingTmdb(false);
    }
  };

 const handleAddFromTmdb = async (tmdbId: number) => {
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
    featured: false,
  };

  setMovies((prev) => [newMovie, ...prev]);

  // 🔹 Clear search and go back
  setTmdbResults([]);
  setTmdbQuery("");
};

  const filteredMovies = movies.filter((movie) => {
    const query = search.toLowerCase();

    return (
      movie.title.toLowerCase().includes(query) ||
      movie.genre.toLowerCase().includes(query) ||
      movie.year.toString().includes(query)
    );
  });

  const previewMovie: Movie = {
    id: editingMovieId ?? 0,
    title: title.trim() || "Untitled Movie",
    year: year ? Number(year) : 0,
    genre: genre.trim() || "Uncategorized",
    rating: Number(rating) || 4,
    cover:
      cover.trim() || "https://via.placeholder.com/300x450?text=No+Poster",
    description: description.trim() || "No description yet.",
    trailer: trailer.trim(),
    isDefault: false,
    isDraft:
      !year.trim() ||
      !genre.trim() ||
      !cover.trim() ||
      !description.trim() ||
      !trailer.trim(),
    featured: false,
  };

  return (
    <main className="p-6 bg-neutral-950 min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">🎬 Movie Library</h1>

        <div className="flex gap-2 w-full md:w-[700px]">
          <input
            type="text"
            placeholder="Search by title, genre, or year..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 rounded-md border border-neutral-800 bg-neutral-900"
          />

          <button
            onClick={() => {
              setShowForm((prev) => !prev);
              if (showForm) {
                resetForm();
              }
            }}
            className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 transition"
          >
            {showForm ? "Close" : "+ Add Movie"}
          </button>

          <button
            onClick={() => window.open("/preview", "_blank")}
            className="bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-500 transition"
          >
            Preview Page
          </button>
        </div>
      </div>

      <div className="mb-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
        <h2 className="text-xl font-bold mb-4">TMDB Search</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search movies from TMDB..."
            value={tmdbQuery}
            onChange={(e) => setTmdbQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTmdbSearch();
              }
            }}
            className="flex-1 p-2 rounded-md border border-neutral-800 bg-neutral-950"
          />

          <button
            onClick={handleTmdbSearch}
            className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-500 transition"
          >
            {isSearchingTmdb ? "Searching..." : "Search TMDB"}
          </button>
        </div>

        {tmdbResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tmdbResults.map((movie) => {
              const exists = movies.some(
                (m) =>
                  m.title.toLowerCase() === movie.title.toLowerCase() &&
                  m.year ===
                    (movie.release_date
                      ? Number(movie.release_date.slice(0, 4))
                      : 0)
              );

              return (
                <div
                  key={movie.id}
                  className="flex items-center gap-3 bg-neutral-950 rounded-xl p-3 border border-neutral-800"
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
                    disabled={exists}
                    onClick={() => handleAddFromTmdb(movie.id)}
                    className={`px-3 py-2 rounded-md text-sm ${
                      exists
                        ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-500"
                    }`}
                  >
                    {exists ? "Added" : "Add"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
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

          <input
            type="text"
            placeholder="Movie description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 rounded-md bg-neutral-950 border border-neutral-800 md:col-span-2"
          />

          <input
            type="text"
            placeholder="YouTube trailer embed URL"
            value={trailer}
            onChange={(e) => setTrailer(e.target.value)}
            className="p-2 rounded-md bg-neutral-950 border border-neutral-800 md:col-span-2"
          />

          <div className="md:col-span-2">
            <p className="text-sm text-neutral-400 mb-3">Preview</p>

            <div className="grid md:grid-cols-2 gap-4 bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
              <img
                src={previewMovie.cover}
                alt={previewMovie.title}
                className="w-full h-80 object-cover rounded-xl"
              />

              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex flex-col gap-2 mb-3">
                    <h2 className="text-2xl font-bold">{previewMovie.title}</h2>

                    {previewMovie.isDraft && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-md w-fit">
                        Draft Preview
                      </span>
                    )}
                  </div>

                  <p className="text-neutral-400 mb-3">
                    {previewMovie.year ? previewMovie.year : "No year"} •{" "}
                    {previewMovie.genre}
                  </p>

                  <StarRating rating={previewMovie.rating} />

                  <p className="text-sm text-neutral-300 mt-4 leading-6">
                    {previewMovie.description}
                  </p>
                </div>

                {previewMovie.trailer && (
                  <iframe
                    className="mt-4 w-full aspect-video rounded-lg"
                    src={previewMovie.trailer}
                    title="Preview Trailer"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleAddMovie}
            className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-500 transition md:col-span-2"
          >
            {editingMovieId ? "Update Movie" : "Save Movie"}
          </button>

          <button
            onClick={() => {
              resetForm();
              localStorage.removeItem("movie-library-draft");
            }}
            className="bg-neutral-700 px-4 py-2 rounded-md hover:bg-neutral-600 transition md:col-span-2"
          >
            Discard Draft
          </button>
        </div>
      )}

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredMovies.map((movie) => (
          <article
            key={movie.id}
            onClick={() => setSelectedMovie(movie)}
            className="flex flex-col bg-neutral-900 rounded-2xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
          >
            <img
              src={movie.cover}
              alt={movie.title}
              className="h-64 w-full object-cover"
            />

            <div className="p-4 flex flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <h2 className="font-semibold leading-tight">{movie.title}</h2>
                  {movie.isDraft && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-md w-fit mt-1">
                      Draft
                    </span>
                  )}
                  {movie.featured && (
                    <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-md w-fit mt-1">
                      Featured
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMovie(movie.id);
                  }}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-neutral-400">
                {movie.year ? movie.year : "No year"} • {movie.genre}
              </p>

              <div onClick={(e) => e.stopPropagation()}>
                <StarRating
                  rating={movie.rating}
                  onRate={(newRating) => handleRateMovie(movie.id, newRating)}
                />
              </div>

              <div className="flex gap-2 mt-2 flex-wrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditMovie(movie);
                  }}
                  className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-md w-fit"
                >
                  {movie.isDraft ? "Continue Draft" : "Edit"}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFeatured(movie.id);
                  }}
                  className={`text-xs px-3 py-1 rounded-md w-fit ${
                    movie.featured
                      ? "bg-yellow-500 text-black hover:bg-yellow-400"
                      : "bg-neutral-700 text-white hover:bg-neutral-600"
                  }`}
                >
                  {movie.featured ? "★ Featured" : "☆ Feature"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {selectedMovie && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="bg-neutral-900 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl grid md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedMovie.cover}
              alt={selectedMovie.title}
              className="w-full h-96 md:h-full object-cover"
            />

            <div className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex flex-col">
                    <h2 className="text-2xl font-bold">
                      {selectedMovie.title}
                    </h2>
                    {selectedMovie.isDraft && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-md w-fit mt-2">
                        Draft
                      </span>
                    )}
                    {selectedMovie.featured && (
                      <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-md w-fit mt-2">
                        Featured
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedMovie(null)}
                    className="text-gray-400 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-neutral-400 mb-2">
                  {selectedMovie.year ? selectedMovie.year : "No year"} •{" "}
                  {selectedMovie.genre}
                </p>

                <StarRating rating={selectedMovie.rating} />

                <p className="text-sm text-neutral-300 mt-6 leading-6">
                  {selectedMovie.description ||
                    "No description yet. Continue this draft to complete the movie details."}
                </p>

                {selectedMovie.trailer && (
                  <iframe
                    className="mt-6 w-full aspect-video rounded-lg"
                    src={selectedMovie.trailer}
                    title={`${selectedMovie.title} Trailer`}
                    allowFullScreen
                  ></iframe>
                )}
              </div>

              <div className="mt-6 flex gap-2 flex-wrap">
                <button
                  onClick={() => handleEditMovie(selectedMovie)}
                  className="bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-md"
                >
                  {selectedMovie.isDraft ? "Continue Draft" : "Edit Movie"}
                </button>

                <button
                  onClick={() => handleToggleFeatured(selectedMovie.id)}
                  className={`transition px-4 py-2 rounded-md ${
                    selectedMovie.featured
                      ? "bg-yellow-500 text-black hover:bg-yellow-400"
                      : "bg-neutral-700 text-white hover:bg-neutral-600"
                  }`}
                >
                  {selectedMovie.featured ? "★ Featured" : "☆ Feature"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}