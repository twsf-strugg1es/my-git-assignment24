import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  Heart,
  Mail,
  MapPin,
  Phone,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { useFavoritesStore } from './store/favoritesStore'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const favorites = useFavoritesStore((state) => state.favorites)
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!response.ok) throw new Error('Unable to load users')
        setUsers(await response.json())
      } catch {
        setError('Something went wrong while loading the directory.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const visibleUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      const matchesFavorite =
        !showFavoritesOnly || favorites.some((favorite) => favorite.id === user.id)
      return matchesSearch && matchesFavorite
    })
  }, [favorites, searchTerm, showFavoritesOnly, users])

  const isFavorite = (userId) => favorites.some((favorite) => favorite.id === userId)

  return (
    <div className="app-shell">
      <header className="navbar">
        <a className="brand" href="/" aria-label="People directory home">
          <span className="brand-mark"><Sparkles size={16} /></span>
          <span>People<span className="brand-dot">.</span></span>
        </a>
        <div className="nav-meta">
          <span><Users size={15} /> {users.length || '—'} total users</span>
          <span className="favorite-count"><Heart size={15} fill="currentColor" /> {favorites.length} saved</span>
        </div>
      </header>

      <main>
        <section className="intro-section">
          <div className="eyebrow"><span className="eyebrow-line" /> PEOPLE DIRECTORY</div>
          <div className="intro-grid">
            <h1>Find your<br /><em>people.</em></h1>
            <div className="intro-copy">
              <p>A considered little directory for keeping track of the people who make things happen.</p>
              <div className="intro-note"><span>{users.length || '—'}</span> profiles in the public directory</div>
            </div>
          </div>
        </section>

        <section className="toolbar" aria-label="Directory filters">
          <label className="search-box">
            <Search size={18} />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by name or email" />
          </label>
          <div className="filter-tabs" role="group" aria-label="Show users">
            <button type="button" className={!showFavoritesOnly ? 'active' : ''} onClick={() => setShowFavoritesOnly(false)}>All people</button>
            <button type="button" className={showFavoritesOnly ? 'active' : ''} onClick={() => setShowFavoritesOnly(true)}><Heart size={15} /> Saved <span>{favorites.length}</span></button>
          </div>
        </section>

        {loading && <div className="status-panel"><div className="loader" /> Gathering the directory...</div>}
        {error && <div className="status-panel error-panel"><p>{error}</p><button type="button" onClick={() => window.location.reload()}>Try again</button></div>}
        {!loading && !error && (
          <section className="user-grid" aria-live="polite">
            {visibleUsers.map((user, index) => (
              <article className="user-card" key={user.id} style={{ '--delay': `${index * 45}ms` }}>
                <div className="card-topline"><span className="user-index">0{user.id}</span><button type="button" className={`favorite-button ${isFavorite(user.id) ? 'is-favorite' : ''}`} onClick={() => toggleFavorite(user)} aria-label={isFavorite(user.id) ? `Remove ${user.name} from favorites` : `Add ${user.name} to favorites`}><Heart size={18} fill={isFavorite(user.id) ? 'currentColor' : 'none'} /></button></div>
                <div className="avatar">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
                <h2>{user.name}</h2>
                <p className="company">{user.company.name}</p>
                <div className="contact-row"><Mail size={14} /> {user.email}</div>
                <div className="card-footer"><span>{user.address.city}</span><button type="button" onClick={() => setSelectedUser(user)}>Details <ArrowUpRight size={16} /></button></div>
              </article>
            ))}
            {visibleUsers.length === 0 && <div className="empty-panel"><h2>No people found</h2><p>Try a different search or switch back to all people.</p></div>}
          </section>
        )}
      </main>

      <footer><span>Built for thoughtful connections</span><span>React · Zustand · JSONPlaceholder</span></footer>

      {selectedUser && <div className="modal-backdrop" role="presentation" onClick={() => setSelectedUser(null)}><section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title" onClick={(event) => event.stopPropagation()}><button type="button" className="close-button" onClick={() => setSelectedUser(null)} aria-label="Close details"><X size={20} /></button><div className="modal-avatar avatar">{selectedUser.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><p className="eyebrow">PROFILE 0{selectedUser.id}</p><h2 id="details-title">{selectedUser.name}</h2><p className="company">{selectedUser.company.name}</p><div className="details-list"><span><Mail size={16} /> {selectedUser.email}</span><span><Phone size={16} /> {selectedUser.phone}</span><span><MapPin size={16} /> {selectedUser.address.street}, {selectedUser.address.city}</span></div><button type="button" className="modal-favorite" onClick={() => toggleFavorite(selectedUser)}><Heart size={16} fill={isFavorite(selectedUser.id) ? 'currentColor' : 'none'} /> {isFavorite(selectedUser.id) ? 'Saved to favorites' : 'Save as favorite'}</button></section></div>}
    </div>
  )
}

export default App
