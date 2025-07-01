'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa'

export function DepositForm({ metode, onResult, onBack }: { metode: any; onResult: (res: any) => void; onBack: () => void }) {
  const [nominal, setNominal] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const apikey = localStorage.getItem('mng-apikey')
    if (!apikey) return setError('Tidak ada API Key')

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/user/deposit/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apikey
        },
        body: JSON.stringify({
          nominal: parseInt(nominal),
          metode: metode.metode
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal')
      onResult(data.deposit)
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
    }
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-4 border border-blue-100"
    >
      <button onClick={onBack} className="text-blue-600 flex items-center text-sm">
        <FaArrowLeft className="mr-2" /> Kembali pilih metode
      </button>

      <div className="text-center">
        <img src={metode.img_url} alt={metode.name} className="w-16 h-16 mx-auto mb-2" />
        <h2 className="text-lg font-bold text-blue-700">{metode.name}</h2>
        <p className="text-sm text-gray-500">Minimal: Rp{metode.min} - Maksimal: Rp{metode.max}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="number"
          placeholder="Masukkan nominal"
          value={nominal}
          onChange={e => setNominal(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center">
          {loading ? 'Memproses...' : <><FaPaperPlane className="mr-2" /> Buat Deposit</>}
        </button>
      </form>
    </motion.div>
  )
}
