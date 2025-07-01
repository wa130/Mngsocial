'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AuthModalHandler from '@/components/AuthModalHandler'

export default function HomePage() {
  const [isRemembered, setIsRemembered] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('mng-remember')
    if (saved) {
      setIsRemembered(true)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 text-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-gray-800 mb-6"
      >
        Selamat datang di Mngsocial
      </motion.h1>

      {isRemembered ? (
        <motion.a
          href="/dashboard"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow hover:shadow-lg transition-all"
        >
          Masuk ke Dashboard
        </motion.a>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            onClick={() => window.dispatchEvent(new CustomEvent('open-login'))}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-600 transition"
          >
            Login
          </motion.button>
          <motion.button
            onClick={() => window.dispatchEvent(new CustomEvent('open-register'))}
            className="bg-purple-500 text-white px-6 py-3 rounded-xl shadow hover:bg-purple-600 transition"
          >
            Register
          </motion.button>
        </div>
      )}

      <AuthModalHandler />
    </div>
  )
}
