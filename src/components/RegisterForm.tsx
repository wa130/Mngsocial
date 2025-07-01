'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUser, FaLock, FaEnvelope, FaSpinner, FaCheck } from 'react-icons/fa'
import { RiUserAddLine } from 'react-icons/ri'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (password !== confirm) return setError('Konfirmasi password tidak cocok.')

    setLoading(true)
    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })
      const result = await res.json()
      if (!res.ok) return setError(result.error || 'Gagal daftar')
      setSuccess('Berhasil daftar! Silakan login.')
    } catch {
      setError('Terjadi kesalahan server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 backdrop-blur-sm z-50 flex items-center justify-center p-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative w-full max-w-xs"
      >
        {/* Floating background */}
        <motion.div 
          className="absolute -top-20 -left-20 w-32 h-32 rounded-full bg-blue-200 opacity-20 blur-xl"
          animate={{ scale: [1, 1.1, 1], x: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute -bottom-20 -right-20 w-32 h-32 rounded-full bg-purple-200 opacity-20 blur-xl"
          animate={{ scale: [1, 1.1, 1], x: [0, -10, 0], y: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-5 w-full relative z-10 border border-white/20 backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.75)' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="flex justify-center mb-4"
          >
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
              <RiUserAddLine className="text-white text-lg" />
            </div>
          </motion.div>
          <h2 className="text-xl text-center font-bold text-gray-800 mb-1">
            Daftar ke <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Mngsocial</span>
          </h2>
          <p className="text-center text-sm text-gray-500 mb-4">Buat akun gratis</p>

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-blue-400 text-xs" />
              <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white/80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            </div>
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-blue-400 text-xs" />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white/80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            </div>
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-blue-400 text-xs" />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white/80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            </div>
            <div className="relative">
              <FaCheck className="absolute top-3 left-3 text-blue-400 text-xs" />
              <input type="password" placeholder="Konfirmasi Password" value={confirm} onChange={e => setConfirm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white/80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            </div>
            <AnimatePresence>
              {(error || success) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded p-2 text-xs ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                >
                  {error || success}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 rounded-lg text-sm shadow hover:shadow-lg flex items-center justify-center">
              {loading && <FaSpinner className="animate-spin mr-2 text-xs" />}
              {loading ? 'Mendaftar...' : 'Register'}
            </motion.button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500">
            Sudah punya akun?{' '}
            <a href="#" onClick={onSwitchToLogin} className="text-blue-500 hover:underline">Login</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
