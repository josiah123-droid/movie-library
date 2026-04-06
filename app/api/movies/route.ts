import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: { id: 'desc' },
    })

    return Response.json(movies)
  } catch (error) {
    console.error('GET ERROR:', error)
    return Response.json(
      {
        error: 'Failed to fetch movies',
        details: String(error),
      },
      { status: 500 }
    )
  }
}

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

    return Response.json(movie)
  } catch (error) {
    console.error('POST ERROR:', error)
    return Response.json(
      {
        error: 'Insert failed',
        details: String(error),
      },
      { status: 500 }
    )
  }
}