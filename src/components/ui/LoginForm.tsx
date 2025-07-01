'use client'
import { useState, useEffect } from 'react'
import { FaUser, FaLock } from 'react-icons/fa'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('mng-remember')
    if (saved) {
      const data = JSON.parse(saved)
      setUsername(data.username)
      setPassword(data.password)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const result = await res.json()
      if (!res.ok) {
        setError(result.error || 'Gagal login')
        return
      }
      setSuccess('Login berhasil!')
      if (rememberMe) {
        localStorage.setItem('mng-remember', JSON.stringify({ username, password }))
      } else {
        localStorage.removeItem('mng-remember')
      }
      localStorage.setItem('mng-apikey', result.user.apikey)
      window.location.href = '/dashboard'
    } catch {
      setError('Terjadi kesalahan server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4 p-6 bg-white rounded-2xl shadow-lg max-w-md w-full mx-auto">
      <div className="text-center text-blue-600 text-2xl font-semibold mb-4">Login ke Mngsocial</div>

      <div className="relative">
        <FaUser className="absolute top-3 left-3 text-blue-400" />
        <input
          type="text"
          placeholder="Username"
          className="w-full pl-10 pr-3 py-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>

      <div className="relative">
        <FaLock className="absolute top-3 left-3 text-blue-400" />
        <input
          type="password"
          placeholder="Password"
          className="w-full pl-10 pr-3 py-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
          className="accent-blue-500"
        />
        Ingat saya
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-all"
      >
        {loading ? 'Memuat...' : 'Login'}
      </button>
    </form>
  )
}
