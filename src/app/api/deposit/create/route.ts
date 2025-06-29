import { NextRequest, NextResponse } from 'next/server'
import { readDB, writeDB } from '@/lib/db'
import fs from 'fs/promises'
import path from 'path'

const V_PEDIA_APIKEY = 'V-Pedia-2ea9jdshix8rnmzs'
const DEPOSIT_PATH = path.join(process.cwd(), 'data', 'deposits.json')

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey || !apiKey.startsWith('mng-')) {
    return NextResponse.json({ error: 'API Key tidak valid' }, { status: 401 })
  }
  const db = await readDB()
  const user = db.users.find((u: any) => u.apikey === apiKey)
  if (!user) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 403 })

  const { nominal, metode } = await req.json()
  if (!nominal || !metode) return NextResponse.json({ error: 'Nominal dan metode harus diisi' }, { status: 400 })

  const reff_id = `TRX-${Date.now()}`
  // Fee 2% dari admin
  const fee = Math.round(nominal * 0.02)
  const get_balance = nominal - fee

  // Request create deposit ke V-Pedia via GET
  const url = `https://v-pedia.web.id/h2h/deposit/create?nominal=${nominal}&metode=${metode}`
  const vpediaRes = await fetch(url, {
    method: 'GET',
    headers: {
      'X-APIKEY': V_PEDIA_APIKEY
    }
  })
  const result = await vpediaRes.json()
  if (!result.success) return NextResponse.json({ error: 'Gagal membuat deposit' }, { status: 500 })

  const data = result.data

  // Simpan data deposit baru di deposits.json
  let deposits = []
  try {
    const old = await fs.readFile(DEPOSIT_PATH, 'utf-8')
    deposits = JSON.parse(old)
  } catch {}

  const deposit = {
    id: data.id,
    user_id: user.id,
    username: user.username,
    apikey: user.apikey,
    nominal,
    fee,
    get_balance,
    method: metode,
    qr_image: data.qr_image,
    qr_string: data.qr_string,
    status: 'pending',
    created_at: data.created_at,
    expired_at: data.expired_at
  }
  deposits.push(deposit)
  await fs.writeFile(DEPOSIT_PATH, JSON.stringify(deposits, null, 2), 'utf-8')

  return NextResponse.json({ message: 'Deposit berhasil dibuat', deposit })
}
