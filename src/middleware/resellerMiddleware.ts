import { NextRequest, NextResponse } from 'next/server'
import { readDB } from '@/lib/db'

export async function resellerMiddleware(req: NextRequest) {
  const apiKey = req.headers.get('x-apikey')
  if (!apiKey) {
    return NextResponse.json({ message: 'API key is required' }, { status: 401 })
  }

  const db = await readDB()
  const user = db.users.find((u: any) => u.apikey === apiKey)

  if (!user) {
    return NextResponse.json({ message: 'Invalid API key' }, { status: 403 })
  }

  if (!user.reseller) {
    return NextResponse.json({ message: 'Only resellers can access this resource' }, { status: 403 })
  }

  // Jika lolos semua, kirim balik user-nya ke handler
  return { user }
}
