import { NextResponse } from 'next/server'
import { readDB } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key') || req.nextUrl.searchParams.get('apikey')

  if (!apiKey || !apiKey.startsWith('mng-')) {
    return NextResponse.json({ error: 'API Key tidak valid atau tidak ada' }, { status: 401 })
  }

  const db = await readDB()
  const user = db.users.find((u: any) => u.apikey === apiKey)

  if (!user) {
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 403 })
  }

  const { id, username, email, reseller, admin, saldo, total_order, total_deposit, ip, location, last_login, register_date } = user

  return NextResponse.json({
    id,
    username,
    email,
    reseller,
    admin,
    saldo,
    total_order,
    total_deposit,
    ip,
    location,
    last_login,
    register_date
  })
}
