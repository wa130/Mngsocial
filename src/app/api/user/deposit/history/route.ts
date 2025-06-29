import { NextRequest, NextResponse } from 'next/server'
import { readDB } from '@/lib/db'
import fs from 'fs/promises'
import path from 'path'

const DEPOSIT_PATH = path.join(process.cwd(), 'data', 'deposits.json')

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey || !apiKey.startsWith('mng-')) {
    return NextResponse.json({ error: 'API Key tidak valid' }, { status: 401 })
  }

  const db = await readDB()
  const user = db.users.find((u: any) => u.apikey === apiKey)
  if (!user) {
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 403 })
  }

  let deposits = []
  try {
    const raw = await fs.readFile(DEPOSIT_PATH, 'utf-8')
    deposits = JSON.parse(raw)
  } catch {}

  const userDeposits = deposits.filter((d: any) => d.user_id === user.id)
  return NextResponse.json({ success: true, deposits: userDeposits })
}
