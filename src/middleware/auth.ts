import { readDB } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// Middleware untuk mengecek API Key dan menentukan role
export async function authMiddleware(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key') || req.nextUrl.searchParams.get('apikey')

  if (!apiKey || !apiKey.startsWith('mng-')) {
    return NextResponse.json({ error: 'API Key tidak valid atau tidak ada' }, { status: 401 })
  }

  const db = await readDB()
  const user = db.users.find((u: any) => u.apikey === apiKey)

  if (!user) {
    return NextResponse.json({ error: 'API Key tidak ditemukan' }, { status: 403 })
  }

  // Tambahkan data user ke request context (dipakai di route.ts)
  req.headers.set('x-user-role', user.admin ? 'admin' : 'user')
  req.headers.set('x-user-email', user.email)
  req.headers.set('x-user-id', user.id)

  return null // tidak return response artinya lanjut ke handler API
}
