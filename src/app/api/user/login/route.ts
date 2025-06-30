import { NextResponse } from 'next/server'
import { readDB, writeDB } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  if (!username || !password) {
    return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
  }

  const forwarded = req.headers.get('x-forwarded-for')
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : 'Unknown'

  const db = await readDB()
  const userIndex = db.users.findIndex(
    (u: any) => u.username === username && u.password === password
  )

  if (userIndex === -1) {
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
  }

  db.users[userIndex].last_login = new Date().toISOString()
  db.users[userIndex].ip = ip
  db.users[userIndex].location = 'Unknown'

  await writeDB(db)

  const user = db.users[userIndex]
  return NextResponse.json({ message: 'Login berhasil', user })
}
