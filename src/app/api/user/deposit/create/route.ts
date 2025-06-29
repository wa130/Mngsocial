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
  if (!user) {
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 403 })
  }

  const { nominal, metode } = await req.json()
  if (!nominal || !metode) {
    return NextResponse.json({ error: 'Nominal dan metode harus diisi' }, { status: 400 })
  }

  // Hitung fee: jika admin 0%, user biasa 2%
  const fee = user.admin ? 0 : Math.round(nominal * 0.02)
  const totalBayar = nominal + fee

  // Buat reff_id unik
  const reff_id = `TRX-${Date.now()}`

  // Request ke V-Pedia buat deposit
  const vpediaRes = await fetch(`https://v-pedia.web.id/h2h/deposit/create?nominal=${totalBayar}&metode=${metode}`, {
    method: 'GET',
    headers: {
      'X-APIKEY': V_PEDIA_APIKEY
    }
  })

  if (!vpediaRes.ok) {
    return NextResponse.json({ error: 'Gagal request ke V-Pedia' }, { status: 500 })
  }

  const result = await vpediaRes.json()
  if (!result.success) {
    return NextResponse.json({ error: 'Gagal membuat deposit' }, { status: 500 })
  }

  const data = result.data
  const get_balance = nominal // saldo masuk sesuai nominal user (bukan total bayar)

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

  // Simpan ke file deposits.json
  let deposits = []
  try {
    const old = await fs.readFile(DEPOSIT_PATH, 'utf-8')
    deposits = JSON.parse(old)
  } catch {}

  deposits.push(deposit)
  await fs.writeFile(DEPOSIT_PATH, JSON.stringify(deposits, null, 2), 'utf-8')

  // Mulai pengecekan status deposit otomatis
  cekStatusDeposit(deposit.id, user.apikey, user.id)

  return NextResponse.json({ message: 'Deposit berhasil dibuat', deposit })
}

// Fungsi cek status deposit otomatis dan update saldo user
async function cekStatusDeposit(depositId: string, userApiKey: string, userId: string) {
  const DEPOSIT_PATH = path.join(process.cwd(), 'data', 'deposits.json')
  const interval = setInterval(async () => {
    try {
      const res = await fetch(`https://v-pedia.web.id/h2h/deposit/status?id=${depositId}`, {
        headers: { 'X-APIKEY': V_PEDIA_APIKEY }
      })
      const json = await res.json()

      if (json.success) {
        const status = json.data.status

        if (status === 'success') {
          // Update deposit status & tambah saldo user
          let deposits = []
          try {
            const old = await fs.readFile(DEPOSIT_PATH, 'utf-8')
            deposits = JSON.parse(old)
          } catch {}

          deposits = deposits.map((d: any) => {
            if (d.id === depositId) {
              d.status = 'success'
            }
            return d
          })

          await fs.writeFile(DEPOSIT_PATH, JSON.stringify(deposits, null, 2), 'utf-8')

          // Update saldo user di db
          const db = await readDB()
          db.users = db.users.map((u: any) => {
            if (u.id === userId) {
              u.saldo += json.data.get_balance || 0
              u.total_deposit = (u.total_deposit || 0) + json.data.get_balance || 0
            }
            return u
          })
          await writeDB(db)
          clearInterval(interval)
        } else if (status === 'pending') {
          // Cek waktu, cancel kalau lebih dari 5 menit
          const createdAt = new Date(json.data.created_at)
          const now = new Date()
          const diffMinutes = (now.getTime() - createdAt.getTime()) / 60000

          if (diffMinutes > 5) {
            // Cancel deposit
            await fetch(`https://v-pedia.web.id/h2h/deposit/cancel?id=${depositId}`, {
              headers: { 'X-APIKEY': V_PEDIA_APIKEY }
            })
            // Update deposit status di file
            let deposits = []
            try {
              const old = await fs.readFile(DEPOSIT_PATH, 'utf-8')
              deposits = JSON.parse(old)
            } catch {}

            deposits = deposits.map((d: any) => {
              if (d.id === depositId) {
                d.status = 'cancel'
              }
              return d
            })

            await fs.writeFile(DEPOSIT_PATH, JSON.stringify(deposits, null, 2), 'utf-8')
            clearInterval(interval)
          }
        } else if (status === 'cancel') {
          clearInterval(interval)
        }
      }
    } catch (error) {
      clearInterval(interval)
    }
  }, 15000) // cek tiap 15 detik
}
