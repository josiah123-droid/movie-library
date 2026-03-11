import { Star } from "lucide-react";

type Props = {
  rating: number;
  onRate?: (rating: number) => void;
};

export default function StarRating({ rating, onRate }: Props) {
  return (
    <div className="flex gap-1 mt-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;

        return (
          <button
            key={i}
            type="button"
            onClick={() => onRate?.(starValue)}
            className="cursor-pointer"
          >
            <Star
              className={`w-4 h-4 ${
                i < rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-600"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}