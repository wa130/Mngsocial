import { NextRequest, NextResponse } from 'next/server'
import { readDB, writeDB } from '@/lib/db'
import fs from 'fs/promises'
import path from 'path'

const V_PEDIA_APIKEY = 'V-Pedia-2ea9jdshix8rnmzs'
const DEPOSIT_PATH = path.join(process.cwd(), 'data', 'deposits.json')

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  const { id } = await req.json()

  if (!apiKey || !apiKey.startsWith('mng-'))
    return NextResponse.json({ error: 'API Key tidak valid' }, { status: 401 })

  if (!id)
    return NextResponse.json({ error: 'ID deposit harus diisi' }, { status: 400 })

  const db = await readDB()
  const userIndex = db.users.findIndex((u: any) => u.apikey === apiKey)
  if (userIndex === -1)
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 403 })

  let deposits = []
  try {
    const old = await fs.readFile(DEPOSIT_PATH, 'utf-8')
    deposits = JSON.parse(old)
  } catch {}

  const depositIndex = deposits.findIndex((d: any) => d.id === id && d.user_id === db.users[userIndex].id)
  if (depositIndex === -1)
    return NextResponse.json({ error: 'Deposit tidak ditemukan' }, { status: 404 })

  const deposit = deposits[depositIndex]
  if (deposit.status !== 'pending')
    return NextResponse.json({ message: 'Deposit sudah tidak pending' })

  // Cek status ke V-Pedia
  const checkRes = await fetch(`https://v-pedia.web.id/h2h/deposit/status?id=${id}`, {
    headers: { 'X-APIKEY': V_PEDIA_APIKEY }
  })

  const checkJson = await checkRes.json()
  if (!checkJson.success)
    return NextResponse.json({ error: 'Gagal cek status deposit' }, { status: 500 })

  const status = checkJson.data.status.toLowerCase()

  if (status === 'success') {
    deposit.status = 'success'
    db.users[userIndex].saldo += deposit.get_balance
    deposits[depositIndex] = deposit
    await fs.writeFile(DEPOSIT_PATH, JSON.stringify(deposits, null, 2), 'utf-8')
    await writeDB(db)
    return NextResponse.json({ message: 'Deposit sukses dan saldo ditambahkan', deposit })
  }

  const expired = new Date(deposit.expired_at)
  const now = new Date()
  if (now > expired) {
    // cancel
    const cancelRes = await fetch(`https://v-pedia.web.id/h2h/deposit/cancel?id=${id}`, {
      headers: { 'X-APIKEY': V_PEDIA_APIKEY }
    })
    const cancelJson = await cancelRes.json()
    if (!cancelJson.success)
      return NextResponse.json({ error: 'Gagal cancel deposit' }, { status: 500 })

    deposit.status = 'cancel'
    deposits[depositIndex] = deposit
    await fs.writeFile(DEPOSIT_PATH, JSON.stringify(deposits, null, 2), 'utf-8')
    return NextResponse.json({ message: 'Deposit dibatalkan otomatis', deposit })
  }

  return NextResponse.json({ message: 'Deposit masih pending atau belum expired', deposit })
}
