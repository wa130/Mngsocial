import { NextRequest, NextResponse } from 'next/server'
import { readDB } from '@/lib/db'

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

  const {
    id,
    username,
    email,
    reseller,
    isSeller,
    admin,
    isBlocked,
    saldo,

    total_order,
    total_bayar_order,
    total_deposit,

    total_deposit_bulan_ini,
    total_order_bulan_ini,
    total_bayar_bulan_ini,

    total_deposit_tahun_ini,
    total_order_tahun_ini,
    total_bayar_tahun_ini,

    ip,
    location,
    profile_picture,

    last_login,
    register_date
  } = user

  return NextResponse.json({
    id,
    username,
    email,
    reseller,
    isSeller,
    admin,
    isBlocked,
    saldo,

    total_order,
    total_bayar_order,
    total_deposit,

    total_deposit_bulan_ini,
    total_order_bulan_ini,
    total_bayar_bulan_ini,

    total_deposit_tahun_ini,
    total_order_tahun_ini,
    total_bayar_tahun_ini,

    ip,
    location,
    profile_picture,

    last_login,
    register_date
  })
}
