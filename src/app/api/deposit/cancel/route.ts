import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const V_PEDIA_KEY = 'V-Pedia-2ea9jdshix8rnmzs'
const DEPOSIT_PATH = path.join(process.cwd(), 'data', 'deposits.json')

export async function GET() {
  const now = Date.now()
  const raw = await fs.readFile(DEPOSIT_PATH, 'utf-8')
  const deposits = JSON.parse(raw)

  let updated = false
  for (const d of deposits) {
    if (d.status === 'pending') {
      const created = new Date(d.created_at).getTime()
      if (now - created >= 5 * 60 * 1000) {
        const cancel = await fetch(`https://v-pedia.web.id/h2h/deposit/cancel?id=${d.id}`, {
          headers: { 'X-APIKEY': V_PEDIA_KEY }
        })
        const res = await cancel.json()
        if (res.success) {
          d.status = 'cancel'
          updated = true
        }
      }
    }
  }

  if (updated) {
    await fs.writeFile(DEPOSIT_PATH, JSON.stringify(deposits, null, 2))
  }

  return NextResponse.json({ message: 'Cancel selesai' })
}
