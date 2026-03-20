'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { CheckCircle, XCircle, Eye } from 'lucide-react'

export default function AdminReviews() {
  const [films, setFilms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => { loadPendingFilms() }, [])

  const loadPendingFilms = async () => {
    const { data } = await supabase
      .from('movies')
      .select('*, users!uploaded_by(name, email)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setFilms(data || [])
    setLoading(false)
  }

  const approveFilm = async (id: string) => {
    await supabase
      .from('movies')
      .update({ 
        status: 'published', 
        is_published: true,
        published_at: new Date().toISOString()
      })
      .eq('id', id)
    setFilms(films.filter(f => f.id !== id))
  }

  const rejectFilm = async (id: string) => {
    const reason = prompt('Rejection reason:')
    if (!reason) return
    await supabase
      .from('movies')
      .update({ 
        status: 'rejected',
        is_published: false,
        rejected_reason: reason
      })
      .eq('id', id)
    setFilms(films.filter(f => f.id !== id))
  }

  if (loading) return <div style={{padding:'2rem',color:'white'}}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', padding: '2rem', color: 'white' }}>
      <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '2rem', color: 'var(--brand-gold)' }}>
        Pending Reviews ({films.length})
      </h1>

      {films.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No pending films to review.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {films.map(film => (
            <div key={film.id} style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--glass-border)',
              borderRadius: 16, padding: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap'
            }}>
              {/* Poster */}
              {film.poster_url && (
                <img src={film.poster_url} alt={film.title}
                  style={{ width: 60, height: 85, objectFit: 'cover', borderRadius: 8 }} />
              )}

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{film.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  By: {film.users?.name || film.users?.email || 'Unknown creator'}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Uploaded: {new Date(film.created_at).toLocaleDateString()}
                </p>
                {film.description && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: 500 }}>
                    {film.description.slice(0, 150)}...
                  </p>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
                <button
                  onClick={() => approveFilm(film.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.6rem 1.2rem', borderRadius: 8, border: 'none',
                    background: 'rgba(34,197,94,0.15)', color: '#4ade80',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
                  }}>
                  <CheckCircle size={15} /> Approve
                </button>
                <button
                  onClick={() => rejectFilm(film.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.6rem 1.2rem', borderRadius: 8, border: 'none',
                    background: 'rgba(239,68,68,0.15)', color: '#f87171',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
                  }}>
                  <XCircle size={15} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}