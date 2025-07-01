'use client'
import { useEffect, useState } from 'react'

interface Metode {
  metode: string
  type: string
  name: string
  min: string
  max: string
  fee: string
  fee_persen: string
  img_url: string
}

export default function MetodeList({ onSelect }: { onSelect: (metode: Metode) => void }) {
  const [metodes, setMetodes] = useState<Metode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/deposit/metode')
      .then(res => res.json())
      .then(data => {
        setMetodes(data.metode || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-blue-500">Memuat metode deposit...</p>

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {metodes.map((m, i) => (
        <button
          key={i}
          onClick={() => onSelect(m)}
          className="flex items-center gap-3 bg-white rounded-xl p-4 shadow hover:shadow-lg transition-all border border-blue-100 hover:bg-blue-50"
        >
          <img src={m.img_url} alt={m.name} className="w-10 h-10 object-contain" />
          <div className="text-left">
            <div className="font-bold text-blue-600">{m.name}</div>
            <div className="text-xs text-gray-500">Min: {m.min} | Fee: {m.fee || '0'} + {m.fee_persen}%</div>
          </div>
        </button>
      ))}
    </div>
  )
}
