'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaCrown, FaMoneyBillWave } from 'react-icons/fa'

export function TopDepositors() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/deposit/top')
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.top_depositors)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Memuat top depositors...</div>
  }

  return (
    <div className="space-y-3">
      {data.length === 0 ? (
        <div className="text-center text-gray-500">Belum ada data top deposit</div>
      ) : (
        data.map((user, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.01 }}
            className="flex items-center bg-white rounded-xl p-3 shadow border-l-4 border-blue-400"
          >
            <img src={user.profile_picture} alt={user.username} className="w-10 h-10 rounded-full mr-4" />
            <div className="flex-grow">
              <div className="text-blue-700 font-semibold">{user.username}</div>
              <div className="text-sm text-gray-500">Rp{user.total_deposit}</div>
            </div>
            <div className="text-yellow-500 text-xl">
              {user.rank === 1 ? <FaCrown /> : <FaMoneyBillWave />}
            </div>
          </motion.div>
        ))
      )}
    </div>
  )
}
