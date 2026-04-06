"use client";

type StarRatingProps = {
  rating: number;
};

export default function StarRating({ rating }: StarRatingProps) {
  const safeRating = Math.max(0, Math.min(10, Number(rating) || 0));
  const stars = Math.round(safeRating / 2); // TMDB 10 -> 5 stars

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-yellow-400 text-lg">
          {i < stars ? "★" : "☆"}
        </span>
      ))}
      <span className="text-sm text-gray-400 ml-1">
        ({safeRating.toFixed(1)})
      </span>
    </div>
  );
}