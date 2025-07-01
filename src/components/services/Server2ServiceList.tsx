'use client'
import { useEffect, useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { motion } from 'framer-motion'

export function Server2ServiceList() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apikey = localStorage.getItem('mng-apikey')
    if (!apikey) return

    fetch('/api/mngsocial/v1/service/server2', {
      headers: {
        'x-api-key': apikey
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setServices(data.services)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">Memuat layanan...</div>
    )
  }

  return (
    <div className="space-y-4">
      {services.length === 0 ? (
        <div className="text-center text-gray-500">Tidak ada layanan tersedia</div>
      ) : (
        services.map((srv, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01 }}
            className="bg-white p-4 rounded-lg shadow border border-blue-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-blue-600 font-bold">{srv.name}</h3>
                <p className="text-sm text-gray-500">{srv.category}</p>
                <p className="text-xs mt-1 text-gray-400">{srv.description}</p>
                <p className="text-sm mt-1">
                  Min: <strong>{srv.min}</strong> | Max: <strong>{srv.max}</strong>
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">Rp{srv.price}</p>
                <button className="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2">
                  <FaShoppingCart />
                  Pesan
                </button>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  )
}
