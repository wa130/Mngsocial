'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUser, FaLock, FaSpinner, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa'
import { RiShieldUserLine } from 'react-icons/ri'
import { useRouter } from 'next/navigation'

interface LoginFormProps {
  onClose: () => void
  onSwitchToRegister: () => void
}

export default function LoginForm({ onClose, onSwitchToRegister }: LoginFormProps) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [botDetected, setBotDetected] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('mng-remember')
    if (saved) {
      const data = JSON.parse(saved)
      setUsername(data.username)
      setPassword(data.password)
      setRememberMe(true)
      if (!autoLoginAttempted) {
        setAutoLoginAttempted(true)
        handleAutoLogin(data.username, data.password)
      }
    }
    const ua = navigator.userAgent.toLowerCase()
    const isBot = ['bot', 'curl', 'wget'].some(x => ua.includes(x))
    if (isBot || navigator.webdriver) setBotDetected(true)
  }, [])

  const handleAutoLogin = async (u: string, p: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
      })
      const result = await res.json()
      if (res.ok) {
        localStorage.setItem('mng-apikey', result.user.apikey)
        router.push('/dashboard')
      }
    } catch { }
    finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (botDetected) return setError('Akses ditolak: deteksi bot.')
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
      if (!res.ok) return setError(result.error || 'Gagal login')
      setSuccess('Login berhasil!')
      rememberMe
        ? localStorage.setItem('mng-remember', JSON.stringify({ username, password }))
        : localStorage.removeItem('mng-remember')
      localStorage.setItem('mng-apikey', result.user.apikey)
      router.push('/dashboard')
    } catch {
      setError('Terjadi kesalahan server')
    } finally {
      setLoading(false)
    }
  }

  if (loading && rememberMe && autoLoginAttempted) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent mb-3" />
          <p className="text-sm text-gray-600">Memuat sesi Anda...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 backdrop-blur-sm z-50 flex items-center justify-center p-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative w-full max-w-xs"
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl">&times;</button>

        <motion.div className="absolute -top-20 -left-20 w-32 h-32 rounded-full bg-blue-200 opacity-20 blur-xl"
          animate={{ scale: [1, 1.1, 1], x: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute -bottom-20 -right-20 w-32 h-32 rounded-full bg-purple-200 opacity-20 blur-xl"
          animate={{ scale: [1, 1.1, 1], x: [0, -10, 0], y: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-5 w-full relative z-10 border border-white/20 backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.75)' }}
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}
            className="flex justify-center mb-4"
          >
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
              <RiShieldUserLine className="text-white text-lg" />
            </div>
          </motion.div>
          <h2 className="text-2xl text-center font-bold text-gray-800 mb-1">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Mngsocial</span>
          </h2>
          <p className="text-center text-sm text-gray-500 mb-4">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-blue-400 text-xs" />
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white/80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            </div>
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-blue-400 text-xs" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
                className="w-full pl-9 pr-9 py-2 text-sm rounded-lg border border-gray-200 bg-white/80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-3 right-3 text-gray-400 text-xs hover:text-blue-500">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <button type="button" onClick={() => setRememberMe(!rememberMe)} className={`w-4 h-4 rounded border flex items-center justify-center ${rememberMe ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                  {rememberMe && <FaCheck className="text-white text-[10px]" />}
                </button>
                <span className="text-gray-600">Remember me</span>
              </div>
              <a href="#" className="text-xs text-blue-500 hover:underline">Forgot?</a>
            </div>
            <AnimatePresence>
              {(error || success) && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={`rounded p-2 text-xs ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {error || success}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 rounded-lg text-sm shadow hover:shadow-lg flex items-center justify-center"
            >
              {loading && <FaSpinner className="animate-spin mr-2 text-xs" />}
              {loading ? 'Memuat...' : 'Login'}
            </motion.button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500">
            Belum punya akun?{' '}
            <button onClick={onSwitchToRegister} className="text-blue-500 hover:underline">
              Daftar
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
