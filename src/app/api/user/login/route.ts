import { NextResponse } from 'next/server'
import { readDB, writeDB } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { username, email } = await req.json()

  if (!username || !email) {
    return NextResponse.json({ error: 'Username dan email wajib diisi' }, { status: 400 })
  }

  const ip = req.headers.get('x-forwarded-for') || req.ip || 'Unknown'
  const db = await readDB()
  const userIndex = db.users.findIndex((u: any) => u.username === username && u.email === email)

  if (userIndex === -1) {
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
  }

  // Update login data
  db.users[userIndex].last_login = new Date().toISOString()
  db.users[userIndex].ip = ip
  db.users[userIndex].location = 'Unknown' // bisa integrasi geoip nanti

  await writeDB(db)

  const user = db.users[userIndex]
  return NextResponse.json({ message: 'Login berhasil', user })
}
