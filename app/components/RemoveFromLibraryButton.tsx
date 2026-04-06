"use client";

import { useState } from "react";

type Props = {
  id: string;
};

export default function RemoveFromLibraryButton({ id }: Props) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);
      console.log("DELETE STATUS:", res.status);
      console.log("DELETE DATA:", data);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to remove movie");
      }

      window.location.reload();
    } catch (error) {
      console.error("REMOVE ERROR:", error);
      alert("Failed to remove movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "Removing..." : "Remove"}
    </button>
  );
}