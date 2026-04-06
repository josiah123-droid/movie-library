'use client'

import { useState } from 'react'

type TMDBMovie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
}

export default function AddToLibraryButton({
  movie,
}: {
  movie: TMDBMovie
}) {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleAdd() {
    if (loading || saved) return

    setLoading(true)

    try {
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: Number(movie.id),
          title: movie.title ?? '',
          overview: movie.overview ?? '',
          posterPath: movie.poster_path ?? '',
          releaseDate: movie.release_date ?? '',
          rating: Number(movie.vote_average) ?? 0,
        }),
      })

      const data = await res.json().catch(() => null)

      // ❌ HANDLE SERVER ERROR CLEANLY
      if (!res.ok) {
        console.error('SERVER ERROR:', data)
        alert(data?.error || 'Failed to save movie')
        return
      }

      // ✅ SUCCESS
      if (data?.success) {
        setSaved(true)

        // small delay for UX
        setTimeout(() => {
          window.location.reload()
        }, 300)
      } else {
        alert('Failed to save movie')
      }
    } catch (err) {
      console.error('CLIENT ERROR:', err)
      alert('Something went wrong. Check console.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading || saved}
      className="mt-2 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Saving...' : saved ? 'Saved' : 'Add to Library'}
    </button>
  )
}