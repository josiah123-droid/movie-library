import { prisma } from '@/lib/prisma'

export async function GET() {
  const movies = await prisma.movie.findMany()
  return Response.json(movies)
}