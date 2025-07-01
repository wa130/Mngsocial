'use client'
import { useEffect, useState } from 'react'
import { FaBoxOpen } from 'react-icons/fa'
import { motion } from 'framer-motion'

export function Server1ServiceList() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apikey = localStorage.getItem('mng-apikey')
    if (!apikey) return

    fetch('/api/mngsocial/v1/service/server1', {
      headers: {
        'x-api-key': apikey
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setServices(data.services)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="text-center py-10 text-blue-500 font-medium">
        Memuat layanan...
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((srv, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow rounded-xl p-4 border border-blue-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <FaBoxOpen className="text-blue-500" />
            <div className="font-semibold text-blue-700">{srv.name}</div>
          </div>
          <div className="text-sm text-gray-600">{srv.category}</div>
          <div className="text-xs text-gray-400 mb-2">{srv.type.toUpperCase()}</div>
          <div className="text-sm">
            <strong>Harga:</strong> Rp{srv.price.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Min: {srv.min} - Max: {srv.max}</div>
        </motion.div>
      ))}
    </div>
  )
}
