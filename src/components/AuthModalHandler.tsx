'use client'
import { useEffect, useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function AuthModalHandler() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    const openLogin = () => setShowLogin(true)
    const openRegister = () => setShowRegister(true)
    window.addEventListener('open-login', openLogin)
    window.addEventListener('open-register', openRegister)
    return () => {
      window.removeEventListener('open-login', openLogin)
      window.removeEventListener('open-register', openRegister)
    }
  }, [])

  const closeAll = () => {
    setShowLogin(false)
    setShowRegister(false)
  }

  return (
    <>
      {showLogin && (
        <LoginForm onClose={closeAll} onSwitchToRegister={() => {
          setShowLogin(false)
          setShowRegister(true)
        }} />
      )}
      {showRegister && (
        <RegisterForm onSwitchToLogin={() => {
          setShowRegister(false)
          setShowLogin(true)
        }} />
      )}
    </>
  )
}
