import { NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/middleware/withUser'

const API_ID = 33341
const API_KEY = 'oslzly-rnrlwt-xs4cho-sjg7mo-id8ffy'
const ENDPOINT = 'https://fayupedia.id/api/services'

export async function GET(req: NextRequest) {
  const apikey = req.headers.get('x-api-key') || ''
  const result = await withUser(apikey)

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 401 })
  }

  const { margin } = result

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      api_id: API_ID,
      api_key: API_KEY
    })
  })

  const data = await response.json()

  if (!data.status) {
    return NextResponse.json({ error: 'Gagal mengambil layanan dari server 1' }, { status: 500 })
  }

  const services = data.services.map((s: any) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    type: s.type,
    refill: s.refill,
    description: s.description,
    min: s.min,
    max: s.max,
    base_price: s.price,
    price: s.price + Math.round(s.price * (margin / 100))
  }))

  return NextResponse.json({
    success: true,
    count: services.length,
    services
  })
}
