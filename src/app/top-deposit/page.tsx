'use client'
import { TopDepositors } from '@/components/deposit/TopDepositors'

export default function TopDepositPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">?? Top Saldo Deposit Success</h1>
      <TopDepositors />
    </div>
  )
}

