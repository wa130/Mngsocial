import { NextRequest, NextResponse } from 'next/server'
import { readDB, writeDB } from '@/lib/db'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { username, email, reseller = false } = body

  if (!username || !email) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
  }

  const db = await readDB()
  const exist = db.users.find((u: any) => u.email === email || u.username === username)
  if (exist) {
    return NextResponse.json({ message: 'User already exists' }, { status: 409 })
  }

  const apiKey = 'mng-' + crypto.randomBytes(16).toString('hex')
  const user = {
    reseller: reseller ?? false,
    id: crypto.randomUUID(),
    username,
    email,
    apikey: apiKey,
    admin: false,
    saldo: 0,
    total_order: 0,
    total_deposit: 0,
    ip: req.headers.get('x-forwarded-for') || '',
    location: 'Unknown',
    last_login: new Date().toISOString(),
    register_date: new Date().toISOString()
  }

  db.users.push(user)
  await writeDB(db)
  return NextResponse.json({ message: 'User registered', user }, { status: 201 })
}
