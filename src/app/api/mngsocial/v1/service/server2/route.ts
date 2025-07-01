import { NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/middleware/withUser'
import qs from 'querystring'

function cleanText(text: string): string {
  return String(text || '')
    .replace(/<[^>]*>/g, '') // hapus tag HTML seperti <br>, <p>
    .replace(/\\r|\\n|\r|\n|\t/g, ' ') // escape dan new line
    .replace(/\s+/g, ' ') // whitespace ganda
    .trim()
}

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key') || ''
  const userInfo = await withUser(apiKey)

  if ('error' in userInfo) {
    return NextResponse.json({ error: userInfo.error }, { status: 401 })
  }

  const { margin } = userInfo

  try {
    const body = qs.stringify({
      api_key: 'hmLc1pMPCqZlQd5WRVIs',
      action: 'layanan'
    })

    const response = await fetch('https://duniasosmed.com/api/sosial-media/layanan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    })

    const json = await response.json()

    if (!json.result || !Array.isArray(json.result)) {
      console.error('[Server2] Invalid API response:', JSON.stringify(json).slice(0, 500))
      return NextResponse.json({ error: 'Gagal memuat layanan dari Server 2' }, { status: 500 })
    }

    const services = []

    for (const item of json.result) {
      try {
        services.push({
          sid: item.sid,
          name: item.layanan,
          category: item.kategori,
          price: Math.ceil(Number(item.harga) + (Number(item.harga) * margin) / 100),
          min: item.min,
          max: item.max,
          note: cleanText(item.catatan),
          server: 'server2'
        })
      } catch (err) {
        console.warn('[Server2] Gagal parsing item:', item.sid, err)
      }
    }

    return NextResponse.json({
      success: true,
      count: services.length,
      services
    })
  } catch (err: any) {
    console.error('[Server2] ERROR:', err.message)
    return NextResponse.json({ error: 'Gagal memuat layanan dari Server 2' }, { status: 500 })
  }
}
