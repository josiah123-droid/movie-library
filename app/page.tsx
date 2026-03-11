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
  description: string;
  trailer: string;
  isDefault: boolean;
  isDraft: boolean;
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

const defaultMovies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    genre: "Sci-Fi",
    rating: 5,
    cover: "https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
    description: "A skilled thief leads a team into dreams to steal secrets.",
    trailer: "https://www.youtube.com/embed/YoHD9XEInc0",
    isDefault: true,
    isDraft: false,
  },
  {
    id: 2,
    title: "Avatar",
    year: 2009,
    genre: "Adventure",
    rating: 4,
    cover: "https://image.tmdb.org/t/p/w500/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg",
    description:
      "A marine on an alien planet becomes torn between following orders and protecting a new world.",
    trailer: "https://www.youtube.com/embed/5PSNL1qE6VY",
    isDefault: true,
    isDraft: false,
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    genre: "Action",
    rating: 5,
    cover: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description:
      "Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos.",
    trailer: "https://www.youtube.com/embed/EXeTwQWrcwY",
    isDefault: true,
    isDraft: false,
  },
  {
    id: 4,
    title: "Parasite",
    year: 2019,
    genre: "Thriller",
    rating: 4,
    cover: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    description:
      "A poor family schemes to infiltrate a wealthy household with unexpected consequences.",
    trailer: "https://www.youtube.com/embed/5xH0HfJHsaY",
    isDefault: true,
    isDraft: false,
  },
  {
    id: 5,
    title: "Avengers: Endgame",
    year: 2019,
    genre: "Superhero",
    rating: 4,
    cover: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
    description:
      "The Avengers assemble once more to undo the destruction caused by Thanos.",
    trailer: "https://www.youtube.com/embed/TcMBFSGVi1c",
    isDefault: true,
    isDraft: false,
  },
  {
    id: 6,
    title: "Interstellar",
    year: 2014,
    genre: "Sci-Fi",
    rating: 5,
    cover: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    description:
      "A team of explorers travel through a wormhole in space to save humanity.",
    trailer: "https://www.youtube.com/embed/zSWdZVtXT7E",
    isDefault: true,
    isDraft: false,
  },
  {
    id: 7,
    title: "Gladiator",
    year: 2000,
    genre: "Historical",
    rating: 4,
    cover: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    description:
      "A Roman general seeks revenge after being betrayed and forced into slavery.",
    trailer: "https://www.youtube.com/embed/owK1qxDselE",
    isDefault: true,
    isDraft: false,
  },
  {
    id: 8,
    title: "The Matrix",
    year: 1999,
    genre: "Sci-Fi",
    rating: 5,
    cover: "https://image.tmdb.org/t/p/w500/p96dm7sCMn4VYAStA6siNz30G1r.jpg",
    description:
      "A hacker learns reality is a simulation controlled by machines.",
    trailer: "https://www.youtube.com/embed/vKQi3bBA1y8",
    isDefault: true,
    isDraft: false,
  },
  {
    id: 9,
    title: "Titanic",
    year: 1997,
    genre: "Romance",
    rating: 4,
    cover: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    description: "A love story unfolds aboard the ill-fated Titanic.",
    trailer: "https://www.youtube.com/embed/kVrqfYjkTdQ",
    isDefault: true,
    isDraft: false,
  },
  {
    id: 10,
    title: "Joker",
    year: 2019,
    genre: "Drama",
    rating: 4,
    cover: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    description:
      "A struggling comedian descends into madness and becomes the Joker.",
    trailer: "https://www.youtube.com/embed/zAGVQLHvwOY",
    isDefault: true,
    isDraft: false,
  },
];

export default function MovieLibraryPage() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [deletedDefaultIds, setDeletedDefaultIds] = useState<number[]>([]);
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

  useEffect(() => {
    const savedMovies = localStorage.getItem("movie-library-movies");
    const savedDeletedIds = localStorage.getItem("deleted-default-movie-ids");

    if (savedDeletedIds) {
      setDeletedDefaultIds(JSON.parse(savedDeletedIds));
    }

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
        })
      );

      setMovies(normalizedMovies);
    } else {
      setMovies(defaultMovies);
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
    localStorage.setItem(
      "deleted-default-movie-ids",
      JSON.stringify(deletedDefaultIds)
    );
  }, [deletedDefaultIds]);

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
      isDefault: false,
      isDraft:
        !year.trim() ||
        !genre.trim() ||
        !cover.trim() ||
        !description.trim() ||
        !trailer.trim(),
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

    const movieToDelete = movies.find((movie) => movie.id === id);

    if (movieToDelete?.isDefault) {
      setDeletedDefaultIds((prev) =>
        prev.includes(id) ? prev : [...prev, id]
      );
    }

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

  const filteredMovies = movies.filter((movie) => {
    const query = search.toLowerCase();

    return (
      movie.title.toLowerCase().includes(query) ||
      movie.genre.toLowerCase().includes(query) ||
      movie.year.toString().includes(query)
    );
  });

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
            onClick={() => {
              const existingIds = new Set(movies.map((movie) => movie.id));

              const missingDefaultMovies = defaultMovies.filter(
                (movie) =>
                  !deletedDefaultIds.includes(movie.id) &&
                  !existingIds.has(movie.id)
              );

              const restoredMovies = [...movies, ...missingDefaultMovies];

              setMovies(restoredMovies);
              setSelectedMovie(null);
            }}
            className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-500 transition"
          >
            Restore Defaults
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

              {!movie.isDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditMovie(movie);
                  }}
                  className="mt-2 text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-md w-fit"
                >
                  {movie.isDraft ? "Continue Draft" : "Edit"}
                </button>
              )}
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

              {!selectedMovie.isDefault && (
                <button
                  onClick={() => handleEditMovie(selectedMovie)}
                  className="mt-6 bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-md"
                >
                  {selectedMovie.isDraft ? "Continue Draft" : "Edit Movie"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}