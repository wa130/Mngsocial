'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
        setLoading(false)
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-20 p-8 bg-blue-50 rounded-2xl shadow-lg"
    >
      <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">Login ke Mngsocial</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="relative">
          <FaUser className="absolute top-3 left-3 text-blue-400" />
          <input
            type="text"
            placeholder="Username"
            className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-blue-400" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="accent-blue-500"
          />
          <span className="text-sm text-gray-700">Ingat saya</span>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-all duration-200"
        >
          {loading ? 'Memuat...' : 'Login'}
        </button>
      </form>
    </motion.div>
  )
}
