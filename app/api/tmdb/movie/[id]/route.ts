import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!movieRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: movieRes.status }
    );
  }

  const videoRes = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const movieData = await movieRes.json();
  const videoData = videoRes.ok ? await videoRes.json() : { results: [] };

  const trailer = videoData.results?.find(
    (video: { site?: string; type?: string; key?: string }) =>
      video.site === "YouTube" && video.type === "Trailer"
  );

  return NextResponse.json({
    title: movieData.title,
    year: movieData.release_date ? Number(movieData.release_date.slice(0, 4)) : 0,
    genre: movieData.genres?.[0]?.name ?? "Uncategorized",
    rating: Math.max(1, Math.min(5, Math.round((movieData.vote_average ?? 0) / 2))),
    cover: movieData.poster_path
      ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
      : "https://via.placeholder.com/300x450?text=No+Poster",
    description: movieData.overview ?? "",
    trailer: trailer?.key ? `https://www.youtube.com/embed/${trailer.key}` : "",
  });
}