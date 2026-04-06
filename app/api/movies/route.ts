import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const movie = await prisma.movie.create({
      data: {
        tmdbId: Number(body.tmdbId),
        title: body.title ?? '',
        overview: body.overview ?? '',
        posterPath: body.posterPath ?? '',
        releaseDate: body.releaseDate ?? '',
        rating: Number(body.rating ?? 0),
      },
    })

    return new Response(JSON.stringify(movie), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('POST ERROR:', error)

    return new Response(
      JSON.stringify({ error: 'Insert failed' }),
      { status: 500 }
    )
  }
}