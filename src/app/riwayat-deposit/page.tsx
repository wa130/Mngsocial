'use client'
import { DepositHistory } from '@/components/deposit/DepositHistory'

export default function RiwayatDepositPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Riwayat Deposit</h1>
      <DepositHistory />
    </div>
  )
}
