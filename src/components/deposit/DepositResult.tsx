'use client'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa'

export function DepositResult({ data, onBack }: { data: any; onBack: () => void }) {
  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md border border-blue-100 text-center">
      <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 text-sm mb-4">
        <FaArrowLeft className="mr-2" /> Kembali ke awal
      </button>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="flex justify-center mb-4"
      >
        <FaCheckCircle className="text-green-500 text-4xl" />
      </motion.div>

      <h2 className="text-xl font-bold text-blue-700 mb-2">Deposit berhasil dibuat!</h2>
      <p className="text-sm text-gray-600 mb-4">Silakan bayar sesuai QR di bawah ini sebelum <b>{data.expired_at}</b></p>

      <img src={data.qr_image} alt="QR Code" className="mx-auto w-40 h-40 mb-4 rounded-lg border border-gray-200" />

      <textarea
        className="w-full text-xs text-gray-500 border border-gray-300 rounded-md p-2 mb-4"
        rows={3}
        readOnly
        value={data.qr_string}
      />

      <div className="text-sm text-gray-700">
        <p><b>Metode:</b> {data.method}</p>
        <p><b>Nominal:</b> Rp{data.nominal.toLocaleString()}</p>
        <p><b>Fee:</b> Rp{data.fee.toLocaleString()}</p>
        <p><b>Total Bayar:</b> Rp{(data.nominal + data.fee).toLocaleString()}</p>
        <p className="text-xs mt-2 text-gray-500">ID: {data.id}</p>
      </div>
    </div>
  )
}
