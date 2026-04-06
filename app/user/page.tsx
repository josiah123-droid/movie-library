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
      className="flex flex-col bg-neutral-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 cursor-pointer"
    >
      <img src={movie.cover} className="h-64 w-full object-cover" />

      <div className="p-4 flex flex-col gap-2">
        <h3>{movie.title}</h3>
        <p className="text-sm text-neutral-400">
          {movie.year} • {movie.genre}
        </p>
        <StarRating rating={movie.rating} />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(movie.id);
          }}
          className="bg-red-600 text-xs px-3 py-1 rounded"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function UserPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  // ✅ FETCH FROM DATABASE
  const fetchMoviesFromDB = async () => {
    const res = await fetch("/api/movies");
    const data = await res.json();

const mapped = (Array.isArray(data) ? data : data.movies || []).map((m: any) => ({
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
  };

  useEffect(() => {
    fetchMoviesFromDB();
  }, []);

  // 🔍 SEARCH
  const handleSearch = async () => {
    const res = await fetch(`/api/tmdb/search?query=${query}`);
    const data = await res.json();
    setResults(data.results || []);
  };

  // ✅ ADD TO DATABASE
  const handleAddToLibrary = async (tmdbId: number) => {
    console.log("🔥 ADD CLICKED");

    const res = await fetch(`/api/tmdb/movie/${tmdbId}`);
    const data = await res.json();

    const saveRes = await fetch("/api/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tmdbId: data.id,
        title: data.title,
        overview: data.overview,
        posterPath: data.poster_path,
        releaseDate: data.release_date,
        rating: data.vote_average,
      }),
    });

    console.log("🔥 SAVE STATUS:", saveRes.status);

    const saveData = await saveRes.json();
    console.log("🔥 SAVE DATA:", saveData);

    if (saveData.success) {
      fetchMoviesFromDB();
      setResults([]);
      setQuery("");
    }
  };

  const removeMovie = (id: number) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    setMovies((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <main className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl mb-6">🎬 User Movie Search</h1>

      {/* SEARCH */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 p-2 bg-neutral-900"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-purple-600 px-4">
          Search
        </button>
      </div>

      {/* RESULTS */}
      {results.map((movie) => (
        <div key={movie.id} className="flex gap-2 mb-2">
          <p>{movie.title}</p>
          <button
            onClick={() => handleAddToLibrary(movie.id)}
            className="bg-green-600 px-2"
          >
            Add
          </button>
        </div>
      ))}

      {/* LIBRARY */}
      <h2 className="text-2xl mt-6 mb-4">Library</h2>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={movies.map((m) => m.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {movies.map((movie) => (
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
    </main>
  );
}