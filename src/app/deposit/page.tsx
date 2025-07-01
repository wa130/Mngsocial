'use client'
import { useState } from 'react'
import MetodeList from '@/components/deposit/MetodeList'
import { DepositForm } from '@/components/deposit/DepositForm'
import { DepositResult } from '@/components/deposit/DepositResult'

// Tambahkan ini ??
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

export default function DepositPage() {
  const [selectedMetode, setSelectedMetode] = useState<Metode | null>(null)
  const [result, setResult] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      {!selectedMetode && !result && (
        <MetodeList onSelect={(m) => setSelectedMetode(m)} />
      )}
      {selectedMetode && !result && (
        <DepositForm metode={selectedMetode} onResult={setResult} onBack={() => setSelectedMetode(null)} />
      )}
      {result && (
        <DepositResult
          data={result}
          onBack={() => {
            setResult(null)
            setSelectedMetode(null)
          }}
        />
      )}
    </div>
  )
}
