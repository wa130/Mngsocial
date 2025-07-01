'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaClock, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa'

export function DepositHistory() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apikey = localStorage.getItem('mng-apikey')
    if (!apikey) return

    fetch('/api/user/deposit/history', {
      headers: { 'x-api-key': apikey }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.deposits)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="text-center text-blue-600 py-10">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
        Memuat riwayat deposit...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="text-center text-sm text-gray-500">Belum ada riwayat deposit</div>
      ) : (
        data.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01 }}
            className={`rounded-xl p-4 shadow bg-white border-l-4 ${item.status === 'success'
              ? 'border-green-400'
              : item.status === 'pending'
                ? 'border-yellow-400'
                : 'border-red-400'
              }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-semibold text-blue-600">{item.method}</div>
                <div className="text-sm text-gray-500">{item.created_at}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">Rp{item.nominal.toLocaleString()}</div>
                <div className={`text-xs ${item.status === 'success'
                  ? 'text-green-600'
                  : item.status === 'pending'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                  }`}>
                  {item.status === 'success' ? (
                    <span className="flex items-center gap-1"><FaCheckCircle /> Berhasil</span>
                  ) : item.status === 'pending' ? (
                    <span className="flex items-center gap-1"><FaClock /> Menunggu</span>
                  ) : (
                    <span className="flex items-center gap-1"><FaTimesCircle /> Dibatalkan</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tampilkan info tambahan jika masih pending */}
            {item.status === 'pending' && (
              <div className="mt-3 border-t pt-3 text-sm text-gray-600 space-y-2">
                <p><strong>Kode QR:</strong></p>
                <img src={item.qr_image} alt="QR" className="w-28 h-28 rounded-lg border" />
                <p><strong>String QR:</strong> <span className="break-all">{item.qr_string}</span></p>
                <p><strong>Kadaluarsa:</strong> {item.expired_at}</p>
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  )
}
