import { NextRequest, NextResponse } from 'next/server'
import { getAdminByApiKey } from '@/lib/admin'

export async function adminMiddleware(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key') || req.nextUrl.searchParams.get('apikey')

  if (!apiKey || !apiKey.startsWith('mng-admin-')) {
    return NextResponse.json({ error: 'API Key admin tidak valid' }, { status: 401 })
  }

  const admin = await getAdminByApiKey(apiKey)

  if (!admin) {
    return NextResponse.json({ error: 'Admin tidak ditemukan' }, { status: 403 })
  }

  return null // valid, lanjut ke route handler
}
