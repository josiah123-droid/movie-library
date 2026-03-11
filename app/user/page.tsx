"use client";

import { useEffect, useMemo, useState } from "react";
import StarRating from "../components/StarRating";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

type SortableMovieCardProps = {
  movie: Movie;
  onOpen: (movie: Movie) => void;
  onRemove: (id: number) => void;
};

function getYouTubeEmbedUrl(url: string) {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;

      const parts = parsed.pathname.split("/");
      const embedId = parts[parts.length - 1];
      if (
        (parsed.pathname.includes("/embed/") ||
          parsed.pathname.includes("/shorts/")) &&
        embedId
      ) {
        return `https://www.youtube.com/embed/${embedId}`;
      }
    }

    return "";
  } catch {
    return "";
  }
}

function SortableMovieCard({
  movie,
  onOpen,
  onRemove,
}: SortableMovieCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: movie.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(movie)}
      className={`flex flex-col bg-neutral-900 rounded-2xl overflow-hidden shadow-lg transition cursor-pointer hover:scale-105 touch-none ${
        isDragging ? "opacity-60 z-10" : ""
      }`}
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

        <div className="flex gap-2 mt-2">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();

              const confirmDelete = window.confirm(
                "Are you sure you want to remove this movie?"
              );

              if (confirmDelete) {
                onRemove(movie.id);
              }
            }}
            className="bg-red-600 text-xs px-3 py-1 rounded hover:bg-red-500"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
      featured: false,
    };

    setMovies((prev) => [newMovie, ...prev]);
    setResults([]);
    setQuery("");
  };

  const removeMovie = (id: number) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
    if (selectedMovie?.id === id) {
      setSelectedMovie(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setMovies((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return items;

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const trailerEmbedUrl = useMemo(() => {
    if (!selectedMovie?.trailer) return "";
    return getYouTubeEmbedUrl(selectedMovie.trailer);
  }, [selectedMovie]);

  const featuredMovies = movies.filter((movie) => movie.featured);
  const regularMovies = movies.filter((movie) => !movie.featured);

  return (
    <main className="p-6 bg-neutral-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">🎬 User Movie Search</h1>

      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
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

      {featuredMovies.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">⭐ Featured Movies</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {featuredMovies.map((movie) => (
              <SortableMovieCard
                key={`featured-${movie.id}`}
                movie={movie}
                onOpen={setSelectedMovie}
                onRemove={removeMovie}
              />
            ))}
          </div>
        </section>
      )}

      {regularMovies.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Library</h2>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={regularMovies.map((movie) => movie.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {regularMovies.map((movie) => (
                  <SortableMovieCard
                    key={movie.id}
                    movie={movie}
                    onOpen={setSelectedMovie}
                    onRemove={removeMovie}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>
      )}

      {selectedMovie && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-neutral-900 rounded-xl max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-3 right-3 text-white text-xl"
            >
              ✕
            </button>

            <img
              src={selectedMovie.cover}
              alt={selectedMovie.title}
              className="w-full rounded-lg mb-4"
            />

            <h2 className="text-2xl font-bold mb-2">
              {selectedMovie.title}
            </h2>

            <p className="text-sm text-neutral-400 mb-4">
              {selectedMovie.year} • {selectedMovie.genre}
            </p>

            <p className="text-sm leading-relaxed mb-6">
              {selectedMovie.description}
            </p>

            {trailerEmbedUrl && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Trailer</h3>
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <iframe
                    src={trailerEmbedUrl}
                    title={`${selectedMovie.title} Trailer`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {!trailerEmbedUrl && selectedMovie.trailer && (
              <a
                href={selectedMovie.trailer}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-purple-400 hover:text-purple-300"
              >
                Watch trailer
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
}