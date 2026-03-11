import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to search TMDB" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}