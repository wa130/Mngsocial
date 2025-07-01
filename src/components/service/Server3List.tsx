'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FaSpinner } from 'react-icons/fa'

interface Service {
  sid: string | number
  name: string
  category: string
  price: number
  min: number
  max: number
  note: string
  server: string
}

export default function Server3List() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/mngsocial/v1/service/server3', {
          headers: {
            'x-api-key': localStorage.getItem('apiKey') || ''
          }
        })
        const data = await res.json()
        if (data.success) setServices(data.services)
      } catch (err) {
        console.error('Gagal mengambil layanan:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-10">
        <FaSpinner className="animate-spin inline mr-2" />
        Memuat layanan...
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {services.map((service) => (
        <Card key={service.sid} className="shadow-xl border rounded-2xl">
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-bold">{service.name}</h2>
            <p className="text-sm text-gray-600">{service.category}</p>
            <p className="text-sm text-gray-500">{service.note}</p>
            <div className="text-sm">
              <p>Harga: Rp {service.price.toLocaleString()}</p>
              <p>Min: {service.min} | Max: {service.max}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
