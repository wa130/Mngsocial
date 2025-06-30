import { NextRequest, NextResponse } from 'next/server'
import { readDB, writeDB } from '@/lib/db'
import crypto from 'crypto'
import { adminMiddleware } from '@/middleware/adminMiddleware'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { username, email, password, reseller } = body

  if (!username || !email || !password) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
  }

  const db = await readDB()
  const exist = db.users.find((u: any) => u.email === email || u.username === username)
  if (exist) {
    return NextResponse.json({ message: 'User already exists' }, { status: 409 })
  }

  // ⛔ Cegah daftar reseller langsung, harus admin
  let isReseller = false
  if (reseller === true) {
    const auth = await adminMiddleware(req)
    if (!auth || 'message' in auth) {
      return NextResponse.json({ message: 'Only admin can assign reseller role' }, { status: 403 })
    }
    isReseller = true
  }

  const apiKey = 'mng-' + crypto.randomBytes(16).toString('hex')
  const now = new Date()

  const user = {
    // Role
    reseller: isReseller,
    isSeller: false,
    admin: false,
    isBlocked: false,

    // Identitas
    id: crypto.randomBytes(8).toString('hex'),
    username,
    email,
    password,
    apikey: apiKey,

    // Info Tambahan
    ip: req.headers.get('x-forwarded-for') || '',
    location: 'Indonesia',
    profile_picture: 'https://mngsocial.vercel.app/assets/img/default-profile.png',

    // Saldo
    saldo: 0,

    // Statistik order & deposit - nanti diisi saat transaksi nyata
    total_order: 0, // total jumlah order semua waktu
    total_bayar_order: 0, // total bayar order semua waktu (Rp)
    total_deposit: 0, // total deposit semua waktu (Rp)

    total_deposit_bulan_ini: 0,
    total_order_bulan_ini: 0,
    total_bayar_bulan_ini: 0,

    total_deposit_tahun_ini: 0,
    total_order_tahun_ini: 0,
    total_bayar_tahun_ini: 0,

    register_date: now.toISOString(),
    last_login: now.toISOString()
  }

  db.users.push(user)
  await writeDB(db)

  return NextResponse.json({ message: 'User registered', user }, { status: 201 })
}
