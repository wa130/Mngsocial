'use client'
import { Server1ServiceList } from '@/components/service/Server1ServiceList'

export default function Server1ServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">📦 Layanan Server 1</h1>
      <Server1ServiceList />
    </div>
  )
}
