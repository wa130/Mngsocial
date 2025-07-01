'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const apikey = localStorage.getItem('mng-apikey')
    if (!apikey) {
      router.push('/')
      return
    }

    fetch(`/api/user/profile/info?apikey=${apikey}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          localStorage.clear()
          router.push('/')
        } else {
          setUser(data)
        }
      })
      .catch(() => {
        localStorage.clear()
        router.push('/')
      })
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
  }

  if (!user) return <div className="p-4 text-center">Memuat data...</div>

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">👤 Profil Pengguna</h1>
      <div className="border rounded-lg p-4 space-y-2 bg-white shadow">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Saldo:</strong> Rp{user.saldo}</p>
        <p><strong>Reseller:</strong> {user.reseller ? 'Ya' : 'Tidak'}</p>
        <p><strong>Admin:</strong> {user.admin ? 'Ya' : 'Tidak'}</p>
        <p><strong>Lokasi:</strong> {user.location}</p>
        <p><strong>IP:</strong> {user.ip}</p>
        <p><strong>Terdaftar:</strong> {new Date(user.register_date).toLocaleString()}</p>
        <p><strong>Login Terakhir:</strong> {new Date(user.last_login).toLocaleString()}</p>
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  )
}
