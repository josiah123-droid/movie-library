import { Star } from "lucide-react";

type Props = {
  rating: number;
};

export default function StarRating({ rating }: Props) {
  return (
    <div className="flex gap-1 mt-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-600"
          }`}
        />
      ))}
    </div>
  );
}