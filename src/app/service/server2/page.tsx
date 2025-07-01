'use client'
import { Server2ServiceList } from '@/components/services/Server2ServiceList'

export default function Server2ServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">?? Layanan Server 2</h1>
      <Server2ServiceList />
    </div>
  )
}
