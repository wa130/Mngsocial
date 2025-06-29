import { NextRequest, NextResponse } from 'next/server'
import { adminMiddleware } from '@/middleware/adminMiddleware'
import { readDB } from '@/lib/db'

export async function GET(req: NextRequest) {
  const isAdmin = await adminMiddleware(req)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = await readDB()
  const users = db.users.map((user: any) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    saldo: user.saldo,
    reseller: user.reseller,
    admin: user.admin,
    total_order: user.total_order,
    total_deposit: user.total_deposit,
    register_date: user.register_date,
    last_login: user.last_login,
    ip: user.ip,
    location: user.location,
  }))

  return NextResponse.json({ success: true, users })
}
