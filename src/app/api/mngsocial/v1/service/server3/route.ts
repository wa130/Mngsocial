import { NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/middleware/withUser'
import qs from 'querystring'

function cleanText(text: string): string {
  return String(text || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\\r|\\n|\r|\n|\t/g, ' ')
    .replace(/\s+/g, ' ')
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
      api_key: 'fCX6vmrAI3QNGzygostpaVdlTbe48E',
      action: 'services'
    })

    const response = await fetch('https://bomgram.com/api/json.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    })

    const json = await response.json()

    if (!json.status || !Array.isArray(json.data)) {
      console.error('[Server3] Invalid API response:', JSON.stringify(json).slice(0, 500))
      return NextResponse.json({ error: 'Gagal memuat layanan dari Server 3' }, { status: 500 })
    }

    const services = json.data.map((item: any) => ({
      sid: item.id,
      name: item.name,
      category: item.category,
      price: Math.ceil(Number(item.price) + (Number(item.price) * margin) / 100),
      min: item.min,
      max: item.max,
      note: cleanText(item.note),
      server: 'server3'
    }))

    return NextResponse.json({
      success: true,
      count: services.length,
      services
    })
  } catch (err: any) {
    console.error('[Server3] ERROR:', err.message)
    return NextResponse.json({ error: 'Gagal memuat layanan dari Server 3' }, { status: 500 })
  }
}
